import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, ArrowLeft, Pill, Calendar, Heart, Shield, CheckCircle } from 'lucide-react';

export default function FamilyPlanningPage() {
  const navigate = useNavigate();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-gradient-to-br from-purple-50 to-white"
    >
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </button>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center">
              <Users className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-black text-gray-900">Family Planning</h1>
              <p className="text-gray-600 mt-1">Modern FP methods and counseling for responsible parenthood</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Program Overview</h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Our Family Planning Program provides comprehensive reproductive health services and counseling 
              to help couples make informed decisions about family size and spacing. We offer various modern 
              and natural family planning methods.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              The program includes contraceptive provision, counseling services, follow-up care, and education 
              on responsible parenthood to promote healthy families across Santa Cruz, Laguna.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Key Features</h3>
            <div className="space-y-4">
              {[
                { icon: Pill, text: 'Multiple contraceptive options available' },
                { icon: Calendar, text: 'Regular follow-up and monitoring' },
                { icon: Heart, text: 'Personalized counseling services' },
                { icon: Shield, text: 'Safe and effective methods' }
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-5 h-5 text-purple-600" />
                  </div>
                  <p className="text-gray-700 pt-2">{item.text}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Methods Available */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-xl p-8 mb-12"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Family Planning Methods</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: 'Oral Pills', desc: 'Daily contraceptive pills', details: 'Highly effective when taken correctly' },
              { name: 'Injectable', desc: 'DMPA injection every 3 months', details: 'Long-acting contraceptive' },
              { name: 'IUD', desc: 'Intrauterine device', details: 'Long-term reversible contraception' },
              { name: 'Condoms', desc: 'Barrier method', details: 'Prevents pregnancy and STIs' },
              { name: 'Natural FP', desc: 'Fertility awareness methods', details: 'Calendar, BBT, cervical mucus' },
              { name: 'Implants', desc: 'Subdermal contraceptive implant', details: 'Up to 3 years protection' }
            ].map((method, i) => (
              <div key={i} className="border border-gray-200 rounded-xl p-5 hover:border-purple-500 transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-purple-600" />
                  <h4 className="font-bold text-gray-900">{method.name}</h4>
                </div>
                <p className="text-sm text-gray-600 mb-1">{method.desc}</p>
                <p className="text-xs text-purple-600 font-medium">{method.details}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-br from-purple-600 to-purple-500 rounded-2xl p-12 text-center text-white"
        >
          <h3 className="text-3xl font-bold mb-4">Ready to Get Started?</h3>
          <p className="text-purple-100 mb-6 text-lg">Join our family planning program for personalized reproductive health care</p>
          <button
            onClick={() => navigate('/register')}
            className="px-8 py-4 bg-white text-purple-600 rounded-xl font-bold hover:shadow-xl transition-all"
          >
            Register Now
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}
