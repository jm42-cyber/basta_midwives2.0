import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Settings, User, Mail, Lock, Shield, Bell, 
  Save, Eye, EyeOff, CheckCircle, MapPin, Send, HelpCircle, Info,
  Rocket, MessageCircle, Monitor, Lightbulb, Phone, FileText, Bug, Heart,
  Target, Eye as EyeIcon, Users, GraduationCap, Code, Award, Calendar
} from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'react-toastify';
import api from '@/services/api';

interface Barangay {
  id: number;
  name: string;
  address?: string;
  contact_number?: string;
  population?: number;
}

export default function SettingsPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'barangays' | 'notifications' | 'help' | 'about'>('profile');
  
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
  
  // Barangay state
  const [allBarangays, setAllBarangays] = useState<Barangay[]>([]);
  const [userBarangays, setUserBarangays] = useState<Barangay[]>([]);
  const [selectedBarangays, setSelectedBarangays] = useState<number[]>([]);
  const [changeReason, setChangeReason] = useState('');
  const [requestingChange, setRequestingChange] = useState(false);
  const [loadingBarangays, setLoadingBarangays] = useState(true);

  // Fetch barangays on mount
  useEffect(() => {
    fetchBarangays();
    fetchUserBarangays();
  }, []);

  const fetchBarangays = async () => {
    try {
      const response = await api.get('/barangays');
      setAllBarangays(response.data.data);
    } catch (error) {
      console.error('Error fetching barangays:', error);
      toast.error('Failed to load barangays');
    } finally {
      setLoadingBarangays(false);
    }
  };

  const fetchUserBarangays = async () => {
    try {
      const response = await api.get('/me');
      setUserBarangays(response.data.barangays || []);
    } catch (error) {
      console.error('Error fetching user barangays:', error);
    }
  };

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

  const handleBarangayChange = async () => {
    if (selectedBarangays.length === 0) {
      toast.error('Please select at least one barangay');
      return;
    }
    if (selectedBarangays.length > 3) {
      toast.error('You can only select up to 3 barangays');
      return;
    }
    if (changeReason.length < 20) {
      toast.error('Please provide a detailed reason (at least 20 characters)');
      return;
    }
    
    setRequestingChange(true);
    // TODO: Implement API call
    setTimeout(() => {
      toast.success('Barangay change request submitted! Waiting for admin approval.');
      setChangeReason('');
      setRequestingChange(false);
    }, 1000);
  };

  const tabs = [
    { id: 'profile' as const, label: 'Profile', icon: User },
    { id: 'security' as const, label: 'Security', icon: Shield },
    { id: 'barangays' as const, label: 'Barangays', icon: MapPin },
    { id: 'notifications' as const, label: 'Notifications', icon: Bell },
    { id: 'help' as const, label: 'Help', icon: HelpCircle },
    { id: 'about' as const, label: 'About', icon: Info },
  ];

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-16 h-16 shadow-lg bg-gradient-to-br from-primary-600 to-primary-500 rounded-2xl">
              <Settings className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-transparent bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text">
                Settings
              </h1>
              <p className="flex items-center gap-2 mt-1 text-gray-600">
                <Settings className="w-4 h-4" />
                Manage your account settings and preferences
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
                          ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-lg'
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
                className="mt-4 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-4 shadow-sm"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-primary-500 rounded-xl flex items-center justify-center shadow-md">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">MediMoms</h3>
                    <p className="text-xs text-gray-600">Version 2.0.0</p>
                  </div>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed mb-3">
                  Empowering midwives with modern healthcare management solutions
                </p>
                <div className="border-t border-green-200 pt-3 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <MapPin className="w-3.5 h-3.5 text-primary-600" />
                    <span>Santa Cruz, Laguna</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Calendar className="w-3.5 h-3.5 text-primary-600" />
                    <span>Released February 2026</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <GraduationCap className="w-3.5 h-3.5 text-primary-600" />
                    <span>LSPU BSIT Project</span>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-green-200">
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
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-transparent"
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
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-transparent"
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
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-transparent"
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
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-transparent"
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
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                    />
                  </div>

                  {/* Save Button */}
                  <div className="flex justify-end pt-4 border-t border-gray-200">
                    <button
                      onClick={handleSaveProfile}
                      disabled={savingProfile}
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-xl hover:from-primary-700 hover:to-primary-600 font-semibold transition-all disabled:opacity-50"
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
                        className="w-full px-4 py-2.5 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-transparent"
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
                        className="w-full px-4 py-2.5 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-transparent"
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
                        className="w-full px-4 py-2.5 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-transparent"
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
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-xl hover:from-primary-700 hover:to-primary-600 font-semibold transition-all disabled:opacity-50"
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

            {/* Barangays Tab */}
            {activeTab === 'barangays' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm"
              >
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
                  <MapPin className="w-6 h-6 text-primary-600" />
                  <h2 className="text-xl font-bold text-gray-900">Barangay Assignment</h2>
                </div>

                <div className="space-y-6">
                  {/* Current Barangays */}
                  <div className="bg-primary-50 border border-primary-200 rounded-xl p-4">
                    <h3 className="text-sm font-semibold text-primary-900 mb-3">Current Assigned Barangays:</h3>
                    {loadingBarangays ? (
                      <div className="flex items-center justify-center py-4">
                        <div className="w-6 h-6 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
                      </div>
                    ) : userBarangays.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {userBarangays.map((barangay) => (
                          <span key={barangay.id} className="px-3 py-1.5 bg-primary-600 text-white rounded-lg text-sm font-medium">
                            {barangay.name}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-primary-700">No barangays assigned yet</p>
                    )}
                  </div>

                  {/* Request Change Section */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Request Barangay Change</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Select up to 3 barangays you would like to be assigned to. Your request will be reviewed by an administrator.
                    </p>

                    {/* Barangay Selection Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                      {loadingBarangays ? (
                        <div className="col-span-full flex items-center justify-center py-8">
                          <div className="w-6 h-6 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
                        </div>
                      ) : (
                        allBarangays.map((barangay) => (
                          <label
                            key={barangay.id}
                            className="flex items-center gap-2 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-primary-50 hover:border-primary-500 transition-all"
                          >
                            <input
                              type="checkbox"
                              checked={selectedBarangays.includes(barangay.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  if (selectedBarangays.length < 3) {
                                    setSelectedBarangays([...selectedBarangays, barangay.id]);
                                  } else {
                                    toast.warning('You can only select up to 3 barangays');
                                  }
                                } else {
                                  setSelectedBarangays(selectedBarangays.filter(id => id !== barangay.id));
                                }
                              }}
                              className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                            />
                            <span className="text-sm font-medium text-gray-700">{barangay.name}</span>
                          </label>
                        ))
                      )}
                    </div>

                    {/* Selected Count */}
                    <p className="text-xs text-gray-500 mb-4">
                      Selected: {selectedBarangays.length} / 3 barangays
                    </p>

                    {/* Reason Textarea */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Reason for Change <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        value={changeReason}
                        onChange={(e) => setChangeReason(e.target.value)}
                        rows={4}
                        placeholder="Please provide a detailed reason for requesting this barangay change (minimum 20 characters)..."
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {changeReason.length} / 20 characters minimum
                      </p>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end pt-4 border-t border-gray-200">
                    <button
                      onClick={handleBarangayChange}
                      disabled={requestingChange || selectedBarangays.length === 0 || changeReason.length < 20}
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-xl hover:from-primary-700 hover:to-primary-600 font-semibold transition-all disabled:opacity-50"
                    >
                      {requestingChange ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          Submit Request
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm"
              >
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
                  <Bell className="w-6 h-6 text-gray-700" />
                  <h2 className="text-xl font-bold text-gray-900">Notification Preferences</h2>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <h3 className="font-semibold text-gray-900">Email Notifications</h3>
                      <p className="text-sm text-gray-600">Receive email updates about your account</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <h3 className="font-semibold text-gray-900">Record Updates</h3>
                      <p className="text-sm text-gray-600">Get notified when records are updated</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <h3 className="font-semibold text-gray-900">Appointment Reminders</h3>
                      <p className="text-sm text-gray-600">Receive reminders for upcoming appointments</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
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
                  <HelpCircle className="w-6 h-6 text-primary-600" />
                  <h2 className="text-xl font-bold text-gray-900">Help & Support</h2>
                </div>

                <div className="space-y-6">
                  {/* Getting Started */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Rocket className="w-5 h-5 text-primary-600" />
                      Getting Started
                    </h3>
                    <div className="bg-gradient-to-br from-primary-50 to-white border border-primary-200 rounded-xl p-5">
                      <p className="text-sm text-gray-700 mb-4">
                        Welcome to MediMoms! Here's a quick guide to help you navigate the system:
                      </p>
                      <ol className="space-y-2 text-sm text-gray-600">
                        <li className="flex items-start gap-2">
                          <span className="flex-shrink-0 w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
                          <span><strong className="text-gray-900">Dashboard:</strong> View your statistics, recent activities, and quick actions</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="flex-shrink-0 w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
                          <span><strong className="text-gray-900">Patients:</strong> Manage patient records, add new patients, and view patient history</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="flex-shrink-0 w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-xs font-bold">3</span>
                          <span><strong className="text-gray-900">Immunization:</strong> Track and manage immunization records for children</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="flex-shrink-0 w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-xs font-bold">4</span>
                          <span><strong className="text-gray-900">Family Planning:</strong> Record and monitor family planning services</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="flex-shrink-0 w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-xs font-bold">5</span>
                          <span><strong className="text-gray-900">Maternal Care:</strong> Manage prenatal, delivery, and postnatal care records</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="flex-shrink-0 w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-xs font-bold">6</span>
                          <span><strong className="text-gray-900">Reports:</strong> Generate comprehensive reports for your barangay</span>
                        </li>
                      </ol>
                    </div>
                  </div>

                  {/* FAQ Section */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <MessageCircle className="w-5 h-5 text-primary-600" />
                      Frequently Asked Questions
                    </h3>
                    <div className="space-y-3">
                      <details className="bg-gray-50 rounded-xl p-4 cursor-pointer hover:bg-gray-100 transition-colors">
                        <summary className="font-semibold text-gray-900 cursor-pointer">How do I update my profile information?</summary>
                        <p className="text-sm text-gray-600 mt-3 pl-4 border-l-2 border-primary-500">
                          Navigate to Settings → Profile tab. Update your name, email, or contact number, then click "Save Changes". 
                          Note: Email changes require verification.
                        </p>
                      </details>
                      
                      <details className="bg-gray-50 rounded-xl p-4 cursor-pointer hover:bg-gray-100 transition-colors">
                        <summary className="font-semibold text-gray-900 cursor-pointer">How do I change my password?</summary>
                        <p className="text-sm text-gray-600 mt-3 pl-4 border-l-2 border-primary-500">
                          Go to Settings → Security tab. Enter your current password, then your new password twice. 
                          Passwords must be at least 8 characters and include uppercase, lowercase, and numbers.
                        </p>
                      </details>
                      
                      <details className="bg-gray-50 rounded-xl p-4 cursor-pointer hover:bg-gray-100 transition-colors">
                        <summary className="font-semibold text-gray-900 cursor-pointer">How do I request a barangay change?</summary>
                        <p className="text-sm text-gray-600 mt-3 pl-4 border-l-2 border-primary-500">
                          Visit Settings → Barangays tab. Select up to 3 barangays you'd like to be assigned to, 
                          provide a detailed reason (minimum 20 characters), and submit your request. An administrator will review it.
                        </p>
                      </details>
                      
                      <details className="bg-gray-50 rounded-xl p-4 cursor-pointer hover:bg-gray-100 transition-colors">
                        <summary className="font-semibold text-gray-900 cursor-pointer">How do I add a new patient record?</summary>
                        <p className="text-sm text-gray-600 mt-3 pl-4 border-l-2 border-primary-500">
                          Navigate to the Patients page and click the "Add Patient" button. Fill in all required fields including 
                          name, date of birth, address, and contact information. Make sure to select the correct barangay.
                        </p>
                      </details>
                      
                      <details className="bg-gray-50 rounded-xl p-4 cursor-pointer hover:bg-gray-100 transition-colors">
                        <summary className="font-semibold text-gray-900 cursor-pointer">How do I search for a patient?</summary>
                        <p className="text-sm text-gray-600 mt-3 pl-4 border-l-2 border-primary-500">
                          Use the search bar at the top of the Patients page. You can search by name, patient ID, or contact number. 
                          You can also filter by barangay, age range, or registration date.
                        </p>
                      </details>
                      
                      <details className="bg-gray-50 rounded-xl p-4 cursor-pointer hover:bg-gray-100 transition-colors">
                        <summary className="font-semibold text-gray-900 cursor-pointer">How do I generate reports?</summary>
                        <p className="text-sm text-gray-600 mt-3 pl-4 border-l-2 border-primary-500">
                          Go to the Reports page, select the report type (Immunization, Family Planning, Maternal Care, etc.), 
                          choose your date range and barangay, then click "Generate Report". You can export to PDF or Excel.
                        </p>
                      </details>
                      
                      <details className="bg-gray-50 rounded-xl p-4 cursor-pointer hover:bg-gray-100 transition-colors">
                        <summary className="font-semibold text-gray-900 cursor-pointer">What if I accidentally delete a record?</summary>
                        <p className="text-sm text-gray-600 mt-3 pl-4 border-l-2 border-primary-500">
                          Contact your system administrator immediately. All deletions are logged in the audit trail. 
                          Administrators may be able to restore deleted records depending on the system backup policy.
                        </p>
                      </details>
                      
                      <details className="bg-gray-50 rounded-xl p-4 cursor-pointer hover:bg-gray-100 transition-colors">
                        <summary className="font-semibold text-gray-900 cursor-pointer">How do I update notification preferences?</summary>
                        <p className="text-sm text-gray-600 mt-3 pl-4 border-l-2 border-primary-500">
                          Navigate to Settings → Notifications tab. Toggle the switches for email notifications, 
                          record updates, and appointment reminders according to your preferences.
                        </p>
                      </details>
                      
                      <details className="bg-gray-50 rounded-xl p-4 cursor-pointer hover:bg-gray-100 transition-colors">
                        <summary className="font-semibold text-gray-900 cursor-pointer">Can I access the system on mobile devices?</summary>
                        <p className="text-sm text-gray-600 mt-3 pl-4 border-l-2 border-primary-500">
                          Yes! MediMoms is fully responsive and works on tablets and smartphones. 
                          Simply access the system through your mobile browser using the same login credentials.
                        </p>
                      </details>
                      
                      <details className="bg-gray-50 rounded-xl p-4 cursor-pointer hover:bg-gray-100 transition-colors">
                        <summary className="font-semibold text-gray-900 cursor-pointer">What should I do if I forget my password?</summary>
                        <p className="text-sm text-gray-600 mt-3 pl-4 border-l-2 border-primary-500">
                          Click "Forgot Password" on the login page. Enter your email address, and you'll receive a password reset link. 
                          Follow the instructions in the email to create a new password.
                        </p>
                      </details>
                    </div>
                  </div>

                  {/* System Requirements */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Monitor className="w-5 h-5 text-primary-600" />
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
                            <li>• Stable internet connection</li>
                            <li>• Screen resolution: 1024x768 or higher</li>
                            <li>• JavaScript enabled</li>
                            <li>• Cookies enabled</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tips & Best Practices */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Lightbulb className="w-5 h-5 text-primary-600" />
                      Tips & Best Practices
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                        <h4 className="font-semibold text-green-900 mb-2 text-sm flex items-center gap-2">
                          <CheckCircle className="w-4 h-4" />
                          Data Entry
                        </h4>
                        <p className="text-xs text-green-700">
                          Always double-check patient information before saving. Use consistent formatting for names and dates.
                        </p>
                      </div>
                      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                        <h4 className="font-semibold text-blue-900 mb-2 text-sm flex items-center gap-2">
                          <Shield className="w-4 h-4" />
                          Security
                        </h4>
                        <p className="text-xs text-blue-700">
                          Never share your login credentials. Always log out when using shared computers.
                        </p>
                      </div>
                      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                        <h4 className="font-semibold text-yellow-900 mb-2 text-sm flex items-center gap-2">
                          <Save className="w-4 h-4" />
                          Regular Backups
                        </h4>
                        <p className="text-xs text-yellow-700">
                          Export important reports regularly. The system performs automatic backups, but local copies are recommended.
                        </p>
                      </div>
                      <div className="bg-pink-50 border border-pink-200 rounded-xl p-4">
                        <h4 className="font-semibold text-pink-900 mb-2 text-sm flex items-center gap-2">
                          <Bell className="w-4 h-4" />
                          Updates
                        </h4>
                        <p className="text-xs text-pink-700">
                          Keep your browser updated for the best experience. Check for system announcements regularly.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Contact Support */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Phone className="w-5 h-5 text-primary-600" />
                      Contact Support
                    </h3>
                    <div className="bg-gradient-to-br from-primary-50 to-white border border-primary-200 rounded-xl p-6">
                      <h4 className="text-lg font-semibold text-primary-900 mb-2">Need More Help?</h4>
                      <p className="text-sm text-primary-700 mb-4">
                        Our support team is here to assist you. Contact your system administrator or IT support for additional assistance.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white rounded-lg p-4 border border-primary-200">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                              <Mail className="w-5 h-5 text-primary-600" />
                            </div>
                            <div>
                              <p className="text-xs text-gray-600">Email Support</p>
                              <p className="text-sm font-semibold text-gray-900">support@medimoms.com</p>
                            </div>
                          </div>
                          <p className="text-xs text-gray-500">Response time: 24-48 hours</p>
                        </div>
                        <div className="bg-white rounded-lg p-4 border border-primary-200">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                              <Phone className="w-5 h-5 text-primary-600" />
                            </div>
                            <div>
                              <p className="text-xs text-gray-600">Phone Support</p>
                              <p className="text-sm font-semibold text-gray-900">(049) 123-4567</p>
                            </div>
                          </div>
                          <p className="text-xs text-gray-500">Mon-Fri: 8:00 AM - 5:00 PM</p>
                        </div>
                      </div>
                      <div className="mt-4 bg-primary-100 rounded-lg p-3">
                        <p className="text-xs text-primary-800">
                          <strong>Emergency Support:</strong> For critical system issues, contact the IT department directly at 
                          <span className="font-semibold"> (049) 123-4568</span> (available 24/7)
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Quick Links */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-primary-600" />
                      Quick Links
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      <button 
                        onClick={() => navigate('/dashboard/user-manual')}
                        className="bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg p-3 text-center transition-colors"
                      >
                        <FileText className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                        <span className="text-xs font-medium text-gray-700">User Manual</span>
                      </button>
                      <button 
                        onClick={() => navigate('/dashboard/release-notes')}
                        className="bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg p-3 text-center transition-colors"
                      >
                        <Bell className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                        <span className="text-xs font-medium text-gray-700">Release Notes</span>
                      </button>
                      <button 
                        onClick={() => navigate('/dashboard/report-bug')}
                        className="bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg p-3 text-center transition-colors"
                      >
                        <Bug className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                        <span className="text-xs font-medium text-gray-700">Report Bug</span>
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
                <div className="bg-gradient-to-br from-primary-600 to-primary-500 rounded-2xl p-8 shadow-lg text-white">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                      <Info className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold">MediMoms</h2>
                      <p className="text-primary-100">Midwife Recording System</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                    <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                      <p className="text-sm text-primary-100 mb-1">Version</p>
                      <p className="text-xl font-bold">2.0.0</p>
                    </div>
                    <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                      <p className="text-sm text-primary-100 mb-1">Location</p>
                      <p className="text-xl font-bold">Santa Cruz, Laguna</p>
                    </div>
                    <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                      <p className="text-sm text-primary-100 mb-1">Release Date</p>
                      <p className="text-xl font-bold">February 2026</p>
                    </div>
                  </div>
                </div>

                {/* What is MediMoms */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-200">
                    <Info className="w-6 h-6 text-primary-600" />
                    <h3 className="text-xl font-bold text-gray-900">What is MediMoms?</h3>
                  </div>
                  <div className="space-y-4 text-gray-600 leading-relaxed">
                    <p>
                      <strong className="text-gray-900">MediMoms</strong> is a comprehensive web-based healthcare management system specifically designed 
                      for midwives and healthcare workers in Santa Cruz, Laguna. The system streamlines the recording, tracking, and 
                      management of maternal and child health services across multiple barangays.
                    </p>
                    <p>
                      Built with modern web technologies, MediMoms replaces traditional paper-based record-keeping with a secure, 
                      efficient digital platform that enables real-time data access, automated reporting, and improved healthcare delivery.
                    </p>
                    <p>
                      The system serves as a centralized hub for managing patient records, immunization schedules, family planning services, 
                      maternal care documentation, and senior citizen health monitoring, all while maintaining the highest standards of 
                      data privacy and security.
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
                      To provide an efficient, user-friendly digital platform that empowers midwives in Santa Cruz, Laguna 
                      to deliver quality healthcare services through streamlined record management, data-driven insights, and 
                      improved patient care coordination.
                    </p>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
                        <EyeIcon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">Vision</h3>
                    </div>
                    <p className="text-gray-600 leading-relaxed">
                      To become the leading healthcare management system in the region, setting the standard for 
                      maternal and child health record keeping while fostering better health outcomes for communities 
                      through technology-driven healthcare solutions.
                    </p>
                  </div>
                </div>

                {/* Core Features */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
                    <CheckCircle className="w-6 h-6 text-primary-600" />
                    <h3 className="text-xl font-bold text-gray-900">Core Features</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-blue-50 to-white border border-blue-200 rounded-xl p-4">
                      <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                        <Shield className="w-5 h-5" /> Immunization Management
                      </h4>
                      <p className="text-sm text-blue-700">
                        Track vaccination schedules, record immunization history, and generate reports for children's health monitoring.
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-pink-50 to-white border border-pink-200 rounded-xl p-4">
                      <h4 className="font-semibold text-pink-900 mb-2 flex items-center gap-2">
                        <Users className="w-5 h-5" /> Family Planning Services
                      </h4>
                      <p className="text-sm text-pink-700">
                        Manage family planning consultations, track contraceptive methods, and monitor patient follow-ups.
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-white border border-purple-200 rounded-xl p-4">
                      <h4 className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
                        <Heart className="w-5 h-5" /> Maternal Care Records
                      </h4>
                      <p className="text-sm text-purple-700">
                        Document prenatal visits, delivery records, and postnatal care for comprehensive maternal health tracking.
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-white border border-green-200 rounded-xl p-4">
                      <h4 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                        <User className="w-5 h-5" /> Senior Citizen Monitoring
                      </h4>
                      <p className="text-sm text-green-700">
                        Track health status, medications, and regular check-ups for elderly patients in the community.
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-orange-50 to-white border border-orange-200 rounded-xl p-4">
                      <h4 className="font-semibold text-orange-900 mb-2 flex items-center gap-2">
                        <FileText className="w-5 h-5" /> Reports & Analytics
                      </h4>
                      <p className="text-sm text-orange-700">
                        Generate comprehensive reports, export data to Excel/PDF, and analyze health trends across barangays.
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-indigo-50 to-white border border-indigo-200 rounded-xl p-4">
                      <h4 className="font-semibold text-indigo-900 mb-2 flex items-center gap-2">
                        <Lock className="w-5 h-5" /> Role-Based Access Control
                      </h4>
                      <p className="text-sm text-indigo-700">
                        Secure system with admin and midwife roles, ensuring proper access control and data protection.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Technology Stack */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
                    <Code className="w-6 h-6 text-primary-600" />
                    <h3 className="text-xl font-bold text-gray-900">Technology Stack</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <Monitor className="w-5 h-5 text-primary-600" /> Frontend Technologies
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
                        <Settings className="w-5 h-5 text-primary-600" /> Backend Technologies
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
                    <Users className="w-6 h-6 text-primary-600" />
                    <h3 className="text-xl font-bold text-gray-900">Development Team</h3>
                  </div>
                  <p className="text-center text-gray-600 mb-6">
                    Developed with dedication and expertise by BSIT students from <strong className="text-gray-900">Laguna State Polytechnic University</strong>
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-br from-primary-50 to-white border border-primary-200 rounded-xl p-5 text-center hover:shadow-lg transition-all">
                      <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center shadow-md"><span className="text-white font-bold text-xl">KB</span></div>
                      <h4 className="font-bold text-gray-900 mb-1">Karl Benedict Boongaling</h4>
                      <p className="text-sm text-primary-600 font-semibold mb-2">Lead Developer</p>
                      <p className="text-xs text-gray-500">System Architecture & Integration</p>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-white border border-blue-200 rounded-xl p-5 text-center hover:shadow-lg transition-all">
                      <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center shadow-md"><span className="text-white font-bold text-xl">EJ</span></div>
                      <h4 className="font-bold text-gray-900 mb-1">Ernest James De Leon</h4>
                      <p className="text-sm text-blue-600 font-semibold mb-2">Backend Developer</p>
                      <p className="text-xs text-gray-500">API Development & Database</p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-white border border-purple-200 rounded-xl p-5 text-center hover:shadow-lg transition-all">
                      <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-md"><span className="text-white font-bold text-xl">JM</span></div>
                      <h4 className="font-bold text-gray-900 mb-1">Jay Mark Del Valle</h4>
                      <p className="text-sm text-purple-600 font-semibold mb-2">Frontend Developer</p>
                      <p className="text-xs text-gray-500">UI/UX Design & Implementation</p>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-white border border-green-200 rounded-xl p-5 text-center hover:shadow-lg transition-all">
                      <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-lime-500 to-lime-600 rounded-full flex items-center justify-center shadow-md"><span className="text-white font-bold text-xl">MJ</span></div>
                      <h4 className="font-bold text-gray-900 mb-1">Mark Jopher Domanico</h4>
                      <p className="text-sm text-green-600 font-semibold mb-2">System Analyst</p>
                      <p className="text-xs text-gray-500">Requirements & Documentation</p>
                    </div>
                  </div>
                </div>

                {/* Academic Background */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
                    <GraduationCap className="w-6 h-6 text-primary-600" />
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
                      research, user requirement analysis, and iterative development, the team has created a system that serves 
                      both educational objectives and practical healthcare delivery needs.
                    </p>
                    <p>
                      The development process incorporated software engineering best practices, including requirements analysis, 
                      system design, database design, user interface development, testing, and deployment. This project demonstrates 
                      the students' mastery of full-stack web development, database management, and software project management.
                    </p>
                    <div className="bg-primary-50 border border-primary-200 rounded-xl p-4 mt-4">
                      <h4 className="font-semibold text-primary-900 mb-2 flex items-center gap-2">
                        <Calendar className="w-5 h-5" />
                        Project Timeline
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                        <div>
                          <p className="text-primary-700 font-medium">Research & Planning</p>
                          <p className="text-primary-600">September 2025 - October 2025</p>
                        </div>
                        <div>
                          <p className="text-primary-700 font-medium">Development Phase</p>
                          <p className="text-primary-600">November 2025 - December 2025</p>
                        </div>
                        <div>
                          <p className="text-primary-700 font-medium">Testing & Deployment</p>
                          <p className="text-primary-600">February 2026</p>
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
    </DashboardLayout>
  );
}


