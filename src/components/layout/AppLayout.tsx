import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';
import { MobileBottomNav } from './MobileBottomNav';
import { Breadcrumbs } from '../common/Breadcrumbs';
import { DemoGuideModal } from '../demo/DemoGuideModal';
import { ParentAutoLoginModal } from '../../pages/onboard/ParentAutoLoginModal';

export const AppLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
    return localStorage.getItem('msec_sidebar_collapsed') === 'true';
  });

  const toggleCollapse = () => {
    setIsSidebarCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem('msec_sidebar_collapsed', String(next));
      return next;
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        isSidebarCollapsed={isSidebarCollapsed}
        onToggleCollapse={toggleCollapse}
      />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={toggleCollapse}
        />

        <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          <div className="flex-1 p-3.5 sm:p-5 lg:p-6 max-w-7xl w-full mx-auto pb-20 md:pb-6">
            <Breadcrumbs />
            <Outlet />
          </div>
          <Footer />
        </main>
      </div>

      <MobileBottomNav />
      <DemoGuideModal />
      <ParentAutoLoginModal />
    </div>
  );
};
