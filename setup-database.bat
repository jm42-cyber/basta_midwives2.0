@echo off
echo ========================================
echo   MediMoms Database Setup
echo ========================================
echo.

cd backend

echo [1/3] Dropping all tables and recreating database...
php artisan migrate:fresh
echo.

echo [2/3] Seeding database with initial data...
php artisan db:seed
echo.

echo [3/3] Clearing cache...
php artisan config:clear
php artisan cache:clear
echo.

echo ========================================
echo   Database Setup Complete!
echo ========================================
echo.
echo Default Users Created:
echo.
echo ADMIN:
echo   Username: admin
echo   Password: admin123
echo.
echo MIDWIFE 1:
echo   Username: midwife1
echo   Password: midwife123
echo.
echo DR. JM:
echo   Username: Dr. JM
echo   Email: legenddelvalle42@gmail.com
echo   Password: Delvalle2005
echo.
echo ========================================
pause
