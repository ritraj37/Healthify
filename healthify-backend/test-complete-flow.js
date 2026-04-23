// Complete Notification Test - Using built-in fetch (Node 18+)

const API_BASE = 'http://localhost:3000/api';

async function testCompleteFlow() {
    console.log('🧪 Testing Complete Notification Flow...\n');
    
    // Test 1: Registration
    console.log('1️⃣ Testing Registration Notification...');
    try {
        const regResponse = await fetch(`${API_BASE}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: `TEST${Date.now()}`,
                email: `test${Date.now()}@healthify.com`,
                password: 'password123',
                firstName: 'John',
                lastName: 'Doe',
                mobile: '6005431271',
                dateOfBirth: '1990-01-01',
                gender: 'male',
                address: 'Test Address'
            })
        });
        
        const regResult = await regResponse.json();
        
        if (regResponse.ok) {
            console.log('✅ Registration successful - Check WhatsApp for welcome message!');
            console.log('📝 User created:', regResult.user.userId);
            
            // Test 2: Appointment Booking
            console.log('\n2️⃣ Testing Appointment Notification...');
            
            const appointmentResponse = await fetch(`${API_BASE}/appointments/book`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${regResult.token}`
                },
                body: JSON.stringify({
                    doctorId: 1,
                    appointmentDate: '2025-01-25',
                    appointmentTime: '10:00',
                    reason: 'Regular checkup'
                })
            });
            
            const appointmentResult = await appointmentResponse.json();
            
            if (appointmentResponse.ok) {
                console.log('✅ Appointment booked - Check WhatsApp for confirmation!');
                console.log('📅 Appointment ID:', appointmentResult.appointment.id);
            } else {
                console.log('❌ Appointment failed:', appointmentResult.error);
            }
            
        } else {
            console.log('❌ Registration failed:', regResult.error);
        }
        
    } catch (error) {
        console.error('❌ Test Error:', error.message);
        console.log('💡 Make sure backend server is running on port 3000');
    }
    
    console.log('\n🏁 Test completed - Check server console for notification logs');
}

testCompleteFlow();