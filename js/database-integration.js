// Database Integration for Authentication
const API_BASE_URL = 'http://localhost:3000/api';

// Login Form Integration
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const loginData = {
                userId: document.getElementById('userid').value,
                password: document.getElementById('password').value,
                mobile: document.getElementById('mobile').value
            };
            
            const submitBtn = this.querySelector('button[type="submit"]');
            submitBtn.innerHTML = 'Logging in...';
            submitBtn.disabled = true;
            
            try {
                const response = await fetch(`${API_BASE_URL}/auth/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(loginData)
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    // Store user data and token
                    localStorage.setItem('healthifyUser', JSON.stringify(data.user));
                    localStorage.setItem('healthifyToken', data.token);
                    localStorage.setItem('healthifyUserId', data.user.id);
                    
                    alert('Login successful!');
                    window.location.href = 'patient-dashboard.html';
                } else {
                    alert(data.error || 'Login failed');
                }
            } catch (error) {
                console.error('Login error:', error);
                alert('Login failed. Please try again.');
            } finally {
                submitBtn.innerHTML = 'Login';
                submitBtn.disabled = false;
            }
        });
    }
    
    // Registration Form Integration
    const registerForm = document.getElementById('registerForm');
    
    if (registerForm) {
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const registerData = {
                userId: document.getElementById('userid').value,
                email: document.getElementById('email').value,
                password: document.getElementById('password').value,
                firstName: document.getElementById('firstName').value,
                lastName: document.getElementById('lastName').value,
                mobile: document.getElementById('mobile').value,
                dateOfBirth: document.getElementById('dob').value,
                gender: document.getElementById('gender').value,
                address: document.getElementById('address').value
            };
            
            const submitBtn = this.querySelector('button[type="submit"]');
            submitBtn.innerHTML = 'Creating Account...';
            submitBtn.disabled = true;
            
            try {
                const response = await fetch(`${API_BASE_URL}/auth/register`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(registerData)
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    localStorage.setItem('healthifyUser', JSON.stringify(data.user));
                    localStorage.setItem('healthifyToken', data.token);
                    localStorage.setItem('healthifyUserId', data.user.id);
                    
                    alert('Registration successful!');
                    window.location.href = 'patient-dashboard.html';
                } else {
                    alert(data.error || 'Registration failed');
                }
            } catch (error) {
                console.error('Registration error:', error);
                alert('Registration failed. Please try again.');
            } finally {
                submitBtn.innerHTML = 'Create Account';
                submitBtn.disabled = false;
            }
        });
    }
    
    // Appointment Form Integration
    const appointmentForm = document.querySelector('.professional-form');
    
    if (appointmentForm && window.location.pathname.includes('appointment.html')) {
        appointmentForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const token = localStorage.getItem('healthifyToken');
            if (!token) {
                alert('Please login first');
                window.location.href = 'login.html';
                return;
            }
            
            const appointmentData = {
                doctorId: document.getElementById('doctor').value,
                appointmentDate: document.getElementById('date').value,
                appointmentTime: document.getElementById('time').value,
                reason: document.getElementById('reason').value
            };
            
            const submitBtn = this.querySelector('.btn-submit');
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Booking...';
            submitBtn.disabled = true;
            
            try {
                const response = await fetch(`${API_BASE_URL}/appointments/book`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(appointmentData)
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    alert('Appointment booked successfully!');
                    window.location.href = 'patient-dashboard.html';
                } else {
                    alert(data.error || 'Booking failed');
                }
            } catch (error) {
                console.error('Appointment booking error:', error);
                alert('Booking failed. Please try again.');
            } finally {
                submitBtn.innerHTML = '<i class="fas fa-calendar-plus"></i> Book Appointment';
                submitBtn.disabled = false;
            }
        });
    }
});

// Contact form submission with database integration
function submitContactForm(event) {
    event.preventDefault();
    
    const formData = {
        name: document.getElementById('contactName').value,
        email: document.getElementById('contactEmail').value,
        phone: document.getElementById('contactPhone').value,
        message: document.getElementById('contactMessage').value
    };
    
    fetch('http://localhost:3000/api/data/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Thank you! Your message has been sent successfully.');
            document.getElementById('contactForm').reset();
        } else {
            alert('Error sending message. Please try again.');
        }
    })
    .catch(error => {
        console.error('Contact form error:', error);
        alert('Error sending message. Please try again.');
    });
}

// Newsletter subscription
function subscribeNewsletter(email, name = '') {
    fetch('http://localhost:3000/api/data/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Successfully subscribed to newsletter!');
        } else {
            alert(data.error || 'Subscription failed');
        }
    })
    .catch(error => {
        console.error('Newsletter error:', error);
        alert('Subscription failed. Please try again.');
    });
}

// AI Chat logging
function logAIChat(message, response, userId = null) {
    fetch('http://localhost:3000/api/data/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, message, response })
    })
    .catch(error => console.error('AI chat logging error:', error));
}