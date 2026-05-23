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
cd C:\Projects\basta_midwives2.0\backend
```

2. **Install dependencies**
```bash
composer install
```

3. **Create environment file**
```bash
copy .env.example .env
```

4. **Edit `.env` file** - Open with notepad and configure:
```env
APP_NAME=MediMoms
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=medimoms
DB_USERNAME=root
DB_PASSWORD=your_mysql_password

SANCTUM_STATEFUL_DOMAINS=localhost:5173
SESSION_DOMAIN=localhost
SPA_URL=http://localhost:5173
```

5. **Create database**
- Open MySQL Workbench or phpMyAdmin
- Create new database named `medimoms`

OR via command line:
```bash
mysql -u root -p
CREATE DATABASE medimoms;
exit;
```

6. **Generate application key**
```bash
php artisan key:generate
```

7. **Run migrations**
```bash
php artisan migrate
```

8. **Seed database with sample data (optional)**
```bash
php artisan db:seed
```

9. **Create storage link**
```bash
php artisan storage:link
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
cd C:\Projects\basta_midwives2.0\frontend
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
VITE_APP_NAME=MediMoms
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
- Email: `admin@medimoms.com`
- Password: `admin123`

**Midwife Account:**
- Username: `midwife1`
- Email: `midwife1@medimoms.com`
- Password: `midwife123`

### Test Registration Flow

1. Go to http://localhost:5173/register
2. Fill in the form with valid data:
   - First Name, Middle Name, Last Name
   - Username (unique, 4+ characters)
   - Email (valid format)
   - Contact Number (09XXXXXXXXX format)
   - Password (8+ characters, must include uppercase and number)
3. Select 1-3 barangays from the list
4. Submit registration
5. Login as admin to approve the account at http://localhost:5173/admin/pending-accounts
6. Login with the new midwife account

### Test Key Features

**As Admin:**
1. View dashboard with statistics
2. Manage barangays (view, edit population data)
3. Approve/reject pending midwife accounts
4. Manage existing midwives (edit, assign barangays, activate/deactivate)
5. View audit logs
6. Generate reports

**As Midwife:**
1. View dashboard with assigned barangays
2. Manage Immunization Records (add, edit, view, archive)
3. Manage Family Planning Records
4. Manage Maternal Care Records
5. Manage Senior Citizen Records
6. Export records to Excel/PDF
7. View all patients across programs
8. Search and filter records

---

## 📁 Project Structure Overview

```
basta_midwives2.0/
├── backend/                    # Laravel API
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/       # API Controllers
│   │   │   │   ├── AuthController.php
│   │   │   │   ├── UserController.php
│   │   │   │   ├── BarangayController.php
│   │   │   │   ├── ImmunizationRecordController.php
│   │   │   │   ├── FamilyPlanningRecordController.php
│   │   │   │   ├── MaternalCareRecordController.php
│   │   │   │   ├── SeniorCitizenRecordController.php
│   │   │   │   ├── AuditLogController.php
│   │   │   │   └── ReportController.php
│   │   │   └── Middleware/        # Custom Middleware
│   │   │       └── AdminMiddleware.php
│   │   ├── Models/            # Database Models
│   │   │   ├── User.php
│   │   │   ├── Barangay.php
│   │   │   ├── ImmunizationRecord.php
│   │   │   ├── FamilyPlanningRecord.php
│   │   │   ├── MaternalCareRecord.php
│   │   │   ├── SeniorCitizenRecord.php
│   │   │   └── AuditLog.php
│   │   └── Mail/              # Email Templates
│   ├── database/
│   │   ├── migrations/        # Database Migrations
│   │   └── seeders/           # Database Seeders
│   ├── routes/
│   │   └── api.php           # API Routes
│   ├── config/
│   │   ├── cors.php          # CORS Configuration
│   │   └── sanctum.php       # Auth Configuration
│   └── .env                   # Environment Config
│
└── frontend/                   # React App
    ├── src/
    │   ├── components/        # Reusable Components
    │   │   ├── AdminLayout.tsx
    │   │   └── DashboardLayout.tsx
    │   ├── pages/            # Page Components
    │   │   ├── auth/
    │   │   │   ├── Login.tsx
    │   │   │   └── Register.tsx
    │   │   ├── admin/
    │   │   │   ├── AdminDashboard.tsx
    │   │   │   ├── ManageMidwives.tsx
    │   │   │   ├── ManageBarangay.tsx
    │   │   │   └── PendingAccounts.tsx
    │   │   └── midwife/
    │   │       ├── MidwifeDashboard.tsx
    │   │       ├── ImmunizationRecords.tsx
    │   │       ├── FamilyPlanningRecords.tsx
    │   │       ├── MaternalCareRecords.tsx
    │   │       └── SeniorCitizenRecords.tsx
    │   ├── services/         # API Services
    │   │   ├── api.ts
    │   │   └── authService.ts
    │   ├── types/            # TypeScript Types
    │   │   └── index.ts
    │   ├── hooks/            # Custom Hooks
    │   ├── store/            # State Management
    │   ├── utils/            # Helper Functions
    │   ├── App.tsx
    │   └── main.tsx
    ├── .env                   # Environment Config
    └── package.json          # Dependencies
```

