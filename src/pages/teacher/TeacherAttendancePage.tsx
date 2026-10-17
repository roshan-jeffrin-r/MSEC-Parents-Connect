import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import type { AttendanceStatus } from '../../types';
import {
  CalendarCheck,
  Check,
  X,
  Clock,
  Save,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  HelpCircle
} from 'lucide-react';

export const TeacherAttendancePage: React.FC = () => {
  const { students, recordAttendanceForDate, currentTeacher } = useApp();

  const cseStudents = students.filter((s) => s.className === 'III Year CSE - B');

  const [date, setDate] = useState<string>('2026-10-17');
  const [session, setSession] = useState<string>('Morning Muster (08:30 AM)');

  // Attendance state for current session
  const [attendanceState, setAttendanceState] = useState<{
    [studentId: string]: { status: AttendanceStatus; arrivalTime?: string; notes?: string };
  }>(() => {
    const init: any = {};
    cseStudents.forEach((s) => {
      init[s.studentId] = {
        status: s.studentId === 'STU-001' ? 'present' : 'present',
        arrivalTime: '08:24 AM'
      };
    });
    return init;
  });

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [savedBanner, setSavedBanner] = useState(false);

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setAttendanceState((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status,
        arrivalTime: status === 'late' ? '09:12 AM' : status === 'present' ? '08:25 AM' : undefined,
        notes: status === 'late' ? 'Delayed transit' : status === 'absent' ? 'Absent at morning roll call' : undefined
      }
    }));
  };

  const handleMarkAllPresent = () => {
    const next: any = {};
    cseStudents.forEach((s) => {
      next[s.studentId] = { status: 'present', arrivalTime: '08:25 AM' };
    });
    setAttendanceState(next);
  };

  const handleConfirmSave = () => {
    const recordsToSave = Object.keys(attendanceState).map((studentId) => ({
      studentId,
      status: attendanceState[studentId].status,
      arrivalTime: attendanceState[studentId].arrivalTime,
      notes: attendanceState[studentId].notes
    }));

    recordAttendanceForDate(recordsToSave, date);
    setShowConfirmModal(false);
    setSavedBanner(true);
    setTimeout(() => setSavedBanner(false), 5000);
  };

  const presentCount = Object.values(attendanceState).filter((s) => s.status === 'present').length;
  const lateCount = Object.values(attendanceState).filter((s) => s.status === 'late').length;
  const absentCount = Object.values(attendanceState).filter((s) => s.status === 'absent').length;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Record Class Attendance
            </h1>
            <Badge variant="primary">III Year CSE - B</Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Faculty: <strong className="text-slate-800">{currentTeacher.fullName}</strong> • Class Advisor
          </p>
        </div>

        {/* Action button */}
        <button
          type="button"
          onClick={() => setShowConfirmModal(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold shadow-xs transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 self-start sm:self-auto"
        >
          <Save className="w-4 h-4" />
          <span>Save & Notify Parents</span>
        </button>
      </div>

      {/* Success Notification Banner */}
      {savedBanner && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-xs font-semibold flex items-center gap-2.5 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>
            Attendance successfully recorded for {date}! Automated notifications have been dispatched to parents of any absent or late students.
          </span>
        </div>
      )}

      {/* Control Strip & Metrics */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <label className="block text-[10px] font-semibold uppercase text-slate-400 mb-0.5">
              Attendance Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-medium text-slate-800 bg-white"
            />
          </div>

          <div>
            <label className="block text-[10px] font-semibold uppercase text-slate-400 mb-0.5">
              Session
            </label>
            <select
              value={session}
              onChange={(e) => setSession(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-medium text-slate-800 bg-white"
            >
              <option value="Morning Muster (08:30 AM)">Morning Muster (08:30 AM)</option>
              <option value="Afternoon Session (01:30 PM)">Afternoon Session (01:30 PM)</option>
            </select>
          </div>
        </div>

        {/* Counter Summary */}
        <div className="flex items-center gap-4 text-xs font-semibold">
          <span className="text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
            {presentCount} Present
          </span>
          <span className="text-amber-800 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
            {lateCount} Late
          </span>
          <span className="text-rose-700 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200">
            {absentCount} Absent
          </span>

          <button
            type="button"
            onClick={handleMarkAllPresent}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors"
          >
            Mark All Present
          </button>
        </div>
      </div>

      {/* Student Attendance Muster Table */}
      <Card
        title={
          <div className="flex items-center gap-2">
            <CalendarCheck className="w-4 h-4 text-emerald-600" />
            <span>Class Roll Call Muster — III Year CSE - B</span>
          </div>
        }
        subtitle="Click the buttons below to toggle student status. Test marking Aarav Kumar (CSE2026001) as Absent or Late to verify parent notification."
      >
        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <th className="py-3 px-3 w-12 text-center">S.No</th>
                <th className="py-3 px-4 w-32">Register No</th>
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4 w-56 text-center">Mark Attendance Status</th>
                <th className="py-3 px-4 w-32">Arrival Time</th>
                <th className="py-3 px-4">Notes / Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {cseStudents.map((s, idx) => {
                const currentStatus = attendanceState[s.studentId]?.status || 'present';
                const arrivalTime = attendanceState[s.studentId]?.arrivalTime || '';
                const notes = attendanceState[s.studentId]?.notes || '';

                const isAarav = s.studentId === 'STU-001';

                return (
                  <tr
                    key={s.studentId}
                    className={`hover:bg-slate-50 transition-colors ${
                      isAarav ? 'bg-blue-50/40 ring-1 ring-blue-200' : ''
                    }`}
                  >
                    <td className="py-3 px-3 text-center text-slate-400 font-medium">{idx + 1}</td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">{s.registerNumber}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={s.profileImage}
                          alt={s.fullName}
                          className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200"
                        />
                        <div>
                          <strong className="text-slate-900">{s.fullName}</strong>
                          {isAarav && (
                            <span className="ml-2 text-[10px] bg-blue-100 text-blue-800 font-bold px-1.5 py-0.5 rounded">
                              Demo Student
                            </span>
                          )}
                          <span className="text-[11px] text-slate-500 block">{s.hostelDayScholar}</span>
                        </div>
                      </div>
                    </td>

                    {/* Status Pill Toggle Buttons */}
                    <td className="py-3 px-4 text-center">
                      <div className="inline-flex items-center p-1 rounded-lg bg-slate-100 border border-slate-200 gap-1">
                        <button
                          type="button"
                          onClick={() => handleStatusChange(s.studentId, 'present')}
                          className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                            currentStatus === 'present'
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          Present
                        </button>
                        <button
                          type="button"
                          onClick={() => handleStatusChange(s.studentId, 'late')}
                          className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                            currentStatus === 'late'
                              ? 'bg-amber-500 text-slate-950 shadow-xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          Late
                        </button>
                        <button
                          type="button"
                          onClick={() => handleStatusChange(s.studentId, 'absent')}
                          className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                            currentStatus === 'absent'
                              ? 'bg-rose-600 text-white shadow-xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          Absent
                        </button>
                      </div>
                    </td>

                    {/* Arrival time */}
                    <td className="py-3 px-4">
                      {currentStatus === 'late' ? (
                        <input
                          type="text"
                          value={arrivalTime}
                          placeholder="e.g. 09:12 AM"
                          onChange={(e) =>
                            setAttendanceState((prev) => ({
                              ...prev,
                              [s.studentId]: { ...prev[s.studentId], arrivalTime: e.target.value }
                            }))
                          }
                          className="px-2 py-1 rounded border border-amber-300 bg-amber-50 text-xs font-mono w-24"
                        />
                      ) : currentStatus === 'present' ? (
                        <span className="font-mono text-slate-600 text-xs">{arrivalTime || '08:24 AM'}</span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>

                    {/* Notes */}
                    <td className="py-3 px-4">
                      <input
                        type="text"
                        value={notes}
                        placeholder={currentStatus === 'absent' ? 'Reason for absence...' : 'Optional remark...'}
                        onChange={(e) =>
                          setAttendanceState((prev) => ({
                            ...prev,
                            [s.studentId]: { ...prev[s.studentId], notes: e.target.value }
                          }))
                        }
                        className="w-full px-2 py-1 rounded border border-slate-200 text-xs text-slate-700 bg-white placeholder:text-slate-400"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Confirmation Modal */}
      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title="Confirm Attendance Submission"
        footer={
          <div className="w-full flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowConfirmModal(false)}
              className="px-3 py-1.5 border border-slate-200 text-slate-700 rounded-lg text-xs font-medium hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmSave}
              className="px-4 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-bold shadow-xs"
            >
              Confirm & Dispatch Alerts
            </button>
          </div>
        }
      >
        <div className="space-y-3 text-xs text-slate-700 leading-relaxed">
          <p>
            You are recording attendance for <strong>III Year CSE - B</strong> for date <strong>{date}</strong> ({session}).
          </p>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <div>Present: <strong className="text-emerald-700">{presentCount}</strong> students</div>
            <div>Late: <strong className="text-amber-800">{lateCount}</strong> students</div>
            <div>Absent: <strong className="text-rose-700">{absentCount}</strong> students</div>
          </div>

          <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-900">
            <AlertTriangle className="w-4 h-4 text-blue-600 inline mr-1.5 -mt-0.5" />
            Any students marked <strong>Absent</strong> or <strong>Late</strong> will immediately generate simulated notifications for their parents.
          </div>
        </div>
      </Modal>
    </div>
  );
};
