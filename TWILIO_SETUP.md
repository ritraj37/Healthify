# Twilio WhatsApp & SMS Notifications Setup

## 1. Twilio Account Setup (FREE)

### Create Free Account:
1. Visit: https://www.twilio.com/try-twilio
2. Sign up with email
3. Verify phone number
4. Get $15 free credit

### Get Credentials:
1. Dashboard → Account Info
2. Copy Account SID
3. Copy Auth Token
4. Get phone number from Console

## 2. WhatsApp Setup

### WhatsApp Sandbox (FREE):
1. Console → Messaging → Try it out → Send a WhatsApp message
2. Follow instructions to connect your WhatsApp
3. Send "join <sandbox-keyword>" to Twilio WhatsApp number
4. Use sandbox number: `whatsapp:+14155238886`

## 3. Environment Configuration

Update `.env` file:
```
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+14155238886
```

## 4. Install Dependencies

```bash
cd healthify-backend
npm install twilio
```

## 5. Test Notifications

### Registration Test:
```javascript
// Test in browser console after registration
fetch('/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userId: 'test123',
    email: 'test@example.com',
    password: 'password123',
    firstName: 'John',
    lastName: 'Doe',
    mobile: '+1234567890', // Your WhatsApp number
    dateOfBirth: '1990-01-01',
    gender: 'male',
    address: 'Test Address'
  })
});
```

### Appointment Test:
```javascript
// Test appointment booking notification
fetch('/api/appointments/book', {
  method: 'POST',
  headers: { 
    'Content-Type': 'application/json',
    'Authorization': 'Bearer your_jwt_token'
  },
  body: JSON.stringify({
    doctorId: 1,
    appointmentDate: '2025-01-20',
    appointmentTime: '10:00',
    reason: 'Regular checkup'
  })
});
```

## 6. Production Setup

### For Production WhatsApp:
1. Apply for WhatsApp Business API
2. Get approved phone number
3. Update TWILIO_PHONE_NUMBER in .env

### Message Templates:
- Registration: Welcome message
- Appointment Booked: Confirmation with details
- Appointment Reminder: 24h before appointment
- Appointment Cancelled: Cancellation notice

## 7. Free Tier Limits

- **SMS**: $15 credit (~500 messages
- **WhatsApp**: Free in sandbox mode
- **Phone Numbers**: 1 free trial number

## 8. Error Handling

All notifications have fallback:
- Try WhatsApp first (if number starts with +)
- Fallback to SMS if WhatsApp fails
- Log errors for monitoring

## 9. Start Server

```bash
cd healthify-backend
npm start
```

Server will run on http://localhost:3000 with notifications enabled!