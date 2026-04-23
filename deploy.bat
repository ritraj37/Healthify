@echo off
echo ========================================
echo    HEALTHIFY - QUICK DEPLOYMENT
echo ========================================
echo.

echo 🏥 Starting Healthify Healthcare Website...
echo.

echo 📋 DEPLOYMENT OPTIONS:
echo.
echo 1. INSTANT TEST (No setup needed)
echo 2. LOCAL WITH BACKEND (Full features)
echo 3. WEB DEPLOYMENT (Upload to hosting)
echo.

set /p choice="Choose option (1/2/3): "

if "%choice%"=="1" goto instant
if "%choice%"=="2" goto backend
if "%choice%"=="3" goto web
goto invalid

:instant
echo.
echo ⚡ INSTANT TEST MODE
echo ==================
echo.
echo ✅ Opening website in browser...
echo ✅ No setup required!
echo ✅ All features work with localStorage
echo.
start index.html
echo.
echo 🎉 SUCCESS! Website opened in browser.
echo.
echo 📋 TEST THESE FEATURES:
echo - Register new account
echo - Login
echo - Book appointment (use demo payment)
echo - View patient dashboard
echo - Try AI chatbot
echo - Test video call (open 2 browser tabs)
echo.
pause
goto end

:backend
echo.
echo 🔧 BACKEND SETUP MODE
echo ====================
echo.
echo 📋 Prerequisites Check:
echo.

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js not found! Please install Node.js first.
    echo Download from: https://nodejs.org
    pause
    goto end
)
echo ✅ Node.js found

where psql >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ PostgreSQL not found! Please install PostgreSQL first.
    echo Download from: https://www.postgresql.org/download/
    pause
    goto end
)
echo ✅ PostgreSQL found

echo.
echo 🚀 Starting backend services...
echo.

cd healthify-backend
echo 📦 Installing dependencies...
call npm install

echo.
echo 🗄️ Database Setup:
echo.
set /p db_password="Enter PostgreSQL password (default: root): "
if "%db_password%"=="" set db_password=root

echo DB_PASSWORD=%db_password% > .env.temp
type .env >> .env.temp
move .env.temp .env

echo.
echo 🔄 Starting backend server...
start "Healthify Backend" cmd /k "npm start"

timeout /t 3 >nul

echo.
echo 🤖 Starting AI backend...
cd ..\healthify-ai-backend
start "Healthify AI" cmd /k "python start.py"

timeout /t 3 >nul

echo.
echo 📹 Starting video server...
cd ..\video-server
call npm install
start "Video Server" cmd /k "node server.js"

cd ..

echo.
echo ✅ All services started!
echo.
echo 🌐 Opening website...
start index.html

echo.
echo 🎉 SUCCESS! Full backend running.
echo.
echo 📊 Services Running:
echo - Backend API: http://localhost:3000
echo - AI Backend: http://localhost:8001  
echo - Video Server: http://localhost:8080
echo - Website: index.html
echo.
echo 📋 TEST THESE FEATURES:
echo - Full database integration
echo - WhatsApp notifications (if Twilio configured)
echo - Advanced AI responses
echo - Real-time video calls
echo.
pause
goto end

:web
echo.
echo 🌐 WEB DEPLOYMENT MODE
echo =====================
echo.
echo 📋 Steps to deploy to web hosting:
echo.
echo 1. 📁 Upload these files to your web server:
echo    - All .html files
echo    - css/ folder
echo    - js/ folder  
echo    - images/ folder
echo    - sitemap.xml, robots.txt
echo.
echo 2. 🔧 Optional: Update URLs using deploy-helper.bat
echo.
echo 3. 💳 Optional: Update Razorpay keys in payment.html
echo.
echo 4. 🔒 Install SSL certificate (Let's Encrypt recommended)
echo.
echo 5. ✅ Test your live website
echo.
echo 💡 TIP: The website works without backend using localStorage!
echo.
echo 📖 For detailed instructions, see:
echo - DEPLOYMENT_CHECKLIST.md
echo - QUICK_START.md
echo.
pause
goto end

:invalid
echo.
echo ❌ Invalid choice. Please run again and choose 1, 2, or 3.
pause
goto end

:end
echo.
echo 🏥 Healthify Deployment Complete!
echo.
echo 📞 Need help? Check these files:
echo - README.md
echo - QUICK_START.md  
echo - DEPLOYMENT_CHECKLIST.md
echo.
echo 🎉 Happy Healthcare! 
pause