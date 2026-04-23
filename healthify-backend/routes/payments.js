const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const pool = require('../database/connection');
const { authenticateToken } = require('../middleware/auth');
const { sendWhatsAppMessage, templates } = require('../services/notification');
const router = express.Router();

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_1234567890',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'your_razorpay_secret'
});

// Create payment order
router.post('/create-order', authenticateToken, async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt, notes } = req.body;
    
    const options = {
      amount: amount, // amount in paise
      currency: currency,
      receipt: receipt,
      notes: notes
    };
    
    const order = await razorpay.orders.create(options);
    
    // Store order in database
    await pool.query(`
      INSERT INTO payment_orders (
        order_id, user_id, amount, currency, receipt, status, notes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
    `, [
      order.id,
      req.user.userId,
      amount,
      currency,
      receipt,
      'created',
      JSON.stringify(notes)
    ]);
    
    console.log(`💳 Payment order created: ${order.id} for user: ${req.user.userId}`);
    
    res.json({
      success: true,
      data: order
    });
    
  } catch (error) {
    console.error('❌ Payment order creation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create payment order'
    });
  }
});

// Verify payment
router.post('/verify', authenticateToken, async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      appointmentData
    } = req.body;
    
    // Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'your_razorpay_secret')
      .update(body.toString())
      .digest('hex');
    
    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        error: 'Invalid payment signature'
      });
    }
    
    // Update payment status in database
    await pool.query(`
      UPDATE payment_orders 
      SET status = 'completed', payment_id = $1, signature = $2, updated_at = CURRENT_TIMESTAMP
      WHERE order_id = $3
    `, [razorpay_payment_id, razorpay_signature, razorpay_order_id]);
    
    // Store payment transaction
    await pool.query(`
      INSERT INTO payment_transactions (
        payment_id, order_id, user_id, amount, status, method, gateway
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
    `, [
      razorpay_payment_id,
      razorpay_order_id,
      req.user.userId,
      appointmentData.amount || 649,
      'success',
      'online',
      'razorpay'
    ]);
    
    console.log(`✅ Payment verified: ${razorpay_payment_id} for user: ${req.user.userId}`);
    
    res.json({
      success: true,
      message: 'Payment verified successfully',
      paymentId: razorpay_payment_id
    });
    
  } catch (error) {
    console.error('❌ Payment verification error:', error);
    res.status(500).json({
      success: false,
      error: 'Payment verification failed'
    });
  }
});

// Book appointment with payment
router.post('/book-with-payment', authenticateToken, async (req, res) => {
  try {
    const {
      doctorId,
      appointmentDate,
      appointmentTime,
      reason,
      paymentId,
      paymentStatus,
      amount
    } = req.body;
    
    const userId = req.user.userId;
    
    // Check if payment is completed
    const paymentCheck = await pool.query(
      'SELECT * FROM payment_transactions WHERE payment_id = $1 AND status = $2',
      [paymentId, 'success']
    );
    
    if (paymentCheck.rows.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Payment not found or incomplete'
      });
    }
    
    // Check slot availability
    const existingAppointment = await pool.query(`
      SELECT * FROM appointments 
      WHERE doctor_id = $1 AND appointment_date = $2 AND appointment_time = $3 AND status != 'cancelled'
    `, [doctorId, appointmentDate, appointmentTime]);
    
    if (existingAppointment.rows.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Time slot not available'
      });
    }
    
    // Book appointment
    const appointmentResult = await pool.query(`
      INSERT INTO appointments (
        user_id, doctor_id, appointment_date, appointment_time, reason, 
        payment_id, payment_status, consultation_fee, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
      RETURNING *
    `, [
      userId, doctorId, appointmentDate, appointmentTime, reason,
      paymentId, paymentStatus, amount, 'confirmed'
    ]);
    
    // Get user and doctor details for notification
    const userResult = await pool.query('SELECT user_id, first_name, last_name, mobile FROM users WHERE id = $1', [userId]);
    const doctorResult = await pool.query('SELECT name, specialization FROM doctors WHERE id = $1', [doctorId]);
    
    if (userResult.rows.length > 0 && doctorResult.rows.length > 0) {
      const user = userResult.rows[0];
      const doctor = doctorResult.rows[0];
      const userName = `${user.first_name} ${user.last_name}`;
      
      // Send payment confirmation + appointment booking message
      const confirmMessage = `✅ *PAYMENT SUCCESSFUL & APPOINTMENT CONFIRMED*

Dear ${userName},

Your payment has been processed successfully and appointment is confirmed.

💳 *Payment Details:*
• Payment ID: ${paymentId}
• Amount Paid: ₹${amount}
• Status: Confirmed

👨⚕️ *Appointment Details:*
• Doctor: ${doctor.name}
• Specialization: ${doctor.specialization}
• Date: ${appointmentDate}
• Time: ${appointmentTime}
• Reason: ${reason}

📍 *Location:*
Healthify Medical Center
123 Health Street, Medical City

⚠️ *Important Notes:*
• Please arrive 15 minutes early
• Bring valid ID and payment receipt
• Video consultation available 15 minutes before appointment

📞 *Contact:*
Support: (555) 123-4567
Emergency: (555) 123-4567

*Healthify - Your Path to Better Health*`;
      
      if (user.mobile) {
        await sendWhatsAppMessage(user.mobile, confirmMessage);
        console.log(`📱 Payment + Appointment confirmation sent to: ${user.mobile}`);
      }
    }
    
    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully with payment',
      appointment: appointmentResult.rows[0]
    });
    
  } catch (error) {
    console.error('❌ Appointment booking with payment error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to book appointment'
    });
  }
});

// Get payment history
router.get('/history', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    
    const payments = await pool.query(`
      SELECT 
        pt.*,
        a.appointment_date,
        a.appointment_time,
        d.name as doctor_name,
        d.specialization
      FROM payment_transactions pt
      LEFT JOIN appointments a ON pt.payment_id = a.payment_id
      LEFT JOIN doctors d ON a.doctor_id = d.id
      WHERE pt.user_id = $1
      ORDER BY pt.created_at DESC
    `, [userId]);
    
    res.json({
      success: true,
      payments: payments.rows
    });
    
  } catch (error) {
    console.error('❌ Payment history error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch payment history'
    });
  }
});

module.exports = router;