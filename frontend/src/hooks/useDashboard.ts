import { useQuery } from '@tanstack/react-query';
import { dashboardService, DashboardStats, RecentActivity, DashboardAlerts, PatientSearchResult } from '@/services/dashboardService';

export function useDashboardStats(barangayId?: number) {
  return useQuery({
    queryKey: ['dashboardStats', barangayId],
    queryFn: () => dashboardService.getStats(barangayId),
    staleTime: 2 * 60 * 1000,
  });
}

export function useRecentActivities() {
  return useQuery({
    queryKey: ['recentActivities'],
    queryFn: () => dashboardService.getRecentActivities(),
    staleTime: 1 * 60 * 1000,
  });
}

export function useTodayAppointments() {
  return useQuery({
    queryKey: ['todayAppointments'],
    queryFn: () => dashboardService.getTodayAppointments(),
    staleTime: 1 * 60 * 1000,
  });
}

export function useDashboardAlerts() {
  return useQuery({
    queryKey: ['dashboardAlerts'],
    queryFn: () => dashboardService.fetchAlerts(),
    staleTime: 2 * 60 * 1000,
  });
}

export function usePatientSearch(query: string, barangayId?: number) {
  return useQuery({
    queryKey: ['patientSearch', query, barangayId],
    queryFn: () => dashboardService.searchPatients(query, barangayId),
    enabled: query.length >= 2,
    staleTime: 5 * 60 * 1000,
  });
}

export function useMonthlyTrend() {
  return useQuery({
    queryKey: ['dashboard', 'monthly-trend'],
    queryFn: () => dashboardService.getMonthlyTrend(),
    staleTime: 5 * 60 * 1000,
  });
}
