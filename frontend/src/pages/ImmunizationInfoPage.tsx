import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Baby, ArrowLeft, Syringe, Shield, Heart, Activity, CheckCircle } from 'lucide-react';

export default function ImmunizationInfoPage() {
  const navigate = useNavigate();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-gradient-to-br from-blue-50 to-white"
    >
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </button>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
              <Baby className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-black text-gray-900">Immunization Services</h1>
              <p className="text-gray-600 mt-1">Complete vaccine tracking for infants and children</p>
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
              Our Immunization Program provides comprehensive vaccine tracking and monitoring for infants and children 
              following the Department of Health (DOH) Expanded Program on Immunization (EPI) guidelines.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              We ensure complete vaccination coverage including BCG, DPT, OPV, Measles, Hepatitis B, and other essential 
              vaccines to protect children from preventable diseases. The program also includes nutritional monitoring 
              and vitamin A supplementation.
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
                { icon: Syringe, text: 'Complete vaccine tracking (BCG, DPT, OPV, Measles)' },
                { icon: Shield, text: 'DOH-compliant immunization records' },
                { icon: Heart, text: 'Nutritional status monitoring' },
                { icon: Activity, text: 'Vitamin A and deworming supplementation' }
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <p className="text-gray-700 pt-2">{item.text}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Vaccines Provided */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-xl p-8 mb-12"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Vaccines Provided</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { name: 'BCG Vaccine', desc: 'Protection against tuberculosis', details: 'Given at birth or as soon as possible' },
              { name: 'Hepatitis B', desc: 'Prevents Hepatitis B infection', details: 'Given at birth, 6 weeks, and 14 weeks' },
              { name: 'DPT (1, 2, 3)', desc: 'Diphtheria, Pertussis, Tetanus', details: 'Given at 6, 10, and 14 weeks' },
              { name: 'OPV (1, 2, 3)', desc: 'Oral Polio Vaccine', details: 'Given at 6, 10, and 14 weeks' },
              { name: 'Measles Vaccine', desc: 'Protection against measles', details: 'Given at 9 months' },
              { name: 'MMR Vaccine', desc: 'Measles, Mumps, Rubella', details: 'Given at 12 months' },
              { name: 'Rotavirus (1, 2)', desc: 'Prevents rotavirus infection', details: 'Given at 6 and 10 weeks' },
              { name: 'PCV (1, 2, 3)', desc: 'Pneumococcal Conjugate Vaccine', details: 'Given at 6, 10, and 14 weeks' }
            ].map((vaccine, i) => (
              <div key={i} className="border border-gray-200 rounded-xl p-5 hover:border-blue-500 transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                  <h4 className="font-bold text-gray-900">{vaccine.name}</h4>
                </div>
                <p className="text-sm text-gray-600 mb-1">{vaccine.desc}</p>
                <p className="text-xs text-blue-600 font-medium">{vaccine.details}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Additional Services */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl shadow-xl p-8 mb-12"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Additional Services</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: 'Vitamin A Supplementation', desc: 'Essential for growth and immune system' },
              { name: 'Deworming', desc: 'Prevents intestinal parasites' },
              { name: 'Nutritional Monitoring', desc: 'Weight, height, and growth tracking' }
            ].map((service, i) => (
              <div key={i} className="text-center p-6 border border-gray-200 rounded-xl hover:border-blue-500 transition-colors">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-bold text-gray-900 mb-2">{service.name}</h4>
                <p className="text-sm text-gray-600">{service.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-br from-blue-600 to-blue-500 rounded-2xl p-12 text-center text-white"
        >
          <h3 className="text-3xl font-bold mb-4">Ready to Get Started?</h3>
          <p className="text-blue-100 mb-6 text-lg">Protect your child with complete immunization coverage</p>
          <button
            onClick={() => navigate('/register')}
            className="px-8 py-4 bg-white text-blue-600 rounded-xl font-bold hover:shadow-xl transition-all"
          >
            Register Now
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}
