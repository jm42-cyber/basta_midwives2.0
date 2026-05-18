import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  BookOpen, 
  Shield, 
  Users, 
  FileText, 
  Database,
  Lock,
  Activity,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';

export default function DocumentationPage() {
  const navigate = useNavigate();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-gradient-to-br from-blue-50 to-white"
    >
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </button>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-black text-gray-900">Documentation</h1>
              <p className="text-gray-600 mt-1">Complete guide to using the MediMoms system</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Introduction */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl p-8 mb-8"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4">About MediMoms</h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            MediMoms is a comprehensive health record management system designed specifically for the Rural Health Unit 
            of Santa Cruz, Laguna. The system digitizes and streamlines health records across four major health programs 
            serving 26 barangays.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            Built with modern web technologies, MediMoms ensures secure, efficient, and DOH-compliant health record 
            management for midwives and healthcare administrators.
          </p>
        </motion.div>

        {/* System Features */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-xl p-8 mb-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <Activity className="w-8 h-8 text-primary-600" />
            <h2 className="text-3xl font-bold text-gray-900">System Features</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                title: 'Multi-Program Support',
                desc: 'Manage Immunization, Maternal Care, Family Planning, and Senior Citizen Care programs in one platform'
              },
              {
                title: 'Multi-Barangay Management',
                desc: 'Midwives can manage health records for up to 3 assigned barangays simultaneously'
              },
              {
                title: 'Role-Based Access Control',
                desc: 'Secure access with Admin and Midwife roles, each with appropriate permissions'
              },
              {
                title: 'Audit Logging',
                desc: 'Complete audit trail of all system activities for accountability and compliance'
              },
              {
                title: 'Export Capabilities',
                desc: 'Generate reports in Excel and PDF formats for documentation and reporting'
              },
              {
                title: 'DOH Compliance',
                desc: 'Forms and records follow Department of Health standards and guidelines'
              }
            ].map((feature, i) => (
              <div key={i} className="border border-gray-200 rounded-xl p-5">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">{feature.title}</h3>
                    <p className="text-sm text-gray-600">{feature.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* User Roles */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-xl p-8 mb-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <Users className="w-8 h-8 text-primary-600" />
            <h2 className="text-3xl font-bold text-gray-900">User Roles</h2>
          </div>
          <div className="space-y-6">
            <div className="border-l-4 border-primary-600 pl-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Administrator</h3>
              <p className="text-gray-700 mb-3">
                Full system access with user management, barangay assignment, and system configuration capabilities.
              </p>
              <ul className="space-y-2">
                {[
                  'Manage user accounts and approve midwife registrations',
                  'Assign barangays to midwives (up to 3 per midwife)',
                  'View all health records across all barangays',
                  'Generate system-wide reports and analytics',
                  'Configure system settings and manage audit logs'
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-primary-600 mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-l-4 border-blue-600 pl-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Midwife</h3>
              <p className="text-gray-700 mb-3">
                Access to assigned barangays with full CRUD operations on health records within their jurisdiction.
              </p>
              <ul className="space-y-2">
                {[
                  'Create, read, update, and delete health records',
                  'Manage records for assigned barangays only',
                  'Access all four health program modules',
                  'Generate reports for assigned barangays',
                  'Track vaccination schedules and follow-ups'
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Health Programs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl shadow-xl p-8 mb-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <FileText className="w-8 h-8 text-primary-600" />
            <h2 className="text-3xl font-bold text-gray-900">Health Programs</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                name: 'Immunization Program',
                desc: 'Track infant and child vaccinations including BCG, DPT, OPV, Measles, and Hepatitis B. Monitor nutritional status and Vitamin A supplementation.',
                color: 'blue'
              },
              {
                name: 'Maternal Care Program',
                desc: 'Prenatal monitoring for expecting mothers including tetanus immunization, micronutrient supplementation, and disease screening.',
                color: 'pink'
              },
              {
                name: 'Family Planning Program',
                desc: 'Manage contraceptive provision and counseling including pills, injectables, IUD, and natural family planning methods.',
                color: 'purple'
              },
              {
                name: 'Senior Citizen Care',
                desc: 'Visual acuity screening, PPV and Influenza vaccinations, and regular health monitoring for elderly residents.',
                color: 'orange'
              }
            ].map((program, i) => (
              <div key={i} className={`border-2 border-${program.color}-200 rounded-xl p-5 bg-${program.color}-50`}>
                <h3 className={`font-bold text-${program.color}-900 mb-2`}>{program.name}</h3>
                <p className="text-sm text-gray-700">{program.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Security & Privacy */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl shadow-xl p-8 mb-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-8 h-8 text-primary-600" />
            <h2 className="text-3xl font-bold text-gray-900">Security & Privacy</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Lock className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Authentication & Authorization</h3>
                <p className="text-gray-700">
                  Secure token-based authentication using Laravel Sanctum. Role-based access control ensures users 
                  only access data within their permissions.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Database className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Data Protection</h3>
                <p className="text-gray-700">
                  All sensitive health data is encrypted and stored securely. Regular backups ensure data integrity 
                  and availability.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Activity className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Audit Logging</h3>
                <p className="text-gray-700">
                  Complete audit trail of all system activities including user actions, record modifications, and 
                  access attempts for accountability.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Getting Started */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-gradient-to-br from-primary-600 to-primary-500 rounded-2xl p-8 text-white"
        >
          <div className="flex items-center gap-3 mb-6">
            <Info className="w-8 h-8 text-white" />
            <h2 className="text-3xl font-bold">Getting Started</h2>
          </div>
          <div className="space-y-4 mb-6">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0 font-bold">
                1
              </div>
              <div>
                <h3 className="font-bold mb-1">Register an Account</h3>
                <p className="text-primary-100">
                  Create your account with valid credentials. Midwife accounts require admin approval.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0 font-bold">
                2
              </div>
              <div>
                <h3 className="font-bold mb-1">Wait for Approval</h3>
                <p className="text-primary-100">
                  Admin will review and approve your account, then assign barangays to your profile.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0 font-bold">
                3
              </div>
              <div>
                <h3 className="font-bold mb-1">Start Managing Records</h3>
                <p className="text-primary-100">
                  Access your dashboard and begin creating and managing health records for your assigned barangays.
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={() => navigate('/register')}
            className="px-8 py-4 bg-white text-primary-600 rounded-xl font-bold hover:shadow-xl transition-all"
          >
            Register Now
          </button>
        </motion.div>

        {/* Support Notice */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mt-8"
        >
          <div className="flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-amber-900 mb-2">Need Help?</h3>
              <p className="text-amber-800">
                For technical support or questions about the system, please contact the Santa Cruz Rural Health Unit 
                or your system administrator.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
