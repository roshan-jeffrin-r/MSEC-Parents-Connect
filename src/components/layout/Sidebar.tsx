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
  Users,
  Award,
  CheckSquare,
  HelpCircle,
  X,
  FileSpreadsheet,
  LogOut,
  KeyRound,
  Smartphone,
  ChevronLeft,
  ChevronRight,
  Shield,
  GraduationCap
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

interface NavItem {
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
  category?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  isCollapsed,
  onToggleCollapse
}) => {
  const {
    role,
    currentStudent,
    currentStaff,
    staffLogout,
    notifications,
    leaveRequests,
    setIsDemoGuideOpen,
    setIsParentLoginModalOpen
  } = useApp();
  const navigate = useNavigate();

  const unreadCount = notifications.filter((n) => !n.readStatus).length;
  const pendingLeavesCount = leaveRequests.filter((l) => l.status === 'Pending').length;

  const parentNavItems: NavItem[] = [
    { label: 'Dashboard', path: '/', icon: LayoutDashboard, category: 'ACADEMICS' },
    { label: 'Report Cards', path: '/report-cards', icon: FileText, category: 'ACADEMICS' },
    { label: 'Attendance', path: '/attendance', icon: CalendarCheck, category: 'ACADEMICS' },
    {
      label: 'Leave Requests',
      path: '/leave-requests',
      icon: Send,
      badge: pendingLeavesCount > 0 ? pendingLeavesCount : undefined,
      category: 'COMMUNICATION'
    },
    {
      label: 'Notifications',
      path: '/notifications',
      icon: Bell,
      badge: unreadCount > 0 ? unreadCount : undefined,
      category: 'COMMUNICATION'
    },
    { label: 'Announcements', path: '/announcements', icon: Megaphone, category: 'COMMUNICATION' },
    { label: 'Student Profile', path: '/profile', icon: User, category: 'PORTAL' },
    { label: 'Settings', path: '/settings', icon: Settings, category: 'PORTAL' }
  ];

  const teacherNavItems: NavItem[] = [
    { label: 'Dashboard', path: '/teacher', icon: LayoutDashboard, category: 'FACULTY SUITE' },
    { label: 'My Classes', path: '/teacher/classes', icon: Users, category: 'FACULTY SUITE' },
    { label: 'Record Attendance', path: '/teacher/attendance', icon: CalendarCheck, category: 'FACULTY SUITE' },
    { label: 'Marks Entry', path: '/teacher/marks', icon: Award, category: 'FACULTY SUITE' },
    {
      label: 'Review Leaves',
      path: '/teacher/leave-requests',
      icon: CheckSquare,
      badge: pendingLeavesCount > 0 ? pendingLeavesCount : undefined,
      category: 'REVIEWS'
    },
    { label: 'Google Form Sync', path: '/onboard/sync', icon: FileSpreadsheet, category: 'ONBOARDING' },
    { label: 'Teacher Profile', path: '/teacher/profile', icon: User, category: 'ONBOARDING' }
  ];

  const adminNavItems: NavItem[] = [
    { label: 'Dean Overview', path: '/admin', icon: Shield, category: 'ADMINISTRATION' },
    { label: 'Student Directory', path: '/admin/students', icon: Users, category: 'ACADEMICS' },
    { label: 'Examinations', path: '/admin/examinations', icon: Award, category: 'ACADEMICS' },
    { label: 'Announcements', path: '/admin/announcements', icon: Megaphone, category: 'COMMUNICATION' },
    { label: 'Admin Settings', path: '/admin/settings', icon: Settings, category: 'PORTAL' }
  ];

  const navItems = role === 'teacher' ? teacherNavItems : role === 'admin' ? adminNavItems : parentNavItems;

  // Group items by category
  const categories = Array.from(new Set(navItems.map((item) => item.category || 'GENERAL')));

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 bg-slate-900 text-slate-300 flex flex-col transition-all duration-200 ease-in-out lg:static lg:z-30 select-none ${
          isCollapsed ? 'lg:w-16' : 'lg:w-60'
        } ${isOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Mobile Header */}
        <div className="flex items-center justify-between p-3.5 border-b border-slate-800 lg:hidden">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <GraduationCap className="w-4 h-4 text-amber-300" />
            </div>
            <span className="text-sm font-bold text-white tracking-tight">MSEC Parent Connect</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Desktop Collapse Toggle Bar */}
        <div className="hidden lg:flex items-center justify-between px-3 py-2.5 border-b border-slate-800/80">
          {!isCollapsed && (
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {role === 'teacher' ? 'Faculty Portal' : role === 'admin' ? 'Admin Portal' : 'Parent Portal'}
            </span>
          )}
          <button
            type="button"
            onClick={onToggleCollapse}
            className={`p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ${
              isCollapsed ? 'mx-auto' : ''
            }`}
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation links grouped by category */}
        <nav className="flex-1 px-2.5 py-3 space-y-3 overflow-y-auto overflow-x-hidden">
          {categories.map((cat) => {
            const catItems = navItems.filter((i) => (i.category || 'GENERAL') === cat);
            return (
              <div key={cat} className="space-y-1">
                {!isCollapsed && (
                  <div className="px-2 pt-1 pb-1 text-[9px] font-bold uppercase tracking-wider text-slate-500">
                    {cat}
                  </div>
                )}
                {catItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      end={item.path === '/' || item.path === '/teacher' || item.path === '/admin'}
                      onClick={onClose}
                      title={isCollapsed ? item.label : undefined}
                      className={({ isActive }) =>
                        `flex items-center ${
                          isCollapsed ? 'justify-center px-2 py-2' : 'justify-between px-2.5 py-2'
                        } rounded-lg text-xs font-medium transition-all group relative ${
                          isActive
                            ? 'bg-blue-600 text-white font-semibold shadow-xs'
                            : 'text-slate-300 hover:bg-slate-800/90 hover:text-white'
                        }`
                      }
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Icon className="w-4 h-4 shrink-0 transition-transform group-hover:scale-105" />
                        {!isCollapsed && <span className="truncate">{item.label}</span>}
                      </div>

                      {/* Badge */}
                      {item.badge !== undefined && (
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full shrink-0 ${
                            isCollapsed
                              ? 'absolute -top-1 -right-1 ring-2 ring-slate-900 bg-rose-500 text-white'
                              : item.label === 'Notifications'
                              ? 'bg-rose-500 text-white'
                              : 'bg-amber-400 text-slate-950'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            );
          })}
        </nav>

        {/* Bottom Student / Faculty / Admin Info Card */}
        <div className="p-3 border-t border-slate-800/90 bg-slate-950/70">
          {role === 'parent' ? (
            <div className="space-y-2">
              <div
                onClick={() => {
                  navigate('/profile');
                  onClose();
                }}
                className={`flex items-center ${
                  isCollapsed ? 'justify-center p-1' : 'gap-2.5 p-1.5'
                } rounded-lg hover:bg-slate-800/80 cursor-pointer transition-colors`}
                title={isCollapsed ? `${currentStudent.fullName} (${currentStudent.className})` : undefined}
              >
                <img
                  src={currentStudent.profileImage}
                  alt={currentStudent.fullName}
                  className="w-7 h-7 rounded-full object-cover ring-1 ring-blue-500 shrink-0"
                />
                {!isCollapsed && (
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-white truncate leading-tight">{currentStudent.fullName}</p>
                    <p className="text-[10px] text-slate-400 truncate leading-tight font-mono">
                      {currentStudent.registerNumber} • {currentStudent.className}
                    </p>
                  </div>
                )}
              </div>

              {!isCollapsed && (
                <button
                  type="button"
                  onClick={() => {
                    setIsParentLoginModalOpen(true);
                    onClose();
                  }}
                  className="w-full py-1 text-center text-[10px] text-blue-400 hover:text-blue-300 flex items-center justify-center gap-1 font-semibold transition-colors"
                >
                  <Smartphone className="w-3 h-3" />
                  <span>Switch Parent (Auto-Login)</span>
                </button>
              )}
            </div>
          ) : role === 'teacher' && currentStaff ? (
            <div className={`${isCollapsed ? 'text-center p-1' : 'p-1.5 space-y-1'}`}>
              {!isCollapsed ? (
                <>
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-white truncate">{currentStaff.fullName}</p>
                    <button
                      type="button"
                      onClick={() => {
                        staffLogout();
                        navigate('/teacher/login');
                        onClose();
                      }}
                      className="text-slate-400 hover:text-rose-400 transition-colors p-0.5"
                      title="Sign Out"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-semibold">
                    <span>Scope:</span>
                    <span className="bg-emerald-950 px-1.5 py-0.2 rounded border border-emerald-800 font-mono">
                      {currentStaff.assignedClass}
                    </span>
                  </div>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    staffLogout();
                    navigate('/teacher/login');
                  }}
                  className="text-slate-400 hover:text-rose-400 transition-colors p-1"
                  title="Sign out of staff session"
                >
                  <LogOut className="w-4 h-4 mx-auto" />
                </button>
              )}
            </div>
          ) : role === 'teacher' ? (
            <div className="p-1">
              <button
                type="button"
                onClick={() => {
                  navigate('/teacher/login');
                  onClose();
                }}
                className={`w-full py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5 ${
                  isCollapsed ? 'px-1' : 'px-2'
                }`}
                title="Staff Sign In"
              >
                <KeyRound className="w-3.5 h-3.5" />
                {!isCollapsed && <span>Staff Sign In</span>}
              </button>
            </div>
          ) : (
            <div className={`${isCollapsed ? 'text-center p-1' : 'p-1.5'}`}>
              {!isCollapsed ? (
                <div className="flex items-center justify-between text-xs text-purple-300 font-semibold">
                  <span>Dean / Admin</span>
                  <Shield className="w-3.5 h-3.5" />
                </div>
              ) : (
                <Shield className="w-4 h-4 text-purple-400 mx-auto" />
              )}
            </div>
          )}

          {/* Quick Demo Script Trigger in footer */}
          <button
            type="button"
            onClick={() => {
              setIsDemoGuideOpen(true);
              onClose();
            }}
            className={`w-full mt-2 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-[10px] font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors ${
              isCollapsed ? 'p-1.5' : ''
            }`}
            title="Demonstration Checklist"
          >
            <HelpCircle className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            {!isCollapsed && <span>Demo Script</span>}
          </button>
        </div>
      </aside>
    </>
  );
};
