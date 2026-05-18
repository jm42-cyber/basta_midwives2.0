import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Plus, Search, Edit2, Trash2, Eye, Archive, ArchiveRestore, X, ChevronLeft, ChevronRight,
  User, Heart, MapPin, Phone, Calendar, Activity, Pill, FileText,
  AlertTriangle, Shield, Stethoscope, Scale, TrendingUp, UserCheck, Loader2,
  Download, FileSpreadsheet, FileText as FilePdf, Filter, XCircle
} from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import CustomSelect from '@/components/CustomSelect';
import { familyPlanningService } from '@/services/familyPlanningService';
import { barangayService } from '@/services/barangayService';
import { FamilyPlanningRecord, Barangay } from '@/types';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import { useAuthStore } from '@/store/authStore';

export default function FamilyPlanningDashboardPage() {
  const { user } = useAuthStore();
  const [records, setRecords] = useState<FamilyPlanningRecord[]>([]);
  const [barangays, setBarangays] = useState<Barangay[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'archived'>('active');
  const [filterBarangay, setFilterBarangay] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create');
  const [selectedRecord, setSelectedRecord] = useState<FamilyPlanningRecord | null>(null);
  const [formData, setFormData] = useState<Partial<FamilyPlanningRecord>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportFilters, setExportFilters] = useState({
    start_date: '',
    end_date: '',
    barangay_id: '',
    search: ''
  });
  const [exportingFormat, setExportingFormat] = useState<'excel' | 'pdf' | null>(null);

  const getExportFilteredCount = () => {
    let filtered = records.filter(r => r.status === 'active');
    
    if (exportFilters.search) {
      const searchLower = exportFilters.search.toLowerCase();
      filtered = filtered.filter(record => {
        const fullName = `${record.first_name || ''} ${record.middle_name || ''} ${record.last_name || ''}`.toLowerCase();
        return fullName.includes(searchLower);
      });
    }
    
    if (exportFilters.barangay_id) {
      filtered = filtered.filter(r => r.barangay_id === Number(exportFilters.barangay_id));
    }
    
    return filtered.length;
  };

  useEffect(() => {
    fetchRecords();
    fetchBarangays();
  }, [filterStatus, filterBarangay, currentPage]);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const params: any = { page: currentPage };
      if (filterStatus !== 'all') params.status = filterStatus;
      if (filterBarangay) params.barangay_id = filterBarangay;
      const { data } = await familyPlanningService.getAll(params);
      setRecords(data.data);
      setTotalPages(data.last_page || 1);
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
        await familyPlanningService.update(selectedRecord.id, formData);
        toast.success('Record updated successfully!');
      } else {
        await familyPlanningService.create(formData);
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
      await familyPlanningService.delete(id);
      toast.success('Record deleted successfully!');
      fetchRecords();
      setDeleteConfirmId(null);
    } catch (error: any) {
      console.error('Failed to delete record:', error);
      toast.error(error.response?.data?.message || 'Failed to delete record.');
    }
  };

  const handleToggleStatus = async (id: number) => {
    try {
      await familyPlanningService.toggleStatus(id);
      toast.success('Status updated successfully!');
      fetchRecords();
    } catch (error: any) {
      console.error('Failed to toggle status:', error);
      toast.error(error.response?.data?.message || 'Failed to update status.');
    }
  };

  const openModal = (mode: 'create' | 'edit' | 'view', record?: FamilyPlanningRecord) => {
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
      // Step 1: Personal Info validation
      if (!formData.first_name?.trim()) {
        errors.first_name = 'First name is required';
      }
      if (!formData.last_name?.trim()) {
        errors.last_name = 'Last name is required';
      }
      if (!formData.sex) {
        errors.sex = 'Sex is required';
      }
    }

    if (currentStep === 4) {
      // Step 4: Contact & Location validation
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

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleExport = async (format: 'excel' | 'pdf') => {
    setExportingFormat(format);
    try {
      const params = new URLSearchParams();
      if (exportFilters.start_date) params.append('start_date', exportFilters.start_date);
      if (exportFilters.end_date) params.append('end_date', exportFilters.end_date);
      if (exportFilters.barangay_id) params.append('barangay_id', exportFilters.barangay_id);
      if (exportFilters.search) params.append('search', exportFilters.search);

      const endpoint = format === 'excel' 
        ? `/family-planning-records/export/excel?${params.toString()}`
        : `/family-planning-records/export/pdf?${params.toString()}`;

      const response = await familyPlanningService.export(endpoint);
      
      const blob = new Blob([response.data], {
        type: format === 'excel' 
          ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          : 'application/pdf'
      });
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `family_planning_records_${new Date().toISOString().split('T')[0]}.${format === 'excel' ? 'xlsx' : 'pdf'}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success(`Records exported successfully as ${format.toUpperCase()}!`);
      setShowExportModal(false);
      setExportFilters({ start_date: '', end_date: '', barangay_id: '', search: '' });
    } catch (error: any) {
      console.error('Export failed:', error);
      toast.error(error.response?.data?.message || 'Failed to export records.');
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
              <Heart className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-transparent bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text">Family Planning Records</h1>
              <p className="flex items-center gap-2 mt-1 text-gray-600">
                <Heart className="w-4 h-4" />
                Comprehensive reproductive health management system
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

        {/* Search Bar & Export */}
        <div className="mb-6 flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by name or barangay..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-sm"
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
              <p className="text-lg text-gray-500">No family planning records found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-700 uppercase">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Client Information
                      </div>
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-700 uppercase">
                      <div className="flex items-center gap-2">
                        <Pill className="w-4 h-4" />
                        FP Method
                      </div>
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-700 uppercase">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        Location
                      </div>
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-700 uppercase">
                      <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4" />
                        Status
                      </div>
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold tracking-wider text-right text-gray-700 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredRecords.map((record) => (
                    <tr key={record.id} className="transition-all duration-200 hover:bg-purple-50/30">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm ${
                            record.sex === 'Male' ? 'bg-blue-500' : 'bg-pink-500'
                          }`}>
                            {record.first_name?.charAt(0)}{record.last_name?.charAt(0)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 font-semibold text-gray-900">
                              {`${record.first_name || ''} ${record.middle_name || ''} ${record.last_name || ''}`.trim()}
                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                record.sex === 'Male' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'
                              }`}>
                                {record.sex}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 mt-1 text-sm text-gray-600">
                              <Calendar className="w-3 h-3" />
                              Age: {record.age || 'N/A'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="text-sm">
                          <div className="font-medium text-gray-900">{record.type_of_fp_method || 'Not specified'}</div>
                          {record.date_started && (
                            <div className="text-xs text-gray-500 mt-1">Started: {format(new Date(record.date_started), 'MMM dd, yyyy')}</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="text-sm">
                          <div className="flex items-center gap-1 font-medium text-gray-900">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            {record.barangay?.name}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${
                          record.status === 'active' 
                            ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' 
                            : 'bg-gray-100 text-gray-700 border border-gray-200'
                        }`}>
                          <div className={`w-2 h-2 rounded-full ${
                            record.status === 'active' ? 'bg-emerald-500' : 'bg-gray-400'
                          }`} />
                          {record.status === 'active' ? 'Active' : 'Archived'}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center justify-end gap-1">
                          <button 
                            onClick={() => openModal('view', record)} 
                            className="p-2.5 text-blue-600 hover:bg-blue-100 rounded-xl transition-all duration-200"
                            title="View"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => openModal('edit', record)} 
                            className="p-2.5 text-emerald-600 hover:bg-emerald-100 rounded-xl transition-all duration-200"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleToggleStatus(record.id)} 
                            className="p-2.5 text-orange-600 hover:bg-orange-100 rounded-xl transition-all duration-200"
                            title={record.status === 'active' ? 'Archive' : 'Restore'}
                          >
                            {record.status === 'active' ? <Archive className="w-4 h-4" /> : <ArchiveRestore className="w-4 h-4" />}
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
        {!loading && filteredRecords.length > 0 && totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
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
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </motion.div>

      {/* Modal */}
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
              className="family-planning-modal w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl"
            >
              <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-gray-200 bg-white/95 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {modalMode === 'create' ? 'New Family Planning Record' : modalMode === 'edit' ? 'Edit Record' : 'View Record'}
                    </h2>
                    <p className="text-sm text-gray-600">Complete client information and FP details</p>
                  </div>
                </div>
                <button onClick={closeModal} className="p-2 text-gray-400 transition-colors rounded-lg hover:bg-gray-100 hover:text-gray-600">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Step Indicator - Only show in create/edit mode */}
              {modalMode !== 'view' && (
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-center gap-4">
                    {/* Step 1 */}
                    <div className="flex flex-col items-center">
                      <div className={`rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold transition-all duration-200 ${
                        currentStep === 1 ? 'bg-purple-600 text-white' : currentStep > 1 ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-400'
                      }`}>
                        1
                      </div>
                      <span className={`text-xs font-medium mt-1 transition-all duration-200 ${
                        currentStep === 1 ? 'text-purple-600' : currentStep > 1 ? 'text-purple-600' : 'text-gray-400'
                      }`}>
                        Personal Info
                      </span>
                    </div>

                    {/* Connector Line */}
                    <div className={`flex-1 h-0.5 transition-all duration-200 ${
                      currentStep > 1 ? 'bg-purple-500' : 'bg-gray-200'
                    }`} style={{ maxWidth: '80px' }} />

                    {/* Step 2 */}
                    <div className="flex flex-col items-center">
                      <div className={`rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold transition-all duration-200 ${
                        currentStep === 2 ? 'bg-purple-600 text-white' : currentStep > 2 ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-400'
                      }`}>
                        2
                      </div>
                      <span className={`text-xs font-medium mt-1 transition-all duration-200 ${
                        currentStep === 2 ? 'text-purple-600' : currentStep > 2 ? 'text-purple-600' : 'text-gray-400'
                      }`}>
                        Partner & History
                      </span>
                    </div>

                    {/* Connector Line */}
                    <div className={`flex-1 h-0.5 transition-all duration-200 ${
                      currentStep > 2 ? 'bg-purple-500' : 'bg-gray-200'
                    }`} style={{ maxWidth: '80px' }} />

                    {/* Step 3 */}
                    <div className="flex flex-col items-center">
                      <div className={`rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold transition-all duration-200 ${
                        currentStep === 3 ? 'bg-purple-600 text-white' : currentStep > 3 ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-400'
                      }`}>
                        3
                      </div>
                      <span className={`text-xs font-medium mt-1 transition-all duration-200 ${
                        currentStep === 3 ? 'text-purple-600' : currentStep > 3 ? 'text-purple-600' : 'text-gray-400'
                      }`}>
                        Physical & Medical
                      </span>
                    </div>

                    {/* Connector Line */}
                    <div className={`flex-1 h-0.5 transition-all duration-200 ${
                      currentStep > 3 ? 'bg-purple-500' : 'bg-gray-200'
                    }`} style={{ maxWidth: '80px' }} />

                    {/* Step 4 */}
                    <div className="flex flex-col items-center">
                      <div className={`rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold transition-all duration-200 ${
                        currentStep === 4 ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-400'
                      }`}>
                        4
                      </div>
                      <span className={`text-xs font-medium mt-1 transition-all duration-200 ${
                        currentStep === 4 ? 'text-purple-600' : 'text-gray-400'
                      }`}>
                        FP Method & Supply
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Step 1: Personal Information */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div className="p-6 border border-gray-200 rounded-xl bg-gradient-to-br from-blue-50/50 to-purple-50/50">
                      <div className="flex items-center gap-2 mb-4">
                        <User className="w-5 h-5 text-purple-600" />
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
                                : 'border-gray-300 focus:ring-purple-500'
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
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                                : 'border-gray-300 focus:ring-purple-500'
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
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            disabled={modalMode === 'view'}
                            placeholder="e.g., 25"
                          />
                          <p className="mt-1 text-xs text-gray-500">Client's age in years</p>
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
                              { value: 'Live-in', label: 'Live-in' },
                            ]}
                            placeholder="Select Status"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Navigation Buttons */}
                    {modalMode !== 'view' && (
                      <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                        <button
                          type="button"
                          onClick={closeModal}
                          className="px-6 py-3 text-gray-700 transition-all duration-200 bg-gray-100 rounded-xl hover:bg-gray-200 font-medium"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={handleNextStep}
                          className="flex items-center gap-2 px-6 py-3 text-white transition-all duration-200 bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl hover:from-purple-700 hover:to-purple-800 font-medium shadow-lg"
                        >
                          Next
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Step 2: Partner & Reproductive History */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    {/* Partner Information */}
                    <div className="p-6 border border-gray-200 rounded-xl bg-gradient-to-br from-pink-50/50 to-rose-50/50">
                      <div className="flex items-center gap-2 mb-4">
                        <Heart className="w-5 h-5 text-pink-600" />
                        <h3 className="text-lg font-semibold text-gray-900">Partner Information</h3>
                      </div>
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                          <label className="block mb-2 text-sm font-medium text-gray-700">Partner's Name</label>
                          <input
                            type="text"
                            value={formData.partner_name || ''}
                            onChange={(e) => setFormData({ ...formData, partner_name: e.target.value })}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                            disabled={modalMode === 'view'}
                          />
                        </div>
                        <div>
                          <label className="block mb-2 text-sm font-medium text-gray-700">Partner's Age</label>
                          <input
                            type="number"
                            value={formData.partner_age || ''}
                            onChange={(e) => setFormData({ ...formData, partner_age: Number(e.target.value) })}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                            disabled={modalMode === 'view'}
                            placeholder="e.g., 28"
                          />
                        </div>
                        <div>
                          <label className="block mb-2 text-sm font-medium text-gray-700">Partner's Occupation</label>
                          <input
                            type="text"
                            value={formData.partner_occupation || ''}
                            onChange={(e) => setFormData({ ...formData, partner_occupation: e.target.value })}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                            disabled={modalMode === 'view'}
                          />
                        </div>
                        <div>
                          <label className="block mb-2 text-sm font-medium text-gray-700">Partner Consent</label>
                          <CustomSelect
                            value={formData.partner_consent || ''}
                            onChange={(value) => setFormData({ ...formData, partner_consent: value as 'Yes' | 'No' })}
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

                    {/* Reproductive History */}
                    <div className="p-6 border border-gray-200 rounded-xl bg-gradient-to-br from-emerald-50/50 to-teal-50/50">
                      <div className="flex items-center gap-2 mb-4">
                        <UserCheck className="w-5 h-5 text-emerald-600" />
                        <h3 className="text-lg font-semibold text-gray-900">Reproductive History</h3>
                      </div>
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                          <label className="block mb-2 text-sm font-medium text-gray-700">Number of Living Children</label>
                          <input
                            type="number"
                            value={formData.no_of_living_children || ''}
                            onChange={(e) => setFormData({ ...formData, no_of_living_children: Number(e.target.value) })}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                            disabled={modalMode === 'view'}
                            placeholder="e.g., 2"
                          />
                        </div>
                        <div>
                          <label className="block mb-2 text-sm font-medium text-gray-700">Youngest Child Age</label>
                          <input
                            type="number"
                            value={formData.youngest_child_age || ''}
                            onChange={(e) => setFormData({ ...formData, youngest_child_age: Number(e.target.value) })}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                            disabled={modalMode === 'view'}
                            placeholder="Age in years"
                          />
                        </div>
                        <div>
                          <label className="block mb-2 text-sm font-medium text-gray-700">Last Childbirth Date</label>
                          <input
                            type="date"
                            value={formData.last_childbirth_date || ''}
                            onChange={(e) => setFormData({ ...formData, last_childbirth_date: e.target.value })}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                            disabled={modalMode === 'view'}
                          />
                        </div>
                        <div>
                          <label className="block mb-2 text-sm font-medium text-gray-700">LMP (Last Menstrual Period)</label>
                          <input
                            type="date"
                            value={formData.lmp || ''}
                            onChange={(e) => setFormData({ ...formData, lmp: e.target.value })}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                            disabled={modalMode === 'view'}
                          />
                        </div>
                        <div>
                          <label className="block mb-2 text-sm font-medium text-gray-700">Number of Miscarriages</label>
                          <input
                            type="number"
                            value={formData.no_of_miscarriages || ''}
                            onChange={(e) => setFormData({ ...formData, no_of_miscarriages: Number(e.target.value) })}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                            disabled={modalMode === 'view'}
                            placeholder="0"
                          />
                        </div>
                        <div>
                          <label className="block mb-2 text-sm font-medium text-gray-700">Number of Stillbirths</label>
                          <input
                            type="number"
                            value={formData.no_of_stillbirths || ''}
                            onChange={(e) => setFormData({ ...formData, no_of_stillbirths: Number(e.target.value) })}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                            disabled={modalMode === 'view'}
                            placeholder="0"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Navigation Buttons */}
                    {modalMode !== 'view' && (
                      <div className="flex justify-between gap-3 pt-6 border-t border-gray-200">
                        <button
                          type="button"
                          onClick={handleBackStep}
                          className="flex items-center gap-2 px-6 py-3 text-gray-700 transition-all duration-200 bg-gray-100 rounded-xl hover:bg-gray-200 font-medium"
                        >
                          <ChevronLeft className="w-5 h-5" />
                          Back
                        </button>
                        <button
                          type="button"
                          onClick={handleNextStep}
                          className="flex items-center gap-2 px-6 py-3 text-white transition-all duration-200 bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl hover:from-purple-700 hover:to-purple-800 font-medium shadow-lg"
                        >
                          Next
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Step 3: Physical Exam & Medical History */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    {/* Physical Examination */}
                    <div className="p-6 border border-gray-200 rounded-xl bg-gradient-to-br from-cyan-50/50 to-sky-50/50">
                      <div className="flex items-center gap-2 mb-4">
                        <Scale className="w-5 h-5 text-cyan-600" />
                        <h3 className="text-lg font-semibold text-gray-900">Physical Examination</h3>
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
                          <p className="mt-1 text-xs text-gray-500">Format: systolic/diastolic</p>
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
                            placeholder="e.g., 55.5"
                          />
                          <p className="mt-1 text-xs text-gray-500">Enter in kilograms</p>
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
                          <p className="mt-1 text-xs text-gray-500">Enter in centimeters</p>
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
                          <p className="mt-1 text-xs text-gray-500">Body Mass Index</p>
                        </div>
                      </div>
                    </div>

                    {/* Medical History */}
                    <div className="p-6 border border-gray-200 rounded-xl bg-gradient-to-br from-red-50/50 to-orange-50/50">
                      <div className="flex items-center gap-2 mb-4">
                        <Stethoscope className="w-5 h-5 text-red-600" />
                        <h3 className="text-lg font-semibold text-gray-900">Medical History</h3>
                      </div>
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <label className="block mb-2 text-sm font-medium text-gray-700">Allergies</label>
                          <textarea
                            value={formData.allergies || ''}
                            onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            rows={2}
                            disabled={modalMode === 'view'}
                            placeholder="List any known allergies"
                          />
                        </div>
                        <div>
                          <label className="block mb-2 text-sm font-medium text-gray-700">Current Medications</label>
                          <textarea
                            value={formData.current_medications || ''}
                            onChange={(e) => setFormData({ ...formData, current_medications: e.target.value })}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            rows={2}
                            disabled={modalMode === 'view'}
                            placeholder="List current medications"
                          />
                        </div>
                        <div>
                          <label className="block mb-2 text-sm font-medium text-gray-700">Medical Conditions</label>
                          <textarea
                            value={formData.medical_conditions || ''}
                            onChange={(e) => setFormData({ ...formData, medical_conditions: e.target.value })}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            rows={2}
                            disabled={modalMode === 'view'}
                            placeholder="e.g., Diabetes, Hypertension"
                          />
                        </div>
                        <div>
                          <label className="block mb-2 text-sm font-medium text-gray-700">Previous Surgeries</label>
                          <textarea
                            value={formData.previous_surgeries || ''}
                            onChange={(e) => setFormData({ ...formData, previous_surgeries: e.target.value })}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            rows={2}
                            disabled={modalMode === 'view'}
                            placeholder="List any previous surgeries"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Risk Screening */}
                    <div className="p-6 border border-gray-200 rounded-xl bg-gradient-to-br from-yellow-50/50 to-amber-50/50">
                      <div className="flex items-center gap-2 mb-4">
                        <Shield className="w-5 h-5 text-yellow-600" />
                        <h3 className="text-lg font-semibold text-gray-900">Risk Screening</h3>
                      </div>
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                          <label className="block mb-2 text-sm font-medium text-gray-700">Smoker</label>
                          <CustomSelect
                            value={formData.smoker || ''}
                            onChange={(value) => setFormData({ ...formData, smoker: value as 'Yes' | 'No' })}
                            options={[
                              { value: '', label: 'Select' },
                              { value: 'Yes', label: 'Yes' },
                              { value: 'No', label: 'No' },
                            ]}
                            placeholder="Select"
                          />
                        </div>
                        <div>
                          <label className="block mb-2 text-sm font-medium text-gray-700">History of Blood Clots</label>
                          <CustomSelect
                            value={formData.history_blood_clots || ''}
                            onChange={(value) => setFormData({ ...formData, history_blood_clots: value as 'Yes' | 'No' })}
                            options={[
                              { value: '', label: 'Select' },
                              { value: 'Yes', label: 'Yes' },
                              { value: 'No', label: 'No' },
                            ]}
                            placeholder="Select"
                          />
                        </div>
                        <div>
                          <label className="block mb-2 text-sm font-medium text-gray-700">History of Cancer</label>
                          <CustomSelect
                            value={formData.history_cancer || ''}
                            onChange={(value) => setFormData({ ...formData, history_cancer: value as 'Yes' | 'No' })}
                            options={[
                              { value: '', label: 'Select' },
                              { value: 'Yes', label: 'Yes' },
                              { value: 'No', label: 'No' },
                            ]}
                            placeholder="Select"
                          />
                        </div>
                        <div>
                          <label className="block mb-2 text-sm font-medium text-gray-700">History of Stroke</label>
                          <CustomSelect
                            value={formData.history_stroke || ''}
                            onChange={(value) => setFormData({ ...formData, history_stroke: value as 'Yes' | 'No' })}
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

                    {/* Navigation Buttons */}
                    {modalMode !== 'view' && (
                      <div className="flex justify-between gap-3 pt-6 border-t border-gray-200">
                        <button
                          type="button"
                          onClick={handleBackStep}
                          className="flex items-center gap-2 px-6 py-3 text-gray-700 transition-all duration-200 bg-gray-100 rounded-xl hover:bg-gray-200 font-medium"
                        >
                          <ChevronLeft className="w-5 h-5" />
                          Back
                        </button>
                        <button
                          type="button"
                          onClick={handleNextStep}
                          className="flex items-center gap-2 px-6 py-3 text-white transition-all duration-200 bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl hover:from-purple-700 hover:to-purple-800 font-medium shadow-lg"
                        >
                          Next
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Step 4: FP Method Details, Contact & Supply */}
                {currentStep === 4 && (
                  <div className="space-y-6">
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
                        <p className="mt-1 text-xs text-gray-500">Format: 11-digit mobile number</p>
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
                          placeholder="e.g., College Graduate"
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

                {/* FP Method Details */}
                <div className="p-6 border border-gray-200 rounded-xl bg-gradient-to-br from-indigo-50/50 to-violet-50/50">
                  <div className="flex items-center gap-2 mb-4">
                    <Pill className="w-5 h-5 text-indigo-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Family Planning Method Details</h3>
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">Type of Client</label>
                      <CustomSelect
                        value={formData.type_of_client || ''}
                        onChange={(value) => setFormData({ ...formData, type_of_client: value })}
                        options={[
                          { value: '', label: 'Select Type' },
                          { value: 'New Acceptor', label: 'New Acceptor' },
                          { value: 'Current User', label: 'Current User' },
                          { value: 'Changing Method', label: 'Changing Method' },
                          { value: 'Changing Clinic', label: 'Changing Clinic' },
                          { value: 'Dropout/Restart', label: 'Dropout/Restart' },
                        ]}
                        placeholder="Select Type"
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">Date of Visit</label>
                      <input
                        type="date"
                        value={formData.date_of_visit || ''}
                        onChange={(e) => setFormData({ ...formData, date_of_visit: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        disabled={modalMode === 'view'}
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">FP Method</label>
                      <CustomSelect
                        value={formData.type_of_fp_method || ''}
                        onChange={(value) => setFormData({ ...formData, type_of_fp_method: value })}
                        options={[
                          { value: '', label: 'Select Method' },
                          { value: 'Pills', label: 'Pills' },
                          { value: 'Injectable (DMPA)', label: 'Injectable (DMPA)' },
                          { value: 'IUD', label: 'IUD' },
                          { value: 'Condom', label: 'Condom' },
                          { value: 'Implant', label: 'Implant' },
                          { value: 'Natural FP', label: 'Natural FP' },
                          { value: 'BTL', label: 'BTL (Tubal Ligation)' },
                          { value: 'NSV', label: 'NSV (Vasectomy)' },
                        ]}
                        placeholder="Select Method"
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">Date Started</label>
                      <input
                        type="date"
                        value={formData.date_started || ''}
                        onChange={(e) => setFormData({ ...formData, date_started: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        disabled={modalMode === 'view'}
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">Date Accepted</label>
                      <input
                        type="date"
                        value={formData.date_accepted || ''}
                        onChange={(e) => setFormData({ ...formData, date_accepted: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        disabled={modalMode === 'view'}
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">Date of Follow-up</label>
                      <input
                        type="date"
                        value={formData.date_of_followup || ''}
                        onChange={(e) => setFormData({ ...formData, date_of_followup: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        disabled={modalMode === 'view'}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4 mt-4 md:grid-cols-2">
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">Midwife Name</label>
                      <input
                        type="text"
                        value={formData.midwife_name || ''}
                        onChange={(e) => setFormData({ ...formData, midwife_name: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        disabled={modalMode === 'view'}
                        placeholder="Name of attending midwife"
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">Pregnancy Test Result</label>
                      <CustomSelect
                        value={formData.pregnancy_test_result || ''}
                        onChange={(value) => setFormData({ ...formData, pregnancy_test_result: value })}
                        options={[
                          { value: '', label: 'Select Result' },
                          { value: 'Positive', label: 'Positive' },
                          { value: 'Negative', label: 'Negative' },
                          { value: 'Not Tested', label: 'Not Tested' },
                        ]}
                        placeholder="Select Result"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4 mt-4">
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">Remarks / Side Effects</label>
                      <textarea
                        value={formData.remarks_side_effects || ''}
                        onChange={(e) => setFormData({ ...formData, remarks_side_effects: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        rows={2}
                        disabled={modalMode === 'view'}
                        placeholder="Note any side effects or remarks"
                      />
                    </div>
                  </div>
                </div>

                {/* Method Change Information */}
                <div className="p-6 border border-gray-200 rounded-xl bg-gradient-to-br from-purple-50/50 to-fuchsia-50/50">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="w-5 h-5 text-purple-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Method Change Information</h3>
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">Method Changed?</label>
                      <CustomSelect
                        value={formData.method_changed || ''}
                        onChange={(value) => setFormData({ ...formData, method_changed: value })}
                        options={[
                          { value: '', label: 'Select' },
                          { value: 'Y', label: 'Yes' },
                          { value: 'N', label: 'No' },
                        ]}
                        placeholder="Select"
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">New Method</label>
                      <input
                        type="text"
                        value={formData.new_method || ''}
                        onChange={(e) => setFormData({ ...formData, new_method: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        disabled={modalMode === 'view' || formData.method_changed !== 'Y'}
                        placeholder="Enter new method if changed"
                      />
                      <p className="mt-1 text-xs text-gray-500">Only if method was changed</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4 mt-4">
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">Reason for Change</label>
                      <textarea
                        value={formData.reason_for_change || ''}
                        onChange={(e) => setFormData({ ...formData, reason_for_change: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        rows={2}
                        disabled={modalMode === 'view' || formData.method_changed !== 'Y'}
                        placeholder="Explain why the method was changed"
                      />
                      <p className="mt-1 text-xs text-gray-500">Only if method was changed</p>
                    </div>
                  </div>
                </div>

                {/* Supply & Follow-up */}
                <div className="p-6 border border-gray-200 rounded-xl bg-gradient-to-br from-teal-50/50 to-cyan-50/50">
                  <div className="flex items-center gap-2 mb-4">
                    <FileText className="w-5 h-5 text-teal-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Supply & Follow-up</h3>
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">Source of Supply</label>
                      <input
                        type="text"
                        value={formData.source_of_supply || ''}
                        onChange={(e) => setFormData({ ...formData, source_of_supply: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        disabled={modalMode === 'view'}
                        placeholder="e.g., RHU, Private Clinic"
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">Quantity Given</label>
                      <input
                        type="text"
                        value={formData.quantity_given || ''}
                        onChange={(e) => setFormData({ ...formData, quantity_given: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        disabled={modalMode === 'view'}
                        placeholder="e.g., 3 cycles, 1 vial"
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">Date of Last Supply</label>
                      <input
                        type="date"
                        value={formData.date_of_last_supply || ''}
                        onChange={(e) => setFormData({ ...formData, date_of_last_supply: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        disabled={modalMode === 'view'}
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">Next Supply Date</label>
                      <input
                        type="date"
                        value={formData.next_supply_date || ''}
                        onChange={(e) => setFormData({ ...formData, next_supply_date: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        disabled={modalMode === 'view'}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4 mt-4">
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">Adherence Notes</label>
                      <textarea
                        value={formData.adherence_notes || ''}
                        onChange={(e) => setFormData({ ...formData, adherence_notes: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        rows={2}
                        disabled={modalMode === 'view'}
                        placeholder="Notes on client adherence and compliance"
                      />
                    </div>
                  </div>
                </div>

                {/* Navigation Buttons */}
                {modalMode !== 'view' && (
                  <div className="flex justify-between gap-3 pt-6 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={handleBackStep}
                      className="flex items-center gap-2 px-6 py-3 text-gray-700 transition-all duration-200 bg-gray-100 rounded-xl hover:bg-gray-200 font-medium"
                    >
                      <ChevronLeft className="w-5 h-5" />
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex items-center justify-center gap-2 px-6 py-3 text-white transition-all duration-200 bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl hover:from-purple-700 hover:to-purple-800 font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                      {submitting ? 'Saving...' : (modalMode === 'create' ? 'Create Record' : 'Update Record')}
                    </button>
                  </div>
                )}
              </div>
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
                    <h3 className="text-xl font-bold text-gray-900">Export Family Planning Records</h3>
                    <p className="text-sm text-gray-600">Choose format and apply filters</p>
                  </div>
                </div>
                <button onClick={() => setShowExportModal(false)} className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                  <Filter className="w-4 h-4" />
                  Filter Options (Optional)
                </div>

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

                {(exportFilters.start_date || exportFilters.end_date || exportFilters.barangay_id || exportFilters.search) && (
                  <button
                    onClick={() => setExportFilters({ start_date: '', end_date: '', barangay_id: '', search: '' })}
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <XCircle className="w-4 h-4" />
                    Clear All Filters
                  </button>
                )}
              </div>

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
                    <FilePdf className="w-5 h-5" />
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
                Are you sure you want to delete this family planning record? All associated data will be permanently removed.
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
        .family-planning-modal input:focus,
        .family-planning-modal select:focus,
        .family-planning-modal textarea:focus {
          outline: none !important;
        }
        
        .family-planning-modal input.border-red-300,
        .family-planning-modal select.border-red-300,
        .family-planning-modal textarea.border-red-300 {
          border-color: #fca5a5 !important;
          border-width: 2px !important;
        }
        
        .family-planning-modal input.border-red-300:focus,
        .family-planning-modal select.border-red-300:focus,
        .family-planning-modal textarea.border-red-300:focus {
          border-color: #ef4444 !important;
          box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1) !important;
        }
      `}</style>
    </DashboardLayout>
  );
}
