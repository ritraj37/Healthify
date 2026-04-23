const express = require('express');
const pool = require('../database/connection');
const { sendWhatsAppMessage, templates } = require('../services/notification');
const router = express.Router();

// Professional contact form submission with comprehensive logging
router.post('/contact', async (req, res) => {
  try {
    const { name, email, phone, message, subject = 'General Inquiry' } = req.body;
    
    // Input validation
    if (!name || !email || !message) {
      return res.status(400).json({ 
        success: false, 
        error: 'Name, email, and message are required fields' 
      });
    }
    
    // Professional data storage with metadata
    const result = await pool.query(`
      INSERT INTO contact_messages (
        name, email, phone, message, subject, 
        ip_address, user_agent, status, priority
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
      RETURNING id, created_at
    `, [
      name.trim(), 
      email.toLowerCase().trim(), 
      phone?.trim() || null, 
      message.trim(), 
      subject.trim(),
      req.ip || 'unknown',
      req.get('User-Agent') || 'unknown',
      'new',
      message.toLowerCase().includes('emergency') ? 'high' : 'normal'
    ]);
    
    // Professional logging
    console.log(`📧 [CONTACT-${result.rows[0].id}] New inquiry from ${name} (${email}) - Priority: ${message.toLowerCase().includes('emergency') ? 'HIGH' : 'NORMAL'}`);
    
    // Auto-response notification if phone provided
    if (phone && phone.length >= 10) {
      const autoResponse = `🏥 *HEALTHIFY CONTACT CONFIRMATION*\n\nDear ${name},\n\nThank you for contacting Healthify Medical Center. We have received your inquiry and will respond within 24 hours.\n\n📋 *Your Reference ID:* HC-${result.rows[0].id}\n📅 *Submitted:* ${new Date().toLocaleString()}\n\n📞 *For urgent matters:*\nEmergency: (555) 123-4567\nGeneral: info@healthify.com\n\n*Healthify Medical Center*\nYour Path to Better Health`;
      
      try {
        await sendWhatsAppMessage(phone, autoResponse);
        console.log(`📱 [CONTACT-${result.rows[0].id}] Auto-response sent to ${phone}`);
      } catch (notifyError) {
        console.error(`❌ [CONTACT-${result.rows[0].id}] Auto-response failed:`, notifyError.message);
      }
    }
    
    res.status(201).json({
      success: true,
      message: 'Contact inquiry submitted successfully',
      data: {
        referenceId: `HC-${result.rows[0].id}`,
        submittedAt: result.rows[0].created_at,
        responseTime: '24 hours'
      }
    });
    
  } catch (error) {
    console.error('❌ [CONTACT] Database error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error. Please try again later.' 
    });
  }
});

// Professional AI chat session logging with analytics
router.post('/ai-chat', async (req, res) => {
  try {
    const { userId, message, response, sessionId, confidence = 0.95 } = req.body;
    
    // Enhanced AI chat storage with analytics
    const result = await pool.query(`
      INSERT INTO ai_chat_sessions (
        user_id, session_id, message, response, confidence, 
        message_length, response_length, category, sentiment
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
      RETURNING id
    `, [
      userId || null,
      sessionId || `session_${Date.now()}`,
      message.trim(),
      response.trim(),
      confidence,
      message.length,
      response.length,
      categorizeMessage(message),
      analyzeSentiment(message)
    ]);
    
    console.log(`🤖 [AI-CHAT-${result.rows[0].id}] Session logged - User: ${userId || 'Anonymous'}, Category: ${categorizeMessage(message)}`);
    
    res.status(201).json({
      success: true,
      message: 'Chat session logged successfully',
      sessionId: result.rows[0].id
    });
    
  } catch (error) {
    console.error('❌ [AI-CHAT] Logging error:', error);
    res.status(500).json({ success: false, error: 'Logging failed' });
  }
});

// Professional newsletter subscription with verification
router.post('/newsletter', async (req, res) => {
  try {
    const { email, name, source = 'website' } = req.body;
    
    if (!email || !isValidEmail(email)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Valid email address is required' 
      });
    }
    
    // Check existing subscription
    const existing = await pool.query(
      'SELECT id, status FROM newsletter_subscribers WHERE email = $1', 
      [email.toLowerCase().trim()]
    );
    
    if (existing.rows.length > 0) {
      return res.status(409).json({ 
        success: false, 
        error: 'Email already subscribed to newsletter' 
      });
    }
    
    // Professional subscription storage
    const result = await pool.query(`
      INSERT INTO newsletter_subscribers (
        email, name, source, status, verification_token
      ) VALUES ($1, $2, $3, $4, $5) 
      RETURNING id, created_at
    `, [
      email.toLowerCase().trim(),
      name?.trim() || null,
      source,
      'active',
      generateVerificationToken()
    ]);
    
    console.log(`📰 [NEWSLETTER-${result.rows[0].id}] New subscription: ${email} from ${source}`);
    
    res.status(201).json({
      success: true,
      message: 'Successfully subscribed to newsletter',
      data: {
        subscriberId: result.rows[0].id,
        subscribedAt: result.rows[0].created_at
      }
    });
    
  } catch (error) {
    console.error('❌ [NEWSLETTER] Subscription error:', error);
    res.status(500).json({ success: false, error: 'Subscription failed' });
  }
});

// Utility functions for professional data processing
function categorizeMessage(message) {
  const msg = message.toLowerCase();
  if (msg.includes('appointment') || msg.includes('book')) return 'appointment';
  if (msg.includes('symptom') || msg.includes('pain')) return 'medical';
  if (msg.includes('emergency') || msg.includes('urgent')) return 'emergency';
  if (msg.includes('insurance') || msg.includes('cost')) return 'billing';
  return 'general';
}

function analyzeSentiment(message) {
  const msg = message.toLowerCase();
  const positiveWords = ['good', 'great', 'excellent', 'thank', 'happy'];
  const negativeWords = ['bad', 'terrible', 'awful', 'pain', 'emergency'];
  
  const positive = positiveWords.some(word => msg.includes(word));
  const negative = negativeWords.some(word => msg.includes(word));
  
  if (positive && !negative) return 'positive';
  if (negative && !positive) return 'negative';
  return 'neutral';
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function generateVerificationToken() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

module.exports = router;