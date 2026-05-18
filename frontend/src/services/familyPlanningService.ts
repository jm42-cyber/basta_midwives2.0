import api from './api';

export const familyPlanningService = {
  getAll: (params?: any) => api.get('/family-planning-records', { params }),
  getById: (id: number) => api.get(`/family-planning-records/${id}`),
  create: (data: any) => api.post('/family-planning-records', data),
  update: (id: number, data: any) => api.put(`/family-planning-records/${id}`, data),
  delete: (id: number) => api.delete(`/family-planning-records/${id}`),
  toggleStatus: (id: number) => api.post(`/family-planning-records/${id}/toggle-status`),
  export: (endpoint: string) => api.get(endpoint, { responseType: 'blob' }),
};
