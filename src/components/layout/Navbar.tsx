import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import {
  Bell,
  Sparkles,
  ChevronDown,
  UserCheck,
  GraduationCap,
  Menu,
  Check,
  BookOpen,
  LogOut,
  Calendar,
  AlertCircle,
  FileSpreadsheet,
  KeyRound,
  Smartphone,
  ShieldCheck,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

interface NavbarProps {
  onToggleSidebar: () => void;
  isSidebarCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onToggleSidebar,
  isSidebarCollapsed,
  onToggleCollapse
}) => {
  const {
    role,
    setRole,
    currentStudent,
    students,
    selectedStudentId,
    setSelectedStudentId,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    currentParent,
    currentStaff,
    staffLogout,
    setIsDemoGuideOpen,
    setIsParentLoginModalOpen
  } = useApp();

  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showStudentMenu, setShowStudentMenu] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const roleRef = useRef<HTMLDivElement>(null);
  const studentRef = useRef<HTMLDivElement>(null);

  const unreadNotifications = notifications.filter((n) => !n.readStatus);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (roleRef.current && !roleRef.current.contains(e.target as Node)) {
        setShowRoleMenu(false);
      }
      if (studentRef.current && !studentRef.current.contains(e.target as Node)) {
        setShowStudentMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    setShowRoleMenu(false);
    if (newRole === 'parent') {
      navigate('/');
    } else if (newRole === 'teacher') {
      if (currentStaff) {
        navigate('/teacher');
      } else {
        navigate('/teacher/login');
      }
    } else if (newRole === 'admin') {
      navigate('/admin');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs">
      <div className="px-3 sm:px-5 lg:px-6">
        <div className="flex items-center justify-between h-14 gap-2.5">
          {/* Left: Mobile hamburger & College Branding */}
          <div className="flex items-center gap-2.5">
            {/* Mobile drawer toggle */}
            <button
              type="button"
              onClick={onToggleSidebar}
              className="lg:hidden p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors"
              aria-label="Toggle navigation drawer"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Brand Logo & College Title */}
            <div
              onClick={() => {
                if (role === 'parent') navigate('/');
                else if (role === 'teacher') navigate(currentStaff ? '/teacher' : '/teacher/login');
                else navigate('/admin');
              }}
              className="flex items-center gap-2.5 cursor-pointer group select-none"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-900 via-blue-800 to-slate-900 flex items-center justify-center text-white shadow-xs ring-1 ring-blue-950/20 group-hover:scale-105 transition-transform shrink-0">
                <GraduationCap className="w-4 h-4 text-amber-300" />
              </div>
              <div className="leading-tight">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-slate-900 text-sm tracking-tight">
                    MSEC <span className="text-blue-700 font-extrabold">Parent Connect</span>
                  </span>
                  <span className="hidden sm:inline-block text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded bg-blue-50 text-blue-700 border border-blue-200">
                    Autonomous
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 font-medium hidden md:block">
                  Meenakshi Sundararajan Engineering College • Kodambakkam, Chennai
                </p>
              </div>
            </div>
          </div>

          {/* Right Controls: Sibling Switcher, Auto-Login, Staff Badge, Demo Guide, Notifications, Role Switcher */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Parent Role: Sibling Switcher Dropdown */}
            {role === 'parent' && (
              <div className="flex items-center gap-2">
                <div className="relative" ref={studentRef}>
                  <button
                    type="button"
                    onClick={() => setShowStudentMenu(!showStudentMenu)}
                    className="flex items-center gap-2 px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600"
                    aria-expanded={showStudentMenu}
                    title="Switch linked sibling or child account"
                  >
                    <img
                      src={currentStudent.profileImage}
                      alt={currentStudent.fullName}
                      className="w-5 h-5 rounded-full object-cover ring-1 ring-slate-300 shrink-0"
                    />
                    <div className="text-left hidden sm:block max-w-[120px]">
                      <span className="truncate block text-xs font-bold leading-tight">{currentStudent.fullName}</span>
                      <span className="text-[9px] text-slate-500 block leading-tight">{currentStudent.className}</span>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  </button>

                  {showStudentMenu && (
                    <div className="absolute left-0 sm:right-0 sm:left-auto mt-1.5 w-64 rounded-xl bg-white shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                      <div className="px-3 py-1.5 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                        <span>Linked Sibling Records</span>
                        <span className="text-[10px] text-blue-600 font-semibold">{currentParent?.fullName}</span>
                      </div>
                      {students
                        .filter(
                          (s) =>
                            currentParent?.linkedStudentIds?.includes(s.studentId) ||
                            s.studentId === 'STU-001' ||
                            s.studentId === 'STU-002'
                        )
                        .slice(0, 4)
                        .map((s) => (
                          <button
                            key={s.studentId}
                            type="button"
                            onClick={() => {
                              setSelectedStudentId(s.studentId);
                              setShowStudentMenu(false);
                            }}
                            className={`w-full px-3 py-2 flex items-center justify-between text-left text-xs transition-colors ${
                              s.studentId === selectedStudentId
                                ? 'bg-blue-50 text-blue-900 font-bold'
                                : 'hover:bg-slate-50 text-slate-700'
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <img
                                src={s.profileImage}
                                alt={s.fullName}
                                className="w-6 h-6 rounded-full object-cover ring-1 ring-slate-200"
                              />
                              <div>
                                <p className="font-semibold">{s.fullName}</p>
                                <p className="text-[10px] text-slate-500 font-mono">
                                  {s.registerNumber} • {s.className}
                                </p>
                              </div>
                            </div>
                            {s.studentId === selectedStudentId && (
                              <Check className="w-4 h-4 text-blue-600 shrink-0" />
                            )}
                          </button>
                        ))}

                      <div className="border-t border-slate-100 p-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setShowStudentMenu(false);
                            setIsParentLoginModalOpen(true);
                          }}
                          className="w-full py-1.5 text-center text-[11px] font-semibold text-blue-700 hover:bg-blue-50 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                        >
                          <Smartphone className="w-3.5 h-3.5" />
                          <span>Switch Parent Account (Phone / Email)</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Passwordless Auto-Login Modal Button */}
                <button
                  type="button"
                  onClick={() => setIsParentLoginModalOpen(true)}
                  className="hidden xl:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors shadow-2xs"
                  title="Passwordless Parent Auto-Login via Mobile Number or Register No"
                >
                  <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                  <span>Parent Auto-Login</span>
                </button>
              </div>
            )}

            {/* Teacher Role: Active Staff & Scope Indicator */}
            {role === 'teacher' && currentStaff && (
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-semibold truncate max-w-[120px]">{currentStaff.fullName}</span>
                  <span className="font-mono font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded text-[10px]">
                    {currentStaff.assignedClass}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    staffLogout();
                    navigate('/teacher/login');
                  }}
                  className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-slate-100 rounded-lg transition-colors"
                  title="Sign out of staff session"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Google Form Sorter Button */}
            <button
              type="button"
              onClick={() => navigate('/onboard/sync')}
              className="hidden 2xl:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors shadow-2xs"
              title="Import Google Form CSV or JSON"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              <span>Google Form Sync</span>
            </button>

            {/* Faculty Demo Script Button */}
            <button
              type="button"
              onClick={() => setIsDemoGuideOpen(true)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-800 hover:to-indigo-800 text-white shadow-xs transition-all focus:outline-none focus:ring-2 focus:ring-blue-600"
              title="Interactive Faculty Demonstration Script"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span className="hidden sm:inline">Faculty Demo Guide</span>
              <span className="sm:hidden">Demo</span>
            </button>

            {/* Notifications Dropdown */}
            <div className="relative" ref={notifRef}>
              <button
                type="button"
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600"
                aria-label={`Notifications (${unreadNotifications.length} unread)`}
              >
                <Bell className="w-4 h-4" />
                {unreadNotifications.length > 0 && (
                  <span className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-rose-600 text-white text-[9px] font-bold flex items-center justify-center ring-2 ring-white">
                    {unreadNotifications.length}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-1.5 w-80 sm:w-96 rounded-2xl bg-white shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Notifications & Alerts</h4>
                      <p className="text-[10px] text-slate-500">
                        {unreadNotifications.length} unread student updates
                      </p>
                    </div>
                    {unreadNotifications.length > 0 && (
                      <button
                        type="button"
                        onClick={markAllNotificationsAsRead}
                        className="text-[11px] text-blue-700 hover:text-blue-800 font-semibold transition-colors"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-50">
                    {notifications.length === 0 ? (
                      <div className="py-6 text-center text-xs text-slate-400">No notifications</div>
                    ) : (
                      notifications.slice(0, 5).map((n) => (
                        <div
                          key={n.notificationId}
                          onClick={() => {
                            markNotificationAsRead(n.notificationId);
                            if (n.actionUrl) {
                              navigate(n.actionUrl);
                              setShowNotifications(false);
                            }
                          }}
                          className={`p-3 text-left transition-colors cursor-pointer ${
                            !n.readStatus ? 'bg-blue-50/50 hover:bg-blue-50' : 'hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-start gap-2.5">
                            <div className="mt-0.5 shrink-0">
                              {n.category === 'attendance' ? (
                                <AlertCircle className="w-4 h-4 text-amber-600" />
                              ) : n.category === 'academic' ? (
                                <BookOpen className="w-4 h-4 text-blue-600" />
                              ) : (
                                <Calendar className="w-4 h-4 text-emerald-600" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-1">
                                <span
                                  className={`text-xs font-semibold truncate ${
                                    !n.readStatus ? 'text-slate-900' : 'text-slate-700'
                                  }`}
                                >
                                  {n.title}
                                </span>
                                {!n.readStatus && (
                                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                                )}
                              </div>
                              <p className="text-[11px] text-slate-600 line-clamp-2 mt-0.5">{n.message}</p>
                              <span className="text-[10px] text-slate-400 mt-1 block">{n.createdAt}</span>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="px-4 py-2 border-t border-slate-100 text-center">
                    <button
                      type="button"
                      onClick={() => {
                        navigate('/notifications');
                        setShowNotifications(false);
                      }}
                      className="text-xs font-bold text-blue-700 hover:text-blue-800 transition-colors inline-flex items-center gap-1"
                    >
                      <span>View All Notifications</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Portal Switcher Dropdown */}
            <div className="relative" ref={roleRef}>
              <button
                type="button"
                onClick={() => setShowRoleMenu(!showRoleMenu)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-2xs"
                aria-expanded={showRoleMenu}
              >
                <div
                  className={`w-2 h-2 rounded-full shrink-0 ${
                    role === 'parent' ? 'bg-blue-600' : role === 'teacher' ? 'bg-emerald-600' : 'bg-purple-600'
                  }`}
                />
                <span className="hidden sm:inline">
                  {role === 'teacher' ? 'Faculty Portal' : role === 'admin' ? 'Admin Center' : 'Parent Portal'}
                </span>
                <span className="sm:hidden capitalize">{role}</span>
                <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
              </button>

              {showRoleMenu && (
                <div className="absolute right-0 mt-1.5 w-60 rounded-xl bg-white shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3 py-1.5 border-b border-slate-100">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Switch Portal View
                    </span>
                  </div>

                  {/* Parent Option */}
                  <button
                    type="button"
                    onClick={() => handleRoleChange('parent')}
                    className={`w-full px-3 py-2 text-left flex items-start gap-2.5 transition-colors ${
                      role === 'parent' ? 'bg-blue-50 text-blue-900 font-bold' : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <UserCheck className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-bold">Parent Portal</p>
                      <p className="text-[10px] text-slate-500">
                        {currentParent ? currentParent.fullName : 'Rajesh Kumar'} (Auto-Login Active)
                      </p>
                    </div>
                  </button>

                  {/* Teacher Option */}
                  <button
                    type="button"
                    onClick={() => handleRoleChange('teacher')}
                    className={`w-full px-3 py-2 text-left flex items-start gap-2.5 transition-colors ${
                      role === 'teacher' ? 'bg-emerald-50 text-emerald-900 font-bold' : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <KeyRound className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-bold">Faculty Portal</p>
                      <p className="text-[10px] text-slate-500">
                        {currentStaff ? `${currentStaff.fullName} (${currentStaff.assignedClass})` : 'Protected Staff Login Required'}
                      </p>
                    </div>
                  </button>

                  {/* Admin Option */}
                  <button
                    type="button"
                    onClick={() => handleRoleChange('admin')}
                    className={`w-full px-3 py-2 text-left flex items-start gap-2.5 transition-colors ${
                      role === 'admin' ? 'bg-purple-50 text-purple-900 font-bold' : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4 text-purple-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-bold">Admin Portal</p>
                      <p className="text-[10px] text-slate-500">Examination Controller & Dean Overview</p>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
