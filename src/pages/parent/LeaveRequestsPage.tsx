import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { LeaveType } from '../../types';
import {
  Send,
  Calendar,
  CheckCircle2,
  Clock,
  XCircle,
  FileText,
  AlertCircle,
  Upload,
  Info,
  Check,
  ChevronDown
} from 'lucide-react';

export const LeaveRequestsPage: React.FC = () => {
  const {
    currentStudent,
    students,
    leaveRequests,
    submitLeaveRequest,
    cancelLeaveRequest
  } = useApp();

  const [studentId, setStudentId] = useState<string>(currentStudent.studentId);
  const [leaveType, setLeaveType] = useState<LeaveType>('Medical');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [reason, setReason] = useState<string>('');
  const [documentName, setDocumentName] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Form submission with modern-web-guidance
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    if (!form.checkValidity()) {
      // Modern-web-guidance: sync aria-invalid on attempted submit
      const inputs = form.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>('input, select, textarea');
      inputs.forEach((input) => {
        if (!input.checkValidity()) {
          input.setAttribute('aria-invalid', 'true');
        }
      });
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const res = submitLeaveRequest({
        studentId,
        startDate,
        endDate,
        leaveType,
        reason,
        documentName: documentName || undefined
      });

      setSuccessMessage(res.message);
      setIsSubmitting(false);

      // Reset form fields
      setStartDate('');
      setEndDate('');
      setReason('');
      setDocumentName('');

      // Auto clear success message after 6 seconds
      setTimeout(() => setSuccessMessage(''), 6000);
    }, 400);
  };

  // Sync aria-invalid on blur adhering to modern-web-guidance
  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const el = e.target;
    if (el.checkValidity) {
      if (!el.checkValidity()) {
        el.setAttribute('aria-invalid', 'true');
      } else {
        el.removeAttribute('aria-invalid');
      }
    }
  };

  const handleInput = (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const el = e.target as HTMLInputElement;
    if (el.checkValidity && el.checkValidity()) {
      el.removeAttribute('aria-invalid');
    }
  };

  // Filter requests for the parent view
  const myRequests = leaveRequests.filter((r) => r.studentId === currentStudent.studentId || r.studentId === studentId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Leave Request Management
            </h1>
            <Badge variant="primary">Official Sanction Workflow</Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Submit formal leave applications for faculty mentor review and track status updates
          </p>
        </div>
      </div>

      {/* Success Notification Banner */}
      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 flex items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-2.5 text-xs font-semibold">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setSuccessMessage('')}
            className="text-xs text-emerald-700 hover:text-emerald-900 font-bold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Grid: Leave Request Form & Quick Policy Guidance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Form */}
        <div className="lg:col-span-2">
          <Card
            title={
              <div className="flex items-center gap-2">
                <Send className="w-4 h-4 text-blue-600" />
                <span>Submit New Leave Application</span>
              </div>
            }
            subtitle="Applications are routed directly to the student's assigned Class Advisor"
          >
            <form onSubmit={handleSubmit} className="space-y-4" noValidate={false}>
              {/* Student Selection */}
              <div>
                <label htmlFor="student-select" className="block text-xs font-semibold text-slate-800 mb-1">
                  Student Name <span className="text-rose-500">*</span>
                </label>
                <select
                  id="student-select"
                  required
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  onBlur={handleBlur}
                  onInput={handleInput}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  {students.slice(0, 2).map((s) => (
                    <option key={s.studentId} value={s.studentId}>
                      {s.fullName} ({s.registerNumber}) — {s.className}
                    </option>
                  ))}
                </select>
              </div>

              {/* Leave Type & Duration Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label htmlFor="leave-type" className="block text-xs font-semibold text-slate-800 mb-1">
                    Leave Type <span className="text-rose-500">*</span>
                  </label>
                  <select
                    id="leave-type"
                    required
                    value={leaveType}
                    onChange={(e) => setLeaveType(e.target.value as LeaveType)}
                    onBlur={handleBlur}
                    onInput={handleInput}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="Medical">Medical Leave</option>
                    <option value="Personal">Personal / Family</option>
                    <option value="Family Emergency">Family Emergency</option>
                    <option value="Other">Other Duty / Event</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="start-date" className="block text-xs font-semibold text-slate-800 mb-1">
                    Start Date <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    id="start-date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    onBlur={handleBlur}
                    onInput={handleInput}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label htmlFor="end-date" className="block text-xs font-semibold text-slate-800 mb-1">
                    End Date <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    id="end-date"
                    required
                    min={startDate}
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    onBlur={handleBlur}
                    onInput={handleInput}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              {/* Reason for Leave */}
              <div>
                <label htmlFor="reason" className="block text-xs font-semibold text-slate-800 mb-1">
                  Reason for Absence <span className="text-rose-500">*</span>
                </label>
                <textarea
                  id="reason"
                  required
                  rows={3}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  onBlur={handleBlur}
                  onInput={handleInput}
                  placeholder="Provide specific details regarding the reason for leave..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 placeholder:text-slate-400"
                />
              </div>

              {/* Supporting Document Attachment (Optional) */}
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Supporting Document (e.g. Doctor's Note / Medical Certificate)
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      const mockFiles = [
                        'Medical_Prescription_Cert_Oct2026.pdf',
                        'Specialist_Consultation_Slip.pdf',
                        'Hospital_Discharge_Summary.pdf'
                      ];
                      const selected = mockFiles[Math.floor(Math.random() * mockFiles.length)];
                      setDocumentName(selected);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5 text-slate-500" />
                    <span>Attach Sample Document</span>
                  </button>

                  {documentName && (
                    <div className="flex items-center gap-1.5 text-xs text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
                      <FileText className="w-3.5 h-3.5" />
                      <span className="font-medium truncate max-w-[200px]">{documentName}</span>
                      <button
                        type="button"
                        onClick={() => setDocumentName('')}
                        className="text-slate-400 hover:text-slate-600 font-bold ml-1"
                      >
                        ×
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  Submission will notify the class advisor immediately.
                </span>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-1"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Submitting...' : 'Submit Leave Request'}</span>
                </button>
              </div>
            </form>
          </Card>
        </div>

        {/* Right 1 Col: Policy Guidance */}
        <div>
          <Card
            title={
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-amber-600" />
                <span>Approval Rules</span>
              </div>
            }
          >
            <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
              <div className="p-3 bg-blue-50/70 border border-blue-200/60 rounded-xl">
                <strong className="text-blue-900 block font-semibold mb-1">Notice on Attendance Impact</strong>
                Submitting a leave request does <strong>not</strong> automatically mark the student as present or on-leave. Official leave is reflected in the attendance ledger only after the Class Advisor issues formal sanction.
              </div>

              <div>
                <strong className="text-slate-900 block font-medium">Medical Absences (&gt; 2 Days)</strong>
                A valid medical certificate issued by a registered medical practitioner (RMP) must be produced within 3 working days of resumption.
              </div>

              <div>
                <strong className="text-slate-900 block font-medium">Examination Conflicts</strong>
                Leave during internal assessment or model examinations requires prior written sanction from the Head of Department.
              </div>

              <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                Class Advisor: <strong className="text-slate-700">Dr. K. Senthil Kumar</strong> (CSE Dept)
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Leave Request History Table */}
      <Card
        title={
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-700" />
            <span>Leave Application History & Status</span>
          </div>
        }
        subtitle="All historical and pending leave submissions for your children"
      >
        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <th className="py-3 px-4 w-28">Request ID</th>
                <th className="py-3 px-4 w-32">Student</th>
                <th className="py-3 px-4 w-40">Leave Dates</th>
                <th className="py-3 px-4 w-32">Type</th>
                <th className="py-3 px-4">Reason & Attachment</th>
                <th className="py-3 px-4 w-28 text-center">Status</th>
                <th className="py-3 px-4 w-52">Reviewer Remarks</th>
                <th className="py-3 px-3 w-20 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {myRequests.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400 text-xs">
                    No leave requests on record.
                  </td>
                </tr>
              ) : (
                myRequests.map((req) => (
                  <tr key={req.requestId} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">{req.requestId}</td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-800 block">{req.studentName}</span>
                      <span className="text-[10px] text-slate-400">{req.className}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-medium text-slate-900 block">
                        {req.startDate} to {req.endDate}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {req.totalDays} {req.totalDays === 1 ? 'day' : 'days'}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-700">{req.leaveType}</td>
                    <td className="py-3 px-4">
                      <p className="text-slate-700 line-clamp-2">{req.reason}</p>
                      {req.documentName && (
                        <span className="inline-flex items-center gap-1 text-[10px] text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded mt-1">
                          <FileText className="w-3 h-3" />
                          {req.documentName}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Badge
                        variant={
                          req.status === 'Approved'
                            ? 'success'
                            : req.status === 'Pending'
                            ? 'warning'
                            : req.status === 'Rejected'
                            ? 'danger'
                            : 'neutral'
                        }
                      >
                        {req.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-[11px] text-slate-600">
                      {req.reviewerRemarks ? (
                        <div>
                          <p className="italic">"{req.reviewerRemarks}"</p>
                          <span className="text-[10px] text-slate-400 mt-0.5 block">
                            — {req.reviewerName || 'Class Advisor'}
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Awaiting faculty review</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-center">
                      {req.status === 'Pending' ? (
                        <button
                          type="button"
                          onClick={() => cancelLeaveRequest(req.requestId)}
                          className="text-[11px] font-semibold text-rose-600 hover:text-rose-800 transition-colors"
                        >
                          Cancel
                        </button>
                      ) : (
                        <span className="text-slate-300 text-xs">—</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
