const express = require('express');
const pool = require('../database/connection');
const { authenticateToken } = require('../middleware/auth');
const { sendWhatsAppMessage, sendSMS, templates } = require('../services/notification');
const router = express.Router();

// Get all doctors
router.get('/doctors', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM doctors ORDER BY name');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Book appointment
router.post('/book', authenticateToken, async (req, res) => {
  try {
    const { doctorId, appointmentDate, appointmentTime, reason } = req.body;
    const userId = req.user.userId;
    
    // Check if slot is available
    const existingAppointment = await pool.query(`
      SELECT * FROM appointments 
      WHERE doctor_id = $1 AND appointment_date = $2 AND appointment_time = $3 AND status != 'cancelled'
    `, [doctorId, appointmentDate, appointmentTime]);
    
    if (existingAppointment.rows.length > 0) {
      return res.status(400).json({ error: 'Time slot not available' });
    }
    
    const result = await pool.query(`
      INSERT INTO appointments (user_id, doctor_id, appointment_date, appointment_time, reason)
      VALUES ($1, $2, $3, $4, $5) RETURNING *
    `, [userId, doctorId, appointmentDate, appointmentTime, reason]);
    
    // Get user and doctor details for notification
    const userResult = await pool.query('SELECT user_id, first_name, last_name, mobile FROM users WHERE id = $1', [userId]);
    const doctorResult = await pool.query('SELECT name, specialization FROM doctors WHERE id = $1', [doctorId]);
    
    if (userResult.rows.length > 0 && doctorResult.rows.length > 0) {
      const user = userResult.rows[0];
      const doctor = doctorResult.rows[0];
      const userName = `${user.first_name} ${user.last_name}`;
      
      // Send appointment confirmation
      const confirmMessage = templates.appointmentBooked(
        userName, 
        user.user_id, 
        doctor.name, 
        doctor.specialization, 
        appointmentDate, 
        appointmentTime, 
        reason
      );
      
      try {
        console.log(`📱 Sending appointment confirmation to: ${user.mobile}`);
        const notificationResult = await sendWhatsAppMessage(user.mobile, confirmMessage);
        console.log('📨 Appointment notification result:', notificationResult);
      } catch (notifyError) {
        console.error('❌ Appointment notification error:', notifyError);
      }
    }
    
    res.status(201).json({
      message: 'Appointment booked successfully',
      appointment: result.rows[0]
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user appointments
router.get('/my-appointments', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    
    const result = await pool.query(`
      SELECT a.*, d.name as doctor_name, d.specialization
      FROM appointments a
      JOIN doctors d ON a.doctor_id = d.id
      WHERE a.user_id = $1
      ORDER BY a.appointment_date DESC, a.appointment_time DESC
    `, [userId]);
    
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Cancel appointment
router.put('/cancel/:id', authenticateToken, async (req, res) => {
  try {
    const appointmentId = req.params.id;
    const userId = req.user.userId;
    
    const result = await pool.query(`
      UPDATE appointments 
      SET status = 'cancelled' 
      WHERE id = $1 AND user_id = $2 
      RETURNING *
    `, [appointmentId, userId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    
    res.json({ message: 'Appointment cancelled successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;