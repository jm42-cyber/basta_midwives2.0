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
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-16 h-16 shadow-lg bg-gradient-to-br from-emerald-500 via-green-600 to-teal-600 rounded-2xl">
              <MapPin className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-transparent bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text">Manage Barangays</h1>
              <p className="flex items-center gap-2 mt-1 text-gray-600">
                <MapPin className="w-4 h-4" />
                Comprehensive barangay information management system
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
                <p className="text-sm font-medium text-gray-600">Total Barangays</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalBarangays}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
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
                <p className="text-sm font-medium text-gray-600">Total Population</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalPopulation.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
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
                <p className="text-sm font-medium text-gray-600">Active Captains</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.activeCaptains}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-white" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Search Bar */}
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
          <button 
            onClick={() => setShowFiltersModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
          >
            <Filter className="w-5 h-5 text-gray-600" />
            <span className="font-medium text-gray-700">Filters</span>
          </button>
        </div>

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
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full">
                <MapPin className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-lg text-gray-500">No barangays found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-gray-200 bg-gray-900">
                  <tr>
                    <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-white uppercase">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        Barangay Information
                      </div>
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-white uppercase">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Officials
                      </div>
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-white uppercase">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        Contact
                      </div>
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-white uppercase">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        Population
                      </div>
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold tracking-wider text-right text-white uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredBarangays.map((barangay) => (
                    <tr key={barangay.id} className="transition-all duration-200 hover:bg-emerald-50/50 hover:shadow-sm">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm bg-emerald-500">
                            {barangay.name?.charAt(0)}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">{barangay.name}</div>
                            <div className="text-sm text-gray-600">
                              {barangay.address ? (
                                barangay.address
                              ) : (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-500">N/A</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="text-sm">
                          <div className="font-medium text-gray-900">
                            {barangay.barangay_captain ? (
                              barangay.barangay_captain
                            ) : (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-500">N/A</span>
                            )}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            Health Officer: {barangay.health_officer ? (
                              barangay.health_officer
                            ) : (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-500">N/A</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-1 text-sm text-gray-900">
                          <Phone className="w-4 h-4 text-gray-400" />
                          {barangay.contact_number ? (
                            barangay.contact_number
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-500">N/A</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="text-sm font-medium text-gray-900">
                          {barangay.population ? (
                            barangay.population.toLocaleString()
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-500">N/A</span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          M: {barangay.population_male || 0} / F: {barangay.population_female || 0}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center justify-end gap-1">
                          <button 
                            onClick={() => handleView(barangay)} 
                            className="p-2.5 text-blue-600 hover:bg-blue-100 rounded-xl transition-all duration-200"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleEdit(barangay)} 
                            className="p-2.5 text-emerald-600 hover:bg-emerald-100 rounded-xl transition-all duration-200"
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-emerald-500 to-green-600 text-white p-6 flex justify-between items-center rounded-t-lg z-10">
              <h2 className="text-2xl font-bold">Barangay Details</h2>
              <button onClick={() => setShowViewModal(false)} className="hover:bg-white/20 p-2 rounded">
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-gradient-to-r from-emerald-50 to-green-100 rounded-lg">
                  <h3 className="text-sm font-semibold text-emerald-700 mb-2">Barangay Name</h3>
                  <p className="text-gray-900 font-medium">{selectedBarangay.name}</p>
                </div>

                <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
                  <h3 className="text-sm font-semibold text-blue-700 mb-2">Address</h3>
                  <p className="text-gray-900">{selectedBarangay.address || 'N/A'}</p>
                </div>

                <div className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg">
                  <h3 className="text-sm font-semibold text-purple-700 mb-2">Barangay Captain</h3>
                  <p className="text-gray-900">{selectedBarangay.barangay_captain || 'N/A'}</p>
                </div>

                <div className="p-4 bg-gradient-to-r from-pink-50 to-pink-100 rounded-lg">
                  <h3 className="text-sm font-semibold text-pink-700 mb-2">Health Officer</h3>
                  <p className="text-gray-900">{selectedBarangay.health_officer || 'N/A'}</p>
                </div>

                <div className="p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg">
                  <h3 className="text-sm font-semibold text-yellow-700 mb-2">Contact Number</h3>
                  <p className="text-gray-900">{selectedBarangay.contact_number || 'N/A'}</p>
                </div>

                <div className="p-4 bg-gradient-to-r from-teal-50 to-teal-100 rounded-lg">
                  <h3 className="text-sm font-semibold text-teal-700 mb-2">Coverage Area</h3>
                  <p className="text-gray-900">{selectedBarangay.coverage_area || 'N/A'}</p>
                </div>

                <div className="p-4 bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-lg">
                  <h3 className="text-sm font-semibold text-indigo-700 mb-2">Total Population</h3>
                  <p className="text-gray-900 text-2xl font-bold">{selectedBarangay.population?.toLocaleString() || 'N/A'}</p>
                </div>

                <div className="p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg">
                  <h3 className="text-sm font-semibold text-orange-700 mb-2">Population Breakdown</h3>
                  <div className="space-y-1 text-sm">
                    <p className="text-gray-900">Male: {selectedBarangay.population_male?.toLocaleString() || 'N/A'}</p>
                    <p className="text-gray-900">Female: {selectedBarangay.population_female?.toLocaleString() || 'N/A'}</p>
                    <p className="text-gray-900">Children: {selectedBarangay.population_children?.toLocaleString() || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedBarangay && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-emerald-500 to-green-600 text-white p-6 flex justify-between items-center rounded-t-lg z-10">
              <h2 className="text-2xl font-bold">Edit Barangay</h2>
              <button onClick={() => setShowEditModal(false)} className="hover:bg-white/20 p-2 rounded">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="mb-6 p-4 bg-gradient-to-r from-emerald-50 to-green-100 rounded-lg">
                <h3 className="text-lg font-semibold text-emerald-700 mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Barangay Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 ${
                        errors.name ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                    <input
                      type="text"
                      name="contact_number"
                      value={formData.contact_number}
                      onChange={handleInputChange}
                      placeholder="09XXXXXXXXX"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Coverage Area</label>
                    <input
                      type="text"
                      name="coverage_area"
                      value={formData.coverage_area}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>

              <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-700 mb-4">Officials</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Barangay Captain</label>
                    <input
                      type="text"
                      name="barangay_captain"
                      value={formData.barangay_captain}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Health Officer</label>
                    <input
                      type="text"
                      name="health_officer"
                      value={formData.health_officer}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>

              <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-700 mb-4">Population Data</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Total Population</label>
                    <input
                      type="number"
                      name="population"
                      value={formData.population}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Male Population</label>
                    <input
                      type="number"
                      name="population_male"
                      value={formData.population_male}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Female Population</label>
                    <input
                      type="number"
                      name="population_female"
                      value={formData.population_female}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Children Population</label>
                    <input
                      type="number"
                      name="population_children"
                      value={formData.population_children}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-lg hover:from-emerald-600 hover:to-green-700"
                >
                  Update Barangay
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Filters Modal */}
      {showFiltersModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="bg-gradient-to-r from-emerald-500 to-green-600 text-white p-6 flex justify-between items-center rounded-t-lg">
              <h2 className="text-2xl font-bold">Filter Barangays</h2>
              <button onClick={() => setShowFiltersModal(false)} className="hover:bg-white/20 p-2 rounded">
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              <p className="text-gray-600 text-center py-8">Filter options coming soon...</p>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowFiltersModal(false)}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default ManageBarangay;
