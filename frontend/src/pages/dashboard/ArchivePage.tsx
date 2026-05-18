import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Archive, Search, ArchiveRestore, Trash2, Eye, Calendar, MapPin, User, 
  Filter, X, Baby, Heart, Users, Activity, AlertTriangle, Loader2, ChevronLeft, ChevronRight
} from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import CustomSelect from '@/components/CustomSelect';
import { immunizationService } from '@/services/immunizationService';
import { familyPlanningService } from '@/services/familyPlanningService';
import { maternalCareService } from '@/services/maternalCareService';
import { seniorCitizenService } from '@/services/seniorCitizenService';
import { barangayService } from '@/services/barangayService';
import { authService } from '@/services/authService';
import { ImmunizationRecord, FamilyPlanningRecord, MaternalCareRecord, SeniorCitizenRecord, Barangay } from '@/types';

type ArchivedRecord = ImmunizationRecord | FamilyPlanningRecord | MaternalCareRecord | SeniorCitizenRecord;
import { format } from 'date-fns';
import { toast } from 'react-toastify';

type ProgramType = 'immunization' | 'maternal' | 'family_planning' | 'senior';

export default function ArchivePage() {
  const [records, setRecords] = useState<ArchivedRecord[]>([]);
  const [barangays, setBarangays] = useState<Barangay[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProgram, setSelectedProgram] = useState<ProgramType>('immunization');
  const [filterBarangay, setFilterBarangay] = useState<number | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<ArchivedRecord | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [showRestoreAllModal, setShowRestoreAllModal] = useState(false);
  const [restorePassword, setRestorePassword] = useState('');
  const [restorePasswordError, setRestorePasswordError] = useState('');
  const [isRestoring, setIsRestoring] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    immunization: 0,
    maternal: 0,
    family_planning: 0,
    senior: 0,
  });

  useEffect(() => {
    fetchAllStats();
  }, []);

  useEffect(() => {
    fetchRecords();
    fetchBarangays();
  }, [selectedProgram, filterBarangay]);

  const fetchAllStats = async () => {
    try {
      const params = { status: 'archived' };
      const [immunizationRes, familyPlanningRes, maternalRes, seniorRes] = await Promise.all([
        immunizationService.getAll(params),
        familyPlanningService.getAll(params),
        maternalCareService.getAll(params),
        seniorCitizenService.getAll(params),
      ]);

      const immunizationCount = immunizationRes.data.data.length;
      const familyPlanningCount = familyPlanningRes.data.data.length;
      const maternalCount = maternalRes.length;
      const seniorCount = seniorRes.data.data.length;

      setStats({
        total: immunizationCount + familyPlanningCount + maternalCount + seniorCount,
        immunization: immunizationCount,
        maternal: maternalCount,
        family_planning: familyPlanningCount,
        senior: seniorCount,
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const params: any = { status: 'archived' };
      if (filterBarangay) params.barangay_id = filterBarangay;
      
      let data;
      switch (selectedProgram) {
        case 'immunization':
          const immunizationResponse = await immunizationService.getAll(params);
          data = immunizationResponse.data.data;
          break;
        case 'family_planning':
          const familyPlanningResponse = await familyPlanningService.getAll(params);
          data = familyPlanningResponse.data.data;
          break;
        case 'maternal':
          data = await maternalCareService.getAll(params);
          break;
        case 'senior':
          const seniorResponse = await seniorCitizenService.getAll(params);
          data = seniorResponse.data.data;
          break;
        default:
          data = [];
      }
      
      setRecords(data);
    } catch (error) {
      console.error('Failed to fetch archived records:', error);
      toast.error('Failed to load archived records');
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

  const handleRestore = async (id: number) => {
    try {
      let response;
      switch (selectedProgram) {
        case 'immunization':
          response = await immunizationService.toggleStatus(id);
          break;
        case 'family_planning':
          response = await familyPlanningService.toggleStatus(id);
          break;
        case 'maternal':
          response = await maternalCareService.toggleStatus(id);
          break;
        case 'senior':
          response = await seniorCitizenService.toggleStatus(id);
          break;
      }
      
      // Wait for backend confirmation before showing success
      if (response) {
        toast.success('Record restored successfully!');
        // Re-fetch data after backend confirms
        await fetchRecords();
        await fetchAllStats();
      }
    } catch (error: any) {
      console.error('Failed to restore record:', error);
      toast.error(error.response?.data?.message || 'Failed to restore record');
      // Don't refresh on error - keep record in list
    }
  };

  const handleRestoreAll = async () => {
    if (filteredRecords.length === 0) {
      toast.info('No records to restore');
      return;
    }

    setShowRestoreAllModal(true);
  };

  const handleRestoreAllConfirm = async () => {
    // Prevent submission if password is empty or already restoring
    if (!restorePassword || isRestoring) {
      return;
    }

    setIsRestoring(true);
    setLoading(true);

    try {
      // Verify password with backend
      const verifyResult = await authService.verifyPassword(restorePassword);
      
      if (!verifyResult.valid) {
        setRestorePasswordError('Incorrect password. Please try again.');
        setIsRestoring(false);
        setLoading(false);
        return;
      }

      // Password verified, proceed with restore one by one to ensure proper completion
      let successCount = 0;
      let failCount = 0;

      for (const record of filteredRecords) {
        try {
          switch (selectedProgram) {
            case 'immunization':
              await immunizationService.toggleStatus(record.id);
              break;
            case 'family_planning':
              await familyPlanningService.toggleStatus(record.id);
              break;
            case 'maternal':
              await maternalCareService.toggleStatus(record.id);
              break;
            case 'senior':
              await seniorCitizenService.toggleStatus(record.id);
              break;
          }
          successCount++;
        } catch (error) {
          console.error(`Failed to restore record ${record.id}:`, error);
          failCount++;
        }
      }

      // Close modal and clear state
      setShowRestoreAllModal(false);
      setRestorePassword('');
      setRestorePasswordError('');
      setIsRestoring(false);

      // Show appropriate message
      if (failCount === 0) {
        toast.success(`${successCount} record(s) restored successfully!`);
      } else if (successCount === 0) {
        toast.error('Failed to restore all records');
      } else {
        toast.warning(`${successCount} record(s) restored, ${failCount} failed`);
      }

      // Re-fetch data after all operations complete
      await fetchRecords();
      await fetchAllStats();
      setLoading(false);
    } catch (error: any) {
      console.error('Failed to restore records:', error);
      setIsRestoring(false);
      setLoading(false);
      
      // Check if it's a password verification error
      if (error.response?.status === 401) {
        setRestorePasswordError('Incorrect password. Please try again.');
      } else {
        toast.error('Failed to restore records');
        setShowRestoreAllModal(false);
        setRestorePassword('');
        setRestorePasswordError('');
      }
    }
  };

  const handleDelete = async (id: number) => {
    try {
      switch (selectedProgram) {
        case 'immunization':
          await immunizationService.delete(id);
          break;
        case 'family_planning':
          await familyPlanningService.delete(id);
          break;
        case 'maternal':
          await maternalCareService.delete(id);
          break;
        case 'senior':
          await seniorCitizenService.delete(id);
          break;
      }
      toast.success('Record permanently deleted!');
      fetchRecords();
      fetchAllStats();
      setDeleteConfirmId(null);
    } catch (error: any) {
      console.error('Failed to delete record:', error);
      toast.error(error.response?.data?.message || 'Failed to delete record');
    }
  };

  const handleViewRecord = (record: ArchivedRecord) => {
    setSelectedRecord(record);
    setShowViewModal(true);
  };

  const filteredRecords = records.filter(record => {
    const fullName = `${record.first_name || ''} ${record.middle_name || ''} ${record.last_name || ''}`.trim();
    return fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.barangay?.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Pagination
  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRecords = filteredRecords.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const programOptions = [
    { value: 'immunization', label: 'Immunization', icon: Baby, color: 'from-emerald-500 to-green-600' },
    { value: 'maternal', label: 'Maternal Care', icon: Heart, color: 'from-teal-500 to-emerald-600' },
    { value: 'family_planning', label: 'Family Planning', icon: Users, color: 'from-green-500 to-teal-600' },
    { value: 'senior', label: 'Senior Care', icon: Activity, color: 'from-cyan-500 to-teal-700' },
  ];

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-16 h-16 shadow-lg bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl">
              <Archive className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-transparent bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text">
                Archived Records
              </h1>
              <p className="flex items-center gap-2 mt-1 text-gray-600">
                <Archive className="w-4 h-4" />
                View and manage archived patient records
              </p>
            </div>
          </div>
          <button
            onClick={handleRestoreAll}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl hover:from-emerald-600 hover:to-green-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <ArchiveRestore className="w-5 h-5" />
            Restore All
          </button>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-gradient-to-br from-emerald-500 to-green-600 text-white rounded-xl p-4 shadow-md">
            <div className="text-sm opacity-90 mb-1">Total Archived</div>
            <div className="text-3xl font-bold">{stats.total}</div>
          </div>
          <div className="bg-gradient-to-br from-teal-500 to-teal-600 text-white rounded-xl p-4 shadow-md">
            <div className="text-sm opacity-90 mb-1">Immunization</div>
            <div className="text-3xl font-bold">{stats.immunization}</div>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-xl p-4 shadow-md">
            <div className="text-sm opacity-90 mb-1">Maternal Care</div>
            <div className="text-3xl font-bold">{stats.maternal}</div>
          </div>
          <div className="bg-gradient-to-br from-emerald-600 to-green-700 text-white rounded-xl p-4 shadow-md">
            <div className="text-sm opacity-90 mb-1">Family Planning</div>
            <div className="text-3xl font-bold">{stats.family_planning}</div>
          </div>
          <div className="bg-gradient-to-br from-cyan-500 to-teal-600 text-white rounded-xl p-4 shadow-md">
            <div className="text-sm opacity-90 mb-1">Senior Citizen</div>
            <div className="text-3xl font-bold">{stats.senior}</div>
          </div>
        </div>

        {/* Program Tabs */}
        <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
          {programOptions.map((program) => {
            const Icon = program.icon;
            return (
              <button
                key={program.value}
                onClick={() => setSelectedProgram(program.value as ProgramType)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 whitespace-nowrap ${
                  selectedProgram === program.value
                    ? `bg-gradient-to-r ${program.color} text-white shadow-lg transform scale-105`
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                <Icon className="w-5 h-5" />
                {program.label}
              </button>
            );
          })}
        </div>

        {/* Search and Filters */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or barangay..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-transparent"
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
                className="mt-4 pt-4 border-t border-gray-200"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Filter by Barangay
                    </label>
                    <CustomSelect
                      value={String(filterBarangay || '')}
                      onChange={(value) => setFilterBarangay(value ? Number(value) : null)}
                      options={[
                        { value: '', label: 'All Barangays' },
                        ...barangays.map((barangay) => ({
                          value: String(barangay.id),
                          label: barangay.name
                        }))
                      ]}
                      placeholder="All Barangays"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={() => {
                        setFilterBarangay(null);
                        setSearchTerm('');
                      }}
                      className="w-full px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition-colors"
                    >
                      Clear Filters
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Records Table */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-16 text-center">
              <div className="inline-flex items-center gap-3 text-gray-500">
                <Loader2 className="w-6 h-6 animate-spin" />
                Loading archived records...
              </div>
            </div>
          ) : filteredRecords.length === 0 ? (
            <div className="p-16 text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full">
                <Archive className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-lg text-gray-500">No archived records found</p>
              <p className="text-sm text-gray-400 mt-2">Archived records will appear here</p>
            </div>
          ) : (
            <>
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
                          <Archive className="w-4 h-4" />
                          Archive Date
                        </div>
                      </th>
                      <th className="px-6 py-4 text-xs font-semibold tracking-wider text-center text-gray-700 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {currentRecords.map((record, index) => {
                      const programOption = programOptions.find(p => p.value === selectedProgram);
                      const ProgramIcon = programOption?.icon || Activity;
                      
                      return (
                        <motion.tr
                          key={record.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="transition-all duration-200 hover:bg-emerald-50/50"
                        >
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm ${
                                record.sex === 'Male' ? 'bg-emerald-500' : 'bg-pink-500'
                              }`}>
                                {record.first_name?.charAt(0)}{record.last_name?.charAt(0)}
                              </div>
                              <div>
                                <div className="font-semibold text-gray-900">
                                  {`${record.first_name || ''} ${record.middle_name || ''} ${record.last_name || ''}`.trim()}
                                </div>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                    record.sex === 'Male' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'
                                  }`}>
                                    {record.sex}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200">
                              <ProgramIcon className="w-4 h-4" />
                              {programOption?.label}
                            </span>
                          </td>
                          <td className="px-6 py-5">
                            <div className="text-sm font-medium text-gray-900">
                              {record.barangay?.name || 'N/A'}
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <div className="text-sm text-gray-900">
                              {record.updated_at 
                                ? format(new Date(record.updated_at), 'MMM dd, yyyy')
                                : 'N/A'
                              }
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleViewRecord(record)}
                                className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                                title="View"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleRestore(record.id)}
                                className="p-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-lg hover:from-emerald-600 hover:to-green-700 transition-colors shadow-md"
                                title="Restore"
                              >
                                <ArchiveRestore className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setDeleteConfirmId(record.id)}
                                className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
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
                  Showing {startIndex + 1} to {Math.min(endIndex, filteredRecords.length)} of {filteredRecords.length} records
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  
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
                              ? 'bg-emerald-600 text-white'
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

      {/* View Modal */}
      <AnimatePresence>
        {showViewModal && selectedRecord && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowViewModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl"
            >
              <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-gray-200 bg-white/95 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-gray-600 to-gray-800">
                    <Archive className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Archived Record</h2>
                    <p className="text-sm text-gray-600">View only - restore to edit</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="p-2 text-gray-400 transition-colors rounded-lg hover:bg-gray-100 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Personal Information */}
                <div className="p-4 bg-gray-50 rounded-xl">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Full Name:</span>
                      <p className="font-medium text-gray-900">
                        {`${selectedRecord.first_name || ''} ${selectedRecord.middle_name || ''} ${selectedRecord.last_name || ''}`.trim()}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">Sex:</span>
                      <p className="font-medium text-gray-900">{selectedRecord.sex}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Date of Birth:</span>
                      <p className="font-medium text-gray-900">
                        {selectedRecord.date_of_birth ? format(new Date(selectedRecord.date_of_birth), 'MMM dd, yyyy') : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">Barangay:</span>
                      <p className="font-medium text-gray-900">{selectedRecord.barangay?.name}</p>
                    </div>
                  </div>
                </div>

                {/* Parent Information */}
                <div className="p-4 bg-gray-50 rounded-xl">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Parent/Guardian
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Mother's Name:</span>
                      <p className="font-medium text-gray-900">{selectedRecord.mother_name || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Father/Guardian:</span>
                      <p className="font-medium text-gray-900">{selectedRecord.father_guardian_name || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="p-4 bg-gray-50 rounded-xl">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Contact & Location
                  </h3>
                  <div className="grid grid-cols-1 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Address:</span>
                      <p className="font-medium text-gray-900">{selectedRecord.address || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Contact Number:</span>
                      <p className="font-medium text-gray-900">{selectedRecord.contact_no || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-gray-200 bg-gray-50">
                <button
                  onClick={() => setShowViewModal(false)}
                  className="w-full px-6 py-3 bg-gray-700 text-white rounded-xl hover:bg-gray-800 font-semibold transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Restore All Confirmation Modal */}
      <AnimatePresence>
        {showRestoreAllModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => {
              setShowRestoreAllModal(false);
              setRestorePassword('');
              setRestorePasswordError('');
              setIsRestoring(false);
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                  <ArchiveRestore className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Confirm Restore All</h3>
                  <p className="text-sm text-gray-600">Verify your identity</p>
                </div>
              </div>
              
              <p className="text-gray-700 mb-6">
                This will restore all {filteredRecords.length} archived record(s). This action cannot be undone.
              </p>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter your password to confirm
                </label>
                <input
                  type="password"
                  value={restorePassword}
                  onChange={(e) => {
                    setRestorePassword(e.target.value);
                    setRestorePasswordError('');
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      // Only call if password is not empty and not already restoring
                      if (restorePassword && !isRestoring) {
                        handleRestoreAllConfirm();
                      }
                    }
                  }}
                  placeholder="Enter password"
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                    restorePasswordError ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {restorePasswordError && (
                  <p className="text-red-600 text-sm mt-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    {restorePasswordError}
                  </p>
                )}
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowRestoreAllModal(false);
                    setRestorePassword('');
                    setRestorePasswordError('');
                    setIsRestoring(false);
                  }}
                  className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRestoreAllConfirm}
                  disabled={!restorePassword || isRestoring}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl font-semibold hover:from-emerald-600 hover:to-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  {isRestoring ? 'Restoring...' : 'Restore All'}
                </button>
              </div>
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
                  <h3 className="text-xl font-bold text-gray-900">Permanent Delete</h3>
                  <p className="text-sm text-gray-600">This action cannot be undone</p>
                </div>
              </div>
              
              <p className="text-gray-700 mb-6">
                Are you sure you want to permanently delete this record? This will remove all data and cannot be recovered.
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
                  Delete Forever
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
