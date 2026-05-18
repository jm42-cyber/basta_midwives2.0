import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Plus, Search, Edit2, Trash2, X,
  User, MapPin, Phone, Calendar, Activity, Heart, Stethoscope,
  AlertTriangle, Scale, TrendingUp, UserCheck, Loader2, Pill, Shield, ChevronLeft, ChevronRight,
  Download, FileSpreadsheet, FileText
} from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import CustomSelect from '@/components/CustomSelect';
import { seniorCitizenService } from '@/services/seniorCitizenService';
import { barangayService } from '@/services/barangayService';
import { SeniorCitizenRecord, Barangay } from '@/types';
import { toast } from 'react-toastify';
import { useAuthStore } from '@/store/authStore';

export default function SeniorCitizenDashboardPage() {
  const { user } = useAuthStore();
  const [records, setRecords] = useState<SeniorCitizenRecord[]>([]);
  const [barangays, setBarangays] = useState<Barangay[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create');
  const [selectedRecord, setSelectedRecord] = useState<SeniorCitizenRecord | null>(null);
  const [formData, setFormData] = useState<Partial<SeniorCitizenRecord>>({});
  const [submitting, setSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 20;
  const [currentStep, setCurrentStep] = useState(1);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportFilters, setExportFilters] = useState({
    search: '',
    start_date: '',
    end_date: '',
    barangay_id: ''
  });
  const [exportingFormat, setExportingFormat] = useState<'excel' | 'pdf' | null>(null);

  useEffect(() => {
    fetchRecords();
    fetchBarangays();
  }, []);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const { data } = await seniorCitizenService.getAll({ status: 'active' });
      setRecords(data.data);
    } catch (error) {
      console.error('Failed to fetch records:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBarangays = async () => {
    try {
      const { data } = await barangayService.getAll();
      setBarangays(data.data);
    } catch (error) {
      console.error('Failed to fetch barangays:', error);
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.first_name?.trim()) {
      errors.first_name = 'First name is required';
    }

    if (!formData.last_name?.trim()) {
      errors.last_name = 'Last name is required';
    }

    if (!formData.sex) {
      errors.sex = 'Sex is required';
    }

    if (!formData.barangay_id) {
      errors.barangay_id = 'Barangay is required';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    setSubmitting(true);
    try {
      if (modalMode === 'edit' && selectedRecord) {
        await seniorCitizenService.update(selectedRecord.id, formData);
        toast.success('Record updated successfully!');
      } else {
        await seniorCitizenService.create(formData);
        toast.success('Record created successfully!');
      }
      fetchRecords();
      closeModal();
    } catch (error: any) {
      console.error('Failed to save record:', error);
      const serverErrors = error.response?.data?.errors;
      if (serverErrors) {
        setValidationErrors(serverErrors);
        Object.values(serverErrors).flat().forEach((msg: any) => toast.error(msg));
      } else {
        toast.error(error.response?.data?.message || 'Failed to save record. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await seniorCitizenService.delete(id);
      toast.success('Record deleted successfully!');
      fetchRecords();
      setDeleteConfirmId(null);
    } catch (error: any) {
      console.error('Failed to delete record:', error);
      toast.error(error.response?.data?.message || 'Failed to delete record.');
    }
  };

  const openModal = (mode: 'create' | 'edit' | 'view', record?: SeniorCitizenRecord) => {
    setModalMode(mode);
    setSelectedRecord(record || null);
    setFormData(record || {});
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedRecord(null);
    setFormData({});
    setValidationErrors({});
    setCurrentStep(1);
  };

  const handleNextStep = () => {
    if (validateCurrentStep()) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBackStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const validateCurrentStep = () => {
    const errors: Record<string, string> = {};

    if (currentStep === 1) {
      // Step 1: Personal & Contact validation
      if (!formData.first_name?.trim()) {
        errors.first_name = 'First name is required';
      }
      if (!formData.last_name?.trim()) {
        errors.last_name = 'Last name is required';
      }
      if (!formData.sex) {
        errors.sex = 'Sex is required';
      }
      if (!formData.barangay_id) {
        errors.barangay_id = 'Barangay is required';
      }
    }

    setValidationErrors(errors);
    if (Object.keys(errors).length > 0) {
      toast.error('Please fill in all required fields');
      return false;
    }
    return true;
  };

  const filteredRecords = records.filter(record => {
    const fullName = `${record.first_name || ''} ${record.middle_name || ''} ${record.last_name || ''}`.trim();
    return fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.barangay?.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const paginatedRecords = filteredRecords.slice(startIndex, startIndex + recordsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getExportFilteredCount = () => {
    let filtered = records.filter(r => r.status === 'active');
    
    if (exportFilters.search) {
      const search = exportFilters.search.toLowerCase();
      filtered = filtered.filter(r => {
        const fullName = `${r.first_name || ''} ${r.middle_name || ''} ${r.last_name || ''}`.toLowerCase();
        return fullName.includes(search);
      });
    }
    
    if (exportFilters.barangay_id) {
      filtered = filtered.filter(r => String(r.barangay_id) === exportFilters.barangay_id);
    }
    
    return filtered.length;
  };

  const handleExport = async (format: 'excel' | 'pdf') => {
    try {
      setExportingFormat(format);
      const { data } = await seniorCitizenService.export(format, exportFilters);
      
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `senior_citizen_records_${new Date().toISOString().split('T')[0]}.${format === 'excel' ? 'xlsx' : 'pdf'}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success(`Records exported successfully as ${format.toUpperCase()}!`);
      setShowExportModal(false);
    } catch (error: any) {
      console.error('Export failed:', error);
      toast.error(error.response?.data?.message || 'Failed to export records');
    } finally {
      setExportingFormat(null);
    }
  };

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-16 h-16 shadow-lg bg-gradient-to-br from-emerald-500 via-green-600 to-teal-600 rounded-2xl">
              <Users className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-transparent bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text">Senior Citizen Records</h1>
              <p className="flex items-center gap-2 mt-1 text-gray-600">
                <Heart className="w-4 h-4" />
                Comprehensive elderly health management system
              </p>
            </div>
          </div>
          <button
            onClick={() => openModal('create')}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl hover:from-emerald-600 hover:to-green-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <Plus className="w-5 h-5" />
            Add New Record
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by name or barangay..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent shadow-sm"
              />
            </div>
            <button
              onClick={() => setShowExportModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl hover:from-emerald-600 hover:to-green-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Download className="w-5 h-5" />
              Export Records
            </button>
          </div>
        </div>

        <div className="overflow-hidden bg-white border border-gray-100 shadow-sm rounded-2xl">
          {loading ? (
            <div className="p-16 text-center">
              <div className="inline-flex items-center gap-3 text-gray-500">
                <Loader2 className="w-6 h-6 animate-spin" />
                Loading records...
              </div>
            </div>
          ) : filteredRecords.length === 0 ? (
            <div className="p-16 text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full">
                <Users className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-lg text-gray-500">No senior citizen records found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-700 uppercase">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Patient Information
                      </div>
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-700 uppercase">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Age
                      </div>
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-700 uppercase">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        Barangay
                      </div>
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-700 uppercase">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        Contact
                      </div>
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold tracking-wider text-right text-gray-700 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {paginatedRecords.map((record) => (
                    <tr key={record.id} className="transition-all duration-200 hover:bg-orange-50/30">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm ${
                            record.sex === 'Male' ? 'bg-blue-500' : 'bg-pink-500'
                          }`}>
                            {record.first_name?.charAt(0)}{record.last_name?.charAt(0)}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">
                              {`${record.first_name || ''} ${record.middle_name || ''} ${record.last_name || ''}`.trim()}
                            </div>
                            <div className="text-sm text-gray-600">{record.sex}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="text-sm font-medium text-gray-900">{record.age || 'N/A'} years</div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="text-sm font-medium text-gray-900">{record.barangay?.name}</div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="text-sm text-gray-900">{record.contact_no || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center justify-end gap-1">
                          <button 
                            onClick={() => openModal('edit', record)} 
                            className="p-2.5 text-emerald-600 hover:bg-emerald-100 rounded-xl transition-all duration-200"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => setDeleteConfirmId(record.id)} 
                            className="p-2.5 text-red-600 hover:bg-red-100 rounded-xl transition-all duration-200"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {!loading && paginatedRecords.length > 0 && totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            
            {[...Array(totalPages)].map((_, index) => {
              const pageNumber = index + 1;
              if (
                pageNumber === 1 ||
                pageNumber === totalPages ||
                (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
              ) {
                return (
                  <button
                    key={pageNumber}
                    onClick={() => handlePageChange(pageNumber)}
                    className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
                      currentPage === pageNumber
                        ? 'bg-emerald-600 text-white'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              } else if (
                pageNumber === currentPage - 2 ||
                pageNumber === currentPage + 2
              ) {
                return <span key={pageNumber} className="px-2 text-gray-500">...</span>;
              }
              return null;
            })}
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </motion.div>

      {/* Modal - Will be added in next step */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="senior-citizen-modal w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl"
            >
              <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-gray-200 bg-white/95 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {modalMode === 'create' ? 'New Senior Citizen Record' : modalMode === 'edit' ? 'Edit Record' : 'View Record'}
                    </h2>
                    <p className="text-sm text-gray-600">Complete senior citizen health information</p>
                  </div>
                </div>
                <button onClick={closeModal} className="p-2 text-gray-400 transition-colors rounded-lg hover:bg-gray-100 hover:text-gray-600">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Step Indicator - Only show in create/edit mode */}
              {modalMode !== 'view' && (
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                  <div className="flex items-center justify-center gap-4">
                    {/* Step 1 */}
                    <div className="flex flex-col items-center">
                      <div className={`rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold transition-all duration-200 ${
                        currentStep === 1 ? 'bg-orange-600 text-white' : currentStep > 1 ? 'bg-orange-600 text-white' : 'bg-gray-100 text-gray-400'
                      }`}>
                        1
                      </div>
                      <span className={`text-xs font-medium mt-1 transition-all duration-200 ${
                        currentStep === 1 ? 'text-orange-600' : currentStep > 1 ? 'text-orange-600' : 'text-gray-400'
                      }`}>
                        Personal & Contact
                      </span>
                    </div>

                    {/* Connector Line */}
                    <div className={`flex-1 h-0.5 transition-all duration-200 ${
                      currentStep > 1 ? 'bg-orange-500' : 'bg-gray-200'
                    }`} style={{ maxWidth: '80px' }} />

                    {/* Step 2 */}
                    <div className="flex flex-col items-center">
                      <div className={`rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold transition-all duration-200 ${
                        currentStep === 2 ? 'bg-orange-600 text-white' : currentStep > 2 ? 'bg-orange-600 text-white' : 'bg-gray-100 text-gray-400'
                      }`}>
                        2
                      </div>
                      <span className={`text-xs font-medium mt-1 transition-all duration-200 ${
                        currentStep === 2 ? 'text-orange-600' : currentStep > 2 ? 'text-orange-600' : 'text-gray-400'
                      }`}>
                        Vitals & Conditions
                      </span>
                    </div>

                    {/* Connector Line */}
                    <div className={`flex-1 h-0.5 transition-all duration-200 ${
                      currentStep > 2 ? 'bg-orange-500' : 'bg-gray-200'
                    }`} style={{ maxWidth: '80px' }} />

                    {/* Step 3 */}
                    <div className="flex flex-col items-center">
                      <div className={`rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold transition-all duration-200 ${
                        currentStep === 3 ? 'bg-orange-600 text-white' : currentStep > 3 ? 'bg-orange-600 text-white' : 'bg-gray-100 text-gray-400'
                      }`}>
                        3
                      </div>
                      <span className={`text-xs font-medium mt-1 transition-all duration-200 ${
                        currentStep === 3 ? 'text-orange-600' : currentStep > 3 ? 'text-orange-600' : 'text-gray-400'
                      }`}>
                        Meds & Screenings
                      </span>
                    </div>

                    {/* Connector Line */}
                    <div className={`flex-1 h-0.5 transition-all duration-200 ${
                      currentStep > 3 ? 'bg-orange-500' : 'bg-gray-200'
                    }`} style={{ maxWidth: '80px' }} />

                    {/* Step 4 */}
                    <div className="flex flex-col items-center">
                      <div className={`rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold transition-all duration-200 ${
                        currentStep === 4 ? 'bg-orange-600 text-white' : 'bg-gray-100 text-gray-400'
                      }`}>
                        4
                      </div>
                      <span className={`text-xs font-medium mt-1 transition-all duration-200 ${
                        currentStep === 4 ? 'text-orange-600' : 'text-gray-400'
                      }`}>
                        Social & Nutrition
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Step 1: Personal & Contact Information */}
                {(currentStep === 1 || modalMode === 'view') && (
                  <>
                {/* Personal Information */}
                <div className="p-6 border border-gray-200 rounded-xl bg-gradient-to-br from-blue-50/50 to-purple-50/50">
                  <div className="flex items-center gap-2 mb-4">
                    <User className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">First Name *</label>
                      <input
                        type="text"
                        value={formData.first_name || ''}
                        onChange={(e) => {
                          setFormData({ ...formData, first_name: e.target.value });
                          setValidationErrors({ ...validationErrors, first_name: '' });
                        }}
                        className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:border-transparent ${
                          validationErrors.first_name 
                            ? 'border-red-300 focus:ring-red-500' 
                            : 'border-gray-300 focus:ring-blue-500'
                        }`}
                        required
                        disabled={modalMode === 'view'}
                      />
                      {validationErrors.first_name && (
                        <motion.p 
                          initial={{ opacity: 0 }} 
                          animate={{ opacity: 1 }} 
                          className="text-red-600 text-xs mt-1 flex items-center gap-1"
                        >
                          <AlertTriangle className="w-3 h-3" /> {validationErrors.first_name}
                        </motion.p>
                      )}
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">Middle Name</label>
                      <input
                        type="text"
                        value={formData.middle_name || ''}
                        onChange={(e) => setFormData({ ...formData, middle_name: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={modalMode === 'view'}
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">Last Name *</label>
                      <input
                        type="text"
                        value={formData.last_name || ''}
                        onChange={(e) => {
                          setFormData({ ...formData, last_name: e.target.value });
                          setValidationErrors({ ...validationErrors, last_name: '' });
                        }}
                        className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:border-transparent ${
                          validationErrors.last_name 
                            ? 'border-red-300 focus:ring-red-500' 
                            : 'border-gray-300 focus:ring-blue-500'
                        }`}
                        required
                        disabled={modalMode === 'view'}
                      />
                      {validationErrors.last_name && (
                        <motion.p 
                          initial={{ opacity: 0 }} 
                          animate={{ opacity: 1 }} 
                          className="text-red-600 text-xs mt-1 flex items-center gap-1"
                        >
                          <AlertTriangle className="w-3 h-3" /> {validationErrors.last_name}
                        </motion.p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4 mt-4 md:grid-cols-3">
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">Sex *</label>
                      <CustomSelect
                        value={formData.sex || ''}
                        onChange={(value) => {
                          setFormData({ ...formData, sex: value as 'Male' | 'Female' });
                          setValidationErrors({ ...validationErrors, sex: '' });
                        }}
                        options={[
                          { value: '', label: 'Select Sex' },
                          { value: 'Male', label: 'Male' },
                          { value: 'Female', label: 'Female' },
                        ]}
                        placeholder="Select Sex"
                      />
                      {validationErrors.sex && (
                        <motion.p 
                          initial={{ opacity: 0 }} 
                          animate={{ opacity: 1 }} 
                          className="text-red-600 text-xs mt-1 flex items-center gap-1"
                        >
                          <AlertTriangle className="w-3 h-3" /> {validationErrors.sex}
                        </motion.p>
                      )}
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">Age</label>
                      <input
                        type="number"
                        value={formData.age || ''}
                        onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={modalMode === 'view'}
                        placeholder="e.g., 65"
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">Civil Status</label>
                      <CustomSelect
                        value={formData.civil_status || ''}
                        onChange={(value) => setFormData({ ...formData, civil_status: value })}
                        options={[
                          { value: '', label: 'Select Status' },
                          { value: 'Single', label: 'Single' },
                          { value: 'Married', label: 'Married' },
                          { value: 'Widowed', label: 'Widowed' },
                          { value: 'Separated', label: 'Separated' },
                        ]}
                        placeholder="Select Status"
                      />
                    </div>
                  </div>
                </div>

                {/* Contact & Location */}
                <div className="p-6 border border-gray-200 rounded-xl bg-gradient-to-br from-orange-50/50 to-amber-50/50">
                  <div className="flex items-center gap-2 mb-4">
                    <MapPin className="w-5 h-5 text-orange-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Contact & Location</h3>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">Address</label>
                      <input
                        type="text"
                        value={formData.address || ''}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        disabled={modalMode === 'view'}
                      />
                    </div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">Barangay *</label>
                        <CustomSelect
                          value={String(formData.barangay_id || '')}
                          onChange={(value) => {
                            setFormData({ ...formData, barangay_id: Number(value) });
                            setValidationErrors({ ...validationErrors, barangay_id: '' });
                          }}
                          options={[
                            { value: '', label: 'Select Barangay' },
                            ...(user?.barangays && user.barangays.length > 0 ? user.barangays : barangays).map((barangay) => ({
                              value: String(barangay.id),
                              label: barangay.name
                            }))
                          ]}
                          placeholder="Select Barangay"
                        />
                        {validationErrors.barangay_id && (
                          <motion.p 
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }} 
                            className="text-red-600 text-xs mt-1 flex items-center gap-1"
                          >
                            <AlertTriangle className="w-3 h-3" /> {validationErrors.barangay_id}
                          </motion.p>
                        )}
                      </div>
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">Contact Number</label>
                        <input
                          type="text"
                          value={formData.contact_no || ''}
                          onChange={(e) => setFormData({ ...formData, contact_no: e.target.value })}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          disabled={modalMode === 'view'}
                          placeholder="e.g., 09123456789"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">Educational Attainment</label>
                        <input
                          type="text"
                          value={formData.educational_attainment || ''}
                          onChange={(e) => setFormData({ ...formData, educational_attainment: e.target.value })}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          disabled={modalMode === 'view'}
                        />
                      </div>
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">Occupation</label>
                        <input
                          type="text"
                          value={formData.occupation || ''}
                          onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          disabled={modalMode === 'view'}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Navigation Buttons - Step 1 */}
                {modalMode !== 'view' && (
                  <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 font-medium shadow-lg transition-all"
                    >
                      Next
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
                </>
              )}

              {/* Step 2: Vitals & Chronic Conditions */}
              {(currentStep === 2 || modalMode === 'view') && (
                <>
                {/* Vital Signs */}
                <div className="p-6 border border-gray-200 rounded-xl bg-gradient-to-br from-cyan-50/50 to-sky-50/50">
                  <div className="flex items-center gap-2 mb-4">
                    <Activity className="w-5 h-5 text-cyan-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Vital Signs</h3>
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">Blood Pressure</label>
                      <input
                        type="text"
                        value={formData.blood_pressure || ''}
                        onChange={(e) => setFormData({ ...formData, blood_pressure: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                        disabled={modalMode === 'view'}
                        placeholder="e.g., 120/80"
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">Weight (kg)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.weight || ''}
                        onChange={(e) => setFormData({ ...formData, weight: Number(e.target.value) })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                        disabled={modalMode === 'view'}
                        placeholder="e.g., 65.5"
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">Height (cm)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.height || ''}
                        onChange={(e) => setFormData({ ...formData, height: Number(e.target.value) })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                        disabled={modalMode === 'view'}
                        placeholder="e.g., 160"
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">BMI</label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.bmi || ''}
                        onChange={(e) => setFormData({ ...formData, bmi: Number(e.target.value) })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                        disabled={modalMode === 'view'}
                        placeholder="Auto-calculated"
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">Temperature (°C)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={formData.temperature || ''}
                        onChange={(e) => setFormData({ ...formData, temperature: Number(e.target.value) })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                        disabled={modalMode === 'view'}
                        placeholder="e.g., 36.5"
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">Heart Rate (bpm)</label>
                      <input
                        type="number"
                        value={formData.heart_rate || ''}
                        onChange={(e) => setFormData({ ...formData, heart_rate: Number(e.target.value) })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                        disabled={modalMode === 'view'}
                        placeholder="e.g., 72"
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">Respiratory Rate</label>
                      <input
                        type="number"
                        value={formData.respiratory_rate || ''}
                        onChange={(e) => setFormData({ ...formData, respiratory_rate: Number(e.target.value) })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                        disabled={modalMode === 'view'}
                        placeholder="e.g., 18"
                      />
                    </div>
                  </div>
                </div>

                {/* Chronic Conditions */}
                <div className="p-6 border border-gray-200 rounded-xl bg-gradient-to-br from-red-50/50 to-rose-50/50">
                  <div className="flex items-center gap-2 mb-4">
                    <Heart className="w-5 h-5 text-red-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Chronic Conditions</h3>
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">Hypertension</label>
                      <CustomSelect
                        value={formData.has_hypertension || ''}
                        onChange={(value) => setFormData({ ...formData, has_hypertension: value as 'Yes' | 'No' })}
                        options={[
                          { value: '', label: 'Select' },
                          { value: 'Yes', label: 'Yes' },
                          { value: 'No', label: 'No' },
                        ]}
                        placeholder="Select"
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">Diabetes</label>
                      <CustomSelect
                        value={formData.has_diabetes || ''}
                        onChange={(value) => setFormData({ ...formData, has_diabetes: value as 'Yes' | 'No' })}
                        options={[
                          { value: '', label: 'Select' },
                          { value: 'Yes', label: 'Yes' },
                          { value: 'No', label: 'No' },
                        ]}
                        placeholder="Select"
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">Heart Disease</label>
                      <CustomSelect
                        value={formData.has_heart_disease || ''}
                        onChange={(value) => setFormData({ ...formData, has_heart_disease: value as 'Yes' | 'No' })}
                        options={[
                          { value: '', label: 'Select' },
                          { value: 'Yes', label: 'Yes' },
                          { value: 'No', label: 'No' },
                        ]}
                        placeholder="Select"
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">Kidney Disease</label>
                      <CustomSelect
                        value={formData.has_kidney_disease || ''}
                        onChange={(value) => setFormData({ ...formData, has_kidney_disease: value as 'Yes' | 'No' })}
                        options={[
                          { value: '', label: 'Select' },
                          { value: 'Yes', label: 'Yes' },
                          { value: 'No', label: 'No' },
                        ]}
                        placeholder="Select"
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">Arthritis</label>
                      <CustomSelect
                        value={formData.has_arthritis || ''}
                        onChange={(value) => setFormData({ ...formData, has_arthritis: value as 'Yes' | 'No' })}
                        options={[
                          { value: '', label: 'Select' },
                          { value: 'Yes', label: 'Yes' },
                          { value: 'No', label: 'No' },
                        ]}
                        placeholder="Select"
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">COPD/Asthma</label>
                      <CustomSelect
                        value={formData.has_copd_asthma || ''}
                        onChange={(value) => setFormData({ ...formData, has_copd_asthma: value as 'Yes' | 'No' })}
                        options={[
                          { value: '', label: 'Select' },
                          { value: 'Yes', label: 'Yes' },
                          { value: 'No', label: 'No' },
                        ]}
                        placeholder="Select"
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">Dementia</label>
                      <CustomSelect
                        value={formData.has_dementia || ''}
                        onChange={(value) => setFormData({ ...formData, has_dementia: value as 'Yes' | 'No' })}
                        options={[
                          { value: '', label: 'Select' },
                          { value: 'Yes', label: 'Yes' },
                          { value: 'No', label: 'No' },
                        ]}
                        placeholder="Select"
                      />
                    </div>
                  </div>
                </div>

                {/* Navigation Buttons - Step 2 */}
                {modalMode !== 'view' && (
                  <div className="flex justify-between gap-3 pt-6 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={handleBackStep}
                      className="flex items-center gap-2 px-6 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 font-medium transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 font-medium shadow-lg transition-all"
                    >
                      Next
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
                </>
              )}

              {/* Step 3: Medications & Screenings */}
              {(currentStep === 3 || modalMode === 'view') && (
                <>
                {/* Medications */}
                <div className="p-6 border border-gray-200 rounded-xl bg-gradient-to-br from-purple-50/50 to-violet-50/50">
                  <div className="flex items-center gap-2 mb-4">
                    <Pill className="w-5 h-5 text-purple-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Medications</h3>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">Maintenance Medications</label>
                      <textarea
                        value={formData.maintenance_medications || ''}
                        onChange={(e) => setFormData({ ...formData, maintenance_medications: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        rows={3}
                        disabled={modalMode === 'view'}
                        placeholder="List all maintenance medications"
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">Medication Allergies</label>
                      <textarea
                        value={formData.medication_allergies || ''}
                        onChange={(e) => setFormData({ ...formData, medication_allergies: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        rows={2}
                        disabled={modalMode === 'view'}
                        placeholder="List any medication allergies"
                      />
                    </div>
                  </div>
                </div>

                {/* Functional Assessment */}
                <div className="p-6 border border-gray-200 rounded-xl bg-gradient-to-br from-emerald-50/50 to-teal-50/50">
                  <div className="flex items-center gap-2 mb-4">
                    <UserCheck className="w-5 h-5 text-emerald-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Functional Assessment</h3>
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">Mobility Status</label>
                      <input
                        type="text"
                        value={formData.mobility_status || ''}
                        onChange={(e) => setFormData({ ...formData, mobility_status: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        disabled={modalMode === 'view'}
                        placeholder="e.g., Independent, Assisted"
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">ADL Score</label>
                      <input
                        type="text"
                        value={formData.adl_score || ''}
                        onChange={(e) => setFormData({ ...formData, adl_score: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        disabled={modalMode === 'view'}
                        placeholder="Activities of Daily Living score"
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">Fall History</label>
                      <CustomSelect
                        value={formData.fall_history || ''}
                        onChange={(value) => setFormData({ ...formData, fall_history: value as 'Yes' | 'No' })}
                        options={[
                          { value: '', label: 'Select' },
                          { value: 'Yes', label: 'Yes' },
                          { value: 'No', label: 'No' },
                        ]}
                        placeholder="Select"
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">Uses Assistive Device</label>
                      <input
                        type="text"
                        value={formData.uses_assistive_device || ''}
                        onChange={(e) => setFormData({ ...formData, uses_assistive_device: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        disabled={modalMode === 'view'}
                        placeholder="e.g., Cane, Walker, Wheelchair"
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">Memory Status</label>
                      <input
                        type="text"
                        value={formData.memory_status || ''}
                        onChange={(e) => setFormData({ ...formData, memory_status: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        disabled={modalMode === 'view'}
                        placeholder="e.g., Normal, Mild impairment"
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">Dementia Screening Result</label>
                      <input
                        type="text"
                        value={formData.dementia_screening_result || ''}
                        onChange={(e) => setFormData({ ...formData, dementia_screening_result: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        disabled={modalMode === 'view'}
                      />
                    </div>
                  </div>
                </div>

                {/* Health Screenings */}
                <div className="p-6 border border-gray-200 rounded-xl bg-gradient-to-br from-indigo-50/50 to-blue-50/50">
                  <div className="flex items-center gap-2 mb-4">
                    <Stethoscope className="w-5 h-5 text-indigo-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Health Screenings</h3>
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">Blood Sugar Level</label>
                      <input
                        type="text"
                        value={formData.blood_sugar_level || ''}
                        onChange={(e) => setFormData({ ...formData, blood_sugar_level: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        disabled={modalMode === 'view'}
                        placeholder="e.g., 110 mg/dL"
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">Cholesterol Level</label>
                      <input
                        type="text"
                        value={formData.cholesterol_level || ''}
                        onChange={(e) => setFormData({ ...formData, cholesterol_level: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        disabled={modalMode === 'view'}
                        placeholder="e.g., 180 mg/dL"
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">TB Screening</label>
                      <input
                        type="text"
                        value={formData.tb_screening || ''}
                        onChange={(e) => setFormData({ ...formData, tb_screening: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        disabled={modalMode === 'view'}
                        placeholder="e.g., Negative, Positive"
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">Cancer Screening</label>
                      <input
                        type="text"
                        value={formData.cancer_screening || ''}
                        onChange={(e) => setFormData({ ...formData, cancer_screening: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        disabled={modalMode === 'view'}
                        placeholder="Type and result"
                      />
                    </div>
                  </div>
                </div>

                {/* Navigation Buttons - Step 3 */}
                {modalMode !== 'view' && (
                  <div className="flex justify-between gap-3 pt-6 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={handleBackStep}
                      className="flex items-center gap-2 px-6 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 font-medium transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 font-medium shadow-lg transition-all"
                    >
                      Next
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
                </>
              )}

              {/* Step 4: Social Support & Nutrition */}
              {(currentStep === 4 || modalMode === 'view') && (
                <>
                {/* Social Support */}
                <div className="p-6 border border-gray-200 rounded-xl bg-gradient-to-br from-pink-50/50 to-rose-50/50">
                  <div className="flex items-center gap-2 mb-4">
                    <Users className="w-5 h-5 text-pink-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Social Support</h3>
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">Living Arrangement</label>
                      <input
                        type="text"
                        value={formData.living_arrangement || ''}
                        onChange={(e) => setFormData({ ...formData, living_arrangement: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        disabled={modalMode === 'view'}
                        placeholder="e.g., Lives alone, With family"
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">Primary Caregiver</label>
                      <input
                        type="text"
                        value={formData.primary_caregiver || ''}
                        onChange={(e) => setFormData({ ...formData, primary_caregiver: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        disabled={modalMode === 'view'}
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">Emergency Contact</label>
                      <input
                        type="text"
                        value={formData.emergency_contact || ''}
                        onChange={(e) => setFormData({ ...formData, emergency_contact: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        disabled={modalMode === 'view'}
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">Emergency Contact Number</label>
                      <input
                        type="text"
                        value={formData.emergency_contact_number || ''}
                        onChange={(e) => setFormData({ ...formData, emergency_contact_number: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        disabled={modalMode === 'view'}
                        placeholder="e.g., 09123456789"
                      />
                    </div>
                  </div>
                </div>

                {/* Nutrition & Dental */}
                <div className="p-6 border border-gray-200 rounded-xl bg-gradient-to-br from-yellow-50/50 to-amber-50/50">
                  <div className="flex items-center gap-2 mb-4">
                    <Scale className="w-5 h-5 text-yellow-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Nutrition & Dental Health</h3>
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">Nutritional Status</label>
                      <input
                        type="text"
                        value={formData.nutritional_status || ''}
                        onChange={(e) => setFormData({ ...formData, nutritional_status: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        disabled={modalMode === 'view'}
                        placeholder="e.g., Normal, Malnourished"
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">Special Diet</label>
                      <CustomSelect
                        value={formData.special_diet || ''}
                        onChange={(value) => setFormData({ ...formData, special_diet: value as 'Yes' | 'No' })}
                        options={[
                          { value: '', label: 'Select' },
                          { value: 'Yes', label: 'Yes' },
                          { value: 'No', label: 'No' },
                        ]}
                        placeholder="Select"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block mb-2 text-sm font-medium text-gray-700">Special Diet Details</label>
                      <textarea
                        value={formData.special_diet_details || ''}
                        onChange={(e) => setFormData({ ...formData, special_diet_details: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        rows={2}
                        disabled={modalMode === 'view'}
                        placeholder="Describe special diet requirements"
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">Has Dentures</label>
                      <CustomSelect
                        value={formData.has_dentures || ''}
                        onChange={(value) => setFormData({ ...formData, has_dentures: value as 'Yes' | 'No' })}
                        options={[
                          { value: '', label: 'Select' },
                          { value: 'Yes', label: 'Yes' },
                          { value: 'No', label: 'No' },
                        ]}
                        placeholder="Select"
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">Last Dental Visit</label>
                      <input
                        type="date"
                        value={formData.last_dental_visit || ''}
                        onChange={(e) => setFormData({ ...formData, last_dental_visit: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        disabled={modalMode === 'view'}
                      />
                    </div>
                  </div>
                </div>

                {/* Visual Screening */}
                <div className="p-6 border border-gray-200 rounded-xl bg-gradient-to-br from-teal-50/50 to-cyan-50/50">
                  <div className="flex items-center gap-2 mb-4">
                    <Shield className="w-5 h-5 text-teal-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Visual Screening</h3>
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">Eye Complaints</label>
                      <input
                        type="text"
                        value={formData.eye_complaints || ''}
                        onChange={(e) => setFormData({ ...formData, eye_complaints: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        disabled={modalMode === 'view'}
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">Visual Acuity</label>
                      <input
                        type="text"
                        value={formData.visual_acuity || ''}
                        onChange={(e) => setFormData({ ...formData, visual_acuity: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        disabled={modalMode === 'view'}
                        placeholder="e.g., 20/20"
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">With Eye Problem</label>
                      <input
                        type="text"
                        value={formData.with_eye_problem || ''}
                        onChange={(e) => setFormData({ ...formData, with_eye_problem: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        disabled={modalMode === 'view'}
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">Pinhole Vision Result</label>
                      <input
                        type="text"
                        value={formData.pinhole_vision_result || ''}
                        onChange={(e) => setFormData({ ...formData, pinhole_vision_result: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        disabled={modalMode === 'view'}
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">Date Referred</label>
                      <input
                        type="date"
                        value={formData.date_referred || ''}
                        onChange={(e) => setFormData({ ...formData, date_referred: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        disabled={modalMode === 'view'}
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">Management</label>
                      <textarea
                        value={formData.management || ''}
                        onChange={(e) => setFormData({ ...formData, management: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        rows={2}
                        disabled={modalMode === 'view'}
                      />
                    </div>
                  </div>
                </div>

                {/* Immunization */}
                <div className="p-6 border border-gray-200 rounded-xl bg-gradient-to-br from-green-50/50 to-emerald-50/50">
                  <div className="flex items-center gap-2 mb-4">
                    <Shield className="w-5 h-5 text-green-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Immunization</h3>
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">PPV Immunization Date</label>
                      <input
                        type="date"
                        value={formData.ppv_immunization_date || ''}
                        onChange={(e) => setFormData({ ...formData, ppv_immunization_date: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        disabled={modalMode === 'view'}
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">Influenza Immunization Date</label>
                      <input
                        type="date"
                        value={formData.influenza_immunization_date || ''}
                        onChange={(e) => setFormData({ ...formData, influenza_immunization_date: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        disabled={modalMode === 'view'}
                      />
                    </div>
                  </div>
                </div>

                {/* Remarks */}
                <div className="p-6 border border-gray-200 rounded-xl bg-gradient-to-br from-gray-50/50 to-slate-50/50">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="w-5 h-5 text-gray-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Additional Notes</h3>
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">Remarks</label>
                    <textarea
                      value={formData.remarks || ''}
                      onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                      rows={4}
                      disabled={modalMode === 'view'}
                      placeholder="Additional notes or observations"
                    />
                  </div>
                </div>

                {/* Navigation Buttons - Step 4 / View Mode */}
                {modalMode !== 'view' && (
                  <div className="flex justify-between gap-3 pt-6 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={handleBackStep}
                      className="flex items-center gap-2 px-6 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 font-medium transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex items-center justify-center gap-2 px-6 py-3 text-white transition-all duration-200 bg-gradient-to-r from-orange-600 to-orange-700 rounded-xl hover:from-orange-700 hover:to-orange-800 font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                      {submitting ? 'Saving...' : (modalMode === 'create' ? 'Create Record' : 'Update Record')}
                    </button>
                  </div>
                )}
                </>
              )}
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Export Modal */}
      <AnimatePresence>
        {showExportModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowExportModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center">
                    <Download className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Export Senior Citizen Records</h3>
                    <p className="text-sm text-gray-600">Choose format and apply filters</p>
                  </div>
                </div>
                <button onClick={() => setShowExportModal(false)} className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Filters */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                  <Search className="w-4 h-4" />
                  Filter Options (Optional)
                </div>

                {/* Search Patient */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Search Patient Name</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      value={exportFilters.search}
                      onChange={(e) => setExportFilters({ ...exportFilters, search: e.target.value })}
                      placeholder="Search by first name, middle name, or last name..."
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Filter specific patients by name</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                    <input
                      type="date"
                      value={exportFilters.start_date}
                      onChange={(e) => setExportFilters({ ...exportFilters, start_date: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                    <input
                      type="date"
                      value={exportFilters.end_date}
                      onChange={(e) => setExportFilters({ ...exportFilters, end_date: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Barangay</label>
                  <CustomSelect
                    value={exportFilters.barangay_id}
                    onChange={(value) => setExportFilters({ ...exportFilters, barangay_id: value })}
                    options={[
                      { value: '', label: 'All Barangays' },
                      ...(user?.barangays && user.barangays.length > 0 ? user.barangays : barangays).map((barangay) => ({
                        value: String(barangay.id),
                        label: barangay.name
                      }))
                    ]}
                    placeholder="Select Barangay"
                  />
                </div>
              </div>

              {/* Export Summary */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-6">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-emerald-900 mb-1">Export Summary</h4>
                    <div className="text-xs text-emerald-700 space-y-1">
                      <p>
                        <span className="font-medium">Records to Export:</span> {getExportFilteredCount()} patient{getExportFilteredCount() !== 1 ? 's' : ''}
                      </p>
                      {exportFilters.search && (
                        <p>
                          <span className="font-medium">Name Filter:</span> "{exportFilters.search}"
                        </p>
                      )}
                      {exportFilters.barangay_id && (
                        <p>
                          <span className="font-medium">Barangay:</span> {barangays.find(b => b.id === Number(exportFilters.barangay_id))?.name || 'Selected'}
                        </p>
                      )}
                      {exportFilters.start_date && exportFilters.end_date && (
                        <p>
                          <span className="font-medium">Date Range:</span> {exportFilters.start_date} to {exportFilters.end_date}
                        </p>
                      )}
                      {!exportFilters.barangay_id && !exportFilters.start_date && !exportFilters.end_date && !exportFilters.search && (
                        <p className="text-emerald-600">All active records will be exported</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Export Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleExport('excel')}
                  disabled={exportingFormat !== null}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {exportingFormat === 'excel' ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <FileSpreadsheet className="w-5 h-5" />
                  )}
                  {exportingFormat === 'excel' ? 'Exporting...' : 'Export Excel'}
                </button>
                <button
                  onClick={() => handleExport('pdf')}
                  disabled={exportingFormat !== null}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-xl font-semibold hover:from-red-700 hover:to-rose-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {exportingFormat === 'pdf' ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <FileText className="w-5 h-5" />
                  )}
                  {exportingFormat === 'pdf' ? 'Exporting...' : 'Export PDF'}
                </button>
              </div>

              <p className="text-xs text-gray-500 mt-4 text-center">
                Exports will include all active records matching your filters
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirmId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setDeleteConfirmId(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Delete Record</h3>
                  <p className="text-sm text-gray-600">This action cannot be undone</p>
                </div>
              </div>
              
              <p className="text-gray-700 mb-6">
                Are you sure you want to delete this senior citizen record? All associated data will be permanently removed.
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirmId)}
                  className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .senior-citizen-modal input:focus,
        .senior-citizen-modal select:focus,
        .senior-citizen-modal textarea:focus {
          outline: none !important;
        }
        
        .senior-citizen-modal input.border-red-300,
        .senior-citizen-modal select.border-red-300,
        .senior-citizen-modal textarea.border-red-300 {
          border-color: #fca5a5 !important;
          border-width: 2px !important;
        }
        
        .senior-citizen-modal input.border-red-300:focus,
        .senior-citizen-modal select.border-red-300:focus,
        .senior-citizen-modal textarea.border-red-300:focus {
          border-color: #ef4444 !important;
          box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1) !important;
        }
      `}</style>
    </DashboardLayout>
  );
}
