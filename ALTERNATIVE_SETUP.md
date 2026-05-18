# ALTERNATIVE SETUP - Use Fresh Laravel Installation

The backend structure needs a complete Laravel installation. Here's the easiest way:

## Option 1: Install Fresh Laravel (RECOMMENDED)

```bash
cd C:\Users\JM\Documents\basta_midwives2.0
rmdir /s backend
composer create-project laravel/laravel backend
cd backend
```

Then copy these files from the created structure:
- All migration files from `database/migrations/`
- All model files from `app/Models/`
- All controller files from `app/Http/Controllers/`
- The `routes/api.php` file
- The `database/seeders/DatabaseSeeder.php` file
- The `.env.example` file

## Option 2: Quick Setup Commands

```bash
cd C:\Users\JM\Documents\basta_midwives2.0

# Remove incomplete backend
rmdir /s backend

# Create fresh Laravel
composer create-project laravel/laravel backend

# Navigate to backend
cd backend

# Install Sanctum
composer require laravel/sanctum
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"

# Setup environment
copy .env.example .env
php artisan key:generate

# Create database
# (Use MySQL Workbench or phpMyAdmin to create 'medimoms' database)

# Run migrations
php artisan migrate

# Seed database
php artisan db:seed

# Start server
php artisan serve
```

## Then Copy Your Custom Files

After fresh Laravel installation, copy these files I created:

**Migrations** (from basta_midwives2.0\backend\database\migrations\):
- 2024_01_01_000001_create_users_table.php
- 2024_01_01_000002_create_barangays_table.php
- 2024_01_01_000003_create_user_barangays_table.php
- 2024_01_01_000004_create_immunization_records_table.php
- 2024_01_01_000005_create_family_planning_records_table.php
- 2024_01_01_000006_create_maternal_care_records_table.php
- 2024_01_01_000007_create_senior_citizen_records_table.php
- 2024_01_01_000008_create_audit_logs_table.php

**Models** (to app\Models\):
- User.php
- Barangay.php
- ImmunizationRecord.php
- AuditLog.php

**Controllers** (to app\Http\Controllers\):
- AuthController.php
- ImmunizationRecordController.php

**Routes** (replace routes\api.php):
- api.php

**Seeder** (replace database\seeders\DatabaseSeeder.php):
- DatabaseSeeder.php

## Why This Approach?

Laravel has many interconnected files and configurations. Creating them manually is error-prone. Using `composer create-project` ensures:
- All dependencies are correct
- All config files are present
- All service providers are registered
- Directory structure is complete

## After Setup

```bash
php artisan migrate
php artisan db:seed
php artisan serve
```

Then proceed with frontend setup as normal.
