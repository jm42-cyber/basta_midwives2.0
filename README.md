# MediMoms 2.0 - Modern Full-Stack Health Records System

A production-ready full-stack web application for managing health records including immunization, family planning, maternal care, and senior citizen records.

## 🏗️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for blazing fast development
- **Tailwind CSS** for modern UI
- **React Router** for navigation
- **Axios** for API calls
- **React Hook Form** + **Zod** for validation
- **React Query** for data fetching
- **Zustand** for state management
- **React Toastify** for notifications

### Backend
- **Laravel 10** (PHP 8.1+)
- **MySQL** database
- **Laravel Sanctum** for authentication
- RESTful API architecture
- Comprehensive validation
- Audit logging system

## 📋 Features

### Authentication & Authorization
- ✅ Register with email verification
- ✅ Login with username or email
- ✅ Role-based access (Admin, Midwife)
- ✅ Password reset functionality
- ✅ Persistent sessions with tokens
- ✅ Admin approval workflow

### Health Records Management
- ✅ **Immunization Records** - Complete vaccine tracking with birth info
- ✅ **Family Planning Records** - Comprehensive FP method tracking
- ✅ **Maternal Care Records** - Prenatal care and pregnancy monitoring
- ✅ **Senior Citizen Records** - Health screening and chronic condition tracking

### Barangay Management
- ✅ Manage multiple barangays
- ✅ Assign midwives to barangays (1-3 per midwife)
- ✅ Population statistics
- ✅ Health officer information

### User Management (Admin)
- ✅ Approve/reject midwife registrations
- ✅ Manage user accounts
- ✅ Assign barangays to midwives
- ✅ View user activity

### Audit & Reporting
- ✅ Complete audit trail
- ✅ Export to Excel/PDF
- ✅ Date range filtering
- ✅ Barangay-specific reports

## 🚀 Installation & Setup

### Prerequisites
- PHP 8.1 or higher
- Composer
- Node.js 18+ and npm
- MySQL 8.0+
- Git

### Backend Setup

1. **Navigate to backend directory**
```bash
cd backend
```

2. **Install PHP dependencies**
```bash
composer install
```

3. **Environment configuration**
```bash
copy .env.example .env
```

4. **Configure database in `.env`**
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=medimoms
DB_USERNAME=root
DB_PASSWORD=your_password
```

5. **Generate application key**
```bash
php artisan key:generate
```

6. **Run migrations**
```bash
php artisan migrate
```

7. **Seed database (optional)**
```bash
php artisan db:seed
```

8. **Start Laravel server**
```bash
php artisan serve
```
Backend will run on `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory**
```bash
cd frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment configuration**
```bash
copy .env.example .env
```

4. **Configure API URL in `.env`**
```env
VITE_API_URL=http://localhost:8000/api
```

5. **Start development server**
```bash
npm run dev
```
Frontend will run on `http://localhost:5173`

## 📁 Project Structure

### Backend Structure
```
backend/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── AuthController.php
│   │   │   ├── ImmunizationRecordController.php
│   │   │   ├── FamilyPlanningRecordController.php
│   │   │   ├── MaternalCareRecordController.php
│   │   │   ├── SeniorCitizenRecordController.php
│   │   │   ├── BarangayController.php
│   │   │   ├── UserController.php
│   │   │   └── AuditLogController.php
│   │   ├── Middleware/
│   │   │   └── AdminMiddleware.php
│   │   └── Requests/
│   │       ├── StoreImmunizationRequest.php
│   │       └── ...
│   ├── Models/
│   │   ├── User.php
│   │   ├── Barangay.php
│   │   ├── ImmunizationRecord.php
│   │   ├── FamilyPlanningRecord.php
│   │   ├── MaternalCareRecord.php
│   │   ├── SeniorCitizenRecord.php
│   │   └── AuditLog.php
│   └── Services/
│       └── AuditService.php
├── database/
│   ├── migrations/
│   └── seeders/
├── routes/
│   └── api.php
└── .env
```

