const twilio = require('twilio');

// Twilio configuration
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhone = process.env.TWILIO_PHONE_NUMBER;

const client = twilio(accountSid, authToken);

// Send WhatsApp message
const sendWhatsAppMessage = async (to, message) => {
    try {
        // Auto add +91 if not present
        const formattedNumber = to.startsWith('+') ? to : `+91${to}`;
        console.log(`📱 Sending WhatsApp to: ${formattedNumber}`);
        
        const result = await client.messages.create({
            from: `whatsapp:${twilioPhone}`,
            to: `whatsapp:${formattedNumber}`,
            body: message
        });
        console.log('✅ WhatsApp message sent successfully:', result.sid);
        return { success: true, messageId: result.sid };
    } catch (error) {
        console.error('❌ WhatsApp error:', error.message);
        return { success: false, error: error.message };
    }
};

// Send SMS
const sendSMS = async (to, message) => {
    try {
        // Auto add +91 if not present
        const formattedNumber = to.startsWith('+') ? to : `+91${to}`;
        
        const result = await client.messages.create({
            from: twilioPhone,
            to: formattedNumber,
            body: message
        });
        console.log('SMS sent:', result.sid);
        return { success: true, messageId: result.sid };
    } catch (error) {
        console.error('SMS error:', error);
        return { success: false, error: error.message };
    }
};

// Notification templates
const templates = {
    registration: (name, userId, email, mobile) => `🏥 *HEALTHIFY REGISTRATION SUCCESSFUL*

Dear ${name},

Welcome to Healthify Healthcare! Your account has been created successfully.

📋 *Patient Details:*
• Patient ID: ${userId}
• Name: ${name}
• Email: ${email}
• Mobile: ${mobile}
• Registration Date: ${new Date().toLocaleDateString()}

✅ *Account Benefits:*
• Online appointment booking
• Medical records access
• AI health assistant
• 24/7 emergency support

📞 *Contact Us:*
Emergency: (555) 123-4567
General: info@healthify.com

Thank you for choosing Healthify!

*Healthify Medical Center*
123 Health Street, Medical City`,
    
    appointmentBooked: (name, userId, doctor, specialization, date, time, reason) => `✅ *APPOINTMENT CONFIRMED*

Dear ${name},

Your appointment has been successfully booked.

👤 *Patient Information:*
• Name: ${name}
• Patient ID: ${userId}

👨‍⚕️ *Doctor Details:*
• Doctor: ${doctor}
• Specialization: ${specialization}

📅 *Appointment Details:*
• Date: ${date}
• Time: ${time}
• Reason: ${reason}
• Status: Confirmed

📍 *Location:*
Healthify Medical Center
123 Health Street, Medical City

⚠️ *Important Notes:*
• Please arrive 15 minutes early
• Bring valid ID and insurance card
• Bring previous medical records if any

📞 *Contact:*
Reschedule/Cancel: (555) 123-4567
Emergency: (555) 123-4567

*Healthify - Your Path to Better Health*`,
    
    appointmentReminder: (name, doctor, date, time) => `⏰ Appointment Reminder\n\nHi ${name},\nYour appointment with Dr. ${doctor} is tomorrow at ${time}.\n\nPlease arrive 15 minutes early.\nHealthify Medical Center`,
    
    appointmentCancelled: (name, doctor, date) => `❌ Appointment Cancelled\n\nHi ${name},\nYour appointment with Dr. ${doctor} on ${date} has been cancelled.\n\nTo reschedule, visit healthify.com or call (555) 123-4567`
};

module.exports = {
    sendWhatsAppMessage,
    sendSMS,
    templates
};