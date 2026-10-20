import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const { role } = useApp();
  const pathnames = location.pathname.split('/').filter((x) => x);

  const routeNameMap: Record<string, string> = {
    '': 'Dashboard',
    'report-cards': 'Report Cards',
    attendance: 'Attendance',
    'leave-requests': 'Leave Requests',
    notifications: 'Notifications',
    announcements: 'Announcements',
    profile: 'Student Profile',
    settings: 'Settings',
    teacher: 'Faculty Dashboard',
    classes: 'My Classes',
    marks: 'Marks Entry',
    login: 'Staff Sign In',
    sync: 'Google Form Sync',
    admin: 'Admin Center',
    students: 'Student Directory',
    examinations: 'Examinations'
  };

  if (location.pathname === '/' || location.pathname === '/teacher') {
    return null; // Keep dashboard header clean
  }

  return (
    <nav aria-label="Breadcrumb" className="mb-4 hidden sm:flex items-center gap-1.5 text-xs text-slate-500">
      <Link
        to={role === 'teacher' ? '/teacher' : '/'}
        className="flex items-center gap-1 hover:text-blue-700 transition-colors font-medium text-slate-600"
      >
        <Home className="w-3.5 h-3.5" />
        <span>{role === 'teacher' ? 'Faculty Portal' : 'Parent Portal'}</span>
      </Link>

      {pathnames.map((name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        const displayName = routeNameMap[name] || name.charAt(0).toUpperCase() + name.slice(1);

        return (
          <React.Fragment key={routeTo}>
            <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
            {isLast ? (
              <span className="font-semibold text-slate-900" aria-current="page">
                {displayName}
              </span>
            ) : (
              <Link to={routeTo} className="hover:text-blue-700 transition-colors font-medium">
                {displayName}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