---

## 🔧 Common Issues & Solutions

### Issue 1: "composer: command not found"
**Solution:** Install Composer from https://getcomposer.org/download/
- Download and run the Windows installer
- Restart your terminal after installation

### Issue 2: "php: command not found"
**Solution:** Install PHP from https://windows.php.net/download/
- Download PHP 8.1+ (Thread Safe version)
- Extract to C:\php
- Add C:\php to system PATH
- Enable required extensions in php.ini:
  - extension=pdo_mysql
  - extension=mbstring
  - extension=openssl
  - extension=fileinfo

### Issue 3: Database connection failed
**Solution:** 
- Check MySQL is running (open MySQL Workbench or check services)
- Verify credentials in `.env` match your MySQL setup
- Ensure database `medimoms` exists
- Test connection: `mysql -u root -p`

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
**Solution:** 
- Ensure both servers are running
- Check `SANCTUM_STATEFUL_DOMAINS` in backend `.env` includes `localhost:5173`
- Verify `config/cors.php` has correct settings
- Clear config cache: `php artisan config:clear`

### Issue 6: npm install fails
**Solution:** 
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Issue 7: Migration errors
**Solution:**
```bash
php artisan migrate:fresh
# Or if you want to keep data:
php artisan migrate:rollback
php artisan migrate
```

### Issue 8: 419 CSRF Token Mismatch
**Solution:**
- Clear browser cookies for localhost
- Check `SESSION_DOMAIN` in backend `.env`
- Restart both servers
- Clear Laravel cache: `php artisan cache:clear`

### Issue 9: Vite server won't start
**Solution:**
- Check if port 5173 is available
- Try: `npm run dev -- --port 5174`
- Delete node_modules and reinstall

### Issue 10: Images/Files not uploading
**Solution:**
```bash
php artisan storage:link
```
Check `storage/app/public` folder exists and has write permissions

---

## 🗄️ Database Schema

### Main Tables:

**users**
- id, first_name, middle_name, last_name
- username, email, password
- contact_number, role (admin/midwife)
- status (pending/approved/rejected/inactive)
- created_at, updated_at

**barangays**
- id, name, address, contact_number
- barangay_captain, health_officer
- population, population_male, population_female, population_children
- coverage_area, created_at, updated_at

**user_barangays** (Pivot Table)
- user_id, barangay_id
- Links midwives to their assigned barangays (1-3 per midwife)

**immunization_records**
- id, child_name, date_of_birth, sex, place_of_birth
- mother_name, father_name, address, barangay_id
- birth_weight, birth_length, contact_number
- vaccine fields (bcg_date, hepa_b_date, pentavalent_dates, opv_dates, etc.)
- status (active/archived), created_by, created_at, updated_at

**family_planning_records**
- id, client_name, date_of_birth, age, address, barangay_id
- contact_number, civil_status, spouse_name
- number_of_living_children, plan_more_children
- method_used, date_started, medical_history
- status (active/archived), created_by, created_at, updated_at

**maternal_care_records**
- id, first_name, middle_name, last_name
- date_of_birth, age, address, barangay_id
- contact_number, emergency_contact, emergency_name
- lmp, edd, gravida, parity, abortion, living_children
- blood_type, risk_level, prenatal_visits
- weight, height, blood_pressure, fundal_height, fetal_heart_rate
- tt_immunized, iron_supplementation, delivery_plan
- complications, medications, notes
- status (active/archived), created_by, created_at, updated_at

**senior_citizen_records**
- id, first_name, middle_name, last_name
- date_of_birth, age, sex, address, barangay_id
- contact_number, emergency_contact, emergency_name
- medical_history, current_medications
- blood_pressure, blood_sugar, weight, height, bmi
- mobility_status, living_arrangement
- philhealth_member, pension_type
- last_checkup_date, next_checkup_date, notes
- status (active/archived), created_by, created_at, updated_at

