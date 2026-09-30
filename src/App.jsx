import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { DashboardLayout } from './layouts/DashboardLayout';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { OfficerDashboard } from './pages/OfficerDashboard';
import { CitizenDashboard } from './pages/CitizenDashboard';
import { LandRecordsPage } from './pages/LandRecordsPage';
import { LandRecordDetailPage } from './pages/LandRecordDetailPage';
import { GisMapPage } from './pages/GisMapPage';
import { AiValidationPage } from './pages/AiValidationPage';
import { DisputeManagementPage } from './pages/DisputeManagementPage';
import { DisputeDetailPage } from './pages/DisputeDetailPage';
import { DocumentsPage } from './pages/DocumentsPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { PolicyInsightsPage } from './pages/PolicyInsightsPage';
import { AuditLogsPage } from './pages/AuditLogsPage';
import { AdminPanelPage } from './pages/AdminPanelPage';
import { NotificationsPage } from './pages/NotificationsPage';

export function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Landing & Login */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />

            {/* Authenticated Dashboard Layout Routes */}
            <Route element={<DashboardLayout />}>
              <Route path="/officer/dashboard" element={<OfficerDashboard />} />
              <Route path="/citizen/dashboard" element={<CitizenDashboard />} />
              <Route path="/records" element={<LandRecordsPage />} />
              <Route path="/records/:id" element={<LandRecordDetailPage />} />
              <Route path="/gis-map" element={<GisMapPage />} />
              <Route path="/ai-validation" element={<AiValidationPage />} />
              <Route path="/disputes" element={<DisputeManagementPage />} />
              <Route path="/disputes/:id" element={<DisputeDetailPage />} />
              <Route path="/documents" element={<DocumentsPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/policy-insights" element={<PolicyInsightsPage />} />
              <Route path="/audit-logs" element={<AuditLogsPage />} />
              <Route path="/admin" element={<AdminPanelPage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
            </Route>

            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
