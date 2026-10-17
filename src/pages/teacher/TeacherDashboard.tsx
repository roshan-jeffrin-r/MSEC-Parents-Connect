import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import {
  Users,
  CalendarCheck,
  Award,
  CheckSquare,
  Clock,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  BookOpen
} from 'lucide-react';

export const TeacherDashboard: React.FC = () => {
  const { currentTeacher, students, leaveRequests, examinations, reportCards, setIsDemoGuideOpen } = useApp();
  const navigate = useNavigate();

  const cseStudents = students.filter((s) => s.className === 'III Year CSE - B');
  const pendingLeaves = leaveRequests.filter((l) => l.status === 'Pending');

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-blue-950 rounded-2xl p-5 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-400/30 mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Faculty Portal</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
            Welcome, {currentTeacher.fullName}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            {currentTeacher.designation} • Class Advisor for <strong>III Year CSE - B</strong> (62 Students enrolled).
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsDemoGuideOpen(true)}
          className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2 self-start md:self-auto"
        >
          <Sparkles className="w-4 h-4" />
          <span>Faculty Demo Guide (Step 9)</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => navigate('/teacher/classes')}
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-emerald-300 cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Assigned Students</span>
            <Users className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">62</span>
            <span className="text-xs text-slate-500">III Year CSE - B</span>
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
            <span className="text-xs text-emerald-600 font-semibold">93.5% Present</span>
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
            <span>Pending Leaves</span>
            <CheckSquare className="w-4 h-4 text-amber-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-amber-700">{pendingLeaves.length}</span>
            <span className="text-xs text-amber-800 font-medium">Requires Review</span>
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
            <span>Marks & Publishing</span>
            <Award className="w-4 h-4 text-purple-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-purple-900">Model Exam</span>
            <span className="text-xs text-emerald-600 font-semibold">Published</span>
          </div>
          <p className="text-[11px] text-purple-600 font-semibold mt-2 group-hover:translate-x-0.5 transition-transform">
            Enter Marks & Publish →
          </p>
        </div>
      </div>

      {/* Main Grid: Pending Leave Requests & Fast Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Leave Requests for Advisor */}
        <Card
          title={
            <div className="flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-amber-600" />
              <span>Pending Leave Approvals for CSE-B</span>
            </div>
          }
          subtitle="Review parent applications and issue official institutional sanction"
          action={
            <button
              type="button"
              onClick={() => navigate('/teacher/leave-requests')}
              className="text-xs font-semibold text-blue-700 hover:text-blue-800"
            >
              View All ({pendingLeaves.length}) →
            </button>
          }
        >
          {pendingLeaves.length === 0 ? (
            <p className="py-8 text-center text-xs text-slate-400">No pending leave requests.</p>
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
                    Review & Sanction
                  </button>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Assigned Subjects & Quick Links */}
        <Card
          title={
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-600" />
              <span>Assigned Teaching Courses</span>
            </div>
          }
          subtitle="Odd Semester 2026-2027 Course Allocations"
        >
          <div className="space-y-3">
            {currentTeacher.assignedSubjects.map((sub) => (
              <div
                key={sub.subjectCode}
                className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-blue-800">{sub.subjectCode}</span>
                    <strong className="text-slate-900">{sub.subjectName}</strong>
                  </div>
                  <span className="text-slate-500 block text-[11px] mt-0.5">
                    Class: <strong className="text-slate-700">{sub.className}</strong> • 3 Credits
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => navigate('/teacher/marks')}
                  className="px-2.5 py-1 bg-white border border-slate-300 hover:border-blue-600 hover:text-blue-600 rounded-lg text-xs font-semibold text-slate-700 transition-colors"
                >
                  Enter Marks
                </button>
              </div>
            ))}

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Department: <strong>{currentTeacher.department}</strong></span>
              <span>Room: <strong>CSE Block 204</strong></span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
