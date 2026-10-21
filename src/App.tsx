import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AlertSystemProvider } from './context/AlertSystemContext';
import { AppProvider } from './context/AppContext';
import { AlertLayout } from './components/layout/AlertLayout';

// Focused Attendance Alert & Notification System Pages
import { OverviewPage } from './pages/alert/OverviewPage';
import { AttendanceRecordsPage } from './pages/alert/AttendanceRecordsPage';
import { DirectoryPage } from './pages/alert/DirectoryPage';
import { NotificationCenterPage } from './pages/alert/NotificationCenterPage';
import { TemplatesSettingsPage } from './pages/alert/TemplatesSettingsPage';

export function App() {
  return (
    <AppProvider>
      <AlertSystemProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<AlertLayout />}>
              {/* Primary Focused Workflow Routes */}
              <Route path="/" element={<OverviewPage />} />
              <Route path="/overview" element={<Navigate to="/" replace />} />
              <Route path="/attendance-records" element={<AttendanceRecordsPage />} />
              <Route path="/directory" element={<DirectoryPage />} />
              <Route path="/notifications" element={<NotificationCenterPage />} />
              <Route path="/settings" element={<TemplatesSettingsPage />} />
              <Route path="/templates" element={<Navigate to="/settings" replace />} />

              {/* Catch-all redirect to Overview */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AlertSystemProvider>
    </AppProvider>
  );
}

export default App;
