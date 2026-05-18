import { CheckCircle, Syringe } from 'lucide-react';
import { motion } from 'framer-motion';

interface VaccineInfo {
  name: string;
  description: string;
  schedule: string;
  color: string;
}

const vaccines: VaccineInfo[] = [
  { name: 'BCG', description: 'Tuberculosis protection', schedule: 'At birth', color: 'blue' },
  { name: 'Hepatitis B', description: 'Hepatitis B protection', schedule: 'Birth, 1.5, 6 months', color: 'green' },
  { name: 'DPT', description: 'Diphtheria, Pertussis, Tetanus', schedule: '1.5, 2.5, 3.5 months', color: 'purple' },
  { name: 'OPV', description: 'Oral Polio Vaccine', schedule: '1.5, 2.5, 3.5 months', color: 'pink' },
  { name: 'Measles', description: 'Measles, Mumps, Rubella', schedule: '9 months, 1 year', color: 'orange' },
  { name: 'PCV', description: 'Pneumococcal Conjugate', schedule: '1.5, 2.5, 3.5 months', color: 'indigo' },
];

export default function VaccineInfoCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className=\"bg-gradient-to-br from-blue-50 to-white rounded-xl shadow-sm p-6 border border-blue-100\"
    >
      <div className=\"flex items-center gap-3 mb-4\">\n        <div className=\"w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center\">\n          <Syringe className=\"w-5 h-5 text-blue-600\" />\n        </div>\n        <h3 className=\"text-lg font-bold text-gray-900\">Vaccine Schedule Reference</h3>\n      </div>\n      <div className=\"grid md:grid-cols-2 gap-3\">\n        {vaccines.map((vaccine, i) => (\n          <div key={i} className=\"bg-white rounded-lg p-3 border border-gray-200 hover:border-blue-300 transition-colors\">\n            <div className=\"flex items-start gap-2\">\n              <CheckCircle className={`w-4 h-4 text-${vaccine.color}-600 mt-0.5 flex-shrink-0`} />\n              <div className=\"flex-1 min-w-0\">\n                <h4 className=\"font-semibold text-gray-900 text-sm\">{vaccine.name}</h4>\n                <p className=\"text-xs text-gray-600 mb-1\">{vaccine.description}</p>\n                <p className=\"text-xs text-blue-600 font-medium\">{vaccine.schedule}</p>\n              </div>\n            </div>\n          </div>\n        ))}\n      </div>\n    </motion.div>\n  );\n}
