import { motion } from 'framer-motion';
import { Shield, ArrowLeft, Lock, Eye, AlertTriangle, CheckCircle, Key, Database, UserX, Wifi } from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';
import { useNavigate } from 'react-router-dom';

export default function SecurityGuidePage() {
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
            <div className="flex items-center justify-center w-16 h-16 shadow-lg bg-gradient-to-br from-red-600 to-orange-600 rounded-2xl">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-transparent bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text">
                Security Guide
              </h1>
              <p className="flex items-center gap-2 mt-1 text-gray-600">
                <Lock className="w-4 h-4" />
                Best practices for protecting sensitive health data
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          {/* Authentication & Access Control */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Authentication & Access Control</h2>
                <p className="text-sm text-gray-500">Protecting your administrator account</p>
              </div>
              <span className="px-4 py-2 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-lg text-sm font-semibold">
                Critical
              </span>
            </div>

            <div className="space-y-6">
              {/* Strong Passwords */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Key className="w-5 h-5 text-red-600" />
                  Strong Password Policy
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-3 text-gray-600">
                    <CheckCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <span><strong>Minimum 8 characters:</strong> Use at least 8 characters including uppercase, lowercase, numbers, and special characters</span>
                  </li>
                  <li className="flex items-start gap-3 text-gray-600">
                    <CheckCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <span><strong>Avoid common passwords:</strong> Never use "password123", "admin", or easily guessable combinations</span>
                  </li>
                  <li className="flex items-start gap-3 text-gray-600">
                    <CheckCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <span><strong>Unique passwords:</strong> Don't reuse passwords from other accounts or systems</span>
                  </li>
                  <li className="flex items-start gap-3 text-gray-600">
                    <CheckCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <span><strong>Regular changes:</strong> Update your password every 90 days for maximum security</span>
                  </li>
                </ul>
              </div>

              {/* Session Management */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Lock className="w-5 h-5 text-orange-600" />
                  Session Management
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-3 text-gray-600">
                    <CheckCircle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                    <span><strong>Always log out:</strong> Log out when using shared or public computers</span>
                  </li>
                  <li className="flex items-start gap-3 text-gray-600">
                    <CheckCircle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                    <span><strong>Session timeout:</strong> System automatically logs you out after 30 minutes of inactivity</span>
                  </li>
                  <li className="flex items-start gap-3 text-gray-600">
                    <CheckCircle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                    <span><strong>Single session:</strong> Only one active session per account is allowed</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Data Protection & Privacy */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Data Protection & Privacy</h2>
                <p className="text-sm text-gray-500">Safeguarding patient health information</p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Patient Data Confidentiality */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Database className="w-5 h-5 text-purple-600" />
                  Patient Data Confidentiality
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-3 text-gray-600">
                    <CheckCircle className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                    <span><strong>Never share patient data:</strong> Patient information must never be shared outside the system</span>
                  </li>
                  <li className="flex items-start gap-3 text-gray-600">
                    <CheckCircle className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                    <span><strong>Data Privacy Act compliance:</strong> All health data is protected by Philippine Data Privacy Act</span>
                  </li>
                  <li className="flex items-start gap-3 text-gray-600">
                    <CheckCircle className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                    <span><strong>Access logging:</strong> All data access is logged in audit trails for accountability</span>
                  </li>
                  <li className="flex items-start gap-3 text-gray-600">
                    <CheckCircle className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                    <span><strong>Secure exports:</strong> When exporting reports, store files securely and delete after use</span>
                  </li>
                </ul>
              </div>

              {/* Data Backup */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Database className="w-5 h-5 text-blue-600" />
                  Data Backup & Recovery
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-3 text-gray-600">
                    <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <span><strong>Automated backups:</strong> System performs daily automated backups</span>
                  </li>
                  <li className="flex items-start gap-3 text-gray-600">
                    <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <span><strong>Verify backups:</strong> Regularly verify that backups are running successfully</span>
                  </li>
                  <li className="flex items-start gap-3 text-gray-600">
                    <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <span><strong>Export reports:</strong> Export important reports monthly for additional backup</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* User Account Security */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">User Account Security</h2>
                <p className="text-sm text-gray-500">Managing midwife accounts safely</p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Account Verification */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <UserX className="w-5 h-5 text-green-600" />
                  Account Verification & Approval
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-3 text-gray-600">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span><strong>Verify credentials:</strong> Thoroughly verify midwife credentials before approval</span>
                  </li>
                  <li className="flex items-start gap-3 text-gray-600">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span><strong>Check identity:</strong> Confirm identity through official documents or in-person verification</span>
                  </li>
                  <li className="flex items-start gap-3 text-gray-600">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span><strong>Proper assignments:</strong> Assign barangays based on actual work assignments</span>
                  </li>
                </ul>
              </div>

              {/* Monitoring Activity */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Eye className="w-5 h-5 text-yellow-600" />
                  Monitoring User Activity
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-3 text-gray-600">
                    <CheckCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                    <span><strong>Review audit logs:</strong> Check audit logs weekly for suspicious activities</span>
                  </li>
                  <li className="flex items-start gap-3 text-gray-600">
                    <CheckCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                    <span><strong>Failed login attempts:</strong> Monitor accounts with multiple failed login attempts</span>
                  </li>
                  <li className="flex items-start gap-3 text-gray-600">
                    <CheckCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                    <span><strong>Unusual patterns:</strong> Watch for abnormal data access or export activities</span>
                  </li>
                  <li className="flex items-start gap-3 text-gray-600">
                    <CheckCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                    <span><strong>Inactive accounts:</strong> Deactivate accounts inactive for 90+ days</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Network & Device Security */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Network & Device Security</h2>
                <p className="text-sm text-gray-500">Protecting your access points</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Wifi className="w-5 h-5 text-indigo-600" />
                  Secure Network Practices
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-3 text-gray-600">
                    <CheckCircle className="w-5 h-5 text-indigo-500 flex-shrink-0 mt-0.5" />
                    <span><strong>Secure networks only:</strong> Access the system only from secure, trusted networks</span>
                  </li>
                  <li className="flex items-start gap-3 text-gray-600">
                    <CheckCircle className="w-5 h-5 text-indigo-500 flex-shrink-0 mt-0.5" />
                    <span><strong>Avoid public WiFi:</strong> Never access admin panel from public WiFi or unsecured networks</span>
                  </li>
                  <li className="flex items-start gap-3 text-gray-600">
                    <CheckCircle className="w-5 h-5 text-indigo-500 flex-shrink-0 mt-0.5" />
                    <span><strong>Updated software:</strong> Keep browser, OS, and security software up to date</span>
                  </li>
                  <li className="flex items-start gap-3 text-gray-600">
                    <CheckCircle className="w-5 h-5 text-indigo-500 flex-shrink-0 mt-0.5" />
                    <span><strong>Antivirus protection:</strong> Maintain active antivirus software on all devices</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Incident Response */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Incident Response</h2>
                <p className="text-sm text-gray-500">What to do when security issues arise</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  Security Incident Procedures
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-3 text-gray-600">
                    <CheckCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <span><strong>Immediate reporting:</strong> Report security incidents to IT support immediately</span>
                  </li>
                  <li className="flex items-start gap-3 text-gray-600">
                    <CheckCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <span><strong>Account lockdown:</strong> Suspend compromised accounts immediately</span>
                  </li>
                  <li className="flex items-start gap-3 text-gray-600">
                    <CheckCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <span><strong>Document incidents:</strong> Record all details including timestamps and affected accounts</span>
                  </li>
                  <li className="flex items-start gap-3 text-gray-600">
                    <CheckCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <span><strong>Force password reset:</strong> Require password changes for affected accounts</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Security Threats Awareness */}
          <div className="bg-gradient-to-br from-red-50 to-white border border-red-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-red-600" />
              Common Security Threats
            </h2>
            <p className="text-gray-600 mb-4">Be aware of these common security threats and how to avoid them:</p>
            <ul className="space-y-2">
              <li className="flex items-start gap-3 text-gray-600">
                <span className="text-red-600 font-bold">•</span>
                <span><strong>Phishing attacks:</strong> Be cautious of emails requesting login credentials or system access</span>
              </li>
              <li className="flex items-start gap-3 text-gray-600">
                <span className="text-red-600 font-bold">•</span>
                <span><strong>Social engineering:</strong> Verify identity before granting access or sharing information</span>
              </li>
              <li className="flex items-start gap-3 text-gray-600">
                <span className="text-red-600 font-bold">•</span>
                <span><strong>Unauthorized access:</strong> Never share your admin credentials with anyone</span>
              </li>
              <li className="flex items-start gap-3 text-gray-600">
                <span className="text-red-600 font-bold">•</span>
                <span><strong>Data breaches:</strong> Report any suspected data leaks immediately</span>
              </li>
              <li className="flex items-start gap-3 text-gray-600">
                <span className="text-red-600 font-bold">•</span>
                <span><strong>Malware:</strong> Don't download suspicious files or click unknown links</span>
              </li>
            </ul>
          </div>

          {/* Emergency Contact */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm text-center">
            <p className="text-gray-600 mb-2">Security Emergency Contact</p>
            <p className="text-sm text-gray-500">
              For critical security incidents, call <strong className="text-red-600">(049) 123-4570</strong> (24/7) or email <strong className="text-red-600">security@medimoms.com</strong>
            </p>
          </div>
        </div>
      </motion.div>
    </AdminLayout>
  );
}
