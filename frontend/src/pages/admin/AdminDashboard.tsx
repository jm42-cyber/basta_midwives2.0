import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  UserCheck, 
  MapPin, 
  FileText, 
  Activity, 
  Clock, 
  AlertCircle,
  ArrowRight,
  UserPlus,
  Shield,
  Loader2,
  Stethoscope,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import AdminLayout from '@/components/AdminLayout';
import { useAuthStore } from '@/store/authStore';
import api from '@/services/api';
import { toast } from 'react-toastify';

interface DashboardStats {
  total_midwives: number;
  pending_midwives: number;
  total_barangays: number;
  immunization_count: number;
  maternal_care_count: number;
  family_planning_count: number;
  senior_citizen_count: number;
  total_records: number;
}

interface Activity {
  id: number;
  action: string;
  user_name: string;
  timestamp: string;
  created_at: string;
}

interface User {
  id: number;
  first_name: string;
  middle_name?: string;
  last_name: string;
  email: string;
  full_name: string;
}

interface PendingApproval {
  id: number;
  name: string;
  email: string;
  contact_number: string;
  barangay: string;
  created_at: string;
}

interface MonthlyData {
  month: string;
  records: number;
  midwives: number;
}

export default function AdminDashboard() {
  const { user } = useAuthStore();
  const [currentDate, setCurrentDate] = useState('');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [pendingApprovals, setPendingApprovals] = useState<PendingApproval[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingApproval, setProcessingApproval] = useState<number | null>(null);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());
  const [chartsReady, setChartsReady] = useState(false);
  const today = new Date();

  useEffect(() => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    setCurrentDate(new Date().toLocaleDateString('en-US', options));
    
    fetchDashboardData();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setChartsReady(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      const [statsRes, activitiesRes, approvalsRes, monthlyRes] = await Promise.all([
        api.get('/admin/dashboard/stats'),
        api.get('/admin/dashboard/activities'),
        api.get('/admin/dashboard/pending-approvals'),
        api.get('/admin/dashboard/monthly-data')
      ]);
      
      setStats(statsRes.data);
      setActivities(activitiesRes.data);
      setPendingApprovals(approvalsRes.data);
      setMonthlyData(monthlyRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId: number) => {
    try {
      setProcessingApproval(userId);
      await api.post(`/users/${userId}/approve`);
      toast.success('Midwife account approved successfully!');
      fetchDashboardData();
    } catch (error) {
      console.error('Error approving user:', error);
      toast.error('Failed to approve account');
    } finally {
      setProcessingApproval(null);
    }
  };

  const handleReject = async (userId: number) => {
    try {
      setProcessingApproval(userId);
      await api.post(`/users/${userId}/reject`);
      toast.success('Midwife account rejected');
      fetchDashboardData();
    } catch (error) {
      console.error('Error rejecting user:', error);
      toast.error('Failed to reject account');
    } finally {
      setProcessingApproval(null);
    }
  };

  const formatDateTime = () => {
    const hours = currentDateTime.getHours();
    const minutes = currentDateTime.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    const displayMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${displayHours}:${displayMinutes} ${ampm}`;
  };

  const getMonthName = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long' });
  };

  const getYear = (date: Date) => {
    return date.getFullYear();
  };

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const handlePrevMonth = () => {
    setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 1));
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  const statsCards = stats ? [
    { 
      icon: Users, 
      label: 'Active Midwives', 
      value: stats.total_midwives.toString(), 
      trend: '+12%', 
      trendUp: true,
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-white',
      iconBg: 'bg-emerald-100',
      textColor: 'text-emerald-600',
      description: 'Total registered'
    },
    { 
      icon: AlertCircle, 
      label: 'Pending Approvals', 
      value: stats.pending_midwives.toString(), 
      trend: 'Needs review', 
      trendUp: false,
      color: 'from-amber-500 to-amber-600',
      bgColor: 'bg-amber-50',
      iconBg: 'bg-amber-100',
      textColor: 'text-amber-600',
      description: 'Awaiting action'
    },
    { 
      icon: MapPin, 
      label: 'Total Barangays', 
      value: stats.total_barangays.toString(), 
      trend: 'Santa Cruz', 
      trendUp: true,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      iconBg: 'bg-blue-100',
      textColor: 'text-blue-600',
      description: 'Coverage areas'
    },
    { 
      icon: FileText, 
      label: 'Total Records', 
      value: stats.total_records.toString(), 
      trend: '+8%', 
      trendUp: true,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      iconBg: 'bg-purple-100',
      textColor: 'text-purple-600',
      description: 'All categories'
    },
  ] : [];

  // Chart data
  const recordsData = [
    { name: 'Immunization', value: stats?.immunization_count || 0, color: '#8b5cf6' },
    { name: 'Maternal Care', value: stats?.maternal_care_count || 0, color: '#ec4899' },
    { name: 'Family Planning', value: stats?.family_planning_count || 0, color: '#3b82f6' },
    { name: 'Senior Citizen', value: stats?.senior_citizen_count || 0, color: '#f59e0b' },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-14 h-14 shadow-lg bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
              <div className="flex items-center gap-3 mt-1">
                <p className="text-sm text-gray-600">System Overview</p>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span className="text-xs font-medium text-gray-600">Live</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-gray-500" />
                  <span className="text-xs font-medium text-gray-600">{formatDateTime()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {statsCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`${stat.bgColor} rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-11 h-11 rounded-lg ${stat.iconBg} flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${stat.textColor}`} />
                  </div>
                  {stat.trendUp ? (
                    <div className="flex items-center gap-1 text-emerald-600">
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span className="text-xs font-semibold">{stat.trend}</span>
                    </div>
                  ) : (
                    <span className="text-xs font-medium text-gray-500">{stat.trend}</span>
                  )}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Main Grid Layout */}
        <div className="space-y-6">
          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Activity Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Activity Overview</h3>
                  <p className="text-sm text-gray-500 mt-0.5">Monthly records and midwives</p>
                </div>
                <span className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-semibold">
                  Last 6 Months
                </span>
              </div>
              {chartsReady && (
                <div className="w-full h-56 min-h-[224px]">
                  <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={200} debounce={200}>
                    <LineChart data={monthlyData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="month" stroke="#9ca3af" tick={{ fontSize: 12 }} tickMargin={8} />
                      <YAxis stroke="#9ca3af" tick={{ fontSize: 12 }} width={30} domain={['auto', 'auto']} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#fff', 
                          border: '1px solid #e5e7eb', 
                          borderRadius: '8px',
                          fontSize: '12px',
                          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                        }} 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="records" 
                        stroke="#10b981" 
                        strokeWidth={3} 
                        dot={{ fill: '#10b981', r: 4 }}
                        name="Records"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="midwives" 
                        stroke="#3b82f6" 
                        strokeWidth={3} 
                        dot={{ fill: '#3b82f6', r: 4 }}
                        name="Midwives"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
              {!chartsReady && (
                <div className="w-full h-56 min-h-[224px] bg-gray-50 rounded-lg animate-pulse" />
              )}
              
              {/* Legend Cards */}
              <div className="grid grid-cols-4 gap-3 mt-4">
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-100 hover:shadow-md transition-all duration-300">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                    <p className="text-xs font-semibold text-gray-900">Total Records</p>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 mb-1">
                    {monthlyData.reduce((sum, item) => sum + item.records, 0)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {monthlyData.length > 0 ? `${monthlyData[monthlyData.length - 1].records} this month` : 'No data'}
                  </p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-100 hover:shadow-md transition-all duration-300">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
                    <p className="text-xs font-semibold text-gray-900">Total Midwives</p>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 mb-1">
                    {monthlyData.reduce((sum, item) => sum + item.midwives, 0)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {monthlyData.length > 0 ? `${monthlyData[monthlyData.length - 1].midwives} this month` : 'No data'}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-3 border border-gray-100 hover:shadow-md transition-all duration-300">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-purple-500"></div>
                    <p className="text-xs font-semibold text-gray-900">Peak Month</p>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 mb-1">
                    {monthlyData.length > 0 
                      ? monthlyData.reduce((max, item) => item.records > max.records ? item : max, monthlyData[0]).month
                      : 'N/A'
                    }
                  </p>
                  <p className="text-xs text-gray-500">Highest activity</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-3 border border-gray-100 hover:shadow-md transition-all duration-300">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
                    <p className="text-xs font-semibold text-gray-900">Avg Monthly</p>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 mb-1">
                    {monthlyData.length > 0 
                      ? Math.round(monthlyData.reduce((sum, item) => sum + item.records, 0) / monthlyData.length)
                      : 0
                    }
                  </p>
                  <p className="text-xs text-gray-500">Per month average</p>
                </div>
              </div>
              {/* Enhanced summary section */}
              <div className="mt-3 pt-3 border-t border-gray-100 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span className="text-xs font-medium text-gray-600">System Active</span>
                  </div>
                  <span className="text-xs text-gray-400">Last updated: just now</span>
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400">Data reflects last 6 months</span>
                    <span className="font-semibold text-emerald-600">
                      {monthlyData.length > 0 ? monthlyData[monthlyData.length - 1].month : ''} is current
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full"
                        style={{ 
                          width: monthlyData.length > 0 
                            ? `${(monthlyData[monthlyData.length - 1].records / (monthlyData[monthlyData.length - 1].records + monthlyData[monthlyData.length - 1].midwives)) * 100}%` 
                            : '50%' 
                        }}
                      ></div>
                    </div>
                    <div className="flex items-center gap-3 text-[10px] font-semibold">
                      <span className="text-emerald-600">
                        Records {monthlyData.length > 0 ? monthlyData[monthlyData.length - 1].records : 0}
                      </span>
                      <span className="text-blue-600">
                        Midwives {monthlyData.length > 0 ? monthlyData[monthlyData.length - 1].midwives : 0}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Records Overview - Donut Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
            >
              <div className="mb-4">
                <h3 className="text-lg font-bold text-gray-900">Records Distribution</h3>
                <p className="text-sm text-gray-500 mt-0.5">By service category</p>
              </div>
              <div className="flex flex-col items-center gap-4">
                {chartsReady && (
                  <div className="w-full">
                    <ResponsiveContainer width="100%" height={240} minWidth={0} debounce={200}>
                      <PieChart>
                        <Pie
                          data={recordsData.filter(item => item.value > 0)}
                          cx="50%"
                          cy="50%"
                          innerRadius={70}
                          outerRadius={100}
                          paddingAngle={4}
                          dataKey="value"
                        >
                          {recordsData.filter(item => item.value > 0).map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#fff', 
                            border: '1px solid #e5e7eb', 
                            borderRadius: '8px',
                            fontSize: '12px',
                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                            padding: '8px 12px'
                          }}
                          formatter={(value: number, name: string) => [value, name]}
                        />
                        <text
                          x="50%"
                          y="50%"
                          textAnchor="middle"
                          dominantBaseline="middle"
                          className="text-3xl font-bold fill-gray-900"
                        >
                          {stats?.total_records || 0}
                        </text>
                        <text
                          x="50%"
                          y="50%"
                          dy="24"
                          textAnchor="middle"
                          dominantBaseline="middle"
                          className="text-xs fill-gray-500"
                        >
                          Total Records
                        </text>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}
                {!chartsReady && (
                  <div className="w-full h-[240px] bg-gray-50 rounded-lg animate-pulse" />
                )}
                <div className="w-full grid grid-cols-2 gap-3">
                  {recordsData.map((item, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-4 h-4 rounded flex-shrink-0 mt-0.5" style={{ backgroundColor: item.color }}></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-900 truncate">{item.name}</p>
                        <p className="text-lg font-bold text-gray-900">{item.value}</p>
                        <p className="text-xs text-gray-500">records</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Calendar, Pending Approvals, and Recent Activity Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Calendar Widget */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
            >
              <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-4">
                <div className="flex items-center justify-between mb-2">
                  <button 
                    onClick={handlePrevMonth}
                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/20 transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5 text-white" />
                  </button>
                  <h3 className="text-sm font-bold text-white">
                    {getMonthName(calendarDate)} {getYear(calendarDate)}
                  </h3>
                  <button 
                    onClick={handleNextMonth}
                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/20 transition-colors"
                  >
                    <ChevronRight className="w-5 h-5 text-white" />
                  </button>
                </div>
                <p className="text-center text-xs text-white/90">
                  {today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </p>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-7 gap-1 text-center mb-2">
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                    <div key={i} className="text-xs font-bold text-gray-500 py-1">{day}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1 text-center">
                  {Array.from({ length: getFirstDayOfMonth(calendarDate) }).map((_, i) => (
                    <div key={`empty-${i}`} className="text-sm py-1.5"></div>
                  ))}
                  {Array.from({ length: getDaysInMonth(calendarDate) }, (_, i) => i + 1).map((day) => {
                    const isToday = day === today.getDate() && 
                                    calendarDate.getMonth() === today.getMonth() && 
                                    calendarDate.getFullYear() === today.getFullYear();
                    return (
                      <button
                        key={day}
                        onClick={() => setSelectedDay(day)}
                        className={`w-8 h-8 rounded-full font-medium transition-all flex items-center justify-center mx-auto text-sm ${
                          isToday
                            ? 'bg-emerald-600 text-white font-bold shadow-md'
                            : 'text-gray-700 hover:bg-emerald-50 hover:text-emerald-600'
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
                {/* Add below the days grid, inside the p-4 div */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-xs font-semibold text-gray-500 mb-2">This Month</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-emerald-50 rounded-lg p-2 text-center">
                      <p className="text-lg font-bold text-emerald-600">
                        {monthlyData.length > 0 ? monthlyData[monthlyData.length - 1].records : 0}
                      </p>
                      <p className="text-xs text-gray-500">Records</p>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-2 text-center">
                      <p className="text-lg font-bold text-blue-600">
                        {monthlyData.length > 0 ? monthlyData[monthlyData.length - 1].midwives : 0}
                      </p>
                      <p className="text-xs text-gray-500">Midwives</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Pending Approvals */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex flex-col"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-gray-900">Pending Approvals</h3>
                <span className="px-2.5 py-1 bg-amber-100 text-amber-700 rounded-lg text-xs font-bold">
                  {pendingApprovals.length}
                </span>
              </div>

              <div className="space-y-3 max-h-[350px] overflow-y-auto flex-1">
                {pendingApprovals.length > 0 ? (
                  pendingApprovals.slice(0, 5).map((approval) => (
                    <div key={approval.id} className="p-3 bg-amber-50 rounded-lg border border-amber-100 hover:bg-amber-100 transition-colors">
                      <div className="flex items-start gap-2 mb-2">
                        <div className="w-8 h-8 bg-amber-200 rounded-full flex items-center justify-center flex-shrink-0">
                          <UserPlus className="w-4 h-4 text-amber-700" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-sm text-gray-900 truncate">{approval.name}</h4>
                          <p className="text-xs text-gray-600 truncate">{approval.email}</p>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-2">
                        <button 
                          onClick={() => handleApprove(approval.id)}
                          disabled={processingApproval === approval.id}
                          className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 bg-emerald-600 text-white rounded-md text-xs font-bold hover:bg-emerald-700 transition-colors disabled:opacity-50"
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          Approve
                        </button>
                        <button 
                          onClick={() => handleReject(approval.id)}
                          disabled={processingApproval === approval.id}
                          className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 bg-gray-200 text-gray-700 rounded-md text-xs font-bold hover:bg-gray-300 transition-colors disabled:opacity-50"
                        >
                          <XCircle className="w-3 h-3" />
                          Reject
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center flex-1 min-h-[200px]">
                    <UserCheck className="w-12 h-12 text-gray-300 mb-2" />
                    <p className="text-sm font-medium text-gray-500">No pending approvals</p>
                    <p className="text-xs text-gray-400 mt-1">All caught up!</p>
                  </div>
                )}
              </div>
              
              {pendingApprovals.length > 0 && (
                <a 
                  href="/admin/pending" 
                  className="block mt-3 text-center text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
                >
                  View All →
                </a>
              )}
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white rounded-xl p-5 shadow-sm border border-gray-100"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-gray-900">Recent Activity</h3>
                <Activity className="w-4 h-4 text-gray-400" />
              </div>

              <div className="space-y-2 max-h-[350px] overflow-y-auto">
                {activities.length > 0 ? (
                  activities.slice(0, 8).map((activity) => (
                    <div key={activity.id} className="flex items-start gap-2 pb-2 border-b border-gray-100 last:border-0">
                      <div className="w-7 h-7 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Activity className="w-3.5 h-3.5 text-emerald-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-900 leading-tight">{activity.action}</p>
                        <p className="text-xs text-gray-500">{activity.user_name}</p>
                        <div className="flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3 text-gray-400" />
                          <span className="text-[10px] text-gray-400">{activity.timestamp}</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-8">
                    <Activity className="w-12 h-12 text-gray-300 mb-2" />
                    <p className="text-sm font-medium text-gray-500">No recent activity</p>
                    <p className="text-xs text-gray-400 mt-1">Activity will appear here</p>
                  </div>
                )}
              </div>
              
              {activities.length > 0 && (
                <a 
                  href="/admin/logs" 
                  className="block mt-3 text-center text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
                >
                  View All Logs →
                </a>
              )}
            </motion.div>
          </div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          >
            <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              <a href="/admin/users" className="group p-4 rounded-lg border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
                    <Users className="w-5 h-5 text-emerald-600" />
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-emerald-600 transition-colors" />
                </div>
                <h4 className="text-sm font-semibold text-gray-900">Users</h4>
                <p className="text-xs text-gray-500 mt-0.5">Manage accounts</p>
              </a>
              <a href="/admin/midwives" className="group p-4 rounded-lg border border-gray-200 hover:border-teal-300 hover:bg-teal-50 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center group-hover:bg-teal-200 transition-colors">
                    <Stethoscope className="w-5 h-5 text-teal-600" />
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-teal-600 transition-colors" />
                </div>
                <h4 className="text-sm font-semibold text-gray-900">Midwives</h4>
                <p className="text-xs text-gray-500 mt-0.5">Staff management</p>
              </a>
              <a href="/admin/barangays" className="group p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                    <MapPin className="w-5 h-5 text-blue-600" />
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                </div>
                <h4 className="text-sm font-semibold text-gray-900">Barangays</h4>
                <p className="text-xs text-gray-500 mt-0.5">Locations</p>
              </a>
              <a href="/admin/reports" className="group p-4 rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                    <FileText className="w-5 h-5 text-purple-600" />
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-purple-600 transition-colors" />
                </div>
                <h4 className="text-sm font-semibold text-gray-900">Reports</h4>
                <p className="text-xs text-gray-500 mt-0.5">Analytics</p>
              </a>
              <a href="/admin/pending" className="group p-4 rounded-lg border border-gray-200 hover:border-amber-300 hover:bg-amber-50 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center group-hover:bg-amber-200 transition-colors">
                    <UserPlus className="w-5 h-5 text-amber-600" />
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-amber-600 transition-colors" />
                </div>
                <h4 className="text-sm font-semibold text-gray-900">Pending</h4>
                <p className="text-xs text-gray-500 mt-0.5">Approvals</p>
              </a>
              <a href="/admin/logs" className="group p-4 rounded-lg border border-gray-200 hover:border-orange-300 hover:bg-orange-50 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                    <Clock className="w-5 h-5 text-orange-600" />
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-orange-600 transition-colors" />
                </div>
                <h4 className="text-sm font-semibold text-gray-900">Audit Logs</h4>
                <p className="text-xs text-gray-500 mt-0.5">Activity</p>
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </AdminLayout>
  );
}
