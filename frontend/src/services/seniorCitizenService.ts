import api from './api';
import { SeniorCitizenRecord } from '@/types';

export const seniorCitizenService = {
  getAll: (params?: any) => api.get('/senior-citizen-records', { params }),
  
  getById: (id: number) => api.get(`/senior-citizen-records/${id}`),
  
  create: (data: Partial<SeniorCitizenRecord>) => api.post('/senior-citizen-records', data),
  
  update: (id: number, data: Partial<SeniorCitizenRecord>) => api.put(`/senior-citizen-records/${id}`, data),
  
  delete: (id: number) => api.delete(`/senior-citizen-records/${id}`),
  
  toggleStatus: (id: number) => api.post(`/senior-citizen-records/${id}/toggle-status`),

  export: (format: 'excel' | 'pdf', filters?: any) => 
    api.get(`/senior-citizen-records/export/${format}`, { 
      params: filters,
      responseType: 'blob'
    }),
};
