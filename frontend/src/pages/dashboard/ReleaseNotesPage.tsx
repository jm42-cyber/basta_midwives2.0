import { motion } from 'framer-motion';
import { Bell, ArrowLeft, Sparkles, Bug, Zap, Shield, CheckCircle } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { useNavigate } from 'react-router-dom';

export default function ReleaseNotesPage() {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/dashboard/settings')}
              className="flex items-center justify-center w-12 h-12 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex items-center justify-center w-16 h-16 shadow-lg bg-gradient-to-br from-primary-600 to-primary-500 rounded-2xl">
              <Bell className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-transparent bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text">
                Release Notes
              </h1>
              <p className="flex items-center gap-2 mt-1 text-gray-600">
                <Sparkles className="w-4 h-4" />
                What's new in MediMoms
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          {/* Version 2.0.0 */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Version 2.0.0</h2>
                <p className="text-sm text-gray-500">Released: February 2026</p>
              </div>
              <span className="px-4 py-2 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-lg text-sm font-semibold">
                Latest
              </span>
            </div>

            <div className="space-y-6">
              {/* New Features */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary-600" />
                  New Features
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-3 text-gray-600">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span><strong>Complete System Redesign:</strong> Modern, responsive UI built with React and Tailwind CSS</span>
                  </li>
                  <li className="flex items-start gap-3 text-gray-600">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span><strong>Dashboard Analytics:</strong> Real-time statistics and insights for healthcare monitoring</span>
                  </li>
                  <li className="flex items-start gap-3 text-gray-600">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span><strong>Immunization Management:</strong> Comprehensive vaccine tracking and scheduling system</span>
                  </li>
                  <li className="flex items-start gap-3 text-gray-600">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span><strong>Family Planning Module:</strong> Track consultations and contraceptive methods</span>
                  </li>
                  <li className="flex items-start gap-3 text-gray-600">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span><strong>Maternal Care Records:</strong> Prenatal, delivery, and postnatal care documentation</span>
                  </li>
                  <li className="flex items-start gap-3 text-gray-600">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span><strong>Senior Citizen Monitoring:</strong> Health tracking for elderly patients</span>
                  </li>
                  <li className="flex items-start gap-3 text-gray-600">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span><strong>Advanced Reporting:</strong> Generate and export reports in PDF and Excel formats</span>
                  </li>
                  <li className="flex items-start gap-3 text-gray-600">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span><strong>Multi-Barangay Support:</strong> Manage records across 26 barangays in Santa Cruz, Laguna</span>
                  </li>
                  <li className="flex items-start gap-3 text-gray-600">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span><strong>Role-Based Access Control:</strong> Separate admin and midwife permissions</span>
                  </li>
                </ul>
              </div>

              {/* Improvements */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-600" />
                  Improvements
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-3 text-gray-600">
                    <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <span><strong>Performance:</strong> Faster page load times and smoother animations</span>
                  </li>
                  <li className="flex items-start gap-3 text-gray-600">
                    <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <span><strong>Mobile Responsiveness:</strong> Fully optimized for tablets and smartphones</span>
                  </li>
                  <li className="flex items-start gap-3 text-gray-600">
                    <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <span><strong>Search Functionality:</strong> Enhanced search with filters and sorting options</span>
                  </li>
                  <li className="flex items-start gap-3 text-gray-600">
                    <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <span><strong>Data Validation:</strong> Improved form validation for data accuracy</span>
                  </li>
                  <li className="flex items-start gap-3 text-gray-600">
                    <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <span><strong>User Experience:</strong> Intuitive navigation and cleaner interface</span>
                  </li>
                </ul>
              </div>

              {/* Security */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-red-600" />
                  Security Enhancements
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-3 text-gray-600">
                    <CheckCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <span><strong>Laravel Sanctum:</strong> Secure API authentication with token-based system</span>
                  </li>
                  <li className="flex items-start gap-3 text-gray-600">
                    <CheckCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <span><strong>Password Hashing:</strong> Bcrypt encryption for all user passwords</span>
                  </li>
                  <li className="flex items-start gap-3 text-gray-600">
                    <CheckCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <span><strong>CSRF Protection:</strong> Built-in protection against cross-site request forgery</span>
                  </li>
                  <li className="flex items-start gap-3 text-gray-600">
                    <CheckCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <span><strong>Audit Logging:</strong> Track all user actions for accountability</span>
                  </li>
                </ul>
              </div>

              {/* Bug Fixes */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Bug className="w-5 h-5 text-purple-600" />
                  Bug Fixes
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-3 text-gray-600">
                    <CheckCircle className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                    <span>Fixed date picker issues in record forms</span>
                  </li>
                  <li className="flex items-start gap-3 text-gray-600">
                    <CheckCircle className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                    <span>Resolved pagination errors in patient lists</span>
                  </li>
                  <li className="flex items-start gap-3 text-gray-600">
                    <CheckCircle className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                    <span>Corrected report export formatting issues</span>
                  </li>
                  <li className="flex items-start gap-3 text-gray-600">
                    <CheckCircle className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                    <span>Fixed mobile menu navigation bugs</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Version 1.0.0 */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Version 1.0.0</h2>
                <p className="text-sm text-gray-500">Released: March 2024</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary-600" />
                  Initial Release
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-3 text-gray-600">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Basic patient record management</span>
                  </li>
                  <li className="flex items-start gap-3 text-gray-600">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Simple immunization tracking</span>
                  </li>
                  <li className="flex items-start gap-3 text-gray-600">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>User authentication system</span>
                  </li>
                  <li className="flex items-start gap-3 text-gray-600">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Basic reporting functionality</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Coming Soon */}
          <div className="bg-gradient-to-br from-primary-50 to-white border border-primary-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-primary-600" />
              Coming Soon
            </h2>
            <p className="text-gray-600 mb-4">We're constantly working to improve MediMoms. Here's what's planned for future releases:</p>
            <ul className="space-y-2">
              <li className="flex items-start gap-3 text-gray-600">
                <span className="text-primary-600 font-bold">•</span>
                <span>SMS notifications for appointment reminders</span>
              </li>
              <li className="flex items-start gap-3 text-gray-600">
                <span className="text-primary-600 font-bold">•</span>
                <span>Mobile app for iOS and Android</span>
              </li>
              <li className="flex items-start gap-3 text-gray-600">
                <span className="text-primary-600 font-bold">•</span>
                <span>Advanced analytics and data visualization</span>
              </li>
              <li className="flex items-start gap-3 text-gray-600">
                <span className="text-primary-600 font-bold">•</span>
                <span>Integration with national health databases</span>
              </li>
              <li className="flex items-start gap-3 text-gray-600">
                <span className="text-primary-600 font-bold">•</span>
                <span>Telemedicine consultation features</span>
              </li>
            </ul>
          </div>

          {/* Footer */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm text-center">
            <p className="text-gray-600 mb-2">Have suggestions for future updates?</p>
            <p className="text-sm text-gray-500">
              Contact us at <strong className="text-primary-600">support@medimoms.com</strong>
            </p>
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
