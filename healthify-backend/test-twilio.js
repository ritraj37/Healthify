// ✅ Load environment variables FIRST
require("dotenv").config();

const twilio = require("twilio");

// ✅ Correct variable names
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const client = twilio(accountSid, authToken);

// Test SMS
async function testSMS() {
    try {
        const message = await client.messages.create({
            body: '🏥 Test message from Healthify! SMS notifications are working.',
            from: process.env.TWILIO_PHONE_NUMBER,
            to: process.env.MY_PHONE_NUMBER
        });
        console.log('✅ SMS sent successfully:', message.sid);
    } catch (error) {
        console.error('❌ SMS Error:', error.message);
    }
}

// Test WhatsApp
async function testWhatsApp() {
    try {
        const message = await client.messages.create({
            body: '🏥 Test WhatsApp message from Healthify!',
            from: 'whatsapp:' + process.env.TWILIO_WHATSAPP_NUMBER,
            to: 'whatsapp:' + process.env.MY_PHONE_NUMBER
        });
        console.log('✅ WhatsApp sent successfully:', message.sid);
    } catch (error) {
        console.error('❌ WhatsApp Error:', error.message);
    }
}

console.log('🧪 Testing Twilio Notifications...');
testSMS();
testWhatsApp();