import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Inbox, 
  Search, 
  AlertCircle, 
  CheckCircle2, 
  Info, 
  AlertTriangle,
  XCircle,
  Clock,
  Trash2,
  Filter,
  Plus,
  Users,
  MapPin,
  Calendar
} from 'lucide-react';
import { toast } from 'react-toastify';
import AdminLayout from '@/components/AdminLayout';
import CustomSelect from '@/components/CustomSelect';
import alertService, { Alert, CreateAlertData } from '@/services/alertService';

type TabType = 'sent' | 'inbox';

interface Barangay {
  id: number;
  name: string;
}

interface MidwifeOption {
  id: number;
  full_name: string;
  barangay_name: string;
}

export default function AdminAlerts() {
  const getDefault30Days = () => {
    const date = new Date();
    date.setDate(date.getDate() + 30);
    return date.toISOString().split('T')[0]; // returns "YYYY-MM-DD"
  };

  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [barangays, setBarangays] = useState<Barangay[]>([]);
  const [midwives, setMidwives] = useState<MidwifeOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('sent');
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [showComposeModal, setShowComposeModal] = useState(false);
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState('');
  const [selectedBarangays, setSelectedBarangays] = useState<number[]>([]);

  const [formData, setFormData] = useState<CreateAlertData>({
    title: '',
    message: '',
    type: 'info',
    priority: 'medium',
    recipient_type: 'all',
    recipient_ids: [],
    expires_at: getDefault30Days(),
  });

  useEffect(() => {
    fetchAlerts();
    fetchBarangays();
    fetchMidwives();
  }, []);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const data = await alertService.getAll();
      setAlerts(data);
    } catch (error) {
      toast.error('Failed to fetch alerts');
    } finally {
      setLoading(false);
    }
  };

  const fetchBarangays = async () => {
    try {
      const response = await fetch('/api/admin/barangays', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      setBarangays(data);
    } catch (error) {
      console.error('Failed to fetch barangays');
    }
  };

  const fetchMidwives = async () => {
    try {
      const data = await alertService.getMidwivesList();
      setMidwives(data);
    } catch (error) {
      console.error('Failed to fetch midwives');
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.message.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setSending(true);
      const dataToSend = {
        ...formData,
        recipient_ids: formData.recipient_type === 'barangay' ? selectedBarangays : formData.recipient_ids,
      };
      await alertService.create(dataToSend);
      toast.success('Announcement sent successfully');
      setShowComposeModal(false);
      resetForm();
      fetchAlerts();
    } catch (error) {
      toast.error('Failed to send announcement');
    } finally {
      setSending(false);
    }
  };

  const handleReply = async (alertId: number) => {
    if (!replyText.trim()) {
      toast.error('Please enter a reply');
      return;
    }

    try {
      await alertService.reply(alertId, { reply: replyText });
      toast.success('Reply sent successfully');
      setReplyingTo(null);
      setReplyText('');
      fetchAlerts();
    } catch (error) {
      toast.error('Failed to send reply');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this alert?')) return;
    try {
      await alertService.delete(id);
      toast.success('Alert deleted successfully');
      fetchAlerts();
    } catch (error) {
      toast.error('Failed to delete alert');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      message: '',
      type: 'info',
      priority: 'medium',
      recipient_type: 'all',
      recipient_ids: [],
      expires_at: getDefault30Days(),
    });
    setSelectedBarangays([]);
  };

  const sentAnnouncements = useMemo(() => {
    return alerts.filter(alert => alert.sender_role === 'admin');
  }, [alerts]);

  const midwifeMessages = useMemo(() => {
    return alerts.filter(alert => alert.sender_role === 'midwife');
  }, [alerts]);

  const filteredAlerts = useMemo(() => {
    const source = activeTab === 'sent' ? sentAnnouncements : midwifeMessages;
    
    return source.filter(alert => {
      const matchesSearch = alert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           alert.message.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = typeFilter === 'all' || alert.type === typeFilter;
      const matchesPriority = priorityFilter === 'all' || alert.priority === priorityFilter;
      
      return matchesSearch && matchesType && matchesPriority;
    });
  }, [activeTab, sentAnnouncements, midwifeMessages, searchQuery, typeFilter, priorityFilter]);

  const stats = useMemo(() => {
    const unreadMessages = midwifeMessages.filter(m => !m.reply).length;
    const highUrgent = sentAnnouncements.filter(a => a.priority === 'high' || a.priority === 'urgent').length;
    const expiringToday = sentAnnouncements.filter(a => {
      if (!a.expires_at) return false;
      const today = new Date().toDateString();
      const expiryDate = new Date(a.expires_at).toDateString();
      return today === expiryDate;
    }).length;

    return {
      totalSent: sentAnnouncements.length,
      unreadMessages,
      highUrgent,
      expiringToday,
    };
  }, [sentAnnouncements, midwifeMessages]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'success': return CheckCircle2;
      case 'warning': return AlertTriangle;
      case 'error': return XCircle;
      default: return Info;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success': return 'text-emerald-600 bg-emerald-50';
      case 'warning': return 'text-yellow-600 bg-yellow-50';
      case 'error': return 'text-red-600 bg-red-50';
      default: return 'text-blue-600 bg-blue-50';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-50';
      case 'high': return 'text-orange-600 bg-orange-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const getRecipientDisplay = (alert: Alert) => {
    if (alert.recipient_type === 'all') return 'All Midwives';
    if (alert.recipient_type === 'barangay') {
      const count = alert.recipient_ids?.length || 0;
      return `${count} Barangay${count !== 1 ? 's' : ''}`;
    }
    if (alert.recipient_type === 'specific') {
      const midwife = midwives.find(m => alert.recipient_ids?.includes(m.id));
      return midwife ? midwife.full_name : 'Specific Midwife';
    }
    return 'Unknown';
  };

  const isExpired = (expiresAt: string | null) => {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  };

  return (
    <AdminLayout>
      <div className="space-y-6 p-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Alerts & Announcements</h1>
            <p className="text-gray-600 mt-1">Manage announcements and respond to midwife messages</p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
            >
              <button
                onClick={() => setShowComposeModal(true)}
                className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                <Plus className="w-5 h-5" />
                Compose Announcement
              </button>
            </motion.div>

            {/* Combined Filters & Stats Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
            >
              {/* Tab toggle */}
              <div className="flex gap-2 p-1 bg-gray-100 rounded-lg mb-4">
                <button
                  onClick={() => setActiveTab('sent')}
                  className={`flex-1 py-2 px-3 rounded-md text-sm font-semibold transition-all ${
                    activeTab === 'sent'
                      ? 'bg-white text-emerald-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Send className="w-4 h-4 inline mr-1" />
                  Sent
                </button>
                <button
                  onClick={() => setActiveTab('inbox')}
                  className={`flex-1 py-2 px-3 rounded-md text-sm font-semibold transition-all ${
                    activeTab === 'inbox'
                      ? 'bg-white text-emerald-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Inbox className="w-4 h-4 inline mr-1" />
                  Inbox
                  {stats.unreadMessages > 0 && (
                    <span className="ml-1 px-1.5 py-0.5 bg-red-500 text-white text-xs rounded-full">
                      {stats.unreadMessages}
                    </span>
                  )}
                </button>
              </div>

              <div className="border-t border-gray-100 my-4" />

              <div className="space-y-3 mb-4">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Filters</p>
                <div>
                  <CustomSelect
                    value={typeFilter}
                    onChange={setTypeFilter}
                    options={[
                      { value: 'all', label: 'All Types' },
                      { value: 'info', label: 'Info' },
                      { value: 'warning', label: 'Warning' },
                      { value: 'success', label: 'Success' },
                      { value: 'error', label: 'Error' },
                    ]}
                  />
                </div>
                <div>
                  <CustomSelect
                    value={priorityFilter}
                    onChange={setPriorityFilter}
                    options={[
                      { value: 'all', label: 'All Priorities' },
                      { value: 'low', label: 'Low' },
                      { value: 'medium', label: 'Medium' },
                      { value: 'high', label: 'High' },
                      { value: 'urgent', label: 'Urgent' },
                    ]}
                  />
                </div>
              </div>

              <div className="border-t border-gray-100 my-4" />

              <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Statistics</p>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Sent</span>
                  <span className="font-bold text-blue-600">{stats.totalSent}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Unread Messages</span>
                  <span className="font-bold text-emerald-600">{stats.unreadMessages}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">High/Urgent</span>
                  <span className="font-bold text-orange-600">{stats.highUrgent}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Expiring Today</span>
                  <span className="font-bold text-red-600">{stats.expiringToday}</span>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
            >
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search messages..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : filteredAlerts.length === 0 ? (
                <div className="text-center py-12">
                  <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 font-medium">No messages found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredAlerts.map((alert, index) => {
                    const TypeIcon = getTypeIcon(alert.type);
                    const expired = isExpired(alert.expires_at);
                    const hasReply = alert.reply && alert.reply_at;

                    return (
                      <motion.div
                        key={alert.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`p-5 rounded-xl border transition-all ${
                          expired ? 'bg-gray-50 border-gray-300' : 'bg-white border-gray-200 hover:shadow-md'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div className="flex items-center gap-3 flex-1">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getTypeColor(alert.type)}`}>
                              <TypeIcon className="w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-bold text-gray-900 text-lg">{alert.title}</h3>
                              {activeTab === 'inbox' && alert.sender_name && (
                                <p className="text-xs text-gray-500">From: {alert.sender_name} {alert.sender_barangay && `(${alert.sender_barangay})`}</p>
                              )}
                              {activeTab === 'sent' && (
                                <p className="text-xs text-gray-500">To: {getRecipientDisplay(alert)}</p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 rounded-md text-xs font-bold ${getTypeColor(alert.type)}`}>
                              {alert.type}
                            </span>
                            <span className={`px-2 py-1 rounded-md text-xs font-bold ${getPriorityColor(alert.priority)}`}>
                              {alert.priority}
                            </span>
                            {activeTab === 'sent' && (
                              <button
                                onClick={() => handleDelete(alert.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>

                        <p className="text-gray-700 mb-3 whitespace-pre-wrap">{alert.message}</p>

                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2 text-gray-500">
                            <Clock className="w-4 h-4" />
                            <span>{formatDate(alert.created_at)}</span>
                          </div>
                          {alert.expires_at && (
                            <span className={`text-xs ${expired ? 'text-red-600 font-bold' : 'text-gray-500'}`}>
                              {expired ? 'Expired' : `Expires: ${new Date(alert.expires_at).toLocaleDateString()}`}
                            </span>
                          )}
                        </div>

                        {expired && (
                          <div className="mt-3 p-2 bg-gray-200 rounded-lg text-center">
                            <span className="text-xs font-bold text-gray-600">EXPIRED</span>
                          </div>
                        )}

                        {activeTab === 'inbox' && !hasReply && (
                          <div className="mt-4">
                            {replyingTo === alert.id ? (
                              <div className="space-y-2">
                                <textarea
                                  value={replyText}
                                  onChange={(e) => setReplyText(e.target.value)}
                                  rows={3}
                                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                                  placeholder="Type your reply..."
                                />
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleReply(alert.id)}
                                    className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors text-sm font-semibold"
                                  >
                                    Send Reply
                                  </button>
                                  <button
                                    onClick={() => {
                                      setReplyingTo(null);
                                      setReplyText('');
                                    }}
                                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-semibold"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <button
                                onClick={() => setReplyingTo(alert.id)}
                                className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors text-sm font-semibold"
                              >
                                Reply
                              </button>
                            )}
                          </div>
                        )}

                        {hasReply && (
                          <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                              <span className="text-sm font-bold text-emerald-700">
                                {activeTab === 'inbox' ? 'Your reply' : 'Admin replied'} {formatDate(alert.reply_at!)}
                              </span>
                            </div>
                            <p className="text-gray-700 text-sm whitespace-pre-wrap">{alert.reply}</p>
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Compose Modal */}
      <AnimatePresence>
        {showComposeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowComposeModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <form onSubmit={handleCreate} className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Compose Announcement</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="Enter announcement title"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                      placeholder="Enter announcement message"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Type</label>
                      <CustomSelect
                        value={formData.type}
                        onChange={(value) => setFormData({ ...formData, type: value as any })}
                        options={[
                          { value: 'info', label: 'Info' },
                          { value: 'success', label: 'Success' },
                          { value: 'warning', label: 'Warning' },
                          { value: 'error', label: 'Error' },
                        ]}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Priority</label>
                      <CustomSelect
                        value={formData.priority}
                        onChange={(value) => setFormData({ ...formData, priority: value as any })}
                        options={[
                          { value: 'low', label: 'Low' },
                          { value: 'medium', label: 'Medium' },
                          { value: 'high', label: 'High' },
                          { value: 'urgent', label: 'Urgent' },
                        ]}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Send To</label>
                    <CustomSelect
                      value={formData.recipient_type}
                      onChange={(value) => setFormData({ ...formData, recipient_type: value as any, recipient_ids: [] })}
                      options={[
                        { value: 'all', label: 'All Midwives' },
                        { value: 'barangay', label: 'By Barangay' },
                        { value: 'specific', label: 'Specific Midwife' },
                      ]}
                    />
                  </div>

                  {formData.recipient_type === 'barangay' && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Select Barangays</label>
                      <div className="max-h-40 overflow-y-auto border border-gray-300 rounded-lg p-3 space-y-2">
                        {barangays.map((barangay) => (
                          <label key={barangay.id} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={selectedBarangays.includes(barangay.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedBarangays([...selectedBarangays, barangay.id]);
                                } else {
                                  setSelectedBarangays(selectedBarangays.filter(id => id !== barangay.id));
                                }
                              }}
                              className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                            />
                            <span className="text-sm text-gray-700">{barangay.name}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {formData.recipient_type === 'specific' && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Select Midwife</label>
                      <CustomSelect
                        value={formData.recipient_ids?.[0]?.toString() || ''}
                        onChange={(value) => setFormData({ ...formData, recipient_ids: value ? [parseInt(value)] : [] })}
                        options={[
                          { value: '', label: 'Select a midwife...' },
                          ...midwives.map((midwife) => ({
                            value: midwife.id.toString(),
                            label: `${midwife.full_name} - ${midwife.barangay_name}`
                          }))
                        ]}
                        placeholder="Select a midwife..."
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Expiry Date <span className="text-gray-400 font-normal">(defaults to 30 days)</span>
                    </label>
                    <input
                      type="date"
                      value={formData.expires_at}
                      onChange={(e) => setFormData({ ...formData, expires_at: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => { setShowComposeModal(false); resetForm(); }}
                    className="flex-1 px-4 py-3 font-semibold text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={sending}
                    className="flex-1 px-4 py-3 font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {sending ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Send Announcement
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
}
