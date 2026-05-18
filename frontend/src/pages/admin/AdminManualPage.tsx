import { motion } from 'framer-motion';
import { FileText, ArrowLeft, Book, Users, MapPin, BarChart3, Settings, Shield, Eye, UserCheck } from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';
import { useNavigate } from 'react-router-dom';

export default function AdminManualPage() {
  const navigate = useNavigate();

  return (
    <AdminLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/admin/settings')}
              className="flex items-center justify-center w-12 h-12 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex items-center justify-center w-16 h-16 shadow-lg bg-gradient-to-br from-emerald-600 to-green-600 rounded-2xl">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-transparent bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text">
                Administrator Manual
              </h1>
              <p className="flex items-center gap-2 mt-1 text-gray-600">
                <Book className="w-4 h-4" />
                Complete guide for system administrators
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto space-y-6">
          {/* Introduction */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Introduction</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Welcome to the MediMoms Administrator Manual. This comprehensive guide will help you manage the system 
              effectively, oversee user accounts, monitor activities, and maintain the platform. As an administrator, 
              you have full control over the MediMoms healthcare management system.
            </p>
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
              <p className="text-sm text-emerald-800">
                <strong>Version:</strong> 2.0.0 | <strong>Last Updated:</strong> February 2026
              </p>
            </div>
          </div>

          {/* Getting Started */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Shield className="w-6 h-6 text-emerald-600" />
              Getting Started
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">1. Administrator Login</h3>
                <p className="text-gray-600 mb-2">Access the admin panel with your administrator credentials:</p>
                <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                  <li>Navigate to the login page</li>
                  <li>Enter your admin username or email</li>
                  <li>Enter your secure password</li>
                  <li>You'll be redirected to the Admin Dashboard</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">2. Admin Dashboard Overview</h3>
                <p className="text-gray-600">
                  The admin dashboard provides system-wide statistics, pending approvals, recent activities, and 
                  quick access to all administrative functions.
                </p>
              </div>
            </div>
          </div>

          {/* User Management */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Users className="w-6 h-6 text-emerald-600" />
              User Management
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Approving Midwife Registrations</h3>
                <ol className="list-decimal list-inside text-gray-600 space-y-2 ml-4">
                  <li>Navigate to "Pending Accounts" from the sidebar</li>
                  <li>Review the midwife's registration details</li>
                  <li>Verify their credentials and information</li>
                  <li>Assign appropriate barangays (up to 3)</li>
                  <li>Click "Approve" to grant access or "Reject" to deny</li>
                  <li>The midwife will receive an email notification</li>
                </ol>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Managing Existing Users</h3>
                <p className="text-gray-600 mb-2">Go to "Manage Midwives" to:</p>
                <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                  <li>View all registered midwives</li>
                  <li>Edit user information and barangay assignments</li>
                  <li>Deactivate or reactivate accounts</li>
                  <li>Reset passwords if needed</li>
                  <li>Monitor user activity and last login</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Handling Barangay Change Requests</h3>
                <p className="text-gray-600">
                  Review and approve/reject requests from midwives who want to change their assigned barangays. 
                  Check their reason and verify the need before approving.
                </p>
              </div>
            </div>
          </div>

          {/* Barangay Management */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <MapPin className="w-6 h-6 text-emerald-600" />
              Barangay Management
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Adding New Barangays</h3>
                <ol className="list-decimal list-inside text-gray-600 space-y-2 ml-4">
                  <li>Go to "Manage Barangays" page</li>
                  <li>Click "Add Barangay" button</li>
                  <li>Enter barangay details:
                    <ul className="list-disc list-inside ml-6 mt-1">
                      <li>Barangay name</li>
                      <li>Address and contact information</li>
                      <li>Population data</li>
                      <li>Geographic coordinates (optional)</li>
                    </ul>
                  </li>
                  <li>Save the new barangay</li>
                </ol>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Editing Barangay Information</h3>
                <p className="text-gray-600">
                  Click on any barangay to edit its details, update contact information, or modify population data.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Assigning Midwives to Barangays</h3>
                <p className="text-gray-600">
                  Each midwife can be assigned to up to 3 barangays. Manage assignments through the User Management 
                  or Barangay Management pages to ensure proper coverage.
                </p>
              </div>
            </div>
          </div>

          {/* Reports & Analytics */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-emerald-600" />
              Reports & Analytics
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Generating System-Wide Reports</h3>
                <ol className="list-decimal list-inside text-gray-600 space-y-2 ml-4">
                  <li>Navigate to the Reports page</li>
                  <li>Select report type:
                    <ul className="list-disc list-inside ml-6 mt-1">
                      <li>Immunization Records</li>
                      <li>Family Planning Services</li>
                      <li>Maternal Care Records</li>
                      <li>Senior Citizen Monitoring</li>
                    </ul>
                  </li>
                  <li>Choose date range for the report</li>
                  <li>Select specific barangays or "All Barangays"</li>
                  <li>Click "Generate Report"</li>
                  <li>Export to PDF or Excel format</li>
                </ol>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Understanding Analytics</h3>
                <p className="text-gray-600">
                  The dashboard provides real-time analytics including total patients, active midwives, recent activities, 
                  and health program statistics across all barangays.
                </p>
              </div>
            </div>
          </div>

          {/* Audit Logs */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Eye className="w-6 h-6 text-emerald-600" />
              Audit Logs & Security
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Viewing Audit Trails</h3>
                <p className="text-gray-600 mb-2">Access comprehensive audit logs to monitor all system activities:</p>
                <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                  <li>User login and logout activities</li>
                  <li>Record creation, updates, and deletions</li>
                  <li>Failed login attempts</li>
                  <li>Data export activities</li>
                  <li>System configuration changes</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Filtering Audit Logs</h3>
                <p className="text-gray-600">
                  Use filters to search by user, action type, table name, or date range. Export logs for compliance 
                  and security audits.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Security Monitoring</h3>
                <p className="text-gray-600">
                  Regularly review audit logs for suspicious activities, multiple failed login attempts, or unauthorized 
                  access patterns. Take immediate action if security threats are detected.
                </p>
              </div>
            </div>
          </div>

          {/* System Settings */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Settings className="w-6 h-6 text-emerald-600" />
              System Settings
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Managing Your Admin Profile</h3>
                <p className="text-gray-600">
                  Navigate to Settings → Profile to update your administrator account information, including name, 
                  email, and contact details.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Changing Admin Password</h3>
                <p className="text-gray-600">
                  Go to Settings → Security to change your password. Use a strong password with at least 8 characters, 
                  including uppercase, lowercase, numbers, and special characters.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">System Maintenance</h3>
                <p className="text-gray-600">
                  Perform regular system maintenance including database backups, log cleanup, and performance monitoring 
                  to ensure optimal system operation.
                </p>
              </div>
            </div>
          </div>

          {/* Best Practices */}
          <div className="bg-gradient-to-br from-emerald-50 to-white border border-emerald-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Administrator Best Practices</h2>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">•</span>
                <span>Review pending account approvals promptly to avoid delays</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">•</span>
                <span>Verify midwife credentials thoroughly before approval</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">•</span>
                <span>Monitor audit logs weekly for security and compliance</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">•</span>
                <span>Export system reports monthly for backup and analysis</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">•</span>
                <span>Keep your admin password secure and change it every 90 days</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">•</span>
                <span>Respond to user requests and issues within 24-48 hours</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">•</span>
                <span>Maintain accurate barangay information and assignments</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">•</span>
                <span>Report critical system issues to IT support immediately</span>
              </li>
            </ul>
          </div>

          {/* Footer */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm text-center">
            <p className="text-gray-600 mb-2">Need more help?</p>
            <p className="text-sm text-gray-500">
              Contact admin support at <strong className="text-emerald-600">admin@medimoms.com</strong> or call <strong className="text-emerald-600">(049) 123-4569</strong>
            </p>
          </div>
        </div>
      </motion.div>
    </AdminLayout>
  );
}
