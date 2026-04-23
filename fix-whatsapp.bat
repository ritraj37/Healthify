@echo off
echo ========================================
echo    HEALTHIFY - WHATSAPP FIX
echo ========================================
echo.

echo 📱 Fixing WhatsApp Notifications...
echo.

cd healthify-backend

echo 📦 Installing Twilio...
call npm install twilio

echo.
echo 🔧 Testing WhatsApp connection...
node -e "
const twilio = require('twilio');
require('dotenv').config();

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

async function test() {
    try {
        console.log('📱 Testing WhatsApp...');
        const message = await client.messages.create({
            body: '🏥 Healthify WhatsApp Test - Working!',
            from: 'whatsapp:+14155238886',
            to: 'whatsapp:+916005431271'
        });
        console.log('✅ WhatsApp working! Message ID:', message.sid);
    } catch (error) {
        console.log('❌ WhatsApp Error:', error.message);
        console.log('💡 Make sure you joined WhatsApp sandbox:');
        console.log('   Send \"join <keyword>\" to +14155238886');
    }
}
test();
"

echo.
echo 🔄 Starting server with WhatsApp enabled...
start "Healthify Backend" cmd /k "npm start"

echo.
echo ✅ WhatsApp fix applied!
echo.
echo 📋 To enable WhatsApp notifications:
echo 1. Join Twilio WhatsApp sandbox
echo 2. Send "join <keyword>" to +14155238886  
echo 3. Update phone number in test files
echo 4. Register new account to test
echo.
pause