// Enhanced Dashboard with Video Call Integration
document.addEventListener('DOMContentLoaded', () => {
    loadAppointmentsWithVideoCall();
});

function loadAppointmentsWithVideoCall() {
    const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    const appointmentsContainer = document.querySelector('.appointments-list') || document.querySelector('.dashboard-content');
    
    if (!appointmentsContainer) return;
    
    if (appointments.length === 0) {
        appointmentsContainer.innerHTML = `
            <div class="no-appointments">
                <i class="fas fa-calendar-times"></i>
                <p>No appointments scheduled</p>
                <a href="appointment.html" class="btn-book">Book Appointment</a>
            </div>
        `;
        return;
    }
    
    let html = '<h3><i class="fas fa-calendar-check"></i> Your Appointments</h3>';
    
    appointments.forEach(apt => {
        const isVideoCallReady = apt.videoCallScheduled && apt.status === 'confirmed';
        const appointmentDate = new Date(apt.date);
        const today = new Date();
        const isToday = appointmentDate.toDateString() === today.toDateString();
        
        html += `
            <div class="appointment-card ${isVideoCallReady ? 'video-enabled' : ''}" data-appointment-id="${apt.id}">
                <div class="appointment-header">
                    <div class="doctor-info">
                        <h4><i class="fas fa-user-md"></i> ${apt.doctor}</h4>
                        <p class="specialization">${apt.specialization}</p>
                    </div>
                    <div class="appointment-status status-${apt.status}">
                        ${apt.status === 'confirmed' ? '<i class="fas fa-check-circle"></i> Confirmed' : apt.status}
                    </div>
                </div>
                
                <div class="appointment-details">
                    <div class="detail-item">
                        <i class="fas fa-calendar"></i>
                        <span>${new Date(apt.date).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-clock"></i>
                        <span>${apt.time}</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-notes-medical"></i>
                        <span>${apt.reason}</span>
                    </div>
                    ${apt.paymentId ? `
                    <div class="detail-item">
                        <i class="fas fa-credit-card"></i>
                        <span>Payment: ₹${apt.amount} (${apt.paymentId})</span>
                    </div>
                    ` : ''}
                </div>
                
                ${isVideoCallReady ? `
                <div class="video-call-section">
                    <div class="video-call-badge">
                        <i class="fas fa-video"></i>
                        <span>Video Consultation Scheduled</span>
                    </div>
                    ${isToday ? `
                    <div class="video-call-ready">
                        <i class="fas fa-check-circle"></i>
                        <span>Ready to join - Available now!</span>
                    </div>
                    ` : ''}
                </div>
                ` : ''}
                
                <div class="appointment-actions">
                    ${isVideoCallReady ? `
                    <button class="action-btn btn-video ${!isToday ? 'disabled' : ''}" 
                            onclick="joinVideoCall('${apt.id}')" 
                            ${!isToday ? 'disabled title="Video call available on appointment day"' : ''}>
                        <i class="fas fa-video"></i> 
                        ${isToday ? 'Join Video Call' : 'Video Call (Available on ' + appointmentDate.toLocaleDateString() + ')'}
                    </button>
                    ` : ''}
                    <button class="action-btn btn-reschedule" onclick="rescheduleAppointment('${apt.id}')">
                        <i class="fas fa-calendar-alt"></i> Reschedule
                    </button>
                    <button class="action-btn btn-cancel" onclick="cancelAppointment('${apt.id}')">
                        <i class="fas fa-times"></i> Cancel
                    </button>
                </div>
            </div>
        `;
    });
    
    appointmentsContainer.innerHTML = html;
}

function joinVideoCall(appointmentId) {
    const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    const appointment = appointments.find(apt => apt.id == appointmentId);
    
    if (!appointment) {
        alert('Appointment not found');
        return;
    }
    
    // Check if appointment is today
    const appointmentDate = new Date(appointment.date);
    const today = new Date();
    
    if (appointmentDate.toDateString() !== today.toDateString()) {
        alert('Video call is only available on the appointment day');
        return;
    }
    
    // Open video call window
    const videoCallUrl = `video-consultation.html?appointment=${appointmentId}&type=patient`;
    window.open(videoCallUrl, 'HealthifyVideoCall', 'width=1200,height=800,scrollbars=yes,resizable=yes');
}

function rescheduleAppointment(appointmentId) {
    alert('Reschedule feature coming soon!');
}

function cancelAppointment(appointmentId) {
    if (confirm('Are you sure you want to cancel this appointment?')) {
        let appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
        appointments = appointments.filter(apt => apt.id != appointmentId);
        localStorage.setItem('appointments', JSON.stringify(appointments));
        loadAppointmentsWithVideoCall();
        alert('Appointment cancelled successfully');
    }
}