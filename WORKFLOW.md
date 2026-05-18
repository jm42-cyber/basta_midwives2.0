# MediMoms - Healthcare Management System
## Complete Application Workflow Documentation

---

## 1. PROJECT OVERVIEW

### 1.1 Application Name
**MediMoms** (also referred to as "Basta Midwives 2.0")

### 1.2 Purpose
MediMoms is a comprehensive healthcare management system designed specifically for barangay health workers (midwives) and administrators in the Philippines. The system digitizes and streamlines the management of maternal care, child immunization, family planning, and senior citizen health records.

### 1.3 Target Users
1. **Midwives** - Barangay health workers who:
   - Manage patient records across multiple health programs
   - Track immunization schedules and maternal care visits
   - Monitor family planning clients and senior citizens
   - Generate reports and export data
   - Receive and respond to alerts from administrators

2. **Administrators** - System administrators who:
   - Oversee all barangay operations and midwife activities
   - Approve or reject midwife account registrations
   - Manage barangay information and assignments
   - View system-wide statistics and analytics
   - Generate comprehensive reports across all barangays
   - Monitor audit logs and system security
   - Send alerts and announcements to midwives

### 1.4 Core Objectives
- **Digitize Health Records**: Replace paper-based record keeping with a centralized digital system
- **Improve Data Accuracy**: Reduce errors through structured data entry and validation
- **Enable Real-time Monitoring**: Provide instant access to patient information and health statistics
- **Facilitate Reporting**: Generate Excel and PDF reports for government compliance
- **Enhance Coordination**: Enable communication between administrators and midwives through alerts
- **Track Accountability**: Maintain audit logs of all system activities
- **Support Decision Making**: Provide visual analytics and trends through charts and dashboards

### 1.5 Key Features Summary
- Multi-program health record management (4 programs)
- Role-based access control (Admin vs Midwife)
- Geographic barangay-based data organization
- Real-time dashboard with statistics and charts
- Export functionality (Excel and PDF)
- Alert/notification system
- Audit logging for security and compliance
- Responsive web interface with modern UI/UX
- Session management and authentication

### 1.6 Technology Stack (Current Implementation)
**Frontend:**
- React 19.2.4 with TypeScript
- Vite (build tool)
- TailwindCSS (styling)
- React Router DOM (navigation)
- Zustand (state management)
- React Query (data fetching)
- Framer Motion (animations)
- Recharts (data visualization)
- React Leaflet (maps)
- React Hook Form + Zod (form validation)
- Axios (HTTP client)
- React Toastify (notifications)

**Backend:**
- Laravel 12.0 (PHP 8.2+)
- MySQL Database
- Laravel Sanctum (API authentication)
- DomPDF (PDF generation)
- PhpSpreadsheet (Excel generation)

**Development Environment:**
- Node.js + npm (frontend)
- Composer (PHP dependencies)
- MySQL Server
- Git version control

---

## 2. ALL SCREENS/PAGES

### 2.1 Public Pages (Unauthenticated)

#### 2.1.1 Landing Page (`/`)
- **Purpose**: Marketing page showcasing the system's features and benefits
- **Components**:
  - Navigation bar with Sign In and Get Started buttons
  - Hero section with animated background and statistics (26 Barangays, 4 Programs, 100% Coverage)
  - Features section highlighting 4 health programs (Immunization, Maternal Care, Family Planning, Senior Care)
  - Benefits section (Secure & Private, Export Reports, Multi-Barangay, DOH Compliant)
  - Call-to-action section
  - Footer with program links and contact information
- **Actions**: Navigate to Login, Register, or Program Info pages

#### 2.1.2 Login Page (`/login`)
- **Purpose**: User authentication for midwives and administrators
- **Fields**:
  - Username or Email (text input)
  - Password (password input with show/hide toggle)
  - Remember Me checkbox
- **Actions**: 
  - Submit login credentials
  - Navigate to Forgot Password
  - Navigate to Register
- **Validation**: Required fields, server-side authentication
- **Success**: Redirect to appropriate dashboard based on role

#### 2.1.3 Register Page (`/register`)
- **Purpose**: New midwife account registration (requires admin approval)
- **Fields**:
  - First Name, Middle Name (optional), Last Name
  - Username (unique)
  - Email (unique)
  - Contact Number (11-digit Philippine mobile format)
  - Password & Password Confirmation
  - Barangay Assignment (multi-select, max 3)
- **Actions**: Submit registration, Navigate to Login
- **Validation**: 
  - All required fields
  - Email format validation
  - Password strength (min 8 characters)
  - Password confirmation match
  - Unique username/email/contact
- **Success**: Account created with "pending" status, awaits admin approval

#### 2.1.4 Forgot Password Page (`/forgot-password`)
- **Purpose**: Password reset request
- **Fields**: Email address
- **Actions**: Send reset link to email
- **Flow**: Email sent → User clicks link → Reset password

#### 2.1.5 Program Information Pages
- **Immunization Info** (`/programs/immunization`)
- **Maternal Care Info** (`/programs/maternal-care`)
- **Family Planning Info** (`/programs/family-planning`)
- **Senior Care Info** (`/programs/senior-care`)
- **Purpose**: Public information about each health program
- **Content**: Program details, benefits, requirements

#### 2.1.6 Documentation Page (`/documentation`)
- **Purpose**: System documentation and user guides
- **Content**: How-to guides, FAQs, system features

---

### 2.2 Midwife Dashboard Pages (Authenticated - Role: Midwife)

#### 2.2.1 Midwife Dashboard (`/dashboard`)
- **Purpose**: Main dashboard with overview statistics and quick actions
- **Components**:
  - Welcome header with current date/time
  - Statistics cards (4 programs with counts)
  - Interactive charts:
    - Records by Category (Bar chart)
    - Program Distribution by Barangay (Pie chart)
    - Monthly Growth Trend (Line chart)
  - Coverage Map (Leaflet map showing assigned barangays)
  - Quick Actions buttons (Add new records for each program)
  - Recent Activity feed (last 10 activities)
  - Upcoming Schedule (next 7 days appointments)
- **Data Displayed**:
  - Total records per program
  - Barangay statistics
  - Recent patient activities
  - Today's appointments
  - Monthly trends

#### 2.2.2 Immunization Records Page (`/dashboard/immunization`)
- **Purpose**: Manage child immunization records
- **Features**:
  - Search bar (by name or barangay)
  - Filter by status (active/archived)
  - Filter by barangay
  - Pagination
  - Export to Excel/PDF with filters
