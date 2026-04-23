// Video Call Integration for Patient Dashboard
function joinVideoCall(appointmentId) {
    const user = JSON.parse(localStorage.getItem('healthifyUser'));
    
    if (!user) {
        alert('Please login to join video call');
        return;
    }
    
    // Check if appointment time is valid (within 15 minutes of scheduled time)
    if (!isAppointmentTimeValid(appointmentId)) {
        alert('Video call is only available 15 minutes before and after your scheduled appointment time.');
        return;
    }
    
    // Generate video call URL with appointment details
    const videoCallUrl = `video-consultation.html?appointment=${appointmentId}&type=patient&userId=${user.id}`;
    
    // Open video call in new window
    const videoWindow = window.open(
        videoCallUrl, 
        'HealthifyVideoCall',
        'width=1200,height=800,scrollbars=yes,resizable=yes'
    );
    
    if (!videoWindow) {
        alert('Please allow popups for video calls');
        return;
    }
    
    // Send notification to doctor
    notifyDoctorOfPatientJoining(appointmentId);
    
    console.log(`🎥 Patient joining video call for appointment ${appointmentId}`);
}

function isAppointmentTimeValid(appointmentId) {
    // Get appointment details from localStorage or API
    const appointments = JSON.parse(localStorage.getItem('userAppointments') || '[]');
    const appointment = appointments.find(apt => apt.id == appointmentId);
    
    if (!appointment) return false;
    
    const appointmentDateTime = new Date(`${appointment.date} ${appointment.time}`);
    const now = new Date();
    const timeDiff = Math.abs(now - appointmentDateTime);
    const fifteenMinutes = 15 * 60 * 1000; // 15 minutes in milliseconds
    
    return timeDiff <= fifteenMinutes;
}

async function notifyDoctorOfPatientJoining(appointmentId) {
    try {
        const token = localStorage.getItem('healthifyToken');
        await fetch('http://localhost:3000/api/appointments/notify-doctor', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                appointmentId,
                action: 'patient_joined_video_call'
            })
        });
    } catch (error) {
        console.error('Error notifying doctor:', error);
    }
}

// Add video call button to existing appointment cards
function addVideoCallButtons() {
    const appointmentCards = document.querySelectorAll('.appointment-card');
    
    appointmentCards.forEach(card => {
        const appointmentId = card.dataset.appointmentId;
        const actionsDiv = card.querySelector('.appointment-actions');
        
        if (actionsDiv && !actionsDiv.querySelector('.btn-video')) {
            const videoBtn = document.createElement('button');
            videoBtn.className = 'action-btn btn-video';
            videoBtn.innerHTML = '<i class="fas fa-video"></i> Join Video Call';
            videoBtn.onclick = () => joinVideoCall(appointmentId);
            
            // Insert before cancel button
            const cancelBtn = actionsDiv.querySelector('.btn-cancel');
            if (cancelBtn) {
                actionsDiv.insertBefore(videoBtn, cancelBtn);
            } else {
                actionsDiv.appendChild(videoBtn);
            }
        }
    });
}

// Initialize video call features when page loads
document.addEventListener('DOMContentLoaded', () => {
    // Add video call buttons to existing appointments
    setTimeout(addVideoCallButtons, 1000); // Wait for appointments to load
    
    // Check for active video calls
    checkActiveVideoCalls();
});

async function checkActiveVideoCalls() {
    try {
        const user = JSON.parse(localStorage.getItem('healthifyUser'));
        if (!user) return;
        
        const response = await fetch(`http://localhost:3001/api/call-status/patient-${user.id}`);
        if (response.ok) {
            const callStatus = await response.json();
            if (callStatus.active) {
                showActiveCallNotification(callStatus.appointmentId);
            }
        }
    } catch (error) {
        console.log('No active video calls');
    }
}

function showActiveCallNotification(appointmentId) {
    const notification = document.createElement('div');
    notification.className = 'active-call-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-video"></i>
            <span>You have an active video call</span>
            <button onclick="joinVideoCall('${appointmentId}')" class="btn-join">Rejoin Call</button>
            <button onclick="this.parentElement.parentElement.remove()" class="btn-close">×</button>
        </div>
    `;
    
    document.body.appendChild(notification);
}