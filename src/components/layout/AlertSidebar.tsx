import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAlertSystem } from '../../context/AlertSystemContext';
import {
  LayoutDashboard,
  CalendarCheck,
  Users,
  Bell,
  Sliders,
  ChevronLeft,
  ChevronRight,
  Shield,
  X
} from 'lucide-react';

interface AlertSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const AlertSidebar: React.FC<AlertSidebarProps> = ({
  isOpen,
  onClose,
  isCollapsed,
  onToggleCollapse
}) => {
  const { notificationJobs } = useAlertSystem();
  const navigate = useNavigate();

  const pendingJobsCount = notificationJobs.filter(
    (j) => j.smsStatus === 'Pending' || j.whatsAppStatus === 'Pending'
  ).length;

  const navItems = [
    {
      label: 'Overview',
      path: '/',
      icon: LayoutDashboard,
      description: 'Executive statistics & alert status'
    },
    {
      label: 'Attendance Records',
      path: '/attendance-records',
      icon: CalendarCheck,
      description: 'Daily muster & CSV imports'
    },
    {
      label: 'Student Directory',
      path: '/directory',
      icon: Users,
      description: 'Guardian contacts & channels'
    },
    {
      label: 'Notification Center',
      path: '/notifications',
      icon: Bell,
      badge: pendingJobsCount > 0 ? pendingJobsCount : undefined,
      description: 'Alert jobs & delivery logs'
    },
    {
      label: 'Templates & Settings',
      path: '/settings',
      icon: Sliders,
      description: 'Rules, thresholds & messages'
    }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-2xs z-40 md:hidden"
        />
      )}

      {/* Sidebar Rail */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 bg-white border-r border-slate-200 transition-all duration-200 flex flex-col justify-between ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } ${isCollapsed ? 'md:w-16' : 'md:w-56'} w-64`}
      >
        <div>
          {/* Mobile Top Header in Drawer */}
          <div className="h-14 border-b border-slate-200 px-4 flex items-center justify-between md:hidden">
            <span className="font-black text-xs text-slate-900 tracking-tight">
              MSEC Parent Connect
            </span>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Section Title */}
          <div className="px-3 pt-3 pb-1 flex items-center justify-between">
            {!isCollapsed ? (
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Attendance Core
              </span>
            ) : null}

            {/* Desktop Collapse Toggle */}
            <button
              type="button"
              onClick={onToggleCollapse}
              aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              className="hidden md:flex p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors ml-auto"
            >
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          {/* Nav Links */}
          <nav className="px-2 space-y-1 mt-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/'}
                  onClick={() => onClose()}
                  title={isCollapsed ? item.label : undefined}
                  className={({ isActive }) =>
                    `flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all group relative ${
                      isActive
                        ? 'bg-blue-700 text-white shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {!isCollapsed && (
                    <span className="truncate flex-1">{item.label}</span>
                  )}
                  {item.badge !== undefined && (
                    <span
                      className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold shrink-0 ${
                        isCollapsed
                          ? 'absolute -top-1 -right-1 bg-blue-600 text-white'
                          : 'bg-rose-500 text-white'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom Sandbox Status Card */}
        <div className="p-2.5 border-t border-slate-200 bg-slate-50/70">
          {!isCollapsed ? (
            <div className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 text-[10px] space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-slate-900">
                <Shield className="w-3 h-3 text-blue-600 shrink-0" />
                <span>Sandbox Mode</span>
              </div>
              <p className="text-[10px] text-slate-500 leading-tight">
                Simulated Mock SMS &amp; WhatsApp delivery. No real carrier dispatches.
              </p>
            </div>
          ) : (
            <div className="flex justify-center" title="Sandbox Mock Environment Active">
              <Shield className="w-4 h-4 text-blue-600" />
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
