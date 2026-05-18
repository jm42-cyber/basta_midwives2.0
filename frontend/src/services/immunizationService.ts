import api from './api';
import { ImmunizationRecord } from '@/types';

export const immunizationService = {
  getAll: (params?: { status?: string; barangay_id?: number }) =>
    api.get<{ data: ImmunizationRecord[] }>('/immunization-records', { params }),

  getById: (id: number) =>
    api.get<ImmunizationRecord>(`/immunization-records/${id}`),

  create: (data: Partial<ImmunizationRecord>) =>
    api.post<ImmunizationRecord>('/immunization-records', data),

  update: (id: number, data: Partial<ImmunizationRecord>) =>
    api.put<ImmunizationRecord>(`/immunization-records/${id}`, data),

  delete: (id: number) =>
    api.delete(`/immunization-records/${id}`),

  toggleStatus: (id: number) =>
    api.post<ImmunizationRecord>(`/immunization-records/${id}/toggle-status`),

  export: (endpoint: string) =>
    api.get(endpoint, { responseType: 'blob' }),
};
