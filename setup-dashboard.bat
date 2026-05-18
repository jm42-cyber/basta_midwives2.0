@echo off
echo ========================================
echo MediMoms Dashboard Setup
echo ========================================
echo.

echo [1/3] Installing Leaflet Map Dependencies...
cd frontend
call npm install leaflet react-leaflet @types/leaflet
echo.

echo [2/3] Building Frontend...
call npm run build
echo.

echo [3/3] Setup Complete!
echo.
echo ========================================
echo Next Steps:
echo ========================================
echo 1. Start Backend:  cd backend ^&^& php artisan serve
echo 2. Start Frontend: cd frontend ^&^& npm run dev
echo 3. Open: http://localhost:5173
echo.
echo For map setup, see: DASHBOARD_SETUP_GUIDE.md
echo ========================================
pause
