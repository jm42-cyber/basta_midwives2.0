# MediMoms 2.0 - Automated Setup Script (PowerShell)
# Run this script to automatically set up the entire project on ANY computer

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  MediMoms 2.0 - Automated Setup" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Get project root directory (wherever the script is located)
$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host "Project Root: $projectRoot" -ForegroundColor Cyan
Write-Host ""

# ============================================
# PREREQUISITE CHECKS
# ============================================
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  CHECKING PREREQUISITES" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$allPrereqsMet = $true

# Check PHP
Write-Host "Checking for PHP..." -ForegroundColor Yellow
$phpExists = Get-Command php -ErrorAction SilentlyContinue
if (-not $phpExists) {
    Write-Host "X PHP not found!" -ForegroundColor Red
    Write-Host "  Install from: https://windows.php.net/download/" -ForegroundColor Yellow
    $allPrereqsMet = $false
} else {
    $phpVersion = php -v | Select-String -Pattern "PHP (\d+\.\d+)" | ForEach-Object { $_.Matches.Groups[1].Value }
    Write-Host "✓ PHP $phpVersion found" -ForegroundColor Green
}

# Check Composer
Write-Host "Checking for Composer..." -ForegroundColor Yellow
$composerExists = Get-Command composer -ErrorAction SilentlyContinue
if (-not $composerExists) {
    Write-Host "X Composer not found!" -ForegroundColor Red
    Write-Host "  Install from: https://getcomposer.org/download/" -ForegroundColor Yellow
    $allPrereqsMet = $false
} else {
    Write-Host "✓ Composer found" -ForegroundColor Green
}

# Check Node.js
Write-Host "Checking for Node.js..." -ForegroundColor Yellow
$nodeExists = Get-Command node -ErrorAction SilentlyContinue
if (-not $nodeExists) {
    Write-Host "X Node.js not found!" -ForegroundColor Red
    Write-Host "  Install from: https://nodejs.org/" -ForegroundColor Yellow
    $allPrereqsMet = $false
} else {
    $nodeVersion = node -v
    Write-Host "✓ Node.js $nodeVersion found" -ForegroundColor Green
}

# Check npm
Write-Host "Checking for npm..." -ForegroundColor Yellow
$npmExists = Get-Command npm -ErrorAction SilentlyContinue
if (-not $npmExists) {
    Write-Host "X npm not found!" -ForegroundColor Red
    $allPrereqsMet = $false
} else {
    $npmVersion = npm -v
    Write-Host "✓ npm $npmVersion found" -ForegroundColor Green
}

# Check MySQL
Write-Host "Checking for MySQL..." -ForegroundColor Yellow
$mysqlExists = Get-Command mysql -ErrorAction SilentlyContinue
if (-not $mysqlExists) {
    Write-Host "! MySQL not found in PATH" -ForegroundColor Yellow
    Write-Host "  Make sure MySQL is installed and running" -ForegroundColor Yellow
} else {
    Write-Host "✓ MySQL found" -ForegroundColor Green
}

Write-Host ""

