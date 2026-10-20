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
  LogOut,
  CheckCircle2,
  Lock
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
    <div className="space-y-4 max-w-3xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Faculty Profile &amp; Credentials
            </h1>
            <Badge variant="primary">MSEC Academic Staff</Badge>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/80 px-2 py-0.5 rounded-md">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              Scope: {currentStaff.assignedClass}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Meenakshi Sundararajan Engineering College (Autonomous) • Fixed Staff Identity
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            staffLogout();
            navigate('/teacher/login');
          }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-colors self-start sm:self-auto"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>

      <Card
        density="compact"
        accent="blue"
        title={
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-emerald-600" />
            <span>Faculty Information</span>
          </div>
        }
      >
        <div className="space-y-4 text-xs">
          <div className="flex items-center gap-3.5 pb-3 border-b border-slate-100">
            <div className="w-14 h-14 rounded-xl bg-blue-900 text-white flex items-center justify-center font-bold text-lg shadow-2xs shrink-0 ring-2 ring-blue-700/20">
              {initials || 'FC'}
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900">{currentStaff.fullName}</h2>
              <span className="text-blue-700 font-bold block">{currentStaff.designation}</span>
              <p className="text-slate-500 text-[11px]">Department of {currentStaff.department}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80">
              <span className="text-slate-400 block text-[10px] font-bold uppercase tracking-wider">Official Username</span>
              <strong className="text-slate-800 text-xs font-mono">{currentStaff.username}</strong>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80">
              <span className="text-slate-400 block text-[10px] font-bold uppercase tracking-wider">Assigned Class Scope</span>
              <strong className="text-blue-900 text-xs font-bold font-mono">{currentStaff.assignedClass}</strong>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80">
              <span className="text-slate-400 block text-[10px] font-bold uppercase tracking-wider">Official Institutional Email</span>
              <strong className="text-slate-800 text-xs font-mono">{currentStaff.email}</strong>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80">
              <span className="text-slate-400 block text-[10px] font-bold uppercase tracking-wider">Official Contact Number</span>
              <strong className="text-slate-800 text-xs font-mono">{currentStaff.phoneNumber}</strong>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-900 text-xs space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-amber-950">
              <Lock className="w-3.5 h-3.5 text-amber-700" />
              <span>Immutable Principal/HOD Issued Credentials</span>
            </div>
            <p className="text-[11px] text-amber-800 leading-relaxed">
              Faculty credentials and authorized class scopes are permanently provisioned by college administration. Account passwords and class scopes cannot be changed inside the portal.
            </p>
          </div>

          <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-[11px] flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Active authenticated session cookie: <code>msec_staff_session</code></span>
          </div>
        </div>
      </Card>
    </div>
  );
};
