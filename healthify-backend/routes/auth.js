const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../database/connection');
const { sendWhatsAppMessage, sendSMS, templates } = require('../services/notification');
const router = express.Router();

// Register user
router.post('/register', async (req, res) => {
  try {
    const { userId, email, password, firstName, lastName, mobile, dateOfBirth, gender, address } = req.body;
    
    // Check if user exists
    const userExists = await pool.query('SELECT * FROM users WHERE user_id = $1 OR email = $2', [userId, email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);
    
    // Insert user
    const result = await pool.query(`
      INSERT INTO users (user_id, email, password_hash, first_name, last_name, mobile, date_of_birth, gender, address)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id, user_id, email, first_name, last_name
    `, [userId, email, passwordHash, firstName, lastName, mobile, dateOfBirth, gender, address]);
    
    const token = jwt.sign({ userId: result.rows[0].id }, process.env.JWT_SECRET || 'healthify_secret', { expiresIn: '24h' });
    
    // Send welcome notification
    const welcomeMessage = templates.registration(`${firstName} ${lastName}`, userId, email, mobile);
    
    // Try WhatsApp first, fallback to SMS
    if (mobile) {
      try {
        console.log(`📱 Sending welcome notification to: ${mobile}`);
        const notificationResult = await sendWhatsAppMessage(mobile, welcomeMessage);
        console.log('📨 Notification result:', notificationResult);
      } catch (notifyError) {
        console.error('❌ Notification error:', notifyError);
      }
    }
    
    res.status(201).json({
      message: 'User registered successfully',
      user: result.rows[0],
      token
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { userId, password, mobile } = req.body;
    
    let user;
    if (userId) {
      user = await pool.query('SELECT * FROM users WHERE user_id = $1', [userId]);
    } else if (mobile) {
      user = await pool.query('SELECT * FROM users WHERE mobile = $1', [mobile]);
    }
    
    if (user.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    
    const validPassword = await bcrypt.compare(password, user.rows[0].password_hash);
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ userId: user.rows[0].id }, process.env.JWT_SECRET || 'healthify_secret', { expiresIn: '24h' });
    
    res.json({
      message: 'Login successful',
      user: {
        id: user.rows[0].id,
        userId: user.rows[0].user_id,
        email: user.rows[0].email,
        firstName: user.rows[0].first_name,
        lastName: user.rows[0].last_name
      },
      token
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Forgot password
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    
    const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (user.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Generate reset token
    const resetToken = jwt.sign({ userId: user.rows[0].id }, process.env.JWT_SECRET || 'healthify_secret', { expiresIn: '1h' });
    const expiresAt = new Date(Date.now() + 3600000); // 1 hour
    
    await pool.query(`
      INSERT INTO password_reset_tokens (user_id, token, expires_at)
      VALUES ($1, $2, $3)
    `, [user.rows[0].id, resetToken, expiresAt]);
    
    res.json({ message: 'Password reset instructions sent to email' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;