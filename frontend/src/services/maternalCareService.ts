import axios from 'axios';
import { MaternalCareRecord } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const maternalCareService = {
  getAll: async (params?: { search?: string; barangay_id?: number }) => {
    const response = await api.get<MaternalCareRecord[]>('/maternal-care-records', { 
      params: { ...params, per_page: 10000 } // Get all records
    });
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get<MaternalCareRecord>(`/maternal-care-records/${id}`);
    return response.data;
  },

  create: async (data: Partial<MaternalCareRecord>) => {
    const response = await api.post<MaternalCareRecord>('/maternal-care-records', data);
    return response.data;
  },

  update: async (id: number, data: Partial<MaternalCareRecord>) => {
    const response = await api.put<MaternalCareRecord>(`/maternal-care-records/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete(`/maternal-care-records/${id}`);
    return response.data;
  },

  toggleStatus: async (id: number) => {
    const response = await api.post<MaternalCareRecord>(`/maternal-care-records/${id}/toggle-status`);
    return response.data;
  },

  export: (endpoint: string) => api.get(endpoint, { responseType: 'blob' }),
};
