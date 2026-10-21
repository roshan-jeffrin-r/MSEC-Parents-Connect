import React, { useState } from 'react';
import { useAlertSystem } from '../../context/AlertSystemContext';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { AttendanceRecordStatus } from '../../types/attendanceAlert';
import {
  CalendarPlus,
  Clock,
  User,
  AlertTriangle,
  CheckCircle2,
  Phone
} from 'lucide-react';

interface ManualRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ManualRecordModal: React.FC<ManualRecordModalProps> = ({
  isOpen,
  onClose
}) => {
  const { students, guardians, addAttendanceRecord, settings } = useAlertSystem();

  const [studentId, setStudentId] = useState<string>(students[0]?.studentId || '');
  const [date, setDate] = useState<string>('2026-10-21');
  const [status, setStatus] = useState<AttendanceRecordStatus>('Absent');
  const [arrivalTime, setArrivalTime] = useState<string>('09:18 AM');
  const [notes, setNotes] = useState<string>('');
  const [successBanner, setSuccessBanner] = useState<string>('');

  const selectedStudent = students.find((s) => s.studentId === studentId);
  const selectedGuardian = selectedStudent
    ? guardians.find((g) => g.guardianId === selectedStudent.guardianId)
    : undefined;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId || !date) return;

    const outcome = addAttendanceRecord({
      studentId,
      date,
      status,
      arrivalTime: status === 'Present' || status === 'Late' ? arrivalTime : undefined,
      source: 'manual_entry',
      notes: notes || `Manual test record entered by staff.`
    });

    const alertMsg = outcome.jobGenerated
      ? `Attendance recorded. Alert job generated for ${selectedGuardian?.fullName || 'Guardian'}.`
      : 'Attendance recorded (no alert required).';

    setSuccessBanner(alertMsg);

    setTimeout(() => {
      setSuccessBanner('');
      onClose();
    }, 1200);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-700 text-white flex items-center justify-center font-bold text-xs shadow-2xs">
            <CalendarPlus className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Record / Simulate Attendance Entry</h3>
            <p className="text-[11px] text-slate-500 font-normal">
              Manually record student attendance and evaluate alert generation rules
            </p>
          </div>
        </div>
      }
      footer={
        <div className="w-full flex items-center justify-end gap-2 text-xs">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 border border-slate-200 text-slate-700 rounded-lg font-semibold hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-3.5 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded-lg font-bold shadow-2xs transition-colors"
          >
            Record &amp; Evaluate Alert
          </button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-3 text-xs">
        {successBanner && (
          <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successBanner}</span>
          </div>
        )}

        <div>
          <label htmlFor="manual-student" className="block font-bold text-slate-800 mb-1">
            Select Student <span className="text-rose-500">*</span>
          </label>
          <select
            id="manual-student"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-900 bg-white font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            {students.map((s) => (
              <option key={s.studentId} value={s.studentId}>
                {s.fullName} ({s.studentId}) — {s.className}
              </option>
            ))}
          </select>
        </div>

        {/* Selected Guardian Contact Preview */}
        {selectedStudent && selectedGuardian && (
          <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Associated Guardian</span>
              <Badge variant="primary" size="sm">{selectedGuardian.relationship}</Badge>
            </div>
            <strong className="text-slate-900 text-xs block">{selectedGuardian.fullName}</strong>
            <div className="flex items-center gap-3 text-[11px] text-slate-600">
              <span className="flex items-center gap-1 font-mono">
                <Phone className="w-3 h-3 text-blue-600" />
                {selectedGuardian.mobileNumber || 'No phone registered'}
              </span>
              <span>• WhatsApp: {selectedGuardian.hasWhatsApp ? 'Available' : 'Disabled'}</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label htmlFor="manual-date" className="block font-bold text-slate-800 mb-1">
              Attendance Date <span className="text-rose-500">*</span>
            </label>
            <input
              id="manual-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono"
            />
          </div>

          <div>
            <label htmlFor="manual-status" className="block font-bold text-slate-800 mb-1">
              Attendance Status <span className="text-rose-500">*</span>
            </label>
            <select
              id="manual-status"
              value={status}
              onChange={(e) => setStatus(e.target.value as AttendanceRecordStatus)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-900 bg-white font-bold focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="Absent">Absent (Triggers Absence Alert)</option>
              <option value="Late">Late Arrival (Triggers Late Alert)</option>
              <option value="Present">Present (No Alert Generated)</option>
            </select>
          </div>
        </div>

        {(status === 'Late' || status === 'Present') && (
          <div>
            <label htmlFor="manual-arrival" className="block font-bold text-slate-800 mb-1 flex items-center justify-between">
              <span>Recorded Arrival Time:</span>
              <span className="text-[10px] text-slate-400 font-normal">
                Threshold: {settings.expectedArrivalTime} + {settings.gracePeriodMinutes}m
              </span>
            </label>
            <div className="relative">
              <input
                id="manual-arrival"
                type="text"
                placeholder="e.g. 09:18 AM"
                value={arrivalTime}
                onChange={(e) => setArrivalTime(e.target.value)}
                className="w-full pl-8 pr-2.5 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono"
              />
              <Clock className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>
          </div>
        )}

        <div>
          <label htmlFor="manual-notes" className="block font-bold text-slate-800 mb-1">
            Reason / Notes (Optional)
          </label>
          <input
            id="manual-notes"
            type="text"
            placeholder="e.g. Delayed campus transit bus #14"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 placeholder:text-slate-400"
          />
        </div>

        {status !== 'Present' && (
          <div className="p-2.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-900 text-[11px] flex items-start gap-2">
            <AlertTriangle className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
            <span>
              Saving will create an alert job and render customized SMS &amp; WhatsApp messages ready for simulated delivery in the Notification Center.
            </span>
          </div>
        )}
      </form>
    </Modal>
  );
};
