import api from './api';

export interface BarangayStat {
  id: number;
  name: string;
  population: number;
  records: number;
}

export interface DashboardStats {
  immunization_count: number;
  maternal_care_count: number;
  family_planning_count: number;
  senior_citizen_count: number;
  total_records: number;
  monthly_targets: {
    immunization: number;
    maternal_care: number;
    family_planning: number;
    senior_citizen: number;
  };
  barangay_stats: BarangayStat[];
}

export interface RecentActivity {
  id: number;
  type: 'immunization' | 'maternal_care' | 'family_planning' | 'senior_citizen';
  title: string;
  patient_name: string;
  barangay_name: string;
  created_at: string;
}

export interface DashboardAlerts {
  overdue_immunizations: number;
  upcoming_appointments: number;
  high_risk_maternal: number;
}

export interface PatientSearchResult {
  id: number;
  name: string;
  program: string;
  barangay_name: string;
}

export const dashboardService = {
  async getStats(barangay_id?: number): Promise<DashboardStats> {
    const params = barangay_id ? { barangay_id } : {};
    const response = await api.get('/dashboard/stats', { params });
    return response.data;
  },

  async getRecentActivities(): Promise<RecentActivity[]> {
    const response = await api.get('/dashboard/recent-activities');
    return response.data;
  },

  async getTodayAppointments() {
    const response = await api.get('/dashboard/appointments/today');
    return response.data;
  },

  async fetchAlerts(): Promise<DashboardAlerts> {
    const response = await api.get('/dashboard/alerts');
    return response.data;
  },

  async searchPatients(q: string, barangay_id?: number): Promise<PatientSearchResult[]> {
    const params: Record<string, any> = { q };
    if (barangay_id) params.barangay_id = barangay_id;
    const response = await api.get('/patients/search', { params });
    return response.data;
  },

  async getMonthlyTrend(): Promise<Array<{ month: string; myRecords: number; globalRecords: number }>> {
    const response = await api.get('/dashboard/monthly-trend');
    return response.data;
  },
};
