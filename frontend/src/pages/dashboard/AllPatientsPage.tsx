import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Search, Filter, ChevronLeft, ChevronRight, 
  User, MapPin, Phone, Calendar, Activity, TrendingUp,
  Baby, Heart, HeartPulse, Stethoscope, Loader2, ArrowUpDown, X, Plus, ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import CustomSelect from '@/components/CustomSelect';
import { immunizationService } from '@/services/immunizationService';
import { familyPlanningService } from '@/services/familyPlanningService';
import { maternalCareService } from '@/services/maternalCareService';
import { seniorCitizenService } from '@/services/seniorCitizenService';
import { barangayService } from '@/services/barangayService';
import { Barangay } from '@/types';
import { toast } from 'react-toastify';
import { useAuthStore } from '@/store/authStore';

interface PatientRecord {
  id: number;
  first_name: string;
  middle_name?: string;
  last_name: string;
  sex: 'Male' | 'Female';
  age?: number;
  contact_no?: string;
  barangay?: Barangay;
  program: 'Immunization' | 'Family Planning' | 'Maternal Care' | 'Senior Citizen';
  status: 'active' | 'archived';
  updated_at?: string;
}

export default function AllPatientsPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [patients, setPatients] = useState<PatientRecord[]>([]);
  const [barangays, setBarangays] = useState<Barangay[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterProgram, setFilterProgram] = useState<string>('all');
  const [filterBarangay, setFilterBarangay] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedPatient, setSelectedPatient] = useState<PatientRecord | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const itemsPerPage = 10;

  // Statistics
  const [stats, setStats] = useState({
    total: 0,
    immunization: 0,
    familyPlanning: 0,
    maternalCare: 0,
    seniorCitizen: 0,
  });

  useEffect(() => {
    fetchAllPatients();
  }, []);

  const fetchBarangays = async () => {
    // No longer needed - using user.barangays from auth store
  };

  const fetchAllPatients = async () => {
    try {
      setLoading(true);
      
      // Fetch from all services
      const [immunization, familyPlanning, maternalCare, seniorCitizen] = await Promise.all([
        immunizationService.getAll({ status: 'active' }),
        familyPlanningService.getAll({ status: 'active' }),
        maternalCareService.getAll(),
        seniorCitizenService.getAll({ status: 'active' }),
      ]);

      // Transform and combine all records
      const allPatients: PatientRecord[] = [
        ...immunization.data.data.map((r: any) => ({ ...r, program: 'Immunization' as const })),
        ...familyPlanning.data.data.map((r: any) => ({ ...r, program: 'Family Planning' as const })),
        ...maternalCare.map((r: any) => ({ ...r, program: 'Maternal Care' as const })),
        ...seniorCitizen.data.data.map((r: any) => ({ ...r, program: 'Senior Citizen' as const })),
      ];

      setPatients(allPatients);

      // Calculate statistics
      setStats({
        total: allPatients.length,
        immunization: immunization.data.data.length,
        familyPlanning: familyPlanning.data.data.length,
        maternalCare: maternalCare.length,
        seniorCitizen: seniorCitizen.data.data.length,
      });
    } catch (error) {
      console.error('Failed to fetch patients:', error);
      toast.error('Failed to load patient records');
    } finally {
      setLoading(false);
    }
  };

  // Filter patients
  const filteredPatients = patients.filter(patient => {
    const fullName = `${patient.first_name || ''} ${patient.middle_name || ''} ${patient.last_name || ''}`.trim();
    const matchesSearch = fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.contact_no?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProgram = filterProgram === 'all' || patient.program === filterProgram;
    const matchesBarangay = !filterBarangay || patient.barangay?.id === filterBarangay;
    
    return matchesSearch && matchesProgram && matchesBarangay;
  }).sort((a, b) => {
    const nameA = `${a.first_name || ''} ${a.last_name || ''}`.trim().toLowerCase();
    const nameB = `${b.first_name || ''} ${b.last_name || ''}`.trim().toLowerCase();
    return sortOrder === 'asc' ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
  });

  // Calculate filtered stats
  const filteredStats = {
    total: filteredPatients.length,
    immunization: filteredPatients.filter(p => p.program === 'Immunization').length,
    familyPlanning: filteredPatients.filter(p => p.program === 'Family Planning').length,
    maternalCare: filteredPatients.filter(p => p.program === 'Maternal Care').length,
    seniorCitizen: filteredPatients.filter(p => p.program === 'Senior Citizen').length,
  };

  // Pagination
  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPatients = filteredPatients.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getProgramColor = (program: string) => {
    switch (program) {
      case 'Immunization': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Family Planning': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Maternal Care': return 'bg-pink-100 text-pink-700 border-pink-200';
      case 'Senior Citizen': return 'bg-orange-100 text-orange-700 border-orange-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getProgramIcon = (program: string) => {
    switch (program) {
      case 'Immunization': return Baby;
      case 'Family Planning': return Heart;
      case 'Maternal Care': return HeartPulse;
      case 'Senior Citizen': return Stethoscope;
      default: return User;
    }
  };

  const handleViewPatient = (patient: PatientRecord) => {
    setSelectedPatient(patient);
    setShowModal(true);
  };

  const handleProgramSelect = (program: string) => {
    setShowAddModal(false);
    
    // Navigate to the appropriate program page
    switch (program) {
      case 'Immunization':
        navigate('/dashboard/immunization');
        break;
      case 'Family Planning':
        navigate('/dashboard/family-planning');
        break;
      case 'Maternal Care':
        navigate('/dashboard/maternal-care');
        break;
      case 'Senior Citizen':
        navigate('/dashboard/senior-citizen');
        break;
    }
  };

  const handleBackToStep1 = () => {
    // Not needed anymore since we're navigating away
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
  };

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-16 h-16 shadow-lg bg-gradient-to-br from-primary-600 to-primary-500 rounded-2xl">
              <Users className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-transparent bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text">All Patients</h1>
              <p className="flex items-center gap-2 mt-1 text-gray-600">
                <Activity className="w-4 h-4" />
                Comprehensive patient records across all programs
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl hover:from-emerald-600 hover:to-green-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <Plus className="w-5 h-5" />
            Add New Record
          </button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-6 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl shadow-lg text-white relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-2">
              <Users className="w-8 h-8 opacity-80" />
              <TrendingUp className="w-5 h-5 opacity-60" />
            </div>
            <div className="text-3xl font-bold mb-1">{stats.total}</div>
            <div className="text-sm opacity-90">Total Patients</div>
            {filteredStats.total !== stats.total && (
              <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-bold">
                {filteredStats.total} filtered
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-6 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl shadow-lg text-white relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-2">
              <Baby className="w-8 h-8 opacity-80" />
            </div>
            <div className="text-3xl font-bold mb-1">{stats.immunization}</div>
            <div className="text-sm opacity-90">Immunization</div>
            {filteredStats.immunization !== stats.immunization && (
              <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-bold">
                {filteredStats.immunization} filtered
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg text-white relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-2">
              <Heart className="w-8 h-8 opacity-80" />
            </div>
            <div className="text-3xl font-bold mb-1">{stats.familyPlanning}</div>
            <div className="text-sm opacity-90">Family Planning</div>
            {filteredStats.familyPlanning !== stats.familyPlanning && (
              <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-bold">
                {filteredStats.familyPlanning} filtered
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="p-6 bg-gradient-to-br from-emerald-600 to-green-700 rounded-2xl shadow-lg text-white relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-2">
              <HeartPulse className="w-8 h-8 opacity-80" />
            </div>
            <div className="text-3xl font-bold mb-1">{stats.maternalCare}</div>
            <div className="text-sm opacity-90">Maternal Care</div>
            {filteredStats.maternalCare !== stats.maternalCare && (
              <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-bold">
                {filteredStats.maternalCare} filtered
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="p-6 bg-gradient-to-br from-green-400 to-teal-500 rounded-2xl shadow-lg text-white relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-2">
              <Stethoscope className="w-8 h-8 opacity-80" />
            </div>
            <div className="text-3xl font-bold mb-1">{stats.seniorCitizen}</div>
            <div className="text-sm opacity-90">Senior Citizen</div>
            {filteredStats.seniorCitizen !== stats.seniorCitizen && (
              <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-bold">
                {filteredStats.seniorCitizen} filtered
              </div>
            )}
          </motion.div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or contact number..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                showFilters
                  ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Filter className="w-5 h-5" />
              Filters
            </button>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="mt-4 pt-4 border-t border-gray-200"
              >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Filter by Program
                  </label>
                  <CustomSelect
                    value={filterProgram}
                    onChange={(value) => {
                      setFilterProgram(value);
                      setCurrentPage(1);
                    }}
                    options={[
                      { value: 'all', label: 'All Programs' },
                      { value: 'Immunization', label: 'Immunization' },
                      { value: 'Family Planning', label: 'Family Planning' },
                      { value: 'Maternal Care', label: 'Maternal Care' },
                      { value: 'Senior Citizen', label: 'Senior Citizen' },
                    ]}
                    placeholder="All Programs"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Filter by Barangay
                  </label>
                  <CustomSelect
                    value={String(filterBarangay || '')}
                    onChange={(value) => {
                      setFilterBarangay(value ? Number(value) : null);
                      setCurrentPage(1);
                    }}
                    options={[
                      { value: '', label: 'All Barangays' },
                      ...(user?.barangays || []).map((barangay) => ({
                        value: String(barangay.id),
                        label: barangay.name
                      }))
                    ]}
                    placeholder="All Barangays"
                  />
                </div>
              </div>
              <div className="mt-4">
                <button
                  onClick={() => {
                    setFilterProgram('all');
                    setFilterBarangay(null);
                    setSearchTerm('');
                    setCurrentPage(1);
                  }}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Patients Table */}
        <div className="overflow-hidden bg-white border border-gray-100 shadow-sm rounded-2xl">
          {loading ? (
            <div className="p-16 text-center">
              <div className="inline-flex items-center gap-3 text-gray-500">
                <Loader2 className="w-6 h-6 animate-spin" />
                Loading patients...
              </div>
            </div>
          ) : currentPatients.length === 0 ? (
            <div className="p-16 text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full">
                <Users className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-lg text-gray-500">No patients found</p>
              <p className="text-sm text-gray-400 mt-2">Try adjusting your search or filters</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-700 uppercase">
                        <button
                          onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                          className="flex items-center gap-2 hover:text-emerald-600 transition-colors"
                        >
                          <User className="w-4 h-4" />
                          Patient Information
                          <ArrowUpDown className="w-3 h-3" />
                        </button>
                      </th>
                      <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-700 uppercase">
                        <div className="flex items-center gap-2">
                          <Activity className="w-4 h-4" />
                          Program
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
                      <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-700 uppercase">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          Last Visited
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {currentPatients.map((patient, index) => {
                      const ProgramIcon = getProgramIcon(patient.program);
                      return (
                        <motion.tr
                          key={`${patient.program}-${patient.id}`}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          onClick={() => handleViewPatient(patient)}
                          className="transition-all duration-200 hover:bg-emerald-50/50 cursor-pointer"
                        >
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm ${
                                patient.sex === 'Male' ? 'bg-blue-500' : 'bg-pink-500'
                              }`}>
                                {patient.first_name?.charAt(0)}{patient.last_name?.charAt(0)}
                              </div>
                              <div>
                                <div className="font-semibold text-gray-900">
                                  {`${patient.first_name || ''} ${patient.middle_name || ''} ${patient.last_name || ''}`.trim()}
                                </div>
                                <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                    patient.sex === 'Male' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'
                                  }`}>
                                    {patient.sex}
                                  </span>
                                  {patient.age && <span>• Age: {patient.age}</span>}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border ${getProgramColor(patient.program)}`}>
                              <ProgramIcon className="w-4 h-4" />
                              {patient.program}
                            </span>
                          </td>
                          <td className="px-6 py-5">
                            <div className="text-sm font-medium text-gray-900">
                              {patient.barangay?.name || 'N/A'}
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <div className="text-sm text-gray-900">
                              {patient.contact_no || 'N/A'}
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <div className="text-sm text-gray-900">
                              {patient.updated_at 
                                ? new Date(patient.updated_at).toLocaleDateString('en-US', { 
                                    month: 'short', 
                                    day: 'numeric', 
                                    year: 'numeric' 
                                  })
                                : 'N/A'
                              }
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
                <div className="text-sm text-gray-600">
                  Showing {startIndex + 1} to {Math.min(endIndex, filteredPatients.length)} of {filteredPatients.length} patients
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  
                  {/* Page Numbers */}
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                            currentPage === pageNum
                              ? 'bg-indigo-600 text-white'
                              : 'text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    {totalPages > 5 && currentPage < totalPages - 2 && (
                      <>
                        <span className="px-2 text-gray-400">...</span>
                        <button
                          onClick={() => handlePageChange(totalPages)}
                          className="px-3 py-1.5 rounded-lg font-medium text-gray-600 hover:bg-gray-200 transition-colors"
                        >
                          {totalPages}
                        </button>
                      </>
                    )}
                  </div>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </motion.div>

      {/* View Patient Modal */}
      <AnimatePresence>
        {showModal && selectedPatient && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl p-6 bg-white shadow-2xl rounded-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Patient Details</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 text-gray-500 transition-colors rounded-lg hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Patient Name */}
                <div className="p-4 rounded-xl bg-gray-50">
                  <div className="text-sm font-semibold text-gray-600">Full Name</div>
                  <div className="text-lg font-bold text-gray-900">
                    {`${selectedPatient.first_name || ''} ${selectedPatient.middle_name || ''} ${selectedPatient.last_name || ''}`.trim()}
                  </div>
                </div>

                {/* Program Badge */}
                <div className="p-4 rounded-xl bg-gray-50">
                  <div className="text-sm font-semibold text-gray-600 mb-2">Program</div>
                  <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold border ${getProgramColor(selectedPatient.program)}`}>
                    {(() => {
                      const ProgramIcon = getProgramIcon(selectedPatient.program);
                      return <ProgramIcon className="w-4 h-4" />;
                    })()}
                    {selectedPatient.program}
                  </span>
                </div>

                {/* Patient Info Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-gray-50">
                    <div className="text-sm font-semibold text-gray-600">Sex</div>
                    <div className="font-bold text-gray-900">{selectedPatient.sex}</div>
                  </div>
                  <div className="p-4 rounded-xl bg-gray-50">
                    <div className="text-sm font-semibold text-gray-600">Age</div>
                    <div className="font-bold text-gray-900">{selectedPatient.age || 'N/A'}</div>
                  </div>
                </div>

                {/* Contact & Location */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-gray-50">
                    <div className="text-sm font-semibold text-gray-600">Contact Number</div>
                    <div className="font-bold text-gray-900">{selectedPatient.contact_no || 'N/A'}</div>
                  </div>
                  <div className="p-4 rounded-xl bg-gray-50">
                    <div className="text-sm font-semibold text-gray-600">Barangay</div>
                    <div className="font-bold text-gray-900">{selectedPatient.barangay?.name || 'N/A'}</div>
                  </div>
                </div>

                {/* Last Visited */}
                <div className="p-4 rounded-xl bg-gray-50">
                  <div className="text-sm font-semibold text-gray-600">Last Visited</div>
                  <div className="font-bold text-gray-900">
                    {selectedPatient.updated_at 
                      ? new Date(selectedPatient.updated_at).toLocaleDateString('en-US', { 
                          month: 'long', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })
                      : 'N/A'
                    }
                  </div>
                </div>

                {/* Status */}
                <div className="p-4 rounded-xl bg-gray-50">
                  <div className="text-sm font-semibold text-gray-600">Status</div>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold mt-1 ${
                    selectedPatient.status === 'active' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {selectedPatient.status === 'active' ? 'Active' : 'Archived'}
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <button
                  onClick={() => setShowModal(false)}
                  className="w-full px-4 py-3 font-semibold text-white transition-all rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 shadow-lg"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add New Record Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={handleCloseAddModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-3xl p-6 bg-white shadow-2xl rounded-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Select Program</h2>
                  <p className="text-sm text-gray-600 mt-1">Choose a program to add a new patient record</p>
                </div>
                <button
                  onClick={handleCloseAddModal}
                  className="p-2 text-gray-500 transition-colors rounded-lg hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Program Selection Cards */}
              <div className="grid grid-cols-2 gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleProgramSelect('Immunization')}
                  className="p-6 bg-gradient-to-br from-cyan-500 to-teal-600 rounded-2xl shadow-lg text-white text-left transition-all hover:shadow-xl"
                >
                  <Baby className="w-12 h-12 mb-3 opacity-90" />
                  <h3 className="text-xl font-bold">Immunization</h3>
                  <p className="text-sm opacity-80 mt-1">Add child immunization record</p>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleProgramSelect('Family Planning')}
                  className="p-6 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-2xl shadow-lg text-white text-left transition-all hover:shadow-xl"
                >
                  <Heart className="w-12 h-12 mb-3 opacity-90" />
                  <h3 className="text-xl font-bold">Family Planning</h3>
                  <p className="text-sm opacity-80 mt-1">Add family planning record</p>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleProgramSelect('Maternal Care')}
                  className="p-6 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl shadow-lg text-white text-left transition-all hover:shadow-xl"
                >
                  <HeartPulse className="w-12 h-12 mb-3 opacity-90" />
                  <h3 className="text-xl font-bold">Maternal Care</h3>
                  <p className="text-sm opacity-80 mt-1">Add maternal care record</p>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleProgramSelect('Senior Citizen')}
                  className="p-6 bg-gradient-to-br from-green-500 to-teal-700 rounded-2xl shadow-lg text-white text-left transition-all hover:shadow-xl"
                >
                  <Stethoscope className="w-12 h-12 mb-3 opacity-90" />
                  <h3 className="text-xl font-bold">Senior Citizen</h3>
                  <p className="text-sm opacity-80 mt-1">Add senior citizen record</p>
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
