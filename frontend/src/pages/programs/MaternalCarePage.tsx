import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ArrowLeft, Stethoscope, Calendar, Pill, Activity, CheckCircle } from 'lucide-react';

export default function MaternalCarePage() {
  const navigate = useNavigate();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-gradient-to-br from-pink-50 to-white"
    >
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-600 hover:text-pink-600 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </button>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-black text-gray-900">Maternal Care</h1>
              <p className="text-gray-600 mt-1">Prenatal monitoring for expecting mothers</p>
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
              Our Maternal Care Program provides comprehensive prenatal monitoring and support for expecting mothers 
              throughout their pregnancy journey. We ensure safe and healthy pregnancies through regular check-ups 
              and proper medical interventions.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              The program includes tetanus immunization, micronutrient supplementation, disease screening, and 
              continuous monitoring to protect both mother and baby across all stages of pregnancy.
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
                { icon: Stethoscope, text: 'Regular prenatal check-ups and monitoring' },
                { icon: Pill, text: 'Tetanus toxoid immunization (TT1, TT2)' },
                { icon: Activity, text: 'Iron and folic acid supplementation' },
                { icon: Calendar, text: 'Disease screening (Syphilis, Hepatitis B, HIV)' }
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-5 h-5 text-pink-600" />
                  </div>
                  <p className="text-gray-700 pt-2">{item.text}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Services Provided */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-xl p-8 mb-12"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Services Provided</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { name: 'Prenatal Check-ups', desc: 'Regular monitoring of mother and baby health', details: 'Blood pressure, weight, fetal heart rate' },
              { name: 'Tetanus Immunization', desc: 'Protection against tetanus infection', details: 'TT1 and TT2 doses during pregnancy' },
              { name: 'Micronutrient Supplements', desc: 'Iron and folic acid supplementation', details: 'Prevents anemia and birth defects' },
              { name: 'Disease Screening', desc: 'Early detection of infections', details: 'Syphilis, Hepatitis B, HIV testing' },
              { name: 'Nutritional Counseling', desc: 'Proper diet and nutrition guidance', details: 'Meal planning for healthy pregnancy' },
              { name: 'Birth Planning', desc: 'Preparation for safe delivery', details: 'Delivery location and emergency planning' }
            ].map((service, i) => (
              <div key={i} className="border border-gray-200 rounded-xl p-5 hover:border-pink-500 transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-pink-600" />
                  <h4 className="font-bold text-gray-900">{service.name}</h4>
                </div>
                <p className="text-sm text-gray-600 mb-1">{service.desc}</p>
                <p className="text-xs text-pink-600 font-medium">{service.details}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-br from-pink-600 to-pink-500 rounded-2xl p-12 text-center text-white"
        >
          <h3 className="text-3xl font-bold mb-4">Ready to Get Started?</h3>
          <p className="text-pink-100 mb-6 text-lg">Join our maternal care program for a safe and healthy pregnancy</p>
          <button
            onClick={() => navigate('/register')}
            className="px-8 py-4 bg-white text-pink-600 rounded-xl font-bold hover:shadow-xl transition-all"
          >
            Register Now
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}
