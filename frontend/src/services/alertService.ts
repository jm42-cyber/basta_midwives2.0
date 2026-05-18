import api from './api';

export interface Alert {
  id: number;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  sender_role: 'admin' | 'midwife';
  sender_id: number;
  sender_name?: string;
  sender_barangay?: string;
  recipient_type: 'all' | 'barangay' | 'specific' | 'admin';
  recipient_ids: number[] | null;
  reply: string | null;
  reply_at: string | null;
  read_at: string | null;
  expires_at: string | null;
  created_at: string;
}

export interface CreateAlertData {
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  recipient_type?: 'all' | 'barangay' | 'specific' | 'admin';
  recipient_ids?: number[];
  expires_at?: string;
}

export interface ReplyData {
  reply: string;
}

export interface MidwifeListItem {
  id: number;
  full_name: string;
  barangay_name: string;
}

const alertService = {
  getAll: async (): Promise<Alert[]> => {
    const response = await api.get('/alerts');
    return response.data;
  },

  create: async (data: CreateAlertData): Promise<Alert> => {
    const response = await api.post('/alerts', data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/alerts/${id}`);
  },

  reply: async (id: number, data: ReplyData): Promise<Alert> => {
    const response = await api.post(`/alerts/${id}/reply`, data);
    return response.data;
  },

  markRead: async (id: number): Promise<Alert> => {
    const response = await api.patch(`/alerts/${id}/read`);
    return response.data;
  },

  getMidwivesList: async (): Promise<MidwifeListItem[]> => {
    const response = await api.get('/admin/midwives-list');
    return response.data;
  },
};

export default alertService;
