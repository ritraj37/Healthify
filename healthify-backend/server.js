require("dotenv").config();
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { createTables } = require('./database/schema');
const authRoutes = require('./routes/auth');
const appointmentRoutes = require('./routes/appointments');
const generalRoutes = require('./routes/general');
const dataRoutes = require('./routes/data-collection');
const paymentRoutes = require('./routes/payments');
const notificationRoutes = require('./routes/notifications');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`🔄 ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api', generalRoutes);
app.use('/api/data', dataRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/notifications', notificationRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    message: 'Healthify Backend API is running',
    timestamp: new Date().toISOString()
  });
});

// Initialize database and start server
const startServer = async () => {
  try {
    await createTables();
    app.listen(PORT, () => {
      console.log(`🏥 Healthify Backend running on port ${PORT}`);
      console.log(`📊 Database: PostgreSQL`);
      console.log(`🔗 API: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
  }
};

startServer();