import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp, matchesAssignedClass } from '../../context/AppContext';
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
  ShieldCheck,
  Calendar,
  Send
} from 'lucide-react';

export const TeacherAttendancePage: React.FC = () => {
  const { students, recordAttendanceForDate, currentStaff } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentStaff) {
      navigate('/teacher/login');
    }
  }, [currentStaff, navigate]);

  const scopedStudents = students.filter((s) =>
    currentStaff ? matchesAssignedClass(s.className, currentStaff.assignedClass) : false
  );

  const availableClasses = Array.from(new Set(scopedStudents.map((s) => s.className)));
  const [selectedClass, setSelectedClass] = useState<string>('');

  useEffect(() => {
    if (availableClasses.length > 0 && (!selectedClass || !availableClasses.includes(selectedClass))) {
      setSelectedClass(availableClasses[0]);
    }
  }, [availableClasses, selectedClass]);

  const effectiveClass = selectedClass || availableClasses[0] || (currentStaff ? currentStaff.assignedClass : 'CSE-B');
  const classStudents = scopedStudents.filter((s) => s.className === effectiveClass);

  const [date, setDate] = useState<string>('2026-10-17');
  const [session, setSession] = useState<string>('Morning Muster (08:30 AM)');

  // Attendance state for current session
  const [attendanceState, setAttendanceState] = useState<{
    [studentId: string]: { status: AttendanceStatus; arrivalTime?: string; notes?: string };
  }>({});

  // Initialize attendance state when classStudents change
  useEffect(() => {
    const init: any = {};
    classStudents.forEach((s) => {
      init[s.studentId] = {
        status: 'present',
        arrivalTime: '08:24 AM'
      };
    });
    setAttendanceState(init);
  }, [effectiveClass, students.length]);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [savedBanner, setSavedBanner] = useState(false);

  if (!currentStaff) return null;

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
    classStudents.forEach((s) => {
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
    <div className="space-y-4">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Record Class Attendance
            </h1>
            <Badge variant="primary">{effectiveClass}</Badge>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/80 px-2 py-0.5 rounded-md">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              Scope: {currentStaff.assignedClass}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Faculty: <strong className="text-slate-800">{currentStaff.fullName}</strong> • {currentStaff.designation}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowConfirmModal(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-bold shadow-2xs transition-colors self-start sm:self-auto"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Save &amp; Notify Parents</span>
        </button>
      </div>

      {/* Success Notification Banner */}
      {savedBanner && (
        <div className="p-3 bg-emerald-50 border border-emerald-200/80 rounded-xl text-emerald-950 text-xs font-semibold flex items-center gap-2.5 animate-in fade-in shadow-2xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            Attendance successfully recorded for {date}! Automated notifications have been dispatched to parents of absent and late students.
          </span>
        </div>
      )}

      {/* Control Strip & Metrics */}
      <div className="bg-white p-3 rounded-xl border border-slate-200/90 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
          {availableClasses.length > 1 && (
            <div>
              <label htmlFor="muster-section" className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">
                Section
              </label>
              <select
                id="muster-section"
                value={effectiveClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="px-2.5 py-1 rounded-lg border border-slate-300 text-xs font-bold text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                {availableClasses.map((cls) => (
                  <option key={cls} value={cls}>
                    {cls}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label htmlFor="muster-date" className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">
              Attendance Date
            </label>
            <input
              id="muster-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="px-2.5 py-1 rounded-lg border border-slate-300 text-xs font-medium text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label htmlFor="muster-session" className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">
              Muster Session
            </label>
            <select
              id="muster-session"
              value={session}
              onChange={(e) => setSession(e.target.value)}
              className="px-2.5 py-1 rounded-lg border border-slate-300 text-xs font-medium text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="Morning Muster (08:30 AM)">Morning Muster (08:30 AM)</option>
              <option value="Afternoon Session (01:30 PM)">Afternoon Session (01:30 PM)</option>
            </select>
          </div>
        </div>

        {/* Counter Summary & Quick Fill */}
        <div className="flex items-center gap-2 text-xs font-bold flex-wrap">
          <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60 font-mono">
            {presentCount} Present
          </span>
          <span className="text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60 font-mono">
            {lateCount} Late
          </span>
          <span className="text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200/60 font-mono">
            {absentCount} Absent
          </span>

          <button
            type="button"
            onClick={handleMarkAllPresent}
            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-xs font-bold transition-colors ml-1"
          >
            Mark All Present
          </button>
        </div>
      </div>

      {/* Student Attendance Muster Table */}
      <Card
        density="compact"
        noPadding
        title={
          <div className="flex items-center gap-2">
            <CalendarCheck className="w-4 h-4 text-emerald-600" />
            <span>Class Roll Call Muster — {effectiveClass}</span>
          </div>
        }
        subtitle="Toggle Present, Late, or Absent status for each student. Marking Late or Absent triggers simulated parent notifications."
      >
        <div
          className="table-wrapper"
          tabIndex={0}
          role="region"
          aria-label="Class roll call muster table"
        >
          <table className="compact-table w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                <th className="w-12 text-center">S.No</th>
                <th className="w-32">Register No</th>
                <th>Student Name</th>
                <th className="w-60 text-center">Mark Status</th>
                <th className="w-32">Arrival Time</th>
                <th>Notes / Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {classStudents.map((s, idx) => {
                const currentStatus = attendanceState[s.studentId]?.status || 'present';
                const arrivalTime = attendanceState[s.studentId]?.arrivalTime || '';
                const notes = attendanceState[s.studentId]?.notes || '';
                const isAarav = s.studentId === 'STU-001';

                return (
                  <tr
                    key={s.studentId}
                    className={`hover:bg-slate-50/70 transition-colors ${
                      isAarav ? 'bg-blue-50/30 ring-1 ring-blue-100' : ''
                    }`}
                  >
                    <td className="text-center text-slate-400 font-mono text-[11px]">{idx + 1}</td>
                    <td className="font-mono font-bold text-slate-900">{s.registerNumber}</td>
                    <td>
                      <div className="flex items-center gap-2 py-0.5">
                        <img
                          src={s.profileImage}
                          alt={s.fullName}
                          className="w-6 h-6 rounded-full object-cover ring-1 ring-slate-200"
                        />
                        <div>
                          <strong className="text-slate-900 block font-semibold">{s.fullName}</strong>
                          {isAarav && (
                            <span className="text-[9px] bg-blue-100 text-blue-800 font-bold px-1.5 py-0.2 rounded">
                              Demo Student
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Status Pill Toggle Buttons */}
                    <td className="text-center">
                      <div className="inline-flex items-center p-0.5 rounded-lg bg-slate-100 border border-slate-200 gap-1">
                        <button
                          type="button"
                          onClick={() => handleStatusChange(s.studentId, 'present')}
                          className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold transition-all ${
                            currentStatus === 'present'
                              ? 'bg-emerald-600 text-white shadow-2xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          Present
                        </button>
                        <button
                          type="button"
                          onClick={() => handleStatusChange(s.studentId, 'late')}
                          className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold transition-all ${
                            currentStatus === 'late'
                              ? 'bg-amber-500 text-slate-950 shadow-2xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          Late
                        </button>
                        <button
                          type="button"
                          onClick={() => handleStatusChange(s.studentId, 'absent')}
                          className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold transition-all ${
                            currentStatus === 'absent'
                              ? 'bg-rose-600 text-white shadow-2xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          Absent
                        </button>
                      </div>
                    </td>

                    {/* Arrival time */}
                    <td>
                      {currentStatus === 'late' ? (
                        <input
                          type="text"
                          value={arrivalTime}
                          placeholder="09:12 AM"
                          onChange={(e) =>
                            setAttendanceState((prev) => ({
                              ...prev,
                              [s.studentId]: { ...prev[s.studentId], arrivalTime: e.target.value }
                            }))
                          }
                          className="px-2 py-0.5 rounded border border-amber-300 bg-amber-50 text-xs font-mono w-24 focus:outline-none focus:ring-1 focus:ring-amber-500"
                        />
                      ) : currentStatus === 'present' ? (
                        <span className="font-mono text-slate-600 text-[11px]">{arrivalTime || '08:24 AM'}</span>
                      ) : (
                        <span className="text-slate-400 font-mono text-[11px]">—</span>
                      )}
                    </td>

                    {/* Notes */}
                    <td>
                      <input
                        type="text"
                        value={notes}
                        placeholder={currentStatus === 'absent' ? 'Reason for absence...' : 'Optional note...'}
                        onChange={(e) =>
                          setAttendanceState((prev) => ({
                            ...prev,
                            [s.studentId]: { ...prev[s.studentId], notes: e.target.value }
                          }))
                        }
                        className="w-full px-2 py-0.5 rounded border border-slate-200 text-xs text-slate-700 bg-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-600"
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
              className="px-3 py-1.5 border border-slate-200 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmSave}
              className="px-3.5 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-bold shadow-2xs flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Confirm &amp; Dispatch Alerts</span>
            </button>
          </div>
        }
      >
        <div className="space-y-3 text-xs text-slate-700 leading-relaxed">
          <p>
            You are recording muster for <strong>{effectiveClass}</strong> on <strong>{date}</strong> ({session}).
          </p>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1 font-mono text-xs">
            <div>Present: <strong className="text-emerald-700 font-bold">{presentCount}</strong> students</div>
            <div>Late: <strong className="text-amber-800 font-bold">{lateCount}</strong> students</div>
            <div>Absent: <strong className="text-rose-700 font-bold">{absentCount}</strong> students</div>
          </div>

          <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 text-xs flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <span>
              Automated in-app push alerts will be immediately dispatched to parents of students marked <strong>Absent</strong> or <strong>Late</strong>.
            </span>
          </div>
        </div>
      </Modal>
    </div>
  );
};
