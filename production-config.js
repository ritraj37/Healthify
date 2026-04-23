// Production Configuration File
// Update these values before deployment

const PRODUCTION_CONFIG = {
    // API Endpoints - UPDATE THESE
    API_BASE_URL: 'https://yourdomain.com/api',  // Replace with your backend URL
    AI_API_URL: 'https://yourdomain.com/ai-api',  // Replace with your AI backend URL
    VIDEO_SERVER_URL: 'https://yourdomain.com:3001',  // Replace with your video server URL
    
    // Payment Gateway - UPDATE THESE
    RAZORPAY_KEY_ID: 'rzp_live_XXXXXXXXXX',  // Replace with live Razorpay key
    RAZORPAY_KEY_SECRET: 'YOUR_SECRET_KEY',  // Keep this secure, use in backend only
    
    // Twilio - UPDATE THESE (Optional)
    TWILIO_ENABLED: true,
    TWILIO_ACCOUNT_SID: 'YOUR_ACCOUNT_SID',
    TWILIO_AUTH_TOKEN: 'YOUR_AUTH_TOKEN',
    TWILIO_WHATSAPP_NUMBER: 'whatsapp:+14155238886',
    
    // Database - UPDATE THESE
    DB_HOST: 'your-database-host.com',
    DB_PORT: 5432,
    DB_NAME: 'healthify_db',
    DB_USER: 'your_db_user',
    DB_PASSWORD: 'your_secure_password',
    
    // Email Configuration - UPDATE THESE
    SMTP_HOST: 'smtp.gmail.com',
    SMTP_PORT: 587,
    SMTP_USER: 'your-email@gmail.com',
    SMTP_PASSWORD: 'your-app-password',
    
    // Domain & URLs
    DOMAIN: 'https://yourdomain.com',
    SITE_NAME: 'Healthify',
    SUPPORT_EMAIL: 'info@healthify.com',
    EMERGENCY_PHONE: '(555) 123-4567',
    
    // Features Toggle
    ENABLE_VIDEO_CALLS: true,
    ENABLE_AI_ASSISTANT: true,
    ENABLE_PAYMENTS: true,
    ENABLE_NOTIFICATIONS: true,
    
    // Security
    JWT_SECRET: 'your-super-secure-jwt-secret-key-change-this',
    SESSION_SECRET: 'your-session-secret-key-change-this',
    ENCRYPTION_KEY: 'your-encryption-key-32-characters',
    
    // Analytics (Optional)
    GOOGLE_ANALYTICS_ID: 'UA-XXXXXXXXX-X',
    FACEBOOK_PIXEL_ID: 'XXXXXXXXXXXXXXXXX',
    
    // Social Media Links
    FACEBOOK_URL: 'https://facebook.com/healthify',
    TWITTER_URL: 'https://twitter.com/healthify',
    INSTAGRAM_URL: 'https://instagram.com/healthify',
    LINKEDIN_URL: 'https://linkedin.com/company/healthify'
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PRODUCTION_CONFIG;
}
