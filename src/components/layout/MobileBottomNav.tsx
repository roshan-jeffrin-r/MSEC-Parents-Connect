import React from 'react';
import { NavLink } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  FileText,
  CalendarCheck,
  Send,
  Bell,
  Users,
  Award,
  CheckSquare
} from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const { role, notifications, leaveRequests } = useApp();

  const unreadNotifications = notifications.filter((n) => !n.readStatus).length;
  const pendingLeaves = leaveRequests.filter((l) => l.status === 'Pending').length;

  const parentItems = [
    { label: 'Home', path: '/', icon: LayoutDashboard },
    { label: 'Marks', path: '/report-cards', icon: FileText },
    { label: 'Attendance', path: '/attendance', icon: CalendarCheck },
    { label: 'Leave', path: '/leave-requests', icon: Send, badge: pendingLeaves > 0 ? pendingLeaves : undefined },
    { label: 'Alerts', path: '/notifications', icon: Bell, badge: unreadNotifications > 0 ? unreadNotifications : undefined }
  ];

  const teacherItems = [
    { label: 'Overview', path: '/teacher', icon: LayoutDashboard },
    { label: 'Classes', path: '/teacher/classes', icon: Users },
    { label: 'Attendance', path: '/teacher/attendance', icon: CalendarCheck },
    { label: 'Marks', path: '/teacher/marks', icon: Award },
    { label: 'Leaves', path: '/teacher/leave-requests', icon: CheckSquare, badge: pendingLeaves > 0 ? pendingLeaves : undefined }
  ];

  const items = role === 'teacher' ? teacherItems : parentItems;

  return (
    <nav
      aria-label="Mobile Bottom Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-lg px-2 py-1 safe-area-pb"
    >
      <div className="flex items-center justify-around">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/' || item.path === '/teacher'}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center py-1 px-2.5 rounded-lg text-[10px] font-semibold transition-colors relative ${
                  isActive
                    ? 'text-blue-700'
                    : 'text-slate-500 hover:text-slate-900'
                }`
              }
            >
              <div className="relative">
                <Icon className="w-5 h-5 mb-0.5" />
                {item.badge !== undefined && (
                  <span className="absolute -top-1 -right-1.5 w-3.5 h-3.5 rounded-full bg-rose-600 text-white text-[9px] font-bold flex items-center justify-center ring-2 ring-white">
                    {item.badge}
                  </span>
                )}
              </div>
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
