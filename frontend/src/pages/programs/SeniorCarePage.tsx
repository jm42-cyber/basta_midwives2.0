import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Stethoscope, ArrowLeft, Eye, Syringe, Activity, Heart, CheckCircle } from 'lucide-react';

export default function SeniorCarePage() {
  const navigate = useNavigate();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-gradient-to-br from-orange-50 to-white"
    >
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-600 hover:text-orange-600 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </button>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center">
              <Stethoscope className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-black text-gray-900">Senior Citizen Care</h1>
              <p className="text-gray-600 mt-1">Visual screening and immunization programs for elderly care</p>
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
              Our Senior Citizen Care Program provides comprehensive health services specifically designed for 
              the elderly population. We focus on preventive care, early detection of health issues, and 
              maintaining quality of life for our senior citizens.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              The program includes visual acuity screening, immunization against common diseases, regular health 
              monitoring, and specialized care to ensure healthy aging for seniors across all 26 barangays.
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
                { icon: Eye, text: 'Visual acuity testing and screening' },
                { icon: Syringe, text: 'PPV and Influenza vaccinations' },
                { icon: Activity, text: 'Regular health monitoring and check-ups' },
                { icon: Heart, text: 'Chronic disease management support' }
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-5 h-5 text-orange-600" />
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
              { name: 'Visual Screening', desc: 'Eye health and vision testing', details: 'Snellen chart visual acuity test' },
              { name: 'PPV Vaccine', desc: 'Pneumococcal polysaccharide vaccine', details: 'Protection against pneumonia' },
              { name: 'Influenza Vaccine', desc: 'Annual flu vaccination', details: 'Seasonal influenza protection' },
              { name: 'Blood Pressure Monitoring', desc: 'Regular BP check-ups', details: 'Hypertension screening and management' },
              { name: 'Blood Sugar Testing', desc: 'Diabetes screening', details: 'Fasting blood sugar monitoring' },
              { name: 'Health Counseling', desc: 'Lifestyle and nutrition guidance', details: 'Healthy aging education' }
            ].map((service, i) => (
              <div key={i} className="border border-gray-200 rounded-xl p-5 hover:border-orange-500 transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-orange-600" />
                  <h4 className="font-bold text-gray-900">{service.name}</h4>
                </div>
                <p className="text-sm text-gray-600 mb-1">{service.desc}</p>
                <p className="text-xs text-orange-600 font-medium">{service.details}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-br from-orange-600 to-orange-500 rounded-2xl p-12 text-center text-white"
        >
          <h3 className="text-3xl font-bold mb-4">Ready to Get Started?</h3>
          <p className="text-orange-100 mb-6 text-lg">Join our senior care program for comprehensive elderly health services</p>
          <button
            onClick={() => navigate('/register')}
            className="px-8 py-4 bg-white text-orange-600 rounded-xl font-bold hover:shadow-xl transition-all"
          >
            Register Now
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}
