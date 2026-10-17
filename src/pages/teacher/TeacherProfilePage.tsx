import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import {
  User,
  GraduationCap,
  Mail,
  Phone,
  BookOpen,
  Building,
  Award,
  ShieldCheck,
  LogOut
} from 'lucide-react';

export const TeacherProfilePage: React.FC = () => {
  const { currentStaff, staffLogout } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentStaff) {
      navigate('/teacher/login');
    }
  }, [currentStaff, navigate]);

  if (!currentStaff) return null;

  const initials = currentStaff.fullName
    .replace('Dr. ', '')
    .replace('Prof. ', '')
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Faculty Profile & Credentials
            </h1>
            <Badge variant="primary">MSEC Academic Staff</Badge>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-md">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              Scope: {currentStaff.assignedClass}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Meenakshi Sundararajan Engineering College (Autonomous) • Fixed Staff Identity
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            staffLogout();
            navigate('/teacher/login');
          }}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-colors self-start sm:self-auto"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>

      <Card
        title={
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-emerald-600" />
            <span>Faculty Information</span>
          </div>
        }
      >
        <div className="space-y-6 text-xs">
          <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xl border border-emerald-300">
              {initials || 'FC'}
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">{currentStaff.fullName}</h2>
              <span className="text-emerald-700 font-semibold">{currentStaff.designation}</span>
              <p className="text-slate-500 mt-0.5">Department of {currentStaff.department}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <span className="text-slate-400 block text-[11px]">Official Username</span>
              <strong className="text-slate-800 text-xs font-mono">{currentStaff.username}</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Assigned Class Scope</span>
              <strong className="text-slate-800 text-xs font-semibold">{currentStaff.assignedClass}</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Official Institutional Email</span>
              <strong className="text-slate-800 text-xs">{currentStaff.email}</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Official Contact Number</span>
              <strong className="text-slate-800 text-xs">{currentStaff.phoneNumber}</strong>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
            <p className="font-semibold mb-1">Immutable Principal/HOD Issued Credentials</p>
            <p className="text-[11px] text-amber-800">
              Staff credentials and class permissions are permanently governed by institutional administrative policy. Passwords cannot be modified in-app.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};
