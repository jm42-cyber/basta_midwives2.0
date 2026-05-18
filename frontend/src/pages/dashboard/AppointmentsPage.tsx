import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import CustomSelect from '@/components/CustomSelect';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  Clock,
  Plus,
  Search,
  Filter,
  X,
  Check,
  AlertCircle,
  User,
  MapPin,
  Phone,
  Mail,
  Edit,
  Trash2,
  Eye,
  Loader2,
  List,
  CalendarDays,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import api from '@/services/api';
import { toast } from 'react-toastify';

interface Appointment {
  id: number;
  patient_name: string;
  contact_number?: string;
  email?: string;
  appointment_type: string;
  service?: string;
  appointment_date: string;
  appointment_time: string;
  barangay_id: number;
  barangay_name?: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  assigned_staff?: string;
  notes?: string;
  created_at: string;
}

export default function AppointmentsPage() {
  const { user } = useAuthStore();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showDateRangeDropdown, setShowDateRangeDropdown] = useState(false);
  const [dateRange, setDateRange] = useState<string>('all');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [perPage] = useState(10);
  const [formData, setFormData] = useState({
    patient_name: '',
    contact_number: '',
    email: '',
    appointment_type: 'Immunization',
    service: '',
    appointment_date: '',
    appointment_time: '',
    barangay_id: '',
    assigned_staff: '',
    status: 'scheduled',
    notes: ''
  });

  useEffect(() => {
    fetchAppointments();
  }, [currentPage]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/appointments?page=${currentPage}&per_page=${perPage}`);
      setAppointments(response.data.data);
      setTotalPages(response.data.last_page);
    } catch (error) {
      console.error('Failed to fetch appointments:', error);
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setModalMode('create');
    setFormData({
      patient_name: '',
      contact_number: '',
      email: '',
      appointment_type: 'Immunization',
      service: '',
      appointment_date: '',
      appointment_time: '',
      barangay_id: user?.barangays[0]?.id.toString() || '',
      assigned_staff: '',
      status: 'scheduled',
      notes: ''
    });
    setShowModal(true);
  };

  const handleEdit = (appointment: Appointment) => {
    setModalMode('edit');
    setSelectedAppointment(appointment);
    setFormData({
      patient_name: appointment.patient_name,
      contact_number: appointment.contact_number || '',
      email: appointment.email || '',
      appointment_type: appointment.appointment_type,
      service: appointment.service || '',
      appointment_date: appointment.appointment_date,
      appointment_time: appointment.appointment_time,
      barangay_id: appointment.barangay_id.toString(),
      assigned_staff: appointment.assigned_staff || '',
      status: appointment.status,
      notes: appointment.notes || ''
    });
    setShowModal(true);
  };

  const handleView = (appointment: Appointment) => {
    setModalMode('view');
    setSelectedAppointment(appointment);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (modalMode === 'create') {
        await api.post('/appointments', formData);
        toast.success('Appointment created successfully');
      } else if (modalMode === 'edit' && selectedAppointment) {
        await api.put(`/appointments/${selectedAppointment.id}`, formData);
        toast.success('Appointment updated successfully');
      }
      
      setShowModal(false);
      setCurrentPage(1);
      fetchAppointments();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save appointment');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this appointment?')) return;
    
    try {
      await api.delete(`/appointments/${id}`);
      toast.success('Appointment deleted successfully');
      
      // If deleting the last item on a page, go to previous page
      if (appointments.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      } else {
        fetchAppointments();
      }
    } catch (error) {
      toast.error('Failed to delete appointment');
    }
  };

  const handleStatusChange = async (id: number, status: string) => {
    try {
      await api.patch(`/appointments/${id}/status`, { status });
      toast.success('Status updated successfully');
      fetchAppointments();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const filteredAppointments = appointments.filter(apt => {
    const matchesSearch = apt.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         apt.appointment_type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || apt.status === filterStatus;
    
    // Date range filter
    let matchesDateRange = true;
    if (dateRange !== 'all') {
      const appointmentDate = new Date(apt.appointment_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      switch (dateRange) {
        case 'today':
          matchesDateRange = appointmentDate.toDateString() === today.toDateString();
          break;
        case 'tomorrow':
          const tomorrow = new Date(today);
          tomorrow.setDate(tomorrow.getDate() + 1);
          matchesDateRange = appointmentDate.toDateString() === tomorrow.toDateString();
          break;
        case 'week':
          const weekFromNow = new Date(today);
          weekFromNow.setDate(weekFromNow.getDate() + 7);
          matchesDateRange = appointmentDate >= today && appointmentDate <= weekFromNow;
          break;
        case 'month':
          const monthFromNow = new Date(today);
          monthFromNow.setMonth(monthFromNow.getMonth() + 1);
          matchesDateRange = appointmentDate >= today && appointmentDate <= monthFromNow;
          break;
      }
    }
    
    return matchesSearch && matchesFilter && matchesDateRange;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'completed': return 'bg-green-100 text-green-700 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Immunization': return 'bg-emerald-50 text-emerald-700';
      case 'Maternal Care': return 'bg-pink-50 text-pink-700';
      case 'Family Planning': return 'bg-blue-50 text-blue-700';
      case 'Senior Citizen': return 'bg-purple-50 text-purple-700';
      default: return 'bg-gray-50 text-gray-700';
    }
  };

  // Calendar helper functions
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const getAppointmentsForDay = (day: number) => {
    const { year, month } = getDaysInMonth(currentMonth);
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return filteredAppointments.filter(apt => apt.appointment_date === dateStr);
  };

  const isToday = (day: number) => {
    const { year, month } = getDaysInMonth(currentMonth);
    const today = new Date();
    return today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-16 h-16 shadow-lg bg-gradient-to-br from-emerald-500 via-green-600 to-teal-600 rounded-2xl">
              <Calendar className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-transparent bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text">Appointments</h1>
              <p className="flex items-center gap-2 mt-1 text-gray-600">
                <Clock className="w-4 h-4" />
                Manage patient appointments and schedules
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* View Toggle Buttons */}
            <div className="flex items-center gap-1 p-1 bg-white border border-gray-300 rounded-xl shadow-sm">
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  viewMode === 'list'
                    ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <List className="w-4 h-4" />
                <span className="text-sm font-medium">List</span>
              </button>
              <button
                onClick={() => setViewMode('calendar')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  viewMode === 'calendar'
                    ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <CalendarDays className="w-4 h-4" />
                <span className="text-sm font-medium">Calendar</span>
              </button>
            </div>
            <button
              onClick={handleCreate}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl hover:from-emerald-600 hover:to-green-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Plus className="w-5 h-5" />
              New Appointment
            </button>
          </div>
        </div>

        {/* Search and Filters Row */}
        <div className="flex items-center gap-4 mb-6">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-4 top-1/2" />
            <input
              type="text"
              placeholder="Search appointments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-3 pl-12 pr-4 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent shadow-sm"
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex items-center gap-3">
            {/* Status Filter */}
            <div className="relative">
              <button
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors shadow-sm whitespace-nowrap"
              >
                <Filter className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">
                  {filterStatus === 'all' ? 'All Status' : filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1)}
                </span>
              </button>
              {showFilterDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50"
                >
                  {['all', 'scheduled', 'completed', 'cancelled'].map((status) => (
                    <button
                      key={status}
                      onClick={() => {
                        setFilterStatus(status);
                        setShowFilterDropdown(false);
                      }}
                      className={`w-full px-4 py-2 text-left text-sm font-medium transition-colors ${
                        filterStatus === status
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {status === 'all' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </motion.div>
              )}
            </div>

            {/* Date Range Picker */}
            <div className="relative">
              <button 
                onClick={() => setShowDateRangeDropdown(!showDateRangeDropdown)}
                className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors shadow-sm whitespace-nowrap"
              >
                <Calendar className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">
                  {dateRange === 'all' ? 'All Time' : 
                   dateRange === 'today' ? 'Today' :
                   dateRange === 'tomorrow' ? 'Tomorrow' :
                   dateRange === 'week' ? 'This Week' : 'This Month'}
                </span>
              </button>
              {showDateRangeDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50"
                >
                  {[
                    { value: 'all', label: 'All Time' },
                    { value: 'today', label: 'Today' },
                    { value: 'tomorrow', label: 'Tomorrow' },
                    { value: 'week', label: 'This Week' },
                    { value: 'month', label: 'This Month' },
                  ].map((range) => (
                    <button
                      key={range.value}
                      onClick={() => {
                        setDateRange(range.value);
                        setShowDateRangeDropdown(false);
                      }}
                      className={`w-full px-4 py-2 text-left text-sm font-medium transition-colors ${
                        dateRange === range.value
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {range.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-3">
          <div className="p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Appointments This Week</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{appointments.length}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Review</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{appointments.filter(a => a.status === 'scheduled').length}</p>
              </div>
              <div className="p-3 bg-amber-50 rounded-lg">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </div>

          <div className="p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{appointments.filter(a => a.status === 'completed').length}</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <Check className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Appointments List */}
        <AnimatePresence mode="wait">
          {viewMode === 'list' ? (
            <motion.div
              key="list-view"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="space-y-3"
            >
              {filteredAppointments.map((appointment, index) => (
            <motion.div
              key={appointment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              className="flex items-center gap-4 p-4 bg-white border border-gray-200 shadow-sm rounded-xl hover:shadow-md transition-all"
            >
              {/* Left: Patient Avatar + Name + Role Badge */}
              <div className="flex items-center gap-3 min-w-[200px]">
                <div className="flex items-center justify-center w-10 h-10 font-semibold text-white rounded-full bg-gradient-to-br from-emerald-500 to-green-600">
                  {appointment.patient_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{appointment.patient_name}</p>
                  <span className="inline-block px-2 py-0.5 text-xs font-medium text-emerald-700 bg-emerald-50 rounded">
                    Patient
                  </span>
                </div>
              </div>

              {/* Middle-Left: Date and Time */}
              <div className="flex items-center gap-2 min-w-[180px]">
                <Calendar className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(appointment.appointment_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </p>
                  <p className="text-xs text-gray-500">{appointment.appointment_time}</p>
                </div>
              </div>

              {/* Middle: Appointment Type + Service */}
              <div className="flex-1 min-w-[150px]">
                <div className={`inline-block px-3 py-1 rounded-lg text-sm font-medium ${getTypeColor(appointment.appointment_type)}`}>
                  {appointment.appointment_type}
                </div>
              </div>

              {/* Middle-Right: Status Badge */}
              <div className="min-w-[120px]">
                <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold border ${
                  appointment.status === 'scheduled' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                  appointment.status === 'completed' ? 'bg-gray-100 text-gray-700 border-gray-200' :
                  'bg-red-50 text-red-700 border-red-200'
                }`}>
                  {appointment.status === 'scheduled' ? 'Confirmed' : appointment.status === 'completed' ? 'Completed' : 'Cancelled'}
                </span>
              </div>

              {/* Right: Assigned Staff */}
              <div className="flex items-center gap-2 min-w-[150px]">
                <div className="flex items-center justify-center w-8 h-8 text-xs font-semibold text-white bg-gray-400 rounded-full">
                  {user?.first_name?.charAt(0)}{user?.last_name?.charAt(0)}
                </div>
                <span className="text-sm text-gray-700">{user?.first_name} {user?.last_name}</span>
              </div>

              {/* Far Right: Action Buttons */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleEdit(appointment)}
                  className="p-2 text-blue-600 transition-colors rounded-lg hover:bg-blue-50"
                  title="Edit"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleView(appointment)}
                  className="p-2 text-emerald-600 transition-colors rounded-lg hover:bg-emerald-50"
                  title="View Details"
                >
                  <Calendar className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(appointment.id)}
                  className="p-2 text-red-600 transition-colors rounded-lg hover:bg-red-50"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="calendar-view"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Calendar Header */}
              <div className="flex items-center justify-between p-4 mb-4 bg-white border border-gray-200 shadow-sm rounded-xl">
                <button
                  onClick={goToPreviousMonth}
                  className="p-2 text-gray-600 transition-colors rounded-lg hover:bg-gray-100"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <h2 className="text-xl font-bold text-gray-900">
                  {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </h2>
                <button
                  onClick={goToNextMonth}
                  className="p-2 text-gray-600 transition-colors rounded-lg hover:bg-gray-100"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Calendar Grid */}
              <div className="p-4 bg-white border border-gray-200 shadow-sm rounded-xl">
                {/* Day Headers */}
                <div className="grid grid-cols-7 gap-2 mb-2">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <div key={day} className="py-2 text-sm font-bold text-center text-gray-600">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Days */}
                <div className="grid grid-cols-7 gap-2">
                  {(() => {
                    const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth);
                    const days = [];
                    
                    // Empty cells before first day
                    for (let i = 0; i < startingDayOfWeek; i++) {
                      days.push(
                        <div key={`empty-${i}`} className="h-24 bg-gray-50 rounded-lg" />
                      );
                    }
                    
                    // Days of the month
                    for (let day = 1; day <= daysInMonth; day++) {
                      const dayAppointments = getAppointmentsForDay(day);
                      const isTodayDate = isToday(day);
                      
                      days.push(
                        <motion.div
                          key={day}
                          whileHover={{ scale: 1.02 }}
                          className={`h-24 p-2 border rounded-lg transition-all cursor-pointer ${
                            isTodayDate
                              ? 'bg-emerald-50 border-emerald-500 shadow-md'
                              : 'bg-white border-gray-200 hover:border-emerald-300 hover:shadow-sm'
                          }`}
                        >
                          <div className={`text-sm font-bold mb-1 ${
                            isTodayDate ? 'text-emerald-700' : 'text-gray-900'
                          }`}>
                            {day}
                          </div>
                          <div className="space-y-1">
                            {dayAppointments.slice(0, 2).map((apt) => (
                              <div
                                key={apt.id}
                                onClick={() => handleView(apt)}
                                className={`px-2 py-0.5 rounded text-xs font-medium truncate ${
                                  apt.status === 'scheduled'
                                    ? 'bg-emerald-500 text-white'
                                    : apt.status === 'completed'
                                    ? 'bg-gray-400 text-white'
                                    : 'bg-red-500 text-white'
                                }`}
                                title={`${apt.patient_name} - ${apt.appointment_time}`}
                              >
                                {apt.appointment_time.slice(0, 5)}
                              </div>
                            ))}
                            {dayAppointments.length > 2 && (
                              <div className="text-xs font-semibold text-center text-emerald-600">
                                +{dayAppointments.length - 2} more
                              </div>
                            )}
                          </div>
                        </motion.div>
                      );
                    }
                    
                    return days;
                  })()}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {viewMode === 'list' && filteredAppointments.length === 0 && (
          <div className="py-20 text-center">
            <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="mb-2 text-xl font-bold text-gray-900">No appointments found</h3>
            <p className="text-gray-600">Create your first appointment to get started</p>
          </div>
        )}

        {/* Pagination - Only show in list view */}
        {viewMode === 'list' && totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-2 mt-6"
          >
            {/* Previous Button */}
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                currentPage === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>

            {/* Page Numbers */}
            <div className="flex items-center gap-1">
              {(() => {
                const pages = [];
                const maxVisible = 5;
                let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
                let endPage = Math.min(totalPages, startPage + maxVisible - 1);
                
                if (endPage - startPage < maxVisible - 1) {
                  startPage = Math.max(1, endPage - maxVisible + 1);
                }
                
                if (startPage > 1) {
                  pages.push(
                    <button
                      key={1}
                      onClick={() => setCurrentPage(1)}
                      className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      1
                    </button>
                  );
                  if (startPage > 2) {
                    pages.push(
                      <span key="ellipsis-start" className="px-2 text-gray-500">...</span>
                    );
                  }
                }
                
                for (let i = startPage; i <= endPage; i++) {
                  pages.push(
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i)}
                      className={`px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                        currentPage === i
                          ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-md'
                          : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {i}
                    </button>
                  );
                }
                
                if (endPage < totalPages) {
                  if (endPage < totalPages - 1) {
                    pages.push(
                      <span key="ellipsis-end" className="px-2 text-gray-500">...</span>
                    );
                  }
                  pages.push(
                    <button
                      key={totalPages}
                      onClick={() => setCurrentPage(totalPages)}
                      className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      {totalPages}
                    </button>
                  );
                }
                
                return pages;
              })()}
            </div>

            {/* Next Button */}
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                currentPage === totalPages
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm'
              }`}
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
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
                <h2 className="text-2xl font-bold text-gray-900">
                  {modalMode === 'create' && 'New Appointment'}
                  {modalMode === 'edit' && 'Edit Appointment'}
                  {modalMode === 'view' && 'Appointment Details'}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 text-gray-500 transition-colors rounded-lg hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {modalMode === 'view' && selectedAppointment ? (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-gray-50">
                    <div className="text-sm font-semibold text-gray-600">Patient Name</div>
                    <div className="text-lg font-bold text-gray-900">{selectedAppointment.patient_name}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-gray-50">
                      <div className="text-sm font-semibold text-gray-600">Type</div>
                      <div className="font-bold text-gray-900">{selectedAppointment.appointment_type}</div>
                    </div>
                    <div className="p-4 rounded-xl bg-gray-50">
                      <div className="text-sm font-semibold text-gray-600">Status</div>
                      <div className="font-bold text-gray-900 capitalize">{selectedAppointment.status}</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-gray-50">
                      <div className="text-sm font-semibold text-gray-600">Date</div>
                      <div className="font-bold text-gray-900">{new Date(selectedAppointment.appointment_date).toLocaleDateString()}</div>
                    </div>
                    <div className="p-4 rounded-xl bg-gray-50">
                      <div className="text-sm font-semibold text-gray-600">Time</div>
                      <div className="font-bold text-gray-900">{selectedAppointment.appointment_time}</div>
                    </div>
                  </div>
                  {selectedAppointment.notes && (
                    <div className="p-4 rounded-xl bg-gray-50">
                      <div className="text-sm font-semibold text-gray-600">Notes</div>
                      <div className="text-gray-900">{selectedAppointment.notes}</div>
                    </div>
                  )}
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Patient Name */}
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">Patient Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.patient_name}
                      onChange={(e) => setFormData({ ...formData, patient_name: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="Enter patient name"
                    />
                  </div>

                  {/* Date and Time */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">Date *</label>
                      <input
                        type="date"
                        required
                        value={formData.appointment_date}
                        onChange={(e) => setFormData({ ...formData, appointment_date: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">Time *</label>
                      <input
                        type="time"
                        required
                        value={formData.appointment_time}
                        onChange={(e) => setFormData({ ...formData, appointment_time: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Appointment Type */}
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">Appointment Type *</label>
                    <CustomSelect
                      value={formData.appointment_type}
                      onChange={(value) => setFormData({ ...formData, appointment_type: value })}
                      options={[
                        { value: 'Immunization', label: 'Immunization' },
                        { value: 'Maternal Care', label: 'Maternal Care' },
                        { value: 'Family Planning', label: 'Family Planning' },
                        { value: 'Senior Citizen', label: 'Senior Citizen' },
                      ]}
                      placeholder="Select Type"
                    />
                  </div>

                  {/* Service */}
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">Service</label>
                    <input
                      type="text"
                      value={formData.service}
                      onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="e.g., Vaccination, Checkup"
                    />
                  </div>

                  {/* Assigned Staff */}
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">Assigned Staff</label>
                    <input
                      type="text"
                      value={formData.assigned_staff}
                      onChange={(e) => setFormData({ ...formData, assigned_staff: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="Enter staff name"
                    />
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">Status *</label>
                    <CustomSelect
                      value={formData.status}
                      onChange={(value) => setFormData({ ...formData, status: value as 'scheduled' | 'completed' | 'cancelled' })}
                      options={[
                        { value: 'scheduled', label: 'Confirmed' },
                        { value: 'completed', label: 'Completed' },
                        { value: 'cancelled', label: 'Cancelled' },
                      ]}
                      placeholder="Select Status"
                    />
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">Notes</label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="Add any additional notes..."
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="flex-1 px-4 py-3 font-semibold text-gray-700 transition-all bg-gray-100 rounded-xl hover:bg-gray-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-3 font-semibold text-white transition-all rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 shadow-lg"
                    >
                      {modalMode === 'create' ? 'Create' : 'Update'} Appointment
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
