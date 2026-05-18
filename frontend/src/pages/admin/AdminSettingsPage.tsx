import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Settings, User, Mail, Lock, Shield, Bell, 
  Save, Eye, EyeOff, CheckCircle, HelpCircle, Info,
  Rocket, MessageCircle, Monitor, Lightbulb, Phone, FileText, Bug, Heart,
  Target, Eye as EyeIcon, Users, GraduationCap, Code, Award, Calendar,
  MapPin
} from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'react-toastify';

export default function AdminSettingsPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'help' | 'about'>('profile');
  
  // Profile state
  const [firstName, setFirstName] = useState(user?.first_name || '');
  const [middleName, setMiddleName] = useState(user?.middle_name || '');
  const [lastName, setLastName] = useState(user?.last_name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [contactNumber, setContactNumber] = useState(user?.contact_number || '');
  
  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Loading states
  const [savingProfile, setSavingProfile] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    // TODO: Implement API call
    setTimeout(() => {
      toast.success('Profile updated successfully!');
      setSavingProfile(false);
    }, 1000);
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    
    setChangingPassword(true);
    // TODO: Implement API call
    setTimeout(() => {
      toast.success('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setChangingPassword(false);
    }, 1000);
  };

  const tabs = [
    { id: 'profile' as const, label: 'Profile', icon: User },
    { id: 'security' as const, label: 'Security', icon: Shield },
    { id: 'help' as const, label: 'Help', icon: HelpCircle },
    { id: 'about' as const, label: 'About', icon: Info },
  ];

  return (
    <AdminLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-16 h-16 shadow-lg bg-gradient-to-br from-emerald-500 via-green-600 to-teal-600 rounded-2xl">
              <Settings className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-transparent bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text">
                Admin Settings
              </h1>
              <p className="flex items-center gap-2 mt-1 text-gray-600">
                <Settings className="w-4 h-4" />
                Manage your administrator account settings
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Tabs */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
              <div className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all ${
                        activeTab === tab.id
                          ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-lg'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>
            
            {/* Decorative Card for Help and About tabs */}
            {(activeTab === 'help' || activeTab === 'about') && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="mt-4 bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200 rounded-2xl p-4 shadow-sm"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-green-600 rounded-xl flex items-center justify-center shadow-md">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">MediMoms Admin</h3>
                    <p className="text-xs text-gray-600">Version 2.0.0</p>
                  </div>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed mb-3">
                  Empowering administrators with comprehensive healthcare management tools
                </p>
                <div className="border-t border-emerald-200 pt-3 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Santa Cruz, Laguna</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Released February 2026</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
                    <span>LSPU BSIT Project</span>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-emerald-200">
                  <p className="text-xs text-gray-500 text-center">
                    Developed by 4 dedicated students
                  </p>
                </div>
              </motion.div>
            )}
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm"
              >
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
                  <User className="w-6 h-6 text-gray-700" />
                  <h2 className="text-xl font-bold text-gray-900">Profile Information</h2>
                </div>

                <div className="space-y-6">
                  {/* Name Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Middle Name
                      </label>
                      <input
                        type="text"
                        value={middleName}
                        onChange={(e) => setMiddleName(e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Mail className="w-4 h-4 inline mr-1" />
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Changing your email will require verification
                    </p>
                  </div>

                  {/* Contact Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Number
                    </label>
                    <input
                      type="text"
                      value={contactNumber}
                      onChange={(e) => setContactNumber(e.target.value)}
                      maxLength={11}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>

                  {/* Save Button */}
                  <div className="flex justify-end pt-4 border-t border-gray-200">
                    <button
                      onClick={handleSaveProfile}
                      disabled={savingProfile}
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-xl hover:from-emerald-700 hover:to-green-700 font-semibold transition-all disabled:opacity-50"
                    >
                      {savingProfile ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-5 h-5" />
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm"
              >
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
                  <Lock className="w-6 h-6 text-gray-700" />
                  <h2 className="text-xl font-bold text-gray-900">Change Password</h2>
                </div>

                <div className="space-y-6">
                  {/* Current Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showCurrentPassword ? 'text' : 'password'}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full px-4 py-2.5 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* New Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-4 py-2.5 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Must be at least 8 characters long
                    </p>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm New Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-4 py-2.5 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Password Requirements */}
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <h3 className="text-sm font-semibold text-blue-900 mb-2">Password Requirements:</h3>
                    <ul className="space-y-1 text-xs text-blue-700">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        At least 8 characters long
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        Contains uppercase and lowercase letters
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        Contains at least one number
                      </li>
                    </ul>
                  </div>

                  {/* Change Password Button */}
                  <div className="flex justify-end pt-4 border-t border-gray-200">
                    <button
                      onClick={handleChangePassword}
                      disabled={changingPassword || !currentPassword || !newPassword || !confirmPassword}
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-xl hover:from-emerald-700 hover:to-green-700 font-semibold transition-all disabled:opacity-50"
                    >
                      {changingPassword ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Changing...
                        </>
                      ) : (
                        <>
                          <Lock className="w-5 h-5" />
                          Change Password
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Help Tab */}
            {activeTab === 'help' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm"
              >
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
                  <HelpCircle className="w-6 h-6 text-emerald-600" />
                  <h2 className="text-xl font-bold text-gray-900">Administrator Help & Support</h2>
                </div>

                <div className="space-y-6">
                  {/* Getting Started */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Rocket className="w-5 h-5 text-emerald-600" />
                      Administrator Dashboard Overview
                    </h3>
                    <div className="bg-gradient-to-br from-emerald-50 to-white border border-emerald-200 rounded-xl p-5">
                      <p className="text-sm text-gray-700 mb-4">
                        As an administrator, you have full control over the MediMoms system. Here's your command center:
                      </p>
                      <ol className="space-y-2 text-sm text-gray-600">
                        <li className="flex items-start gap-2">
                          <span className="flex-shrink-0 w-6 h-6 bg-emerald-600 text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
                          <span><strong className="text-gray-900">Dashboard:</strong> Monitor system-wide statistics, user activities, and key metrics across all barangays</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="flex-shrink-0 w-6 h-6 bg-emerald-600 text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
                          <span><strong className="text-gray-900">User Management:</strong> Approve, reject, or manage midwife accounts and their barangay assignments</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="flex-shrink-0 w-6 h-6 bg-emerald-600 text-white rounded-full flex items-center justify-center text-xs font-bold">3</span>
                          <span><strong className="text-gray-900">Barangay Management:</strong> Add, edit, or remove barangay information and manage coverage areas</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="flex-shrink-0 w-6 h-6 bg-emerald-600 text-white rounded-full flex items-center justify-center text-xs font-bold">4</span>
                          <span><strong className="text-gray-900">Reports:</strong> Generate comprehensive reports across all programs and barangays with export capabilities</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="flex-shrink-0 w-6 h-6 bg-emerald-600 text-white rounded-full flex items-center justify-center text-xs font-bold">5</span>
                          <span><strong className="text-gray-900">Audit Logs:</strong> Track all system activities, user actions, and data changes for security and compliance</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="flex-shrink-0 w-6 h-6 bg-emerald-600 text-white rounded-full flex items-center justify-center text-xs font-bold">6</span>
                          <span><strong className="text-gray-900">System Settings:</strong> Configure system-wide preferences and maintain platform integrity</span>
                        </li>
                      </ol>
                    </div>
                  </div>

                  {/* FAQ Section */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <MessageCircle className="w-5 h-5 text-emerald-600" />
                      Administrator FAQs
                    </h3>
                    <div className="space-y-3">
                      <details className="bg-gray-50 rounded-xl p-4 cursor-pointer hover:bg-gray-100 transition-colors">
                        <summary className="font-semibold text-gray-900 cursor-pointer">How do I approve a new midwife registration?</summary>
                        <p className="text-sm text-gray-600 mt-3 pl-4 border-l-2 border-emerald-500">
                          Navigate to User Management → Pending Approvals. Review the midwife's information, verify their credentials, 
                          and click "Approve" to grant access. You can also assign or modify their barangay coverage during approval.
                        </p>
                      </details>
                      
                      <details className="bg-gray-50 rounded-xl p-4 cursor-pointer hover:bg-gray-100 transition-colors">
                        <summary className="font-semibold text-gray-900 cursor-pointer">How do I manage barangay assignments?</summary>
                        <p className="text-sm text-gray-600 mt-3 pl-4 border-l-2 border-emerald-500">
                          Go to Barangay Management page. You can add new barangays, edit existing ones, or assign/reassign midwives 
                          to specific barangays. Each midwife can be assigned to up to 3 barangays for optimal coverage.
                        </p>
                      </details>
                      
                      <details className="bg-gray-50 rounded-xl p-4 cursor-pointer hover:bg-gray-100 transition-colors">
                        <summary className="font-semibold text-gray-900 cursor-pointer">How do I view audit logs?</summary>
                        <p className="text-sm text-gray-600 mt-3 pl-4 border-l-2 border-emerald-500">
                          Access Audit Logs from the admin menu. You can filter by user, action type, table name, or date range. 
                          All system activities including logins, data modifications, and deletions are tracked for security compliance.
                        </p>
                      </details>
                      
                      <details className="bg-gray-50 rounded-xl p-4 cursor-pointer hover:bg-gray-100 transition-colors">
                        <summary className="font-semibold text-gray-900 cursor-pointer">How do I generate system-wide reports?</summary>
                        <p className="text-sm text-gray-600 mt-3 pl-4 border-l-2 border-emerald-500">
                          Visit the Reports page, select the program type (Immunization, Family Planning, Maternal Care, Senior Citizen), 
                          choose "All Barangays" or specific ones, set your date range, and click Generate. Export to Excel or PDF as needed.
                        </p>
                      </details>
                      
                      <details className="bg-gray-50 rounded-xl p-4 cursor-pointer hover:bg-gray-100 transition-colors">
                        <summary className="font-semibold text-gray-900 cursor-pointer">How do I deactivate or remove a midwife account?</summary>
                        <p className="text-sm text-gray-600 mt-3 pl-4 border-l-2 border-emerald-500">
                          In User Management, find the midwife's account and click "Edit". You can change their status to "Inactive" 
                          to temporarily suspend access, or "Rejected" to permanently revoke access. All actions are logged in audit trails.
                        </p>
                      </details>
                      
                      <details className="bg-gray-50 rounded-xl p-4 cursor-pointer hover:bg-gray-100 transition-colors">
                        <summary className="font-semibold text-gray-900 cursor-pointer">How do I handle barangay change requests?</summary>
                        <p className="text-sm text-gray-600 mt-3 pl-4 border-l-2 border-emerald-500">
                          Check the User Management → Change Requests section. Review the midwife's reason for requesting a barangay change, 
                          verify the justification, and approve or reject accordingly. Approved changes take effect immediately.
                        </p>
                      </details>
                      
                      <details className="bg-gray-50 rounded-xl p-4 cursor-pointer hover:bg-gray-100 transition-colors">
                        <summary className="font-semibold text-gray-900 cursor-pointer">What should I do if I detect suspicious activity?</summary>
                        <p className="text-sm text-gray-600 mt-3 pl-4 border-l-2 border-emerald-500">
                          Immediately check the Audit Logs for detailed activity history. You can filter by user and action type. 
                          If necessary, deactivate the user account and contact IT support. All login attempts and data modifications are tracked.
                        </p>
                      </details>
                      
                      <details className="bg-gray-50 rounded-xl p-4 cursor-pointer hover:bg-gray-100 transition-colors">
                        <summary className="font-semibold text-gray-900 cursor-pointer">How do I backup system data?</summary>
                        <p className="text-sm text-gray-600 mt-3 pl-4 border-l-2 border-emerald-500">
                          The system performs automatic daily backups. For manual backups, use the Reports page to export all data 
                          by program type. For complete database backups, contact your IT administrator or system hosting provider.
                        </p>
                      </details>
                      
                      <details className="bg-gray-50 rounded-xl p-4 cursor-pointer hover:bg-gray-100 transition-colors">
                        <summary className="font-semibold text-gray-900 cursor-pointer">How do I monitor system performance?</summary>
                        <p className="text-sm text-gray-600 mt-3 pl-4 border-l-2 border-emerald-500">
                          The Dashboard provides real-time statistics on user activity, record counts, and system usage. 
                          For detailed performance metrics, check the Audit Logs for activity patterns and peak usage times.
                        </p>
                      </details>
                      
                      <details className="bg-gray-50 rounded-xl p-4 cursor-pointer hover:bg-gray-100 transition-colors">
                        <summary className="font-semibold text-gray-900 cursor-pointer">Can I restore deleted records?</summary>
                        <p className="text-sm text-gray-600 mt-3 pl-4 border-l-2 border-emerald-500">
                          Deleted records are logged in the Audit Logs with timestamps and user information. Contact your database 
                          administrator for potential recovery from backups. Implement strict deletion policies to prevent accidental data loss.
                        </p>
                      </details>
                    </div>
                  </div>

                  {/* System Requirements */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Monitor className="w-5 h-5 text-emerald-600" />
                      System Requirements
                    </h3>
                    <div className="bg-gradient-to-br from-purple-50 to-white border border-purple-200 rounded-xl p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Recommended Browsers:</h4>
                          <ul className="space-y-1 text-gray-600">
                            <li>• Google Chrome (latest version)</li>
                            <li>• Mozilla Firefox (latest version)</li>
                            <li>• Microsoft Edge (latest version)</li>
                            <li>• Safari 14 or higher</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Minimum Requirements:</h4>
                          <ul className="space-y-1 text-gray-600">
                            <li>• Stable internet connection (5 Mbps+)</li>
                            <li>• Screen resolution: 1366x768 or higher</li>
                            <li>• JavaScript enabled</li>
                            <li>• Cookies enabled</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Admin Best Practices */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Lightbulb className="w-5 h-5 text-emerald-600" />
                      Administrator Best Practices
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                        <h4 className="font-semibold text-green-900 mb-2 text-sm flex items-center gap-2">
                          <CheckCircle className="w-4 h-4" />
                          User Management
                        </h4>
                        <p className="text-xs text-green-700">
                          Review midwife registrations promptly. Verify credentials before approval. Monitor user activity regularly.
                        </p>
                      </div>
                      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                        <h4 className="font-semibold text-blue-900 mb-2 text-sm flex items-center gap-2">
                          <Shield className="w-4 h-4" />
                          Security
                        </h4>
                        <p className="text-xs text-blue-700">
                          Use strong passwords. Enable two-factor authentication. Review audit logs weekly for suspicious activity.
                        </p>
                      </div>
                      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                        <h4 className="font-semibold text-yellow-900 mb-2 text-sm flex items-center gap-2">
                          <Save className="w-4 h-4" />
                          Data Management
                        </h4>
                        <p className="text-xs text-yellow-700">
                          Export reports monthly. Maintain data integrity. Implement regular backup verification procedures.
                        </p>
                      </div>
                      <div className="bg-pink-50 border border-pink-200 rounded-xl p-4">
                        <h4 className="font-semibold text-pink-900 mb-2 text-sm flex items-center gap-2">
                          <Bell className="w-4 h-4" />
                          Communication
                        </h4>
                        <p className="text-xs text-pink-700">
                          Respond to midwife requests promptly. Provide clear feedback on rejections. Maintain open communication channels.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Contact Support */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Phone className="w-5 h-5 text-emerald-600" />
                      Administrator Support
                    </h3>
                    <div className="bg-gradient-to-br from-emerald-50 to-white border border-emerald-200 rounded-xl p-6">
                      <h4 className="text-lg font-semibold text-emerald-900 mb-2">Need Technical Assistance?</h4>
                      <p className="text-sm text-emerald-700 mb-4">
                        As an administrator, you have priority support access. Contact our technical team for system issues or questions.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white rounded-lg p-4 border border-emerald-200">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                              <Mail className="w-5 h-5 text-emerald-600" />
                            </div>
                            <div>
                              <p className="text-xs text-gray-600">Admin Support Email</p>
                              <p className="text-sm font-semibold text-gray-900">admin@medimoms.com</p>
                            </div>
                          </div>
                          <p className="text-xs text-gray-500">Priority response: 12-24 hours</p>
                        </div>
                        <div className="bg-white rounded-lg p-4 border border-emerald-200">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                              <Phone className="w-5 h-5 text-emerald-600" />
                            </div>
                            <div>
                              <p className="text-xs text-gray-600">Admin Hotline</p>
                              <p className="text-sm font-semibold text-gray-900">(049) 123-4569</p>
                            </div>
                          </div>
                          <p className="text-xs text-gray-500">Mon-Fri: 8:00 AM - 5:00 PM</p>
                        </div>
                      </div>
                      <div className="mt-4 bg-emerald-100 rounded-lg p-3">
                        <p className="text-xs text-emerald-800">
                          <strong>Critical System Issues:</strong> For urgent technical problems affecting system availability, 
                          contact IT emergency support at <span className="font-semibold">(049) 123-4570</span> (24/7)
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Quick Links */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-emerald-600" />
                      Administrator Resources
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      <button 
                        onClick={() => navigate('/admin/manual')}
                        className="bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg p-3 text-center transition-colors cursor-pointer"
                      >
                        <FileText className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                        <span className="text-xs font-medium text-gray-700">Admin Manual</span>
                      </button>
                      <button 
                        onClick={() => navigate('/admin/security-guide')}
                        className="bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg p-3 text-center transition-colors cursor-pointer"
                      >
                        <Shield className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                        <span className="text-xs font-medium text-gray-700">Security Guide</span>
                      </button>
                      <button 
                        onClick={() => navigate('/admin/report-issue')}
                        className="bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg p-3 text-center transition-colors cursor-pointer"
                      >
                        <Bug className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                        <span className="text-xs font-medium text-gray-700">Report Issue</span>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* About Tab */}
            {activeTab === 'about' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                {/* System Info Header */}
                <div className="bg-gradient-to-br from-emerald-600 to-green-600 rounded-2xl p-8 shadow-lg text-white">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                      <Info className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold">MediMoms</h2>
                      <p className="text-emerald-100">Healthcare Management System</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                    <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                      <p className="text-sm text-emerald-100 mb-1">Version</p>
                      <p className="text-xl font-bold">2.0.0</p>
                    </div>
                    <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                      <p className="text-sm text-emerald-100 mb-1">Location</p>
                      <p className="text-xl font-bold">Santa Cruz, Laguna</p>
                    </div>
                    <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                      <p className="text-sm text-emerald-100 mb-1">Release Date</p>
                      <p className="text-xl font-bold">February 2026</p>
                    </div>
                  </div>
                </div>

                {/* What is MediMoms */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-200">
                    <Info className="w-6 h-6 text-emerald-600" />
                    <h3 className="text-xl font-bold text-gray-900">About MediMoms</h3>
                  </div>
                  <div className="space-y-4 text-gray-600 leading-relaxed">
                    <p>
                      <strong className="text-gray-900">MediMoms</strong> is a comprehensive web-based healthcare management system specifically designed 
                      for administrators and midwives in Santa Cruz, Laguna. The system provides centralized control over maternal and child 
                      health services across multiple barangays, enabling efficient management, monitoring, and reporting.
                    </p>
                    <p>
                      As an administrator, you have complete oversight of the entire system, including user management, barangay assignments, 
                      system-wide reporting, and audit trail monitoring. The platform ensures data integrity, security, and compliance with 
                      healthcare standards while providing real-time insights into community health metrics.
                    </p>
                    <p>
                      Built with modern web technologies and following industry best practices, MediMoms replaces traditional paper-based 
                      systems with a secure, scalable digital platform that improves healthcare delivery, reduces administrative burden, 
                      and enhances decision-making through data-driven insights.
                    </p>
                  </div>
                </div>

                {/* Mission & Vision */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                        <Target className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">Mission</h3>
                    </div>
                    <p className="text-gray-600 leading-relaxed">
                      To provide a robust, secure, and efficient digital platform that empowers healthcare administrators and midwives 
                      in Santa Cruz, Laguna to deliver quality maternal and child health services through streamlined management, 
                      comprehensive reporting, and data-driven decision-making.
                    </p>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
                        <EyeIcon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">Vision</h3>
                    </div>
                    <p className="text-gray-600 leading-relaxed">
                      To become the leading healthcare management system in the region, setting the standard for maternal and child 
                      health record keeping while fostering better health outcomes for communities through innovative technology 
                      solutions and evidence-based healthcare delivery.
                    </p>
                  </div>
                </div>

                {/* Administrator Features */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
                    <Shield className="w-6 h-6 text-emerald-600" />
                    <h3 className="text-xl font-bold text-gray-900">Administrator Features</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-blue-50 to-white border border-blue-200 rounded-xl p-4">
                      <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                        <Users className="w-5 h-5" /> User Management
                      </h4>
                      <p className="text-sm text-blue-700">
                        Approve/reject midwife registrations, manage user accounts, assign barangays, and monitor user activity across the system.
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-white border border-purple-200 rounded-xl p-4">
                      <h4 className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
                        <MapPin className="w-5 h-5" /> Barangay Management
                      </h4>
                      <p className="text-sm text-purple-700">
                        Add, edit, and manage barangay information, coverage areas, and assign midwives to specific service areas.
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-white border border-green-200 rounded-xl p-4">
                      <h4 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                        <FileText className="w-5 h-5" /> Comprehensive Reporting
                      </h4>
                      <p className="text-sm text-green-700">
                        Generate system-wide reports across all programs and barangays with advanced filtering and export to Excel/PDF.
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-orange-50 to-white border border-orange-200 rounded-xl p-4">
                      <h4 className="font-semibold text-orange-900 mb-2 flex items-center gap-2">
                        <Eye className="w-5 h-5" /> Audit Trail Monitoring
                      </h4>
                      <p className="text-sm text-orange-700">
                        Track all system activities, user actions, data modifications, and security events for compliance and accountability.
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-pink-50 to-white border border-pink-200 rounded-xl p-4">
                      <h4 className="font-semibold text-pink-900 mb-2 flex items-center gap-2">
                        <Monitor className="w-5 h-5" /> System Dashboard
                      </h4>
                      <p className="text-sm text-pink-700">
                        Real-time statistics, key metrics, and visual analytics for monitoring system health and user engagement.
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-indigo-50 to-white border border-indigo-200 rounded-xl p-4">
                      <h4 className="font-semibold text-indigo-900 mb-2 flex items-center gap-2">
                        <Shield className="w-5 h-5" /> Security & Access Control
                      </h4>
                      <p className="text-sm text-indigo-700">
                        Role-based permissions, secure authentication, and comprehensive security measures to protect sensitive health data.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Technology Stack */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
                    <Code className="w-6 h-6 text-emerald-600" />
                    <h3 className="text-xl font-bold text-gray-900">Technology Stack</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <Monitor className="w-5 h-5 text-emerald-600" /> Frontend Technologies
                      </h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <span className="font-bold text-blue-600">R</span>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">React 18</p>
                            <p className="text-xs text-gray-600">Modern UI library with hooks</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <span className="font-bold text-blue-600">TS</span>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">TypeScript</p>
                            <p className="text-xs text-gray-600">Type-safe JavaScript</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
                          <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
                            <span className="font-bold text-cyan-600">TW</span>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">Tailwind CSS</p>
                            <p className="text-xs text-gray-600">Utility-first CSS framework</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
                          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            <span className="font-bold text-purple-600">V</span>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">Vite</p>
                            <p className="text-xs text-gray-600">Fast build tool & dev server</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <Settings className="w-5 h-5 text-emerald-600" /> Backend Technologies
                      </h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
                          <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                            <span className="font-bold text-red-600">L</span>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">Laravel 11</p>
                            <p className="text-xs text-gray-600">PHP framework for web artisans</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <span className="font-bold text-blue-600">M</span>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">MySQL</p>
                            <p className="text-xs text-gray-600">Relational database system</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
                          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <span className="font-bold text-green-600">S</span>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">Sanctum</p>
                            <p className="text-xs text-gray-600">API authentication</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
                          <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                            <span className="font-bold text-orange-600">A</span>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">RESTful API</p>
                            <p className="text-xs text-gray-600">Standard API architecture</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Development Team */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
                    <Users className="w-6 h-6 text-emerald-600" />
                    <h3 className="text-xl font-bold text-gray-900">Development Team</h3>
                  </div>
                  <p className="text-center text-gray-600 mb-6">
                    Developed with dedication and expertise by BSIT students from <strong className="text-gray-900">Laguna State Polytechnic University</strong>
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-br from-emerald-50 to-white border border-emerald-200 rounded-xl p-5 text-center hover:shadow-lg transition-all">
                      <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center shadow-md">
                        <span className="text-white font-bold text-xl">KB</span>
                      </div>
                      <h4 className="font-bold text-gray-900 mb-1">Karl Benedict Boongaling</h4>
                      <p className="text-sm text-emerald-600 font-semibold mb-2">Lead Developer</p>
                      <p className="text-xs text-gray-500">System Architecture & Integration</p>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-white border border-blue-200 rounded-xl p-5 text-center hover:shadow-lg transition-all">
                      <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center shadow-md">
                        <span className="text-white font-bold text-xl">EJ</span>
                      </div>
                      <h4 className="font-bold text-gray-900 mb-1">Ernest James De Leon</h4>
                      <p className="text-sm text-blue-600 font-semibold mb-2">Backend Developer</p>
                      <p className="text-xs text-gray-500">API Development & Database</p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-white border border-purple-200 rounded-xl p-5 text-center hover:shadow-lg transition-all">
                      <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-md">
                        <span className="text-white font-bold text-xl">JM</span>
                      </div>
                      <h4 className="font-bold text-gray-900 mb-1">Jay Mark Del Valle</h4>
                      <p className="text-sm text-purple-600 font-semibold mb-2">Frontend Developer</p>
                      <p className="text-xs text-gray-500">UI/UX Design & Implementation</p>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-white border border-green-200 rounded-xl p-5 text-center hover:shadow-lg transition-all">
                      <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-lime-500 to-lime-600 rounded-full flex items-center justify-center shadow-md">
                        <span className="text-white font-bold text-xl">MJ</span>
                      </div>
                      <h4 className="font-bold text-gray-900 mb-1">Mark Jopher Domanico</h4>
                      <p className="text-sm text-green-600 font-semibold mb-2">System Analyst</p>
                      <p className="text-xs text-gray-500">Requirements & Documentation</p>
                    </div>
                  </div>
                </div>

                {/* Academic Background */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
                    <GraduationCap className="w-6 h-6 text-emerald-600" />
                    <h3 className="text-xl font-bold text-gray-900">Academic Background</h3>
                  </div>
                  <div className="space-y-4 text-gray-600 leading-relaxed">
                    <p>
                      MediMoms is the culmination of academic excellence and practical innovation, developed as a comprehensive 
                      capstone project by Bachelor of Science in Information Technology (BSIT) students from 
                      <strong className="text-gray-900"> Laguna State Polytechnic University (LSPU)</strong>.
                    </p>
                    <p>
                      This project represents the intersection of academic learning and real-world problem-solving, addressing 
                      genuine needs in healthcare management within the local community of Santa Cruz, Laguna. Through extensive 
                      research, stakeholder consultations, and iterative development, the team has created a system that serves 
                      both educational objectives and practical healthcare delivery needs.
                    </p>
                    <p>
                      The development process incorporated software engineering best practices, including requirements analysis, 
                      system design, database normalization, security implementation, user interface development, comprehensive 
                      testing, and deployment. This project demonstrates the students' mastery of full-stack web development, 
                      database management, and software project management.
                    </p>
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mt-4">
                      <h4 className="font-semibold text-emerald-900 mb-2 flex items-center gap-2">
                        <Calendar className="w-5 h-5" />
                        Project Timeline
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                        <div>
                          <p className="text-emerald-700 font-medium">Research & Planning</p>
                          <p className="text-emerald-600">September 2025 - October 2025</p>
                        </div>
                        <div>
                          <p className="text-emerald-700 font-medium">Development Phase</p>
                          <p className="text-emerald-600">November 2025 - December 2025</p>
                        </div>
                        <div>
                          <p className="text-emerald-700 font-medium">Testing & Deployment</p>
                          <p className="text-emerald-600">February 2026</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Acknowledgments */}
                <div className="bg-gradient-to-br from-yellow-50 to-white border border-yellow-200 rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <Award className="w-6 h-6 text-yellow-600" />
                    <h3 className="text-xl font-bold text-gray-900">Acknowledgments</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    We extend our heartfelt gratitude to the following individuals and organizations who made this project possible:
                  </p>
                  <div className="space-y-3 text-sm text-gray-700">
                    <p>• <strong>Laguna State Polytechnic University</strong> - For providing the educational foundation and resources</p>
                    <p>• <strong>Municipal Health Office of Santa Cruz, Laguna</strong> - For their valuable insights and feedback</p>
                    <p>• <strong>Local Midwives and Healthcare Workers</strong> - For their cooperation during system testing and validation</p>
                    <p>• <strong>Project Advisers and Panelists</strong> - For their guidance and constructive feedback throughout development</p>
                    <p>• <strong>Family and Friends</strong> - For their unwavering support and encouragement</p>
                  </div>
                </div>

                {/* Footer */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm text-center">
                  <div className="mb-4">
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">MediMoms</h3>
                    <p className="text-gray-600">Empowering Healthcare Through Technology</p>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-2">
                    <span>© 2026 MediMoms. All rights reserved.</span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Laguna State Polytechnic University • Santa Cruz, Laguna, Philippines
                  </p>
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-xs text-gray-400">
                      BSIT Capstone Project • Version 2.0.0
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </AdminLayout>
  );
}
