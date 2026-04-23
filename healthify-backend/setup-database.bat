@echo off
echo ========================================
echo    HEALTHIFY - DATABASE SETUP
echo ========================================
echo.

echo 🗄️ Setting up PostgreSQL database...
echo.

set /p db_password="Enter PostgreSQL password (default: root): "
if "%db_password%"=="" set db_password=root

echo.
echo 📋 Step 1: Creating database...
psql -U postgres -c "CREATE DATABASE healthify_db;" 2>nul
if %errorlevel% equ 0 (
    echo ✅ Database created successfully
) else (
    echo ⚠️ Database might already exist (this is OK)
)

echo.
echo 📋 Step 2: Creating tables...
psql -U postgres -d healthify_db -f 2-create-tables.sql

if %errorlevel% equ 0 (
    echo ✅ Tables created successfully
    echo.
    echo 🎉 Database setup complete!
    echo.
    echo 📊 Database Info:
    echo - Host: localhost
    echo - Port: 5432
    echo - Database: healthify_db
    echo - Username: postgres
    echo - Password: %db_password%
) else (
    echo ❌ Error creating tables
    echo.
    echo 💡 Try running these commands manually:
    echo 1. psql -U postgres
    echo 2. CREATE DATABASE healthify_db;
    echo 3. \c healthify_db
    echo 4. \i 2-create-tables.sql
)

echo.
pause