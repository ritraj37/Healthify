# Healthify Database Backend

## 🗄️ Database Setup

### PostgreSQL Installation
1. **Download PostgreSQL**: https://www.postgresql.org/download/
2. **Install with default settings**
3. **Remember your password**

### Database Creation
```sql
-- Connect to PostgreSQL as superuser
CREATE DATABASE healthify_db;
CREATE USER healthify_user WITH PASSWORD 'healthify123';
GRANT ALL PRIVILEGES ON DATABASE healthify_db TO healthify_user;
```

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd healthify-backend
npm install
```

### 2. Configure Database
Update `.env` file with your PostgreSQL credentials:
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=healthify_db
DB_USER=postgres
DB_PASSWORD=your_password
```

### 3. Start Server
```bash
npm start
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/forgot-password` - Password reset

### Appointments
- `GET /api/appointments/doctors` - Get all doctors
- `POST /api/appointments/book` - Book appointment
- `GET /api/appointments/my-appointments` - Get user appointments
- `PUT /api/appointments/cancel/:id` - Cancel appointment

### General
- `POST /api/contact` - Submit contact form
- `POST /api/ai-chat` - Save AI chat session
- `GET /api/ai-chat/:sessionId` - Get chat history

## 🔧 Database Tables

- **users** - Patient information
- **doctors** - Doctor profiles
- **appointments** - Appointment bookings
- **contact_messages** - Contact form submissions
- **ai_chat_sessions** - AI chat history
- **medical_records** - Patient medical records
- **password_reset_tokens** - Password reset tokens

## 🔒 Security Features

- JWT authentication
- Password hashing with bcrypt
- SQL injection prevention
- CORS enabled
- Input validation