import { motion } from 'framer-motion';
import { FileText, ArrowLeft, Book, Users, Syringe, Heart, UserCircle, BarChart3, Settings, Shield } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { useNavigate } from 'react-router-dom';

export default function UserManualPage() {
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
              <FileText className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-transparent bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text">
                User Manual
              </h1>
              <p className="flex items-center gap-2 mt-1 text-gray-600">
                <Book className="w-4 h-4" />
                Complete guide to using MediMoms
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto space-y-6">
          {/* Introduction */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Introduction</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Welcome to the MediMoms User Manual. This comprehensive guide will help you navigate and utilize all features 
              of the system effectively. MediMoms is designed to streamline healthcare record management for midwives in 
              Santa Cruz, Laguna.
            </p>
            <div className="bg-primary-50 border border-primary-200 rounded-xl p-4">
              <p className="text-sm text-primary-800">
                <strong>Version:</strong> 2.0.0 | <strong>Last Updated:</strong> February 2026
              </p>
            </div>
          </div>

          {/* Getting Started */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Shield className="w-6 h-6 text-primary-600" />
              Getting Started
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">1. Logging In</h3>
                <p className="text-gray-600 mb-2">Access the system at your designated URL and enter your credentials:</p>
                <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                  <li>Enter your username or email address</li>
                  <li>Enter your password</li>
                  <li>Click "Login" to access the dashboard</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">2. Dashboard Overview</h3>
                <p className="text-gray-600">
                  After logging in, you'll see the main dashboard with statistics, recent activities, and quick actions.
                </p>
              </div>
            </div>
          </div>

          {/* Patient Management */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Users className="w-6 h-6 text-primary-600" />
              Patient Management
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Adding a New Patient</h3>
                <ol className="list-decimal list-inside text-gray-600 space-y-2 ml-4">
                  <li>Navigate to the Patients page from the sidebar</li>
                  <li>Click the "Add Patient" button</li>
                  <li>Fill in all required fields:
                    <ul className="list-disc list-inside ml-6 mt-1">
                      <li>First Name, Middle Name (optional), Last Name</li>
                      <li>Date of Birth</li>
                      <li>Gender</li>
                      <li>Address and Barangay</li>
                      <li>Contact Number</li>
                    </ul>
                  </li>
                  <li>Click "Save" to create the patient record</li>
                </ol>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Searching for Patients</h3>
                <p className="text-gray-600">Use the search bar to find patients by name, ID, or contact number. Apply filters for barangay, age range, or registration date.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Editing Patient Information</h3>
                <p className="text-gray-600">Click on a patient record, then click "Edit" to update their information. Save changes when done.</p>
              </div>
            </div>
          </div>

          {/* Immunization Records */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Syringe className="w-6 h-6 text-primary-600" />
              Immunization Records
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Recording Immunizations</h3>
                <ol className="list-decimal list-inside text-gray-600 space-y-2 ml-4">
                  <li>Go to Immunization page</li>
                  <li>Click "Add Immunization Record"</li>
                  <li>Select the patient</li>
                  <li>Enter vaccine details:
                    <ul className="list-disc list-inside ml-6 mt-1">
                      <li>Vaccine name and type</li>
                      <li>Date administered</li>
                      <li>Dose number</li>
                      <li>Next dose date (if applicable)</li>
                    </ul>
                  </li>
                  <li>Add any notes or observations</li>
                  <li>Save the record</li>
                </ol>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Tracking Vaccination Schedules</h3>
                <p className="text-gray-600">View upcoming vaccinations in the dashboard. The system will highlight overdue vaccinations.</p>
              </div>
            </div>
          </div>

          {/* Family Planning */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <UserCircle className="w-6 h-6 text-primary-600" />
              Family Planning Services
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Recording Family Planning Consultations</h3>
                <ol className="list-decimal list-inside text-gray-600 space-y-2 ml-4">
                  <li>Navigate to Family Planning page</li>
                  <li>Click "Add Record"</li>
                  <li>Select the patient</li>
                  <li>Record consultation details:
                    <ul className="list-disc list-inside ml-6 mt-1">
                      <li>Method chosen</li>
                      <li>Date of consultation</li>
                      <li>Follow-up date</li>
                      <li>Notes and observations</li>
                    </ul>
                  </li>
                  <li>Save the record</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Maternal Care */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Heart className="w-6 h-6 text-primary-600" />
              Maternal Care Records
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Prenatal Care</h3>
                <p className="text-gray-600 mb-2">Record prenatal visits including:</p>
                <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                  <li>Weight and blood pressure</li>
                  <li>Fundal height</li>
                  <li>Fetal heart rate</li>
                  <li>Laboratory results</li>
                  <li>Medications prescribed</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Delivery Records</h3>
                <p className="text-gray-600">Document delivery details, complications, and newborn information.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Postnatal Care</h3>
                <p className="text-gray-600">Track postpartum visits and mother's recovery progress.</p>
              </div>
            </div>
          </div>

          {/* Reports */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-primary-600" />
              Generating Reports
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Creating Reports</h3>
                <ol className="list-decimal list-inside text-gray-600 space-y-2 ml-4">
                  <li>Go to Reports page</li>
                  <li>Select report type (Immunization, Family Planning, Maternal Care, etc.)</li>
                  <li>Choose date range</li>
                  <li>Select barangay (or all barangays)</li>
                  <li>Click "Generate Report"</li>
                  <li>Export to PDF or Excel format</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Settings */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Settings className="w-6 h-6 text-primary-600" />
              Account Settings
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Updating Profile</h3>
                <p className="text-gray-600">Navigate to Settings → Profile to update your name, email, and contact information.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Changing Password</h3>
                <p className="text-gray-600">Go to Settings → Security to change your password. Ensure it meets security requirements.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Managing Barangay Assignments</h3>
                <p className="text-gray-600">Request barangay changes in Settings → Barangays. Admin approval is required.</p>
              </div>
            </div>
          </div>

          {/* Best Practices */}
          <div className="bg-gradient-to-br from-green-50 to-white border border-green-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Best Practices</h2>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">•</span>
                <span>Always double-check patient information before saving records</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">•</span>
                <span>Log out when using shared computers</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">•</span>
                <span>Keep your password secure and change it regularly</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">•</span>
                <span>Export important reports regularly for backup</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">•</span>
                <span>Report any system issues immediately to IT support</span>
              </li>
            </ul>
          </div>

          {/* Footer */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm text-center">
            <p className="text-gray-600 mb-2">Need more help?</p>
            <p className="text-sm text-gray-500">
              Contact support at <strong className="text-primary-600">support@medimoms.com</strong> or call <strong className="text-primary-600">(049) 123-4567</strong>
            </p>
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
