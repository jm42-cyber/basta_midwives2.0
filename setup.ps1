# ONE COMMAND SETUP (PowerShell)

# Run this entire script at once - Copy and paste into PowerShell

# Navigate to project root
cd C:\Users\JM\Documents\basta_midwives2.0

# Backup old backend
if (Test-Path backend) {
    Rename-Item backend backend_old -Force
}

# Create fresh Laravel
Write-Host "Creating fresh Laravel installation..." -ForegroundColor Green
composer create-project laravel/laravel backend

# Navigate to backend
cd backend

# Install Sanctum
Write-Host "Installing Laravel Sanctum..." -ForegroundColor Green
composer require laravel/sanctum
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"

# Copy custom files
Write-Host "Copying custom files..." -ForegroundColor Green
Copy-Item ..\backend_old\database\migrations\2024*.php .\database\migrations\ -Force
Copy-Item ..\backend_old\app\Models\*.php .\app\Models\ -Force
Copy-Item ..\backend_old\app\Http\Controllers\*.php .\app\Http\Controllers\ -Force
Copy-Item ..\backend_old\routes\api.php .\routes\api.php -Force
Copy-Item ..\backend_old\database\seeders\DatabaseSeeder.php .\database\seeders\DatabaseSeeder.php -Force

# Setup environment
Copy-Item .env.example .env -Force
php artisan key:generate

Write-Host "`n==================================" -ForegroundColor Cyan
Write-Host "SETUP ALMOST COMPLETE!" -ForegroundColor Green
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "`nNEXT STEPS:" -ForegroundColor Yellow
Write-Host "1. Edit .env file - Set your database credentials" -ForegroundColor White
Write-Host "2. Create database 'medimoms' in MySQL" -ForegroundColor White
Write-Host "3. Run: php artisan migrate" -ForegroundColor White
Write-Host "4. Run: php artisan db:seed" -ForegroundColor White
Write-Host "5. Run: php artisan serve" -ForegroundColor White
Write-Host "`nThen setup frontend in NEW terminal:" -ForegroundColor Yellow
Write-Host "cd ..\frontend" -ForegroundColor White
Write-Host "npm install" -ForegroundColor White
Write-Host "npm run dev" -ForegroundColor White
