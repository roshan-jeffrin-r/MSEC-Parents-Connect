import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { AlertNavbar } from './AlertNavbar';
import { AlertSidebar } from './AlertSidebar';
import { Breadcrumbs } from '../common/Breadcrumbs';

export const AlertLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
    return localStorage.getItem('msec_sidebar_collapsed') === 'true';
  });

  const toggleSidebarCollapse = () => {
    setIsSidebarCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem('msec_sidebar_collapsed', String(next));
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans antialiased">
      {/* Top Navbar */}
      <AlertNavbar onToggleSidebar={() => setIsSidebarOpen(true)} />

      {/* Main Layout Area */}
      <div className="flex-1 flex">
        {/* Left Sidebar */}
        <AlertSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={toggleSidebarCollapse}
        />

        {/* Content Area */}
        <div
          className={`flex-1 flex flex-col transition-all duration-200 ${
            isSidebarCollapsed ? 'md:ml-16' : 'md:ml-56'
          }`}
        >
          <main className="flex-1 p-3.5 sm:p-5 max-w-7xl w-full mx-auto space-y-3.5">
            <Breadcrumbs />
            <Outlet />
          </main>

          {/* Minimal 1-line Footer */}
          <footer className="py-2.5 px-4 text-center border-t border-slate-200 bg-white text-[11px] text-slate-400">
            Meenakshi Sundararajan Engineering College (Autonomous) • Student Attendance Monitoring &amp; Parent Alert System
          </footer>
        </div>
      </div>
    </div>
  );
};
