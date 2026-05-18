import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, UserPlus, Edit, Power, Mail, Phone, MapPin } from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const users = [
    {
      id: 1,
      name: 'Maria Santos',
      username: 'maria.santos',
      email: 'maria@example.com',
      phone: '09123456789',
      barangays: ['Barangay 1', 'Barangay 2'],
      status: 'approved',
      avatar: '🩺'
    },
  ];

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { bg: string; text: string; label: string }> = {
      approved: { bg: 'bg-emerald-100', text: 'text-emerald-700', label: '✓ Active' },
      pending: { bg: 'bg-amber-100', text: 'text-amber-700', label: '⏳ Pending' },
      inactive: { bg: 'bg-red-100', text: 'text-red-700', label: '🔒 Inactive' },
    };
    return badges[status] || badges.approved;
  };

  return (
    <AdminLayout>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
              <span>👥</span> Manage Midwives
            </h1>
            <p className="text-gray-600 text-lg">View and manage registered midwife accounts</p>
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white rounded-xl font-semibold hover:bg-emerald-600 transition-colors shadow-lg">
            <UserPlus className="w-5 h-5" />
            Add Midwife
          </button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="mb-6 flex flex-col md:flex-row gap-4"
      >
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search midwives..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>
        
        <div className="flex gap-2 bg-white p-1 rounded-xl border border-gray-200">
          {['all', 'approved', 'pending', 'inactive'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                filterStatus === status
                  ? 'bg-emerald-500 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </motion.div>

      <div className="space-y-4">
        {users.map((user, index) => {
          const statusBadge = getStatusBadge(user.status);
          return (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer"
            >
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-2xl shadow-lg">
                    {user.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{user.name}</h3>
                    <p className="text-sm text-gray-600">@{user.username}</p>
                  </div>
                </div>

                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span>{user.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>{user.phone}</span>
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex items-start gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                    <div className="flex flex-wrap gap-2">
                      {user.barangays.map((brgy) => (
                        <span key={brgy} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-semibold">
                          {brgy}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`px-4 py-2 ${statusBadge.bg} ${statusBadge.text} rounded-lg text-xs font-bold`}>
                    {statusBadge.label}
                  </span>
                  <button className="p-2 bg-amber-50 text-amber-600 rounded-lg hover:bg-amber-100 transition-colors">
                    <Edit className="w-5 h-5" />
                  </button>
                  <button className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
                    <Power className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {users.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-2xl p-12 text-center border-2 border-dashed border-gray-300"
        >
          <div className="text-6xl mb-4">👥</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Midwives Yet</h3>
          <p className="text-gray-600">Click "Add Midwife" to register your first midwife account.</p>
        </motion.div>
      )}
    </AdminLayout>
  );
}