**audit_logs**
- id, user_id, action, description
- ip_address, user_agent
- created_at

### Relationships:
- User hasMany ImmunizationRecords (as creator)
- User belongsToMany Barangays (through user_barangays)
- Barangay hasMany ImmunizationRecords
- Barangay hasMany FamilyPlanningRecords
- Barangay hasMany MaternalCareRecords
- Barangay hasMany SeniorCitizenRecords
- All records belongTo User (creator)
- All records belongTo Barangay

---

## 🎨 Key Features to Test

### As Admin:
1. **Dashboard**
   - View total statistics (midwives, barangays, records)
   - See recent activity
   - Quick access to all modules

2. **Manage Midwives**
   - View all midwives with status badges
   - Edit midwife information
   - Assign/reassign barangays (1-3 per midwife)
   - Activate/deactivate accounts
   - View assigned barangays for each midwife

3. **Manage Barangays**
   - View all barangays with population data
   - Edit barangay information
   - Update population statistics
   - Manage officials (captain, health officer)
   - View coverage area

4. **Pending Accounts**
   - Review new midwife registrations
   - Approve or reject applications
   - View applicant details
   - Assign initial barangays upon approval

5. **Audit Logs**
   - View all system activities
   - Filter by user, action, date
   - Track record changes
   - Monitor login attempts

6. **Reports**
   - Generate system-wide reports
   - Export data to Excel/PDF
   - Filter by date range and barangay

### As Midwife:
1. **Dashboard**
   - View assigned barangays
   - See record counts per program
   - Quick access to add new records
   - Recent activity summary

2. **Immunization Records**
   - Add new child immunization records
   - Track vaccine schedules (BCG, Hepa B, Pentavalent, OPV, IPV, PCV, MMR, Rotavirus)
   - Edit existing records
   - View complete immunization history
   - Archive completed records
   - Export to Excel/PDF
   - Search and filter by name, barangay

3. **Family Planning Records**
   - Register new FP clients
   - Track FP methods used
   - Monitor client visits
   - Record medical history
   - Update client information
   - Archive inactive clients
   - Generate FP reports

4. **Maternal Care Records**
   - Register pregnant women
   - Track prenatal visits
   - Monitor pregnancy progress (LMP, EDD, gravida, parity)
   - Record vital signs (BP, weight, fundal height, FHR)
   - Assess risk levels
   - Track immunizations (TT)
   - Plan delivery
   - Archive post-delivery records

5. **Senior Citizen Records**
   - Register senior citizens
   - Track health screenings
   - Monitor chronic conditions
   - Record vital signs and BMI
   - Track medications
   - Schedule checkups
   - Manage emergency contacts

6. **All Patients**
   - View all patients across programs
   - Search by name or program
   - Quick access to patient records
   - Filter by barangay

7. **Export & Reports**
   - Export records to Excel with formatting
   - Generate PDF reports
   - Filter by date range
   - Filter by barangay
   - Include/exclude archived records

---

## 📊 API Endpoints

### Authentication
- `POST /api/register` - Register new midwife
- `POST /api/login` - Login with username/email
- `POST /api/logout` - Logout
- `GET /api/me` - Get current user

### Users (Admin Only)
- `GET /api/users` - List all users
- `POST /api/users` - Create user
- `PUT /api/users/{id}` - Update user
- `POST /api/users/{id}/approve` - Approve user
- `POST /api/users/{id}/reject` - Reject user

### Barangays
- `GET /api/barangays` - List barangays
- `PUT /api/barangays/{id}` - Update barangay

### All Record Endpoints (immunization, family-planning, maternal-care, senior-citizen)
- `GET /api/{module}-records` - List records (paginated, 15 per page)
- `POST /api/{module}-records` - Create record
- `GET /api/{module}-records/{id}` - Get record
- `PUT /api/{module}-records/{id}` - Update record
- `DELETE /api/{module}-records/{id}` - Delete record
- `PUT /api/{module}-records/{id}/toggle-status` - Archive/Restore
- `GET /api/{module}-records/export/excel` - Export Excel
- `GET /api/{module}-records/export/pdf` - Export PDF

### Query Parameters
- `page` - Page number
- `per_page` - Records per page (default: 15)
- `search` - Search by name
- `barangay` - Filter by barangay
- `status` - Filter by status

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
