import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import {
  FileText,
  CalendarCheck,
  Send,
  Bell,
  Megaphone,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Award,
  AlertCircle,
  Sparkles,
  PhoneCall,
  Mail,
  ChevronRight,
  ShieldCheck,
  GraduationCap,
  BookOpen,
  Calendar,
  Users
} from 'lucide-react';

export const ParentDashboard: React.FC = () => {
  const {
    currentStudent,
    reportCards,
    attendance,
    leaveRequests,
    notifications,
    announcements,
    students,
    setSelectedStudentId,
    setIsDemoGuideOpen,
    currentParent
  } = useApp();

  const navigate = useNavigate();
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<any | null>(null);

  // Filter records for the current student
  const studentAttendance = attendance.filter((a) => a.studentId === currentStudent.studentId);
  const totalDays = studentAttendance.length;
  const presentDays = studentAttendance.filter((a) => a.status === 'present').length;
  const absentDays = studentAttendance.filter((a) => a.status === 'absent').length;
  const lateDays = studentAttendance.filter((a) => a.status === 'late').length;
  const leaveDays = studentAttendance.filter((a) => a.status === 'on_leave').length;

  const attendancePercentage =
    totalDays > 0 ? Number((((presentDays + lateDays) / totalDays) * 100).toFixed(1)) : 88.5;

  // Latest published report card
  const studentReports = reportCards.filter(
    (r) => r.studentId === currentStudent.studentId && r.isPublished
  );
  const latestReport = studentReports[0];

  // Unread notifications & pending leaves
  const unreadCount = notifications.filter((n) => !n.readStatus).length;
  const pendingLeaves = leaveRequests.filter(
    (l) => l.studentId === currentStudent.studentId && l.status === 'Pending'
  );

  // Recent 5 attendance records
  const recentAttendance = studentAttendance.slice(0, 5);

  // Other sibling if any
  const otherSibling = students.find(
    (s) =>
      s.studentId !== currentStudent.studentId &&
      (currentParent?.linkedStudentIds?.includes(s.studentId) || s.studentId === 'STU-001' || s.studentId === 'STU-002')
  );

  // Buffer calculation for Anna University 75% attendance rule
  // Present + Late >= 0.75 * total
  const safeAbsencesAllowed = Math.max(0, Math.floor((presentDays + lateDays - 0.75 * totalDays) / 0.75));

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Executive Welcome & Student Identity Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-xl p-3.5 sm:p-4 text-white shadow-xs border border-blue-900/50 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3 relative z-10">
          <img
            src={currentStudent.profileImage}
            alt={currentStudent.fullName}
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl object-cover ring-2 ring-blue-400/40 shadow-sm shrink-0"
          />
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">
                {currentStudent.fullName}
              </h1>
              <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-200 border border-blue-400/30">
                {currentStudent.registerNumber}
              </span>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-white/10 text-slate-200 border border-white/10">
                {currentStudent.className}
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-300 mt-0.5">
              {currentStudent.department} • Semester {currentStudent.semester} (Odd) • Faculty Mentor: <strong className="text-white">{currentStudent.mentorName}</strong>
            </p>
          </div>
        </div>

        {/* Quick Sibling Switcher & Demo Helper */}
        <div className="flex items-center gap-2 relative z-10 shrink-0 self-start md:self-auto">
          {otherSibling && (
            <button
              type="button"
              onClick={() => setSelectedStudentId(otherSibling.studentId)}
              className="px-2.5 py-1.5 bg-white/10 hover:bg-white/20 border border-white/15 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 backdrop-blur-xs"
              title={`Switch active child to ${otherSibling.fullName}`}
            >
              <Users className="w-3.5 h-3.5 text-blue-300" />
              <span>Switch to {otherSibling.fullName.split(' ')[0]} ({otherSibling.className.split(' ')[0]})</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsDemoGuideOpen(true)}
            className="px-2.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5 text-slate-950 animate-pulse" />
            <span className="hidden sm:inline">Demo Script</span>
          </button>
        </div>

        {/* Subtle decorative glow */}
        <div className="absolute right-0 top-0 -mt-8 -mr-8 w-48 h-48 rounded-full bg-blue-600/10 pointer-events-none blur-xl" />
      </div>

      {/* Primary KPI Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
        {/* Metric 1: Overall Attendance */}
        <div
          onClick={() => navigate('/attendance')}
          className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-2xs hover:border-blue-400 hover:shadow-xs cursor-pointer transition-all group border-t-2 border-t-emerald-600"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Attendance</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">{attendancePercentage}%</span>
            <Badge variant={attendancePercentage >= 75 ? 'success' : 'danger'} size="xs" dot>
              {attendancePercentage >= 75 ? 'Eligible' : 'Shortage'}
            </Badge>
          </div>
          {/* Progress bar */}
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2.5 overflow-hidden">
            <div
              className={`h-1.5 rounded-full transition-all duration-500 ${
                attendancePercentage >= 75 ? 'bg-emerald-500' : 'bg-rose-500'
              }`}
              style={{ width: `${Math.min(attendancePercentage, 100)}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-500 mt-2 flex items-center justify-between font-medium">
            <span>{presentDays + lateDays} / {totalDays} Attended</span>
            <span className="text-blue-600 font-bold group-hover:translate-x-0.5 transition-transform inline-flex items-center">
              Logs →
            </span>
          </p>
        </div>

        {/* Metric 2: Academic Standing */}
        <div
          onClick={() => navigate('/report-cards')}
          className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-2xs hover:border-blue-400 hover:shadow-xs cursor-pointer transition-all group border-t-2 border-t-blue-600"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Academic Grade</span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {latestReport ? `${latestReport.gpa} GPA` : '8.78 GPA'}
            </span>
            <span className="text-[11px] font-bold text-blue-700">
              ({latestReport?.percentage || 87.33}%)
            </span>
          </div>
          <p className="text-[11px] text-slate-600 mt-2 truncate font-medium">
            {latestReport?.examName || 'Model Examination'}
          </p>
          <div className="mt-1 flex items-center justify-between text-[11px]">
            <span className="text-emerald-700 font-bold text-[10px] bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
              Rank #{latestReport?.classRank || 4}
            </span>
            <span className="text-blue-600 font-bold group-hover:translate-x-0.5 transition-transform inline-flex items-center">
              Report →
            </span>
          </div>
        </div>

        {/* Metric 3: Recent Notifications */}
        <div
          onClick={() => navigate('/notifications')}
          className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-2xs hover:border-blue-400 hover:shadow-xs cursor-pointer transition-all group border-t-2 border-t-rose-600"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Student Alerts</span>
            <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center shrink-0">
              <Bell className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">{unreadCount}</span>
            <span className="text-[11px] text-slate-500 font-medium">unread alerts</span>
          </div>
          <p className="text-[11px] text-slate-600 mt-2 truncate">
            {notifications[0] ? notifications[0].title : 'No new messages'}
          </p>
          <div className="mt-1 flex items-center justify-between text-[11px]">
            <span className="text-amber-800 font-semibold text-[10px]">
              {unreadCount > 0 ? 'Requires action' : 'All clear'}
            </span>
            <span className="text-blue-600 font-bold group-hover:translate-x-0.5 transition-transform inline-flex items-center">
              Inbox →
            </span>
          </div>
        </div>

        {/* Metric 4: Leave Requests Status */}
        <div
          onClick={() => navigate('/leave-requests')}
          className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-2xs hover:border-blue-400 hover:shadow-xs cursor-pointer transition-all group border-t-2 border-t-amber-500"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Leave Applications</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
              <Send className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">{pendingLeaves.length}</span>
            <span className="text-[11px] text-amber-800 font-bold">Pending Review</span>
          </div>
          <p className="text-[11px] text-slate-600 mt-2 truncate">
            {pendingLeaves[0] ? `${pendingLeaves[0].startDate} (${pendingLeaves[0].leaveType})` : 'No pending leaves'}
          </p>
          <div className="mt-1 flex items-center justify-between text-[11px]">
            <span className="text-slate-500 font-mono text-[10px]">{leaveRequests.length} total logged</span>
            <span className="text-blue-600 font-bold group-hover:translate-x-0.5 transition-transform inline-flex items-center">
              Apply →
            </span>
          </div>
        </div>
      </div>

      {/* Quick Access Action Pills (Space-Efficient Navigation) */}
      <div className="bg-white rounded-xl p-2.5 border border-slate-200 shadow-2xs">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          <button
            type="button"
            onClick={() => navigate('/report-cards')}
            className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-blue-50/70 border border-transparent hover:border-blue-200 text-left transition-all group"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-100/70 text-blue-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <FileText className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="block text-xs font-bold text-slate-800 leading-tight">Report Cards</span>
              <span className="block text-[10px] text-slate-500 leading-tight">Marks & GPA</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => navigate('/attendance')}
            className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-emerald-50/70 border border-transparent hover:border-emerald-200 text-left transition-all group"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-100/70 text-emerald-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <CalendarCheck className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="block text-xs font-bold text-slate-800 leading-tight">Attendance</span>
              <span className="block text-[10px] text-slate-500 leading-tight">Muster & Cal</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => navigate('/leave-requests')}
            className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-amber-50/70 border border-transparent hover:border-amber-200 text-left transition-all group"
          >
            <div className="w-8 h-8 rounded-lg bg-amber-100/70 text-amber-800 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Send className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="block text-xs font-bold text-slate-800 leading-tight">Apply Leave</span>
              <span className="block text-[10px] text-slate-500 leading-tight">Sanctions</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => navigate('/notifications')}
            className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-rose-50/70 border border-transparent hover:border-rose-200 text-left transition-all group"
          >
            <div className="w-8 h-8 rounded-lg bg-rose-100/70 text-rose-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Bell className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="block text-xs font-bold text-slate-800 leading-tight">Alerts</span>
              <span className="block text-[10px] text-slate-500 leading-tight">Late / Absence</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => navigate('/announcements')}
            className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-indigo-50/70 border border-transparent hover:border-indigo-200 text-left transition-all group col-span-2 sm:col-span-1"
          >
            <div className="w-8 h-8 rounded-lg bg-indigo-100/70 text-indigo-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Megaphone className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="block text-xs font-bold text-slate-800 leading-tight">Circulars</span>
              <span className="block text-[10px] text-slate-500 leading-tight">College News</span>
            </div>
          </button>
        </div>
      </div>

      {/* Dual Section: Recent Attendance Muster & Latest Academic Highlights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
        {/* Left Card: Recent Daily Attendance Activity */}
        <Card
          title={
            <div className="flex items-center gap-2">
              <CalendarCheck className="w-4 h-4 text-emerald-600" />
              <span>Recent Muster Records</span>
            </div>
          }
          subtitle={`Latest 5 days recorded for ${currentStudent.className}`}
          action={
            <button
              type="button"
              onClick={() => navigate('/attendance')}
              className="text-xs text-blue-700 hover:text-blue-800 font-bold flex items-center gap-1 transition-colors"
            >
              <span>Full Muster</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          }
          noPadding
        >
          <div className="table-wrapper">
            <table
              role="region"
              aria-label="Recent student attendance history"
              tabIndex={0}
              className="compact-table"
            >
              <thead>
                <tr>
                  <th className="w-24 text-left">Date</th>
                  <th className="w-20 text-center">Status</th>
                  <th className="text-left">Arrival / Notes</th>
                  <th className="w-28 text-right">Faculty</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentAttendance.map((rec) => (
                  <tr key={rec.attendanceId} className="hover:bg-slate-50/80 transition-colors">
                    <td className="font-medium text-slate-800">
                      {new Date(rec.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      })}
                      <span className="block text-[10px] text-slate-400">
                        {new Date(rec.date).toLocaleDateString('en-US', { weekday: 'short' })}
                      </span>
                    </td>
                    <td className="text-center">
                      <Badge
                        variant={
                          rec.status === 'present'
                            ? 'success'
                            : rec.status === 'late'
                            ? 'warning'
                            : rec.status === 'on_leave'
                            ? 'info'
                            : 'danger'
                        }
                        size="xs"
                      >
                        {rec.status === 'present'
                          ? 'Present'
                          : rec.status === 'late'
                          ? 'Late'
                          : rec.status === 'on_leave'
                          ? 'Leave'
                          : 'Absent'}
                      </Badge>
                    </td>
                    <td>
                      {rec.arrivalTime ? (
                        <span className="font-mono text-amber-800 bg-amber-50 px-1 py-0.2 rounded border border-amber-200 text-[10px] inline-flex items-center gap-1 font-bold">
                          <Clock className="w-3 h-3" />
                          {rec.arrivalTime}
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px]">—</span>
                      )}
                      {rec.notes && (
                        <span className="block text-[10px] text-slate-500 truncate max-w-xs">{rec.notes}</span>
                      )}
                    </td>
                    <td className="text-right text-[11px] text-slate-500 font-medium truncate">
                      {rec.recordedBy.split(' ')[0]} {rec.recordedBy.split(' ')[1] || ''}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-3 bg-slate-50 border-t border-slate-200/90 text-xs text-slate-600 flex items-center justify-between">
            <span className="text-[11px]">
              Anna University 75% Norm: Safe buffer is <strong>{safeAbsencesAllowed} classes</strong>.
            </span>
            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
              Exams Allowed
            </span>
          </div>
        </Card>

        {/* Right Card: Latest Academic Performance Highlights */}
        <Card
          title={
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-blue-600" />
              <span>Model Examination Highlights</span>
            </div>
          }
          subtitle="Official grading under Anna University Regulation 2021"
          action={
            <button
              type="button"
              onClick={() => navigate('/report-cards')}
              className="text-xs text-blue-700 hover:text-blue-800 font-bold flex items-center gap-1 transition-colors"
            >
              <span>Download Transcript</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          }
        >
          {latestReport ? (
            <div className="space-y-3">
              {/* Score strip */}
              <div className="p-3 bg-blue-50/70 border border-blue-200/80 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-blue-700 font-bold uppercase tracking-wider block">
                    {latestReport.examName}
                  </span>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-2xl font-black text-blue-950">{latestReport.percentage}%</span>
                    <span className="text-[11px] text-blue-800 font-medium font-mono">
                      ({latestReport.totalMarksObtained} / {latestReport.totalMaximumMarks} Marks)
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-500 font-medium block">Grade Point Average</span>
                  <span className="text-xl font-black text-slate-900 tracking-tight font-mono">{latestReport.gpa}</span>
                  <Badge variant="success" size="xs" className="mt-0.5 font-bold">
                    {latestReport.resultStatus}
                  </Badge>
                </div>
              </div>

              {/* Top 3 Subjects */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-slate-700 block">Top Subject Marks:</span>
                {latestReport.subjects.slice(0, 3).map((sub) => (
                  <div
                    key={sub.subjectCode}
                    className="p-2 rounded-lg bg-slate-50 border border-slate-200/70 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-semibold text-slate-800 block leading-tight">{sub.subjectName}</span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {sub.subjectCode} • {sub.credits} Credits
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-bold text-slate-900">
                        {sub.marksObtained} / {sub.maximumMarks}
                      </span>
                      <Badge variant="primary" size="xs" className="ml-1.5 font-bold">
                        Grade {sub.grade}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>

              {/* Faculty Advisor Remarks */}
              <div className="p-2.5 bg-amber-50/70 border border-amber-200/80 rounded-lg text-xs">
                <span className="font-bold text-amber-900 block text-[11px]">Class Advisor Remarks:</span>
                <p className="text-slate-700 mt-0.5 italic text-[11px]">
                  "{latestReport.teacherRemarks}"
                </p>
                <span className="text-[10px] text-slate-500 mt-1 block font-medium">
                  — {currentStudent.mentorName} (Faculty Advisor)
                </span>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-500 py-6 text-center">No examination report cards published yet.</p>
          )}
        </Card>
      </div>

      {/* Official College Announcements & Circulars */}
      <Card
        title={
          <div className="flex items-center gap-2">
            <Megaphone className="w-4 h-4 text-indigo-600" />
            <span>Official College Circulars & Administrative Notices</span>
          </div>
        }
        subtitle="Important updates from College Principal & Autonomous Examination Cell"
        action={
          <button
            type="button"
            onClick={() => navigate('/announcements')}
            className="text-xs text-blue-700 hover:text-blue-800 font-bold flex items-center gap-1 transition-colors"
          >
            <span>All Circulars</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {announcements.slice(0, 3).map((ann) => (
            <div
              key={ann.announcementId}
              onClick={() => setSelectedAnnouncement(ann)}
              className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-blue-400 hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-1.5 mb-1.5">
                  <Badge
                    variant={
                      ann.priority === 'Urgent'
                        ? 'danger'
                        : ann.priority === 'Important'
                        ? 'warning'
                        : 'neutral'
                    }
                    size="xs"
                  >
                    {ann.category}
                  </Badge>
                  <span className="text-[10px] text-slate-400 font-mono">{ann.publishedAt.split(' ')[0]}</span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 line-clamp-2 leading-snug">{ann.title}</h4>
                <p className="text-[11px] text-slate-600 line-clamp-2 mt-1 leading-relaxed">{ann.message}</p>
              </div>
              <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-500">
                <span className="truncate">{ann.publishedBy}</span>
                <span className="text-blue-700 font-bold">Read Circular →</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Circular Detail Modal */}
      {selectedAnnouncement && (
        <Modal
          isOpen={!!selectedAnnouncement}
          onClose={() => setSelectedAnnouncement(null)}
          title={
            <div className="flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-blue-600" />
              <span>Official Institutional Circular</span>
            </div>
          }
          footer={
            <button
              type="button"
              onClick={() => setSelectedAnnouncement(null)}
              className="px-4 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition-colors"
            >
              Close
            </button>
          }
        >
          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <Badge variant="primary" size="sm">{selectedAnnouncement.category}</Badge>
              <span className="text-slate-400 font-mono text-[11px]">{selectedAnnouncement.publishedAt}</span>
            </div>
            <h3 className="text-sm font-bold text-slate-900 leading-snug">{selectedAnnouncement.title}</h3>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-700 leading-relaxed whitespace-pre-line text-xs">
              {selectedAnnouncement.message}
            </div>
            <div className="pt-2 text-[11px] text-slate-500 flex items-center justify-between">
              <span>Issuing Authority: <strong>{selectedAnnouncement.publishedBy}</strong></span>
              <span className="font-mono">Ref: MSEC/CIR/2026</span>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
