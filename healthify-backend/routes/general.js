const express = require('express');
const pool = require('../database/connection');
const router = express.Router();

// Submit contact form
router.post('/contact', async (req, res) => {
  try {
    const { firstName, lastName, email, phone, subject, message } = req.body;
    
    const result = await pool.query(`
      INSERT INTO contact_messages (first_name, last_name, email, phone, subject, message)
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING *
    `, [firstName, lastName, email, phone, subject, message]);
    
    res.status(201).json({
      message: 'Message sent successfully',
      contactMessage: result.rows[0]
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Save AI chat session
router.post('/ai-chat', async (req, res) => {
  try {
    const { userId, sessionId, message, response, confidence, imageData } = req.body;
    
    const result = await pool.query(`
      INSERT INTO ai_chat_sessions (user_id, session_id, message, response, confidence, image_data)
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING *
    `, [userId, sessionId, message, response, confidence, imageData]);
    
    res.status(201).json({
      message: 'Chat session saved',
      chatSession: result.rows[0]
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get AI chat history
router.get('/ai-chat/:sessionId', async (req, res) => {
  try {
    const sessionId = req.params.sessionId;
    
    const result = await pool.query(`
      SELECT * FROM ai_chat_sessions 
      WHERE session_id = $1 
      ORDER BY created_at ASC
    `, [sessionId]);
    
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;