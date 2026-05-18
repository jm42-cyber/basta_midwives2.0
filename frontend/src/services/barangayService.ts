import api from './api';
import { Barangay } from '@/types';

export const barangayService = {
  getAll: () => api.get<{ data: Barangay[] }>('/barangays'),
  getById: (id: number) => api.get<Barangay>(`/barangays/${id}`),
  update: (id: number, data: Partial<Barangay>) => api.put<Barangay>(`/barangays/${id}`, data),
};
