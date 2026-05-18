import { useNavigate } from 'react-router-dom';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useEffect } from 'react';
import { 
  Shield, 
  Activity, 
  Users, 
  Heart, 
  Baby, 
  Stethoscope,
  Lock,
  FileText,
  Globe,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Zap,
  Database
} from 'lucide-react';

function AnimatedNumber({ value, suffix = '' }: { value: number; suffix?: string }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));

  useEffect(() => {
    const controls = animate(count, value, { duration: 3, delay: 0.5 });
    return controls.stop;
  }, [count, value]);

  return (
    <motion.div className="text-3xl font-black text-gray-900">
      <motion.span>{rounded}</motion.span>{suffix}
    </motion.div>
  );
}

export default function LandingPage() {
  const navigate = useNavigate();

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const scaleIn = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    transition: { duration: 0.5 }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-lg"
      >
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-400 rounded-xl">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-transparent bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text">
                MediMoms
              </span>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => navigate('/login')}
                className="px-4 py-2 font-medium text-gray-700 transition-colors hover:text-primary-600"
              >
                Sign In
              </button>
              <button
                onClick={() => navigate('/register')}
                className="px-6 py-2 font-medium text-white transition-all rounded-lg bg-gradient-to-r from-primary-600 to-primary-500 hover:shadow-lg hover:scale-105"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative px-4 pt-32 pb-20 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute rounded-full top-20 left-10 w-72 h-72 bg-primary-200 mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
          <div className="absolute bg-purple-200 rounded-full top-40 right-10 w-72 h-72 mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
          <div className="absolute bg-pink-200 rounded-full -bottom-8 left-1/2 w-72 h-72 mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />
        </div>

        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-primary-50"
              >
                <Sparkles className="w-4 h-4 text-primary-600" />
                <span className="text-sm font-semibold text-primary-600">Modern Healthcare Management</span>
              </motion.div>

              <h1 className="mb-6 text-5xl font-black leading-tight text-gray-900 md:text-6xl lg:text-7xl">
                Healthcare
                <br />
                <span className="text-transparent bg-gradient-to-r from-primary-600 via-primary-500 to-purple-600 bg-clip-text">
                  Reimagined
                </span>
              </h1>

              <p className="mb-8 text-xl leading-relaxed text-gray-600">
                Comprehensive health record management system for Santa Cruz, Laguna. 
                Empowering midwives with modern tools for better community healthcare.
              </p>

              <div className="flex flex-wrap gap-4 mb-12">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/login')}
                  className="flex items-center gap-2 px-8 py-4 text-lg font-bold text-white transition-all shadow-lg bg-gradient-to-r from-primary-600 to-primary-500 rounded-xl shadow-primary-500/50 hover:shadow-xl hover:shadow-primary-500/50"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                  className="px-8 py-4 text-lg font-bold text-gray-900 transition-all bg-white border-2 border-gray-200 rounded-xl hover:border-primary-600 hover:text-primary-600"
                >
                  Learn More
                </motion.button>
              </div>

              {/* Stats */}
              <motion.div 
                variants={staggerContainer}
                initial="initial"
                animate="animate"
                className="grid grid-cols-3 gap-8"
              >
                <motion.div variants={fadeInUp}>
                  <AnimatedNumber value={26} />
                  <div className="text-sm font-medium text-gray-600">Barangays</div>
                </motion.div>
                <motion.div variants={fadeInUp}>
                  <AnimatedNumber value={4} />
                  <div className="text-sm font-medium text-gray-600">Programs</div>
                </motion.div>
                <motion.div variants={fadeInUp}>
                  <AnimatedNumber value={100} suffix="%" />
                  <div className="text-sm font-medium text-gray-600">Coverage</div>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Hero Image/Illustration */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="relative w-full h-[500px] bg-gradient-to-br from-primary-100 to-purple-100 rounded-3xl overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    animate={{ 
                      rotate: 360,
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ 
                      rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                      scale: { duration: 2, repeat: Infinity }
                    }}
                    className="w-64 h-64 rounded-full bg-gradient-to-br from-primary-400 to-purple-400 opacity-20"
                  />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Activity className="w-32 h-32 text-primary-600" strokeWidth={1.5} />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-4 py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h2 className="mb-4 text-4xl font-black text-gray-900 md:text-5xl">
              Comprehensive Health Programs
            </h2>
            <p className="max-w-2xl mx-auto text-xl text-gray-600">
              Complete care solutions across all life stages with modern digital tools
            </p>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
          >
            {/* Immunization */}
            <motion.div
              variants={scaleIn}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="p-8 transition-all bg-white border border-gray-100 shadow-lg group rounded-2xl hover:shadow-2xl"
            >
              <div className="flex items-center justify-center mb-6 transition-transform w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl group-hover:scale-110">
                <Baby className="text-white w-7 h-7" />
              </div>
              <h3 className="mb-3 text-2xl font-bold text-gray-900">Immunization</h3>
              <p className="mb-4 leading-relaxed text-gray-600">
                Complete vaccine tracking for infants with DOH-compliant records
              </p>
              <ul className="space-y-2">
                {['BCG, DPT, OPV, Measles', 'Nutritional monitoring', 'Vitamin A tracking'].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Maternal Care */}
            <motion.div
              variants={scaleIn}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="p-8 transition-all bg-white border border-gray-100 shadow-lg group rounded-2xl hover:shadow-2xl"
            >
              <div className="flex items-center justify-center mb-6 transition-transform w-14 h-14 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl group-hover:scale-110">
                <Heart className="text-white w-7 h-7" />
              </div>
              <h3 className="mb-3 text-2xl font-bold text-gray-900">Maternal Care</h3>
              <p className="mb-4 leading-relaxed text-gray-600">
                Prenatal monitoring for expecting mothers throughout pregnancy
              </p>
              <ul className="space-y-2">
                {['Tetanus immunization', 'Micronutrient supplements', 'Disease screening'].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-pink-500 mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Family Planning */}
            <motion.div
              variants={scaleIn}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="p-8 transition-all bg-white border border-gray-100 shadow-lg group rounded-2xl hover:shadow-2xl"
            >
              <div className="flex items-center justify-center mb-6 transition-transform w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl group-hover:scale-110">
                <Users className="text-white w-7 h-7" />
              </div>
              <h3 className="mb-3 text-2xl font-bold text-gray-900">Family Planning</h3>
              <p className="mb-4 leading-relaxed text-gray-600">
                Modern FP methods and counseling for responsible parenthood
              </p>
              <ul className="space-y-2">
                {['Pills, Injectable, IUD', 'Natural family planning', 'Follow-up tracking'].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Senior Citizen */}
            <motion.div
              variants={scaleIn}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="p-8 transition-all bg-white border border-gray-100 shadow-lg group rounded-2xl hover:shadow-2xl"
            >
              <div className="flex items-center justify-center mb-6 transition-transform w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl group-hover:scale-110">
                <Stethoscope className="text-white w-7 h-7" />
              </div>
              <h3 className="mb-3 text-2xl font-bold text-gray-900">Senior Care</h3>
              <p className="mb-4 leading-relaxed text-gray-600">
                Visual screening and immunization programs for elderly care
              </p>
              <ul className="space-y-2">
                {['Visual acuity testing', 'PPV & Influenza vaccines', 'Health monitoring'].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="px-4 py-20 bg-white">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h2 className="mb-4 text-4xl font-black text-gray-900 md:text-5xl">
              Why Choose MediMoms?
            </h2>
            <p className="text-xl text-gray-600">
              Built with modern technology for maximum efficiency
            </p>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
          >
            {[
              { icon: Shield, title: 'Secure & Private', desc: 'Role-based access with audit logging', color: 'from-green-500 to-green-600' },
              { icon: FileText, title: 'Export Reports', desc: 'Excel & PDF formats ready', color: 'from-blue-500 to-blue-600' },
              { icon: Globe, title: 'Multi-Barangay', desc: 'Manage up to 3 barangays', color: 'from-purple-500 to-purple-600' },
              { icon: Zap, title: 'DOH Compliant', desc: 'Official forms & standards', color: 'from-orange-500 to-orange-600' }
            ].map((benefit, i) => (
              <motion.div
                key={i}
                variants={scaleIn}
                whileHover={{ scale: 1.05 }}
                className="p-8 text-center border border-gray-200 bg-gradient-to-br from-gray-50 to-white rounded-2xl"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${benefit.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                  <benefit.icon className="w-8 h-8 text-white" />
                </div>
                <h4 className="mb-2 text-xl font-bold text-gray-900">{benefit.title}</h4>
                <p className="text-gray-600">{benefit.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20 bg-gradient-to-br from-primary-600 to-primary-500">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="mb-6 text-4xl font-black text-white md:text-5xl">
            Ready to Transform Healthcare?
          </h2>
          <p className="mb-8 text-xl text-primary-100">
            Join Santa Cruz's modern health management system today
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/register')}
            className="inline-flex items-center gap-2 px-10 py-5 text-lg font-bold transition-all bg-white shadow-2xl text-primary-600 rounded-xl hover:shadow-3xl"
          >
            <span>Get Started Now</span>
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="px-4 py-16 text-white bg-gray-900">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 mb-12 md:grid-cols-2 lg:grid-cols-4">
            {/* About */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-400 rounded-xl">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold">MediMoms</span>
              </div>
              <p className="mb-4 leading-relaxed text-gray-400">
                Modern health record management system serving 26 barangays in Santa Cruz, Laguna. Empowering midwives with digital tools for better community healthcare.
              </p>
              <div className="flex items-center gap-2 text-gray-400">
                <Shield className="w-5 h-5 text-primary-400" />
                <span className="text-sm">DOH Compliant System</span>
              </div>
            </div>

            {/* Health Programs */}
            <div>
              <h3 className="mb-4 text-lg font-bold">Health Programs</h3>
              <ul className="space-y-3">
                <li>
                  <button onClick={() => navigate('/programs/immunization')} className="flex items-center gap-2 text-gray-400 transition-colors hover:text-primary-400">
                    <Baby className="w-4 h-4" />
                    <span>Immunization Services</span>
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate('/programs/maternal-care')} className="flex items-center gap-2 text-gray-400 transition-colors hover:text-primary-400">
                    <Heart className="w-4 h-4" />
                    <span>Maternal Care</span>
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate('/programs/family-planning')} className="flex items-center gap-2 text-gray-400 transition-colors hover:text-primary-400">
                    <Users className="w-4 h-4" />
                    <span>Family Planning</span>
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate('/programs/senior-care')} className="flex items-center gap-2 text-gray-400 transition-colors hover:text-primary-400">
                    <Stethoscope className="w-4 h-4" />
                    <span>Senior Citizen Care</span>
                  </button>
                </li>
              </ul>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="mb-4 text-lg font-bold">Quick Links</h3>
              <ul className="space-y-3">
                <li>
                  <button onClick={() => navigate('/login')} className="text-gray-400 transition-colors hover:text-primary-400">
                    Sign In
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate('/register')} className="text-gray-400 transition-colors hover:text-primary-400">
                    Register Account
                  </button>
                </li>
                <li>
                  <button onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })} className="text-gray-400 transition-colors hover:text-primary-400">
                    Features
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate('/documentation')} className="flex items-center gap-2 text-gray-400 transition-colors hover:text-primary-400">
                    <FileText className="w-4 h-4" />
                    <span>Documentation</span>
                  </button>
                </li>
              </ul>
            </div>

            {/* Contact & Info */}
            <div>
              <h3 className="mb-4 text-lg font-bold">Contact Information</h3>
              <ul className="space-y-3 text-gray-400">
                <li className="flex items-start gap-2">
                  <Globe className="w-5 h-5 text-primary-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-white">Santa Cruz RHU</div>
                    <div className="text-sm">Municipality of Santa Cruz</div>
                    <div className="text-sm">Laguna, Philippines</div>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <Database className="w-5 h-5 text-primary-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-sm">Serving 26 Barangays</div>
                    <div className="text-sm">Complete Health Coverage</div>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-gray-800">
            <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
              <div className="text-center md:text-left">
                <p className="text-gray-400">© 2026 Santa Cruz Rural Health Unit, Laguna. All rights reserved.</p>
                <p className="mt-1 text-sm text-gray-500">Developed for the Municipality of Santa Cruz | We Care For Your Healthcare</p>
              </div>
              <div className="flex items-center gap-6">
                <span className="text-sm text-gray-500">Created By LSPU-IT Students</span>
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-primary-400" />
                  <span className="text-sm text-gray-500">Secure & Private</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

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
