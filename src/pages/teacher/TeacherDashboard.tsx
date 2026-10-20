import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp, matchesAssignedClass } from '../../context/AppContext';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { EmptyState } from '../../components/common/EmptyState';
import {
  Users,
  CalendarCheck,
  Award,
  CheckSquare,
  Sparkles,
  BookOpen,
  LogOut,
  ShieldCheck,
  ArrowRight,
  Clock,
  CheckCircle2,
  Calendar,
  AlertCircle
} from 'lucide-react';

export const TeacherDashboard: React.FC = () => {
  const { currentStaff, staffLogout, students, leaveRequests, setIsDemoGuideOpen } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentStaff) {
      navigate('/teacher/login');
    }
  }, [currentStaff, navigate]);

  if (!currentStaff) return null;

  // Strict class scoping
  const scopedStudents = students.filter((s) =>
    matchesAssignedClass(s.className, currentStaff.assignedClass)
  );

  const pendingLeaves = leaveRequests.filter(
    (l) => l.status === 'Pending' && matchesAssignedClass(l.className, currentStaff.assignedClass)
  );

  return (
    <div className="space-y-4">
      {/* Executive Staff Session Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 rounded-2xl p-4 sm:p-5 text-white shadow-md border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-semibold border border-emerald-400/30">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Active Faculty Session</span>
            </span>
            <Badge variant="success" size="sm" dot>
              Scope: {currentStaff.assignedClass}
            </Badge>
            <span className="text-[11px] text-slate-400 hidden sm:inline">
              MSEC Autonomous • Dept. of {currentStaff.department}
            </span>
          </div>

          <h1 className="text-lg sm:text-xl font-black tracking-tight text-white flex items-center gap-2">
            <span>Welcome, {currentStaff.fullName}</span>
          </h1>

          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            {currentStaff.designation} • Authorized Class Scope: <strong className="text-white font-mono">{currentStaff.assignedClass}</strong> ({scopedStudents.length} students enrolled).
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
          <button
            type="button"
            onClick={() => setIsDemoGuideOpen(true)}
            className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Demo Guide</span>
          </button>
          <button
            type="button"
            onClick={() => {
              staffLogout();
              navigate('/teacher/login');
            }}
            className="px-3 py-1.5 bg-slate-800/90 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Scoped Students */}
        <div
          onClick={() => navigate('/teacher/classes')}
          className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200/90 shadow-2xs hover:shadow-xs hover:border-emerald-300 cursor-pointer transition-all group border-t-2 border-t-emerald-600"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Scoped Students</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 font-mono">{scopedStudents.length}</span>
            <span className="text-xs text-slate-500 font-semibold">{currentStaff.assignedClass}</span>
          </div>
          <p className="text-[11px] text-emerald-700 font-bold mt-1.5 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
            <span>View Roster</span>
            <ArrowRight className="w-3 h-3" />
          </p>
        </div>

        {/* Daily Muster */}
        <div
          onClick={() => navigate('/teacher/attendance')}
          className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200/90 shadow-2xs hover:shadow-xs hover:border-blue-300 cursor-pointer transition-all group border-t-2 border-t-blue-600"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Daily Roll Call</span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-blue-900 font-mono">Today</span>
            <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200/60">
              Active
            </span>
          </div>
          <p className="text-[11px] text-blue-700 font-bold mt-1.5 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
            <span>Record Muster</span>
            <ArrowRight className="w-3 h-3" />
          </p>
        </div>

        {/* Pending Leaves */}
        <div
          onClick={() => navigate('/teacher/leave-requests')}
          className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200/90 shadow-2xs hover:shadow-xs hover:border-amber-300 cursor-pointer transition-all group border-t-2 border-t-amber-500"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Pending Leaves</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <CheckSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-amber-700 font-mono">{pendingLeaves.length}</span>
            <span className="text-xs text-amber-800 font-medium">Under Review</span>
          </div>
          <p className="text-[11px] text-amber-700 font-bold mt-1.5 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
            <span>Review &amp; Sanction</span>
            <ArrowRight className="w-3 h-3" />
          </p>
        </div>

        {/* Marks Entry & Publishing */}
        <div
          onClick={() => navigate('/teacher/marks')}
          className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200/90 shadow-2xs hover:shadow-xs hover:border-indigo-300 cursor-pointer transition-all group border-t-2 border-t-indigo-600"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Marks &amp; Grades</span>
            <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-indigo-900 font-mono">{currentStaff.assignedClass}</span>
          </div>
          <p className="text-[11px] text-indigo-700 font-bold mt-1.5 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
            <span>Enter Marks</span>
            <ArrowRight className="w-3 h-3" />
          </p>
        </div>
      </div>

      {/* Main Dual-Column Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Pending Leave Requests for Scoped Class (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <Card
            density="compact"
            accent="amber"
            title={
              <div className="flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-amber-600" />
                <span>Pending Leave Applications ({currentStaff.assignedClass})</span>
              </div>
            }
            subtitle={`Applications submitted by registered parents strictly scoped to ${currentStaff.assignedClass}`}
            action={
              <button
                type="button"
                onClick={() => navigate('/teacher/leave-requests')}
                className="text-xs font-bold text-blue-700 hover:text-blue-800 flex items-center gap-1"
              >
                <span>All Requests ({pendingLeaves.length})</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            }
          >
            {pendingLeaves.length === 0 ? (
              <EmptyState
                icon={CheckCircle2}
                title="No Pending Leave Applications"
                description={`All parent leave applications for ${currentStaff.assignedClass} have been reviewed and sanctioned.`}
                compact
              />
            ) : (
              <div className="space-y-2.5">
                {pendingLeaves.map((req) => (
                  <div
                    key={req.requestId}
                    className="p-3 bg-amber-50/50 border border-amber-200/70 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs hover:bg-amber-50 transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <strong className="text-slate-900 text-sm font-bold">{req.studentName}</strong>
                        <Badge variant="warning" size="sm">{req.leaveType}</Badge>
                        <span className="font-mono text-[11px] text-slate-500">{req.requestId}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-600 text-[11px]">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>Dates: <strong>{req.startDate} to {req.endDate}</strong> ({req.totalDays} {req.totalDays === 1 ? 'day' : 'days'})</span>
                      </div>
                      <p className="text-slate-700 italic line-clamp-1 text-xs">
                        "{req.reason}"
                      </p>
                      <span className="text-[10px] text-slate-400 block">
                        Submitted by: {req.submittedBy} on {req.createdAt}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => navigate('/teacher/leave-requests')}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shrink-0 transition-colors shadow-2xs self-start sm:self-center"
                    >
                      Review &amp; Sanction
                    </button>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Quick Action Shortcuts */}
          <Card density="compact" title="Faculty Quick Shortcuts">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => navigate('/teacher/attendance')}
                className="p-3 rounded-lg border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 text-left transition-all group"
              >
                <CalendarCheck className="w-4 h-4 text-blue-600 mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-slate-900 block">Take Roll Call</span>
                <span className="text-[10px] text-slate-500">Morning muster</span>
              </button>

              <button
                type="button"
                onClick={() => navigate('/teacher/marks')}
                className="p-3 rounded-lg border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/50 text-left transition-all group"
              >
                <Award className="w-4 h-4 text-indigo-600 mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-slate-900 block">Enter Marks</span>
                <span className="text-[10px] text-slate-500">Internal &amp; Model</span>
              </button>

              <button
                type="button"
                onClick={() => navigate('/teacher/classes')}
                className="p-3 rounded-lg border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/50 text-left transition-all group"
              >
                <Users className="w-4 h-4 text-emerald-600 mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-slate-900 block">Class Roster</span>
                <span className="text-[10px] text-slate-500">Student contacts</span>
              </button>

              <button
                type="button"
                onClick={() => navigate('/teacher/profile')}
                className="p-3 rounded-lg border border-slate-200 hover:border-slate-400 hover:bg-slate-100 text-left transition-all group"
              >
                <ShieldCheck className="w-4 h-4 text-slate-600 mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-slate-900 block">Staff Scope</span>
                <span className="text-[10px] text-slate-500">Security &amp; auth</span>
              </button>
            </div>
          </Card>
        </div>

        {/* Authorization & Credentials Card (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <Card
            density="compact"
            accent="blue"
            title={
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span>Strict Class Authorization Policy</span>
              </div>
            }
            subtitle="Autonomous Campus Governance"
          >
            <div className="space-y-3 text-xs leading-relaxed">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Active Assignment</span>
                  <Badge variant="primary" size="sm">{currentStaff.assignedClass}</Badge>
                </div>
                <strong className="text-slate-900 block text-xs">
                  {currentStaff.fullName}
                </strong>
                <p className="text-slate-600 text-[11px]">
                  Permissions are strictly scoped to students in <strong>{currentStaff.assignedClass}</strong>. Unauthorized access to external classes is locked.
                </p>
              </div>

              <div className="p-3 bg-blue-50/70 border border-blue-200/80 rounded-xl text-blue-950 space-y-1.5 text-xs">
                <strong className="block font-bold text-blue-900 text-xs">
                  Institutional Faculty Record:
                </strong>
                <div className="flex justify-between border-b border-blue-100 pb-1">
                  <span className="text-blue-800">Department:</span>
                  <strong className="text-slate-900">{currentStaff.department}</strong>
                </div>
                <div className="flex justify-between border-b border-blue-100 pb-1">
                  <span className="text-blue-800">Faculty ID:</span>
                  <code className="bg-white px-1.5 py-0.5 rounded font-mono text-[11px] font-bold text-blue-950">
                    {currentStaff.username}
                  </code>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-800">Official Email:</span>
                  <span className="text-slate-800 font-mono text-[11px]">{currentStaff.email}</span>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-[11px] flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>Session verified with HTTP cookie <code>msec_staff_session</code></span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
