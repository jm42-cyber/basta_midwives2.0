import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';
import { useAuthStore } from './store/authStore';
import { useEffect, useState } from 'react';
import { queryClient } from './lib/queryClient';
import 'react-toastify/dist/ReactToastify.css';

import LandingPage from './pages/LandingPage';
import ImmunizationInfoPage from './pages/ImmunizationInfoPage';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import AdminDashboard from './pages/admin/AdminDashboard';
import PendingAccounts from './pages/admin/PendingAccounts';
import MidwifeDashboard from './pages/dashboard/MidwifeDashboard';
import ImmunizationPage from './pages/programs/ImmunizationPage';
import FamilyPlanningDashboardPage from './pages/programs/FamilyPlanningDashboardPage';
import MaternalCareDashboardPage from './pages/programs/MaternalCareDashboardPage';
import SeniorCitizenDashboardPage from './pages/programs/SeniorCitizenDashboardPage';
import MaternalCarePage from './pages/programs/MaternalCarePage';
import FamilyPlanningPage from './pages/programs/FamilyPlanningPage';
import SeniorCarePage from './pages/programs/SeniorCarePage';
import DocumentationPage from './pages/DocumentationPage';
import AppointmentsPage from './pages/dashboard/AppointmentsPage';
import AllPatientsPage from './pages/dashboard/AllPatientsPage';
import ArchivePage from './pages/dashboard/ArchivePage';
import UsersPage from './pages/admin/ManageMidwives';
import BarangaysPage from './pages/admin/ManageBarangay';
import AdminAlerts from './pages/admin/AdminAlerts';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';
import AdminManualPage from './pages/admin/AdminManualPage';
import SecurityGuidePage from './pages/admin/SecurityGuidePage';
import ReportIssuePage from './pages/admin/ReportIssuePage';
import ReportsPage from './pages/admin/ReportsPage';
import AuditLogsPage from './pages/admin/AuditLogsPage';
import SettingsPage from './pages/dashboard/SettingsPage';
import UserManualPage from './pages/dashboard/UserManualPage';
import ReleaseNotesPage from './pages/dashboard/ReleaseNotesPage';
import ReportBugPage from './pages/dashboard/ReportBugPage';
import AlertsPage from './pages/dashboard/AlertsPage';
import ScrollToTop from './components/ScrollToTop';

function App() {
  const { initialize, isAuthenticated, user } = useAuthStore();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    initialize();
    setIsInitialized(true);
  }, [initialize]);

  if (!isInitialized) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/documentation" element={<DocumentationPage />} />
          <Route path="/programs/immunization" element={<ImmunizationInfoPage />} />
          <Route path="/programs/maternal-care" element={<MaternalCarePage />} />
          <Route path="/programs/family-planning" element={<FamilyPlanningPage />} />
          <Route path="/programs/senior-care" element={<SeniorCarePage />} />
          
          <Route
            path="/dashboard"
            element={
              isAuthenticated ? (
                user?.role === 'admin' ? <AdminDashboard /> : <MidwifeDashboard />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/dashboard/appointments"
            element={
              isAuthenticated ? <AppointmentsPage /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/dashboard/patients"
            element={
              isAuthenticated ? <AllPatientsPage /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/dashboard/archive"
            element={
              isAuthenticated ? <ArchivePage /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/dashboard/immunization"
            element={
              isAuthenticated ? <ImmunizationPage /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/dashboard/family-planning"
            element={
              isAuthenticated ? <FamilyPlanningDashboardPage /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/dashboard/maternal-care"
            element={
              isAuthenticated ? <MaternalCareDashboardPage /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/dashboard/senior-citizen"
            element={
              isAuthenticated ? <SeniorCitizenDashboardPage /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/dashboard/settings"
            element={
              isAuthenticated ? <SettingsPage /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/dashboard/alerts"
            element={
              isAuthenticated ? <AlertsPage /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/dashboard/user-manual"
            element={
              isAuthenticated ? <UserManualPage /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/dashboard/release-notes"
            element={
              isAuthenticated ? <ReleaseNotesPage /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/dashboard/report-bug"
            element={
              isAuthenticated ? <ReportBugPage /> : <Navigate to="/login" />
            }
          />
          
          <Route
            path="/admin/dashboard"
            element={
              isAuthenticated && user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/admin/users"
            element={
              isAuthenticated && user?.role === 'admin' ? <UsersPage /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/admin/barangays"
            element={
              isAuthenticated && user?.role === 'admin' ? <BarangaysPage /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/admin/pending-accounts"
            element={
              isAuthenticated && user?.role === 'admin' ? <PendingAccounts /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/admin/alerts"
            element={
              isAuthenticated && user?.role === 'admin' ? <AdminAlerts /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/admin/settings"
            element={
              isAuthenticated && user?.role === 'admin' ? <AdminSettingsPage /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/admin/reports"
            element={
              isAuthenticated && user?.role === 'admin' ? <ReportsPage /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/admin/logs"
            element={
              isAuthenticated && user?.role === 'admin' ? <AuditLogsPage /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/admin/manual"
            element={
              isAuthenticated && user?.role === 'admin' ? <AdminManualPage /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/admin/security-guide"
            element={
              isAuthenticated && user?.role === 'admin' ? <SecurityGuidePage /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/admin/report-issue"
            element={
              isAuthenticated && user?.role === 'admin' ? <ReportIssuePage /> : <Navigate to="/login" />
            }
          />
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          closeOnClick
          pauseOnHover
          className="!p-4"
          toastClassName="!bg-white !text-gray-900 !rounded-2xl !border !border-gray-200 !shadow-xl !font-medium !text-sm"
          progressClassName="!bg-emerald-500"
          bodyClassName="!text-gray-800 !text-sm !font-medium"
        />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
