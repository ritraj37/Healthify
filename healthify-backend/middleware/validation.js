// Professional Data Validation and Security Middleware
const rateLimit = require('express-rate-limit');
const validator = require('validator');

// Rate limiting for data collection endpoints
const dataCollectionLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 requests per windowMs
  message: {
    success: false,
    error: 'Too many requests. Please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Professional input validation
const validateContactForm = (req, res, next) => {
  const { name, email, phone, message } = req.body;
  const errors = [];

  // Name validation
  if (!name || name.trim().length < 2 || name.trim().length > 100) {
    errors.push('Name must be between 2-100 characters');
  }

  // Email validation
  if (!email || !validator.isEmail(email)) {
    errors.push('Valid email address is required');
  }

  // Phone validation (optional but if provided, must be valid)
  if (phone && !validator.isMobilePhone(phone, 'any')) {
    errors.push('Invalid phone number format');
  }

  // Message validation
  if (!message || message.trim().length < 10 || message.trim().length > 2000) {
    errors.push('Message must be between 10-2000 characters');
  }

  // Sanitize inputs
  req.body.name = validator.escape(name.trim());
  req.body.email = validator.normalizeEmail(email);
  req.body.phone = phone ? validator.escape(phone.trim()) : null;
  req.body.message = validator.escape(message.trim());

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors
    });
  }

  next();
};

// AI Chat validation
const validateAIChat = (req, res, next) => {
  const { message, response } = req.body;
  const errors = [];

  if (!message || message.trim().length < 1 || message.trim().length > 1000) {
    errors.push('Message must be between 1-1000 characters');
  }

  if (!response || response.trim().length < 1) {
    errors.push('Response is required');
  }

  // Sanitize
  req.body.message = validator.escape(message.trim());
  req.body.response = validator.escape(response.trim());

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors
    });
  }

  next();
};

// Newsletter validation
const validateNewsletter = (req, res, next) => {
  const { email, name } = req.body;
  const errors = [];

  if (!email || !validator.isEmail(email)) {
    errors.push('Valid email address is required');
  }

  if (name && (name.trim().length < 2 || name.trim().length > 100)) {
    errors.push('Name must be between 2-100 characters');
  }

  // Sanitize
  req.body.email = validator.normalizeEmail(email);
  req.body.name = name ? validator.escape(name.trim()) : null;

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors
    });
  }

  next();
};

// Security headers middleware
const securityHeaders = (req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
};

// Request logging middleware
const requestLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const ip = req.ip || req.connection.remoteAddress;
  const userAgent = req.get('User-Agent') || 'Unknown';
  
  console.log(`🔒 [${timestamp}] ${req.method} ${req.path} - IP: ${ip} - UA: ${userAgent.substring(0, 50)}...`);
  
  // Store request metadata for security analysis
  req.metadata = {
    timestamp,
    ip,
    userAgent,
    path: req.path,
    method: req.method
  };
  
  next();
};

module.exports = {
  dataCollectionLimiter,
  validateContactForm,
  validateAIChat,
  validateNewsletter,
  securityHeaders,
  requestLogger
};