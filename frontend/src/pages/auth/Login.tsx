import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';
import { authService } from '@/services/authService';
import { toast } from 'react-toastify';
import { Activity, ArrowRight, AlertCircle, Shield, Users, Heart, TrendingUp, Award, CheckCircle, Zap, Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const [formData, setFormData] = useState(() => {
    // Load saved credentials from localStorage
    const saved = localStorage.getItem('rememberedCredentials');
    return saved ? JSON.parse(saved) : { username_or_email: '', password: '' };
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(() => {
    return localStorage.getItem('rememberedCredentials') !== null;
  });
  const [errors, setErrors] = useState<{ username_or_email?: string; password?: string }>({});
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);

  const validateForm = () => {
    const newErrors: { username_or_email?: string; password?: string } = {};
    
    if (!formData.username_or_email.trim()) {
      newErrors.username_or_email = 'Username or email is required';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);

    try {
      const response = await authService.login(formData);
      console.log('✅ Login response:', response);
      
      // Save credentials if remember me is checked
      if (rememberMe) {
        localStorage.setItem('rememberedCredentials', JSON.stringify(formData));
      } else {
        localStorage.removeItem('rememberedCredentials');
      }
      
      // Set user in store
      setUser(response.user);
      console.log('✅ User set in store');
      console.log('✅ Token in localStorage:', localStorage.getItem('token'));
      console.log('✅ User in localStorage:', localStorage.getItem('user'));
      
      toast.success('Welcome back!');
      
      console.log('✅ About to redirect to /dashboard');
      // Force navigation using window.location for guaranteed redirect
      window.location.href = '/dashboard';
    } catch (error: any) {
      console.error('❌ Login error:', error);
      toast.error(error.response?.data?.message || 'Invalid credentials');
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen scroll-smooth">
      {/* LEFT SIDE (FIXED) */}
      <div className="sticky top-0 flex items-center justify-center w-full h-screen p-8 bg-white lg:w-1/2">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Logo & Title */}
          <div className="mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-6 group">
              <div className="flex items-center justify-center w-12 h-12 transition-transform bg-gradient-to-br from-primary-600 to-primary-500 rounded-xl group-hover:scale-110">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">
                MediMoms
              </span>
            </Link>
            <h1 className="mb-2 text-4xl font-bold text-gray-900">
              Welcome Back
            </h1>
            <p className="text-gray-600">Sign in to continue to your dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username/Email Field */}
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                Username or Email
              </label>
              <input
                type="text"
                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all ${
                  errors.username_or_email
                    ? 'border-red-300 focus:border-red-500'
                    : 'border-gray-200 focus:border-primary-500'
                }`}
                placeholder="Enter username or email"
                autoComplete="username"
                value={formData.username_or_email}
                onChange={(e) => {
                  setFormData({ ...formData, username_or_email: e.target.value });
                  setErrors({ ...errors, username_or_email: undefined });
                }}
              />
              {errors.username_or_email && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-1 mt-2 text-sm text-red-600"
                >
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.username_or_email}</span>
                </motion.div>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className={`w-full px-4 py-3 pr-12 border-2 rounded-xl focus:outline-none transition-all ${
                    errors.password
                      ? 'border-red-300 focus:border-red-500'
                      : 'border-gray-200 focus:border-primary-500'
                  }`}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({ ...formData, password: e.target.value });
                    setErrors({ ...errors, password: undefined });
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute text-gray-500 transition-colors transform -translate-y-1/2 right-4 top-1/2 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-1 mt-2 text-sm text-red-600"
                >
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.password}</span>
                </motion.div>
              )}
            </div>

            {/* Forgot Password Link */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 border-2 border-gray-300 rounded text-primary-600 focus:ring-2 focus:ring-primary-500"
                />
                <span className="text-sm font-medium text-gray-700">Remember me</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-sm font-semibold transition-colors text-primary-600 hover:text-primary-700"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary-600 to-primary-500 text-white py-3.5 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white rounded-full border-t-transparent animate-spin" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Register Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="font-semibold transition-colors text-primary-600 hover:text-primary-700">
                Create account
              </Link>
            </p>
          </div>

          {/* Back to Home */}
          <div className="mt-6 text-center">
            <Link to="/" className="text-sm text-gray-500 transition-colors hover:text-gray-700">
              ← Back to home
            </Link>
          </div>
        </motion.div>
      </div>

      {/* RIGHT SIDE (SCROLLABLE) */}
      <div className="hidden w-1/2 h-screen overflow-y-auto lg:block bg-gradient-to-br from-primary-50 via-emerald-50 to-teal-50">
        <div className="min-h-[150vh] flex flex-col items-center justify-center p-10 gap-8">
          {/* Decorative Elements */}
          <div className="absolute inset-0 pointer-events-none opacity-30">
            <div className="absolute rounded-full top-20 right-20 w-72 h-72 bg-primary-200 blur-3xl" />
            <div className="absolute rounded-full bottom-20 left-20 w-96 h-96 bg-emerald-200 blur-3xl" />
          </div>

          <div className="relative z-10 w-full max-w-xl space-y-8">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 border rounded-full bg-white/60 backdrop-blur-sm border-primary-200">
                <div className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
                <span className="text-sm font-semibold text-primary-700">Secure Access Portal</span>
              </div>
              <h2 className="mb-4 text-5xl font-bold leading-tight text-gray-900">
                Your Patient<br />
                <span className="text-primary-600">Awaits</span>
              </h2>
              <p className="text-lg leading-relaxed text-gray-700">
                Access your personalized dashboard to manage patient records, track health programs, and generate reports instantly.
              </p>
            </motion.div>

            {/* Modern Hero Image */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="relative group"
            >
              {/* Glow effect */}
              <div className="absolute transition-all duration-500 -inset-4 bg-gradient-to-r from-primary-400 via-emerald-400 to-teal-400 rounded-3xl blur-2xl opacity-20 group-hover:opacity-40" />
              
              {/* Image container with modern frame */}
              <div className="relative p-3 overflow-hidden bg-white border shadow-2xl rounded-3xl border-primary-100">
                {/* Shimmer effect */}
                <div className="absolute inset-0 transition-transform duration-1000 -translate-x-full bg-gradient-to-r from-transparent via-white/50 to-transparent group-hover:translate-x-full" />
                
                <div className="relative overflow-hidden rounded-2xl">
                  <img
                    src="/images/midwife-hero.jpg"
                    alt="Healthcare Professional"
                    className="object-cover w-full transition-transform duration-700 transform h-80 group-hover:scale-105"
                    onError={(e) => {
                      const target = e.currentTarget;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = '<div class="w-full h-80 bg-gradient-to-br from-primary-100 via-emerald-100 to-teal-100 rounded-2xl flex items-center justify-center"><div class="text-center p-8"><div class="w-20 h-20 bg-primary-500 rounded-2xl flex items-center justify-center mx-auto mb-4"><svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg></div><p class="text-xl font-bold text-gray-900">Healthcare Excellence</p><p class="text-gray-600 mt-2">Trusted by professionals</p></div></div>';
                      }
                    }}
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-primary-900/30 via-transparent to-transparent" />
                  
                  {/* Floating badge */}
                  <div className="absolute p-4 shadow-lg bottom-4 left-4 right-4 bg-white/90 backdrop-blur-xl rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary-500 to-emerald-500 rounded-xl">
                        <Shield className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-gray-900">DOH Certified</div>
                        <div className="text-xs text-gray-600">Secure & Compliant Platform</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Stats Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-2 gap-4"
            >
              <div className="p-6 transition-all bg-white border shadow-lg rounded-2xl border-primary-100 hover:shadow-xl">
                <div className="flex items-center justify-center w-12 h-12 mb-4 bg-primary-100 rounded-xl">
                  <Users className="w-6 h-6 text-primary-600" />
                </div>
                <div className="mb-1 text-3xl font-bold text-gray-900">26</div>
                <div className="text-sm font-medium text-gray-600">Barangays Covered</div>
              </div>

              <div className="p-6 transition-all bg-white border shadow-lg rounded-2xl border-emerald-100 hover:shadow-xl">
                <div className="flex items-center justify-center w-12 h-12 mb-4 bg-emerald-100 rounded-xl">
                  <Heart className="w-6 h-6 text-emerald-600" />
                </div>
                <div className="mb-1 text-3xl font-bold text-gray-900">4</div>
                <div className="text-sm font-medium text-gray-600">Health Programs</div>
              </div>
            </motion.div>

            {/* Features List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-4"
            >
              <h3 className="mb-4 text-xl font-bold text-gray-900">What's Inside Your Dashboard</h3>
              
              <div className="p-5 transition-all bg-white border shadow-md rounded-xl border-primary-100 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 rounded-lg bg-primary-100">
                    <Users className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <h4 className="mb-1 font-semibold text-gray-900">Patient Management</h4>
                    <p className="text-sm text-gray-600">Create, view, update, and track patient records</p>
                  </div>
                </div>
              </div>

              <div className="p-5 transition-all bg-white border shadow-md rounded-xl border-emerald-100 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 rounded-lg bg-emerald-100">
                    <TrendingUp className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="mb-1 font-semibold text-gray-900">Analytics & Reports</h4>
                    <p className="text-sm text-gray-600">Export data to Excel and PDF formats</p>
                  </div>
                </div>
              </div>

              <div className="p-5 transition-all bg-white border border-teal-100 shadow-md rounded-xl hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 bg-teal-100 rounded-lg">
                    <Shield className="w-5 h-5 text-teal-600" />
                  </div>
                  <div>
                    <h4 className="mb-1 font-semibold text-gray-900">Secure Access</h4>
                    <p className="text-sm text-gray-600">Role-based permissions and audit logs</p>
                  </div>
                </div>
              </div>

              <div className="p-5 transition-all bg-white border shadow-md rounded-xl border-primary-100 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 rounded-lg bg-primary-100">
                    <Heart className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <h4 className="mb-1 font-semibold text-gray-900">Multi-Program Support</h4>
                    <p className="text-sm text-gray-600">Manage all 4 health programs in one place</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Quick Access Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="p-6 text-white shadow-xl bg-gradient-to-br from-primary-500 to-emerald-500 rounded-2xl"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white/20">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="font-semibold">Quick Login Tips</div>
                  <div className="text-sm text-white/80">Access your account easily</div>
                </div>
              </div>
              <ul className="space-y-2 text-sm text-white/90">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Use your username or email to sign in</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Your session stays active for security</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Forgot password? Use the recovery link</span>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
