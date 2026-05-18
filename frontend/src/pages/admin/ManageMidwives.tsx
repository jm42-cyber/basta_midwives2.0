import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Stethoscope, 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  Edit, 
  Power, 
  Loader2, 
  X,
  Mail,
  Phone,
  MapPin,
  User,
  Clock,
  UserCheck,
  UserX,
  Users,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';
import api from '@/services/api';
import { toast } from 'react-toastify';

interface Midwife {
  id: number;
  first_name: string;
  middle_name: string | null;
  last_name: string;
  username: string;
  email: string;
  contact_number: string;
  role: string;
  status: 'pending' | 'approved' | 'rejected' | 'inactive';
  created_at: string;
}

const ManageMidwives: React.FC = () => {
  const [midwives, setMidwives] = useState<Midwife[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const [selectedMidwife, setSelectedMidwife] = useState<Midwife | null>(null);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [validFields, setValidFields] = useState<Record<string, boolean>>({});
  const [formData, setFormData] = useState({
    first_name: '',
    middle_name: '',
    last_name: '',
    username: '',
    email: '',
    contact_number: '',
    password: '',
    password_confirmation: '',
  });
  const [barangayOptions, setBarangayOptions] = useState<Array<{ id: number; name: string }>>([]);
  const [selectedBarangays, setSelectedBarangays] = useState<number[]>([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingMidwife, setEditingMidwife] = useState<Midwife | null>(null);
  const [editFormData, setEditFormData] = useState({
    first_name: '',
    middle_name: '',
    last_name: '',
    username: '',
    email: '',
    contact_number: '',
  });
  const [editSelectedBarangays, setEditSelectedBarangays] = useState<number[]>([]);
  const [editBarangayOptions, setEditBarangayOptions] = useState<Array<{ id: number; name: string }>>([]);
  const [editValidFields, setEditValidFields] = useState<Record<string, boolean>>({});
  const [editErrors, setEditErrors] = useState<Record<string, string>>({});
  const [togglingId, setTogglingId] = useState<number | null>(null);
  const [showToggleModal, setShowToggleModal] = useState(false);
  const [midwifeToToggle, setMidwifeToToggle] = useState<Midwife | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [step1Valid, setStep1Valid] = useState(false);

  useEffect(() => {
    fetchMidwives();
  }, []);

  useEffect(() => {
    if (showAddModal) {
      const fetchBarangays = async () => {
        try {
          const response = await api.get('/admin/barangays');
          setBarangayOptions(response.data.data || response.data || []);
        } catch (error) {
          console.error('Error fetching barangays:', error);
          toast.error('Failed to load barangays');
        }
      };
      fetchBarangays();
    }
  }, [showAddModal]);

  useEffect(() => {
    if (showEditModal && editingMidwife) {
      const fetchEditData = async () => {
        try {
          const barangaysResponse = await api.get('/admin/barangays');
          setEditBarangayOptions(barangaysResponse.data.data || barangaysResponse.data || []);
          
          try {
            const assignedResponse = await api.get(`/users/${editingMidwife.id}/barangays`);
            const assignedIds = (assignedResponse.data.data || assignedResponse.data || []).map((b: any) => b.id);
            setEditSelectedBarangays(assignedIds);
          } catch {
            setEditSelectedBarangays([]);
          }
        } catch (error) {
          console.error('Error fetching edit data:', error);
          toast.error('Failed to load barangays');
        }
      };
      fetchEditData();
    }
  }, [showEditModal, editingMidwife]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const fetchMidwives = async () => {
    try {
      setLoading(true);
      const response = await api.get('/users', {
        params: { role: 'midwife' }
      });
      setMidwives(response.data.data || []);
    } catch (error) {
      console.error('Error fetching midwives:', error);
      toast.error('Failed to load midwives');
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = () => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    };
    return currentDateTime.toLocaleDateString('en-US', options);
  };

  const filteredMidwives = midwives.filter(midwife => {
    const matchesSearch = 
      midwife.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      midwife.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      midwife.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      midwife.username.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || midwife.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const stats = useMemo(() => {
    const total = midwives.length;
    const approved = midwives.filter(m => m.status === 'approved').length;
    const pending = midwives.filter(m => m.status === 'pending').length;
    const inactive = midwives.filter(m => m.status === 'inactive').length;
    
    return { total, approved, pending, inactive };
  }, [midwives]);

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
      approved: { 
        bg: 'bg-emerald-100', 
        text: 'text-emerald-700', 
        icon: <UserCheck className="w-3 h-3" />
      },
      pending: { 
        bg: 'bg-amber-100', 
        text: 'text-amber-700', 
        icon: <Clock className="w-3 h-3" />
      },
      rejected: { 
        bg: 'bg-red-100', 
        text: 'text-red-700', 
        icon: <UserX className="w-3 h-3" />
      },
      inactive: { 
        bg: 'bg-gray-100', 
        text: 'text-gray-700', 
        icon: <Power className="w-3 h-3" />
      },
    };
    return badges[status] || badges.approved;
  };

  const handleView = (midwife: Midwife) => {
    setSelectedMidwife(midwife);
    setShowViewModal(true);
  };

  const handleEdit = (midwife: Midwife) => {
    setEditingMidwife(midwife);
    setEditFormData({
      first_name: midwife.first_name,
      middle_name: midwife.middle_name || '',
      last_name: midwife.last_name,
      username: midwife.username,
      email: midwife.email,
      contact_number: midwife.contact_number,
    });
    setShowEditModal(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    // Real-time validation
    const newValidFields = { ...validFields };
    
    switch (name) {
      case 'first_name':
      case 'last_name':
        newValidFields[name] = value.trim().length >= 2;
        break;
      case 'username':
        newValidFields[name] = value.length >= 4 && /^\S+$/.test(value);
        break;
      case 'email':
        newValidFields[name] = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        break;
      case 'contact_number':
        newValidFields[name] = /^09\d{9}$/.test(value);
        break;
      case 'password':
        newValidFields[name] = value.length >= 8 && /^(?=.*[A-Z])(?=.*\d)/.test(value);
        break;
      case 'password_confirmation':
        newValidFields[name] = value === formData.password && value.length > 0;
        break;
    }
    
    setValidFields(newValidFields);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.first_name.trim()) {
      newErrors.first_name = 'First name is required';
    } else if (formData.first_name.trim().length < 2) {
      newErrors.first_name = 'First name must be at least 2 characters';
    }
    
    if (!formData.last_name.trim()) {
      newErrors.last_name = 'Last name is required';
    } else if (formData.last_name.trim().length < 2) {
      newErrors.last_name = 'Last name must be at least 2 characters';
    }
    
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 4) {
      newErrors.username = 'Username must be at least 4 characters';
    } else if (!/^\S+$/.test(formData.username)) {
      newErrors.username = 'Username cannot contain spaces';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (!formData.contact_number.trim()) {
      newErrors.contact_number = 'Contact number is required';
    } else if (!/^09\d{9}$/.test(formData.contact_number)) {
      newErrors.contact_number = 'Contact number must start with 09 and be exactly 11 digits';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/^(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase and number';
    }
    
    if (formData.password !== formData.password_confirmation) {
      newErrors.password_confirmation = 'Passwords do not match';
    }
    
    if (selectedBarangays.length === 0) {
      newErrors.barangays = 'Please assign at least one barangay';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.first_name.trim()) {
      newErrors.first_name = 'First name is required';
    } else if (formData.first_name.trim().length < 2) {
      newErrors.first_name = 'First name must be at least 2 characters';
    }
    
    if (!formData.last_name.trim()) {
      newErrors.last_name = 'Last name is required';
    } else if (formData.last_name.trim().length < 2) {
      newErrors.last_name = 'Last name must be at least 2 characters';
    }
    
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 4) {
      newErrors.username = 'Username must be at least 4 characters';
    } else if (!/^\S+$/.test(formData.username)) {
      newErrors.username = 'Username cannot contain spaces';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (!formData.contact_number.trim()) {
      newErrors.contact_number = 'Contact number is required';
    } else if (!/^09\d{9}$/.test(formData.contact_number)) {
      newErrors.contact_number = 'Contact number must start with 09 and be exactly 11 digits';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/^(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase and number';
    }
    
    if (formData.password !== formData.password_confirmation) {
      newErrors.password_confirmation = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await api.post('/users', {
        ...formData,
        role: 'midwife',
        status: 'approved',
        barangay_ids: selectedBarangays
      });
      toast.success('Midwife added successfully');
      await fetchMidwives();
      setShowAddModal(false);
      setCurrentStep(1);
      setFormData({
        first_name: '',
        middle_name: '',
        last_name: '',
        username: '',
        email: '',
        contact_number: '',
        password: '',
        password_confirmation: '',
      });
      setSelectedBarangays([]);
      setBarangayOptions([]);
      setErrors({});
    } catch (error: any) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
      toast.error(error.response?.data?.message || 'Failed to add midwife');
      console.error('Error adding midwife:', error);
    }
  };

  const handleNextStep = () => {
    if (validateStep1()) {
      setCurrentStep(2);
    }
  };

  const handleBackStep = () => {
    setCurrentStep(1);
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
    
    if (editErrors[name]) {
      setEditErrors(prev => ({ ...prev, [name]: '' }));
    }

    const newValidFields = { ...editValidFields };
    
    switch (name) {
      case 'first_name':
      case 'last_name':
        newValidFields[name] = value.trim().length >= 2;
        break;
      case 'username':
        newValidFields[name] = value.length >= 4 && /^\S+$/.test(value);
        break;
      case 'email':
        newValidFields[name] = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        break;
      case 'contact_number':
        newValidFields[name] = /^09\d{9}$/.test(value);
        break;
    }
    
    setEditValidFields(newValidFields);
  };

  const validateEditForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!editFormData.first_name.trim()) {
      newErrors.first_name = 'First name is required';
    } else if (editFormData.first_name.trim().length < 2) {
      newErrors.first_name = 'First name must be at least 2 characters';
    }
    
    if (!editFormData.last_name.trim()) {
      newErrors.last_name = 'Last name is required';
    } else if (editFormData.last_name.trim().length < 2) {
      newErrors.last_name = 'Last name must be at least 2 characters';
    }
    
    if (!editFormData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (editFormData.username.length < 4) {
      newErrors.username = 'Username must be at least 4 characters';
    } else if (!/^\S+$/.test(editFormData.username)) {
      newErrors.username = 'Username cannot contain spaces';
    }
    
    if (!editFormData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editFormData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (!editFormData.contact_number.trim()) {
      newErrors.contact_number = 'Contact number is required';
    } else if (!/^09\d{9}$/.test(editFormData.contact_number)) {
      newErrors.contact_number = 'Contact number must start with 09 and be exactly 11 digits';
    }
    
    if (editSelectedBarangays.length === 0) {
      newErrors.barangays = 'Please assign at least one barangay';
    }
    
    setEditErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEditForm() || !editingMidwife) return;

    try {
      await api.put(`/users/${editingMidwife.id}`, {
        ...editFormData,
        barangay_ids: editSelectedBarangays
      });
      toast.success('Midwife updated successfully');
      await fetchMidwives();
      setShowEditModal(false);
      setEditingMidwife(null);
      setEditFormData({
        first_name: '',
        middle_name: '',
        last_name: '',
        username: '',
        email: '',
        contact_number: '',
      });
      setEditSelectedBarangays([]);
      setEditBarangayOptions([]);
      setEditErrors({});
      setEditValidFields({});
    } catch (error: any) {
      if (error.response?.data?.errors) {
        setEditErrors(error.response.data.errors);
      }
      toast.error(error.response?.data?.message || 'Failed to update midwife');
      console.error('Error updating midwife:', error);
    }
  };

  const handleToggleStatus = async (midwife: Midwife) => {
    setMidwifeToToggle(midwife);
    setShowToggleModal(true);
  };

  const confirmToggleStatus = async () => {
    if (!midwifeToToggle) return;

    setTogglingId(midwifeToToggle.id);
    setShowToggleModal(false);
    
    try {
      const newStatus = midwifeToToggle.status === 'approved' ? 'inactive' : 'approved';
      await api.put(`/users/${midwifeToToggle.id}`, {
        first_name: midwifeToToggle.first_name,
        middle_name: midwifeToToggle.middle_name,
        last_name: midwifeToToggle.last_name,
        username: midwifeToToggle.username,
        email: midwifeToToggle.email,
        contact_number: midwifeToToggle.contact_number,
        status: newStatus
      });
      toast.success(midwifeToToggle.status === 'approved' ? 'Midwife deactivated successfully' : 'Midwife reactivated successfully');
      await fetchMidwives();
    } catch (error) {
      toast.error('Failed to update midwife status');
      console.error('Error toggling status:', error);
    } finally {
      setTogglingId(null);
      setMidwifeToToggle(null);
    }
  };

  return (
    <AdminLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-16 h-16 shadow-lg bg-gradient-to-br from-emerald-500 via-green-600 to-teal-600 rounded-2xl">
              <Stethoscope className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-transparent bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text">
                Manage Midwives
              </h1>
              <p className="flex items-center gap-2 mt-1 text-gray-600">
                <Users className="w-4 h-4" />
                View and manage registered midwife accounts
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm">
            <Clock className="w-5 h-5 text-emerald-600" />
            <span className="text-sm font-medium text-gray-700">{formatDateTime()}</span>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Midwives</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Approved</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.approved}</p>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.pending}</p>
              </div>
              <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Inactive</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.inactive}</p>
              </div>
              <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center">
                <Power className="w-6 h-6 text-gray-600" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-6 flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by name, email, or username..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent shadow-sm"
            />
          </div>
          <div className="relative">
            <button 
              onClick={() => setShowFiltersModal(!showFiltersModal)}
              className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
            >
              <Filter className="w-5 h-5 text-gray-600" />
              <span className="font-medium text-gray-700">Filters</span>
            </button>
            {showFiltersModal && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50"
              >
                {['all', 'approved', 'pending', 'rejected', 'inactive'].map((status) => (
                  <button
                    key={status}
                    onClick={() => {
                      setFilterStatus(status);
                      setShowFiltersModal(false);
                    }}
                    className={`w-full px-4 py-2.5 text-left text-sm font-medium transition-colors ${
                      filterStatus === status
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {status === 'all' ? 'All Midwives' : status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </motion.div>
            )}
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold shadow-sm transition-all duration-200"
          >
            <Plus className="w-5 h-5" />
            <span>Add Midwife</span>
          </button>
        </div>

        {/* Midwives Table */}
        <div className="overflow-hidden bg-white border border-gray-100 shadow-sm rounded-2xl">
          {loading ? (
            <div className="p-16 text-center">
              <div className="inline-flex items-center gap-3 text-gray-500">
                <Loader2 className="w-6 h-6 animate-spin" />
                Loading midwives...
              </div>
            </div>
          ) : filteredMidwives.length === 0 ? (
            <div className="p-16 text-center">
              <div className="flex items-center justify-center w-20 h-20 mx-auto mb-4 bg-emerald-50 rounded-full">
                <Stethoscope className="w-10 h-10 text-emerald-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">No midwives found</h3>
              <p className="text-gray-600">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-500 uppercase">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Midwife Information
                      </div>
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-500 uppercase">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Contact Details
                      </div>
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-500 uppercase">
                      <div className="flex items-center gap-2">
                        <UserCheck className="w-4 h-4" />
                        Status
                      </div>
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold tracking-wider text-right text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredMidwives.map((midwife) => {
                    const statusBadge = getStatusBadge(midwife.status);
                    return (
                      <tr key={midwife.id} className="hover:bg-emerald-50/40 transition-all duration-200">
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 text-white font-bold rounded-full flex items-center justify-center text-sm">
                              {midwife.first_name?.charAt(0)}{midwife.last_name?.charAt(0)}
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900">
                                {midwife.first_name} {midwife.middle_name} {midwife.last_name}
                              </div>
                              <div className="text-sm text-gray-600">@{midwife.username}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="text-sm space-y-1">
                            <div className="flex items-center gap-1 text-gray-900">
                              <Mail className="w-4 h-4 text-gray-400" />
                              {midwife.email}
                            </div>
                            <div className="flex items-center gap-1 text-gray-600">
                              <Phone className="w-4 h-4 text-gray-400" />
                              {midwife.contact_number}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${statusBadge.bg} ${statusBadge.text}`}>
                            {statusBadge.icon}
                            {midwife.status.charAt(0).toUpperCase() + midwife.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center justify-end gap-1">
                            <button 
                              onClick={() => handleView(midwife)} 
                              className="p-2.5 text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleEdit(midwife)}
                              className="p-2.5 text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all duration-200"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleToggleStatus(midwife)}
                              title={midwife.status === 'approved' ? 'Deactivate Midwife' : 'Reactivate Midwife'}
                              className={`p-2.5 rounded-xl transition-all duration-200 ${
                                midwife.status === 'approved'
                                  ? 'text-red-500 hover:bg-red-50'
                                  : 'text-emerald-600 hover:bg-emerald-50'
                              }`}
                            >
                              {togglingId === midwife.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Power className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </motion.div>

      {/* Add Midwife Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center rounded-t-2xl z-10">
              <h2 className="text-2xl font-bold text-gray-900 border-l-4 border-emerald-500 pl-4">Add New Midwife</h2>
              <button 
                onClick={() => {
                  setShowAddModal(false);
                  setCurrentStep(1);
                  setFormData({
                    first_name: '',
                    middle_name: '',
                    last_name: '',
                    username: '',
                    email: '',
                    contact_number: '',
                    password: '',
                    password_confirmation: '',
                  });
                  setSelectedBarangays([]);
                  setErrors({});
                  setValidFields({});
                }} 
                className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-xl transition-all duration-200"
              >
                <X size={24} />
              </button>
            </div>

            {/* Step Indicator */}
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-center gap-4">
                {/* Step 1 */}
                <div className="flex flex-col items-center">
                  <div className={`rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold transition-all duration-200 ${
                    currentStep === 1 ? 'bg-emerald-600 text-white' : currentStep > 1 ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-400'
                  }`}>
                    1
                  </div>
                  <span className={`text-xs font-medium mt-1 transition-all duration-200 ${
                    currentStep === 1 ? 'text-emerald-600' : currentStep > 1 ? 'text-emerald-600' : 'text-gray-400'
                  }`}>
                    Personal Info
                  </span>
                </div>

                {/* Connector Line */}
                <div className={`flex-1 h-0.5 transition-all duration-200 ${
                  currentStep > 1 ? 'bg-emerald-500' : 'bg-gray-200'
                }`} style={{ maxWidth: '100px' }} />

                {/* Step 2 */}
                <div className="flex flex-col items-center">
                  <div className={`rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold transition-all duration-200 ${
                    currentStep === 2 ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-400'
                  }`}>
                    2
                  </div>
                  <span className={`text-xs font-medium mt-1 transition-all duration-200 ${
                    currentStep === 2 ? 'text-emerald-600' : 'text-gray-400'
                  }`}>
                    Barangay Assignment
                  </span>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              {/* Step 1: Personal Information */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1.5">
                        First Name *
                        {validFields.first_name && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                      </label>
                      <input
                        type="text"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 ${
                          errors.first_name ? 'border-red-300' : 'border-gray-300'
                        }`}
                      />
                      {errors.first_name && (
                        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.first_name}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Middle Name</label>
                      <input
                        type="text"
                        name="middle_name"
                        value={formData.middle_name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1.5">
                        Last Name *
                        {validFields.last_name && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                      </label>
                      <input
                        type="text"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 ${
                          errors.last_name ? 'border-red-300' : 'border-gray-300'
                        }`}
                      />
                      {errors.last_name && (
                        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.last_name}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1.5">
                        Username *
                        {validFields.username && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                      </label>
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 ${
                          errors.username ? 'border-red-300' : 'border-gray-300'
                        }`}
                      />
                      {errors.username && (
                        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.username}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1.5">
                        Email *
                        {validFields.email && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 ${
                          errors.email ? 'border-red-300' : 'border-gray-300'
                        }`}
                      />
                      {errors.email && (
                        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1.5">
                      Contact Number *
                      {validFields.contact_number && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                    </label>
                    <input
                      type="text"
                      name="contact_number"
                      value={formData.contact_number}
                      onChange={handleInputChange}
                      placeholder="09XXXXXXXXX"
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 ${
                        errors.contact_number ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {errors.contact_number && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.contact_number}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1.5">
                        Password *
                        {validFields.password && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                      </label>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 ${
                          errors.password ? 'border-red-300' : 'border-gray-300'
                        }`}
                      />
                      {errors.password && (
                        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.password}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1.5">
                        Confirm Password *
                        {validFields.password_confirmation && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                      </label>
                      <input
                        type="password"
                        name="password_confirmation"
                        value={formData.password_confirmation}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 ${
                          errors.password_confirmation ? 'border-red-300' : 'border-gray-300'
                        }`}
                      />
                      {errors.password_confirmation && (
                        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.password_confirmation}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Next Button */}
                  <div className="flex justify-end mt-6 pt-6 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="bg-emerald-600 text-white rounded-xl px-6 py-2.5 font-semibold hover:bg-emerald-700 transition-all duration-200 shadow-sm w-full flex items-center justify-center gap-2"
                    >
                      Next
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Barangay Assignment */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  {/* Summary Card */}
                  <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {formData.first_name?.charAt(0)}{formData.last_name?.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">
                          {formData.first_name} {formData.middle_name} {formData.last_name}
                        </div>
                        <div className="text-xs text-gray-500">{formData.email}</div>
                        <div className="text-xs text-gray-500">@{formData.username}</div>
                      </div>
                    </div>
                  </div>

                  {/* Barangay Assignment */}
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-1 block">Assign Barangays</label>
                    <p className="text-xs text-gray-500 mb-3">Select 1 to 3 barangays where this midwife will be stationed</p>
                    
                    {/* Selected Barangays Tags */}
                    {selectedBarangays.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {selectedBarangays.map(id => {
                          const barangay = barangayOptions.find(b => b.id === id);
                          return barangay ? (
                            <span
                              key={id}
                              className="bg-emerald-100 text-emerald-700 rounded-full px-3 py-1 text-sm flex items-center gap-1"
                            >
                              {barangay.name}
                              <button
                                type="button"
                                onClick={() => setSelectedBarangays(prev => prev.filter(bid => bid !== id))}
                                className="hover:bg-emerald-200 rounded-full p-0.5 transition-all duration-200"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ) : null;
                        })}
                      </div>
                    )}

                    {/* Barangay Pills Grid */}
                    <div className="grid grid-cols-3 gap-2">
                      {barangayOptions.map((barangay) => {
                        const isSelected = selectedBarangays.includes(barangay.id);
                        return (
                          <button
                            key={barangay.id}
                            type="button"
                            onClick={() => {
                              if (isSelected) {
                                setSelectedBarangays(prev => prev.filter(id => id !== barangay.id));
                              } else if (selectedBarangays.length < 3) {
                                setSelectedBarangays(prev => [...prev, barangay.id]);
                              }
                            }}
                            className={`${
                              isSelected
                                ? 'bg-emerald-100 border border-emerald-400 text-emerald-700 font-semibold'
                                : 'bg-gray-50 border border-gray-200 text-gray-700 hover:bg-emerald-50 hover:border-emerald-300'
                            } rounded-xl px-3 py-2 text-sm transition-all duration-200`}
                          >
                            {barangay.name}
                          </button>
                        );
                      })}
                    </div>
                    {selectedBarangays.length >= 3 && (
                      <p className="text-xs text-red-500 mt-2">Maximum 3 barangays allowed</p>
                    )}
                    {errors.barangays && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.barangays}
                      </p>
                    )}
                  </div>

                  {/* Navigation Buttons */}
                  <div className="flex justify-between gap-3 mt-6 pt-6 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={handleBackStep}
                      className="border border-gray-300 text-gray-600 rounded-xl px-6 py-2.5 font-semibold hover:bg-gray-50 transition-all duration-200 flex items-center gap-2"
                    >
                      <ChevronLeft className="w-5 h-5" />
                      Back
                    </button>
                    <button
                      type="submit"
                      className="bg-emerald-600 text-white rounded-xl px-6 py-2.5 font-semibold hover:bg-emerald-700 transition-all duration-200 shadow-sm"
                    >
                      Add Midwife
                    </button>
                  </div>
                </div>
              )}
            </form>
          </motion.div>
        </div>
      )}

      {/* View Modal */}
      {showViewModal && selectedMidwife && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-3xl max-h-[90vh] overflow-y-auto"
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center rounded-t-2xl z-10">
              <h2 className="text-2xl font-bold text-gray-900 border-l-4 border-emerald-500 pl-4">Midwife Details</h2>
              <button 
                onClick={() => setShowViewModal(false)} 
                className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-xl transition-all duration-200"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              {/* Avatar and Name Section */}
              <div className="flex flex-col items-center mb-6 pb-6 border-b border-gray-200">
                <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-teal-500 text-white font-bold rounded-full flex items-center justify-center text-3xl mb-4">
                  {selectedMidwife.first_name?.charAt(0)}{selectedMidwife.last_name?.charAt(0)}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {selectedMidwife.first_name} {selectedMidwife.middle_name} {selectedMidwife.last_name}
                </h3>
                {(() => {
                  const statusBadge = getStatusBadge(selectedMidwife.status);
                  return (
                    <span className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold ${statusBadge.bg} ${statusBadge.text}`}>
                      {statusBadge.icon}
                      {selectedMidwife.status.charAt(0).toUpperCase() + selectedMidwife.status.slice(1)}
                    </span>
                  );
                })()}
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Username</p>
                  <p className="text-sm font-medium text-gray-900">@{selectedMidwife.username}</p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Email Address</p>
                  <p className="text-sm font-medium text-gray-900">{selectedMidwife.email}</p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Contact Number</p>
                  <p className="text-sm font-medium text-gray-900">{selectedMidwife.contact_number}</p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Role</p>
                  <p className="text-sm font-medium text-gray-900 capitalize">{selectedMidwife.role}</p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 md:col-span-2">
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Registration Date</p>
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(selectedMidwife.created_at).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
              </div>

              {/* Close Button */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setShowViewModal(false)}
                  className="w-full border border-gray-300 text-gray-600 rounded-xl px-6 py-2.5 font-semibold hover:bg-gray-50 transition-all duration-200"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Edit Midwife Modal */}
      {showEditModal && editingMidwife && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center rounded-t-2xl z-10">
              <h2 className="text-2xl font-bold text-gray-900 border-l-4 border-emerald-500 pl-4">Edit Midwife</h2>
              <button 
                onClick={() => setShowEditModal(false)} 
                className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-xl transition-all duration-200"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1.5">
                      First Name *
                      {editValidFields.first_name && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                    </label>
                    <input
                      type="text"
                      name="first_name"
                      value={editFormData.first_name}
                      onChange={handleEditInputChange}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 ${
                        editErrors.first_name ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {editErrors.first_name && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {editErrors.first_name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Middle Name</label>
                    <input
                      type="text"
                      name="middle_name"
                      value={editFormData.middle_name}
                      onChange={handleEditInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1.5">
                      Last Name *
                      {editValidFields.last_name && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                    </label>
                    <input
                      type="text"
                      name="last_name"
                      value={editFormData.last_name}
                      onChange={handleEditInputChange}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 ${
                        editErrors.last_name ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {editErrors.last_name && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {editErrors.last_name}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1.5">
                      Username *
                      {editValidFields.username && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                    </label>
                    <input
                      type="text"
                      name="username"
                      value={editFormData.username}
                      onChange={handleEditInputChange}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 ${
                        editErrors.username ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {editErrors.username && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {editErrors.username}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1.5">
                      Email *
                      {editValidFields.email && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={editFormData.email}
                      onChange={handleEditInputChange}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 ${
                        editErrors.email ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {editErrors.email && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {editErrors.email}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1.5">
                    Contact Number *
                    {editValidFields.contact_number && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                  </label>
                  <input
                    type="text"
                    name="contact_number"
                    value={editFormData.contact_number}
                    onChange={handleEditInputChange}
                    placeholder="09XXXXXXXXX"
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 ${
                      editErrors.contact_number ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {editErrors.contact_number && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {editErrors.contact_number}
                    </p>
                  )}
                </div>

                {/* Barangay Assignment Section */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="mb-3">
                    <h3 className="text-sm font-semibold text-gray-700">Assign Barangays</h3>
                    <p className="text-xs text-gray-500">Select 1 to 3 barangays</p>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {editBarangayOptions.map((barangay) => {
                      const isSelected = editSelectedBarangays.includes(barangay.id);
                      return (
                        <button
                          key={barangay.id}
                          type="button"
                          onClick={() => {
                            if (isSelected) {
                              setEditSelectedBarangays(prev => prev.filter(id => id !== barangay.id));
                            } else if (editSelectedBarangays.length < 3) {
                              setEditSelectedBarangays(prev => [...prev, barangay.id]);
                            }
                          }}
                          className={`${
                            isSelected
                              ? 'bg-emerald-100 border border-emerald-300 text-emerald-700 font-semibold'
                              : 'bg-gray-50 border border-gray-200 text-gray-700 hover:bg-emerald-50 hover:border-emerald-300'
                          } rounded-xl px-3 py-2 text-sm transition-all duration-200`}
                        >
                          {barangay.name}
                        </button>
                      );
                    })}
                  </div>
                  {editSelectedBarangays.length >= 3 && (
                    <p className="text-xs text-red-500 mt-1">Maximum 3 barangays allowed</p>
                  )}
                  {editErrors.barangays && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {editErrors.barangays}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="border border-gray-300 text-gray-600 rounded-xl px-6 py-2.5 font-semibold hover:bg-gray-50 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 text-white rounded-xl px-6 py-2.5 font-semibold hover:bg-emerald-700 transition-all duration-200 shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Toggle Status Confirmation Modal */}
      {showToggleModal && midwifeToToggle && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-md"
          >
            <div className="p-6">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-amber-100 to-orange-100">
                <AlertCircle className="w-8 h-8 text-amber-600" />
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
                {midwifeToToggle.status === 'approved' ? 'Deactivate Midwife?' : 'Reactivate Midwife?'}
              </h3>
              
              <p className="text-gray-600 text-center mb-6">
                {midwifeToToggle.status === 'approved' ? (
                  <>
                    Are you sure you want to deactivate{' '}
                    <span className="font-semibold text-gray-900">
                      {midwifeToToggle.first_name} {midwifeToToggle.last_name}
                    </span>
                    ? They will lose access to the system.
                  </>
                ) : (
                  <>
                    Are you sure you want to reactivate{' '}
                    <span className="font-semibold text-gray-900">
                      {midwifeToToggle.first_name} {midwifeToToggle.last_name}
                    </span>
                    ? They will regain access to the system.
                  </>
                )}
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowToggleModal(false);
                    setMidwifeToToggle(null);
                  }}
                  className="flex-1 border border-gray-300 text-gray-700 rounded-xl px-6 py-3 font-semibold hover:bg-gray-50 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmToggleStatus}
                  className={`flex-1 text-white rounded-xl px-6 py-3 font-semibold transition-all duration-200 shadow-sm ${
                    midwifeToToggle.status === 'approved'
                      ? 'bg-red-600 hover:bg-red-700'
                      : 'bg-emerald-600 hover:bg-emerald-700'
                  }`}
                >
                  {midwifeToToggle.status === 'approved' ? 'Deactivate' : 'Reactivate'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AdminLayout>
  );
};

export default ManageMidwives;
