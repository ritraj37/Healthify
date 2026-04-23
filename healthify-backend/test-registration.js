// Debug Registration API
const fetch = require('node-fetch');

async function testRegistration() {
    try {
        console.log('🧪 Testing Registration API...');
        
        const response = await fetch('http://localhost:3000/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userId: 'TEST123',
                email: 'test@healthify.com',
                password: 'password123',
                firstName: 'Test',
                lastName: 'User',
                mobile: '6005431271',
                dateOfBirth: '1990-01-01',
                gender: 'male',
                address: 'Test Address'
            })
        });
        
        const result = await response.json();
        console.log('📝 Registration Response:', result);
        
        if (response.ok) {
            console.log('✅ Registration API working - Check WhatsApp for notification!');
        } else {
            console.log('❌ Registration failed:', result.error);
        }
        
    } catch (error) {
        console.error('❌ API Error:', error.message);
        console.log('💡 Make sure backend server is running on port 3000');
    }
}

testRegistration();