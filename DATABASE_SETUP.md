# Database Setup Instructions

## Quick Setup (Recommended)

Simply double-click the `setup-database.bat` file in the root directory.

This will:
1. Drop all existing tables
2. Run all migrations
3. Seed the database with initial data
4. Create all default users including Dr. JM

## Manual Setup

If you prefer to run commands manually:

```bash
cd backend
php artisan migrate:fresh
php artisan db:seed
php artisan config:clear
php artisan cache:clear
```

## Created Users

After running the setup, you'll have these users:

### Admin Account
- **Username:** admin
- **Email:** admin@medimoms.com
- **Password:** admin123
- **Role:** Admin

### Midwife Account 1
- **Username:** midwife1
- **Email:** midwife1@medimoms.com
- **Password:** midwife123
- **Role:** Midwife
- **Assigned Barangays:** Alipit, Bagumbayan, Bubukal

### Dr. JM Account (Your Account)
- **First Name:** Jay Mark
- **Middle Name:** Bohol
- **Last Name:** Del Valle
- **Username:** drjm
- **Email:** legenddelvalle42@gmail.com
- **Password:** Delvalle2005
- **Contact:** 09123456789
- **Role:** Midwife
- **Assigned Barangays:** Alipit, Bagumbayan, Bubukal, Calios, Duhat

## All 26 Barangays Created

1. Alipit
2. Bagumbayan
3. Bubukal
4. Calios
5. Duhat
6. Gatid
7. Jasaan
8. Labuin
9. Malinao
10. Oogong
11. Pagsawitan
12. Palasan
13. Patimbao
14. San Jose
15. San Juan
16. San Pablo Norte
17. San Pablo Sur
18. Santisima Cruz
19. Santo Angel Central
20. Santo Angel Norte
21. Santo Angel Sur
22. Poblacion I
23. Poblacion II
24. Poblacion III
25. Poblacion IV
26. Poblacion V

## Testing the Login

1. Make sure your Laravel backend is running:
   ```bash
   cd backend
   php artisan serve
   ```

2. Make sure your React frontend is running:
   ```bash
   cd frontend
   npm run dev
   ```

3. Go to http://localhost:5173/login

4. Login with Dr. JM credentials:
   - **Username or Email:** drjm (or legenddelvalle42@gmail.com)
   - **Password:** Delvalle2005

## Troubleshooting

If you get any errors:

1. Make sure MySQL is running
2. Check that the database `medimoms_system` exists
3. Verify your `.env` file has correct database credentials
4. Run `php artisan config:clear` in the backend folder

## Database Connection

The system is configured to use:
- **Database:** medimoms_system
- **Host:** 127.0.0.1
- **Port:** 3306
- **Username:** root
- **Password:** Delvalle2005

If you need to change these, edit the `backend/.env` file.
