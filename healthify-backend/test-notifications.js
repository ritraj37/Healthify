// Test Twilio Notifications
// Run this after installing twilio: npm install twilio

const { sendWhatsAppMessage, sendSMS, templates } = require('./services/notification');

async function testNotifications() {
    console.log('Testing Twilio Notifications...');
    
    // Test registration notification
    const welcomeMsg = templates.registration('John Doe');
    console.log('Welcome Message:', welcomeMsg);
    
    // Test appointment notification  
    const appointmentMsg = templates.appointmentBooked('John Doe', 'Dr. Smith', '2025-01-20', '10:00 AM');
    console.log('Appointment Message:', appointmentMsg);
    
    // Test SMS (replace with your number)
    // const smsResult = await sendSMS('+1234567890', welcomeMsg);
    // console.log('SMS Result:', smsResult);
    
    // Test WhatsApp (replace with your number)
    // const whatsappResult = await sendWhatsAppMessage('+1234567890', appointmentMsg);
    // console.log('WhatsApp Result:', whatsappResult);
}

testNotifications();