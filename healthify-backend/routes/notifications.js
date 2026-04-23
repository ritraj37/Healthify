const express = require('express');
const { sendWhatsAppMessage, templates } = require('../services/notification');
const router = express.Router();

// Send registration notification
router.post('/registration', async (req, res) => {
    try {
        const { mobile, name, userId, email } = req.body;
        const message = templates.registration(name, userId, email, mobile);
        const result = await sendWhatsAppMessage(mobile, message);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Send appointment notification
router.post('/appointment', async (req, res) => {
    try {
        const { mobile, name, userId, doctor, specialization, date, time, reason } = req.body;
        const message = templates.appointmentBooked(name, userId, doctor, specialization, date, time, reason);
        const result = await sendWhatsAppMessage(mobile, message);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;