import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
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
  ChevronRight
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
    setIsDemoGuideOpen
  } = useApp();

  const navigate = useNavigate();

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

  return (
    <div className="space-y-6">
      {/* Faculty Demonstration Helper Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 rounded-2xl p-4 sm:p-5 text-white shadow-lg relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-200 text-xs font-semibold border border-blue-400/30 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Demonstration Ready</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
            Welcome, Mr. Rajesh Kumar
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            You are viewing the parent portal for <strong className="text-white">{currentStudent.fullName}</strong> ({currentStudent.registerNumber}). Live data reflects attendance, examination marks, and leave status.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => setIsDemoGuideOpen(true)}
            className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2"
          >
            <span>Faculty Demo Script</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Decorative background circle */}
        <div className="absolute right-0 top-0 -mt-8 -mr-8 w-64 h-64 rounded-full bg-blue-600/10 pointer-events-none blur-2xl" />
      </div>

      {/* Student Profile Hero Card */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-4">
            <img
              src={currentStudent.profileImage}
              alt={currentStudent.fullName}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-2 ring-slate-100 shadow-sm"
            />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-slate-900">{currentStudent.fullName}</h2>
                <Badge variant="primary" size="sm">
                  {currentStudent.registerNumber}
                </Badge>
                <Badge variant="neutral" size="sm">
                  {currentStudent.hostelDayScholar}
                </Badge>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                {currentStudent.department} • <strong className="text-slate-800">{currentStudent.className}</strong>
              </p>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-2">
                <span>Semester: <strong className="text-slate-700">{currentStudent.semester} (Odd)</strong></span>
                <span>•</span>
                <span>Academic Year: <strong className="text-slate-700">{currentStudent.academicYear}</strong></span>
                <span>•</span>
                <span>Faculty Mentor: <strong className="text-slate-700">{currentStudent.mentorName}</strong></span>
              </div>
            </div>
          </div>

          {/* Sibling Switcher Option */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-3 lg:w-72 shrink-0">
            <div className="text-xs">
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Switch Child</span>
              <span className="font-semibold text-slate-800 truncate block">
                {currentStudent.studentId === 'STU-001' ? 'Sibling: Ananya Kumar' : 'Sibling: Aarav Kumar'}
              </span>
              <span className="text-[11px] text-slate-500">
                {currentStudent.studentId === 'STU-001' ? 'I Year ECE - A' : 'III Year CSE - B'}
              </span>
            </div>
            <button
              type="button"
              onClick={() =>
                setSelectedStudentId(currentStudent.studentId === 'STU-001' ? 'STU-002' : 'STU-001')
              }
              className="px-2.5 py-1.5 bg-white border border-slate-300 hover:border-blue-600 hover:text-blue-600 text-xs font-semibold rounded-lg text-slate-700 transition-colors shadow-2xs"
            >
              Switch
            </button>
          </div>
        </div>
      </div>

      {/* Primary KPI Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Overall Attendance */}
        <div
          onClick={() => navigate('/attendance')}
          className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs hover:border-blue-300 hover:shadow-sm cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Overall Attendance</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900">{attendancePercentage}%</span>
            <span className="text-xs font-semibold text-emerald-600 flex items-center gap-0.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Above 75%
            </span>
          </div>
          {/* Progress bar */}
          <div className="w-full bg-slate-100 rounded-full h-2 mt-3 overflow-hidden">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${
                attendancePercentage >= 75 ? 'bg-emerald-500' : 'bg-rose-500'
              }`}
              style={{ width: `${Math.min(attendancePercentage, 100)}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-500 mt-2 flex items-center justify-between">
            <span>{presentDays} Present / {totalDays} Working Days</span>
            <span className="text-blue-600 font-semibold group-hover:translate-x-0.5 transition-transform inline-flex items-center">
              Details →
            </span>
          </p>
        </div>

        {/* Metric 2: Academic Standing */}
        <div
          onClick={() => navigate('/report-cards')}
          className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs hover:border-blue-300 hover:shadow-sm cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Latest Exam Result</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900">
              {latestReport ? `${latestReport.gpa} GPA` : '8.78 GPA'}
            </span>
            <span className="text-xs font-semibold text-blue-600">
              ({latestReport?.percentage || 87.33}%)
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-2 truncate">
            {latestReport?.examName || 'Model Examination'}
          </p>
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
            <Badge variant="success" size="sm">
              Distinction
            </Badge>
            <span className="text-blue-600 font-semibold group-hover:translate-x-0.5 transition-transform inline-flex items-center">
              View Report →
            </span>
          </div>
        </div>

        {/* Metric 3: Recent Notifications */}
        <div
          onClick={() => navigate('/notifications')}
          className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs hover:border-blue-300 hover:shadow-sm cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Unread Alerts</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900">{unreadCount}</span>
            <span className="text-xs text-slate-500">new messages</span>
          </div>
          <p className="text-xs text-slate-600 mt-2">
            Includes attendance alerts & exam notices
          </p>
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
            <span className="text-amber-600 font-medium">Requires review</span>
            <span className="text-blue-600 font-semibold group-hover:translate-x-0.5 transition-transform inline-flex items-center">
              Open Inbox →
            </span>
          </div>
        </div>

        {/* Metric 4: Leave Requests Status */}
        <div
          onClick={() => navigate('/leave-requests')}
          className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs hover:border-blue-300 hover:shadow-sm cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Pending Leaves</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Send className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900">{pendingLeaves.length}</span>
            <span className="text-xs text-amber-700 font-semibold">Under Review</span>
          </div>
          <p className="text-xs text-slate-600 mt-2 truncate">
            {pendingLeaves[0] ? `Oct 24 - Oct 25 (${pendingLeaves[0].leaveType})` : 'No pending leaves'}
          </p>
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
            <span className="text-slate-500">{leaveRequests.length} total logged</span>
            <span className="text-blue-600 font-semibold group-hover:translate-x-0.5 transition-transform inline-flex items-center">
              Manage →
            </span>
          </div>
        </div>
      </div>

      {/* Quick Access Action Cards */}
      <div>
        <h3 className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-wider">
          Quick Access Portal
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <button
            type="button"
            onClick={() => navigate('/report-cards')}
            className="p-4 bg-white rounded-xl border border-slate-200 hover:border-blue-600 hover:shadow-sm flex flex-col items-center text-center transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center group-hover:scale-110 transition-transform mb-2">
              <FileText className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-800">Report Cards</span>
            <span className="text-[11px] text-slate-400 mt-0.5">Marks & Grades</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/attendance')}
            className="p-4 bg-white rounded-xl border border-slate-200 hover:border-emerald-600 hover:shadow-sm flex flex-col items-center text-center transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:scale-110 transition-transform mb-2">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-800">Attendance</span>
            <span className="text-[11px] text-slate-400 mt-0.5">Daily Logs & Calendar</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/leave-requests')}
            className="p-4 bg-white rounded-xl border border-slate-200 hover:border-amber-600 hover:shadow-sm flex flex-col items-center text-center transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center group-hover:scale-110 transition-transform mb-2">
              <Send className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-800">Leave Requests</span>
            <span className="text-[11px] text-slate-400 mt-0.5">Apply & Status</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/notifications')}
            className="p-4 bg-white rounded-xl border border-slate-200 hover:border-rose-600 hover:shadow-sm flex flex-col items-center text-center transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center group-hover:scale-110 transition-transform mb-2">
              <Bell className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-800">Notifications</span>
            <span className="text-[11px] text-slate-400 mt-0.5">Late / Absence Alerts</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/announcements')}
            className="p-4 bg-white rounded-xl border border-slate-200 hover:border-indigo-600 hover:shadow-sm flex flex-col items-center text-center transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center group-hover:scale-110 transition-transform mb-2">
              <Megaphone className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-800">Announcements</span>
            <span className="text-[11px] text-slate-400 mt-0.5">College Circulars</span>
          </button>
        </div>
      </div>

      {/* Dual Section: Recent Attendance Activity & Latest Academic Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Recent Attendance Activity Table */}
        <Card
          title={
            <div className="flex items-center gap-2">
              <CalendarCheck className="w-4 h-4 text-emerald-600" />
              <span>Recent Attendance Activity</span>
            </div>
          }
          subtitle="Latest 5 working days recorded by Department Faculty"
          action={
            <button
              type="button"
              onClick={() => navigate('/attendance')}
              className="text-xs text-blue-700 hover:text-blue-800 font-semibold flex items-center gap-1"
            >
              <span>View Full History</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          }
        >
          <div className="divide-y divide-slate-100">
            {recentAttendance.map((rec) => (
              <div key={rec.attendanceId} className="py-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                      rec.status === 'present'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : rec.status === 'late'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : rec.status === 'on_leave'
                        ? 'bg-sky-50 text-sky-700 border border-sky-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}
                  >
                    {rec.status === 'present' ? 'P' : rec.status === 'late' ? 'L' : rec.status === 'on_leave' ? 'OL' : 'A'}
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-800 block">
                      {new Date(rec.date).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {rec.arrivalTime ? `In-time: ${rec.arrivalTime}` : `Recorded by: ${rec.recordedBy}`}
                    </span>
                    {rec.notes && (
                      <p className="text-[10px] text-amber-800 bg-amber-50/80 px-1.5 py-0.5 rounded mt-0.5 inline-block">
                        {rec.notes}
                      </p>
                    )}
                  </div>
                </div>

                <div className="shrink-0">
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
                  >
                    {rec.status === 'present'
                      ? 'Present'
                      : rec.status === 'late'
                      ? 'Late Arrival'
                      : rec.status === 'on_leave'
                      ? 'Approved Leave'
                      : 'Absent'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 bg-slate-50 rounded-xl text-xs text-slate-600 flex items-center justify-between border border-slate-200/80">
            <span className="text-[11px]">
              Anna University Norm: Minimum <strong>75%</strong> attendance required to qualify for semester examinations.
            </span>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
              Eligible
            </span>
          </div>
        </Card>

        {/* Right: Latest Academic Performance & Class Remarks */}
        <Card
          title={
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-blue-600" />
              <span>Academic Highlights (Model Exam)</span>
            </div>
          }
          subtitle="Official grading under Anna University Regulation 2021"
          action={
            <button
              type="button"
              onClick={() => navigate('/report-cards')}
              className="text-xs text-blue-700 hover:text-blue-800 font-semibold flex items-center gap-1"
            >
              <span>Download Report</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          }
        >
          {latestReport ? (
            <div className="space-y-4">
              {/* Score header */}
              <div className="p-4 bg-blue-50/70 border border-blue-200/70 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-xs text-blue-700 font-semibold uppercase tracking-wider block">
                    {latestReport.examName}
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-bold text-blue-950">{latestReport.percentage}%</span>
                    <span className="text-xs text-blue-700 font-medium">({latestReport.totalMarksObtained} / {latestReport.totalMaximumMarks} Marks)</span>
                  </div>
                  <span className="text-[11px] text-blue-800 font-semibold mt-1 block">
                    Class Rank: #{latestReport.classRank || 4} of {latestReport.totalStudentsInClass || 62} students
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-500 block">Grade Point Average</span>
                  <span className="text-2xl font-black text-slate-900">{latestReport.gpa}</span>
                  <Badge variant="success" size="sm" className="mt-1">
                    {latestReport.resultStatus}
                  </Badge>
                </div>
              </div>

              {/* Top 3 Subjects Preview */}
              <div>
                <span className="text-xs font-semibold text-slate-700 block mb-2">Subject Performance Summary:</span>
                <div className="space-y-2">
                  {latestReport.subjects.slice(0, 3).map((sub) => (
                    <div key={sub.subjectCode} className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-semibold text-slate-800">{sub.subjectName}</span>
                        <span className="text-slate-500 block text-[11px]">{sub.subjectCode} • {sub.credits} Credits</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-slate-900">{sub.marksObtained} / {sub.maximumMarks}</span>
                        <Badge variant="primary" size="sm" className="ml-2">
                          Grade {sub.grade}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Faculty Advisor Remarks */}
              <div className="p-3 bg-amber-50/60 border border-amber-200/60 rounded-xl text-xs">
                <span className="font-semibold text-amber-900 block">Class Advisor Remarks:</span>
                <p className="text-slate-700 mt-1 italic">
                  "{latestReport.teacherRemarks}"
                </p>
                <span className="text-[11px] text-slate-500 mt-2 block font-medium">
                  — {currentStudent.mentorName} (Dept of CSE)
                </span>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-500">No report cards available.</p>
          )}
        </Card>
      </div>

      {/* Bottom Row: Recent College Announcements */}
      <Card
        title={
          <div className="flex items-center gap-2">
            <Megaphone className="w-4 h-4 text-indigo-600" />
            <span>Important College Notices & Circulars</span>
          </div>
        }
        subtitle="Recent official communications published by College Administration"
        action={
          <button
            type="button"
            onClick={() => navigate('/announcements')}
            className="text-xs text-blue-700 hover:text-blue-800 font-semibold flex items-center gap-1"
          >
            <span>View All Notices</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {announcements.slice(0, 3).map((ann) => (
            <div
              key={ann.announcementId}
              onClick={() => navigate('/announcements')}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-blue-300 hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <Badge
                    variant={
                      ann.priority === 'Urgent'
                        ? 'danger'
                        : ann.priority === 'Important'
                        ? 'warning'
                        : 'neutral'
                    }
                    size="sm"
                  >
                    {ann.category}
                  </Badge>
                  <span className="text-[10px] text-slate-400 font-medium">{ann.publishedAt.split(' ')[0]}</span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 line-clamp-2">{ann.title}</h4>
                <p className="text-[11px] text-slate-600 line-clamp-3 mt-1.5 leading-relaxed">{ann.message}</p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-500">
                <span className="truncate">{ann.publishedBy}</span>
                <span className="text-blue-600 font-semibold">Read →</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
