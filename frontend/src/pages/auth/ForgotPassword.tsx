import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, ArrowRight, Activity, AlertCircle, CheckCircle, ArrowLeft, Shield, Lock, Key, Clock, RefreshCw, HelpCircle } from 'lucide-react';
import api from '@/services/api';
import { toast } from 'react-toastify';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/forgot-password', { email });
      setLoading(false);
      setShowSuccessModal(true);
      toast.success(response.data.message);
    } catch (err: any) {
      setLoading(false);
      if (err.response?.data?.errors?.email) {
        setError(err.response.data.errors.email[0]);
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to send reset link. Please try again.');
      }
      toast.error('Failed to send reset link');
    }
  };

  return (
    <div className="h-screen flex scroll-smooth">
      {/* LEFT SIDE (FIXED) */}
      <div className="w-full lg:w-1/2 h-screen sticky top-0 flex items-center justify-center bg-white p-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Logo & Title */}
          <div className="mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-6 group">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-primary-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">
                MediMoms
              </span>
            </Link>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Reset Password
            </h1>
            <p className="text-gray-600">Enter your email to receive a reset link</p>
          </div>

          {/* Info Alert */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mb-6"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <HelpCircle className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-blue-900 mb-1">How it works</h3>
                <p className="text-xs text-blue-700 leading-relaxed">
                  Enter your registered email address and we'll send you a secure link to reset your password. The link expires in 24 hours.
                </p>
              </div>
            </div>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-all ${
                    error
                      ? 'border-red-300 focus:border-red-500'
                      : 'border-gray-200 focus:border-primary-500'
                  }`}
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                />
              </div>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-1 mt-2 text-red-600 text-sm"
                >
                  <AlertCircle className="w-4 h-4" />
                  <span>{error}</span>
                </motion.div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary-600 to-primary-500 text-white py-3.5 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Send Reset Link</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Help Section */}
          <div className="mt-6 p-4 bg-gray-50 rounded-xl">
            <p className="text-sm text-gray-700 text-center mb-1">
              <span className="font-semibold">Need help?</span>
            </p>
            <p className="text-xs text-gray-600 text-center">
              Contact your system administrator or Santa Cruz RHU
            </p>
          </div>

          {/* Back to Login */}
          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="text-sm text-gray-600 hover:text-primary-600 font-semibold transition-colors inline-flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to login
            </Link>
          </div>
        </motion.div>
      </div>

      {/* RIGHT SIDE (SCROLLABLE) */}
      <div className="hidden lg:block w-1/2 h-screen overflow-y-auto bg-gradient-to-br from-primary-50 via-emerald-50 to-teal-50">
        <div className="min-h-[150vh] flex flex-col items-center justify-center p-10 gap-8">
          {/* Decorative Elements */}
          <div className="absolute inset-0 opacity-30 pointer-events-none">
            <div className="absolute top-20 right-20 w-72 h-72 bg-primary-200 rounded-full blur-3xl" />
            <div className="absolute bottom-20 left-20 w-96 h-96 bg-emerald-200 rounded-full blur-3xl" />
          </div>

          <div className="relative z-10 max-w-xl w-full space-y-8">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full border border-primary-200 mb-6">
                <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" />
                <span className="text-sm font-semibold text-primary-700">Secure Password Recovery</span>
              </div>
              <h2 className="text-5xl font-bold text-gray-900 mb-4 leading-tight">
                Account<br />
                <span className="text-primary-600">Recovery</span>
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                Secure and simple password reset process to get you back to managing health records quickly.
              </p>
            </motion.div>

            {/* Modern Illustration */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="relative group"
            >
              {/* Glow effect */}
              <div className="absolute -inset-4 bg-gradient-to-r from-primary-400 via-emerald-400 to-teal-400 rounded-3xl blur-2xl opacity-20 group-hover:opacity-40 transition-all duration-500" />
              
              {/* Icon container with modern frame */}
              <div className="relative bg-white rounded-3xl p-8 shadow-2xl overflow-hidden border border-primary-100">
                {/* Shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                
                <div className="relative flex items-center justify-center h-80">
                  <div className="relative">
                    {/* Background circles */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-64 h-64 bg-gradient-to-br from-primary-100 to-emerald-100 rounded-full opacity-50" />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-48 h-48 bg-gradient-to-br from-primary-200 to-emerald-200 rounded-full opacity-50" />
                    </div>
                    
                    {/* Main icon */}
                    <div className="relative w-32 h-32 bg-gradient-to-br from-primary-500 to-emerald-500 rounded-3xl flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-500">
                      <Key className="w-16 h-16 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Process Steps */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-4"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">Password Reset Process</h3>
              
              <div className="bg-white rounded-xl p-5 shadow-md border border-primary-100 hover:shadow-lg transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">1. Enter Your Email</h4>
                    <p className="text-sm text-gray-600">Provide the email linked to your account</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-5 shadow-md border border-emerald-100 hover:shadow-lg transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <RefreshCw className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">2. Check Your Inbox</h4>
                    <p className="text-sm text-gray-600">Receive a secure reset link via email</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-5 shadow-md border border-teal-100 hover:shadow-lg transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Lock className="w-5 h-5 text-teal-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">3. Create New Password</h4>
                    <p className="text-sm text-gray-600">Set a strong, secure password</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-5 shadow-md border border-primary-100 hover:shadow-lg transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">4. Access Restored</h4>
                    <p className="text-sm text-gray-600">Login with your new credentials</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Security Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-primary-100"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Important Information</h3>
                </div>
              </div>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-primary-600 mt-0.5 flex-shrink-0" />
                  <span>Reset link expires in 24 hours</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-primary-600 mt-0.5 flex-shrink-0" />
                  <span>Check spam folder if email doesn't arrive</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-primary-600 mt-0.5 flex-shrink-0" />
                  <span>Only registered emails can request resets</span>
                </li>
              </ul>
            </motion.div>

            {/* Security Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-gradient-to-br from-primary-500 to-emerald-500 rounded-2xl p-6 text-white shadow-xl"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="font-semibold">Secure & Protected</div>
                  <div className="text-sm text-white/80">Your account is safe</div>
                </div>
              </div>
              <p className="text-white/90 text-sm leading-relaxed">
                All password reset requests are encrypted and logged for security. Your account data remains protected throughout the recovery process.
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={() => setShowSuccessModal(false)}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <CheckCircle className="w-10 h-10 text-white" />
              </motion.div>
              <h2 className="text-3xl font-black text-gray-900 mb-4">Check Your Email!</h2>
              <p className="text-gray-600 mb-2 leading-relaxed">
                We've sent a password reset link to:
              </p>
              <p className="text-primary-600 font-bold mb-6">{email}</p>
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                <p className="text-sm text-blue-800 mb-2">
                  <span className="font-semibold">Next Steps:</span>
                </p>
                <ul className="text-xs text-blue-700 space-y-1 text-left">
                  <li>1. Check your email inbox (and spam folder)</li>
                  <li>2. Click the password reset link</li>
                  <li>3. Create a new secure password</li>
                  <li>4. Sign in with your new password</li>
                </ul>
              </div>
              <p className="text-xs text-gray-500 mb-6">
                The link will expire in 60 minutes. If you don't receive the email within 5 minutes, 
                please check your spam folder or try again.
              </p>
              <div className="space-y-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowSuccessModal(false)}
                  className="w-full bg-gradient-to-r from-primary-600 to-primary-500 text-white py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
                >
                  Got it!
                </motion.button>
                <Link
                  to="/login"
                  className="block w-full text-center py-3 text-gray-600 hover:text-primary-600 font-medium transition-colors"
                >
                  Back to Login
                </Link>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
