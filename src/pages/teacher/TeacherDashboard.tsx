import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp, matchesAssignedClass } from '../../context/AppContext';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import {
  Users,
  CalendarCheck,
  Award,
  CheckSquare,
  Sparkles,
  BookOpen,
  LogOut,
  ShieldCheck,
  AlertTriangle
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
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-blue-950 rounded-2xl p-5 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-400/30">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Active Staff Session</span>
            </span>
            <Badge variant="success" size="sm">
              Scope: {currentStaff.assignedClass}
            </Badge>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
            Welcome, {currentStaff.fullName}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            {currentStaff.designation} • Department of {currentStaff.department} • Strict Scoping Active for Class <strong>{currentStaff.assignedClass}</strong> ({scopedStudents.length} students).
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start md:self-auto">
          <button
            type="button"
            onClick={() => setIsDemoGuideOpen(true)}
            className="px-3.5 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Demo Guide</span>
          </button>
          <button
            type="button"
            onClick={() => {
              staffLogout();
              navigate('/teacher/login');
            }}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => navigate('/teacher/classes')}
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-emerald-300 cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Scoped Students</span>
            <Users className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">{scopedStudents.length}</span>
            <span className="text-xs text-slate-500">{currentStaff.assignedClass}</span>
          </div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-2 group-hover:translate-x-0.5 transition-transform">
            View Class Roster →
          </p>
        </div>

        <div
          onClick={() => navigate('/teacher/attendance')}
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-blue-300 cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Daily Muster</span>
            <CalendarCheck className="w-4 h-4 text-blue-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-blue-900">Today</span>
            <span className="text-xs text-emerald-600 font-semibold">Ready</span>
          </div>
          <p className="text-[11px] text-blue-600 font-semibold mt-2 group-hover:translate-x-0.5 transition-transform">
            Record / Update Attendance →
          </p>
        </div>

        <div
          onClick={() => navigate('/teacher/leave-requests')}
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-amber-300 cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Pending Leaves ({currentStaff.assignedClass})</span>
            <CheckSquare className="w-4 h-4 text-amber-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-amber-700">{pendingLeaves.length}</span>
            <span className="text-xs text-amber-800 font-medium">Under Review</span>
          </div>
          <p className="text-[11px] text-amber-700 font-semibold mt-2 group-hover:translate-x-0.5 transition-transform">
            Review Leave Applications →
          </p>
        </div>

        <div
          onClick={() => navigate('/teacher/marks')}
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-purple-300 cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Marks &amp; Publishing</span>
            <Award className="w-4 h-4 text-purple-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-purple-900">{currentStaff.assignedClass}</span>
          </div>
          <p className="text-[11px] text-purple-600 font-semibold mt-2 group-hover:translate-x-0.5 transition-transform">
            Enter Marks &amp; Publish →
          </p>
        </div>
      </div>

      {/* Main Grid: Pending Leave Requests & Fast Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Leave Requests for Scoped Class */}
        <Card
          title={
            <div className="flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-amber-600" />
              <span>Pending Leave Approvals for {currentStaff.assignedClass}</span>
            </div>
          }
          subtitle={`Showing applications strictly scoped to ${currentStaff.assignedClass}`}
          action={
            <button
              type="button"
              onClick={() => navigate('/teacher/leave-requests')}
              className="text-xs font-semibold text-blue-700 hover:text-blue-800"
            >
              View Scoped ({pendingLeaves.length}) →
            </button>
          }
        >
          {pendingLeaves.length === 0 ? (
            <p className="py-8 text-center text-xs text-slate-400">
              No pending leave requests for class {currentStaff.assignedClass}.
            </p>
          ) : (
            <div className="space-y-3">
              {pendingLeaves.map((req) => (
                <div
                  key={req.requestId}
                  className="p-3.5 bg-amber-50/50 border border-amber-200/80 rounded-xl flex items-start justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <strong className="text-slate-900 text-sm">{req.studentName}</strong>
                      <Badge variant="warning" size="sm">{req.leaveType}</Badge>
                      <span className="font-mono text-[11px] text-slate-500">{req.requestId}</span>
                    </div>
                    <span className="text-slate-600 block mt-1">
                      Dates: <strong>{req.startDate} to {req.endDate}</strong> ({req.totalDays} {req.totalDays === 1 ? 'day' : 'days'})
                    </span>
                    <p className="text-slate-600 mt-1 line-clamp-2 italic">
                      "{req.reason}"
                    </p>
                    <span className="text-[10px] text-slate-400 mt-1.5 block">
                      Submitted by: {req.submittedBy} on {req.createdAt}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => navigate('/teacher/leave-requests')}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shrink-0 transition-colors shadow-2xs"
                  >
                    Review &amp; Sanction
                  </button>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Assigned Class Scope Card */}
        <Card
          title={
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>Strict Class Authorization Policy</span>
            </div>
          }
          subtitle="Meenakshi Sundararajan Engineering College (Autonomous)"
        >
          <div className="space-y-3 text-xs text-slate-700 leading-relaxed">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <strong className="text-slate-900 block font-semibold mb-1">
                Active Staff Assignment: {currentStaff.assignedClass}
              </strong>
              <p className="text-slate-600">
                You are authenticated as <strong>{currentStaff.fullName}</strong>. Your account permissions strictly limit data viewing and editing to students enrolled in <strong>{currentStaff.assignedClass}</strong>.
              </p>
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-900">
              <strong className="block font-semibold mb-0.5">Assigned Class Advisor Credentials:</strong>
              <div>Department: <strong>{currentStaff.department}</strong></div>
              <div>Username: <code className="bg-white px-1.5 py-0.5 rounded font-mono text-[11px]">{currentStaff.username}</code></div>
              <div>Official Email: <strong>{currentStaff.email}</strong></div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
