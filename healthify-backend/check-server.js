// Simple Server Check
console.log('🔍 Checking if server is running...');

// Test server health
setTimeout(() => {
    console.log('💡 If you see this message, run these commands:');
    console.log('');
    console.log('1️⃣ Start Server:');
    console.log('"C:\\Program Files\\nodejs\\node.exe" server.js');
    console.log('');
    console.log('2️⃣ Then in NEW command prompt, test notifications:');
    console.log('"C:\\Program Files\\nodejs\\node.exe" test-complete-flow.js');
    console.log('');
    console.log('🚨 Keep server running in one window, test in another!');
}, 1000);