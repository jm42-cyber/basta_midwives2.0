import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  UserPlus, 
  Search,
  Loader2,
  MapPin,
  Mail,
  Phone,
  Calendar,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  X,
  Building2
} from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';
import CustomSelect from '@/components/CustomSelect';
import api from '@/services/api';
import { toast } from 'react-toastify';

interface PendingAccount {
  id: number;
  name: string;
  email: string;
  contact_number: string;
  barangays: string;
  created_at: string;
}

interface Barangay {
  id: number;
  name: string;
}

type TabType = 'all' | 'today' | 'week' | 'older';

interface Activity {
  id: number;
  action: string;
  user_name: string;
  timestamp: string;
}

export default function PendingAccounts() {
  const [accounts, setAccounts] = useState<PendingAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [showBanner, setShowBanner] = useState(true);
  const [recentActivities, setRecentActivities] = useState<Activity[]>([]);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'name-asc' | 'name-desc'>('newest');
  const [visibleCount, setVisibleCount] = useState(6);
  const [approvalModal, setApprovalModal] = useState<{ open: boolean; account: PendingAccount | null }>({ open: false, account: null });
  const [barangays, setBarangays] = useState<Barangay[]>([]);
  const [selectedBarangays, setSelectedBarangays] = useState<number[]>([]);

  useEffect(() => {
    fetchPendingAccounts();
    fetchRecentActivities();
    fetchBarangays();
  }, []);

  // Reset visible count when tab or search changes
  useEffect(() => {
    setVisibleCount(6);
  }, [activeTab, searchQuery]);

  const fetchBarangays = async () => {
    try {
      const response = await api.get('/barangays');
      setBarangays(response.data.data);
    } catch (error) {
      console.error('Error fetching barangays:', error);
    }
  };

  const fetchPendingAccounts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/dashboard/pending-approvals');
      setAccounts(response.data);
    } catch (error) {
      console.error('Error fetching pending accounts:', error);
      toast.error('Failed to load pending accounts');
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentActivities = async () => {
    try {
      const response = await api.get('/admin/dashboard/activities');
      const approvalActivities = response.data
        .filter((activity: Activity) => 
          activity.action.toLowerCase().includes('approve') || 
          activity.action.toLowerCase().includes('reject')
        )
        .slice(0, 5);
      setRecentActivities(approvalActivities);
    } catch (error) {
      console.error('Error fetching activities:', error);
    }
  };

  const openApprovalModal = (account: PendingAccount) => {
    setApprovalModal({ open: true, account });
    setSelectedBarangays([]);
  };

  const closeApprovalModal = () => {
    setApprovalModal({ open: false, account: null });
    setSelectedBarangays([]);
  };

  const toggleBarangay = (id: number) => {
    setSelectedBarangays(prev =>
      prev.includes(id) ? prev.filter(b => b !== id) : prev.length < 3 ? [...prev, id] : prev
    );
  };

  const handleApprove = async () => {
    if (!approvalModal.account) return;
    try {
      setProcessingId(approvalModal.account.id);
      await api.post(`/users/${approvalModal.account.id}/approve`, { barangays: selectedBarangays });
      toast.success('Account approved successfully!');
      closeApprovalModal();
      fetchPendingAccounts();
    } catch (error) {
      console.error('Error approving account:', error);
      toast.error('Failed to approve account');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (accountId: number) => {
    try {
      setProcessingId(accountId);
      await api.post(`/users/${accountId}/reject`);
      toast.success('Account rejected');
      fetchPendingAccounts();
    } catch (error) {
      console.error('Error rejecting account:', error);
      toast.error('Failed to reject account');
    } finally {
      setProcessingId(null);
    }
  };

  const filteredAccounts = accounts.filter(account =>
    account.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    account.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort accounts
  const sortedAccounts = [...filteredAccounts].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case 'oldest':
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      case 'name-asc':
        return a.name.localeCompare(b.name);
      case 'name-desc':
        return b.name.localeCompare(a.name);
      default:
        return 0;
    }
  });

  const getWaitingTime = (createdAt: string) => {
    const created = new Date(createdAt);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return { label: 'Today', color: 'bg-emerald-100 text-emerald-700' };
    } else if (diffDays >= 1 && diffDays <= 6) {
      return { label: `${diffDays}d ago`, color: 'bg-amber-100 text-amber-700' };
    } else {
      return { label: `${diffDays}d ago`, color: 'bg-red-100 text-red-700' };
    }
  };

  const getInitials = (name: string) => {
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const todayCount = sortedAccounts.filter(account => {
    const created = new Date(account.created_at);
    const today = new Date();
    return created.toDateString() === today.toDateString();
  }).length;

  const overdueCount = sortedAccounts.filter(account => {
    const created = new Date(account.created_at);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays >= 7;
  }).length;

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-16 h-16 shadow-lg bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl">
              <UserPlus className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-transparent bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text">
                Pending Accounts
              </h1>
              <p className="flex items-center gap-2 mt-1 text-gray-600">
                <UserPlus className="w-4 h-4" />
                Review and approve midwife registrations
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-white border border-gray-100 rounded-xl shadow-sm p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Pending</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{accounts.length}</p>
              </div>
              <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center">
                <UserPlus className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white border border-gray-100 rounded-xl shadow-sm p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Approved Today</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">0</p>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-white border border-gray-100 rounded-xl shadow-sm p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Rejected Today</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">0</p>
              </div>
              <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Info Banner */}
        {showBanner && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3 mb-6"
          >
            <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0" />
            <p className="text-sm text-amber-800 flex-1">
              Pending accounts older than 7 days are highlighted in red. Please review them promptly.
            </p>
            <button
              onClick={() => setShowBanner(false)}
              className="text-amber-500 hover:text-amber-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        )}

        {/* Search Bar */}
        <div className="mb-6 flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent shadow-sm"
            />
          </div>
          <CustomSelect
            value={sortBy}
            onChange={(value) => setSortBy(value as any)}
            options={[
              { value: 'newest', label: 'Newest First' },
              { value: 'oldest', label: 'Oldest First' },
              { value: 'name-asc', label: 'Name A-Z' },
              { value: 'name-desc', label: 'Name Z-A' }
            ]}
            className="w-48"
          />
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-2">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-5 py-2 rounded-full font-semibold text-sm transition-all duration-200 ${
              activeTab === 'all'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-gray-500 hover:text-emerald-600 hover:bg-emerald-50'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setActiveTab('today')}
            className={`px-5 py-2 rounded-full font-semibold text-sm transition-all duration-200 ${
              activeTab === 'today'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-gray-500 hover:text-emerald-600 hover:bg-emerald-50'
            }`}
          >
            Today
          </button>
          <button
            onClick={() => setActiveTab('week')}
            className={`px-5 py-2 rounded-full font-semibold text-sm transition-all duration-200 ${
              activeTab === 'week'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-gray-500 hover:text-emerald-600 hover:bg-emerald-50'
            }`}
          >
            This Week
          </button>
          <button
            onClick={() => setActiveTab('older')}
            className={`px-5 py-2 rounded-full font-semibold text-sm transition-all duration-200 ${
              activeTab === 'older'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-gray-500 hover:text-emerald-600 hover:bg-emerald-50'
            }`}
          >
            Older
          </button>
        </div>

        {/* Quick Stats Row */}
        <div className="mb-4">
          <p className="text-sm text-gray-500">
            Showing {sortedAccounts.length} accounts · {todayCount} waiting today · {overdueCount} overdue (7+ days)
          </p>
        </div>

        {/* Recent Activity Strip */}
        {recentActivities.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <div className="flex gap-3 overflow-x-auto pb-2">
              {recentActivities.map((activity) => {
                const isApproved = activity.action.toLowerCase().includes('approve');
                return (
                  <div
                    key={activity.id}
                    className="bg-white border border-gray-100 rounded-xl px-4 py-2 flex items-center gap-2 shadow-sm whitespace-nowrap"
                  >
                    {isApproved ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                    )}
                    <span className="text-sm font-semibold text-gray-700">{activity.user_name}</span>
                    <span className="text-xs text-gray-400">{activity.timestamp}</span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Pending Accounts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {sortedAccounts.length > 0 ? (
            sortedAccounts.slice(0, visibleCount).map((account, index) => {
              const waitingTime = getWaitingTime(account.created_at);
              const initials = getInitials(account.name);
              
              return (
                <motion.div
                  key={account.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all duration-200"
                >
                  {/* Header with Avatar and Badge */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 text-white font-bold rounded-full flex items-center justify-center text-lg">
                        {initials}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{account.name}</h3>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${waitingTime.color}`}>
                      {waitingTime.label}
                    </span>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{account.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="w-4 h-4 flex-shrink-0" />
                      <span>{account.contact_number}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{account.barangays}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4 flex-shrink-0" />
                      <span>Applied {account.created_at}</span>
                    </div>
                  </div>

                  {/* Status Timeline */}
                  <div className="mt-3 mb-3">
                    <div className="flex items-center gap-1">
                      {/* Step 1: Registered */}
                      <div className="flex flex-col items-center">
                        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                        <span className="text-[10px] text-gray-500 mt-1">Registered</span>
                      </div>
                      {/* Line 1 */}
                      <div className="flex-1 h-0.5 bg-emerald-500"></div>
                      {/* Step 2: Under Review */}
                      <div className="flex flex-col items-center">
                        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                        <span className="text-[10px] text-gray-500 mt-1 whitespace-nowrap">Under Review</span>
                      </div>
                      {/* Line 2 */}
                      <div className="flex-1 h-0.5 bg-gray-200"></div>
                      {/* Step 3: Decision */}
                      <div className="flex flex-col items-center">
                        <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                        <span className="text-[10px] text-gray-500 mt-1">Decision</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => openApprovalModal(account)}
                      disabled={processingId === account.id}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold text-sm px-4 py-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {processingId === account.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4" />
                      )}
                      Approve
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`Are you sure you want to reject ${account.name}'s application?`)) {
                          handleReject(account.id);
                        }
                      }}
                      disabled={processingId === account.id}
                      className="flex-1 border border-gray-300 text-gray-600 hover:bg-gray-50 rounded-xl font-semibold text-sm px-4 py-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {processingId === account.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <XCircle className="w-4 h-4" />
                      )}
                      Reject
                    </button>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-16">
              <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-4">
                <UserPlus className="w-10 h-10 text-emerald-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">No Pending Accounts</h3>
              <p className="text-gray-600 mb-6">All account requests have been processed</p>
              
              {/* Guidelines Card */}
              <div className="bg-gray-50 border border-gray-100 rounded-xl p-5 mt-4 max-w-sm mx-auto text-left">
                <h4 className="text-sm font-bold text-gray-700 mb-3">What happens when you approve?</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-xs text-gray-600">Midwife receives an email notification</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-xs text-gray-600">Account becomes active immediately</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-xs text-gray-600">Midwife is assigned to selected barangays</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Approval Modal */}
        {approvalModal.open && approvalModal.account && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Assign Barangays</h2>
                    <p className="text-sm text-gray-500">{approvalModal.account.name}</p>
                  </div>
                </div>
                <button onClick={closeApprovalModal} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-sm text-gray-600 mb-4">
                Select up to 3 barangays to assign to this midwife before approving.
              </p>

              <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto mb-6">
                {barangays.map(b => (
                  <button
                    key={b.id}
                    onClick={() => toggleBarangay(b.id)}
                    className={`px-3 py-2 rounded-xl text-sm font-medium text-left transition-all border-2 ${
                      selectedBarangays.includes(b.id)
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                        : 'border-gray-200 text-gray-600 hover:border-emerald-300'
                    } ${
                      !selectedBarangays.includes(b.id) && selectedBarangays.length >= 3
                        ? 'opacity-40 cursor-not-allowed'
                        : ''
                    }`}
                  >
                    {b.name}
                  </button>
                ))}
              </div>

              <p className={`text-xs mb-4 ${selectedBarangays.length === 0 ? 'text-red-400' : 'text-gray-400'}`}>
                {selectedBarangays.length === 0 ? 'At least 1 barangay is required' : `${selectedBarangays.length}/3 barangays selected`}
              </p>

              <div className="flex gap-3">
                <button
                  onClick={closeApprovalModal}
                  className="flex-1 border border-gray-300 text-gray-600 rounded-xl py-2.5 font-semibold text-sm hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApprove}
                  disabled={processingId === approvalModal.account.id || selectedBarangays.length === 0}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-2.5 font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {processingId === approvalModal.account.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4" />
                  )}
                  Approve
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Load More Button */}
        {sortedAccounts.length > visibleCount && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 text-center"
          >
            <button
              onClick={() => setVisibleCount(prev => prev + 6)}
              className="border border-gray-300 text-gray-600 rounded-xl px-8 py-3 font-semibold hover:bg-gray-50 transition-all"
            >
              Load More
            </button>
            <p className="text-xs text-gray-400 text-center mt-2">
              Showing {Math.min(visibleCount, sortedAccounts.length)} of {sortedAccounts.length} accounts
            </p>
          </motion.div>
        )}
      </motion.div>
    </AdminLayout>
  );
}
