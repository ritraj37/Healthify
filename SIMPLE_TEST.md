## 🚀 Simple Website Test (No Server Needed)

### 1. **Open Website**:
- File Explorer mein jaiye: `D:\Healthify`
- `index.html` pe double-click kariye
- Website browser mein open ho jayegi

### 2. **Test Registration**:
- Register button click kariye
- Form fill kariye with your mobile: `6005431271`
- Submit kariye

### 3. **Check Browser Console**:
- F12 press kariye (Developer Tools)
- Console tab mein errors dekho
- Network tab mein API calls dekho

### 4. **If Server Not Running**:
- Registration form submit hoga
- But notification nahi milega
- Console mein "Failed to fetch" error dikhega

### 5. **Start Server Properly**:
```
1. Open Command Prompt
2. cd /d D:\Healthify\healthify-backend
3. "C:\Program Files\nodejs\node.exe" server.js
4. Keep this window open
5. Test registration again
```

### 6. **Expected Server Output**:
```
🏥 Healthify Backend running on port 3000
📱 Sending welcome notification to: 6005431271
✅ WhatsApp message sent successfully: SMxxxxxxx
```

Try website registration first - easier than command line testing!