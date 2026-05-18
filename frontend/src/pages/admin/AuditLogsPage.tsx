import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Clock, 
  Search, 
  Filter, 
  Download,
  User,
  Calendar,
  Activity,
  ChevronLeft,
  ChevronRight,
  Loader2,
  FileText,
  X,
  Eye,
  AlertCircle
} from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';
import { toast } from 'react-toastify';
import api from '@/services/api';
import { format } from 'date-fns';

import CustomSelect from '@/components/CustomSelect';

interface AuditLog {
  id: number;
  user_id: number;
  action: string;
  table_name: string;
  record_id: number;
  timestamp: string;
  user: {
    id: number;
    first_name: string;
    middle_name: string;
    last_name: string;
    email: string;
    full_name: string;
  };
}

interface PaginationData {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
}

// Updated: Added senior_citizen_records to table filter - v2.0
export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<PaginationData>({
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0,
    from: 0,
    to: 0,
  });

  // Filter states
  const [search, setSearch] = useState('');
  const [selectedAction, setSelectedAction] = useState('');
  const [selectedTableName, setSelectedTableName] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Detail modal
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [pageInput, setPageInput] = useState('');

  useEffect(() => {
    // Reset to page 1 when filters change
    if (pagination.current_page !== 1) {
      setPagination({ ...pagination, current_page: 1 });
    } else {
      fetchLogs();
    }
  }, [search, selectedAction, selectedTableName, dateFrom, dateTo]);

  useEffect(() => {
    fetchLogs();
  }, [pagination.current_page]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const params: any = {
        page: pagination.current_page,
        per_page: pagination.per_page,
      };

      if (search) params.search = search;
      if (selectedAction) params.action = selectedAction;
      if (selectedTableName) params.table_name = selectedTableName;
      if (dateFrom) params.date_from = dateFrom;
      if (dateTo) params.date_to = dateTo;

      const response = await api.get('/audit-logs', { params });
      setLogs(response.data.data);
      setPagination({
        current_page: response.data.current_page,
        last_page: response.data.last_page,
        per_page: response.data.per_page,
        total: response.data.total,
        from: response.data.from,
        to: response.data.to,
      });
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      toast.error('Failed to load audit logs');
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setSearch('');
    setSelectedAction('');
    setSelectedTableName('');
    setDateFrom('');
    setDateTo('');
    setPagination({ ...pagination, current_page: 1 });
  };

  const handlePageJump = () => {
    const page = parseInt(pageInput);
    if (page >= 1 && page <= pagination.last_page) {
      setPagination({ ...pagination, current_page: page });
      setPageInput('');
    } else {
      toast.error(`Please enter a page number between 1 and ${pagination.last_page}`);
    }
  };

  const getActionColor = (action: string) => {
    switch (action.toLowerCase()) {
      case 'created':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'updated':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'deleted':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'login':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'logout':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getTableLabel = (tableName: string) => {
    if (!tableName) return 'N/A';
    return tableName.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const actions = ['created', 'updated', 'deleted', 'login', 'logout', 'approved', 'rejected'];
  const tableNames = [
    'user_sessions',
    'immunization_records', 
    'maternal_care_records', 
    'family_planning_records', 
    'senior_citizen_records',
    'users', 
    'barangays', 
    'appointments', 
    'alerts'
  ];

  return (
    <AdminLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 shadow-lg bg-gradient-to-br from-primary-600 to-primary-500 rounded-2xl">
              <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-transparent bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text">
                Audit Logs
              </h1>
              <p className="flex items-center gap-2 mt-1 text-sm sm:text-base text-gray-600">
                <Activity className="w-4 h-4" />
                Track all system activities and changes
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all w-full sm:w-auto justify-center"
          >
            <Filter className="w-5 h-5 text-primary-600" />
            <span className="font-semibold text-gray-700">
              {showFilters ? 'Hide' : 'Show'} Filters
            </span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Logs</p>
                <p className="text-2xl font-bold text-gray-900">{pagination.total}</p>
              </div>
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-primary-600" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Current Page</p>
                <p className="text-2xl font-bold text-gray-900">{pagination.current_page} / {pagination.last_page}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Activity className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Showing</p>
                <p className="text-2xl font-bold text-gray-900">{pagination.from} - {pagination.to}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Eye className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Per Page</p>
                <p className="text-2xl font-bold text-gray-900">{pagination.per_page}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1 space-y-4"
            >
              {/* Search */}
              <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                <label className="block text-sm font-semibold text-gray-900 mb-2">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search logs..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Action Filter */}
              <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                <label className="block text-sm font-semibold text-gray-900 mb-2">Action</label>
                <CustomSelect
                  value={selectedAction}
                  onChange={setSelectedAction}
                  options={[
                    { value: '', label: 'All Actions' },
                    ...actions.map(action => ({
                      value: action,
                      label: action.charAt(0).toUpperCase() + action.slice(1)
                    }))
                  ]}
                  placeholder="Select action"
                />
              </div>

              {/* Table Name Filter */}
              <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                <label className="block text-sm font-semibold text-gray-900 mb-2">Table</label>
                <CustomSelect
                  value={selectedTableName}
                  onChange={setSelectedTableName}
                  options={[
                    { value: '', label: 'All Tables' },
                    ...tableNames.map(table => ({
                      value: table,
                      label: getTableLabel(table)
                    }))
                  ]}
                  placeholder="Select table"
                />
              </div>

              {/* Date Range */}
              <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                <label className="block text-sm font-semibold text-gray-900 mb-2">Date Range</label>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">From</label>
                    <input
                      type="date"
                      value={dateFrom}
                      onChange={(e) => setDateFrom(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">To</label>
                    <input
                      type="date"
                      value={dateTo}
                      onChange={(e) => setDateTo(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Clear Filters */}
              <button
                onClick={clearFilters}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-50 text-red-600 rounded-xl font-semibold hover:bg-red-100 transition-all"
              >
                <X className="w-5 h-5" />
                Clear Filters
              </button>
            </motion.div>
          )}

          {/* Logs Table */}
          <div className={showFilters ? 'lg:col-span-3' : 'lg:col-span-4'}>
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
                </div>
              ) : logs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                  <AlertCircle className="w-16 h-16 mb-4 opacity-50" />
                  <p className="text-lg font-semibold">No audit logs found</p>
                  <p className="text-sm">Try adjusting your filters</p>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <div className="min-w-[800px]">
                      <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                          <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                              Timestamp
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                              User
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                              Action
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                              Table
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                              Record ID
                            </th>
                            <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {logs.map((log) => (
                            <motion.tr
                              key={log.id}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="hover:bg-gray-50 transition-colors"
                            >
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center gap-2 text-sm text-gray-900">
                                  <Calendar className="w-4 h-4 text-gray-400" />
                                  {format(new Date(log.timestamp), 'MMM dd, yyyy HH:mm')}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center gap-2">
                                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                                    <User className="w-4 h-4 text-primary-600" />
                                  </div>
                                  <div>
                                    <div className="text-sm font-semibold text-gray-900">{log.user?.full_name || 'System'}</div>
                                    <div className="text-xs text-gray-500">{log.user?.email || 'N/A'}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getActionColor(log.action)}`}>
                                  {log.action.toUpperCase()}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {getTableLabel(log.table_name)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-600">
                                #{log.record_id || 'N/A'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-center">
                                <button
                                  onClick={() => setSelectedLog(log)}
                                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary-50 text-primary-600 rounded-lg hover:bg-primary-100 transition-colors text-sm font-semibold"
                                >
                                  <Eye className="w-4 h-4" />
                                  View
                                </button>
                              </td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Pagination */}
                  <div className="px-6 py-4 border-t border-gray-200">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
                      <div className="text-sm text-gray-600">
                        Showing <span className="font-semibold text-gray-900">{pagination.from}</span> to{' '}
                        <span className="font-semibold text-gray-900">{pagination.to}</span> of{' '}
                        <span className="font-semibold text-gray-900">{pagination.total}</span> results
                      </div>
                      <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setPagination({ ...pagination, current_page: pagination.current_page - 1 })}
                            disabled={pagination.current_page === 1}
                            className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            <ChevronLeft className="w-5 h-5 text-gray-600" />
                          </button>
                          <span className="px-4 py-2 text-sm font-semibold text-gray-700 whitespace-nowrap">
                            Page {pagination.current_page} of {pagination.last_page}
                          </span>
                          <button
                            onClick={() => setPagination({ ...pagination, current_page: pagination.current_page + 1 })}
                            disabled={pagination.current_page === pagination.last_page}
                            className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            <ChevronRight className="w-5 h-5 text-gray-600" />
                          </button>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600 whitespace-nowrap">Go to:</span>
                          <input
                            type="number"
                            min="1"
                            max={pagination.last_page}
                            value={pageInput}
                            onChange={(e) => setPageInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handlePageJump()}
                            placeholder="Page"
                            className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          />
                          <button
                            onClick={handlePageJump}
                            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-semibold whitespace-nowrap"
                          >
                            Go
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Detail Modal */}
        {selectedLog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setSelectedLog(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="bg-gradient-to-r from-primary-600 to-primary-500 px-6 py-4 flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">Audit Log Details</h3>
                <button
                  onClick={() => setSelectedLog(null)}
                  className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Log ID</label>
                    <p className="text-sm font-semibold text-gray-900">#{selectedLog.id}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Timestamp</label>
                    <p className="text-sm font-semibold text-gray-900">
                      {format(new Date(selectedLog.timestamp), 'MMM dd, yyyy HH:mm:ss')}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">User</label>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{selectedLog.user?.full_name || 'System'}</p>
                      <p className="text-xs text-gray-500">{selectedLog.user?.email || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Action</label>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${getActionColor(selectedLog.action)}`}>
                      {selectedLog.action.toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Table Name</label>
                    <p className="text-sm font-semibold text-gray-900">{getTableLabel(selectedLog.table_name)}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Record ID</label>
                  <p className="text-sm font-mono text-gray-900">#{selectedLog.record_id || 'N/A'}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </AdminLayout>
  );
}
