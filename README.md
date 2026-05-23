# MediMoms 2.0 - Modern Health Records Management System

A comprehensive full-stack web application for managing community health records including immunization, family planning, maternal care, and senior citizen health programs.

![MediMoms 2.0](https://img.shields.io/badge/version-2.0-blue)
![Laravel](https://img.shields.io/badge/Laravel-10-red)
![React](https://img.shields.io/badge/React-18-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## 🏛️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Modern utility-first CSS
- **Framer Motion** - Smooth animations
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **React Toastify** - Toast notifications
- **Lucide React** - Beautiful icons

### Backend
- **Laravel 10** (PHP 8.1+)
- **MySQL** - Relational database
- **Laravel Sanctum** - API authentication
- **PhpSpreadsheet** - Excel export
- **DomPDF** - PDF generation
- RESTful API architecture
- Comprehensive validation
- Audit logging system

## ✨ Features

### 🔐 Authentication & Authorization
- ✅ Secure registration with admin approval workflow
- ✅ Login with username or email
- ✅ Role-based access control (Admin, Midwife)
- ✅ Password hashing with bcrypt
- ✅ Token-based authentication
- ✅ Session management

### 📊 Health Records Management

#### Immunization Records
- Complete vaccine tracking (BCG, Hepa B, Pentavalent, OPV, IPV, PCV, MMR, Rotavirus)
- Birth information tracking
- Parent details management
- Vaccine schedule monitoring
- Archive/restore functionality

#### Family Planning Records
- Client registration and tracking
- FP method monitoring
- Medical history recording
- Visit scheduling
- Comprehensive client profiles

#### Maternal Care Records
- Prenatal care tracking
- Pregnancy monitoring (LMP, EDD, gravida, parity)
- Vital signs recording (BP, weight, fundal height, FHR)
- Risk assessment
- TT immunization tracking
- Delivery planning

#### Senior Citizen Records
- Health screening management
- Chronic condition monitoring
- Vital signs tracking
- Medication management
- Checkup scheduling
- Emergency contact management

### 🏘️ Barangay Management
- ✅ Manage multiple barangays
- ✅ Population statistics tracking
- ✅ Health officer information
- ✅ Coverage area management
- ✅ Assign midwives to barangays (1-3 per midwife)

### 👥 User Management (Admin)
- ✅ Approve/reject midwife registrations
- ✅ Manage user accounts
- ✅ Assign barangays to midwives
- ✅ Activate/deactivate accounts
- ✅ View user activity

### 📈 Reports & Analytics
- ✅ Dashboard with real-time statistics
- ✅ Export to Excel with formatting
- ✅ Export to PDF with proper layout
- ✅ Date range filtering
- ✅ Barangay-specific reports
- ✅ Complete audit trail

## 🚀 Quick Start

### Prerequisites
- PHP 8.1 or higher
- Composer
- Node.js 18+ and npm
- MySQL 8.0+

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/basta_midwives2.0.git
cd basta_midwives2.0
```

2. **Backend Setup**
```bash
cd backend
composer install
copy .env.example .env
# Configure your database in .env
php artisan key:generate
php artisan migrate
php artisan db:seed
php artisan storage:link
php artisan serve
```

3. **Frontend Setup**
```bash
cd frontend
npm install
copy .env.example .env
# Configure API URL in .env
npm run dev
```

4. **Access the application**
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000

### Default Credentials

**Admin Account:**
- Username: `admin`
- Email: `admin@medimoms.com`
- Password: `admin123`

**Midwife Account:**
- Username: `midwife1`
- Email: `midwife1@medimoms.com`
- Password: `midwife123`

## 📁 Project Structure

```
basta_midwives2.0/
├── backend/                    # Laravel API
│   ├── app/
│   │   ├── Http/Controllers/  # API Controllers
│   │   ├── Models/            # Eloquent Models
│   │   ├── Mail/              # Email Templates
│   │   └── Middleware/        # Custom Middleware
│   ├── database/
│   │   ├── migrations/        # Database Migrations
│   │   └── seeders/           # Database Seeders
│   ├── routes/api.php         # API Routes
│   └── .env                   # Environment Config
│
└── frontend/                   # React App
    ├── src/
    │   ├── components/        # Reusable Components
    │   ├── pages/            # Page Components
    │   │   ├── auth/         # Login, Register
    │   │   ├── admin/        # Admin Pages
    │   │   └── midwife/      # Midwife Pages
    │   ├── services/         # API Services
    │   ├── types/            # TypeScript Types
    │   └── utils/            # Helper Functions
    └── .env                   # Environment Config
```

## 🎯 Key Features Implementation

### Modern UI/UX
- Clean and professional design
- Responsive layout for all devices
- Smooth animations with Framer Motion
- Intuitive navigation
- Real-time form validation
- Toast notifications for user feedback

### Data Management
- Pagination (15 records per page)
- Advanced search and filtering
- Sort by multiple columns
- Archive/restore functionality
- Bulk operations support
- Data export (Excel/PDF)

### Security
- ✅ CSRF protection
- ✅ SQL injection prevention (Eloquent ORM)
- ✅ XSS protection
- ✅ Password hashing (bcrypt)
- ✅ Input validation & sanitization
- ✅ Token-based authentication
- ✅ Role-based access control
- ✅ Audit logging

## 📚 Documentation

For detailed setup instructions, see [SETUP_INSTRUCTIONS.md](SETUP_INSTRUCTIONS.md)

### API Documentation

All API endpoints follow RESTful conventions:

**Authentication**
- `POST /api/register` - Register new midwife
- `POST /api/login` - Login
- `POST /api/logout` - Logout
- `GET /api/me` - Get current user

**Records** (immunization, family-planning, maternal-care, senior-citizen)
- `GET /api/{module}-records` - List records (paginated)
- `POST /api/{module}-records` - Create record
- `GET /api/{module}-records/{id}` - Get record
- `PUT /api/{module}-records/{id}` - Update record
- `DELETE /api/{module}-records/{id}` - Delete record
- `PUT /api/{module}-records/{id}/toggle-status` - Archive/Restore

**Admin**
- `GET /api/users` - List users
- `POST /api/users/{id}/approve` - Approve user
- `GET /api/audit-logs` - View audit logs

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

Build output will be in `frontend/dist/`

## 🔧 Configuration

### Backend Environment Variables
```env
APP_NAME=MediMoms
APP_ENV=production
APP_URL=https://your-domain.com

DB_CONNECTION=mysql
DB_DATABASE=medimoms
DB_USERNAME=root
DB_PASSWORD=

SANCTUM_STATEFUL_DOMAINS=your-domain.com
SESSION_DOMAIN=.your-domain.com
```

### Frontend Environment Variables
```env
VITE_API_URL=https://your-domain.com/api
VITE_APP_NAME=MediMoms
```

## 🐛 Troubleshooting

### Common Issues

**CORS Errors**
- Ensure `SANCTUM_STATEFUL_DOMAINS` includes your frontend domain
- Check `config/cors.php` settings

**Database Connection Failed**
- Verify MySQL is running
- Check credentials in `.env`
- Ensure database exists

**Port Already in Use**
```bash
# Backend
php artisan serve --port=8001

# Frontend
npm run dev -- --port=5174
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Authors

- **Your Name** - Initial work

## 🙏 Acknowledgments

- Built with Laravel and React
- Icons by Lucide
- UI components styled with Tailwind CSS
- Animations powered by Framer Motion

## 📞 Support

For issues or questions:
- Create an issue on GitHub
- Email: support@medimoms.com

---

**MediMoms 2.0** - Empowering community health workers with modern technology 💚
