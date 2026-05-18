import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Download, 
  Filter, 
  MapPin, 
  Users, 
  Calendar,
  FileSpreadsheet,
  FileDown,
  CheckCircle,
  X,
  Search,
  Loader2,
  Baby,
  Heart,
  UserCheck,
  Stethoscope
} from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';
import { toast } from 'react-toastify';
import api from '@/services/api';

interface Barangay {
  id: number;
  name: string;
}

interface Midwife {
  id: number;
  first_name: string;
  middle_name: string;
  last_name: string;
  barangay_id: number;
  barangay_name: string;
}

interface Patient {
  id: number;
  name: string;
  program: string;
  midwife_id: number;
  midwife_name: string;
  barangay_name: string;
}

type ProgramType = 'all' | 'immunization' | 'maternal_care' | 'family_planning' | 'senior_citizen';

export default function ReportsPage() {
  // Filter states
  const [selectedProgram, setSelectedProgram] = useState<ProgramType>('all');
  const [selectedBarangays, setSelectedBarangays] = useState<number[]>([]);
  const [selectedMidwives, setSelectedMidwives] = useState<number[]>([]);
  const [selectedPatients, setSelectedPatients] = useState<number[]>([]);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  
  // Data states
  const [barangays, setBarangays] = useState<Barangay[]>([]);
  const [midwives, setMidwives] = useState<Midwife[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  
  // UI states
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [loadingPatients, setLoadingPatients] = useState(false);
  const [showFilters, setShowFilters] = useState(true);
  const [searchBarangay, setSearchBarangay] = useState('');
  const [searchMidwife, setSearchMidwife] = useState('');
  const [searchPatient, setSearchPatient] = useState('');

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (selectedBarangays.length > 0) {
      fetchMidwivesByBarangays();
    } else {
      setMidwives([]);
      setSelectedMidwives([]);
    }
  }, [selectedBarangays]);

  useEffect(() => {
    if (selectedProgram !== 'all' || selectedMidwives.length > 0 || selectedBarangays.length > 0) {
      fetchPatients();
    } else {
      setPatients([]);
      setSelectedPatients([]);
    }
  }, [selectedProgram, selectedMidwives, selectedBarangays]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/barangays');
      setBarangays(response.data);
    } catch (error) {
      console.error('Error fetching barangays:', error);
      toast.error('Failed to load barangays');
    } finally {
      setLoading(false);
    }
  };

  const fetchMidwivesByBarangays = async () => {
    try {
      const response = await api.get('/admin/midwives', {
        params: { barangay_ids: selectedBarangays.join(',') }
      });
      setMidwives(response.data);
    } catch (error) {
      console.error('Error fetching midwives:', error);
      toast.error('Failed to load midwives');
    }
  };

  const fetchPatients = async () => {
    try {
      setLoadingPatients(true);
      const params: any = {};
      if (selectedProgram !== 'all') params.program = selectedProgram;
      if (selectedMidwives.length > 0) params.midwife_ids = selectedMidwives.join(',');
      if (selectedBarangays.length > 0) params.barangay_ids = selectedBarangays.join(',');
      
      const response = await api.get('/admin/patients', { params });
      setPatients(response.data);
    } catch (error) {
      console.error('Error fetching patients:', error);
      toast.error('Failed to load patients');
      setPatients([]);
    } finally {
      setLoadingPatients(false);
    }
  };

  const handleDownload = async (format: 'pdf' | 'excel') => {
    if (selectedBarangays.length === 0 && selectedMidwives.length === 0 && selectedPatients.length === 0) {
      toast.warning('Please select at least one filter option');
      return;
    }

    try {
      setDownloading(true);
      
      const params: any = {
        format,
        program: selectedProgram,
        barangay_ids: selectedBarangays.join(','),
        midwife_ids: selectedMidwives.join(','),
        patient_ids: selectedPatients.join(','),
        date_from: dateFrom,
        date_to: dateTo
      };

      const response = await api.get('/admin/reports/download', {
        params,
        responseType: 'blob'
      });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `report_${new Date().getTime()}.${format === 'pdf' ? 'pdf' : 'xlsx'}`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success(`${format.toUpperCase()} report downloaded successfully!`);
    } catch (error) {
      console.error('Error downloading report:', error);
      toast.error('Failed to download report');
    } finally {
      setDownloading(false);
    }
  };

  const toggleBarangay = (id: number) => {
    setSelectedBarangays(prev => 
      prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]
    );
  };

  const toggleMidwife = (id: number) => {
    setSelectedMidwives(prev => 
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  const togglePatient = (id: number) => {
    setSelectedPatients(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const clearAllFilters = () => {
    setSelectedProgram('all');
    setSelectedBarangays([]);
    setSelectedMidwives([]);
    setSelectedPatients([]);
    setDateFrom('');
    setDateTo('');
  };

  const programs = [
    { id: 'all' as const, name: 'All Programs', icon: FileText, color: 'from-primary-600 to-primary-500' },
    { id: 'immunization' as const, name: 'Immunization', icon: Baby, color: 'from-primary-600 to-primary-500' },
    { id: 'maternal_care' as const, name: 'Maternal Care', icon: Heart, color: 'from-primary-600 to-primary-500' },
    { id: 'family_planning' as const, name: 'Family Planning', icon: Users, color: 'from-primary-600 to-primary-500' },
    { id: 'senior_citizen' as const, name: 'Senior Citizen', icon: UserCheck, color: 'from-primary-600 to-primary-500' },
  ];

  const filteredBarangays = barangays.filter(b => 
    b.name?.toLowerCase().includes(searchBarangay.toLowerCase())
  );

  const filteredMidwives = midwives.filter(m => 
    `${m.first_name || ''} ${m.last_name || ''}`.toLowerCase().includes(searchMidwife.toLowerCase())
  );

  const filteredPatients = patients.filter(p => 
    (p.name || '').toLowerCase().includes(searchPatient.toLowerCase())
  );

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-16 h-16 shadow-lg bg-gradient-to-br from-primary-600 to-primary-500 rounded-2xl">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-transparent bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text">
                Reports & Analytics
              </h1>
              <p className="flex items-center gap-2 mt-1 text-gray-600">
                <Download className="w-4 h-4" />
                Generate and download comprehensive reports
              </p>
            </div>
          </div>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all"
          >
            <Filter className="w-5 h-5 text-primary-600" />
            <span className="font-semibold text-gray-700">
              {showFilters ? 'Hide' : 'Show'} Filters
            </span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Filters Section */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1 space-y-6"
            >
              {/* Program Selection */}
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-gray-900">Select Program</h2>
                  <Stethoscope className="w-5 h-5 text-primary-600" />
                </div>
                
                <div className="space-y-2">
                  {programs.map((program) => {
                    const Icon = program.icon;
                    return (
                      <button
                        key={program.id}
                        onClick={() => setSelectedProgram(program.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all ${
                          selectedProgram === program.id
                            ? `bg-gradient-to-r ${program.color} text-white shadow-lg`
                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        {program.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Date Range */}
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-gray-900">Date Range</h2>
                  <Calendar className="w-5 h-5 text-primary-600" />
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
                    <input
                      type="date"
                      value={dateFrom}
                      onChange={(e) => setDateFrom(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
                    <input
                      type="date"
                      value={dateTo}
                      onChange={(e) => setDateTo(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Clear Filters */}
              <button
                onClick={clearAllFilters}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-50 text-red-600 rounded-xl font-semibold hover:bg-red-100 transition-all"
              >
                <X className="w-5 h-5" />
                Clear All Filters
              </button>
            </motion.div>
          )}

          {/* Selection Section */}
          <div className={showFilters ? 'lg:col-span-2' : 'lg:col-span-3'}>
            <div className="space-y-6">
              {/* Barangay Selection */}
              <motion.div
                key="barangay-selection"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-6 h-6 text-primary-600" />
                    <h2 className="text-xl font-bold text-gray-900">Select Barangays</h2>
                  </div>
                  <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-lg text-sm font-bold">
                    {selectedBarangays.length} selected
                  </span>
                </div>

                <div className="mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search barangays..."
                      value={searchBarangay}
                      onChange={(e) => setSearchBarangay(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-64 overflow-y-auto">
                  {filteredBarangays.map((barangay) => (
                    <button
                      key={barangay.id}
                      onClick={() => toggleBarangay(barangay.id)}
                      className={`flex items-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm transition-all ${
                        selectedBarangays.includes(barangay.id)
                          ? 'bg-primary-500 text-white shadow-lg'
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {selectedBarangays.includes(barangay.id) && (
                        <CheckCircle className="w-4 h-4" />
                      )}
                      {barangay.name}
                    </button>
                  ))}
                </div>
              </motion.div>

              {/* Midwife Selection */}
              {selectedBarangays.length > 0 && (
                <motion.div
                  key="midwife-selection"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Stethoscope className="w-6 h-6 text-teal-600" />
                      <h2 className="text-xl font-bold text-gray-900">Select Midwives</h2>
                    </div>
                    <span className="px-3 py-1 bg-teal-100 text-teal-700 rounded-lg text-sm font-bold">
                      {selectedMidwives.length} selected
                    </span>
                  </div>

                  <div className="mb-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search midwives..."
                        value={searchMidwife}
                        onChange={(e) => setSearchMidwife(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {filteredMidwives.map((midwife) => (
                      <button
                        key={midwife.id}
                        onClick={() => toggleMidwife(midwife.id)}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-semibold text-sm transition-all ${
                          selectedMidwives.includes(midwife.id)
                            ? 'bg-teal-500 text-white shadow-lg'
                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <span>{`${midwife.first_name} ${midwife.middle_name ? midwife.middle_name + ' ' : ''}${midwife.last_name}`}</span>
                        <span className="text-xs opacity-75">{midwife.barangay_name}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Patient Selection */}
              {(selectedProgram !== 'all' || selectedBarangays.length > 0 || selectedMidwives.length > 0) && (
                <motion.div
                  key="patient-selection"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Users className="w-6 h-6 text-blue-600" />
                      <h2 className="text-xl font-bold text-gray-900">Select Patients</h2>
                    </div>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm font-bold">
                      {selectedPatients.length} selected
                    </span>
                  </div>

                  <div className="mb-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search patients..."
                        value={searchPatient}
                        onChange={(e) => setSearchPatient(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {loadingPatients ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
                      </div>
                    ) : filteredPatients.length > 0 ? (
                      filteredPatients.map((patient) => (
                        <button
                          key={patient.id}
                          onClick={() => togglePatient(patient.id)}
                          className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-semibold text-sm transition-all ${
                            selectedPatients.includes(patient.id)
                              ? 'bg-blue-500 text-white shadow-lg'
                              : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          <div className="flex flex-col items-start">
                            <span>{patient.name}</span>
                            <span className="text-xs opacity-75">{patient.program}</span>
                          </div>
                          <div className="flex flex-col items-end text-xs opacity-75">
                            <span>{patient.midwife_name}</span>
                            <span>{patient.barangay_name}</span>
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No patients found with the selected filters</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Download Buttons */}
              <motion.div
                key="download-section"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="bg-gradient-to-br from-primary-50 to-green-50 border-2 border-primary-200 rounded-2xl p-6 shadow-lg"
              >
                <h2 className="text-xl font-bold text-gray-900 mb-4">Download Report</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={() => handleDownload('excel')}
                    disabled={downloading}
                    className="flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-xl hover:from-primary-700 hover:to-primary-600 font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                  >
                    {downloading ? (
                      <>
                        <Loader2 className="w-6 h-6 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <FileSpreadsheet className="w-6 h-6" />
                        Download Excel
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={() => handleDownload('pdf')}
                    disabled={downloading}
                    className="flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-xl hover:from-red-700 hover:to-rose-700 font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                  >
                    {downloading ? (
                      <>
                        <Loader2 className="w-6 h-6 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <FileDown className="w-6 h-6" />
                        Download PDF
                      </>
                    )}
                  </button>
                </div>

                {/* Summary */}
                <div className="mt-6 p-4 bg-white rounded-xl border border-primary-200">
                  <h3 className="font-bold text-gray-900 mb-3">Report Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Program:</span>
                      <span className="font-semibold text-gray-900">
                        {programs.find(p => p.id === selectedProgram)?.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Barangays:</span>
                      <span className="font-semibold text-gray-900">
                        {selectedBarangays.length || 'All'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Midwives:</span>
                      <span className="font-semibold text-gray-900">
                        {selectedMidwives.length || 'All'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Patients:</span>
                      <span className="font-semibold text-gray-900">
                        {selectedPatients.length || 'All'}
                      </span>
                    </div>
                    {dateFrom && dateTo && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Date Range:</span>
                        <span className="font-semibold text-gray-900">
                          {dateFrom} to {dateTo}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </AdminLayout>
  );
}
