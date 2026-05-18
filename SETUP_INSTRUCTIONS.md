# MediMoms 2.0 - Complete Setup Instructions

## 📋 Prerequisites

Before starting, ensure you have:
- **PHP 8.1+** installed
- **Composer** (PHP package manager)
- **Node.js 18+** and **npm**
- **MySQL 8.0+** or **PostgreSQL**
- **Git** (optional)

## 🚀 Quick Start Guide

### Step 1: Backend Setup (Laravel)

1. **Open terminal in the backend folder**
```bash
cd C:\Users\JM\Documents\basta_midwives2.0\backend
```

2. **Install Laravel (if not already installed globally)**
```bash
composer global require laravel/installer
```

3. **Install dependencies**
```bash
composer install
```

4. **Create environment file**
```bash
copy .env.example .env
```

5. **Edit `.env` file** - Open with notepad and configure:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=medimoms
DB_USERNAME=root
DB_PASSWORD=your_mysql_password
```

6. **Create database**
- Open MySQL Workbench or phpMyAdmin
- Create new database named `medimoms`

OR via command line:
```bash
mysql -u root -p
CREATE DATABASE medimoms;
exit;
```

7. **Generate application key**
```bash
php artisan key:generate
```

8. **Run migrations**
```bash
php artisan migrate
```

9. **Seed database with sample data (optional)**
```bash
php artisan db:seed
```

10. **Start Laravel server**
```bash
php artisan serve
```

Backend is now running at: **http://localhost:8000**

---

### Step 2: Frontend Setup (React + Vite)

1. **Open NEW terminal in the frontend folder**
```bash
cd C:\Users\JM\Documents\basta_midwives2.0\frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Create environment file**
```bash
copy .env.example .env
```

4. **Edit `.env` file**:
```env
VITE_API_URL=http://localhost:8000/api
```

5. **Start development server**
```bash
npm run dev
```

Frontend is now running at: **http://localhost:5173**

---

## 🎯 Testing the Application

### Default Login Credentials

After seeding, use these credentials:

**Admin Account:**
- Username: `admin`
- Password: `admin123`

**Midwife Account:**
- Username: `midwife1`
- Password: `midwife123`

### Test Registration Flow

1. Go to http://localhost:5173/register
2. Fill in the form with valid data
3. Select 1-3 barangays
4. Submit registration
5. Login as admin to approve the account
6. Login with the new midwife account

---

## 📁 Project Structure Overview

```
basta_midwives2.0/
├── backend/                    # Laravel API
│   ├── app/
│   │   ├── Http/Controllers/  # API Controllers
│   │   ├── Models/            # Database Models
│   │   └── Middleware/        # Custom Middleware
│   ├── database/
│   │   ├── migrations/        # Database Migrations
│   │   └── seeders/           # Database Seeders
│   ├── routes/
│   │   └── api.php           # API Routes
│   └── .env                   # Environment Config
│
└── frontend/                   # React App
    ├── src/
    │   ├── components/        # Reusable Components
    │   ├── pages/            # Page Components
    │   ├── services/         # API Services
    │   ├── types/            # TypeScript Types
    │   ├── hooks/            # Custom Hooks
    │   ├── store/            # State Management
    │   └── utils/            # Helper Functions
    ├── .env                   # Environment Config
    └── package.json          # Dependencies
```

---

## 🔧 Common Issues & Solutions

### Issue 1: "composer: command not found"
**Solution:** Install Composer from https://getcomposer.org/download/

### Issue 2: "php: command not found"
**Solution:** Install PHP from https://windows.php.net/download/

### Issue 3: Database connection failed
**Solution:** 
- Check MySQL is running
- Verify credentials in `.env`
- Ensure database `medimoms` exists

### Issue 4: Port 8000 already in use
**Solution:** Use different port:
```bash
php artisan serve --port=8001
```
Then update frontend `.env`:
```env
VITE_API_URL=http://localhost:8001/api
```

### Issue 5: CORS errors
**Solution:** Ensure both servers are running and check `config/cors.php` in backend

### Issue 6: npm install fails
**Solution:** 
```bash
npm cache clean --force
npm install
```

---

## 🗄️ Database Schema

### Main Tables:
- **users** - Admin and midwife accounts
- **barangays** - Barangay information
- **user_barangays** - Midwife-barangay assignments
- **immunization_records** - Child immunization data
- **family_planning_records** - FP client data
- **maternal_care_records** - Pregnant women data
- **senior_citizen_records** - Senior health data
- **audit_logs** - System activity logs

---

## 🎨 Key Features to Test

### As Admin:
1. Login with admin credentials
2. View dashboard with statistics
3. Approve pending midwife registrations
4. Manage barangays (Add/Edit/Delete)
5. View audit logs
6. Manage users

### As Midwife:
1. Register new account
2. Wait for admin approval
3. Login after approval
4. View assigned barangays
5. Add immunization records
6. Add family planning records
7. Add maternal care records
8. Add senior citizen records
9. Export records to Excel/PDF
10. Archive/restore records

---

## 📊 API Endpoints

### Authentication
- `POST /api/register` - Register midwife
- `POST /api/login` - Login
- `POST /api/logout` - Logout
- `GET /api/me` - Get current user

### Records (Protected)
- `GET /api/immunization-records` - List records
- `POST /api/immunization-records` - Create record
- `GET /api/immunization-records/{id}` - Get record
- `PUT /api/immunization-records/{id}` - Update record
- `DELETE /api/immunization-records/{id}` - Delete record
- `POST /api/immunization-records/{id}/toggle-status` - Archive/Restore

*(Similar endpoints for family-planning, maternal-care, senior-citizen)*

### Admin Only
- `GET /api/users` - List users
- `POST /api/users/{id}/approve` - Approve user
- `POST /api/users/{id}/reject` - Reject user
- `GET /api/audit-logs` - View logs

---

## 🔐 Security Features

✅ Password hashing with bcrypt
✅ CSRF protection
✅ SQL injection prevention (Eloquent ORM)
✅ XSS protection
✅ Input validation (frontend + backend)
✅ Token-based authentication
✅ Role-based access control
✅ Audit logging

---

## 📦 Building for Production

### Backend
```bash
cd backend
composer install --optimize-autoloader --no-dev
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### Frontend
```bash
cd frontend
npm run build
```

The build output will be in `frontend/dist/`

---

## 🆘 Need Help?

If you encounter issues:
1. Check the console for error messages
2. Verify all services are running (MySQL, Laravel, Vite)
3. Check `.env` configuration
4. Clear cache: `php artisan cache:clear`
5. Restart servers

---

## ✅ Verification Checklist

Before considering setup complete:

- [ ] MySQL database created
- [ ] Backend `.env` configured
- [ ] Migrations run successfully
- [ ] Laravel server running on port 8000
- [ ] Frontend `.env` configured
- [ ] npm dependencies installed
- [ ] Vite server running on port 5173
- [ ] Can access login page
- [ ] Can login with default credentials
- [ ] Dashboard loads correctly

---

## 🎓 Next Steps

1. **Customize the system** - Add your own features
2. **Add more barangays** - Use admin panel
3. **Create midwife accounts** - Test registration flow
4. **Add health records** - Test CRUD operations
5. **Generate reports** - Test export functionality
6. **Review audit logs** - Check system activity

---

**Congratulations! Your MediMoms 2.0 system is now ready to use! 🎉**
