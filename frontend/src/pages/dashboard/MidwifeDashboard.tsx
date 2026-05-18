import { useAuthStore } from '@/store/authStore';
import DashboardLayout from '@/components/DashboardLayout';
import BarangayMap from '@/components/BarangayMap';
import Skeleton, { StatCardSkeleton, ChartSkeleton, ActivityItemSkeleton } from '@/components/Skeleton';
import { RecordsByCategoryChart, ProgramDistributionChart, MonthlyGrowthChart } from '@/components/DashboardCharts';
import { motion } from 'framer-motion';
import { 
  Baby, 
  Heart, 
  Users, 
  Stethoscope, 
  TrendingUp, 
  Calendar, 
  MapPin, 
  Activity,
  Plus,
  Clock,
  Bell,
  Download,
  Filter,
  Map as MapIcon
} from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDashboardStats, useRecentActivities, useTodayAppointments, useMonthlyTrend } from '@/hooks/useDashboard';

export default function MidwifeDashboard() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState('');
  const [currentTime, setCurrentTime] = useState('');

  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: recentActivities = [] } = useRecentActivities();
  const { data: todayAppointments = [] } = useTodayAppointments();
  const { data: monthlyTrendData = [] } = useMonthlyTrend();

  const loading = statsLoading;

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const dateOptions: Intl.DateTimeFormatOptions = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      };
      const timeOptions: Intl.DateTimeFormatOptions = {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      };
      setCurrentDate(now.toLocaleDateString('en-US', dateOptions));
      setCurrentTime(now.toLocaleTimeString('en-US', timeOptions));
    };
    
    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const chartData = useMemo(() => ({
    immunization: stats?.immunization_count || 0,
    maternalCare: stats?.maternal_care_count || 0,
    familyPlanning: stats?.family_planning_count || 0,
    seniorCitizen: stats?.senior_citizen_count || 0,
  }), [stats]);

  const statCards = [
    { 
      icon: Baby, 
      label: 'Immunization Records', 
      value: stats?.immunization_count || 0,
      gradient: 'from-emerald-500 to-teal-600',
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-600'
    },
    { 
      icon: Heart, 
      label: 'Maternal Care', 
      value: stats?.maternal_care_count || 0,
      gradient: 'from-pink-500 to-rose-600',
      iconBg: 'bg-pink-50',
      iconColor: 'text-pink-600'
    },
    { 
      icon: Users, 
      label: 'Family Planning', 
      value: stats?.family_planning_count || 0,
      gradient: 'from-blue-500 to-indigo-600',
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    { 
      icon: Stethoscope, 
      label: 'Senior Citizens', 
      value: stats?.senior_citizen_count || 0,
      gradient: 'from-purple-500 to-violet-600',
      iconBg: 'bg-purple-50',
      iconColor: 'text-purple-600'
    },
  ];

  const quickActions = [
    { icon: Baby, label: 'New Immunization', path: '/dashboard/immunization/add', gradient: 'from-emerald-500 to-teal-600', shadow: 'shadow-emerald-500/30' },
    { icon: Heart, label: 'Maternal Record', path: '/dashboard/maternal-care/add', gradient: 'from-pink-500 to-rose-600', shadow: 'shadow-pink-500/30' },
    { icon: Users, label: 'Family Planning', path: '/dashboard/family-planning/add', gradient: 'from-blue-500 to-indigo-600', shadow: 'shadow-blue-500/30' },
    { icon: Stethoscope, label: 'Senior Care', path: '/dashboard/senior-citizen/add', gradient: 'from-purple-500 to-violet-600', shadow: 'shadow-purple-500/30' },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'immunization': return Baby;
      case 'maternal_care': return Heart;
      case 'family_planning': return Users;
      case 'senior_citizen': return Stethoscope;
      default: return Activity;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'immunization': return { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200' };
      case 'maternal_care': return { bg: 'bg-pink-50', text: 'text-pink-600', border: 'border-pink-200' };
      case 'family_planning': return { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200' };
      case 'senior_citizen': return { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200' };
      default: return { bg: 'bg-gray-50', text: 'text-gray-600', border: 'border-gray-200' };
    }
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col h-full space-y-6 p-6">
          {/* Header Skeleton */}
          <div className="flex items-center gap-3">
            <Skeleton variant="circular" width={64} height={64} />
            <div className="flex-1">
              <Skeleton width={300} height={32} className="mb-2" />
              <Skeleton width={250} height={20} />
            </div>
          </div>

          {/* Stats Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </div>

          {/* Charts Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartSkeleton />
            <ChartSkeleton />
          </div>

          {/* Activity Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ChartSkeleton />
            </div>
            <div className="space-y-3">
              <ActivityItemSkeleton />
              <ActivityItemSkeleton />
              <ActivityItemSkeleton />
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col h-full space-y-6">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6"
        >
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/30">
                <Activity className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Welcome, {user?.first_name}!
                </h1>
                <p className="text-gray-600 font-medium">Healthcare Management Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-200">
                <Calendar className="w-4 h-4 text-primary-600" />
                <span className="font-semibold text-gray-700">{currentDate}</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-200">
                <Clock className="w-4 h-4 text-primary-600" />
                <span className="font-semibold text-gray-700">{currentTime}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="p-3 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md hover:border-primary-300 transition-all group">
              <Bell className="w-5 h-5 text-gray-600 group-hover:text-primary-600 transition-colors" />
            </button>
            <button className="flex items-center gap-2 px-4 py-3 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md hover:border-primary-300 transition-all">
              <Download className="w-5 h-5 text-gray-600" />
              <span className="font-semibold text-gray-700">Export</span>
            </button>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:border-primary-200 transition-all group overflow-hidden"
              >
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.gradient} opacity-5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500`} />
                
                <div className="relative">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 ${stat.iconBg} rounded-xl flex items-center justify-center`}>
                      <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                    </div>
                    <div className="flex items-center gap-1 px-2 py-1 bg-green-50 rounded-lg">
                      <TrendingUp className="w-3 h-3 text-green-600" />
                      <span className="text-xs font-bold text-green-600">Active</span>
                    </div>
                  </div>
                  
                  <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                  <div className="text-sm font-medium text-gray-600">{stat.label}</div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Charts Section */}
        {/* Row 1: Bar + Pie side by side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="h-full">
            <RecordsByCategoryChart data={chartData} />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="h-full">
            <ProgramDistributionChart barangays={stats?.barangay_stats || []} />
          </motion.div>
        </div>

        {/* Row 2: Monthly Growth full width */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="w-full">
          <MonthlyGrowthChart data={monthlyTrendData} />
        </motion.div>

        {/* Main Content Grid - Using flex-1 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
          {/* Left Column - Map & Quick Actions */}
          <div className="lg:col-span-2 flex flex-col gap-6 h-full">
            {/* Map Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col flex-1"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center">
                    <MapIcon className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Coverage Map</h2>
                    <p className="text-sm text-gray-600">Your assigned barangays</p>
                  </div>
                </div>
                <button className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                  <Filter className="w-4 h-4" />
                  Filter
                </button>
              </div>

              <div className="relative flex-1 min-h-[300px]">
                {user?.barangays && user.barangays.length > 0 ? (
                  <BarangayMap barangays={user.barangays} />
                ) : (
                  <div className="h-full bg-gradient-to-br from-primary-50 via-emerald-50 to-blue-50 rounded-xl overflow-hidden border-2 border-gray-200 flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="w-16 h-16 text-primary-400 mx-auto mb-4" />
                      <p className="text-gray-600 font-semibold">No Barangays Assigned</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Barangay Stats */}
              {user?.barangays && user.barangays.length > 0 && (
                <div className="grid grid-cols-3 gap-4 mt-4">
                  {user.barangays.slice(0, 3).map((barangay) => (
                    <div key={barangay.id} className="p-3 bg-gradient-to-br from-gray-50 to-primary-50 rounded-xl border border-gray-200">
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="w-4 h-4 text-primary-600" />
                        <span className="text-xs font-bold text-gray-900 truncate">{barangay.name}</span>
                      </div>
                      <div className="text-lg font-bold text-primary-600">{barangay.population || 0}</div>
                      <div className="text-xs text-gray-600">Population</div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center">
                  <Plus className="w-5 h-5 text-primary-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {quickActions.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <motion.button
                      key={action.label}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => navigate(action.path)}
                      className={`relative p-5 bg-gradient-to-br ${action.gradient} rounded-xl shadow-lg ${action.shadow} hover:shadow-xl transition-all group overflow-hidden`}
                    >
                      <div className="absolute inset-0 bg-white/20 translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
                      <div className="relative flex flex-col items-center gap-3 text-white">
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                          <Icon className="w-6 h-6" />
                        </div>
                        <span className="font-semibold text-sm">{action.label}</span>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </div>

          {/* Right Column - Activity & Appointments with flex-1 */}
          <div className="flex flex-col gap-6 h-full">
            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col flex-1"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center">
                    <Activity className="w-5 h-5 text-primary-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
                </div>
                <button className="text-sm font-semibold text-primary-600 hover:text-primary-700">
                  View All
                </button>
              </div>

              <div className={`flex-1 overflow-y-auto ${recentActivities.length === 0 ? 'flex items-center justify-center' : 'space-y-3'}`}>
                {recentActivities.length > 0 ? (
                  recentActivities.map((activity, index) => {
                    const Icon = getActivityIcon(activity.type);
                    const colors = getActivityColor(activity.type);

                    return (
                      <motion.div
                        key={activity.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7 + index * 0.1 }}
                        className={`p-4 rounded-xl border ${colors.border} ${colors.bg} hover:shadow-md transition-all cursor-pointer group`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-10 h-10 bg-white rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm`}>
                            <Icon className={`w-5 h-5 ${colors.text}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-gray-900 text-sm mb-1">{activity.title}</div>
                            <div className="text-xs text-gray-600 mb-1">{activity.patient_name}</div>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <MapPin className="w-3 h-3" />
                              {activity.barangay_name}
                            </div>
                          </div>
                          <div className="text-xs text-gray-500">{getTimeAgo(activity.created_at)}</div>
                        </div>
                      </motion.div>
                    );
                  })
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    <Activity className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p className="font-medium">No recent activity</p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Upcoming Schedule */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col flex-1"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Upcoming Schedule</h2>
                    <p className="text-xs text-gray-600">Next 7 days</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 bg-primary-100 text-primary-700 rounded-lg text-xs font-bold">
                  {todayAppointments.length}
                </span>
              </div>

              <div className={`flex-1 overflow-y-auto ${todayAppointments.length === 0 ? 'flex items-center justify-center' : 'space-y-2'}`}>
                {todayAppointments.length > 0 ? (
                  todayAppointments.map((appointment, index) => {
                    const appointmentDate = new Date(appointment.date);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    appointmentDate.setHours(0, 0, 0, 0);
                    const isToday = appointmentDate.getTime() === today.getTime();
                    const dayLabel = isToday ? 'Today' : appointmentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 + index * 0.1 }}
                        className={`flex items-start gap-2 pb-3 border-b border-gray-100 last:border-0 hover:bg-gray-50 rounded-lg p-2 transition-all cursor-pointer group`}
                      >
                        <div className={`w-14 h-14 rounded-lg flex flex-col items-center justify-center flex-shrink-0 ${
                          isToday 
                            ? 'bg-primary-100' 
                            : 'bg-gray-100'
                        }`}>
                          <span className={`text-xs font-bold ${
                            isToday ? 'text-primary-600' : 'text-gray-600'
                          }`}>{appointmentDate.toLocaleDateString('en-US', { month: 'short' })}</span>
                          <span className={`text-lg font-bold ${
                            isToday ? 'text-primary-600' : 'text-gray-900'
                          }`}>{appointmentDate.getDate()}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <p className="text-sm font-bold text-gray-900 leading-tight group-hover:text-primary-600 transition-colors">{appointment.patient}</p>
                            {isToday && (
                              <span className="px-2 py-0.5 bg-primary-100 text-primary-700 rounded text-[10px] font-bold flex-shrink-0">
                                TODAY
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-600 mb-1">{appointment.type}</p>
                          <div className="flex items-center gap-3 text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span className="font-medium">{appointment.time}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              <span className="truncate">{appointment.barangay}</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p className="font-medium">No upcoming appointments</p>
                    <p className="text-xs text-gray-400 mt-1">Next 7 days</p>
                  </div>
                )}
              </div>
              
              {todayAppointments.length > 0 && (
                <a 
                  href="/dashboard/appointments" 
                  className="block mt-3 text-center text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors"
                >
                  View All Appointments →
                </a>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
