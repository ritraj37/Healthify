// WebRTC Signaling Server for Video Consultations
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// Store active video call sessions
const activeCalls = new Map();

// Socket connection handling
io.on('connection', (socket) => {
  console.log(`🔗 User connected: ${socket.id}`);
  
  // Join video call room
  socket.on('join-call', (data) => {
    const { appointmentId, userType, userId } = data;
    
    socket.join(appointmentId);
    socket.appointmentId = appointmentId;
    socket.userType = userType;
    
    if (!activeCalls.has(appointmentId)) {
      activeCalls.set(appointmentId, { doctor: null, patient: null });
    }
    
    const callSession = activeCalls.get(appointmentId);
    callSession[userType] = socket.id;
    
    console.log(`👥 ${userType} joined call ${appointmentId}`);
    
    socket.to(appointmentId).emit('user-joined', { userType, userId });
    
    if (callSession.doctor && callSession.patient) {
      io.to(appointmentId).emit('call-ready');
    }
  });
  
  // WebRTC signaling
  socket.on('offer', (data) => {
    socket.to(socket.appointmentId).emit('offer', data);
  });
  
  socket.on('answer', (data) => {
    socket.to(socket.appointmentId).emit('answer', data);
  });
  
  socket.on('ice-candidate', (data) => {
    socket.to(socket.appointmentId).emit('ice-candidate', data);
  });
  
  socket.on('disconnect', () => {
    console.log(`🔌 User disconnected: ${socket.id}`);
    if (socket.appointmentId) {
      socket.to(socket.appointmentId).emit('user-left', { userType: socket.userType });
    }
  });
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`🎥 Video Server running on port ${PORT}`);
});