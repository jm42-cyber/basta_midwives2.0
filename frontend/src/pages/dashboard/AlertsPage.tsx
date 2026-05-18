import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Send, 
  Inbox, 
  MessageSquare, 
  Search, 
  AlertCircle, 
  CheckCircle2, 
  Info, 
  AlertTriangle,
  XCircle,
  Clock,
  Trash2,
  Filter
} from 'lucide-react';
import { toast } from 'react-toastify';
import DashboardLayout from '@/components/DashboardLayout';
import CustomSelect from '@/components/CustomSelect';
import alertService, { Alert, CreateAlertData } from '@/services/alertService';

type TabType = 'inbox' | 'sent';

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('inbox');
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  // Form state
  const [formData, setFormData] = useState<CreateAlertData>({
    title: '',
    message: '',
    type: 'info',
    priority: 'medium',
  });

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const data = await alertService.getAll();
      setAlerts(data);
    } catch (error) {
      toast.error('Failed to load alerts');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.message.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setSending(true);
      await alertService.create(formData);
      toast.success('Message sent to admin successfully');
      setFormData({
        title: '',
        message: '',
        type: 'info',
        priority: 'medium',
      });
      fetchAlerts();
    } catch (error) {
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const handleMarkAsRead = async (id: number) => {
    try {
      await alertService.markRead(id);
      setAlerts(alerts.map(alert => 
        alert.id === id ? { ...alert, read_at: new Date().toISOString() } : alert
      ));
    } catch (error) {
      toast.error('Failed to mark as read');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this message?')) return;

    try {
      await alertService.delete(id);
      toast.success('Message deleted successfully');
      fetchAlerts();
    } catch (error) {
      toast.error('Failed to delete message');
    }
  };

  // Filter alerts
  const inboxAlerts = useMemo(() => {
    return alerts.filter(alert => alert.sender_role === 'admin');
  }, [alerts]);

  const sentAlerts = useMemo(() => {
    return alerts.filter(alert => alert.sender_role === 'midwife');
  }, [alerts]);

  const filteredAlerts = useMemo(() => {
    const source = activeTab === 'inbox' ? inboxAlerts : sentAlerts;
    
    return source.filter(alert => {
      const matchesSearch = alert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           alert.message.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = typeFilter === 'all' || alert.type === typeFilter;
      const matchesPriority = priorityFilter === 'all' || alert.priority === priorityFilter;
      const matchesUnread = !showUnreadOnly || !alert.read_at;
      
      // Check if expired
      const isExpired = alert.expires_at && new Date(alert.expires_at) < new Date();
      
      return matchesSearch && matchesType && matchesPriority && matchesUnread && !isExpired;
    });
  }, [activeTab, inboxAlerts, sentAlerts, searchQuery, typeFilter, priorityFilter, showUnreadOnly]);

  // Stats
  const stats = useMemo(() => {
    const unreadCount = inboxAlerts.filter(a => !a.read_at).length;
    return {
      totalReceived: inboxAlerts.length,
      unread: unreadCount,
      sent: sentAlerts.length,
    };
  }, [inboxAlerts, sentAlerts]);

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

  return (
    <DashboardLayout>
      <div className="space-y-6 p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Alerts & Messages</h1>
            <p className="text-gray-600 mt-1">Communicate with admin and view announcements</p>
          </div>
        </motion.div>

        {/* Two-column grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel */}
          <div className="lg:col-span-1 space-y-6">
            {/* Send Message Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
                  <Send className="w-5 h-5 text-emerald-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Send Message</h2>
              </div>

              <form onSubmit={handleSendMessage} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="Enter subject"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                    placeholder="Type your message..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Type</label>
                  <CustomSelect
                    value={formData.type}
                    onChange={(value) => setFormData({ ...formData, type: value as any })}
                    options={[
                      { value: 'info', label: 'Info' },
                      { value: 'warning', label: 'Warning' },
                      { value: 'success', label: 'Success' },
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

                <button
                  type="submit"
                  disabled={sending}
                  className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-lg hover:from-emerald-600 hover:to-teal-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {sending ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </motion.div>

            {/* Combined Filters & Stats Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
            >
              {/* Tab toggle at top */}
              <div className="flex gap-2 p-1 bg-gray-100 rounded-lg mb-4">
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
                  {stats.unread > 0 && (
                    <span className="ml-1 px-1.5 py-0.5 bg-emerald-500 text-white text-xs rounded-full">
                      {stats.unread}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('sent')}
                  className={`flex-1 py-2 px-3 rounded-md text-sm font-semibold transition-all ${
                    activeTab === 'sent'
                      ? 'bg-white text-emerald-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <MessageSquare className="w-4 h-4 inline mr-1" />
                  My Messages
                </button>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-100 my-4" />

              {/* Filters */}
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
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showUnreadOnly}
                    onChange={(e) => setShowUnreadOnly(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Unread only</span>
                </label>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-100 my-4" />

              {/* Stats — compact rows */}
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Statistics</p>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Received</span>
                  <span className="font-bold text-blue-600">{stats.totalReceived}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Unread</span>
                  <span className="font-bold text-emerald-600">{stats.unread}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Sent</span>
                  <span className="font-bold text-purple-600">{stats.sent}</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Panel - Main Content */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
            >
              {/* Search Bar */}
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

              {/* Alerts List */}
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : filteredAlerts.length === 0 ? (
                <div className="text-center py-12">
                  <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 font-medium">No messages found</p>
                  <p className="text-gray-400 text-sm mt-1">
                    {activeTab === 'inbox' ? 'You have no announcements from admin' : 'You haven\'t sent any messages yet'}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredAlerts.map((alert, index) => {
                    const TypeIcon = getTypeIcon(alert.type);
                    const isUnread = !alert.read_at && activeTab === 'inbox';
                    const hasReply = alert.reply && alert.reply_at;
                    const canDelete = activeTab === 'sent' && !hasReply;

                    return (
                      <motion.div
                        key={alert.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => isUnread && handleMarkAsRead(alert.id)}
                        className={`p-5 rounded-xl border transition-all cursor-pointer ${
                          isUnread
                            ? 'bg-emerald-50 border-emerald-200 hover:shadow-md'
                            : 'bg-white border-gray-200 hover:shadow-md'
                        } ${activeTab === 'inbox' && isUnread ? 'border-l-4 border-l-emerald-500' : ''}`}
                      >
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div className="flex items-center gap-3 flex-1">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getTypeColor(alert.type)}`}>
                              <TypeIcon className="w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-bold text-gray-900 text-lg">{alert.title}</h3>
                              {activeTab === 'sent' && alert.sender_barangay && (
                                <p className="text-xs text-gray-500">From: {alert.sender_barangay}</p>
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
                            {canDelete && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(alert.id);
                                }}
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
                            <span className="text-xs text-gray-500">
                              Expires: {new Date(alert.expires_at).toLocaleDateString()}
                            </span>
                          )}
                        </div>

                        {/* Admin Reply */}
                        {hasReply && (
                          <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                              <span className="text-sm font-bold text-emerald-700">
                                Admin replied {formatDate(alert.reply_at!)}
                              </span>
                            </div>
                            <p className="text-gray-700 text-sm whitespace-pre-wrap">{alert.reply}</p>
                            {alert.read_at && (
                              <div className="flex items-center gap-1 mt-2 text-xs text-emerald-600">
                                <CheckCircle2 className="w-3 h-3" />
                                <span>Read by admin</span>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Awaiting Reply */}
                        {activeTab === 'sent' && !hasReply && (
                          <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                            <div className="flex items-center gap-2 text-gray-500">
                              <Clock className="w-4 h-4" />
                              <span className="text-sm font-medium">Awaiting reply...</span>
                            </div>
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
    </DashboardLayout>
  );
}
