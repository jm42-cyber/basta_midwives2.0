import { motion } from 'framer-motion';
import { 
  HelpCircle, Book, MessageCircle, Mail, Phone, 
  ChevronDown, ChevronUp, Search
} from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

export default function HelpPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const faqs: FAQItem[] = [
    {
      category: 'Getting Started',
      question: 'How do I add a new patient record?',
      answer: 'Navigate to the specific program (Immunization, Family Planning, Maternal Care, or Senior Citizen) from the sidebar. Click the "Add New Record" button and fill in the required information. Make sure all mandatory fields marked with * are completed before saving.'
    },
    {
      category: 'Getting Started',
      question: 'How do I search for a patient?',
      answer: 'Use the search bar at the top of each program page. You can search by patient name, contact number, or barangay. The search is real-time and will filter results as you type.'
    },
    {
      category: 'Records Management',
      question: 'How do I edit a patient record?',
      answer: 'Find the patient record you want to edit, click the "Edit" button (pencil icon), make your changes, and click "Save Changes". All edits are logged in the system for audit purposes.'
    },
    {
      category: 'Records Management',
      question: 'How do I archive a record?',
      answer: 'Click the "Archive" button on any patient record. Archived records can be found in the Archive page and can be restored at any time if needed.'
    },
    {
      category: 'Records Management',
      question: 'Can I permanently delete a record?',
      answer: 'Yes, but only from the Archive page. Archived records have a "Delete Permanently" option. This action cannot be undone, so use it carefully.'
    },
    {
      category: 'Account Settings',
      question: 'How do I change my password?',
      answer: 'Go to Settings > Security tab. Enter your current password, then your new password twice. Your new password must be at least 8 characters long.'
    },
    {
      category: 'Account Settings',
      question: 'How do I request a barangay change?',
      answer: 'Go to Settings > Barangays tab. Select up to 3 barangays you want to be assigned to, provide a detailed reason (minimum 20 characters), and submit your request. An administrator will review and approve or reject your request.'
    },
    {
      category: 'Appointments',
      question: 'How do I create an appointment?',
      answer: 'Go to the Appointments page from the sidebar. Click "New Appointment", select the appointment type (Checkup, Home Visit, or Meeting), fill in the details, and save. You can view all your appointments in the calendar view.'
    },
    {
      category: 'Reports',
      question: 'How do I export records?',
      answer: 'On any program page, use the date filter to select your desired date range, then click the "Export" button. You can choose between Excel or PDF format. The export will include all filtered records.'
    },
    {
      category: 'Troubleshooting',
      question: 'What should I do if I encounter an error?',
      answer: 'First, try refreshing the page. If the error persists, check your internet connection. If the problem continues, contact the system administrator with details about what you were doing when the error occurred.'
    }
  ];

  const categories = Array.from(new Set(faqs.map(faq => faq.category)));

  const filteredFAQs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-16 h-16 shadow-lg bg-gradient-to-br from-primary-600 to-primary-500 rounded-2xl">
              <HelpCircle className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-transparent bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text">
                Help Center
              </h1>
              <p className="flex items-center gap-2 mt-1 text-gray-600">
                <Book className="w-4 h-4" />
                Find answers and get support
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Search Bar */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search for help..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* FAQ Sections */}
            {categories.map((category) => {
              const categoryFAQs = filteredFAQs.filter(faq => faq.category === category);
              if (categoryFAQs.length === 0) return null;

              return (
                <div key={category} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">{category}</h2>
                  <div className="space-y-3">
                    {categoryFAQs.map((faq, index) => {
                      const globalIndex = faqs.indexOf(faq);
                      const isOpen = openFAQ === globalIndex;

                      return (
                        <div key={globalIndex} className="border border-gray-200 rounded-xl overflow-hidden">
                          <button
                            onClick={() => setOpenFAQ(isOpen ? null : globalIndex)}
                            className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                          >
                            <span className="font-semibold text-gray-900">{faq.question}</span>
                            {isOpen ? (
                              <ChevronUp className="w-5 h-5 text-primary-600 flex-shrink-0" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                            )}
                          </button>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="px-4 pb-4 text-gray-600"
                            >
                              {faq.answer}
                            </motion.div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {filteredFAQs.length === 0 && (
              <div className="bg-white border border-gray-200 rounded-2xl p-12 shadow-sm text-center">
                <HelpCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No results found for "{searchTerm}"</p>
                <p className="text-sm text-gray-400 mt-2">Try different keywords or contact support</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Links */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Links</h3>
              <div className="space-y-3">
                <a
                  href="/documentation"
                  className="flex items-center gap-3 p-3 bg-primary-50 text-primary-700 rounded-xl hover:bg-primary-100 transition-colors"
                >
                  <Book className="w-5 h-5" />
                  <span className="font-medium">Documentation</span>
                </a>
                <a
                  href="/dashboard/settings"
                  className="flex items-center gap-3 p-3 bg-gray-50 text-gray-700 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <HelpCircle className="w-5 h-5" />
                  <span className="font-medium">Settings</span>
                </a>
              </div>
            </div>

            {/* Contact Support */}
            <div className="bg-gradient-to-br from-primary-600 to-primary-500 rounded-2xl p-6 shadow-lg text-white">
              <h3 className="text-lg font-bold mb-2">Need More Help?</h3>
              <p className="text-sm text-primary-100 mb-4">
                Our support team is here to assist you
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5" />
                  <div>
                    <p className="text-xs text-primary-100">Email</p>
                    <p className="text-sm font-semibold">support@medimoms.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5" />
                  <div>
                    <p className="text-xs text-primary-100">Phone</p>
                    <p className="text-sm font-semibold">(049) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MessageCircle className="w-5 h-5" />
                  <div>
                    <p className="text-xs text-primary-100">Hours</p>
                    <p className="text-sm font-semibold">Mon-Fri, 8AM-5PM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* System Info */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4">System Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Version</span>
                  <span className="font-semibold text-gray-900">2.0.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Updated</span>
                  <span className="font-semibold text-gray-900">Jan 2024</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status</span>
                  <span className="flex items-center gap-1 font-semibold text-primary-600">
                    <span className="w-2 h-2 bg-primary-600 rounded-full"></span>
                    Online
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
