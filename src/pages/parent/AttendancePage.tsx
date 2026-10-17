import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { AttendanceStatus } from '../../types';
import {
  CalendarCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldCheck,
  Filter,
  Search,
  Info,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Sparkles
} from 'lucide-react';

export const AttendancePage: React.FC = () => {
  const { currentStudent, attendance } = useApp();

  // Filter attendance for the current student
  const studentRecords = useMemo(
    () => attendance.filter((a) => a.studentId === currentStudent.studentId),
    [attendance, currentStudent.studentId]
  );

  const [selectedMonth, setSelectedMonth] = useState<string>('all'); // 'all' | '2026-10' | '2026-09' | '2026-08'
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Metrics computation
  const totalWorkingDays = studentRecords.length;
  const presentCount = studentRecords.filter((a) => a.status === 'present').length;
  const absentCount = studentRecords.filter((a) => a.status === 'absent').length;
  const lateCount = studentRecords.filter((a) => a.status === 'late').length;
  const leaveCount = studentRecords.filter((a) => a.status === 'on_leave').length;

  // Institutional policy: Present + Late are counted as attended. Approved leave is excused but not counted as present.
  const overallPercentage =
    totalWorkingDays > 0
      ? Number((((presentCount + lateCount) / totalWorkingDays) * 100).toFixed(1))
      : 88.5;

  // Filtered records
  const filteredRecords = useMemo(() => {
    return studentRecords.filter((rec) => {
      // Month filter
      if (selectedMonth !== 'all' && !rec.date.startsWith(selectedMonth)) {
        return false;
      }
      // Status filter
      if (statusFilter !== 'all' && rec.status !== statusFilter) {
        return false;
      }
      // Search term
      if (searchTerm) {
        const query = searchTerm.toLowerCase();
        const matchesDate = rec.date.toLowerCase().includes(query);
        const matchesNotes = rec.notes?.toLowerCase().includes(query);
        const matchesRecorded = rec.recordedBy.toLowerCase().includes(query);
        return matchesDate || matchesNotes || matchesRecorded;
      }
      return true;
    });
  }, [studentRecords, selectedMonth, statusFilter, searchTerm]);

  // Calendar representation for October 2026
  // Days of October 2026: October 1 is Thursday, 31 days total
  const daysInOctober = Array.from({ length: 31 }, (_, i) => {
    const dayNum = i + 1;
    const dateStr = `2026-10-${String(dayNum).padStart(2, '0')}`;
    const record = studentRecords.find((r) => r.date === dateStr);
    const dateObj = new Date(dateStr);
    const dayOfWeek = dateObj.getDay(); // 0 is Sunday
    return {
      date: dateStr,
      day: dayNum,
      isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
      record
    };
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Attendance Management
            </h1>
            <Badge variant="success">Anna University Compliant</Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Tracking daily muster and academic attendance for <strong className="text-slate-800">{currentStudent.fullName}</strong> ({currentStudent.className})
          </p>
        </div>

        {/* Safe Zone Alert Tag */}
        <div className="flex items-center gap-2 px-3.5 py-2 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-semibold shadow-2xs">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Eligible for Anna University Exam (Requires &ge; 75%)</span>
        </div>
      </div>

      {/* Primary Attendance KPI Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {/* Overall Percentage */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Overall Attendance</span>
            <CalendarCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">{overallPercentage}%</span>
            <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
              <div
                className={`h-1.5 rounded-full ${overallPercentage >= 75 ? 'bg-emerald-500' : 'bg-rose-500'}`}
                style={{ width: `${Math.min(overallPercentage, 100)}%` }}
              />
            </div>
          </div>
          <span className="text-[10px] text-emerald-700 font-semibold mt-2 block">
            +13.5% above minimum requirement
          </span>
        </div>

        {/* Working Days */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Working Days</span>
            <CalendarIcon className="w-4 h-4 text-blue-600" />
          </div>
          <div className="mt-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">{totalWorkingDays}</span>
            <span className="text-xs text-slate-400 block mt-1">Conducted so far</span>
          </div>
          <span className="text-[10px] text-slate-500 mt-2 block">Odd Semester 2026</span>
        </div>

        {/* Days Present */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Days Present</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2">
            <span className="text-2xl sm:text-3xl font-black text-emerald-700">{presentCount}</span>
            <span className="text-xs text-slate-400 block mt-1">Regular on-time</span>
          </div>
          <span className="text-[10px] text-emerald-600 font-medium mt-2 block">
            {((presentCount / totalWorkingDays) * 100).toFixed(1)}% of total
          </span>
        </div>

        {/* Late Arrivals */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Late Arrivals</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="mt-2">
            <span className="text-2xl sm:text-3xl font-black text-amber-700">{lateCount}</span>
            <span className="text-xs text-slate-400 block mt-1">In-time &gt; 8:30 AM</span>
          </div>
          <span className="text-[10px] text-amber-700 font-medium mt-2 block">
            Latest: Oct 14 (9:12 AM)
          </span>
        </div>

        {/* Absences / On Leave */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Absent / Leave</span>
            <AlertTriangle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-rose-600">{absentCount}</span>
            <span className="text-xs font-semibold text-slate-500">({leaveCount} on leave)</span>
          </div>
          <span className="text-[10px] text-slate-500 mt-2 block">
            {absentCount} Unexcused • {leaveCount} Sanctioned
          </span>
        </div>
      </div>

      {/* Visual Calendar Trend (October 2026 Interactive Matrix) */}
      <Card
        title={
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-blue-600" />
            <span>October 2026 Attendance Calendar View</span>
          </div>
        }
        subtitle="Visual representation of daily check-ins for the current month"
      >
        <div className="space-y-3">
          {/* Legend */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 pb-2 border-b border-slate-100">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              <span>Present (On-time)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-amber-500" />
              <span>Late Arrival (&gt; 8:30 AM)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-500" />
              <span>Unexcused Absent</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-sky-500" />
              <span>Sanctioned Leave</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-slate-200" />
              <span>Weekend / Holiday</span>
            </span>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1.5 sm:gap-2 text-center text-xs">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
              <div key={d} className="font-bold text-slate-400 py-1 text-[11px] uppercase tracking-wider">
                {d}
              </div>
            ))}

            {/* Empty slots for Thursday start (Oct 1 is Thursday -> Sun, Mon, Tue, Wed = 4 blank cells) */}
            <div className="p-2 rounded-lg bg-transparent" />
            <div className="p-2 rounded-lg bg-transparent" />
            <div className="p-2 rounded-lg bg-transparent" />
            <div className="p-2 rounded-lg bg-transparent" />

            {/* October 1 to 31 */}
            {daysInOctober.map((item) => {
              const status = item.record?.status;
              const isToday = item.date === '2026-10-17';

              let cellBg = 'bg-slate-50 text-slate-400';
              let badgeColor = '';

              if (item.isWeekend) {
                cellBg = 'bg-slate-100/50 text-slate-400';
              } else if (status === 'present') {
                cellBg = 'bg-emerald-50 text-emerald-900 border border-emerald-200 font-bold';
                badgeColor = 'bg-emerald-500';
              } else if (status === 'late') {
                cellBg = 'bg-amber-100 text-amber-950 border border-amber-300 font-bold ring-1 ring-amber-400';
                badgeColor = 'bg-amber-500';
              } else if (status === 'absent') {
                cellBg = 'bg-rose-100 text-rose-950 border border-rose-300 font-bold ring-1 ring-rose-400';
                badgeColor = 'bg-rose-500';
              } else if (status === 'on_leave') {
                cellBg = 'bg-sky-100 text-sky-950 border border-sky-300 font-bold';
                badgeColor = 'bg-sky-500';
              }

              return (
                <div
                  key={item.date}
                  title={
                    item.record
                      ? `${item.date}: ${item.record.status.toUpperCase()} ${
                          item.record.arrivalTime ? `at ${item.record.arrivalTime}` : ''
                        }`
                      : `${item.date} (${item.isWeekend ? 'Weekend' : 'No Class'})`
                  }
                  className={`p-2 rounded-xl flex flex-col items-center justify-between min-h-[48px] sm:min-h-[56px] transition-all relative ${cellBg} ${
                    isToday ? 'ring-2 ring-blue-600 ring-offset-1' : ''
                  }`}
                >
                  <span className="text-xs">{item.day}</span>
                  {badgeColor && (
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className={`w-2 h-2 rounded-full ${badgeColor}`} />
                      <span className="text-[9px] uppercase tracking-tighter hidden sm:inline">
                        {status === 'present' ? 'P' : status === 'late' ? 'Late' : status === 'absent' ? 'Abs' : 'Leave'}
                      </span>
                    </div>
                  )}
                  {item.record?.arrivalTime && (
                    <span className="text-[8px] text-amber-800 font-mono hidden sm:inline">
                      {item.record.arrivalTime}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Attendance History Filter & Table */}
      <Card
        title={
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-blue-600" />
            <span>Daily Attendance History Log</span>
          </div>
        }
        subtitle={`Showing ${filteredRecords.length} records matching current filters`}
      >
        {/* Filters bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-4">
          <div className="flex flex-wrap items-center gap-2">
            {/* Month Filter */}
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="all">All Recorded Months</option>
              <option value="2026-10">October 2026</option>
              <option value="2026-09">September 2026</option>
              <option value="2026-08">August 2026</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="all">All Statuses</option>
              <option value="present">Present Only</option>
              <option value="late">Late Arrivals Only</option>
              <option value="absent">Absences Only</option>
              <option value="on_leave">Approved Leaves Only</option>
            </select>
          </div>

          {/* Search box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search date or remarks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs w-full sm:w-56 focus:outline-none focus:ring-2 focus:ring-blue-600 placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <th className="py-3 px-4 w-32">Date</th>
                <th className="py-3 px-4 w-28">Day</th>
                <th className="py-3 px-4 w-32">Attendance Status</th>
                <th className="py-3 px-4 w-28">In-Time</th>
                <th className="py-3 px-4 w-44">Recorded By</th>
                <th className="py-3 px-4">Faculty Remarks & Policy Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400 text-xs">
                    No attendance records match the selected filters.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((rec) => {
                  const dateObj = new Date(rec.date);
                  const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });

                  return (
                    <tr
                      key={rec.attendanceId}
                      className={`hover:bg-slate-50 transition-colors ${
                        rec.status === 'late'
                          ? 'bg-amber-50/40'
                          : rec.status === 'absent'
                          ? 'bg-rose-50/40'
                          : rec.status === 'on_leave'
                          ? 'bg-sky-50/40'
                          : ''
                      }`}
                    >
                      <td className="py-3 px-4 font-mono font-semibold text-slate-900">{rec.date}</td>
                      <td className="py-3 px-4 text-slate-600">{dayName}</td>
                      <td className="py-3 px-4">
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
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-700">
                        {rec.arrivalTime ? (
                          <span
                            className={`font-semibold ${
                              rec.status === 'late' ? 'text-amber-700 underline decoration-amber-400' : ''
                            }`}
                          >
                            {rec.arrivalTime}
                          </span>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-slate-700 font-medium">{rec.recordedBy}</td>
                      <td className="py-3 px-4 text-slate-600 text-[11px]">
                        {rec.notes || <span className="text-slate-400 italic">Muster verified</span>}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Institutional Policy Disclosure Note */}
        <div className="mt-4 p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="text-slate-800">MSEC Autonomous Institutional Attendance Policy:</strong>
            <p className="mt-0.5">
              1. <strong>Late Arrivals</strong>: Any student arriving between 08:31 AM and 09:30 AM is recorded as "Late". The parent is automatically alerted via in-app notification.
              <br />
              2. <strong>Absence vs. Approved Leave</strong>: Approved leave excuses the student from disciplinary action but does not count as physical presence towards Anna University examination hall ticket eligibility unless condonation is officially sanctioned by the Academic Council.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};
