import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  FileText,
  CalendarCheck,
  Send,
  Bell,
  Megaphone,
  User,
  Settings,
  BookOpen,
  Users,
  Award,
  CheckSquare,
  Shield,
  HelpCircle,
  UserPlus,
  X
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const {
    role,
    currentStudent,
    currentParent,
    currentTeacher,
    notifications,
    leaveRequests,
    setIsDemoGuideOpen
  } = useApp();
  const navigate = useNavigate();

  const unreadCount = notifications.filter((n) => !n.readStatus).length;
  const pendingLeavesCount = leaveRequests.filter((l) => l.status === 'Pending').length;

  const parentNavItems: NavItem[] = [
    { label: 'Dashboard', path: '/', icon: LayoutDashboard },
    { label: 'Report Cards', path: '/report-cards', icon: FileText },
    { label: 'Attendance', path: '/attendance', icon: CalendarCheck },
    {
      label: 'Leave Requests',
      path: '/leave-requests',
      icon: Send,
      badge: pendingLeavesCount > 0 ? pendingLeavesCount : undefined
    },
    {
      label: 'Notifications',
      path: '/notifications',
      icon: Bell,
      badge: unreadCount > 0 ? unreadCount : undefined
    },
    { label: 'Announcements', path: '/announcements', icon: Megaphone },
    { label: 'Student Profile', path: '/profile', icon: User },
    { label: 'Student Onboarding', path: '/onboard', icon: UserPlus },
    { label: 'Settings', path: '/settings', icon: Settings }
  ];

  const teacherNavItems: NavItem[] = [
    { label: 'Dashboard', path: '/teacher', icon: LayoutDashboard },
    { label: 'My Classes', path: '/teacher/classes', icon: Users },
    { label: 'Record Attendance', path: '/teacher/attendance', icon: CalendarCheck },
    { label: 'Marks Entry', path: '/teacher/marks', icon: Award },
    {
      label: 'Review Leaves',
      path: '/teacher/leave-requests',
      icon: CheckSquare,
      badge: pendingLeavesCount > 0 ? pendingLeavesCount : undefined
    },
    { label: 'Teacher Profile', path: '/teacher/profile', icon: User }
  ];

  const adminNavItems: NavItem[] = [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { label: 'Students Directory', path: '/admin/students', icon: Users },
    { label: 'Examinations', path: '/admin/examinations', icon: Award },
    { label: 'Announcements', path: '/admin/announcements', icon: Megaphone },
    { label: 'Settings', path: '/admin/settings', icon: Settings }
  ];

  const navItems = role === 'parent' ? parentNavItems : role === 'teacher' ? teacherNavItems : adminNavItems;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-slate-900 text-slate-300 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:static lg:z-30`}
      >
        {/* Mobile Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 lg:hidden">
          <span className="text-sm font-bold text-white tracking-tight">MSEC Lumina</span>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section title */}
        <div className="px-5 py-4 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${
                role === 'parent' ? 'bg-blue-400' : role === 'teacher' ? 'bg-emerald-400' : 'bg-purple-400'
              }`}
            />
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              {role} Navigation
            </span>
          </div>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/' || item.path === '/teacher' || item.path === '/admin'}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all group ${
                    isActive
                      ? 'bg-blue-600 text-white font-semibold shadow-xs'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                      item.label === 'Notifications'
                        ? 'bg-rose-500 text-white'
                        : 'bg-amber-500 text-slate-900'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom Student / User Info Card */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60">
          {role === 'parent' ? (
            <div
              onClick={() => {
                navigate('/profile');
                onClose();
              }}
              className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-800/80 cursor-pointer transition-colors"
            >
              <img
                src={currentStudent.profileImage}
                alt={currentStudent.fullName}
                className="w-9 h-9 rounded-full object-cover ring-2 ring-blue-500/50"
              />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-white truncate">{currentStudent.fullName}</p>
                <p className="text-[11px] text-slate-400 truncate">
                  {currentStudent.registerNumber} • Sem {currentStudent.semester}
                </p>
              </div>
            </div>
          ) : role === 'teacher' ? (
            <div className="p-2">
              <p className="text-xs font-semibold text-white truncate">{currentTeacher.fullName}</p>
              <p className="text-[11px] text-slate-400 truncate">Dept of {currentTeacher.department}</p>
              <p className="text-[10px] text-emerald-400 mt-1 font-medium">Class Advisor: CSE-B</p>
            </div>
          ) : (
            <div className="p-2">
              <p className="text-xs font-semibold text-white truncate">Dr. R. Ramanathan</p>
              <p className="text-[11px] text-slate-400 truncate">Dean Academics & CoE</p>
              <p className="text-[10px] text-purple-400 mt-1 font-medium">Administrator Access</p>
            </div>
          )}

          {/* Quick Demo Helper Trigger in footer */}
          <button
            type="button"
            onClick={() => {
              setIsDemoGuideOpen(true);
              onClose();
            }}
            className="w-full mt-3 flex items-center justify-center gap-2 py-1.5 px-3 rounded-lg text-[11px] font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5 text-blue-400" />
            <span>Demonstration Checklist</span>
          </button>
        </div>
      </aside>
    </>
  );
};
