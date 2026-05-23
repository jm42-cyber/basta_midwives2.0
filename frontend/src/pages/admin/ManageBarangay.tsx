import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Search, Edit, Eye, Loader2, X, Phone, Users, User, Building2, UserCheck, Filter, Clock, Mail, Calendar } from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';
import { barangayService } from '@/services/barangayService';
import { Barangay } from '@/types';

const ManageBarangay: React.FC = () => {
  const [barangays, setBarangays] = useState<Barangay[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const [selectedBarangay, setSelectedBarangay] = useState<Barangay | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    contact_number: '',
    barangay_captain: '',
    health_officer: '',
    population: '',
    population_male: '',
    population_female: '',
    population_children: '',
    coverage_area: '',
  });

  useEffect(() => {
    fetchBarangays();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const fetchBarangays = async () => {
    try {
      setLoading(true);
      const response = await barangayService.getAll();
      setBarangays(response.data.data);
    } catch (error) {
      console.error('Error fetching barangays:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleView = (barangay: Barangay) => {
    setSelectedBarangay(barangay);
    setShowViewModal(true);
  };

  const handleEdit = (barangay: Barangay) => {
    setSelectedBarangay(barangay);
    setFormData({
      name: barangay.name || '',
      address: barangay.address || '',
      contact_number: barangay.contact_number || '',
      barangay_captain: barangay.barangay_captain || '',
      health_officer: barangay.health_officer || '',
      population: barangay.population?.toString() || '',
      population_male: barangay.population_male?.toString() || '',
      population_female: barangay.population_female?.toString() || '',
      population_children: barangay.population_children?.toString() || '',
      coverage_area: barangay.coverage_area || '',
    });
    setShowEditModal(true);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Barangay name is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || !selectedBarangay) return;

    try {
      const submitData: any = { ...formData };
      
      ['population', 'population_male', 'population_female', 'population_children'].forEach(field => {
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

      await barangayService.update(selectedBarangay.id, submitData);
      await fetchBarangays();
      setShowEditModal(false);
      setSelectedBarangay(null);
      setFormData({
        name: '',
        address: '',
        contact_number: '',
        barangay_captain: '',
        health_officer: '',
        population: '',
        population_male: '',
        population_female: '',
        population_children: '',
        coverage_area: '',
      });
    } catch (error: any) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
      console.error('Error updating barangay:', error);
    }
  };

  const filteredBarangays = barangays.filter(barangay =>
    barangay.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    barangay.barangay_captain?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    barangay.contact_number?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = useMemo(() => {
    const totalBarangays = barangays.length;
    const totalPopulation = barangays.reduce((sum, b) => sum + (b.population || 0), 0);
    const activeCaptains = barangays.filter(b => b.barangay_captain && b.barangay_captain.trim() !== '').length;
    
    return { totalBarangays, totalPopulation, activeCaptains };
  }, [barangays]);

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

  return (
    <AdminLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-16 h-16 shadow-lg bg-gradient-to-br from-emerald-500 via-green-600 to-teal-600 rounded-2xl">
              <MapPin className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-transparent bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text">
                Manage Barangays
              </h1>
              <p className="flex items-center gap-2 mt-1 text-gray-600">
                <Building2 className="w-4 h-4" />
                View and manage barangay information
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm">
            <Clock className="w-5 h-5 text-emerald-600" />
            <span className="text-sm font-medium text-gray-700">{formatDateTime()}</span>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Barangays</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalBarangays}</p>
              </div>
              <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center">
                <Building2 className="w-6 h-6 text-emerald-600" />
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
                <p className="text-sm text-gray-600">Total Population</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalPopulation.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
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
                <p className="text-sm text-gray-600">Active Captains</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.activeCaptains}</p>
              </div>
              <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-purple-600" />
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
              placeholder="Search by barangay name, captain, or contact number..."
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
                <div className="px-4 py-2.5 text-sm text-gray-500">
                  Filter options coming soon...
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Barangays Table */}
        <div className="overflow-hidden bg-white border border-gray-100 shadow-sm rounded-2xl">
          {loading ? (
            <div className="p-16 text-center">
              <div className="inline-flex items-center gap-3 text-gray-500">
                <Loader2 className="w-6 h-6 animate-spin" />
                Loading barangays...
              </div>
            </div>
          ) : filteredBarangays.length === 0 ? (
            <div className="p-16 text-center">
              <div className="flex items-center justify-center w-20 h-20 mx-auto mb-4 bg-emerald-50 rounded-full">
                <MapPin className="w-10 h-10 text-emerald-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">No barangays found</h3>
              <p className="text-gray-600">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-500 uppercase">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        Barangay Information
                      </div>
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-500 uppercase">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Officials
                      </div>
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-500 uppercase">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        Contact
                      </div>
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-500 uppercase">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        Population
                      </div>
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold tracking-wider text-right text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredBarangays.map((barangay) => (
                    <tr key={barangay.id} className="hover:bg-emerald-50/40 transition-all duration-200">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 text-white font-bold rounded-full flex items-center justify-center text-sm">
                            {barangay.name?.charAt(0)}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">{barangay.name}</div>
                            <div className="text-sm text-gray-600">
                              {barangay.address || <span className="text-xs text-gray-400 italic">No address</span>}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="text-sm">
                          <div className="font-medium text-gray-900">
                            {barangay.barangay_captain || <span className="text-xs text-gray-400 italic">No captain assigned</span>}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            Health Officer: {barangay.health_officer || <span className="text-xs text-gray-400 italic">N/A</span>}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-1 text-sm text-gray-900">
                          <Phone className="w-4 h-4 text-gray-400" />
                          {barangay.contact_number || <span className="text-xs text-gray-400 italic">N/A</span>}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="text-sm font-medium text-gray-900">
                          {barangay.population ? barangay.population.toLocaleString() : <span className="text-xs text-gray-400 italic">N/A</span>}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          M: {barangay.population_male || 0} / F: {barangay.population_female || 0}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center justify-end gap-1">
                          <button 
                            onClick={() => handleView(barangay)} 
                            className="p-2.5 text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleEdit(barangay)} 
                            className="p-2.5 text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all duration-200"
                          >
                            <Edit className="w-4 h-4" />
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
      </motion.div>

      {/* View Modal */}
      {showViewModal && selectedBarangay && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-3xl max-h-[90vh] overflow-y-auto"
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center rounded-t-2xl z-10">
              <h2 className="text-2xl font-bold text-gray-900 border-l-4 border-emerald-500 pl-4">Barangay Details</h2>
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
                  {selectedBarangay.name?.charAt(0)}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {selectedBarangay.name}
                </h3>
                <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold bg-emerald-100 text-emerald-700">
                  <MapPin className="w-4 h-4" />
                  Barangay
                </span>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Address</p>
                  <p className="text-sm font-medium text-gray-900">{selectedBarangay.address || 'N/A'}</p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Contact Number</p>
                  <p className="text-sm font-medium text-gray-900">{selectedBarangay.contact_number || 'N/A'}</p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Barangay Captain</p>
                  <p className="text-sm font-medium text-gray-900">{selectedBarangay.barangay_captain || 'N/A'}</p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Health Officer</p>
                  <p className="text-sm font-medium text-gray-900">{selectedBarangay.health_officer || 'N/A'}</p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Coverage Area</p>
                  <p className="text-sm font-medium text-gray-900">{selectedBarangay.coverage_area || 'N/A'}</p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Total Population</p>
                  <p className="text-sm font-medium text-gray-900">{selectedBarangay.population?.toLocaleString() || 'N/A'}</p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 md:col-span-2">
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Population Breakdown</p>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">Male</p>
                      <p className="text-lg font-bold text-gray-900">{selectedBarangay.population_male?.toLocaleString() || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Female</p>
                      <p className="text-lg font-bold text-gray-900">{selectedBarangay.population_female?.toLocaleString() || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Children</p>
                      <p className="text-lg font-bold text-gray-900">{selectedBarangay.population_children?.toLocaleString() || 'N/A'}</p>
                    </div>
                  </div>
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

      {/* Edit Modal */}
      {showEditModal && selectedBarangay && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center rounded-t-2xl z-10">
              <h2 className="text-2xl font-bold text-gray-900 border-l-4 border-emerald-500 pl-4">Edit Barangay</h2>
              <button 
                onClick={() => setShowEditModal(false)} 
                className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-xl transition-all duration-200"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-6">
                {/* Basic Information Section */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-emerald-600" />
                    Basic Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Barangay Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 ${
                          errors.name ? 'border-red-300' : 'border-gray-300'
                        }`}
                      />
                      {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Address</label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Contact Number</label>
                      <input
                        type="text"
                        name="contact_number"
                        value={formData.contact_number}
                        onChange={handleInputChange}
                        placeholder="09XXXXXXXXX"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Coverage Area</label>
                      <input
                        type="text"
                        name="coverage_area"
                        value={formData.coverage_area}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                  </div>
                </div>

                {/* Officials Section */}
                <div className="pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-emerald-600" />
                    Officials
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Barangay Captain</label>
                      <input
                        type="text"
                        name="barangay_captain"
                        value={formData.barangay_captain}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Health Officer</label>
                      <input
                        type="text"
                        name="health_officer"
                        value={formData.health_officer}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                  </div>
                </div>

                {/* Population Data Section */}
                <div className="pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5 text-emerald-600" />
                    Population Data
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Total Population</label>
                      <input
                        type="number"
                        name="population"
                        value={formData.population}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Male Population</label>
                      <input
                        type="number"
                        name="population_male"
                        value={formData.population_male}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Female Population</label>
                      <input
                        type="number"
                        name="population_female"
                        value={formData.population_female}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Children Population</label>
                      <input
                        type="number"
                        name="population_children"
                        value={formData.population_children}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                  </div>
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

    </AdminLayout>
  );
};

export default ManageBarangay;
