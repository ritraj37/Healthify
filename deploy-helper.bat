@echo off
REM Healthify - Quick Deployment Helper (Windows)
REM This script helps update all localhost URLs to production URLs

echo ========================================
echo    Healthify Deployment Helper
echo ========================================
echo.

set /p DOMAIN="Enter your production domain (e.g., healthify.com): "

if "%DOMAIN%"=="" (
    echo ERROR: Domain cannot be empty!
    pause
    exit /b 1
)

echo.
echo Updating URLs in all files...
echo.

REM Create backups
echo Creating backups...
copy js\main.js js\main.js.backup >nul
copy ai-assistant.js ai-assistant.js.backup >nul
copy js\database-integration.js js\database-integration.js.backup >nul
copy payment.html payment.html.backup >nul
copy video-consultation.html video-consultation.html.backup >nul

REM Update files using PowerShell
echo Updating API URLs...
powershell -Command "(Get-Content js\main.js) -replace 'http://localhost:3000/api', 'https://%DOMAIN%/api' | Set-Content js\main.js"
powershell -Command "(Get-Content js\main.js) -replace 'http://localhost:45678/api', 'https://%DOMAIN%/ai-api' | Set-Content js\main.js"
powershell -Command "(Get-Content ai-assistant.js) -replace 'http://localhost:45678/api', 'https://%DOMAIN%/ai-api' | Set-Content ai-assistant.js"
powershell -Command "(Get-Content js\database-integration.js) -replace 'http://localhost:3000/api', 'https://%DOMAIN%/api' | Set-Content js\database-integration.js"

echo Updating Video Server URL...
powershell -Command "(Get-Content video-consultation.html) -replace 'http://localhost:3001', 'https://%DOMAIN%:3001' | Set-Content video-consultation.html"

echo.
echo ========================================
echo    URLs updated successfully!
echo ========================================
echo.
echo Next Steps:
echo 1. Update Razorpay keys in payment.html
echo 2. Update Twilio credentials in backend\.env
echo 3. Install SSL certificate
echo 4. Test all features
echo.
echo Backups created with .backup extension
echo.
echo Ready for deployment!
echo.
pause
