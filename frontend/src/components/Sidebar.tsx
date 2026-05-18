import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, 
  LayoutDashboard, 
  Calendar, 
  Users, 
  Baby, 
  Heart, 
  UserCheck, 
  Stethoscope, 
  Archive, 
  Bell, 
  Settings, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  HeartPulse
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useState, useEffect } from 'react';
import api from '@/services/api';

interface SidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

export default function Sidebar({ collapsed = false, onToggle }: SidebarProps) {
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const [isCollapsed, setIsCollapsed] = useState(collapsed);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [alertCount, setAlertCount] = useState(0);

  useEffect(() => {
    fetchAlertCount();
    // Refresh alert count every 60 seconds (reduced from 30s for better performance)
    const interval = setInterval(fetchAlertCount, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchAlertCount = async () => {
    try {
      const response = await api.get('/alerts/count', {
        timeout: 5000 // 5 second timeout to prevent hanging
      });
      setAlertCount(response.data.count || 0);
    } catch (error) {
      // Fail silently - don't show error to user for background polling
      console.error('Failed to fetch alert count:', error);
      // Keep previous count on error instead of resetting to 0
    }
  };

  const handleToggle = () => {
    setIsCollapsed(!isCollapsed);
    onToggle?.();
  };

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Calendar, label: 'Appointments', path: '/dashboard/appointments' },
    { icon: Users, label: 'All Patients', path: '/dashboard/patients' },
    { icon: Baby, label: 'Immunization', path: '/dashboard/immunization' },
    { icon: Heart, label: 'Family Planning', path: '/dashboard/family-planning' },
    { icon: HeartPulse, label: 'Maternal Care', path: '/dashboard/maternal-care' },
    { icon: Stethoscope, label: 'Senior Citizen', path: '/dashboard/senior-citizen' },
    { icon: Archive, label: 'Archived', path: '/dashboard/archive' },
    { icon: Bell, label: 'Alerts', path: '/dashboard/alerts' },
    { icon: Settings, label: 'Settings', path: '/dashboard/settings' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <motion.div
      initial={false}
      animate={{ width: isCollapsed ? 80 : 260 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="h-screen bg-white border-r border-gray-200 flex flex-col fixed left-0 top-0 z-50 shadow-lg"
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-200 flex items-center justify-between">
        {!isCollapsed && (
          <Link to="/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-500 rounded-xl flex items-center justify-center">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-lg font-bold text-gray-900">MediMoms</div>
              <div className="text-xs text-gray-500 font-semibold">Staff Hub</div>
            </div>
          </Link>
        )}
        {isCollapsed && (
          <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-500 rounded-xl flex items-center justify-center mx-auto">
            <Activity className="w-6 h-6 text-white" />
          </div>
        )}
      </div>

      {/* Toggle Button */}
      <button
        onClick={handleToggle}
        className="absolute -right-3 top-20 w-6 h-6 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center hover:bg-primary-50 hover:border-primary-500 transition-all z-10"
      >
        {isCollapsed ? (
          <ChevronRight className="w-3 h-3 text-gray-600" />
        ) : (
          <ChevronLeft className="w-3 h-3 text-gray-600" />
        )}
      </button>

      {/* User Info */}
      {!isCollapsed && user && (
        <div className="px-4 py-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-emerald-100 rounded-full flex items-center justify-center">
              <span className="text-primary-700 font-bold text-sm">
                {user.first_name?.[0]}{user.last_name?.[0]}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-gray-900 truncate">
                {user.full_name}
              </div>
              <div className="text-xs text-gray-500 capitalize">{user.role}</div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl font-semibold text-sm transition-all relative ${
                  active
                    ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-lg shadow-primary-500/30'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-primary-600'
                } ${isCollapsed ? 'justify-center' : ''}`}
                title={isCollapsed ? item.label : ''}
              >
                <Icon className={`${isCollapsed ? 'w-5 h-5' : 'w-5 h-5'} flex-shrink-0`} />
                {!isCollapsed && <span>{item.label}</span>}
                {item.label === 'Alerts' && alertCount > 0 && (
                  <span className="absolute top-1 right-1 flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-bold text-white bg-red-500 rounded-full">
                    {alertCount > 99 ? '99+' : alertCount}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Logout Button */}
      <div className="p-3 border-t border-gray-200">
        <button
          onClick={() => setShowLogoutModal(true)}
          className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl font-semibold text-sm text-red-600 hover:bg-red-50 transition-all ${
            isCollapsed ? 'justify-center' : ''
          }`}
          title={isCollapsed ? 'Logout' : ''}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {showLogoutModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowLogoutModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md p-6 bg-white shadow-2xl rounded-2xl"
            >
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-red-50">
                <LogOut className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-center text-gray-900">Confirm Logout</h3>
              <p className="mb-6 text-center text-gray-600">Are you sure you want to logout from your account?</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="flex-1 px-4 py-3 font-semibold text-gray-700 transition-all bg-gray-100 rounded-xl hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowLogoutModal(false);
                    logout();
                  }}
                  className="flex-1 px-4 py-3 font-semibold text-white transition-all bg-red-600 rounded-xl hover:bg-red-700"
                >
                  Logout
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
