import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HeartPulse, Plus, Search, Edit2, Trash2, Eye, Archive, ArchiveRestore, X,
  User, MapPin, Phone, Calendar, Activity, AlertTriangle, Loader2, ChevronLeft, ChevronRight,
  Download, FileSpreadsheet, FileText as FilePdf, Filter, XCircle
} from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import CustomSelect from '../../components/CustomSelect';
import { maternalCareService } from '../../services/maternalCareService';
import { barangayService } from '../../services/barangayService';
import { MaternalCareRecord, Barangay } from '../../types';
import { useAuthStore } from '@/store/authStore';

const MaternalCareDashboardPage: React.FC = () => {
  const { user } = useAuthStore();
  const [records, setRecords] = useState<MaternalCareRecord[]>([]);
  const [barangays, setBarangays] = useState<Barangay[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<MaternalCareRecord | null>(null);
  const [deleteRecordId, setDeleteRecordId] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 20;
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

  const [formData, setFormData] = useState({
    first_name: '',
    middle_name: '',
    last_name: '',
    age: '',
    sex: 'Female' as 'Female',
    address: '',
    barangay_id: '',
    contact_no: '',
    civil_status: '',
    educational_attainment: '',
    occupation: '',
    gravida: '',
    para: '',
    lmp: '',
    edd: '',
    blood_type: '',
    no_of_miscarriages: '',
    no_of_stillbirths: '',
    no_of_living_children: '',
    previous_cesarean: '',
    previous_complications: '',
    prenatal_visit_1: '',
    prenatal_visit_2: '',
    prenatal_visit_3: '',
    prenatal_visit_4: '',
    fundal_height: '',
    fetal_heart_rate: '',
    fetal_presentation: '',
    edema: '',
    proteinuria: '',
    weight_monitoring: '',
    bp_monitoring: '',
    hemoglobin: '',
    blood_sugar: '',
    urinalysis_result: '',
    ultrasound_date: '',
    ultrasound_findings: '',
    has_hypertension: '',
    has_gestational_diabetes: '',
    has_multiple_pregnancy: '',
    has_placenta_previa: '',
    has_preeclampsia: '',
    birth_plan: '',
    preferred_delivery_place: '',
    emergency_contact: '',
    emergency_contact_number: '',
    philhealth_member: '',
    date_tt1: '',
    date_tt2: '',
    date_tt3: '',
    date_tt4: '',
    date_tt5: '',
    fim_status: '',
    iron_folic: '',
    calcium: '',
    iodine: '',
    bmi: '',
    deworm: '',
    syphilis_screening: '',
    hepa_b_screening: '',
    hiv_screening: '',
    date_screened: '',
    result: '',
    remarks: '',
  });

  useEffect(() => {
    fetchRecords();
    fetchBarangays();
  }, []);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const data = await maternalCareService.getAll();
      // Ensure data is an array
      const recordsArray = Array.isArray(data) ? data : (data?.data ? data.data : []);
      setRecords(recordsArray);
    } catch (error) {
      console.error('Error fetching records:', error);
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchBarangays = async () => {
    try {
      const response = await barangayService.getAll();
      setBarangays(response.data.data);
    } catch (error) {
      console.error('Error fetching barangays:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const resetForm = () => {
    setFormData({
      first_name: '',
      middle_name: '',
      last_name: '',
      age: '',
      sex: 'Female',
      address: '',
      barangay_id: '',
      contact_no: '',
      civil_status: '',
      educational_attainment: '',
      occupation: '',
      gravida: '',
      para: '',
      lmp: '',
      edd: '',
      blood_type: '',
      no_of_miscarriages: '',
      no_of_stillbirths: '',
      no_of_living_children: '',
      previous_cesarean: '',
      previous_complications: '',
      prenatal_visit_1: '',
      prenatal_visit_2: '',
      prenatal_visit_3: '',
      prenatal_visit_4: '',
      fundal_height: '',
      fetal_heart_rate: '',
      fetal_presentation: '',
      edema: '',
      proteinuria: '',
      weight_monitoring: '',
      bp_monitoring: '',
      hemoglobin: '',
      blood_sugar: '',
      urinalysis_result: '',
      ultrasound_date: '',
      ultrasound_findings: '',
      has_hypertension: '',
      has_gestational_diabetes: '',
      has_multiple_pregnancy: '',
      has_placenta_previa: '',
      has_preeclampsia: '',
      birth_plan: '',
      preferred_delivery_place: '',
      emergency_contact: '',
      emergency_contact_number: '',
      philhealth_member: '',
      date_tt1: '',
      date_tt2: '',
      date_tt3: '',
      date_tt4: '',
      date_tt5: '',
      fim_status: '',
      iron_folic: '',
      calcium: '',
      iodine: '',
      bmi: '',
      deworm: '',
      syphilis_screening: '',
      hepa_b_screening: '',
      hiv_screening: '',
      date_screened: '',
      result: '',
      remarks: '',
    });
    setErrors({});
    setIsEditing(false);
    setSelectedRecord(null);
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
    const newErrors: Record<string, string> = {};

    if (currentStep === 1) {
      // Step 1: Personal & Contact validation
      if (!formData.first_name.trim()) newErrors.first_name = 'First name is required';
      if (!formData.last_name.trim()) newErrors.last_name = 'Last name is required';
      if (!formData.barangay_id) newErrors.barangay_id = 'Barangay is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddNew = () => {
    resetForm();
    setShowModal(true);
  };

  const handleEdit = (record: MaternalCareRecord) => {
    setSelectedRecord(record);
    setIsEditing(true);
    setFormData({
      first_name: record.first_name || '',
      middle_name: record.middle_name || '',
      last_name: record.last_name || '',
      age: record.age?.toString() || '',
      sex: record.sex || 'Female',
      address: record.address || '',
      barangay_id: record.barangay_id?.toString() || '',
      contact_no: record.contact_no || '',
      civil_status: record.civil_status || '',
      educational_attainment: record.educational_attainment || '',
      occupation: record.occupation || '',
      gravida: record.gravida?.toString() || '',
      para: record.para?.toString() || '',
      lmp: record.lmp || '',
      edd: record.edd || '',
      blood_type: record.blood_type || '',
      no_of_miscarriages: record.no_of_miscarriages?.toString() || '',
      no_of_stillbirths: record.no_of_stillbirths?.toString() || '',
      no_of_living_children: record.no_of_living_children?.toString() || '',
      previous_cesarean: record.previous_cesarean || '',
      previous_complications: record.previous_complications || '',
      prenatal_visit_1: record.prenatal_visit_1 || '',
      prenatal_visit_2: record.prenatal_visit_2 || '',
      prenatal_visit_3: record.prenatal_visit_3 || '',
      prenatal_visit_4: record.prenatal_visit_4 || '',
      fundal_height: record.fundal_height || '',
      fetal_heart_rate: record.fetal_heart_rate || '',
      fetal_presentation: record.fetal_presentation || '',
      edema: record.edema || '',
      proteinuria: record.proteinuria || '',
      weight_monitoring: record.weight_monitoring || '',
      bp_monitoring: record.bp_monitoring || '',
      hemoglobin: record.hemoglobin || '',
      blood_sugar: record.blood_sugar || '',
      urinalysis_result: record.urinalysis_result || '',
      ultrasound_date: record.ultrasound_date || '',
      ultrasound_findings: record.ultrasound_findings || '',
      has_hypertension: record.has_hypertension || '',
      has_gestational_diabetes: record.has_gestational_diabetes || '',
      has_multiple_pregnancy: record.has_multiple_pregnancy || '',
      has_placenta_previa: record.has_placenta_previa || '',
      has_preeclampsia: record.has_preeclampsia || '',
      birth_plan: record.birth_plan || '',
      preferred_delivery_place: record.preferred_delivery_place || '',
      emergency_contact: record.emergency_contact || '',
      emergency_contact_number: record.emergency_contact_number || '',
      philhealth_member: record.philhealth_member || '',
      date_tt1: record.date_tt1 || '',
      date_tt2: record.date_tt2 || '',
      date_tt3: record.date_tt3 || '',
      date_tt4: record.date_tt4 || '',
      date_tt5: record.date_tt5 || '',
      fim_status: record.fim_status || '',
      iron_folic: record.iron_folic || '',
      calcium: record.calcium || '',
      iodine: record.iodine || '',
      bmi: record.bmi || '',
      deworm: record.deworm || '',
      syphilis_screening: record.syphilis_screening || '',
      hepa_b_screening: record.hepa_b_screening || '',
      hiv_screening: record.hiv_screening || '',
      date_screened: record.date_screened || '',
      result: record.result || '',
      remarks: record.remarks || '',
    });
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    setDeleteRecordId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (deleteRecordId) {
      try {
        await maternalCareService.delete(deleteRecordId);
        await fetchRecords();
        setShowDeleteModal(false);
        setDeleteRecordId(null);
      } catch (error) {
        console.error('Error deleting record:', error);
      }
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.first_name.trim()) newErrors.first_name = 'First name is required';
    if (!formData.last_name.trim()) newErrors.last_name = 'Last name is required';
    if (!formData.barangay_id) newErrors.barangay_id = 'Barangay is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const submitData: any = { ...formData };
      
      ['age', 'gravida', 'para', 'no_of_miscarriages', 'no_of_stillbirths', 'no_of_living_children', 'barangay_id'].forEach(field => {
        if (submitData[field] === '') {
          submitData[field] = null;
        } else if (submitData[field]) {
          submitData[field] = parseInt(submitData[field]);
        }
      });

      Object.keys(submitData).forEach(key => {
        if (submitData[key] === '') {
          submitData[key] = null;
        }
      });

      if (isEditing && selectedRecord) {
        await maternalCareService.update(selectedRecord.id, submitData);
      } else {
        await maternalCareService.create(submitData);
      }

      await fetchRecords();
      setShowModal(false);
      resetForm();
    } catch (error: any) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
      console.error('Error saving record:', error);
    }
  };

  const filteredRecords = records.filter(record =>
    record.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.contact_no?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const paginatedRecords = filteredRecords.slice(startIndex, startIndex + recordsPerPage);

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
        ? `/maternal-care-records/export/excel?${params.toString()}`
        : `/maternal-care-records/export/pdf?${params.toString()}`;

      const response = await maternalCareService.export(endpoint);
      
      const blob = new Blob([response.data], {
        type: format === 'excel' 
          ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          : 'application/pdf'
      });
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `maternal_care_records_${new Date().toISOString().split('T')[0]}.${format === 'excel' ? 'xlsx' : 'pdf'}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      alert(`Records exported successfully as ${format.toUpperCase()}!`);
      setShowExportModal(false);
      setExportFilters({ start_date: '', end_date: '', barangay_id: '', search: '' });
    } catch (error: any) {
      console.error('Export failed:', error);
      alert(error.response?.data?.message || 'Failed to export records.');
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
              <HeartPulse className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-transparent bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text">Maternal Care Records</h1>
              <p className="flex items-center gap-2 mt-1 text-gray-600">
                <HeartPulse className="w-4 h-4" />
                Comprehensive prenatal and maternal health management system
              </p>
            </div>
          </div>
          <button
            onClick={handleAddNew}
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
              placeholder="Search by name or contact number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent shadow-sm"
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
                <HeartPulse className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-lg text-gray-500">No maternal care records found</p>
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
                        Pregnancy Details
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
                  {paginatedRecords.map((record) => (
                    <tr key={record.id} className="transition-all duration-200 hover:bg-pink-50/30">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm bg-pink-500">
                            {record.first_name?.charAt(0)}{record.last_name?.charAt(0)}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">
                              {record.first_name} {record.middle_name} {record.last_name}
                            </div>
                            <div className="flex items-center gap-1 mt-1 text-sm text-gray-600">
                              <User className="w-3 h-3" />
                              Age: {record.age || 'N/A'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="text-sm">
                          <div className="font-medium text-gray-900">LMP: {record.lmp || 'N/A'}</div>
                          <div className="text-xs text-gray-500 mt-1">EDD: {record.edd || 'N/A'}</div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="text-sm">
                          <div className="flex items-center gap-1 font-medium text-gray-900">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            {record.barangay?.name || 'N/A'}
                          </div>
                          {record.contact_no && (
                            <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                              <Phone className="w-3 h-3" />
                              {record.contact_no}
                            </div>
                          )}
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
                            onClick={() => handleEdit(record)} 
                            className="p-2.5 text-emerald-600 hover:bg-emerald-100 rounded-xl transition-all duration-200"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(record.id)} 
                            className="p-2.5 text-red-600 hover:bg-red-100 rounded-xl transition-all duration-200"
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

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="maternal-care-modal w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between rounded-t-2xl z-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl flex items-center justify-center">
                  <HeartPulse className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {isEditing ? 'Edit Maternal Care Record' : 'Add New Maternal Care Record'}
                  </h2>
                  <p className="text-sm text-gray-600 mt-0.5">Complete maternal care information</p>
                </div>
              </div>
              <button 
                onClick={() => setShowModal(false)} 
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Step Indicator */}
            {!isEditing && (
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center justify-center gap-4">
                  {/* Step 1 */}
                  <div className="flex flex-col items-center">
                    <div className={`rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold transition-all duration-200 ${
                      currentStep === 1 ? 'bg-pink-600 text-white' : currentStep > 1 ? 'bg-pink-600 text-white' : 'bg-gray-100 text-gray-400'
                    }`}>
                      1
                    </div>
                    <span className={`text-xs font-medium mt-1 transition-all duration-200 ${
                      currentStep === 1 ? 'text-pink-600' : currentStep > 1 ? 'text-pink-600' : 'text-gray-400'
                    }`}>
                      Personal & Contact
                    </span>
                  </div>

                  {/* Connector Line */}
                  <div className={`flex-1 h-0.5 transition-all duration-200 ${
                    currentStep > 1 ? 'bg-pink-500' : 'bg-gray-200'
                  }`} style={{ maxWidth: '80px' }} />

                  {/* Step 2 */}
                  <div className="flex flex-col items-center">
                    <div className={`rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold transition-all duration-200 ${
                      currentStep === 2 ? 'bg-pink-600 text-white' : currentStep > 2 ? 'bg-pink-600 text-white' : 'bg-gray-100 text-gray-400'
                    }`}>
                      2
                    </div>
                    <span className={`text-xs font-medium mt-1 transition-all duration-200 ${
                      currentStep === 2 ? 'text-pink-600' : currentStep > 2 ? 'text-pink-600' : 'text-gray-400'
                    }`}>
                      Pregnancy & Visits
                    </span>
                  </div>

                  {/* Connector Line */}
                  <div className={`flex-1 h-0.5 transition-all duration-200 ${
                    currentStep > 2 ? 'bg-pink-500' : 'bg-gray-200'
                  }`} style={{ maxWidth: '80px' }} />

                  {/* Step 3 */}
                  <div className="flex flex-col items-center">
                    <div className={`rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold transition-all duration-200 ${
                      currentStep === 3 ? 'bg-pink-600 text-white' : currentStep > 3 ? 'bg-pink-600 text-white' : 'bg-gray-100 text-gray-400'
                    }`}>
                      3
                    </div>
                    <span className={`text-xs font-medium mt-1 transition-all duration-200 ${
                      currentStep === 3 ? 'text-pink-600' : currentStep > 3 ? 'text-pink-600' : 'text-gray-400'
                    }`}>
                      Monitoring & Lab
                    </span>
                  </div>

                  {/* Connector Line */}
                  <div className={`flex-1 h-0.5 transition-all duration-200 ${
                    currentStep > 3 ? 'bg-pink-500' : 'bg-gray-200'
                  }`} style={{ maxWidth: '80px' }} />

                  {/* Step 4 */}
                  <div className="flex flex-col items-center">
                    <div className={`rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold transition-all duration-200 ${
                      currentStep === 4 ? 'bg-pink-600 text-white' : 'bg-gray-100 text-gray-400'
                    }`}>
                      4
                    </div>
                    <span className={`text-xs font-medium mt-1 transition-all duration-200 ${
                      currentStep === 4 ? 'text-pink-600' : 'text-gray-400'
                    }`}>
                      Birth Prep & Screening
                    </span>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Step 1: Personal & Contact Information */}
              {(currentStep === 1 || isEditing) && (
                <>
              {/* Section 1: Personal Information */}
              <div className="bg-gradient-to-br from-pink-50/50 to-rose-50/50 border border-gray-200 rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center">
                    <User className="w-4 h-4 text-pink-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                    <input
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-colors ${
                        errors.first_name ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {errors.first_name && <p className="text-red-500 text-xs mt-1">{errors.first_name}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Middle Name</label>
                    <input
                      type="text"
                      name="middle_name"
                      value={formData.middle_name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                    <input
                      type="text"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-colors ${
                        errors.last_name ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {errors.last_name && <p className="text-red-500 text-xs mt-1">{errors.last_name}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Civil Status</label>
                    <CustomSelect
                      value={formData.civil_status}
                      onChange={(value) => handleInputChange({ target: { name: 'civil_status', value } } as any)}
                      options={[
                        { value: '', label: 'Select' },
                        { value: 'Single', label: 'Single' },
                        { value: 'Married', label: 'Married' },
                        { value: 'Widowed', label: 'Widowed' },
                        { value: 'Separated', label: 'Separated' },
                      ]}
                      placeholder="Select"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Blood Type</label>
                    <CustomSelect
                      value={formData.blood_type}
                      onChange={(value) => handleInputChange({ target: { name: 'blood_type', value } } as any)}
                      options={[
                        { value: '', label: 'Select' },
                        { value: 'A+', label: 'A+' },
                        { value: 'A-', label: 'A-' },
                        { value: 'B+', label: 'B+' },
                        { value: 'B-', label: 'B-' },
                        { value: 'AB+', label: 'AB+' },
                        { value: 'AB-', label: 'AB-' },
                        { value: 'O+', label: 'O+' },
                        { value: 'O-', label: 'O-' },
                      ]}
                      placeholder="Select"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Contact & Location */}
              <div className="bg-gradient-to-br from-pink-50/50 to-rose-50/50 border border-gray-200 rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-pink-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Contact & Location</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Barangay *</label>
                    <CustomSelect
                      value={formData.barangay_id}
                      onChange={(value) => handleInputChange({ target: { name: 'barangay_id', value } } as any)}
                      options={[
                        { value: '', label: 'Select Barangay' },
                        ...barangays.map(b => ({ value: String(b.id), label: b.name }))
                      ]}
                      placeholder="Select Barangay"
                    />
                    {errors.barangay_id && <p className="text-red-500 text-xs mt-1">{errors.barangay_id}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                    <input
                      type="text"
                      name="contact_no"
                      value={formData.contact_no}
                      onChange={handleInputChange}
                      placeholder="09XXXXXXXXX"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Educational Attainment</label>
                    <input
                      type="text"
                      name="educational_attainment"
                      value={formData.educational_attainment}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Occupation</label>
                    <input
                      type="text"
                      name="occupation"
                      value={formData.occupation}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                </div>
              </div>

              {/* Navigation Buttons - Step 1 */}
              {!isEditing && (
                <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-xl hover:from-pink-600 hover:to-rose-700 font-medium shadow-lg transition-all"
                  >
                    Next
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
              </>
            )}

            {/* Step 2: Pregnancy & Visits */}
            {(currentStep === 2 || isEditing) && (
              <>
              {/* Section 3: Pregnancy Information */}
              <div className="bg-gradient-to-br from-pink-50/50 to-rose-50/50 border border-gray-200 rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center">
                    <HeartPulse className="w-4 h-4 text-pink-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Pregnancy Information</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gravida</label>
                    <input
                      type="number"
                      name="gravida"
                      value={formData.gravida}
                      onChange={handleInputChange}
                      placeholder="Number of pregnancies"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Para</label>
                    <input
                      type="number"
                      name="para"
                      value={formData.para}
                      onChange={handleInputChange}
                      placeholder="Number of births"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">LMP (Last Menstrual Period)</label>
                    <input
                      type="date"
                      name="lmp"
                      value={formData.lmp}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">EDD (Expected Delivery Date)</label>
                    <input
                      type="date"
                      name="edd"
                      value={formData.edd}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">No. of Living Children</label>
                    <input
                      type="number"
                      name="no_of_living_children"
                      value={formData.no_of_living_children}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">No. of Miscarriages</label>
                    <input
                      type="number"
                      name="no_of_miscarriages"
                      value={formData.no_of_miscarriages}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">No. of Stillbirths</label>
                    <input
                      type="number"
                      name="no_of_stillbirths"
                      value={formData.no_of_stillbirths}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Previous Cesarean</label>
                    <CustomSelect
                      value={formData.previous_cesarean}
                      onChange={(value) => handleInputChange({ target: { name: 'previous_cesarean', value } } as any)}
                      options={[
                        { value: '', label: 'Select' },
                        { value: 'Yes', label: 'Yes' },
                        { value: 'No', label: 'No' },
                      ]}
                      placeholder="Select"
                    />
                  </div>
                  <div className="md:col-span-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Previous Complications</label>
                    <textarea
                      name="previous_complications"
                      value={formData.previous_complications}
                      onChange={handleInputChange}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                </div>
              </div>

              {/* Section 4: Prenatal Visits */}
              <div className="bg-gradient-to-br from-pink-50/50 to-rose-50/50 border border-gray-200 rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-pink-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Prenatal Visits</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">1st Prenatal Visit</label>
                    <input
                      type="date"
                      name="prenatal_visit_1"
                      value={formData.prenatal_visit_1}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">2nd Prenatal Visit</label>
                    <input
                      type="date"
                      name="prenatal_visit_2"
                      value={formData.prenatal_visit_2}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">3rd Prenatal Visit</label>
                    <input
                      type="date"
                      name="prenatal_visit_3"
                      value={formData.prenatal_visit_3}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">4th Prenatal Visit</label>
                    <input
                      type="date"
                      name="prenatal_visit_4"
                      value={formData.prenatal_visit_4}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                </div>
              </div>

              {/* Navigation Buttons - Step 2 */}
              {!isEditing && (
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
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-xl hover:from-pink-600 hover:to-rose-700 font-medium shadow-lg transition-all"
                  >
                    Next
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
              </>
            )}

            {/* Step 3: Monitoring & Lab Results */}
            {(currentStep === 3 || isEditing) && (
              <>
              {/* Section 5: Current Pregnancy Monitoring */}
              <div className="bg-gradient-to-br from-pink-50/50 to-rose-50/50 border border-gray-200 rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center">
                    <Activity className="w-4 h-4 text-pink-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Current Pregnancy Monitoring</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fundal Height</label>
                    <input
                      type="text"
                      name="fundal_height"
                      value={formData.fundal_height}
                      onChange={handleInputChange}
                      placeholder="e.g., 28 cm"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fetal Heart Rate</label>
                    <input
                      type="text"
                      name="fetal_heart_rate"
                      value={formData.fetal_heart_rate}
                      onChange={handleInputChange}
                      placeholder="e.g., 140 bpm"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fetal Presentation</label>
                    <input
                      type="text"
                      name="fetal_presentation"
                      value={formData.fetal_presentation}
                      onChange={handleInputChange}
                      placeholder="e.g., Cephalic"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Edema</label>
                    <input
                      type="text"
                      name="edema"
                      value={formData.edema}
                      onChange={handleInputChange}
                      placeholder="e.g., None, Mild, Severe"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Proteinuria</label>
                    <CustomSelect
                      value={formData.proteinuria}
                      onChange={(value) => handleInputChange({ target: { name: 'proteinuria', value } } as any)}
                      options={[
                        { value: '', label: 'Select' },
                        { value: 'Yes', label: 'Yes' },
                        { value: 'No', label: 'No' },
                      ]}
                      placeholder="Select"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Weight Monitoring</label>
                    <input
                      type="text"
                      name="weight_monitoring"
                      value={formData.weight_monitoring}
                      onChange={handleInputChange}
                      placeholder="e.g., 65 kg"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                  <div className="md:col-span-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">BP Monitoring</label>
                    <input
                      type="text"
                      name="bp_monitoring"
                      value={formData.bp_monitoring}
                      onChange={handleInputChange}
                      placeholder="e.g., 120/80 mmHg"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                </div>
              </div>

              {/* Section 6: Laboratory Results */}
              <div className="bg-gradient-to-br from-pink-50/50 to-rose-50/50 border border-gray-200 rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center">
                    <Activity className="w-4 h-4 text-pink-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Laboratory Results</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hemoglobin</label>
                    <input
                      type="text"
                      name="hemoglobin"
                      value={formData.hemoglobin}
                      onChange={handleInputChange}
                      placeholder="e.g., 12.5 g/dL"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Blood Sugar</label>
                    <input
                      type="text"
                      name="blood_sugar"
                      value={formData.blood_sugar}
                      onChange={handleInputChange}
                      placeholder="e.g., 95 mg/dL"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Urinalysis Result</label>
                    <input
                      type="text"
                      name="urinalysis_result"
                      value={formData.urinalysis_result}
                      onChange={handleInputChange}
                      placeholder="e.g., Normal"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ultrasound Date</label>
                    <input
                      type="date"
                      name="ultrasound_date"
                      value={formData.ultrasound_date}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ultrasound Findings</label>
                    <textarea
                      name="ultrasound_findings"
                      value={formData.ultrasound_findings}
                      onChange={handleInputChange}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                </div>
              </div>

              {/* Section 7: High-Risk Indicators */}
              <div className="bg-gradient-to-br from-pink-50/50 to-rose-50/50 border border-gray-200 rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="w-4 h-4 text-pink-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">High-Risk Indicators</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hypertension</label>
                    <CustomSelect
                      value={formData.has_hypertension}
                      onChange={(value) => handleInputChange({ target: { name: 'has_hypertension', value } } as any)}
                      options={[
                        { value: '', label: 'Select' },
                        { value: 'Yes', label: 'Yes' },
                        { value: 'No', label: 'No' },
                      ]}
                      placeholder="Select"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gestational Diabetes</label>
                    <CustomSelect
                      value={formData.has_gestational_diabetes}
                      onChange={(value) => handleInputChange({ target: { name: 'has_gestational_diabetes', value } } as any)}
                      options={[
                        { value: '', label: 'Select' },
                        { value: 'Yes', label: 'Yes' },
                        { value: 'No', label: 'No' },
                      ]}
                      placeholder="Select"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Multiple Pregnancy</label>
                    <CustomSelect
                      value={formData.has_multiple_pregnancy}
                      onChange={(value) => handleInputChange({ target: { name: 'has_multiple_pregnancy', value } } as any)}
                      options={[
                        { value: '', label: 'Select' },
                        { value: 'Yes', label: 'Yes' },
                        { value: 'No', label: 'No' },
                      ]}
                      placeholder="Select"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Placenta Previa</label>
                    <CustomSelect
                      value={formData.has_placenta_previa}
                      onChange={(value) => handleInputChange({ target: { name: 'has_placenta_previa', value } } as any)}
                      options={[
                        { value: '', label: 'Select' },
                        { value: 'Yes', label: 'Yes' },
                        { value: 'No', label: 'No' },
                      ]}
                      placeholder="Select"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Preeclampsia</label>
                    <CustomSelect
                      value={formData.has_preeclampsia}
                      onChange={(value) => handleInputChange({ target: { name: 'has_preeclampsia', value } } as any)}
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

              {/* Navigation Buttons - Step 3 */}
              {!isEditing && (
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
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-xl hover:from-pink-600 hover:to-rose-700 font-medium shadow-lg transition-all"
                  >
                    Next
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
              </>
            )}

            {/* Step 4: Birth Preparedness & Screening */}
            {(currentStep === 4 || isEditing) && (
              <>
              {/* Section 8: Birth Preparedness */}
              <div className="bg-gradient-to-br from-pink-50/50 to-rose-50/50 border border-gray-200 rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center">
                    <HeartPulse className="w-4 h-4 text-pink-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Birth Preparedness</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Birth Plan</label>
                    <textarea
                      name="birth_plan"
                      value={formData.birth_plan}
                      onChange={handleInputChange}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Delivery Place</label>
                    <input
                      type="text"
                      name="preferred_delivery_place"
                      value={formData.preferred_delivery_place}
                      onChange={handleInputChange}
                      placeholder="e.g., Hospital, Lying-in"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">PhilHealth Member</label>
                    <CustomSelect
                      value={formData.philhealth_member}
                      onChange={(value) => handleInputChange({ target: { name: 'philhealth_member', value } } as any)}
                      options={[
                        { value: '', label: 'Select' },
                        { value: 'Yes', label: 'Yes' },
                        { value: 'No', label: 'No' },
                      ]}
                      placeholder="Select"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact Name</label>
                    <input
                      type="text"
                      name="emergency_contact"
                      value={formData.emergency_contact}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact Number</label>
                    <input
                      type="text"
                      name="emergency_contact_number"
                      value={formData.emergency_contact_number}
                      onChange={handleInputChange}
                      placeholder="09XXXXXXXXX"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                </div>
              </div>

              {/* Section 9: Immunization & Supplements */}
              <div className="bg-gradient-to-br from-pink-50/50 to-rose-50/50 border border-gray-200 rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center">
                    <Activity className="w-4 h-4 text-pink-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Immunization & Supplements</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">TT1 Date</label>
                    <input
                      type="date"
                      name="date_tt1"
                      value={formData.date_tt1}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">TT2 Date</label>
                    <input
                      type="date"
                      name="date_tt2"
                      value={formData.date_tt2}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">TT3 Date</label>
                    <input
                      type="date"
                      name="date_tt3"
                      value={formData.date_tt3}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">TT4 Date</label>
                    <input
                      type="date"
                      name="date_tt4"
                      value={formData.date_tt4}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">TT5 Date</label>
                    <input
                      type="date"
                      name="date_tt5"
                      value={formData.date_tt5}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">FIM Status</label>
                    <input
                      type="text"
                      name="fim_status"
                      value={formData.fim_status}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Iron + Folic Acid</label>
                    <input
                      type="text"
                      name="iron_folic"
                      value={formData.iron_folic}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Calcium</label>
                    <input
                      type="text"
                      name="calcium"
                      value={formData.calcium}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Iodine</label>
                    <input
                      type="text"
                      name="iodine"
                      value={formData.iodine}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Deworming</label>
                    <input
                      type="text"
                      name="deworm"
                      value={formData.deworm}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">BMI</label>
                    <input
                      type="text"
                      name="bmi"
                      value={formData.bmi}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                </div>
              </div>

              {/* Section 10: Screening & Remarks */}
              <div className="bg-gradient-to-br from-pink-50/50 to-rose-50/50 border border-gray-200 rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center">
                    <Activity className="w-4 h-4 text-pink-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Screening & Remarks</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Syphilis Screening</label>
                    <input
                      type="text"
                      name="syphilis_screening"
                      value={formData.syphilis_screening}
                      onChange={handleInputChange}
                      placeholder="e.g., Negative"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hepatitis B Screening</label>
                    <input
                      type="text"
                      name="hepa_b_screening"
                      value={formData.hepa_b_screening}
                      onChange={handleInputChange}
                      placeholder="e.g., Negative"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">HIV Screening</label>
                    <input
                      type="text"
                      name="hiv_screening"
                      value={formData.hiv_screening}
                      onChange={handleInputChange}
                      placeholder="e.g., Negative"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date Screened</label>
                    <input
                      type="date"
                      name="date_screened"
                      value={formData.date_screened}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Overall Result</label>
                    <input
                      type="text"
                      name="result"
                      value={formData.result}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                  <div className="md:col-span-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
                    <textarea
                      name="remarks"
                      value={formData.remarks}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                </div>
              </div>

              {/* Navigation Buttons - Step 4 / Edit Mode */}
              <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
                {!isEditing && currentStep === 4 && (
                  <button
                    type="button"
                    onClick={handleBackStep}
                    className="flex items-center gap-2 px-6 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 font-medium transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                    Back
                  </button>
                )}
                {isEditing && (
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-colors"
                  >
                    Cancel
                  </button>
                )}
                {(currentStep === 4 || isEditing) && (
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-xl hover:from-pink-600 hover:to-rose-700 font-medium shadow-lg hover:shadow-xl transition-all"
                  >
                    {isEditing ? 'Update Record' : 'Create Record'}
                  </button>
                )}
              </div>
              </>
            )}
            </form>
          </div>
        </div>
      )}

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
                    <h3 className="text-xl font-bold text-gray-900">Export Maternal Care Records</h3>
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
                    <HeartPulse className="w-4 h-4 text-emerald-600" />
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
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to delete this record? This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .maternal-care-modal input:focus,
        .maternal-care-modal select:focus,
        .maternal-care-modal textarea:focus {
          outline: none !important;
        }
        
        .maternal-care-modal input.border-red-300,
        .maternal-care-modal select.border-red-300,
        .maternal-care-modal textarea.border-red-300 {
          border-color: #fca5a5 !important;
          border-width: 2px !important;
        }
        
        .maternal-care-modal input.border-red-300:focus,
        .maternal-care-modal select.border-red-300:focus,
        .maternal-care-modal textarea.border-red-300:focus {
          border-color: #ef4444 !important;
          box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1) !important;
        }
      `}</style>
    </DashboardLayout>
  );
};

export default MaternalCareDashboardPage;