### Frontend Structure
```
frontend/
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   └── Table.tsx
│   │   ├── layout/
│   │   │   ├── Navbar.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── Layout.tsx
│   │   └── forms/
│   │       ├── ImmunizationForm.tsx
│   │       └── ...
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── Login.tsx
│   │   │   └── Register.tsx
│   │   ├── dashboard/
│   │   │   ├── AdminDashboard.tsx
│   │   │   └── MidwifeDashboard.tsx
│   │   ├── immunization/
│   │   ├── family-planning/
│   │   ├── maternal-care/
│   │   └── senior-citizen/
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useImmunization.ts
│   │   └── ...
│   ├── services/
│   │   ├── api.ts
│   │   ├── authService.ts
│   │   └── recordService.ts
│   ├── types/
│   │   ├── auth.ts
│   │   ├── records.ts
│   │   └── index.ts
│   ├── store/
│   │   └── authStore.ts
│   ├── utils/
│   │   ├── validation.ts
│   │   └── helpers.ts
│   ├── App.tsx
│   └── main.tsx
├── .env
└── package.json
```

## 🔐 Default Credentials

After seeding, you can login with:

**Admin Account:**
- Username: `admin`
- Password: `admin123`

**Midwife Account:**
- Username: `midwife1`
- Password: `midwife123`

## 🎨 Key Features Implementation

### 1. Authentication Flow
- User registers → Email verification → Admin approval → Login
- Secure password hashing with bcrypt
- Token-based authentication with Laravel Sanctum
- Automatic token refresh

### 2. CRUD Operations
- All records support Create, Read, Update, Delete
- Soft delete (archive/restore) functionality
- Comprehensive validation on both frontend and backend
- Real-time form validation with Zod

### 3. Role-Based Access
- Admin: Full system access
- Midwife: Access only to assigned barangays
- Middleware protection on routes
- Frontend route guards

### 4. Data Export
- Export to Excel with formatting
- Export to PDF with proper layout
- Date range filtering
- Barangay-specific exports

### 5. Audit Trail
- All actions logged automatically
- User identification
- Timestamp tracking
- Action description

## 🧪 Testing

### Backend Tests
```bash
cd backend
php artisan test
```

### Frontend Tests
```bash
cd frontend
npm run test
```

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

## 🔧 Environment Variables

### Backend (.env)
```env
APP_NAME=MediMoms
APP_ENV=production
APP_DEBUG=false
APP_URL=https://your-domain.com

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=medimoms
DB_USERNAME=root
DB_PASSWORD=

SANCTUM_STATEFUL_DOMAINS=your-domain.com
SESSION_DOMAIN=.your-domain.com
SPA_URL=https://your-domain.com

MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
```

### Frontend (.env)
```env
VITE_API_URL=https://your-domain.com/api
VITE_APP_NAME=MediMoms
```

## 📝 API Documentation

### Authentication Endpoints
- `POST /api/register` - Register new midwife
- `POST /api/login` - Login
- `POST /api/logout` - Logout
- `GET /api/me` - Get current user

### Record Endpoints
- `GET /api/immunization-records` - List records
- `POST /api/immunization-records` - Create record
- `GET /api/immunization-records/{id}` - Get single record
- `PUT /api/immunization-records/{id}` - Update record
- `DELETE /api/immunization-records/{id}` - Delete record
- `POST /api/immunization-records/{id}/toggle-status` - Archive/Restore

*(Similar endpoints for family-planning, maternal-care, senior-citizen)*

### Admin Endpoints
- `GET /api/users` - List users
- `POST /api/users/{id}/approve` - Approve user
- `POST /api/users/{id}/reject` - Reject user
- `GET /api/audit-logs` - View audit logs

## 🛡️ Security Features

- ✅ CSRF protection
- ✅ SQL injection prevention (Eloquent ORM)
- ✅ XSS protection
- ✅ Password hashing (bcrypt)
- ✅ Input validation & sanitization
- ✅ Rate limiting
- ✅ Secure headers
- ✅ Token-based authentication

## 🐛 Troubleshooting

### Common Issues

**1. CORS errors**
- Ensure `SANCTUM_STATEFUL_DOMAINS` in backend `.env` matches frontend URL
- Check `config/cors.php` settings

**2. Database connection failed**
- Verify MySQL is running
- Check database credentials in `.env`
- Ensure database exists

**3. Token mismatch**
- Clear browser cookies
- Restart both servers
- Check `SESSION_DOMAIN` configuration

## 📞 Support

For issues or questions:
- Create an issue on GitHub
- Contact: support@medimoms.com

## 📄 License

MIT License - feel free to use for your projects

## 👨‍💻 Author

Created by: Your Name
School Project: MediMoms Health Records System

---

**Note:** This is a modernized version of the original Flask-based MediMoms system, rebuilt with React + Laravel for production use.
