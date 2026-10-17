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
  Shield,
  BookOpen,
  LogOut,
  Calendar,
  AlertCircle,
  UserPlus
} from 'lucide-react';

interface NavbarProps {
  onToggleSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
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
    currentTeacher,
    setIsDemoGuideOpen
  } = useApp();

  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showStudentMenu, setShowStudentMenu] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const roleRef = useRef<HTMLDivElement>(null);
  const studentRef = useRef<HTMLDivElement>(null);

  const unreadNotifications = notifications.filter((n) => !n.readStatus);

  // Close dropdowns on outside click
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
    if (newRole === 'parent') navigate('/');
    else if (newRole === 'teacher') navigate('/teacher');
    else if (newRole === 'admin') navigate('/admin');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Left: Mobile hamburger & College Brand */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
              aria-label="Toggle navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div
              onClick={() => {
                if (role === 'parent') navigate('/');
                else if (role === 'teacher') navigate('/teacher');
                else navigate('/admin');
              }}
              className="flex items-center gap-3 cursor-pointer group select-none"
            >
              {/* College Crest Icon */}
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-900 via-blue-800 to-slate-900 flex items-center justify-center text-white shadow-sm ring-1 ring-blue-950/20 group-hover:scale-105 transition-transform">
                <GraduationCap className="w-5 h-5 text-amber-300" />
              </div>
              <div className="leading-tight">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-sm tracking-tight">
                    MSEC <span className="text-blue-700">Lumina</span>
                  </span>
                  <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                    Prototype
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium hidden md:block">
                  Meenakshi Sundararajan Engineering College • Parent Connect
                </p>
              </div>
            </div>
          </div>

          {/* Center/Right Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Multi-Student Switcher (Only visible in Parent role) */}
            {role === 'parent' && (
              <div className="relative" ref={studentRef}>
                <button
                  type="button"
                  onClick={() => setShowStudentMenu(!showStudentMenu)}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-medium text-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600"
                  aria-expanded={showStudentMenu}
                >
                  <img
                    src={currentStudent.profileImage}
                    alt={currentStudent.fullName}
                    className="w-5 h-5 rounded-full object-cover ring-1 ring-slate-300"
                  />
                  <div className="text-left hidden sm:block">
                    <span className="font-semibold block truncate max-w-[110px]">{currentStudent.fullName}</span>
                    <span className="text-[10px] text-slate-500 block leading-none">{currentStudent.className}</span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                </button>

                {showStudentMenu && (
                  <div className="absolute left-0 sm:right-0 sm:left-auto mt-2 w-64 rounded-xl bg-white shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-3 py-1.5 border-b border-slate-100 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Select Linked Student
                    </div>
                    {students.slice(0, 2).map((s) => (
                      <button
                        key={s.studentId}
                        type="button"
                        onClick={() => {
                          setSelectedStudentId(s.studentId);
                          setShowStudentMenu(false);
                        }}
                        className={`w-full px-3 py-2 flex items-center justify-between text-left text-xs transition-colors ${
                          s.studentId === selectedStudentId ? 'bg-blue-50 text-blue-900 font-semibold' : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <img
                            src={s.profileImage}
                            alt={s.fullName}
                            className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200"
                          />
                          <div>
                            <p className="font-medium">{s.fullName}</p>
                            <p className="text-[11px] text-slate-500">
                              {s.registerNumber} • {s.departmentCode} Sem {s.semester}
                            </p>
                          </div>
                        </div>
                        {s.studentId === selectedStudentId && <Check className="w-4 h-4 text-blue-600 shrink-0" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Student Self-Service Onboarding Portal Button */}
            <button
              type="button"
              onClick={() => navigate('/onboard')}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors border border-slate-200 shadow-2xs"
              title="Student Self-Service Profile Update & Onboarding"
            >
              <UserPlus className="w-3.5 h-3.5 text-blue-600" />
              <span className="hidden md:inline">Student Onboard</span>
            </button>

            {/* Faculty Presentation Demo Guide button */}
            <button
              type="button"
              onClick={() => setIsDemoGuideOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-800 hover:to-indigo-800 text-white shadow-xs transition-all hover:shadow focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-1"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span className="hidden sm:inline">Faculty Demo Guide</span>
              <span className="sm:hidden font-bold">Demo</span>
            </button>

            {/* Notification Center Dropdown */}
            <div className="relative" ref={notifRef}>
              <button
                type="button"
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600"
                aria-label={`Notifications (${unreadNotifications.length} unread)`}
              >
                <Bell className="w-5 h-5" />
                {unreadNotifications.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white animate-in zoom-in">
                    {unreadNotifications.length}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white shadow-2xl border border-slate-200 py-2 z-50">
                  <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Notifications</h4>
                      <p className="text-[11px] text-slate-500">
                        {unreadNotifications.length} unread student alerts
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
                            <div className="mt-0.5">
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
                                <span className={`text-xs font-semibold ${!n.readStatus ? 'text-slate-900' : 'text-slate-700'}`}>
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
                      className="text-xs font-semibold text-blue-700 hover:text-blue-800 transition-colors"
                    >
                      View All Notifications →
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Role Switcher Menu */}
            <div className="relative" ref={roleRef}>
              <button
                type="button"
                onClick={() => setShowRoleMenu(!showRoleMenu)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600"
                aria-expanded={showRoleMenu}
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    role === 'parent'
                      ? 'bg-blue-600'
                      : role === 'teacher'
                      ? 'bg-emerald-600'
                      : 'bg-purple-600'
                  }`}
                />
                <span className="capitalize">{role} Portal</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showRoleMenu && (
                <div className="absolute right-0 mt-2 w-64 rounded-xl bg-white shadow-xl border border-slate-200 py-1.5 z-50">
                  <div className="px-3 py-1.5 border-b border-slate-100">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Switch Role for Demonstration
                    </span>
                  </div>

                  {/* Parent Option */}
                  <button
                    type="button"
                    onClick={() => handleRoleChange('parent')}
                    className={`w-full px-3 py-2 text-left flex items-start gap-2.5 transition-colors ${
                      role === 'parent' ? 'bg-blue-50 text-blue-900 font-semibold' : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <UserCheck className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-medium">Parent: {currentParent.fullName}</p>
                      <p className="text-[11px] text-slate-500">View child report cards, attendance & submit leaves</p>
                    </div>
                  </button>

                  {/* Teacher Option */}
                  <button
                    type="button"
                    onClick={() => handleRoleChange('teacher')}
                    className={`w-full px-3 py-2 text-left flex items-start gap-2.5 transition-colors ${
                      role === 'teacher' ? 'bg-emerald-50 text-emerald-900 font-semibold' : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <BookOpen className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-medium">Teacher: {currentTeacher.fullName}</p>
                      <p className="text-[11px] text-slate-500">Record attendance, enter marks, approve leaves</p>
                    </div>
                  </button>

                  {/* Admin Option */}
                  <button
                    type="button"
                    onClick={() => handleRoleChange('admin')}
                    className={`w-full px-3 py-2 text-left flex items-start gap-2.5 transition-colors ${
                      role === 'admin' ? 'bg-purple-50 text-purple-900 font-semibold' : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <Shield className="w-4 h-4 text-purple-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-medium">Admin: Dr. R. Ramanathan</p>
                      <p className="text-[11px] text-slate-500">System metrics, examinations & announcements</p>
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