- **Table Columns**:
  - Child Information (name, sex, mother's name)
  - Birth Details (date of birth)
  - Location (barangay)
  - Status (active/archived)
  - Actions (View, Edit, Archive/Restore, Delete)
- **Modal Forms** (4-step wizard):
  - Step 1: Personal & Parent Information
  - Step 2: Contact & Birth Details
  - Step 3: Vaccinations (BCG, DPT, OPV, Measles, etc.)
  - Step 4: Supplements & Health Status
- **Actions**: Create, Read, Update, Delete, Archive, Export

#### 2.2.3 Maternal Care Records Page (`/dashboard/maternal-care`)
- **Purpose**: Manage prenatal and maternal health records
- **Features**: Similar to Immunization (search, filter, export, CRUD)
- **Key Fields**:
  - Mother's personal information
  - Pregnancy details (Gravida, Para, LMP, EDD)
  - Prenatal visits (4 visits tracking)
  - Tetanus immunization (TT1-TT5)
  - Laboratory results
  - Risk factors (hypertension, diabetes, preeclampsia)
  - Micronutrient supplementation
- **Modal Form**: Multi-step wizard for comprehensive data entry

#### 2.2.4 Family Planning Records Page (`/dashboard/family-planning`)
- **Purpose**: Manage family planning client records
- **Features**: Search, filter, export, CRUD operations
- **Key Fields**:
  - Client personal information
  - Partner information
  - Medical history
  - FP method type (Pills, Injectable, IUD, Natural)
  - Follow-up schedule
  - Side effects monitoring
  - Method changes tracking
- **Modal Form**: Multi-step wizard

#### 2.2.5 Senior Citizen Records Page (`/dashboard/senior-citizen`)
- **Purpose**: Manage elderly health records
- **Features**: Search, filter, export, CRUD operations
- **Key Fields**:
  - Senior citizen personal information
  - Vital signs (BP, weight, height, BMI)
  - Chronic conditions (hypertension, diabetes, heart disease, etc.)
  - Maintenance medications
  - Mobility and ADL (Activities of Daily Living) assessment
  - Visual acuity screening
  - Immunizations (PPV, Influenza)
- **Modal Form**: Multi-step wizard

#### 2.2.6 All Patients Page (`/dashboard/patients`)
- **Purpose**: Unified search across all programs
- **Features**:
  - Global patient search
  - Filter by program type
  - View patient records from any program
- **Use Case**: Quick patient lookup across all health programs

#### 2.2.7 Appointments Page (`/dashboard/appointments`)
- **Purpose**: Manage patient appointments and schedules
- **Features**:
  - Calendar view
  - Create new appointments
  - Update appointment status
  - Filter by date range
  - View today's appointments
- **Fields**:
  - Patient name
  - Appointment type
  - Date and time
  - Barangay
  - Status (pending, confirmed, completed, cancelled)

#### 2.2.8 Alerts Page (`/dashboard/alerts`)
- **Purpose**: View and respond to alerts from administrators
- **Features**:
  - List of received alerts
  - Mark as read
  - Reply to alerts
  - Delete alerts
- **Alert Types**: Announcements, reminders, urgent notifications

#### 2.2.9 Archive Page (`/dashboard/archive`)
- **Purpose**: View archived records from all programs
- **Features**:
  - Filter by program type
  - Search archived records
  - Restore archived records
  - Permanent deletion

#### 2.2.10 Settings Page (`/dashboard/settings`)
- **Purpose**: Manage personal account settings
- **Sections**:
  - Profile Information (edit name, contact)
  - Change Password
  - Email Settings
  - Notification Preferences
- **Actions**: Update profile, change password, verify email

#### 2.2.11 User Manual Page (`/dashboard/user-manual`)
- **Purpose**: In-app help documentation for midwives
- **Content**: Step-by-step guides, screenshots, FAQs

#### 2.2.12 Release Notes Page (`/dashboard/release-notes`)
- **Purpose**: View system updates and new features
- **Content**: Version history, changelog, new features

#### 2.2.13 Report Bug Page (`/dashboard/report-bug`)
- **Purpose**: Submit bug reports or issues
- **Fields**: Issue description, steps to reproduce, screenshots
- **Actions**: Submit report to administrators

---

### 2.3 Admin Dashboard Pages (Authenticated - Role: Admin)

#### 2.3.1 Admin Dashboard (`/admin/dashboard` or `/dashboard`)
- **Purpose**: System-wide overview and management
- **Components**:
  - System statistics (total users, barangays, records across all programs)
  - Pending account approvals count
  - Recent system activities (all midwives)
  - Monthly data trends (all barangays)
  - Quick action buttons
- **Data Displayed**:
  - Total midwives (approved, pending, rejected)
  - Total records per program (system-wide)
  - Recent activities from all midwives
  - System health metrics

#### 2.3.2 Manage Midwives Page (`/admin/users`)
- **Purpose**: User account management
- **Features**:
  - List all midwife accounts
  - Filter by status (approved, pending, rejected, inactive)
  - Search by name or email
  - View user details
  - Edit user information
  - Toggle user status (active/inactive)
  - Delete users
- **Table Columns**:
  - Name, Username, Email
  - Contact Number
  - Assigned Barangays
  - Status
  - Last Login
  - Actions (View, Edit, Toggle Status, Delete)

#### 2.3.3 Pending Accounts Page (`/admin/pending-accounts`)
- **Purpose**: Approve or reject new midwife registrations
- **Features**:
  - List of pending registrations
  - View applicant details
  - Approve account (sends email notification)
  - Reject account (sends rejection email)
- **Displayed Info**:
  - Full name, username, email
  - Contact number
  - Requested barangay assignments
  - Registration date

#### 2.3.4 Manage Barangays Page (`/admin/barangays`)
- **Purpose**: Barangay information management
- **Features**:
  - List all 26 barangays
  - Add new barangay
  - Edit barangay details
  - Delete barangay
  - View barangay statistics
- **Fields**:
  - Barangay name
  - Address
  - Contact number
  - Barangay Captain name
  - Health Officer name
  - Population (total, male, female, children)
  - Coverage area
  - Coordinates (latitude, longitude for map)

#### 2.3.5 Admin Alerts Page (`/admin/alerts`)
- **Purpose**: Send alerts/announcements to midwives
- **Features**:
  - Create new alert
  - Select recipients (all midwives or specific ones)
  - View sent alerts
  - View replies from midwives
  - Delete alerts
- **Alert Fields**:
  - Title
  - Message
  - Priority (low, medium, high, urgent)
  - Recipients (multi-select)

#### 2.3.6 Reports Page (`/admin/reports`)
- **Purpose**: Generate comprehensive system reports
- **Features**:
  - Filter by:
    - Date range
    - Barangay
    - Midwife
    - Program type
  - Export formats: Excel, PDF
  - Report types:
    - Barangay summary report
    - Midwife activity report
    - Patient records report (all programs)
    - Monthly statistics report
- **Data Included**:
  - Total records per program
  - Records by barangay
  - Records by midwife
  - Trends and analytics

#### 2.3.7 Audit Logs Page (`/admin/logs`)
- **Purpose**: View system activity logs for security and compliance
- **Features**:
  - Filter by:
    - Date range
    - User
    - Action type (create, update, delete, login, logout)
    - Program type
  - Search logs
  - Export logs
- **Log Columns**:
  - Timestamp
  - User (midwife name)
  - Action performed
  - Record type
  - Patient name (if applicable)
  - IP address
  - Details

#### 2.3.8 Admin Settings Page (`/admin/settings`)
- **Purpose**: System configuration and admin account settings
- **Sections**:
  - Admin Profile
  - System Settings
  - Email Configuration
  - Security Settings
  - Backup & Restore

#### 2.3.9 Admin Manual Page (`/admin/manual`)
- **Purpose**: Administrator documentation
- **Content**: Admin guides, system management, troubleshooting

#### 2.3.10 Security Guide Page (`/admin/security-guide`)
- **Purpose**: Security best practices and guidelines
- **Content**: Password policies, data protection, audit procedures

#### 2.3.11 Report Issue Page (`/admin/report-issue`)
- **Purpose**: Admin can report system issues to developers
- **Fields**: Issue type, description, severity, screenshots

---

### 2.4 Shared Components

#### 2.4.1 DashboardLayout
- **Purpose**: Main layout wrapper for authenticated pages
- **Components**:
  - Sidebar navigation (different for admin vs midwife)
  - Top header with user info and logout
  - Main content area
  - Breadcrumbs

#### 2.4.2 AdminLayout
- **Purpose**: Layout wrapper specifically for admin pages
- **Similar to DashboardLayout but with admin-specific navigation**

#### 2.4.3 Sidebar
- **Midwife Navigation**:
  - Dashboard
  - Programs (Immunization, Maternal Care, Family Planning, Senior Citizen)
  - Appointments
  - All Patients
  - Alerts
  - Archive
  - Settings
  - Help & Support
  - Logout

- **Admin Navigation**:
  - Dashboard
  - Manage Midwives
  - Pending Accounts
  - Manage Barangays
  - Alerts
  - Reports
  - Audit Logs
  - Settings
  - Admin Manual
  - Security Guide
  - Logout

#### 2.4.4 Modals
- **Create/Edit Record Modal**: Multi-step wizard for data entry
- **View Record Modal**: Read-only detailed view
- **Delete Confirmation Modal**: Confirm destructive actions
- **Export Modal**: Configure export filters and format

#### 2.4.5 Charts
- **RecordsByCategoryChart**: Bar chart showing records per program
- **ProgramDistributionChart**: Pie chart showing distribution by barangay
- **MonthlyGrowthChart**: Line chart showing monthly trends

#### 2.4.6 BarangayMap
- **Purpose**: Interactive Leaflet map showing barangay locations
- **Features**: Markers for each barangay, popup with details

---

## 3. FEATURES & FUNCTIONALITY

### 3.1 Authentication & Authorization

#### 3.1.1 User Registration
- **Process**:
  1. User fills registration form with personal details
  2. Selects up to 3 barangays to manage
  3. Creates username and password
  4. System creates account with "pending" status
  5. Email sent to user confirming registration
  6. Email sent to admin for approval
- **Validation**:
  - Unique username, email, contact number
  - Password minimum 8 characters
  - Valid email format
  - Valid Philippine mobile number (11 digits)
  - At least 1 barangay selected (max 3)

#### 3.1.2 User Login
- **Process**:
  1. User enters username/email and password
  2. System validates credentials
  3. Checks account status (must be "approved")
  4. Generates authentication token (Laravel Sanctum)
  5. Stores token in localStorage
  6. Updates last_login timestamp
  7. Creates audit log entry
  8. Redirects to appropriate dashboard based on role
- **Session Management**:
  - Token stored in localStorage
  - Token sent with every API request in Authorization header
  - Session expires after inactivity
  - User can logout to invalidate token

#### 3.1.3 Password Reset
- **Process**:
  1. User requests password reset via email
  2. System generates unique reset token
  3. Email sent with reset link (expires in 60 minutes)
  4. User clicks link and enters new password
  5. System validates token and updates password
  6. Email confirmation sent
  7. User redirected to login

#### 3.1.4 Role-Based Access Control
- **Roles**:
  - **Admin**: Full system access, user management, system-wide reports
  - **Midwife**: Limited to assigned barangays, cannot manage users
- **Middleware Protection**:
  - All dashboard routes require authentication
  - Admin routes require admin role
  - API endpoints protected by Sanctum middleware
  - Frontend routes protected by React Router guards

#### 3.1.5 Account Approval Workflow
- **Admin Actions**:
  - View pending registrations
  - Approve account:
    - Changes status to "approved"
    - Sends approval email to user
    - Records approver and approval timestamp
  - Reject account:
    - Changes status to "rejected"
    - Sends rejection email with reason
    - Account cannot login

---

### 3.2 Dashboard Features

#### 3.2.1 Statistics Display
- **Midwife Dashboard**:
  - Total records per program (filtered by assigned barangays)
  - Active vs archived counts
  - Today's appointments count
  - Pending alerts count
- **Admin Dashboard**:
  - System-wide statistics (all barangays)
  - Total midwives (by status)
  - Pending approvals count
  - Total records across all programs
  - Monthly growth metrics

#### 3.2.2 Data Visualization
- **Charts**:
  - Bar Chart: Records by category (4 programs)
  - Pie Chart: Distribution by barangay
  - Line Chart: Monthly growth trends (last 12 months)
- **Library**: Recharts (React charting library)
- **Interactivity**: Hover tooltips, responsive design

#### 3.2.3 Recent Activity Feed
- **Displays**:
  - Last 10 activities by current user (midwife) or all users (admin)
  - Activity type (create, update, archive, delete)
  - Patient name
  - Barangay
  - Timestamp (relative time: "2 hours ago")
- **Activity Types**:
  - New immunization record
  - Updated maternal care record
  - Archived family planning record
  - Deleted senior citizen record

#### 3.2.4 Upcoming Appointments
- **Displays**:
  - Next 7 days appointments
  - Patient name
  - Appointment type
  - Date and time
  - Barangay
  - Status indicator
- **Highlights**: Today's appointments marked with badge

#### 3.2.5 Coverage Map
- **Features**:
  - Interactive Leaflet map
  - Markers for each assigned barangay
  - Popup with barangay details (name, population)
  - Zoom and pan controls
- **Data Source**: Barangay coordinates from database

---

### 3.3 Record Management (CRUD Operations)

#### 3.3.1 Create Record
- **Process**:
  1. User clicks "Add New Record" button
  2. Modal opens with multi-step form wizard
  3. User fills required fields (marked with *)
  4. Client-side validation on each step
  5. User navigates through steps (Next/Back buttons)
  6. Final step: Submit button
  7. Server-side validation
  8. Record saved to database
  9. Audit log created
  10. Success toast notification
  11. Table refreshes with new record
- **Validation**:
  - Required fields checked
  - Data type validation (numbers, dates, emails)
  - Format validation (phone numbers, dates)
  - Unique constraints (if applicable)
  - Server-side validation for security

#### 3.3.2 Read/View Record
- **Process**:
  1. User clicks "View" icon on table row
  2. Modal opens in read-only mode
  3. All fields displayed (no editing)
  4. Organized in sections matching create form
  5. Close button to exit
- **Display**: All record fields formatted for readability

#### 3.3.3 Update Record
- **Process**:
  1. User clicks "Edit" icon on table row
  2. Modal opens with form pre-filled with existing data
  3. User modifies fields
  4. Validation on each step
  5. Submit updates
  6. Server validates and saves
  7. Audit log created (update action)
  8. Success notification
  9. Table refreshes
- **Restrictions**: Cannot change created_by or created_at

#### 3.3.4 Delete Record
- **Process**:
  1. User clicks "Delete" icon
  2. Confirmation modal appears
  3. User confirms deletion
  4. Record permanently deleted from database
  5. Audit log created
  6. Success notification
  7. Table refreshes
- **Warning**: Irreversible action, confirmation required

#### 3.3.5 Archive/Restore Record
- **Archive**:
  1. User clicks "Archive" icon
  2. Record status changed to "archived"
  3. Record hidden from active list
  4. Audit log created
  5. Success notification
- **Restore**:
  1. User navigates to Archive page
  2. Clicks "Restore" icon
  3. Record status changed to "active"
  4. Record appears in active list
  5. Audit log created
- **Purpose**: Soft delete for data retention

---

### 3.4 Search & Filter

#### 3.4.1 Search Functionality
- **Search Fields**:
  - Patient name (first, middle, last)
  - Barangay name
  - Contact number (some programs)
- **Behavior**:
  - Real-time search (debounced)
  - Case-insensitive
  - Partial matching
  - Searches across multiple fields

#### 3.4.2 Filter Options
- **Status Filter**:
  - All records
  - Active only
  - Archived only
- **Barangay Filter**:
  - All barangays (admin) or assigned barangays (midwife)
  - Single barangay selection
- **Date Range Filter** (for exports):
  - Start date
  - End date
  - Filters by created_at timestamp

#### 3.4.3 Pagination
- **Features**:
  - Configurable page size (default: 15 records per page)
  - Page navigation (Previous, Next, Page numbers)
  - Jump to specific page
  - Display: "Showing X-Y of Z records"
- **Implementation**: Server-side pagination via Laravel

---

### 3.5 Export Functionality

#### 3.5.1 Export to Excel
- **Process**:
  1. User clicks "Export Records" button
  2. Export modal opens
  3. User selects filters (optional):
     - Date range
     - Barangay
     - Search term
  4. User clicks "Export Excel"
  5. Server generates XLSX file using PhpSpreadsheet
  6. File downloaded to user's device
  7. Filename: `{program}_records_{date}.xlsx`
- **Excel Content**:
  - All record fields in columns
  - Header row with field names
  - Formatted dates and numbers
  - Filtered data based on user selection

#### 3.5.2 Export to PDF
- **Process**:
  1. Similar to Excel export
  2. User clicks "Export PDF"
  3. Server generates PDF using DomPDF
  4. File downloaded
  5. Filename: `{program}_records_{date}.pdf`
- **PDF Content**:
  - Header with logo and title
  - Table with key fields
  - Footer with page numbers and generation date
  - Landscape orientation for wide tables

#### 3.5.3 Export Filters
- **Available Filters**:
  - Date range (created_at)
  - Barangay selection
  - Patient name search
  - Status (active/archived)
- **Summary Display**: Shows count of records to be exported

---

### 3.6 Alert System

#### 3.6.1 Admin Send Alert
- **Process**:
  1. Admin navigates to Alerts page
  2. Clicks "Create Alert"
  3. Fills form:
     - Title
     - Message
     - Priority (low, medium, high, urgent)
     - Recipients (select midwives or "All")
  4. Submits alert
  5. Alert saved to database
  6. Recipients see alert count badge
  7. Email notification sent (optional)

#### 3.6.2 Midwife View Alerts
- **Features**:
  - Alert list with unread count
  - Priority color coding
  - Mark as read
  - Reply to alert
  - Delete alert
- **Display**:
  - Alert title
  - Sender (admin name)
  - Timestamp
  - Priority badge
  - Read/unread status

#### 3.6.3 Alert Notifications
- **Badge**: Unread count displayed on sidebar and header
- **Real-time**: Count updates on page load
- **Persistence**: Alerts remain until deleted by user

---

### 3.7 Audit Logging

#### 3.7.1 Logged Actions
- **User Actions**:
  - Login/Logout
  - Create record
  - Update record
  - Delete record
  - Archive/Restore record
  - Export data
  - Change settings
- **Admin Actions**:
  - Approve/Reject user
  - Create/Edit/Delete barangay
  - Send alert
  - Generate report

#### 3.7.2 Log Data
- **Stored Information**:
  - Timestamp
  - User ID and name
  - Action type
  - Record type (program)
  - Record ID
  - Patient name (if applicable)
  - IP address
  - User agent
  - Changes made (before/after for updates)

#### 3.7.3 Audit Log Viewing (Admin Only)
- **Features**:
  - Filter by date range
  - Filter by user
  - Filter by action type
  - Search logs
  - Export logs to Excel/PDF
- **Purpose**: Security, compliance, troubleshooting

---

### 3.8 User Management (Admin Only)

#### 3.8.1 View All Users
- **Display**:
  - List of all midwife accounts
  - Filter by status
  - Search by name/email
  - Sort by columns

#### 3.8.2 Edit User
- **Editable Fields**:
  - Name
  - Email
  - Contact number
  - Assigned barangays
  - Status (active/inactive)
- **Restrictions**: Cannot change username or role

#### 3.8.3 Toggle User Status
- **Active**: User can login and access system
- **Inactive**: User cannot login, account disabled
- **Use Case**: Temporarily disable account without deletion

#### 3.8.4 Delete User
- **Process**:
  1. Admin clicks delete
  2. Confirmation modal
  3. User account deleted
  4. All associated data retained (records remain)
  5. Audit log created

---

### 3.9 Barangay Management (Admin Only)

#### 3.9.1 Add Barangay
- **Fields**:
  - Name (required, unique)
  - Address
  - Contact number
  - Barangay Captain name
  - Health Officer name
  - Population statistics
  - Coordinates (latitude, longitude)

#### 3.9.2 Edit Barangay
- **All fields editable**
- **Validation**: Name must remain unique

#### 3.9.3 Delete Barangay
- **Restriction**: Cannot delete if barangay has associated records
- **Warning**: Confirmation required

---

### 3.10 Settings & Profile

#### 3.10.1 Profile Management
- **Editable Fields**:
  - First name, middle name, last name
  - Email (requires verification)
  - Contact number
- **Actions**:
  - Update profile
  - Upload profile picture (if implemented)

#### 3.10.2 Change Password
- **Fields**:
  - Current password (verification)
  - New password
  - Confirm new password
- **Validation**:
  - Current password must be correct
  - New password minimum 8 characters
  - Passwords must match
- **Security**: Email notification sent on password change

#### 3.10.3 Email Verification
- **Process**:
  1. User changes email
  2. Verification email sent to new address
  3. User clicks verification link
  4. Email marked as verified
  5. Confirmation notification

---

### 3.11 Reporting (Admin Only)

#### 3.11.1 Generate Reports
- **Report Types**:
  - Barangay Summary Report
  - Midwife Activity Report
  - Patient Records Report (all programs)
  - Monthly Statistics Report

#### 3.11.2 Report Filters
- **Available Filters**:
  - Date range
  - Barangay selection
  - Midwife selection
  - Program type
  - Status (active/archived)

#### 3.11.3 Report Formats
- **Excel**: Detailed data in spreadsheet format
- **PDF**: Formatted report with charts and tables

#### 3.11.4 Report Content
- **Summary Statistics**:
  - Total records per program
  - Records by barangay
  - Records by midwife
  - Monthly trends
- **Detailed Data**:
  - Individual patient records
  - Timestamps
  - Created by information

---

### 3.12 Appointments Management

#### 3.12.1 Create Appointment
- **Fields**:
  - Patient name
  - Appointment type (checkup, vaccination, follow-up, etc.)
  - Date and time
  - Barangay
  - Notes

#### 3.12.2 Update Appointment Status
- **Statuses**:
  - Pending
  - Confirmed
  - Completed
  - Cancelled
- **Actions**: Change status, reschedule, cancel

#### 3.12.3 View Appointments
- **Views**:
  - Calendar view
  - List view
  - Today's appointments
  - Upcoming appointments (next 7 days)

---

### 3.13 Data Validation

#### 3.13.1 Client-Side Validation
- **Library**: React Hook Form + Zod
- **Validation Rules**:
  - Required fields
  - Data types (string, number, date, email)
  - Format validation (phone, email, dates)
  - Min/max length
  - Custom patterns (regex)
- **User Feedback**: Real-time error messages below fields

#### 3.13.2 Server-Side Validation
- **Laravel Validation**:
  - All API requests validated
  - Database constraints enforced
  - Unique field checks
  - Foreign key validation
- **Error Response**: JSON with field-specific errors

---

### 3.14 Notifications

#### 3.14.1 Toast Notifications
- **Library**: React Toastify
- **Types**:
  - Success (green)
  - Error (red)
  - Warning (yellow)
  - Info (blue)
- **Triggers**:
  - CRUD operations
  - Login/Logout
  - Validation errors
  - Export completion
  - Alert received

#### 3.14.2 Email Notifications
- **Sent On**:
  - User registration (confirmation)
  - Account approval/rejection
  - Password reset
  - Password changed
  - Email changed
  - Alert received (optional)
- **Email Service**: Gmail SMTP

---

### 3.15 Security Features

#### 3.15.1 Authentication Security
- **Password Hashing**: Bcrypt (Laravel default)
- **Token-Based Auth**: Laravel Sanctum
- **Session Management**: Secure token storage
- **CSRF Protection**: Laravel CSRF tokens

#### 3.15.2 Authorization
- **Middleware**: AdminMiddleware for admin routes
- **Role Checks**: Frontend and backend validation
- **Barangay Restrictions**: Midwives limited to assigned barangays

#### 3.15.3 Data Protection
- **SQL Injection Prevention**: Laravel Eloquent ORM
- **XSS Prevention**: React auto-escaping
- **Input Sanitization**: Server-side validation
- **Audit Logging**: All actions tracked

---

## 4. DATA MODELS

### 4.1 User Model

**Table**: `users`

**Fields**:
- `id` (bigint, primary key, auto-increment)
- `first_name` (varchar 50, required)
- `middle_name` (varchar 50, nullable)
- `last_name` (varchar 50, required)
- `username` (varchar 50, unique, required)
- `email` (varchar 100, unique, required)
- `password` (varchar, hashed, required)
- `contact_number` (varchar 20, unique, required)
- `role` (enum: 'admin', 'midwife', default: 'midwife')
- `status` (enum: 'pending', 'approved', 'rejected', 'inactive', default: 'pending')
- `email_verified` (boolean, default: false)
- `verification_token` (varchar 100, nullable, unique)
- `verification_token_expiry` (timestamp, nullable)
- `reset_token` (varchar 100, nullable, unique)
- `reset_token_expiry` (timestamp, nullable)
- `approved_by` (foreign key to users.id, nullable)
- `approved_at` (timestamp, nullable)
- `last_login` (timestamp, nullable)
- `remember_token` (varchar 100, nullable)
- `created_at` (timestamp)
- `updated_at` (timestamp)

**Relationships**:
- `belongsToMany` Barangay (through user_barangays pivot table)
- `hasMany` ImmunizationRecord (as creator)
- `hasMany` FamilyPlanningRecord (as creator)
- `hasMany` MaternalCareRecord (as creator)
- `hasMany` SeniorCitizenRecord (as creator)
- `hasMany` AuditLog
- `hasMany` Alert (as sender or recipient)

**Indexes**:
- `email`, `username` (composite index)
- `status` (index)

**Computed Fields** (Frontend):
- `full_name`: `${first_name} ${middle_name} ${last_name}`.trim()

---

### 4.2 Barangay Model

**Table**: `barangays`

**Fields**:
- `id` (bigint, primary key, auto-increment)
- `name` (varchar 100, unique, required)
- `address` (text, nullable)
- `contact_number` (varchar 20, nullable)
- `barangay_captain` (varchar 100, nullable)
- `health_officer` (varchar 100, nullable)
- `population` (integer, nullable)
- `population_male` (integer, nullable)
- `population_female` (integer, nullable)
- `population_children` (integer, nullable)
- `coverage_area` (varchar 100, nullable)
- `latitude` (decimal 10,8, nullable)
- `longitude` (decimal 11,8, nullable)
- `created_at` (timestamp)
- `updated_at` (timestamp)

**Relationships**:
- `belongsToMany` User (through user_barangays pivot table)
- `hasMany` ImmunizationRecord
- `hasMany` FamilyPlanningRecord
- `hasMany` MaternalCareRecord
- `hasMany` SeniorCitizenRecord

**Indexes**:
- `name` (unique index)

---

### 4.3 User-Barangay Pivot Model

**Table**: `user_barangays`

**Fields**:
- `id` (bigint, primary key, auto-increment)
- `user_id` (foreign key to users.id, required)
- `barangay_id` (foreign key to barangays.id, required)
- `created_at` (timestamp)
- `updated_at` (timestamp)

**Constraints**:
- Unique combination of (user_id, barangay_id)
- Cascade delete on user deletion
- Restrict delete on barangay deletion

---

### 4.4 Immunization Record Model

**Table**: `immunization_records`

**Fields**:

**Personal Information**:
- `id` (bigint, primary key, auto-increment)
- `first_name` (varchar 50, required)
- `middle_name` (varchar 50, nullable)
- `last_name` (varchar 50, required)
- `mother_name` (varchar 100, nullable)
- `father_guardian_name` (varchar 100, nullable)
- `sex` (enum: 'Male', 'Female', required)
- `date_of_birth` (date, nullable)
- `address` (text, nullable)
- `barangay_id` (foreign key to barangays.id, required)
- `contact_no` (varchar 20, nullable)

**Birth Information**:
- `birth_weight` (decimal 5,2, nullable) - in kg
- `birth_length` (decimal 5,2, nullable) - in cm
- `place_of_birth` (varchar 100, nullable)
- `birth_attendant` (varchar 50, nullable)

**Current Measurements**:
- `current_weight` (decimal 5,2, nullable) - in kg
- `current_height` (decimal 5,2, nullable) - in cm
- `head_circumference` (decimal 5,2, nullable) - in cm
- `weight_for_age` (varchar 50, nullable)
- `height_for_age` (varchar 50, nullable)

**Vaccines** (all dates):
- `bcg` (date, nullable)
- `hepa_b` (date, nullable)
- `dpt1` (date, nullable)
- `dpt2` (date, nullable)
- `dpt3` (date, nullable)
- `opv1` (date, nullable)
- `opv2` (date, nullable)
- `opv3` (date, nullable)
- `measles` (date, nullable)
- `rotavirus1` (date, nullable)
- `rotavirus2` (date, nullable)
- `pcv1` (date, nullable)
- `pcv2` (date, nullable)
- `pcv3` (date, nullable)
- `mmr` (date, nullable)

**Supplements**:
- `vit_a_date` (date, nullable)
- `deworming_date` (date, nullable)

**Health Status**:
- `nutritional_status` (varchar 50, nullable)
- `allergies` (text, nullable)
- `previous_illnesses` (text, nullable)
- `congenital_abnormalities` (text, nullable)
- `remarks` (text, nullable)

**System Fields**:
- `status` (enum: 'active', 'archived', default: 'active')
- `created_by` (foreign key to users.id, required)
- `created_at` (timestamp)
- `updated_at` (timestamp)

**Relationships**:
- `belongsTo` Barangay
- `belongsTo` User (as creator)

**Indexes**:
- `barangay_id`, `status` (composite index)
- `created_by` (index)

**Computed Fields** (Frontend):
- `full_name`: `${first_name} ${middle_name} ${last_name}`.trim()

---

### 4.5 Family Planning Record Model

**Table**: `family_planning_records`

**Fields**:

**Personal Information**:
- `id` (bigint, primary key, auto-increment)
- `first_name` (varchar 50, required)
- `middle_name` (varchar 50, nullable)
- `last_name` (varchar 50, required)
- `sex` (enum: 'Male', 'Female', required)
- `age` (integer, nullable)
- `address` (text, nullable)
- `barangay_id` (foreign key to barangays.id, required)
- `civil_status` (varchar 50, nullable)
- `educational_attainment` (varchar 100, nullable)
- `occupation` (varchar 100, nullable)
- `contact_no` (varchar 20, nullable)
- `no_of_living_children` (integer, nullable)

**Partner Information**:
- `partner_name` (varchar 100, nullable)
- `partner_age` (integer, nullable)
- `partner_occupation` (varchar 100, nullable)
- `partner_consent` (enum: 'Yes', 'No', nullable)

**Medical History**:
- `allergies` (text, nullable)
- `current_medications` (text, nullable)
- `medical_conditions` (text, nullable)
- `previous_surgeries` (text, nullable)
- `last_childbirth_date` (date, nullable)
- `no_of_miscarriages` (integer, nullable)
- `no_of_stillbirths` (integer, nullable)
- `youngest_child_age` (integer, nullable)

**Physical Assessment**:
- `blood_pressure` (varchar 20, nullable)
- `weight` (decimal 5,2, nullable) - in kg
- `height` (decimal 5,2, nullable) - in cm
- `bmi` (decimal 5,2, nullable)

**Risk Factors**:
- `smoker` (enum: 'Yes', 'No', nullable)
- `history_blood_clots` (enum: 'Yes', 'No', nullable)
- `history_cancer` (enum: 'Yes', 'No', nullable)
- `history_stroke` (enum: 'Yes', 'No', nullable)

**Family Planning Details**:
- `date_of_visit` (date, nullable)
- `type_of_client` (varchar 50, nullable)
- `date_accepted` (date, nullable)
- `type_of_fp_method` (varchar 100, nullable)
- `date_started` (date, nullable)
- `remarks_side_effects` (text, nullable)
- `date_of_followup` (date, nullable)
- `method_changed` (varchar 100, nullable)
- `new_method` (varchar 100, nullable)
- `reason_for_change` (text, nullable)
- `midwife_name` (varchar 100, nullable)

**Additional Information**:
- `lmp` (date, nullable) - Last Menstrual Period
- `pregnancy_test_result` (varchar 50, nullable)
- `source_of_supply` (varchar 100, nullable)
- `date_of_last_supply` (date, nullable)
- `quantity_given` (varchar 50, nullable)
- `next_supply_date` (date, nullable)
- `adherence_notes` (text, nullable)

**System Fields**:
- `status` (enum: 'active', 'archived', default: 'active')
- `created_by` (foreign key to users.id, required)
- `created_at` (timestamp)
- `updated_at` (timestamp)

**Relationships**:
- `belongsTo` Barangay
- `belongsTo` User (as creator)

**Indexes**:
- `barangay_id`, `status` (composite index)
- `created_by` (index)

**Computed Fields** (Frontend):
- `full_name`: `${first_name} ${middle_name} ${last_name}`.trim()

---

### 4.6 Maternal Care Record Model

**Table**: `maternal_care_records`

**Fields**:

**Personal Information**:
- `id` (bigint, primary key, auto-increment)
- `first_name` (varchar 50, required)
- `middle_name` (varchar 50, nullable)
- `last_name` (varchar 50, required)
- `age` (integer, nullable)
- `sex` (enum: 'Female', required)
- `address` (text, nullable)
- `barangay_id` (foreign key to barangays.id, required)
- `contact_no` (varchar 20, nullable)
- `civil_status` (varchar 50, nullable)
- `educational_attainment` (varchar 100, nullable)
- `occupation` (varchar 100, nullable)

**Pregnancy Information**:
- `gravida` (integer, nullable) - Total pregnancies
- `para` (integer, nullable) - Total births
- `lmp` (date, nullable) - Last Menstrual Period
- `edd` (date, nullable) - Expected Date of Delivery
- `blood_type` (varchar 10, nullable)
- `no_of_miscarriages` (integer, nullable)
- `no_of_stillbirths` (integer, nullable)
- `no_of_living_children` (integer, nullable)
- `previous_cesarean` (enum: 'Yes', 'No', nullable)
- `previous_complications` (text, nullable)

**Prenatal Visits**:
- `prenatal_visit_1` (date, nullable)
- `prenatal_visit_2` (date, nullable)
- `prenatal_visit_3` (date, nullable)
- `prenatal_visit_4` (date, nullable)

**Physical Assessment**:
- `fundal_height` (varchar 50, nullable)
- `fetal_heart_rate` (varchar 50, nullable)
- `fetal_presentation` (varchar 50, nullable)
- `edema` (varchar 50, nullable)
- `proteinuria` (enum: 'Yes', 'No', nullable)
- `weight_monitoring` (varchar 100, nullable)
- `bp_monitoring` (varchar 100, nullable)

**Laboratory Results**:
- `hemoglobin` (varchar 50, nullable)
- `blood_sugar` (varchar 50, nullable)
- `urinalysis_result` (text, nullable)
- `ultrasound_date` (date, nullable)
- `ultrasound_findings` (text, nullable)

**Risk Factors**:
- `has_hypertension` (enum: 'Yes', 'No', nullable)
- `has_gestational_diabetes` (enum: 'Yes', 'No', nullable)
- `has_multiple_pregnancy` (enum: 'Yes', 'No', nullable)
- `has_placenta_previa` (enum: 'Yes', 'No', nullable)
- `has_preeclampsia` (enum: 'Yes', 'No', nullable)

**Birth Plan**:
- `birth_plan` (text, nullable)
- `preferred_delivery_place` (varchar 100, nullable)
- `emergency_contact` (varchar 100, nullable)
- `emergency_contact_number` (varchar 20, nullable)
- `philhealth_member` (enum: 'Yes', 'No', nullable)

**Tetanus Immunization**:
- `date_tt1` (date, nullable)
- `date_tt2` (date, nullable)
- `date_tt3` (date, nullable)
- `date_tt4` (date, nullable)
- `date_tt5` (date, nullable)
- `fim_status` (varchar 50, nullable) - Fully Immunized Mother

**Micronutrient Supplementation**:
- `iron_folic` (varchar 100, nullable)
- `calcium` (varchar 100, nullable)
- `iodine` (varchar 100, nullable)
- `bmi` (varchar 50, nullable)
- `deworm` (varchar 100, nullable)

**Disease Screening**:
- `syphilis_screening` (varchar 50, nullable)
- `hepa_b_screening` (varchar 50, nullable)
- `hiv_screening` (varchar 50, nullable)
- `date_screened` (date, nullable)
- `result` (varchar 100, nullable)

**Additional Information**:
- `remarks` (text, nullable)

**System Fields**:
- `status` (enum: 'active', 'archived', default: 'active')
- `created_by` (foreign key to users.id, required)
- `created_at` (timestamp)
- `updated_at` (timestamp)

**Relationships**:
- `belongsTo` Barangay
- `belongsTo` User (as creator)

**Indexes**:
- `barangay_id`, `status` (composite index)
- `created_by` (index)

**Computed Fields** (Frontend):
- `full_name`: `${first_name} ${middle_name} ${last_name}`.trim()

---

### 4.7 Senior Citizen Record Model

**Table**: `senior_citizen_records`

**Fields**:

**Personal Information**:
- `id` (bigint, primary key, auto-increment)
- `first_name` (varchar 50, required)
- `middle_name` (varchar 50, nullable)
- `last_name` (varchar 50, required)
- `sex` (enum: 'Male', 'Female', required)
- `age` (integer, nullable)
- `address` (text, nullable)
- `barangay_id` (foreign key to barangays.id, required)
- `contact_no` (varchar 20, nullable)
- `civil_status` (varchar 50, nullable)
- `occupation` (varchar 100, nullable)
- `educational_attainment` (varchar 100, nullable)

**Vital Signs**:
- `blood_pressure` (varchar 20, nullable)
- `weight` (decimal 5,2, nullable) - in kg
- `height` (decimal 5,2, nullable) - in cm
- `bmi` (decimal 5,2, nullable)
- `temperature` (decimal 4,2, nullable) - in Celsius
- `heart_rate` (integer, nullable) - bpm
- `respiratory_rate` (integer, nullable) - breaths per minute

**Chronic Conditions**:
- `has_hypertension` (enum: 'Yes', 'No', nullable)
- `has_diabetes` (enum: 'Yes', 'No', nullable)
- `has_heart_disease` (enum: 'Yes', 'No', nullable)
- `has_kidney_disease` (enum: 'Yes', 'No', nullable)
- `has_arthritis` (enum: 'Yes', 'No', nullable)
- `has_copd_asthma` (enum: 'Yes', 'No', nullable)
- `has_dementia` (enum: 'Yes', 'No', nullable)

**Medications**:
- `maintenance_medications` (text, nullable)
- `medication_allergies` (text, nullable)

**Functional Assessment**:
- `mobility_status` (varchar 100, nullable)
- `adl_score` (varchar 50, nullable) - Activities of Daily Living
- `fall_history` (enum: 'Yes', 'No', nullable)
- `uses_assistive_device` (varchar 100, nullable)
- `memory_status` (varchar 100, nullable)
- `dementia_screening_result` (varchar 100, nullable)

**Laboratory Results**:
- `blood_sugar_level` (varchar 50, nullable)
- `cholesterol_level` (varchar 50, nullable)
- `tb_screening` (varchar 50, nullable)
- `cancer_screening` (varchar 100, nullable)

**Social Support**:
- `living_arrangement` (varchar 100, nullable)
- `primary_caregiver` (varchar 100, nullable)
- `emergency_contact` (varchar 100, nullable)
- `emergency_contact_number` (varchar 20, nullable)

**Nutritional Assessment**:
- `nutritional_status` (varchar 100, nullable)
- `special_diet` (enum: 'Yes', 'No', nullable)
- `special_diet_details` (text, nullable)

**Dental & Oral Health**:
- `has_dentures` (enum: 'Yes', 'No', nullable)
- `last_dental_visit` (date, nullable)

**Visual Screening**:
- `eye_complaints` (text, nullable)
- `visual_acuity` (varchar 50, nullable)
- `with_eye_problem` (varchar 100, nullable)
- `pinhole_vision_result` (varchar 50, nullable)
- `date_referred` (date, nullable)
- `management` (text, nullable)

**Immunizations**:
- `ppv_immunization_date` (date, nullable) - Pneumococcal Polysaccharide Vaccine
- `influenza_immunization_date` (date, nullable)

**Additional Information**:
- `remarks` (text, nullable)

**System Fields**:
- `status` (enum: 'active', 'archived', default: 'active')
- `created_by` (foreign key to users.id, required)
- `created_at` (timestamp)
- `updated_at` (timestamp)

**Relationships**:
- `belongsTo` Barangay
- `belongsTo` User (as creator)

**Indexes**:
- `barangay_id`, `status` (composite index)
- `created_by` (index)

**Computed Fields** (Frontend):
- `full_name`: `${first_name} ${middle_name} ${last_name}`.trim()

---

### 4.8 Audit Log Model

**Table**: `audit_logs`

**Fields**:
- `id` (bigint, primary key, auto-increment)
- `user_id` (foreign key to users.id, nullable)
- `action` (varchar 100, required) - e.g., 'create', 'update', 'delete', 'login', 'logout'
- `model_type` (varchar 100, nullable) - e.g., 'ImmunizationRecord', 'User'
- `model_id` (bigint, nullable)
- `description` (text, nullable)
- `ip_address` (varchar 45, nullable)
- `user_agent` (text, nullable)
- `created_at` (timestamp)
- `updated_at` (timestamp)

**Relationships**:
- `belongsTo` User

**Indexes**:
- `user_id` (index)
- `created_at` (index)
- `action` (index)

---

### 4.9 Alert Model

**Table**: `alerts`

**Fields**:
- `id` (bigint, primary key, auto-increment)
- `title` (varchar 200, required)
- `message` (text, required)
- `priority` (enum: 'low', 'medium', 'high', 'urgent', default: 'medium')
- `sender_id` (foreign key to users.id, required) - Admin who sent
- `recipient_id` (foreign key to users.id, required) - Midwife who receives
- `is_read` (boolean, default: false)
- `read_at` (timestamp, nullable)
- `created_at` (timestamp)
- `updated_at` (timestamp)

**Relationships**:
- `belongsTo` User (as sender)
- `belongsTo` User (as recipient)

**Indexes**:
- `recipient_id`, `is_read` (composite index)
- `sender_id` (index)

---

### 4.10 Appointment Model

**Table**: `appointments`

**Fields**:
- `id` (bigint, primary key, auto-increment)
- `patient_name` (varchar 100, required)
- `appointment_type` (varchar 100, required)
- `date` (date, required)
- `time` (time, required)
- `barangay_id` (foreign key to barangays.id, required)
- `status` (enum: 'pending', 'confirmed', 'completed', 'cancelled', default: 'pending')
- `notes` (text, nullable)
- `created_by` (foreign key to users.id, required)
- `created_at` (timestamp)
- `updated_at` (timestamp)

**Relationships**:
- `belongsTo` Barangay
- `belongsTo` User (as creator)

**Indexes**:
- `date`, `status` (composite index)
- `barangay_id` (index)
- `created_by` (index)

---

### 4.11 Session Model

**Table**: `sessions`

**Fields**:
- `id` (varchar, primary key)
- `user_id` (foreign key to users.id, nullable)
- `ip_address` (varchar 45, nullable)
- `user_agent` (text, nullable)
- `payload` (longtext, required)
- `last_activity` (integer, required)

**Purpose**: Laravel session management

**Indexes**:
- `user_id` (index)
- `last_activity` (index)

---

### 4.12 Password Reset Token Model

**Table**: `password_reset_tokens`

**Fields**:
- `email` (varchar, primary key)
- `token` (varchar, required)
- `created_at` (timestamp, nullable)

**Purpose**: Temporary storage for password reset tokens

---

### 4.13 Personal Access Token Model

**Table**: `personal_access_tokens`

**Fields**:
- `id` (bigint, primary key, auto-increment)
- `tokenable_type` (varchar, required)
- `tokenable_id` (bigint, required)
- `name` (varchar, required)
- `token` (varchar 64, unique, required)
- `abilities` (text, nullable)
- `last_used_at` (timestamp, nullable)
- `expires_at` (timestamp, nullable)
- `created_at` (timestamp)
- `updated_at` (timestamp)

**Purpose**: Laravel Sanctum API authentication tokens

**Indexes**:
- `tokenable_type`, `tokenable_id` (composite index)
- `token` (unique index)

---

### 4.14 User Session Model

**Table**: `user_sessions`

**Fields**:
- `id` (bigint, primary key, auto-increment)
- `user_id` (foreign key to users.id, required)
- `session_id` (varchar 255, required)
- `ip_address` (varchar 45, nullable)
- `user_agent` (text, nullable)
- `login_at` (timestamp, required)
- `logout_at` (timestamp, nullable)
- `created_at` (timestamp)
- `updated_at` (timestamp)

**Purpose**: Track user login/logout sessions for audit

**Relationships**:
- `belongsTo` User

**Indexes**:
- `user_id` (index)
- `session_id` (index)

---

## 5. NAVIGATION FLOW

### 5.1 Public User Flow (Unauthenticated)

```
Landing Page (/)
├── Click "Sign In" → Login Page (/login)
│   ├── Successful Login → Dashboard (role-based redirect)
│   ├── Click "Forgot Password" → Forgot Password Page (/forgot-password)
│   └── Click "Register" → Register Page (/register)
│
├── Click "Get Started" → Register Page (/register)
│   ├── Submit Registration → Success Message → Login Page
│   └── Click "Sign In" → Login Page
│
├── Click Program Links → Program Info Pages
│   ├── Immunization Info (/programs/immunization)
│   ├── Maternal Care Info (/programs/maternal-care)
│   ├── Family Planning Info (/programs/family-planning)
│   └── Senior Care Info (/programs/senior-care)
│
└── Click "Documentation" → Documentation Page (/documentation)
```

---

### 5.2 Midwife User Flow (Authenticated)

```
Login → Midwife Dashboard (/dashboard)
│
├── Sidebar Navigation:
│   │
│   ├── Dashboard (/dashboard)
│   │   ├── View Statistics
│   │   ├── View Charts
│   │   ├── View Recent Activities
│   │   ├── View Upcoming Appointments
│   │   ├── Click Quick Action → Program Page (Add Mode)
│   │   └── Click Map Marker → Barangay Details
│   │
│   ├── Immunization (/dashboard/immunization)
│   │   ├── Search Records
│   │   ├── Filter by Status/Barangay
│   │   ├── Click "Add New" → Create Modal (4-step wizard)
│   │   ├── Click "View" → View Modal (read-only)
│   │   ├── Click "Edit" → Edit Modal (4-step wizard)
│   │   ├── Click "Archive" → Confirm → Record Archived
│   │   ├── Click "Delete" → Confirm → Record Deleted
│   │   ├── Click "Export" → Export Modal → Download Excel/PDF
│   │   └── Pagination → Next/Previous Page
│   │
│   ├── Maternal Care (/dashboard/maternal-care)
│   │   └── [Same CRUD operations as Immunization]
│   │
│   ├── Family Planning (/dashboard/family-planning)
│   │   └── [Same CRUD operations as Immunization]
│   │
│   ├── Senior Citizen (/dashboard/senior-citizen)
│   │   └── [Same CRUD operations as Immunization]
│   │
│   ├── Appointments (/dashboard/appointments)
│   │   ├── View Calendar
│   │   ├── Click "Add Appointment" → Create Modal
│   │   ├── Click Appointment → View/Edit Modal
│   │   ├── Update Status → Confirm → Status Changed
│   │   └── Delete Appointment → Confirm → Deleted
│   │
│   ├── All Patients (/dashboard/patients)
│   │   ├── Global Search
│   │   ├── Filter by Program
│   │   └── Click Patient → View Record
│   │
│   ├── Alerts (/dashboard/alerts)
│   │   ├── View Alert List
│   │   ├── Click Alert → View Details
│   │   ├── Click "Reply" → Reply Modal → Send Reply
│   │   ├── Click "Mark as Read" → Alert Marked
│   │   └── Click "Delete" → Confirm → Alert Deleted
│   │
│   ├── Archive (/dashboard/archive)
│   │   ├── Filter by Program
│   │   ├── Search Archived Records
│   │   ├── Click "Restore" → Confirm → Record Restored
│   │   └── Click "Delete Permanently" → Confirm → Deleted
│   │
│   ├── Settings (/dashboard/settings)
│   │   ├── Edit Profile → Update → Success
│   │   ├── Change Password → Verify → Update → Success
│   │   ├── Update Email → Verify → Send Verification → Confirm
│   │   └── Notification Preferences → Update → Success
│   │
│   ├── User Manual (/dashboard/user-manual)
│   │   └── Browse Documentation
│   │
│   ├── Release Notes (/dashboard/release-notes)
│   │   └── View Version History
│   │
│   ├── Report Bug (/dashboard/report-bug)
│   │   └── Submit Bug Report → Success
│   │
│   └── Logout
│       └── Confirm → Clear Session → Redirect to Login
│
└── Header Actions:
    ├── Notifications Bell → View Alerts
    ├── Profile Dropdown → Settings/Logout
    └── Export Button → Export Modal
```

---

### 5.3 Admin User Flow (Authenticated)

```
Login → Admin Dashboard (/dashboard or /admin/dashboard)
│
├── Sidebar Navigation:
│   │
│   ├── Dashboard (/admin/dashboard)
│   │   ├── View System Statistics
│   │   ├── View Pending Approvals Count
│   │   ├── View Recent Activities (All Users)
│   │   ├── View Monthly Trends
│   │   └── Click Quick Actions
│   │
│   ├── Manage Midwives (/admin/users)
│   │   ├── View All Users
│   │   ├── Search Users
│   │   ├── Filter by Status
│   │   ├── Click "View" → View User Details
│   │   ├── Click "Edit" → Edit Modal → Update → Success
│   │   ├── Click "Toggle Status" → Confirm → Status Changed
│   │   └── Click "Delete" → Confirm → User Deleted
│   │
│   ├── Pending Accounts (/admin/pending-accounts)
│   │   ├── View Pending Registrations
│   │   ├── Click "View Details" → View Applicant Info
│   │   ├── Click "Approve" → Confirm → Email Sent → Status Updated
│   │   └── Click "Reject" → Enter Reason → Confirm → Email Sent
│   │
│   ├── Manage Barangays (/admin/barangays)
│   │   ├── View All Barangays
│   │   ├── Click "Add Barangay" → Create Modal → Submit → Success
│   │   ├── Click "Edit" → Edit Modal → Update → Success
│   │   ├── Click "Delete" → Confirm → Deleted (if no records)
│   │   └── Click Barangay → View Statistics
│   │
│   ├── Alerts (/admin/alerts)
│   │   ├── View Sent Alerts
│   │   ├── Click "Create Alert" → Alert Modal
│   │   │   ├── Enter Title, Message, Priority
│   │   │   ├── Select Recipients (All or Specific Midwives)
│   │   │   └── Submit → Alert Sent → Email Notifications
│   │   ├── Click Alert → View Details & Replies
│   │   └── Click "Delete" → Confirm → Alert Deleted
│   │
│   ├── Reports (/admin/reports)
│   │   ├── Select Report Type
│   │   ├── Configure Filters:
│   │   │   ├── Date Range
│   │   │   ├── Barangay Selection
│   │   │   ├── Midwife Selection
│   │   │   └── Program Type
│   │   ├── Click "Generate Report" → Preview
│   │   └── Click "Download" → Export Excel/PDF
│   │
│   ├── Audit Logs (/admin/logs)
│   │   ├── View All Logs
│   │   ├── Filter by:
│   │   │   ├── Date Range
│   │   │   ├── User
│   │   │   ├── Action Type
│   │   │   └── Program Type
│   │   ├── Search Logs
│   │   └── Click "Export" → Download Logs
│   │
│   ├── Settings (/admin/settings)
│   │   ├── Admin Profile → Edit → Update
│   │   ├── System Settings → Configure → Save
│   │   ├── Email Configuration → Update → Test
│   │   ├── Security Settings → Update → Save
│   │   └── Backup & Restore → Execute
│   │
│   ├── Admin Manual (/admin/manual)
│   │   └── Browse Admin Documentation
│   │
│   ├── Security Guide (/admin/security-guide)
│   │   └── View Security Best Practices
│   │
│   ├── Report Issue (/admin/report-issue)
│   │   └── Submit System Issue → Success
│   │
│   └── Logout
│       └── Confirm → Clear Session → Redirect to Login
│
└── Header Actions:
    ├── Notifications Bell → View System Alerts
    ├── Profile Dropdown → Settings/Logout
    └── Quick Stats Display
```

---

### 5.4 Modal Workflows

#### 5.4.1 Create Record Modal (Multi-Step Wizard)

```
Click "Add New Record"
│
└── Modal Opens (Step 1 of 4)
    │
    ├── Step 1: Personal & Parent Information
    │   ├── Fill Required Fields (*)
    │   ├── Validation Errors → Display Below Fields
    │   ├── Click "Cancel" → Close Modal
    │   └── Click "Next" → Validate → Go to Step 2
    │
    ├── Step 2: Contact & Birth Details
    │   ├── Fill Required Fields (*)
    │   ├── Validation Errors → Display Below Fields
    │   ├── Click "Back" → Return to Step 1
    │   └── Click "Next" → Validate → Go to Step 3
    │
    ├── Step 3: Vaccinations / Program-Specific Data
    │   ├── Fill Optional Fields
    │   ├── Click "Back" → Return to Step 2
    │   └── Click "Next" → Go to Step 4
    │
    └── Step 4: Supplements & Health Status
        ├── Fill Optional Fields
        ├── Click "Back" → Return to Step 3
        └── Click "Create Record" → Submit
            ├── Server Validation Fails → Display Errors
            └── Success → Close Modal → Refresh Table → Toast Notification
```

#### 5.4.2 Edit Record Modal

```
Click "Edit" Icon
│
└── Modal Opens with Pre-filled Data (Step 1 of 4)
    │
    └── [Same navigation as Create Modal]
        │
        └── Click "Update Record" → Submit
            ├── Server Validation Fails → Display Errors
            └── Success → Close Modal → Refresh Table → Toast Notification
```

#### 5.4.3 View Record Modal

```
Click "View" Icon
│
└── Modal Opens (Read-Only Mode)
    ├── Display All Fields (No Editing)
    ├── Organized in Sections
    └── Click "Close" or "X" → Close Modal
```

#### 5.4.4 Delete Confirmation Modal

```
Click "Delete" Icon
│
└── Confirmation Modal Opens
    ├── Display Warning Message
    ├── Click "Cancel" → Close Modal
    └── Click "Delete" → Execute Delete
        ├── Success → Close Modal → Refresh Table → Toast Notification
        └── Error → Display Error Message
```

#### 5.4.5 Export Modal

```
Click "Export Records"
│
└── Export Modal Opens
    │
    ├── Configure Filters (Optional):
    │   ├── Date Range (Start/End)
    │   ├── Barangay Selection
    │   └── Patient Name Search
    │
    ├── View Export Summary (Record Count)
    │
    ├── Click "Export Excel"
    │   └── Server Generates XLSX → Download → Success Toast
    │
    ├── Click "Export PDF"
    │   └── Server Generates PDF → Download → Success Toast
    │
    └── Click "Close" or "X" → Close Modal
```

---

### 5.5 Authentication Flow

```
User Visits App
│
├── Has Valid Token in localStorage?
│   │
│   ├── YES → Validate Token with Server
│   │   ├── Valid → Load User Data → Redirect to Dashboard
│   │   └── Invalid → Clear Token → Redirect to Login
│   │
│   └── NO → Redirect to Landing Page or Login
│
└── User Logs In
    │
    ├── Submit Credentials
    │   │
    │   ├── Invalid Credentials → Display Error
    │   │
    │   └── Valid Credentials
    │       │
    │       ├── Account Status = "pending" → Display "Awaiting Approval"
    │       ├── Account Status = "rejected" → Display "Account Rejected"
    │       ├── Account Status = "inactive" → Display "Account Disabled"
    │       │
    │       └── Account Status = "approved"
    │           │
    │           ├── Generate Token (Sanctum)
    │           ├── Store Token in localStorage
    │           ├── Store User Data in Zustand Store
    │           ├── Update last_login Timestamp
    │           ├── Create Audit Log Entry
    │           ├── Display Success Toast
    │           │
    │           └── Redirect Based on Role:
    │               ├── Admin → /admin/dashboard
    │               └── Midwife → /dashboard
    │
    └── User Logs Out
        │
        ├── Click Logout Button
        ├── Confirm Logout
        ├── Send Logout Request to Server
        ├── Invalidate Token
        ├── Clear localStorage
        ├── Clear Zustand Store
        ├── Create Audit Log Entry
        └── Redirect to Login Page
```

---

### 5.6 Route Protection

```
User Attempts to Access Protected Route
│
├── Check Authentication Status
│   │
│   ├── NOT Authenticated → Redirect to /login
│   │
│   └── Authenticated
│       │
│       └── Check Route Requirements
│           │
│           ├── Public Route → Allow Access
│           │
│           ├── Midwife Route
│           │   ├── User Role = "midwife" → Allow Access
│           │   └── User Role ≠ "midwife" → Redirect to Appropriate Dashboard
│           │
│           └── Admin Route
│               ├── User Role = "admin" → Allow Access
│               └── User Role ≠ "admin" → Redirect to /dashboard (403 Forbidden)
```

---

### 5.7 Data Flow (API Requests)

```
User Action (e.g., Create Record)
│
├── Frontend Validation
│   ├── Fails → Display Errors → Stop
│   └── Passes → Continue
│
├── Prepare API Request
│   ├── Add Authentication Token to Header
│   ├── Format Data (JSON)
│   └── Send HTTP Request (POST/GET/PUT/DELETE)
│
├── Backend Receives Request
│   │
│   ├── Middleware Checks:
│   │   ├── Authentication (Sanctum) → Fail → 401 Unauthorized
│   │   ├── Authorization (Role/Permissions) → Fail → 403 Forbidden
│   │   └── Pass → Continue
│   │
│   ├── Controller Validation
│   │   ├── Fails → Return 422 with Errors
│   │   └── Passes → Continue
│   │
│   ├── Business Logic Execution
│   │   ├── Database Operation (Create/Read/Update/Delete)
│   │   ├── Create Audit Log
│   │   └── Prepare Response
│   │
│   └── Return Response (JSON)
│       ├── Success → 200/201 with Data
│       └── Error → 4xx/5xx with Error Message
│
├── Frontend Receives Response
│   │
│   ├── Success
│   │   ├── Update UI (Refresh Table, Close Modal)
│   │   ├── Display Success Toast
│   │   └── Update State (Zustand/React Query)
│   │
│   └── Error
│       ├── Display Error Toast
│       ├── Show Field-Specific Errors
│       └── Log Error to Console
│
└── End
```

---

## 6. BUSINESS LOGIC & RULES

### 6.1 User Registration & Account Management

#### 6.1.1 Registration Rules
- **Username**: 
  - Must be unique across all users
  - Minimum 3 characters
  - Alphanumeric and underscores only
  - Case-insensitive uniqueness check

- **Email**:
  - Must be unique across all users
  - Valid email format required
  - Case-insensitive uniqueness check

- **Password**:
  - Minimum 8 characters
  - Must contain at least one letter and one number (recommended)
  - Hashed using Bcrypt before storage

- **Contact Number**:
  - Must be unique across all users
  - Philippine mobile format: 11 digits starting with 09
  - Format: 09XXXXXXXXX

- **Barangay Assignment**:
  - Minimum 1 barangay required
  - Maximum 3 barangays allowed
  - Midwives can only manage records in assigned barangays

- **Default Status**: All new registrations start with "pending" status

#### 6.1.2 Account Approval Workflow
- **Pending Status**:
  - User cannot login
  - Awaits admin approval
  - Email sent to admin for review

- **Approval Process**:
  - Admin reviews application
  - Admin clicks "Approve"
  - Status changed to "approved"
  - Email sent to user with login instructions
  - Approval timestamp and approver recorded

- **Rejection Process**:
  - Admin clicks "Reject"
  - Admin provides rejection reason
  - Status changed to "rejected"
  - Email sent to user with reason
  - User cannot login

- **Inactive Status**:
  - Admin can toggle approved accounts to inactive
  - User cannot login while inactive
  - Can be reactivated by admin
  - All data retained

#### 6.1.3 Password Reset Rules
- **Reset Token**:
  - Unique token generated
  - Expires after 60 minutes
  - Single-use only
  - Invalidated after successful reset

- **Email Verification**:
  - Verification link sent to new email
  - Expires after 24 hours
  - Email not changed until verified

---

### 6.2 Record Management Rules

#### 6.2.1 Create Record Rules
- **Required Fields**:
  - First Name, Last Name
  - Sex
  - Barangay (must be in user's assigned barangays)

- **Barangay Restriction**:
  - Midwives can only create records for assigned barangays
  - Admins can create records for any barangay

- **Creator Tracking**:
  - `created_by` field automatically set to current user ID
  - Cannot be changed after creation

- **Default Status**: All new records start with "active" status

- **Timestamp**: `created_at` and `updated_at` automatically managed

#### 6.2.2 Update Record Rules
- **Editable Fields**: All fields except:
  - `id`
  - `created_by`
  - `created_at`

- **Barangay Restriction**:
  - Midwives can only edit records in assigned barangays
  - Admins can edit any record

- **Audit Trail**:
  - Every update creates audit log entry
  - Tracks who made changes and when

#### 6.2.3 Delete Record Rules
- **Hard Delete**:
  - Permanently removes record from database
  - Requires confirmation
  - Cannot be undone
  - Creates audit log entry

- **Restrictions**:
  - Midwives can only delete records they created
  - Admins can delete any record
  - Barangay restriction applies to midwives

#### 6.2.4 Archive/Restore Rules
- **Archive** (Soft Delete):
  - Changes status to "archived"
  - Record hidden from active lists
  - Data retained in database
  - Can be restored later
  - Creates audit log entry

- **Restore**:
  - Changes status back to "active"
  - Record appears in active lists
  - Creates audit log entry

- **Purpose**: Data retention for historical records

---

### 6.3 Search & Filter Logic

#### 6.3.1 Search Algorithm
- **Search Fields**:
  - First Name, Middle Name, Last Name (concatenated)
  - Barangay Name
  - Contact Number (some programs)

- **Search Behavior**:
  - Case-insensitive
  - Partial matching (LIKE '%search%')
  - Searches across multiple fields simultaneously
  - Real-time search with debounce (300ms delay)

- **Example**:
  ```
  Search: "maria"
  Matches:
  - Maria Santos
  - Juan Maria Cruz
  - Barangay Sta. Maria
  ```

#### 6.3.2 Filter Logic
- **Status Filter**:
  - All: Shows both active and archived
  - Active: Shows only status = 'active'
  - Archived: Shows only status = 'archived'

- **Barangay Filter**:
  - Midwife: Dropdown shows only assigned barangays
  - Admin: Dropdown shows all barangays
  - Filter applies to records with matching barangay_id

- **Combined Filters**:
  - Search + Status + Barangay applied with AND logic
  - Example: Active records in Barangay A matching "maria"

#### 6.3.3 Pagination Logic
- **Page Size**: 15 records per page (configurable)
- **Server-Side Pagination**: Reduces data transfer
- **Page Calculation**:
  ```
  Total Pages = CEIL(Total Records / Page Size)
  Offset = (Current Page - 1) × Page Size
  ```

---

### 6.4 Export Logic

#### 6.4.1 Export Filters
- **Date Range**:
  - Filters by `created_at` timestamp
  - Inclusive of start and end dates
  - Optional (if not provided, exports all)

- **Barangay Filter**:
  - Exports only records from selected barangay
  - Optional (if not provided, exports all assigned barangays)

- **Search Filter**:
  - Applies same search logic as table search
  - Filters by patient name
  - Optional

- **Status Filter**:
  - Typically exports only "active" records
  - Can be configured to include archived

#### 6.4.2 Excel Export
- **Library**: PhpSpreadsheet
- **Format**: XLSX (Excel 2007+)
- **Content**:
  - Header row with field names
  - One row per record
  - All fields included (except system fields like id, created_by)
  - Dates formatted as YYYY-MM-DD
  - Numbers formatted with appropriate decimals

- **File Naming**: `{program}_records_{YYYY-MM-DD}.xlsx`

#### 6.4.3 PDF Export
- **Library**: DomPDF
- **Format**: PDF
- **Layout**:
  - Landscape orientation (for wide tables)
  - Header with logo and title
  - Table with key fields (not all fields due to space)
  - Footer with page numbers and generation date

- **File Naming**: `{program}_records_{YYYY-MM-DD}.pdf`

---

### 6.5 Alert System Logic

#### 6.5.1 Alert Creation (Admin)
- **Recipients**:
  - Can select "All Midwives"
  - Can select specific midwives (multi-select)
  - Creates one alert record per recipient

- **Priority Levels**:
  - Low: Informational
  - Medium: Standard notification
  - High: Important announcement
  - Urgent: Requires immediate attention

- **Notification**:
  - Alert saved to database
  - Email notification sent to recipients (optional)
  - Unread count updated in recipient's UI

#### 6.5.2 Alert Viewing (Midwife)
- **Unread Count**:
  - Badge displayed on sidebar and header
  - Count = alerts where is_read = false
  - Updates on page load

- **Mark as Read**:
  - Sets is_read = true
  - Records read_at timestamp
  - Decrements unread count

- **Reply**:
  - Midwife can reply to alert
  - Reply stored as new alert (recipient = original sender)
  - Admin sees reply in their alerts

#### 6.5.3 Alert Deletion
- **Midwife**: Can delete alerts they received
- **Admin**: Can delete alerts they sent
- **Cascade**: Deleting alert removes it from database

---

### 6.6 Dashboard Statistics Logic

#### 6.6.1 Midwife Dashboard Stats
- **Record Counts**:
  - Filtered by assigned barangays
  - Counts only "active" status records
  - Separate count per program:
    - Immunization Records
    - Maternal Care Records
    - Family Planning Records
    - Senior Citizen Records

- **Recent Activities**:
  - Last 10 activities by current user
  - Ordered by created_at DESC
  - Includes: create, update, archive, delete actions

- **Upcoming Appointments**:
  - Next 7 days from today
  - Filtered by assigned barangays
  - Ordered by date ASC, time ASC

- **Monthly Trend**:
  - Last 12 months
  - Count of records created per month
  - Grouped by program type

#### 6.6.2 Admin Dashboard Stats
- **System-Wide Counts**:
  - All barangays included
  - Total users by status (approved, pending, rejected, inactive)
  - Total records per program (all barangays)
  - Pending approvals count

- **Recent Activities**:
  - Last 20 activities from all users
  - Ordered by created_at DESC

- **Monthly Data**:
  - Last 12 months
  - Records created per month (all programs)
  - User registrations per month

---

### 6.7 Audit Logging Logic

#### 6.7.1 Logged Actions
- **User Actions**:
  - Login: Records timestamp, IP, user agent
  - Logout: Records timestamp
  - Create Record: Records model type, model ID, patient name
  - Update Record: Records changes made
  - Delete Record: Records deleted record details
  - Archive/Restore: Records status change

- **Admin Actions**:
  - Approve/Reject User: Records user ID, action, reason
  - Create/Edit/Delete Barangay: Records barangay details
  - Send Alert: Records recipients, message
  - Generate Report: Records filters used

#### 6.7.2 Log Data Captured
- **Timestamp**: Exact date and time of action
- **User**: ID and name of user who performed action
- **Action**: Type of action (create, update, delete, etc.)
- **Model**: Type of record affected (ImmunizationRecord, User, etc.)
- **Model ID**: ID of affected record
- **Description**: Human-readable description of action
- **IP Address**: User's IP address
- **User Agent**: Browser and OS information

#### 6.7.3 Log Retention
- **Storage**: Indefinite (no automatic deletion)
- **Purpose**: Compliance, security, troubleshooting
- **Access**: Admin only

---

### 6.8 Data Validation Rules

#### 6.8.1 Common Validation Rules
- **Required Fields**: Cannot be null or empty string
- **String Length**: Min/max character limits
- **Email Format**: Must match email regex pattern
- **Date Format**: YYYY-MM-DD
- **Number Format**: Decimal with specified precision
- **Enum Values**: Must match predefined list

#### 6.8.2 Program-Specific Validation

**Immunization Records**:
- Birth weight: 0.5 - 10.0 kg (if provided)
- Birth length: 20 - 100 cm (if provided)
- Current weight: 0.5 - 50.0 kg (if provided)
- Current height: 20 - 200 cm (if provided)
- Head circumference: 20 - 60 cm (if provided)
- Vaccine dates: Cannot be future dates

**Maternal Care Records**:
- Age: 10 - 60 years (if provided)
- Gravida: 1 - 20 (if provided)
- Para: 0 - 20 (if provided)
- LMP: Cannot be future date
- EDD: Must be after LMP
- Prenatal visits: Cannot be future dates
- TT dates: Cannot be future dates

**Family Planning Records**:
- Age: 15 - 60 years (if provided)
- Weight: 20 - 200 kg (if provided)
- Height: 100 - 250 cm (if provided)
- BMI: Auto-calculated from weight and height
- No. of children: 0 - 20 (if provided)

**Senior Citizen Records**:
- Age: 60+ years (if provided)
- Weight: 20 - 200 kg (if provided)
- Height: 100 - 250 cm (if provided)
- BMI: Auto-calculated
- Blood pressure: Format XXX/XXX
- Temperature: 30 - 45°C (if provided)
- Heart rate: 30 - 200 bpm (if provided)
- Respiratory rate: 5 - 60 breaths/min (if provided)

---

### 6.9 Authorization Rules

#### 6.9.1 Role-Based Permissions

**Admin Permissions**:
- ✅ View all records (all barangays)
- ✅ Create records (any barangay)
- ✅ Edit any record
- ✅ Delete any record
- ✅ Archive/Restore any record
- ✅ Manage users (approve, reject, edit, delete)
- ✅ Manage barangays (create, edit, delete)
- ✅ Send alerts to midwives
- ✅ Generate system-wide reports
- ✅ View audit logs
- ✅ Access admin settings

**Midwife Permissions**:
- ✅ View records (assigned barangays only)
- ✅ Create records (assigned barangays only)
- ✅ Edit records (assigned barangays only)
- ✅ Delete records they created (assigned barangays only)
- ✅ Archive/Restore records (assigned barangays only)
- ✅ View and reply to alerts
- ✅ Generate reports (assigned barangays only)
- ✅ Manage appointments (assigned barangays only)
- ✅ Update own profile
- ❌ Cannot manage users
- ❌ Cannot manage barangays
- ❌ Cannot send alerts
- ❌ Cannot view audit logs
- ❌ Cannot access admin settings

#### 6.9.2 Barangay-Based Restrictions
- **Midwife Access**:
  - Can only see records where barangay_id IN (assigned_barangays)
  - Cannot create records for unassigned barangays
  - Cannot edit records in unassigned barangays
  - Dropdown filters show only assigned barangays

- **Admin Access**:
  - No barangay restrictions
  - Can access all barangays
  - Dropdown filters show all barangays

---

### 6.10 Appointment Management Logic

#### 6.10.1 Appointment Creation
- **Date Validation**: Cannot create appointments in the past
- **Time Slots**: No validation (free-form time entry)
- **Barangay**: Must be in user's assigned barangays (midwife)
- **Status**: Defaults to "pending"

#### 6.10.2 Appointment Status Workflow
```
Pending → Confirmed → Completed
   ↓
Cancelled (terminal state)
```

- **Pending**: Initial status, awaiting confirmation
- **Confirmed**: Appointment confirmed by midwife
- **Completed**: Appointment finished
- **Cancelled**: Appointment cancelled (cannot be changed)

#### 6.10.3 Appointment Notifications
- **Today's Appointments**: Highlighted in dashboard
- **Upcoming Appointments**: Next 7 days displayed
- **Overdue**: Past appointments with status ≠ completed (optional feature)

---

### 6.11 Email Notification Logic

#### 6.11.1 Email Triggers
- **User Registration**: Welcome email with pending status notice
- **Account Approved**: Login instructions and credentials reminder
- **Account Rejected**: Rejection reason and contact info
- **Password Reset**: Reset link with expiration notice
- **Password Changed**: Security notification
- **Email Changed**: Verification link to new email
- **Alert Received**: Alert content and link to dashboard (optional)

#### 6.11.2 Email Configuration
- **SMTP Server**: Gmail SMTP (smtp.gmail.com)
- **Port**: 587 (TLS)
- **Authentication**: App-specific password
- **From Address**: medimoms.system@gmail.com
- **From Name**: MediMoms System

---

### 6.12 Session Management

#### 6.12.1 Token-Based Authentication
- **Token Type**: Laravel Sanctum Personal Access Token
- **Storage**: localStorage (frontend)
- **Expiration**: Configurable (default: no expiration, relies on server-side validation)
- **Transmission**: Authorization header: `Bearer {token}`

#### 6.12.2 Session Tracking
- **Login**: Creates user_sessions record with login_at timestamp
- **Logout**: Updates user_sessions record with logout_at timestamp
- **Concurrent Sessions**: Allowed (multiple devices)
- **Session History**: Retained for audit purposes

---

### 6.13 Data Integrity Rules

#### 6.13.1 Foreign Key Constraints
- **ON DELETE RESTRICT**:
  - Users → Records (created_by)
  - Barangays → Records (barangay_id)
  - Cannot delete user or barangay if records exist

- **ON DELETE CASCADE**:
  - Users → User_Barangays (user_id)
  - Deleting user removes barangay assignments

- **ON DELETE SET NULL**:
  - Users → Users (approved_by)
  - If approver deleted, approved_by set to null

#### 6.13.2 Unique Constraints
- **Users**: username, email, contact_number
- **Barangays**: name
- **User_Barangays**: (user_id, barangay_id) combination

#### 6.13.3 Data Consistency
- **Timestamps**: Automatically managed by Laravel
- **Status Values**: Enforced by ENUM constraints
- **Computed Fields**: Calculated on-the-fly (not stored)
  - full_name = first_name + middle_name + last_name
  - BMI = weight / (height/100)²

---

## 7. DEPENDENCIES & LIBRARIES

### 7.1 Frontend Dependencies

#### 7.1.1 Core Framework
- **React** (v19.2.4)
  - Purpose: UI library for building component-based interfaces
  - Usage: All UI components, state management, lifecycle hooks

- **React DOM** (v19.2.4)
  - Purpose: React rendering for web browsers
  - Usage: Mounting React app to DOM

- **TypeScript** (v5.2.2)
  - Purpose: Static type checking for JavaScript
  - Usage: Type safety across entire frontend codebase

#### 7.1.2 Build Tools
- **Vite** (v5.0.8)
  - Purpose: Fast build tool and dev server
  - Usage: Development server, hot module replacement, production builds
  - Config: `vite.config.ts`

- **@vitejs/plugin-react** (v4.2.1)
  - Purpose: React support for Vite
  - Usage: JSX transformation, Fast Refresh

#### 7.1.3 Routing
- **React Router DOM** (v6.20.0)
  - Purpose: Client-side routing
  - Usage: Navigation between pages, route protection, URL parameters
  - Key Components: BrowserRouter, Routes, Route, Navigate, useNavigate

#### 7.1.4 State Management
- **Zustand** (v4.4.7)
  - Purpose: Lightweight state management
  - Usage: Global auth state (user, token, isAuthenticated)
  - Store: `src/store/authStore.ts`

#### 7.1.5 Data Fetching
- **@tanstack/react-query** (v5.12.2)
  - Purpose: Server state management, caching, data fetching
  - Usage: API calls, automatic refetching, cache management
  - Hooks: useQuery, useMutation
  - Provider: QueryClientProvider

- **Axios** (v1.6.2)
  - Purpose: HTTP client for API requests
  - Usage: All API calls to Laravel backend
  - Config: `src/services/api.ts` (base URL, interceptors)

#### 7.1.6 Form Management
- **React Hook Form** (v7.48.2)
  - Purpose: Form state management and validation
  - Usage: All forms (login, register, record creation/editing)
  - Features: Controlled inputs, validation, error handling

- **@hookform/resolvers** (v3.3.2)
  - Purpose: Validation schema resolvers for React Hook Form
  - Usage: Integration with Zod

- **Zod** (v3.22.4)
  - Purpose: TypeScript-first schema validation
  - Usage: Form validation schemas, type inference
  - Example: Login form validation, registration validation

#### 7.1.7 Styling
- **TailwindCSS** (v3.3.6)
  - Purpose: Utility-first CSS framework
  - Usage: All component styling
  - Config: `tailwind.config.js`
  - Plugins: None (using default)

- **PostCSS** (v8.4.32)
  - Purpose: CSS processing tool
  - Usage: TailwindCSS compilation
  - Config: `postcss.config.js`

- **Autoprefixer** (v10.4.16)
  - Purpose: Automatic vendor prefixing for CSS
  - Usage: Cross-browser compatibility

#### 7.1.8 UI Components & Utilities
- **Lucide React** (v0.577.0)
  - Purpose: Icon library
  - Usage: All icons throughout the app
  - Examples: Baby, Heart, Users, Stethoscope, etc.

- **Framer Motion** (v12.38.0)
  - Purpose: Animation library
  - Usage: Page transitions, modal animations, hover effects
  - Components: motion.div, AnimatePresence

- **clsx** (v2.0.0)
  - Purpose: Conditional className utility
  - Usage: Dynamic CSS class composition

#### 7.1.9 Data Visualization
- **Recharts** (v3.8.1)
  - Purpose: React charting library
  - Usage: Dashboard charts (bar, pie, line charts)
  - Components: BarChart, PieChart, LineChart, Tooltip, Legend

#### 7.1.10 Maps
- **Leaflet** (v1.9.4)
  - Purpose: Interactive map library
  - Usage: Barangay coverage map

- **React Leaflet** (v5.0.0)
  - Purpose: React components for Leaflet
  - Usage: Map integration in dashboard
  - Components: MapContainer, TileLayer, Marker, Popup

- **@types/leaflet** (v1.9.21)
  - Purpose: TypeScript types for Leaflet
  - Usage: Type safety for Leaflet API

#### 7.1.11 Notifications
- **React Toastify** (v10.0.6)
  - Purpose: Toast notification library
  - Usage: Success/error messages, user feedback
  - Components: ToastContainer, toast

#### 7.1.12 Date Utilities
- **date-fns** (v2.30.0)
  - Purpose: Date manipulation and formatting
  - Usage: Date formatting, relative time calculations
  - Functions: format, parseISO, differenceInDays

#### 7.1.13 Development Tools
- **ESLint** (v8.55.0)
  - Purpose: JavaScript/TypeScript linting
  - Usage: Code quality enforcement
  - Plugins: react-hooks, react-refresh

- **@typescript-eslint/eslint-plugin** (v6.14.0)
  - Purpose: TypeScript-specific linting rules
  - Usage: TypeScript code quality

- **@typescript-eslint/parser** (v6.14.0)
  - Purpose: TypeScript parser for ESLint
  - Usage: Parse TypeScript for linting

#### 7.1.14 Type Definitions
- **@types/react** (v19.2.14)
  - Purpose: TypeScript types for React
  - Usage: Type safety for React API

- **@types/react-dom** (v19.2.3)
  - Purpose: TypeScript types for React DOM
  - Usage: Type safety for React DOM API

---

### 7.2 Backend Dependencies

#### 7.2.1 Core Framework
- **Laravel Framework** (v12.0)
  - Purpose: PHP web application framework
  - Usage: Backend API, routing, middleware, ORM
  - PHP Version: 8.2+

#### 7.2.2 Authentication
- **Laravel Sanctum** (v4.3)
  - Purpose: API token authentication
  - Usage: Token generation, validation, API protection
  - Features: Personal access tokens, SPA authentication

#### 7.2.3 Database
- **MySQL**
  - Purpose: Relational database
  - Usage: Data storage for all models
  - Version: 5.7+ or 8.0+

- **Laravel Eloquent ORM**
  - Purpose: Database abstraction layer
  - Usage: Model definitions, queries, relationships
  - Built into Laravel

#### 7.2.4 PDF Generation
- **barryvdh/laravel-dompdf** (v3.1)
  - Purpose: PDF generation from HTML
  - Usage: Export records to PDF format
  - Underlying Library: DomPDF

#### 7.2.5 Excel Generation
- **phpoffice/phpspreadsheet** (v5.6)
  - Purpose: Excel file generation and manipulation
  - Usage: Export records to XLSX format
  - Features: Multiple sheets, formatting, formulas

#### 7.2.6 Email
- **Laravel Mail** (built-in)
  - Purpose: Email sending
  - Usage: User notifications, password resets, alerts
  - Driver: SMTP (Gmail)

- **Gmail SMTP**
  - Host: smtp.gmail.com
  - Port: 587 (TLS)
  - Authentication: App-specific password

#### 7.2.7 Development Tools
- **Laravel Tinker** (v2.10.1)
  - Purpose: Interactive REPL for Laravel
  - Usage: Testing, debugging, database seeding

- **Laravel Pail** (v1.2.2)
  - Purpose: Real-time log viewing
  - Usage: Development debugging

- **Laravel Pint** (v1.24)
  - Purpose: PHP code style fixer
  - Usage: Code formatting, style enforcement

- **Laravel Sail** (v1.41)
  - Purpose: Docker development environment
  - Usage: Local development setup (optional)

#### 7.2.8 Testing
- **PHPUnit** (v11.5.50)
  - Purpose: PHP testing framework
  - Usage: Unit and feature tests
  - Config: `phpunit.xml`

- **Mockery** (v1.6)
  - Purpose: Mocking library for tests
  - Usage: Mock objects in unit tests

- **Faker PHP** (v1.23)
  - Purpose: Fake data generation
  - Usage: Database seeding, testing

- **Nunomaduro Collision** (v8.6)
  - Purpose: Beautiful error reporting for CLI
  - Usage: Development error handling

---

### 7.3 Development Environment

#### 7.3.1 Frontend Development
- **Node.js**: v18+ (LTS recommended)
- **npm**: v9+ (comes with Node.js)
- **Package Manager**: npm (can use yarn or pnpm)

**Development Commands**:
```bash
npm install          # Install dependencies
npm run dev          # Start dev server (http://localhost:5173)
npm run build        # Production build
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

#### 7.3.2 Backend Development
- **PHP**: v8.2+
- **Composer**: v2.0+
- **MySQL**: v5.7+ or v8.0+
- **Web Server**: Apache or Nginx (or PHP built-in server)

**Development Commands**:
```bash
composer install                    # Install dependencies
php artisan serve                   # Start dev server (http://localhost:8000)
php artisan migrate                 # Run migrations
php artisan db:seed                 # Seed database
php artisan config:clear            # Clear config cache
php artisan cache:clear             # Clear application cache
php artisan route:list              # List all routes
php artisan tinker                  # Interactive shell
```

#### 7.3.3 Database Tools
- **phpMyAdmin**: Web-based MySQL administration
- **MySQL Workbench**: Desktop MySQL client
- **TablePlus**: Modern database client (optional)

#### 7.3.4 Code Editors
- **VS Code** (recommended)
  - Extensions:
    - ESLint
    - Prettier
    - Tailwind CSS IntelliSense
    - PHP Intelephense
    - Laravel Blade Snippets
    - GitLens

- **PhpStorm**: Full-featured PHP IDE (alternative)

#### 7.3.5 Version Control
- **Git**: Version control system
- **GitHub/GitLab**: Remote repository hosting

---

### 7.4 Production Dependencies

#### 7.4.1 Web Server
- **Apache** or **Nginx**
  - Purpose: Serve Laravel application
  - Config: Virtual host configuration
  - Requirements: PHP-FPM, mod_rewrite (Apache)

#### 7.4.2 PHP Extensions Required
- **Required**:
  - php-mbstring
  - php-xml
  - php-pdo
  - php-mysql
  - php-curl
  - php-zip
  - php-gd (for image processing)
  - php-bcmath (for calculations)

- **Optional**:
  - php-redis (for caching)
  - php-opcache (for performance)

#### 7.4.3 SSL Certificate
- **Let's Encrypt** (recommended for free SSL)
- **Certbot**: Automatic SSL certificate management

#### 7.4.4 Process Manager
- **Supervisor**: Keep Laravel queue workers running
- **PM2**: Alternative process manager (Node.js-based)

---

### 7.5 External Services

#### 7.5.1 Email Service
- **Gmail SMTP**
  - Host: smtp.gmail.com
  - Port: 587
  - Encryption: TLS
  - Authentication: App-specific password

- **Alternative**: SendGrid, Mailgun, Amazon SES

#### 7.5.2 Map Tiles
- **OpenStreetMap**
  - Purpose: Map tiles for Leaflet
  - URL: https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
  - Free and open-source

---

### 7.6 Browser Compatibility

#### 7.6.1 Supported Browsers
- **Chrome**: v90+ (recommended)
- **Firefox**: v88+
- **Safari**: v14+
- **Edge**: v90+

#### 7.6.2 Mobile Browsers
- **Chrome Mobile**: Latest
- **Safari iOS**: v14+
- **Samsung Internet**: Latest

#### 7.6.3 Not Supported
- Internet Explorer (all versions)
- Opera Mini

---

### 7.7 System Requirements

#### 7.7.1 Development Machine
- **OS**: Windows 10/11, macOS 10.15+, Linux (Ubuntu 20.04+)
- **RAM**: 8GB minimum, 16GB recommended
- **Storage**: 10GB free space
- **CPU**: Dual-core minimum, Quad-core recommended

#### 7.7.2 Production Server
- **OS**: Linux (Ubuntu 20.04 LTS or 22.04 LTS recommended)
- **RAM**: 2GB minimum, 4GB+ recommended
- **Storage**: 20GB+ free space
- **CPU**: 2 cores minimum, 4+ cores recommended
- **Bandwidth**: 100Mbps+ recommended

---

## 8. FILE/FOLDER STRUCTURE

### 8.1 Project Root Structure

```
basta_midwives2.0/
├── backend/                    # Laravel backend application
├── frontend/                   # React frontend application
├── .qodo/                      # Qodo AI configuration
├── WORKFLOW.md                 # This documentation file
├── README.md                   # Project readme
├── PROJECT_SUMMARY.md          # Project summary
├── QUICK_START.md              # Quick start guide
├── DATABASE_SETUP.md           # Database setup instructions
├── EMAIL_SETUP.md              # Email configuration guide
├── DASHBOARD_SETUP_GUIDE.md    # Dashboard setup guide
├── IMMUNIZATION_*.md           # Immunization feature docs
├── REPORTS_*.md                # Reports feature docs
├── ALERT_*.md                  # Alert system docs
├── setup.ps1                   # PowerShell setup script
├── setup-database.bat          # Database setup batch script
└── setup-dashboard.bat         # Dashboard setup batch script
```

---

### 8.2 Backend Structure (Laravel)

```
backend/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── AdminDashboardController.php      # Admin dashboard logic
│   │   │   ├── AlertController.php               # Alert CRUD operations
│   │   │   ├── AppointmentController.php         # Appointment management
│   │   │   ├── AuditLogController.php            # Audit log viewing
│   │   │   ├── AuthController.php                # Login, register, logout
│   │   │   ├── BarangayController.php            # Barangay CRUD
│   │   │   ├── Controller.php                    # Base controller
│   │   │   ├── DashboardController.php           # Midwife dashboard logic
│   │   │   ├── FamilyPlanningRecordController.php
│   │   │   ├── ImmunizationRecordController.php
│   │   │   ├── MaternalCareRecordController.php
│   │   │   ├── PasswordResetController.php       # Password reset logic
│   │   │   ├── PatientController.php             # Patient search
│   │   │   ├── ReportController.php              # Report generation
│   │   │   ├── SeniorCitizenRecordController.php
│   │   │   └── UserController.php                # User management
│   │   │
│   │   └── Middleware/
│   │       └── AdminMiddleware.php               # Admin role check
│   │
│   ├── Mail/
│   │   ├── EmailChangedMail.php                  # Email change notification
│   │   ├── EmailVerificationMail.php             # Email verification
│   │   ├── PasswordChangedMail.php               # Password change notification
│   │   ├── PasswordResetMail.php                 # Password reset email
│   │   └── RegistrationPendingMail.php           # Registration confirmation
│   │
│   ├── Models/
│   │   ├── Alert.php                             # Alert model
│   │   ├── AuditLog.php                          # Audit log model
│   │   ├── Barangay.php                          # Barangay model
│   │   ├── FamilyPlanningRecord.php              # Family planning model
│   │   ├── ImmunizationRecord.php                # Immunization model
│   │   ├── MaternalCareRecord.php                # Maternal care model
│   │   ├── SeniorCitizenRecord.php               # Senior citizen model
│   │   ├── User.php                              # User model
│   │   └── UserSession.php                       # User session model
│   │
│   └── Providers/
│       └── AppServiceProvider.php                # Service provider
│
├── bootstrap/
│   ├── cache/                                    # Bootstrap cache files
│   ├── app.php                                   # Application bootstrap
│   └── providers.php                             # Provider registration
│
├── config/
│   ├── app.php                                   # Application config
│   ├── auth.php                                  # Authentication config
│   ├── cache.php                                 # Cache config
│   ├── cors.php                                  # CORS config
│   ├── database.php                              # Database config
│   ├── filesystems.php                           # Filesystem config
│   ├── logging.php                               # Logging config
│   ├── mail.php                                  # Mail config
│   ├── queue.php                                 # Queue config
│   ├── sanctum.php                               # Sanctum config
│   ├── services.php                              # Third-party services
│   └── session.php                               # Session config
│
├── database/
│   ├── factories/                                # Model factories for testing
│   ├── migrations/                               # Database migrations
│   │   ├── 0001_01_01_000000_create_users_table.php
│   │   ├── 0001_01_01_000001_create_cache_table.php
│   │   ├── 0001_01_01_000002_create_jobs_table.php
│   │   ├── 2024_01_01_000002_create_barangays_table.php
│   │   ├── 2024_01_01_000003_create_user_barangays_table.php
│   │   ├── 2024_01_01_000004_create_immunization_records_table.php
│   │   ├── 2024_01_01_000005_create_family_planning_records_table.php
│   │   ├── 2024_01_01_000006_create_maternal_care_records_table.php
│   │   ├── 2024_01_01_000007_create_senior_citizen_records_table.php
│   │   ├── 2024_01_01_000008_create_audit_logs_table.php
│   │   ├── 2024_01_01_000009_create_password_reset_tokens_table.php
│   │   ├── 2024_03_21_000001_add_coordinates_to_barangays_table.php
│   │   ├── 2024_03_21_000002_create_appointments_table.php
│   │   ├── 2024_03_22_000001_create_alerts_table.php
│   │   ├── 2026_03_21_100254_create_personal_access_tokens_table.php
│   │   ├── 2026_04_16_214000_create_user_sessions_table.php
│   │   └── 2026_04_16_214909_cleanup_old_login_logout_audit_logs.php
│   │
│   ├── seeders/                                  # Database seeders
│   └── database.sqlite                           # SQLite database (testing)
│
├── public/
│   ├── .htaccess                                 # Apache rewrite rules
│   ├── favicon.ico                               # Site favicon
│   ├── index.php                                 # Application entry point
│   └── robots.txt                                # Search engine rules
│
├── resources/
│   ├── css/                                      # CSS files (if any)
│   ├── js/                                       # JS files (if any)
│   └── views/                                    # Blade templates (if any)
│
├── routes/
│   ├── api.php                                   # API routes
│   ├── console.php                               # Console commands
│   └── web.php                                   # Web routes
│
├── storage/
│   ├── app/                                      # Application storage
│   │   ├── public/                               # Public files
│   │   └── private/                              # Private files
│   ├── framework/                                # Framework cache
│   │   ├── cache/
│   │   ├── sessions/
│   │   └── views/
│   └── logs/                                     # Application logs
│       └── laravel.log                           # Main log file
│
├── tests/
│   ├── Feature/                                  # Feature tests
│   ├── Unit/                                     # Unit tests
│   └── TestCase.php                              # Base test case
│
├── vendor/                                       # Composer dependencies
│
├── .editorconfig                                 # Editor configuration
├── .env                                          # Environment variables
├── .env.example                                  # Example environment file
├── .gitattributes                                # Git attributes
├── .gitignore                                    # Git ignore rules
├── artisan                                       # Artisan CLI
├── composer.json                                 # Composer dependencies
├── composer.lock                                 # Composer lock file
├── package.json                                  # NPM dependencies (if any)
├── phpunit.xml                                   # PHPUnit configuration
├── README.md                                     # Backend readme
└── vite.config.js                                # Vite configuration (if any)
```

---

### 8.3 Frontend Structure (React + TypeScript)

```
frontend/
├── public/
│   └── images/                                   # Public images
│       └── (logo, icons, etc.)
│
├── src/
│   ├── components/
│   │   ├── AdminLayout.tsx                       # Admin page layout wrapper
│   │   ├── AdminSidebar.tsx                      # Admin sidebar navigation
│   │   ├── BarangayMap.tsx                       # Leaflet map component
│   │   ├── CustomSelect.tsx                      # Custom select dropdown
│   │   ├── DashboardCharts.tsx                   # Chart components (Bar, Pie, Line)
│   │   ├── DashboardLayout.tsx                   # Midwife page layout wrapper
│   │   ├── ScrollToTop.tsx                       # Scroll to top on route change
│   │   ├── Sidebar.tsx                           # Midwife sidebar navigation
│   │   ├── Skeleton.tsx                          # Loading skeleton components
│   │   └── VaccineInfoCard.tsx                   # Vaccine information card
│   │
│   ├── constants/
│   │   └── barangayCoordinates.ts                # Barangay lat/lng coordinates
│   │
│   ├── hooks/
│   │   └── useDashboard.ts                       # Dashboard data fetching hooks
│   │
│   ├── pages/
│   │   ├── admin/
│   │   │   ├── AdminAlerts.tsx                   # Admin alerts page
│   │   │   ├── AdminDashboard.tsx                # Admin dashboard
│   │   │   ├── AdminManualPage.tsx               # Admin manual
│   │   │   ├── AdminSettingsPage.tsx             # Admin settings
│   │   │   ├── AuditLogsPage.tsx                 # Audit logs viewer
│   │   │   ├── ManageBarangay.tsx                # Barangay management
│   │   │   ├── ManageMidwives.tsx                # User management
│   │   │   ├── PendingAccounts.tsx               # Pending approvals
│   │   │   ├── ReportIssuePage.tsx               # Report system issue
│   │   │   ├── ReportsPage.tsx                   # Report generation
│   │   │   ├── SecurityGuidePage.tsx             # Security guide
│   │   │   └── UsersPage.tsx                     # User list (alias)
│   │   │
│   │   ├── auth/
│   │   │   ├── ForgotPassword.tsx                # Password reset request
│   │   │   ├── Login.tsx                         # Login page
│   │   │   └── Register.tsx                      # Registration page
│   │   │
│   │   ├── dashboard/
│   │   │   ├── AboutPage.tsx                     # About page
│   │   │   ├── AlertsPage.tsx                    # Midwife alerts
│   │   │   ├── AllPatientsPage.tsx               # Patient search
│   │   │   ├── AppointmentsPage.tsx              # Appointments management
│   │   │   ├── ArchivePage.tsx                   # Archived records
│   │   │   ├── HelpPage.tsx                      # Help page
│   │   │   ├── MidwifeDashboard.tsx              # Midwife dashboard
│   │   │   ├── ReleaseNotesPage.tsx              # Release notes
│   │   │   ├── ReportBugPage.tsx                 # Bug report
│   │   │   ├── SettingsPage.tsx                  # User settings
│   │   │   └── UserManualPage.tsx                # User manual
│   │   │
│   │   ├── programs/
│   │   │   ├── FamilyPlanningDashboardPage.tsx   # Family planning records
│   │   │   ├── FamilyPlanningPage.tsx            # Family planning info
│   │   │   ├── ImmunizationPage.tsx              # Immunization records
│   │   │   ├── MaternalCareDashboardPage.tsx     # Maternal care records
│   │   │   ├── MaternalCareDashboardPage.css     # Maternal care styles
│   │   │   ├── MaternalCarePage.tsx              # Maternal care info
│   │   │   ├── SeniorCarePage.tsx                # Senior care info
│   │   │   └── SeniorCitizenDashboardPage.tsx    # Senior citizen records
│   │   │
│   │   ├── DocumentationPage.tsx                 # Documentation page
│   │   ├── ImmunizationInfoPage.tsx              # Immunization info
│   │   └── LandingPage.tsx                       # Landing page
│   │
│   ├── providers/
│   │   └── QueryProvider.tsx                     # React Query provider
│   │
│   ├── services/
│   │   ├── alertService.ts                       # Alert API calls
│   │   ├── api.ts                                # Axios instance & config
│   │   ├── authService.ts                        # Auth API calls
│   │   ├── barangayService.ts                    # Barangay API calls
│   │   ├── dashboardService.ts                   # Dashboard API calls
│   │   ├── familyPlanningService.ts              # Family planning API calls
│   │   ├── immunizationService.ts                # Immunization API calls
│   │   ├── maternalCareService.ts                # Maternal care API calls
│   │   └── seniorCitizenService.ts               # Senior citizen API calls
│   │
│   ├── store/
│   │   └── authStore.ts                          # Zustand auth store
│   │
│   ├── types/
│   │   └── index.ts                              # TypeScript type definitions
│   │
│   ├── utils/                                    # Utility functions (if any)
│   │
│   ├── App.tsx                                   # Main app component & routing
│   ├── index.css                                 # Global styles & Tailwind imports
│   └── main.tsx                                  # App entry point
│
├── .env                                          # Environment variables
├── .gitignore                                    # Git ignore rules
├── index.html                                    # HTML template
├── package.json                                  # NPM dependencies
├── package-lock.json                             # NPM lock file
├── postcss.config.js                             # PostCSS configuration
├── tailwind.config.js                            # TailwindCSS configuration
├── tsconfig.json                                 # TypeScript configuration
├── tsconfig.node.json                            # TypeScript config for Node
└── vite.config.ts                                # Vite configuration
```

---

### 8.4 Key Configuration Files

#### 8.4.1 Backend Configuration

**`.env`** (Environment Variables):
```env
APP_NAME=MediMoms
APP_ENV=local
APP_KEY=base64:...
APP_DEBUG=true
APP_URL=http://localhost:8000
FRONTEND_URL=http://localhost:5173

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=medimoms_system
DB_USERNAME=root
DB_PASSWORD=Delvalle2005

MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=medimoms.system@gmail.com
MAIL_PASSWORD=cvthyhvokqcauruo
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@medimoms.com
MAIL_FROM_NAME="${APP_NAME}"

SANCTUM_STATEFUL_DOMAINS=localhost:5173
SESSION_DOMAIN=localhost
SPA_URL=http://localhost:5173
```

**`composer.json`** (PHP Dependencies):
```json
{
  "require": {
    "php": "^8.2",
    "barryvdh/laravel-dompdf": "^3.1",
    "laravel/framework": "^12.0",
    "laravel/sanctum": "^4.3",
    "laravel/tinker": "^2.10.1",
    "phpoffice/phpspreadsheet": "^5.6"
  }
}
```

**`routes/api.php`** (API Routes):
- Public routes: /register, /login, /forgot-password
- Protected routes: /logout, /me, /dashboard/*, /immunization-records/*, etc.
- Admin routes: /admin/*, /users/*, /audit-logs

#### 8.4.2 Frontend Configuration

**`.env`** (Environment Variables):
```env
VITE_API_URL=http://localhost:8000/api
```

**`package.json`** (NPM Dependencies):
```json
{
  "dependencies": {
    "react": "^19.2.4",
    "react-dom": "^19.2.4",
    "react-router-dom": "^6.20.0",
    "@tanstack/react-query": "^5.12.2",
    "axios": "^1.6.2",
    "zustand": "^4.4.7",
    "react-hook-form": "^7.48.2",
    "zod": "^3.22.4",
    "framer-motion": "^12.38.0",
    "recharts": "^3.8.1",
    "leaflet": "^1.9.4",
    "react-leaflet": "^5.0.0",
    "react-toastify": "^10.0.6",
    "lucide-react": "^0.577.0",
    "date-fns": "^2.30.0"
  }
}
```

**`vite.config.ts`** (Vite Configuration):
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
})
```

**`tailwind.config.js`** (TailwindCSS Configuration):
```javascript
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          // ... more shades
          600: '#0284c7',
          // ... more shades
        },
      },
    },
  },
  plugins: [],
}
```

**`tsconfig.json`** (TypeScript Configuration):
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

---

### 8.5 Important Files to Note

#### 8.5.1 Authentication Flow Files
- **Frontend**: `src/pages/auth/Login.tsx`, `src/services/authService.ts`, `src/store/authStore.ts`
- **Backend**: `app/Http/Controllers/AuthController.php`, `app/Models/User.php`

#### 8.5.2 Record Management Files
- **Frontend**: `src/pages/programs/ImmunizationPage.tsx` (example for all programs)
- **Backend**: `app/Http/Controllers/ImmunizationRecordController.php` (example)

#### 8.5.3 Dashboard Files
- **Frontend**: `src/pages/dashboard/MidwifeDashboard.tsx`, `src/pages/admin/AdminDashboard.tsx`
- **Backend**: `app/Http/Controllers/DashboardController.php`, `app/Http/Controllers/AdminDashboardController.php`

#### 8.5.4 API Service Files
- **Frontend**: `src/services/api.ts` (Axios instance), `src/services/*Service.ts` (API calls)

#### 8.5.5 Database Migration Files
- **Backend**: `database/migrations/*.php` (all migration files)

---

## 9. NOTES FOR PYTHON/CUSTOMTKINTER RECREATION

### 9.1 Key Considerations

1. **Desktop Application vs Web Application**:
   - Current: Web-based (React + Laravel)
   - Target: Desktop application (Python + CustomTkinter)
   - Implications: No browser, local database, different UI paradigms

2. **Database**:
   - Consider using SQLite for local storage
   - Or PostgreSQL/MySQL for networked deployment
   - Use SQLAlchemy ORM for database operations

3. **Authentication**:
   - Implement local session management
   - Store hashed passwords using bcrypt or argon2
   - Consider JWT tokens for API-like architecture

4. **UI Framework**:
   - CustomTkinter for modern-looking desktop UI
   - Replicate card-based layouts, modals, and forms
   - Use ttk.Treeview for tables
   - Matplotlib or Plotly for charts

5. **File Export**:
   - Use openpyxl for Excel export
   - Use ReportLab or FPDF for PDF export

6. **Email**:
   - Use smtplib for email sending
   - Or integrate with email APIs (SendGrid, Mailgun)

7. **Maps**:
   - Use tkintermapview for map display
   - Or embed web-based maps using tkinterweb

8. **State Management**:
   - Use Python classes for state management
   - Implement observer pattern for reactive updates

9. **Validation**:
   - Use Pydantic for data validation
   - Implement custom validators for business rules

10. **Architecture**:
    - Consider MVC or MVVM pattern
    - Separate business logic from UI
    - Use services/repositories for data access

### 9.2 Recommended Python Libraries

- **UI**: customtkinter, tkinter
- **Database**: SQLAlchemy, sqlite3
- **Validation**: pydantic
- **Excel**: openpyxl, xlsxwriter
- **PDF**: reportlab, fpdf2
- **Email**: smtplib, email
- **Charts**: matplotlib, plotly
- **Maps**: tkintermapview
- **Password Hashing**: bcrypt, argon2-cffi
- **Date/Time**: datetime, dateutil
- **HTTP (if needed)**: requests, httpx

### 9.3 Project Structure Suggestion

```
medimoms_desktop/
├── main.py                     # Application entry point
├── config.py                   # Configuration
├── database/
│   ├── __init__.py
│   ├── models.py               # SQLAlchemy models
│   ├── connection.py           # Database connection
│   └── migrations/             # Database migrations
├── services/
│   ├── __init__.py
│   ├── auth_service.py         # Authentication logic
│   ├── user_service.py         # User management
│   ├── record_service.py       # Record CRUD operations
│   ├── export_service.py       # Export functionality
│   └── email_service.py        # Email sending
├── ui/
│   ├── __init__.py
│   ├── main_window.py          # Main application window
│   ├── auth/
│   │   ├── login_window.py
│   │   └── register_window.py
│   ├── dashboard/
│   │   ├── midwife_dashboard.py
│   │   └── admin_dashboard.py
│   ├── programs/
│   │   ├── immunization_page.py
│   │   ├── maternal_care_page.py
│   │   ├── family_planning_page.py
│   │   └── senior_citizen_page.py
│   ├── components/
│   │   ├── sidebar.py
│   │   ├── table.py
│   │   ├── form.py
│   │   ├── modal.py
│   │   └── charts.py
│   └── utils/
│       ├── validators.py
│       └── formatters.py
├── utils/
│   ├── __init__.py
│   ├── constants.py
│   └── helpers.py
├── assets/
│   ├── images/
│   └── icons/
├── requirements.txt            # Python dependencies
└── README.md
```

---

## 10. CONCLUSION

This comprehensive workflow documentation provides a complete blueprint for understanding and recreating the MediMoms healthcare management system. The document covers:

- **Project Overview**: Purpose, users, and objectives
- **All Screens/Pages**: Detailed list of every page and component
- **Features & Functionality**: Complete feature breakdown
- **Data Models**: All database tables and relationships
- **Navigation Flow**: User journeys and workflows
- **Business Logic**: Rules, validations, and calculations
- **Dependencies**: All libraries and tools used
- **File Structure**: Complete project organization

This documentation should serve as a complete reference for:
1. Understanding the current system architecture
2. Onboarding new developers
3. Planning system enhancements
4. Recreating the system in Python/CustomTkinter
5. Maintaining and troubleshooting the application

For questions or clarifications, refer to the specific sections above or consult the inline code comments in the source files.

---

**Document Version**: 1.0  
**Last Updated**: 2026-04-17  
**Author**: System Documentation  
**Project**: MediMoms Healthcare Management System  

---

