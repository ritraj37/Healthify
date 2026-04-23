# 🎥 Real Video Call Setup Instructions

## 1. Install Video Server Dependencies

```bash
cd D:\Healthify\video-server
npm install
```

## 2. Start Video Server

```bash
cd D:\Healthify\video-server
node server.js
```

Expected output:
```
🎥 Video Server running on port 3001
```

## 3. Start Main Backend Server

```bash
cd D:\Healthify\healthify-backend
"C:\Program Files\nodejs\node.exe" server.js
```

## 4. How Video Calls Work

### For Patients:
1. **Book Appointment** → Get WhatsApp confirmation
2. **Login to Dashboard** → See appointments
3. **15 minutes before/after appointment time** → "Join Video Call" button appears
4. **Click Join Video Call** → Opens video consultation window
5. **Real video/audio call** with doctor

### For Doctors:
1. **Receive notification** when patient joins
2. **Join from doctor portal** (separate interface)
3. **Full video consultation** with controls

## 5. Video Call Features

### ✅ **Patient Features**:
- Real camera and microphone access
- Mute/unmute audio
- Turn camera on/off
- Screen sharing capability
- Call timer
- End call option

### ✅ **Technical Features**:
- WebRTC peer-to-peer connection
- STUN servers for NAT traversal
- Real-time signaling via Socket.IO
- Automatic reconnection
- Call quality optimization

## 6. Test Video Call

1. **Book appointment** from website
2. **Login to patient dashboard**
3. **Click "Join Video Call"** on appointment
4. **Allow camera/microphone** access
5. **Video call window opens** with your camera feed

## 7. Browser Requirements

- **Chrome** 60+ (Recommended)
- **Firefox** 55+
- **Safari** 12+
- **Edge** 79+

## 8. Network Requirements

- **Minimum**: 1 Mbps upload/download
- **Recommended**: 3+ Mbps for HD quality
- **Ports**: 3001 (signaling), WebRTC ports

## 9. Security Features

- **Encrypted connections** (WebRTC DTLS)
- **Appointment-based access** (only valid appointment holders)
- **Time-limited access** (15 minutes window)
- **Secure signaling** via Socket.IO

## 10. Troubleshooting

### Camera/Microphone Issues:
- Allow browser permissions
- Check device privacy settings
- Restart browser

### Connection Issues:
- Check internet connection
- Disable VPN if active
- Try different browser

### Call Quality Issues:
- Close other applications
- Use wired internet connection
- Reduce video quality in settings

## 🚀 Ready for Real Doctor-Patient Video Consultations!