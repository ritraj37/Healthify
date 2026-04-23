// WhatsApp Notification Handler
class WhatsAppNotifier {
    constructor() {
        this.apiUrl = 'http://localhost:3000/api';
    }

    async sendRegistrationNotification(userData) {
        try {
            const response = await fetch(`${this.apiUrl}/notifications/registration`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    mobile: userData.mobile,
                    name: `${userData.firstName} ${userData.lastName}`,
                    userId: userData.userId,
                    email: userData.email
                })
            });
            return await response.json();
        } catch (error) {
            console.error('Registration notification failed:', error);
        }
    }

    async sendAppointmentNotification(appointmentData) {
        try {
            const response = await fetch(`${this.apiUrl}/notifications/appointment`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(appointmentData)
            });
            return await response.json();
        } catch (error) {
            console.error('Appointment notification failed:', error);
        }
    }
}

// Export for use
window.WhatsAppNotifier = WhatsAppNotifier;