import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { AppLayout } from './components/layout/AppLayout';

// Parent Pages
import { ParentDashboard } from './pages/parent/ParentDashboard';
import { ReportCardsPage } from './pages/parent/ReportCardsPage';
import { AttendancePage } from './pages/parent/AttendancePage';
import { LeaveRequestsPage } from './pages/parent/LeaveRequestsPage';
import { NotificationsPage } from './pages/parent/NotificationsPage';
import { AnnouncementsPage } from './pages/parent/AnnouncementsPage';
import { ProfilePage } from './pages/parent/ProfilePage';
import { SettingsPage } from './pages/parent/SettingsPage';

// Teacher Pages
import { TeacherDashboard } from './pages/teacher/TeacherDashboard';
import { TeacherClassesPage } from './pages/teacher/TeacherClassesPage';
import { TeacherAttendancePage } from './pages/teacher/TeacherAttendancePage';
import { TeacherMarksPage } from './pages/teacher/TeacherMarksPage';
import { TeacherLeaveReviewPage } from './pages/teacher/TeacherLeaveReviewPage';
import { TeacherProfilePage } from './pages/teacher/TeacherProfilePage';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminStudentsPage } from './pages/admin/AdminStudentsPage';
import { AdminExaminationsPage } from './pages/admin/AdminExaminationsPage';
import { AdminAnnouncementsPage } from './pages/admin/AdminAnnouncementsPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';

export function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            {/* Parent Routes */}
            <Route path="/" element={<ParentDashboard />} />
            <Route path="/report-cards" element={<ReportCardsPage />} />
            <Route path="/attendance" element={<AttendancePage />} />
            <Route path="/leave-requests" element={<LeaveRequestsPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/announcements" element={<AnnouncementsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/settings" element={<SettingsPage />} />

            {/* Teacher Routes */}
            <Route path="/teacher" element={<TeacherDashboard />} />
            <Route path="/teacher/classes" element={<TeacherClassesPage />} />
            <Route path="/teacher/attendance" element={<TeacherAttendancePage />} />
            <Route path="/teacher/marks" element={<TeacherMarksPage />} />
            <Route path="/teacher/leave-requests" element={<TeacherLeaveReviewPage />} />
            <Route path="/teacher/profile" element={<TeacherProfilePage />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/students" element={<AdminStudentsPage />} />
            <Route path="/admin/examinations" element={<AdminExaminationsPage />} />
            <Route path="/admin/announcements" element={<AdminAnnouncementsPage />} />
            <Route path="/admin/settings" element={<AdminSettingsPage />} />

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
