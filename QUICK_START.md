# Quick Start Guide for Classmates 🚀

## For Your Classmates Who Want to Run This Project

Hey! If you got this project from a classmate, here's how to set it up on YOUR computer.

## Prerequisites (Install These First!)

Before running the setup script, make sure you have:

1. **PHP 8.1+** - Download from: https://windows.php.net/download/
   - Get the "Thread Safe" version
   - Extract to `C:\php`
   - Add `C:\php` to your system PATH

2. **Composer** - Download from: https://getcomposer.org/download/
   - Run the Windows installer
   - Restart your terminal after installation

3. **Node.js 18+** - Download from: https://nodejs.org/
   - Download the LTS version
   - Run the installer (npm comes with it)

4. **MySQL 8.0+** - Download from: https://dev.mysql.com/downloads/installer/
   - Install MySQL Server
   - Remember your root password!

## Easy Setup (Automated)

1. **Copy the project folder** to your computer (anywhere you want)

2. **Open PowerShell** in the project folder:
   - Right-click the folder → "Open in Terminal" or "Open PowerShell window here"

3. **Run the setup script:**
   ```powershell
   .\setup.ps1
   ```

4. **Follow the instructions** that appear after the script finishes

That's it! The script will:
- ✅ Check if you have all required software
- ✅ Install all backend dependencies
- ✅ Install all frontend dependencies
- ✅ Create configuration files
- ✅ Tell you what to do next

## After Running setup.ps1

### Step 1: Configure Database

1. Open `backend\.env` in Notepad
2. Find these lines and update them:
   ```
   DB_DATABASE=medimoms
   DB_USERNAME=root
   DB_PASSWORD=your_mysql_password_here
   ```

### Step 2: Create Database

Open MySQL Workbench or Command Prompt and run:
```sql
CREATE DATABASE medimoms;
```

### Step 3: Run Migrations

Open terminal in the `backend` folder:
```bash
php artisan migrate
php artisan db:seed
```

### Step 4: Start the Servers

**Terminal 1 (Backend):**
```bash
cd backend
php artisan serve
```
Leave this running!

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```
Leave this running too!

### Step 5: Open the App

Go to: http://localhost:5173

**Login with:**
- Username: `admin`
- Password: `admin123`

## Troubleshooting

### "setup.ps1 cannot be loaded because running scripts is disabled"

Run this in PowerShell (as Administrator):
```powershell
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### "composer: command not found"

Restart your terminal after installing Composer.

### "Port 8000 is already in use"

Someone else is using that port. Use a different one:
```bash
php artisan serve --port=8001
```
Then update `frontend\.env`:
```
VITE_API_URL=http://localhost:8001/api
```

### "npm install fails"

Try:
```bash
npm cache clean --force
npm install
```

### Database connection error

- Make sure MySQL is running
- Check your password in `backend\.env`
- Make sure database `medimoms` exists

## Need More Help?

Check these files:
- `SETUP_INSTRUCTIONS.md` - Detailed manual setup
- `README.md` - Full project documentation

## What This Project Does

MediMoms 2.0 is a health records management system for:
- 💉 Immunization Records
- 👶 Maternal Care Records
- 👨‍👩‍👧‍👦 Family Planning Records
- 👴 Senior Citizen Records

Built with:
- **Backend:** Laravel 10 (PHP)
- **Frontend:** React 18 + TypeScript + Vite
- **Database:** MySQL
- **Styling:** Tailwind CSS

## Project Structure

```
basta_midwives2.0/
├── backend/          # Laravel API (PHP)
├── frontend/         # React App (TypeScript)
├── setup.ps1         # Automated setup script
└── README.md         # Full documentation
```

---

**Good luck with your setup! If you have issues, ask your classmate who gave you this project. 😊**
