// Quick WhatsApp Fix Test
require('dotenv').config();
const twilio = require('twilio');

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

async function testWhatsApp() {
    try {
        const message = await client.messages.create({
            body: '🏥 Healthify WhatsApp Test - Working!',
            from: 'whatsapp:+14155238886',
            to: 'whatsapp:+916005431271' // Replace with your number
        });
        console.log('✅ WhatsApp working:', message.sid);
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

testWhatsApp();