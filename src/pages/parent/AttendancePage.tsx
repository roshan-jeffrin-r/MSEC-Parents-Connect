import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
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
  Sparkles,
  RotateCcw
} from 'lucide-react';

export const AttendancePage: React.FC = () => {
  const { currentStudent, attendance } = useApp();

  // Filter attendance for the current student
  const studentRecords = useMemo(
    () => attendance.filter((a) => a.studentId === currentStudent.studentId),
    [attendance, currentStudent.studentId]
  );

  const [selectedMonth, setSelectedMonth] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<string | null>(null);

  // Metrics computation
  const totalWorkingDays = studentRecords.length;
  const presentCount = studentRecords.filter((a) => a.status === 'present').length;
  const absentCount = studentRecords.filter((a) => a.status === 'absent').length;
  const lateCount = studentRecords.filter((a) => a.status === 'late').length;
  const leaveCount = studentRecords.filter((a) => a.status === 'on_leave').length;

  // Institutional policy: Present + Late are counted as attended. Approved leave is excused but not counted as physical presence.
  const overallPercentage =
    totalWorkingDays > 0
      ? Number((((presentCount + lateCount) / totalWorkingDays) * 100).toFixed(1))
      : 88.5;

  // Filtered records
  const filteredRecords = useMemo(() => {
    return studentRecords.filter((rec) => {
      if (selectedCalendarDate && rec.date !== selectedCalendarDate) {
        return false;
      }
      if (selectedMonth !== 'all' && !rec.date.startsWith(selectedMonth)) {
        return false;
      }
      if (statusFilter !== 'all' && rec.status !== statusFilter) {
        return false;
      }
      if (searchTerm) {
        const query = searchTerm.toLowerCase();
        const matchesDate = rec.date.toLowerCase().includes(query);
        const matchesNotes = rec.notes?.toLowerCase().includes(query);
        const matchesRecorded = rec.recordedBy.toLowerCase().includes(query);
        return matchesDate || matchesNotes || matchesRecorded;
      }
      return true;
    });
  }, [studentRecords, selectedCalendarDate, selectedMonth, statusFilter, searchTerm]);

  // Days of October 2026: October 1 is Thursday, 31 days total
  const daysInOctober = Array.from({ length: 31 }, (_, i) => {
    const dayNum = i + 1;
    const dateStr = `2026-10-${String(dayNum).padStart(2, '0')}`;
    const record = studentRecords.find((r) => r.date === dateStr);
    const dateObj = new Date(dateStr);
    const dayOfWeek = dateObj.getDay();
    return {
      date: dateStr,
      day: dayNum,
      isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
      record
    };
  });

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              Attendance Management
            </h1>
            <Badge variant="success" dot>Anna University Compliant</Badge>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Daily roll call muster and attendance analytics for <strong className="text-slate-800">{currentStudent.fullName}</strong> ({currentStudent.className})
          </p>
        </div>

        {/* Safe Zone Alert Tag */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 font-semibold shadow-2xs self-start sm:self-auto">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Eligible for Anna University Exam (&ge; 75% required)</span>
        </div>
      </div>

      {/* Primary Attendance KPI Metric Cards (Compact 5-Grid) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3">
        {/* Overall Percentage */}
        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs border-t-2 border-t-emerald-600 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-[11px] font-semibold uppercase tracking-wider">
            <span>Overall %</span>
            <CalendarCheck className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div className="mt-1.5">
            <span className="text-xl sm:text-2xl font-black text-slate-900 font-mono tracking-tight">{overallPercentage}%</span>
            <div className="w-full bg-slate-100 rounded-full h-1.5 mt-1.5 overflow-hidden">
              <div
                className={`h-1.5 rounded-full ${overallPercentage >= 75 ? 'bg-emerald-500' : 'bg-rose-500'}`}
                style={{ width: `${Math.min(overallPercentage, 100)}%` }}
              />
            </div>
          </div>
          <span className="text-[10px] text-emerald-700 font-bold mt-1.5 block">
            +{(overallPercentage - 75).toFixed(1)}% above cutoff
          </span>
        </div>

        {/* Working Days */}
        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs border-t-2 border-t-blue-600 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-[11px] font-semibold uppercase tracking-wider">
            <span>Working Days</span>
            <CalendarIcon className="w-3.5 h-3.5 text-blue-600" />
          </div>
          <div className="mt-1.5">
            <span className="text-xl sm:text-2xl font-black text-slate-900 font-mono tracking-tight">{totalWorkingDays}</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Conducted so far</span>
          </div>
          <span className="text-[10px] text-slate-500 mt-1.5 block font-medium">Odd Semester 2026</span>
        </div>

        {/* Days Present */}
        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs border-t-2 border-t-emerald-500 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-[11px] font-semibold uppercase tracking-wider">
            <span>On-Time Present</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div className="mt-1.5">
            <span className="text-xl sm:text-2xl font-black text-emerald-700 font-mono tracking-tight">{presentCount}</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Regular muster</span>
          </div>
          <span className="text-[10px] text-emerald-600 font-bold mt-1.5 block">
            {((presentCount / totalWorkingDays) * 100).toFixed(1)}% on-time
          </span>
        </div>

        {/* Late Arrivals */}
        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs border-t-2 border-t-amber-500 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-[11px] font-semibold uppercase tracking-wider">
            <span>Late Arrivals</span>
            <Clock className="w-3.5 h-3.5 text-amber-600" />
          </div>
          <div className="mt-1.5">
            <span className="text-xl sm:text-2xl font-black text-amber-700 font-mono tracking-tight">{lateCount}</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">In-time &gt; 8:30 AM</span>
          </div>
          <span className="text-[10px] text-amber-800 font-semibold mt-1.5 block">
            Counted in attendance
          </span>
        </div>

        {/* Absences / On Leave */}
        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs border-t-2 border-t-rose-500 flex flex-col justify-between col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-slate-500 text-[11px] font-semibold uppercase tracking-wider">
            <span>Absent & Leave</span>
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
          </div>
          <div className="mt-1.5 flex items-baseline gap-1.5">
            <span className="text-xl sm:text-2xl font-black text-rose-600 font-mono tracking-tight">{absentCount}</span>
            <span className="text-[10px] font-semibold text-slate-500 font-mono">({leaveCount} on leave)</span>
          </div>
          <span className="text-[10px] text-slate-500 mt-1.5 block">
            {absentCount} Unexcused • {leaveCount} Approved
          </span>
        </div>
      </div>

      {/* Visual Calendar Trend (October 2026 Interactive Matrix) */}
      <Card
        title={
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-blue-600" />
            <span>October 2026 Interactive Attendance Calendar</span>
          </div>
        }
        subtitle="Click any date cell to filter the daily muster table below"
        action={
          selectedCalendarDate && (
            <button
              type="button"
              onClick={() => setSelectedCalendarDate(null)}
              className="text-xs text-blue-700 hover:text-blue-800 font-bold flex items-center gap-1 bg-blue-50 px-2 py-0.5 rounded border border-blue-200"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Clear Date ({selectedCalendarDate})</span>
            </button>
          )
        }
      >
        <div className="space-y-2.5">
          {/* Legend */}
          <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-600 pb-2 border-b border-slate-100">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>Present</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span>Late Arrival (&gt; 8:30 AM)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span>Unexcused Absent</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
              <span>Sanctioned Leave</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-200" />
              <span>Weekend / Holiday</span>
            </span>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 sm:gap-1.5 text-center text-xs">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
              <div key={d} className="font-bold text-slate-400 py-0.5 text-[10px] uppercase tracking-wider">
                {d}
              </div>
            ))}

            {/* Empty slots for Thursday start (Oct 1 is Thursday -> Sun, Mon, Tue, Wed = 4 blank cells) */}
            <div className="p-1 rounded-lg bg-transparent" />
            <div className="p-1 rounded-lg bg-transparent" />
            <div className="p-1 rounded-lg bg-transparent" />
            <div className="p-1 rounded-lg bg-transparent" />

            {/* October 1 to 31 */}
            {daysInOctober.map((item) => {
              const status = item.record?.status;
              const isSelected = selectedCalendarDate === item.date;

              let cellBg = 'bg-slate-50 text-slate-400 hover:bg-slate-100';
              let badgeColor = '';

              if (item.isWeekend) {
                cellBg = 'bg-slate-100/60 text-slate-400 cursor-default';
              } else if (status === 'present') {
                cellBg = 'bg-emerald-50 text-emerald-900 border border-emerald-200 font-bold hover:bg-emerald-100 cursor-pointer';
                badgeColor = 'bg-emerald-500';
              } else if (status === 'late') {
                cellBg = 'bg-amber-100 text-amber-950 border border-amber-300 font-bold ring-1 ring-amber-400 hover:bg-amber-200 cursor-pointer';
                badgeColor = 'bg-amber-500';
              } else if (status === 'absent') {
                cellBg = 'bg-rose-100 text-rose-950 border border-rose-300 font-bold ring-1 ring-rose-400 hover:bg-rose-200 cursor-pointer';
                badgeColor = 'bg-rose-500';
              } else if (status === 'on_leave') {
                cellBg = 'bg-sky-100 text-sky-950 border border-sky-300 font-bold hover:bg-sky-200 cursor-pointer';
                badgeColor = 'bg-sky-500';
              }

              return (
                <button
                  type="button"
                  key={item.date}
                  onClick={() => {
                    if (item.record) {
                      setSelectedCalendarDate(isSelected ? null : item.date);
                    }
                  }}
                  title={
                    item.record
                      ? `${item.date}: ${item.record.status.toUpperCase()} ${
                          item.record.arrivalTime ? `at ${item.record.arrivalTime}` : ''
                        }`
                      : `${item.date} (${item.isWeekend ? 'Weekend' : 'No Class'})`
                  }
                  className={`p-1.5 rounded-lg flex flex-col items-center justify-between min-h-[42px] sm:min-h-[48px] transition-all relative ${cellBg} ${
                    isSelected ? 'ring-2 ring-blue-700 ring-offset-1 shadow-xs' : ''
                  }`}
                >
                  <span className="text-[11px] font-mono leading-none">{item.day}</span>
                  {badgeColor && (
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${badgeColor}`} />
                      <span className="text-[9px] uppercase tracking-tighter hidden sm:inline font-bold">
                        {status === 'present' ? 'P' : status === 'late' ? 'Late' : status === 'absent' ? 'Abs' : 'Leave'}
                      </span>
                    </div>
                  )}
                  {item.record?.arrivalTime && (
                    <span className="text-[8px] text-amber-800 font-mono hidden sm:inline">
                      {item.record.arrivalTime}
                    </span>
                  )}
                </button>
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
        subtitle={`Showing ${filteredRecords.length} records matching current filter criteria`}
        noPadding
      >
        {/* Filters bar */}
        <div className="p-3 border-b border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 bg-slate-50/50">
          <div className="flex flex-wrap items-center gap-2">
            {/* Month Filter */}
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="all">All Months</option>
              <option value="2026-10">October 2026</option>
              <option value="2026-09">September 2026</option>
              <option value="2026-08">August 2026</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="all">All Statuses</option>
              <option value="present">Present Only</option>
              <option value="late">Late Arrivals Only</option>
              <option value="absent">Absences Only</option>
              <option value="on_leave">Approved Leaves Only</option>
            </select>

            {selectedCalendarDate && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-800 bg-blue-100 px-2 py-0.5 rounded">
                Date: {selectedCalendarDate}
              </span>
            )}
          </div>

          {/* Search box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
            <input
              type="text"
              placeholder="Search date or remarks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-7 pr-2.5 py-1 rounded-lg border border-slate-200 bg-white text-xs w-full sm:w-52 focus:outline-none focus:ring-2 focus:ring-blue-600 placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Table using responsive-table guidance */}
        <div className="table-wrapper">
          <table
            role="region"
            aria-label="Daily attendance records"
            tabIndex={0}
            className="compact-table"
          >
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <th className="w-28 text-left">Date</th>
                <th className="w-24 text-left">Day</th>
                <th className="w-28 text-center">Status</th>
                <th className="w-24 text-center">In-Time</th>
                <th className="w-40 text-left">Recorded By</th>
                <th className="text-left">Faculty Remarks & Policy Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400 text-xs">
                    No attendance records match the selected filter criteria.
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
                      <td className="font-mono font-bold text-slate-900">{rec.date}</td>
                      <td className="text-slate-600">{dayName}</td>
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
                            ? 'Late Arrival'
                            : rec.status === 'on_leave'
                            ? 'Approved Leave'
                            : 'Absent'}
                        </Badge>
                      </td>
                      <td className="font-mono text-center text-slate-700">
                        {rec.arrivalTime ? (
                          <span
                            className={`font-bold ${
                              rec.status === 'late' ? 'text-amber-800 bg-amber-50 px-1 py-0.2 rounded border border-amber-200' : ''
                            }`}
                          >
                            {rec.arrivalTime}
                          </span>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                      <td className="text-slate-700 font-medium">{rec.recordedBy}</td>
                      <td className="text-slate-600 text-[11px]">
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
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-600 flex items-start gap-2">
          <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <div className="leading-relaxed text-[11px]">
            <strong className="text-slate-800">MSEC Autonomous Institutional Attendance Policy:</strong>
            <p className="mt-0.5 text-slate-600">
              Late arrivals (08:31 AM – 09:30 AM) generate real-time parent alerts. Approved leaves excuse students from disciplinary action but do not count as physical attendance towards Anna University examination hall ticket eligibility (&ge; 75%).
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};