if (-not $allPrereqsMet) {
    Write-Host "ERROR: Missing required prerequisites!" -ForegroundColor Red
    Write-Host "Please install the missing software and run this script again." -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "✓ All prerequisites met!" -ForegroundColor Green
Write-Host ""

# ============================================
# BACKEND SETUP
# ============================================
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  BACKEND SETUP (Laravel)" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$backendPath = Join-Path $projectRoot "backend"
Set-Location $backendPath

# Install PHP dependencies
Write-Host "Installing PHP dependencies (this may take a few minutes)..." -ForegroundColor Yellow
composer install --no-interaction
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to install PHP dependencies" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host "✓ PHP dependencies installed" -ForegroundColor Green
Write-Host ""

# Create .env file if it doesn't exist
if (-not (Test-Path ".env")) {
    Write-Host "Creating .env file..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "✓ .env file created" -ForegroundColor Green
} else {
    Write-Host "✓ .env file already exists" -ForegroundColor Green
}
Write-Host ""

# Generate application key
Write-Host "Generating application key..." -ForegroundColor Yellow
php artisan key:generate --force
Write-Host "✓ Application key generated" -ForegroundColor Green
Write-Host ""

# Create storage link
Write-Host "Creating storage link..." -ForegroundColor Yellow
php artisan storage:link
Write-Host "✓ Storage link created" -ForegroundColor Green
Write-Host ""

# ============================================
# FRONTEND SETUP
# ============================================
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  FRONTEND SETUP (React + Vite)" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$frontendPath = Join-Path $projectRoot "frontend"
Set-Location $frontendPath

# Install Node dependencies
Write-Host "Installing Node dependencies (this may take several minutes)..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to install Node dependencies" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host "✓ Node dependencies installed" -ForegroundColor Green
Write-Host ""

# Create .env file if it doesn't exist
if (-not (Test-Path ".env")) {
    Write-Host "Creating .env file..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "✓ .env file created" -ForegroundColor Green
} else {
    Write-Host "✓ .env file already exists" -ForegroundColor Green
}
Write-Host ""

# ============================================
# SETUP COMPLETE
# ============================================
Set-Location $projectRoot

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  SETUP COMPLETE!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "NEXT STEPS:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Configure Backend (.env)" -ForegroundColor White
Write-Host "   - Edit: backend\.env" -ForegroundColor Gray
Write-Host "   - Set database credentials:" -ForegroundColor Gray
Write-Host "     DB_DATABASE=medimoms" -ForegroundColor Gray
Write-Host "     DB_USERNAME=root" -ForegroundColor Gray
Write-Host "     DB_PASSWORD=your_password" -ForegroundColor Gray
Write-Host ""

Write-Host "2. Create Database" -ForegroundColor White
Write-Host "   - Open MySQL Workbench or phpMyAdmin" -ForegroundColor Gray
Write-Host "   - Create database: medimoms" -ForegroundColor Gray
Write-Host "   - Or run: mysql -u root -p -e 'CREATE DATABASE medimoms;'" -ForegroundColor Gray
Write-Host ""

Write-Host "3. Run Migrations" -ForegroundColor White
Write-Host "   cd backend" -ForegroundColor Gray
Write-Host "   php artisan migrate" -ForegroundColor Gray
Write-Host "   php artisan db:seed" -ForegroundColor Gray
Write-Host ""

Write-Host "4. Start Backend Server" -ForegroundColor White
Write-Host "   cd backend" -ForegroundColor Gray
Write-Host "   php artisan serve" -ForegroundColor Gray
Write-Host "   (Runs on http://localhost:8000)" -ForegroundColor Gray
Write-Host ""

Write-Host "5. Start Frontend Server (in NEW terminal)" -ForegroundColor White
Write-Host "   cd frontend" -ForegroundColor Gray
Write-Host "   npm run dev" -ForegroundColor Gray
Write-Host "   (Runs on http://localhost:5173)" -ForegroundColor Gray
Write-Host ""

Write-Host "6. Access Application" -ForegroundColor White
Write-Host "   - Frontend: http://localhost:5173" -ForegroundColor Gray
Write-Host "   - Backend API: http://localhost:8000" -ForegroundColor Gray
Write-Host ""

Write-Host "Default Login Credentials:" -ForegroundColor Yellow
Write-Host "   Admin: admin / admin123" -ForegroundColor Gray
Write-Host "   Midwife: midwife1 / midwife123" -ForegroundColor Gray
Write-Host ""

Write-Host "For detailed instructions, see: SETUP_INSTRUCTIONS.md" -ForegroundColor Cyan
Write-Host ""
Write-Host "Happy coding! 🎉" -ForegroundColor Green
Write-Host ""

Read-Host "Press Enter to exit"
