# QUICK FIX FOR .ENV FILE

## The Problem
Laravel 11 defaults to SQLite. You need MySQL.

## SOLUTION - Replace .env file

### Option 1: Manual Edit (FASTEST)

Open `.env` file and change these lines:

**FIND:**
```
DB_CONNECTION=sqlite
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=laravel
# DB_USERNAME=root
# DB_PASSWORD=
```

**REPLACE WITH:**
```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=medimoms
DB_USERNAME=root
DB_PASSWORD=your_mysql_password_here
```

Also change:
```
APP_NAME=Laravel
```
to:
```
APP_NAME=MediMoms
```

And add these lines at the end:
```
SANCTUM_STATEFUL_DOMAINS=localhost:5173
SESSION_DOMAIN=localhost
SPA_URL=http://localhost:5173
```

### Option 2: Use PowerShell (AUTOMATIC)

```powershell
cd C:\Users\JM\Documents\basta_midwives2.0\backend

# Backup current .env
Copy-Item .env .env.backup

# Create new .env with MySQL config
@"
APP_NAME=MediMoms
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost:8000

LOG_CHANNEL=stack
LOG_LEVEL=debug

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=medimoms
DB_USERNAME=root
DB_PASSWORD=

SESSION_DRIVER=file
SESSION_LIFETIME=120

CACHE_DRIVER=file
QUEUE_CONNECTION=sync

SANCTUM_STATEFUL_DOMAINS=localhost:5173
SESSION_DOMAIN=localhost
SPA_URL=http://localhost:5173

MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=
MAIL_PASSWORD=
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@medimoms.com
MAIL_FROM_NAME=MediMoms

BROADCAST_DRIVER=log
FILESYSTEM_DISK=local
"@ | Out-File -FilePath .env -Encoding UTF8

# Generate app key
php artisan key:generate
```

### Option 3: Copy from template

I created `.env.mysql` file with correct MySQL configuration.

```powershell
cd C:\Users\JM\Documents\basta_midwives2.0\backend
Copy-Item .env.mysql .env -Force
php artisan key:generate
```

## After Fixing .env

1. **Edit DB_PASSWORD** in .env if your MySQL has a password
2. **Create database:**
   ```sql
   CREATE DATABASE medimoms;
   ```
3. **Run migrations:**
   ```powershell
   php artisan migrate
   php artisan db:seed
   ```
4. **Start server:**
   ```powershell
   php artisan serve
   ```

## Why SQLite?

Laravel 11 changed defaults to SQLite for simplicity. But we need MySQL for production. Just change the .env file.

## Important Settings for MediMoms

```env
DB_CONNECTION=mysql          # Use MySQL not SQLite
DB_DATABASE=medimoms         # Your database name
SANCTUM_STATEFUL_DOMAINS=localhost:5173  # For API auth with React
SPA_URL=http://localhost:5173            # Your frontend URL
```

That's it! Just fix the .env and you're good to go.
