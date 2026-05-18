import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bug, ArrowLeft, Send, AlertCircle } from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';
import CustomSelect from '@/components/CustomSelect';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuthStore } from '@/store/authStore';

export default function ReportIssuePage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  
  const [issueTitle, setIssueTitle] = useState('');
  const [issueCategory, setIssueCategory] = useState('');
  const [issueSeverity, setIssueSeverity] = useState('');
  const [issueDescription, setIssueDescription] = useState('');
  const [stepsToReproduce, setStepsToReproduce] = useState('');
  const [expectedBehavior, setExpectedBehavior] = useState('');
  const [actualBehavior, setActualBehavior] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!issueTitle || !issueCategory || !issueSeverity || !issueDescription) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    
    // TODO: Implement API call to submit issue report
    setTimeout(() => {
      toast.success('Issue report submitted successfully! Our team will review it shortly.');
      // Reset form
      setIssueTitle('');
      setIssueCategory('');
      setIssueSeverity('');
      setIssueDescription('');
      setStepsToReproduce('');
      setExpectedBehavior('');
      setActualBehavior('');
      setSubmitting(false);
    }, 1500);
  };

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
              <Bug className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-transparent bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text">
                Report an Issue
              </h1>
              <p className="flex items-center gap-2 mt-1 text-gray-600">
                <AlertCircle className="w-4 h-4" />
                Help us improve MediMoms by reporting issues
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          {/* Info Card */}
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Before You Report</h3>
            <ul className="space-y-2 text-sm text-blue-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span>Make sure you're using the latest version of MediMoms (v2.0.0)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span>Check if the issue has already been reported</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span>Provide as much detail as possible to help us reproduce the issue</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span>For critical system issues, contact IT support at (049) 123-4570</span>
              </li>
            </ul>
          </div>

          {/* Issue Report Form */}
          <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-200">
              Issue Report Details
            </h2>

            <div className="space-y-6">
              {/* Reporter Info (Read-only) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reported By
                  </label>
                  <input
                    type="text"
                    value={user?.full_name || ''}
                    disabled
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl bg-gray-50 text-gray-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl bg-gray-50 text-gray-600"
                  />
                </div>
              </div>

              {/* Issue Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Issue Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={issueTitle}
                  onChange={(e) => setIssueTitle(e.target.value)}
                  placeholder="Brief description of the issue"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Category and Severity */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <CustomSelect
                    value={issueCategory}
                    onChange={(value) => setIssueCategory(value)}
                    options={[
                      { value: '', label: 'Select category' },
                      { value: 'authentication', label: 'Authentication' },
                      { value: 'user-management', label: 'User Management' },
                      { value: 'barangay-management', label: 'Barangay Management' },
                      { value: 'reports', label: 'Reports & Analytics' },
                      { value: 'audit-logs', label: 'Audit Logs' },
                      { value: 'dashboard', label: 'Admin Dashboard' },
                      { value: 'settings', label: 'Settings' },
                      { value: 'security', label: 'Security' },
                      { value: 'performance', label: 'Performance' },
                      { value: 'ui-ux', label: 'UI/UX' },
                      { value: 'other', label: 'Other' },
                    ]}
                    placeholder="Select category"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Severity <span className="text-red-500">*</span>
                  </label>
                  <CustomSelect
                    value={issueSeverity}
                    onChange={(value) => setIssueSeverity(value)}
                    options={[
                      { value: '', label: 'Select severity' },
                      { value: 'critical', label: 'Critical - System unusable' },
                      { value: 'high', label: 'High - Major feature broken' },
                      { value: 'medium', label: 'Medium - Feature partially broken' },
                      { value: 'low', label: 'Low - Minor issue' },
                    ]}
                    placeholder="Select severity"
                  />
                </div>
              </div>

              {/* Issue Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Issue Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={issueDescription}
                  onChange={(e) => setIssueDescription(e.target.value)}
                  rows={4}
                  placeholder="Describe the issue in detail..."
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                  required
                />
              </div>

              {/* Steps to Reproduce */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Steps to Reproduce
                </label>
                <textarea
                  value={stepsToReproduce}
                  onChange={(e) => setStepsToReproduce(e.target.value)}
                  rows={4}
                  placeholder="1. Go to...&#10;2. Click on...&#10;3. See error..."
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                />
                <p className="text-xs text-gray-500 mt-1">
                  List the steps needed to reproduce the issue
                </p>
              </div>

              {/* Expected vs Actual Behavior */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expected Behavior
                  </label>
                  <textarea
                    value={expectedBehavior}
                    onChange={(e) => setExpectedBehavior(e.target.value)}
                    rows={3}
                    placeholder="What should happen..."
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Actual Behavior
                  </label>
                  <textarea
                    value={actualBehavior}
                    onChange={(e) => setActualBehavior(e.target.value)}
                    rows={3}
                    placeholder="What actually happens..."
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-4 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-xl hover:from-red-700 hover:to-orange-700 font-semibold transition-all disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Submit Issue Report
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>

          {/* Additional Info */}
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">What Happens Next?</h3>
            <ol className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="flex-shrink-0 w-6 h-6 bg-emerald-600 text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
                <span>Your issue report will be reviewed by our development team</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="flex-shrink-0 w-6 h-6 bg-emerald-600 text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
                <span>We'll investigate and attempt to reproduce the issue</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="flex-shrink-0 w-6 h-6 bg-emerald-600 text-white rounded-full flex items-center justify-center text-xs font-bold">3</span>
                <span>You'll receive an email update on the status of your report</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="flex-shrink-0 w-6 h-6 bg-emerald-600 text-white rounded-full flex items-center justify-center text-xs font-bold">4</span>
                <span>Once fixed, the update will be included in the next release</span>
              </li>
            </ol>
          </div>

          {/* Contact Support */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm text-center">
            <p className="text-gray-600 mb-2">Need immediate assistance?</p>
            <p className="text-sm text-gray-500">
              Contact admin support at <strong className="text-emerald-600">admin@medimoms.com</strong> or call <strong className="text-emerald-600">(049) 123-4569</strong>
            </p>
          </div>
        </div>
      </motion.div>
    </AdminLayout>
  );
}
