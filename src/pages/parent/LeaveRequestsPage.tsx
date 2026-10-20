import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
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
  ChevronDown,
  Trash2
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
  const [cancellingRequestId, setCancellingRequestId] = useState<string | null>(null);

  // Form submission with modern-web-guidance
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    if (!form.checkValidity()) {
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

      setTimeout(() => setSuccessMessage(''), 6000);
    }, 300);
  };

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
  const myRequests = leaveRequests.filter(
    (r) => r.studentId === currentStudent.studentId || r.studentId === studentId
  );

  const selectedStudentObj = students.find((s) => s.studentId === studentId) || currentStudent;
  const advisorName = selectedStudentObj.mentorName || 'Class Advisor';

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              Leave Request Management
            </h1>
            <Badge variant="primary">Official Sanction Workflow</Badge>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Submit formal leave applications for faculty mentor review and track status updates
          </p>
        </div>
      </div>

      {/* Success Notification Banner */}
      {successMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 flex items-center justify-between gap-2.5 animate-in fade-in">
          <div className="flex items-center gap-2 text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
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

      {/* Grid: Leave Request Form & Policy Guidance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
        {/* Left 2 Cols: Form */}
        <div className="lg:col-span-2">
          <Card
            title={
              <div className="flex items-center gap-2">
                <Send className="w-4 h-4 text-blue-600" />
                <span>Submit Leave Application</span>
              </div>
            }
            subtitle="Applications are routed directly to the student's assigned Class Advisor"
          >
            <form onSubmit={handleSubmit} className="space-y-3.5" noValidate={false}>
              {/* Student Selection */}
              <div>
                <label htmlFor="student-select" className="block text-xs font-bold text-slate-800 mb-1">
                  Student Name <span className="text-rose-500">*</span>
                </label>
                <select
                  id="student-select"
                  required
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  onBlur={handleBlur}
                  onInput={handleInput}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  {students.slice(0, 2).map((s) => (
                    <option key={s.studentId} value={s.studentId}>
                      {s.fullName} ({s.registerNumber}) — {s.className}
                    </option>
                  ))}
                </select>
              </div>

              {/* Leave Type Selector Pills */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Leave Category <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['Medical', 'Personal', 'Family Emergency', 'Other'] as LeaveType[]).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setLeaveType(type)}
                      className={`py-1.5 px-2.5 rounded-lg text-xs font-semibold transition-all border ${
                        leaveType === type
                          ? 'bg-blue-50 border-blue-600 text-blue-900 shadow-2xs font-bold'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Duration Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="start-date" className="block text-xs font-bold text-slate-800 mb-1">
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
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-medium text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label htmlFor="end-date" className="block text-xs font-bold text-slate-800 mb-1">
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
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-medium text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              {/* Reason for Leave */}
              <div>
                <label htmlFor="reason" className="block text-xs font-bold text-slate-800 mb-1">
                  Reason for Absence <span className="text-rose-500">*</span>
                </label>
                <textarea
                  id="reason"
                  required
                  rows={2}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  onBlur={handleBlur}
                  onInput={handleInput}
                  placeholder="Provide specific details regarding the reason for leave..."
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 placeholder:text-slate-400"
                />
              </div>

              {/* Supporting Document Attachment */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Supporting Document (Optional Doctor Note / Medical Prescription)
                </label>
                <div className="flex items-center gap-2.5">
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
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
                  >
                    <Upload className="w-3.5 h-3.5 text-slate-500" />
                    <span>Attach Sample Medical Certificate</span>
                  </button>

                  {documentName && (
                    <div className="flex items-center gap-1.5 text-xs text-blue-800 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
                      <FileText className="w-3.5 h-3.5 text-blue-600" />
                      <span className="font-semibold truncate max-w-[200px]">{documentName}</span>
                      <button
                        type="button"
                        onClick={() => setDocumentName('')}
                        className="text-slate-400 hover:text-slate-600 font-bold ml-1"
                        title="Remove attachment"
                      >
                        ×
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                <span className="text-[10px] text-slate-400">
                  Submitting will notify advisor {advisorName} immediately.
                </span>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Submitting...' : 'Submit Application'}</span>
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
                <span>Sanction Guidelines</span>
              </div>
            }
          >
            <div className="space-y-2.5 text-xs text-slate-600 leading-relaxed">
              <div className="p-2.5 bg-blue-50/70 border border-blue-200/80 rounded-xl">
                <strong className="text-blue-900 block font-bold text-xs mb-0.5">Muster Ledger Notice</strong>
                <p className="text-[11px] text-blue-950">
                  Leave requests do not automatically count as attendance. Physical presence criteria (&ge; 75%) must be maintained for semester exams.
                </p>
              </div>

              <div>
                <strong className="text-slate-900 block font-semibold text-xs">Medical Absences (&gt; 2 Days)</strong>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  A registered medical certificate must be produced to the advisor within 3 days of return.
                </p>
              </div>

              <div>
                <strong className="text-slate-900 block font-semibold text-xs">Internal Examinations</strong>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Leave during assessments requires prior written approval from Head of Department.
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                Assigned Advisor: <strong className="text-slate-800">{advisorName}</strong>
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
            <span>Leave Application History & Status Ledger ({myRequests.length})</span>
          </div>
        }
        subtitle="Historical and pending leave submissions for your children"
        noPadding
      >
        <div className="table-wrapper">
          <table
            role="region"
            aria-label="Leave applications history"
            tabIndex={0}
            className="compact-table"
          >
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <th className="w-24 text-left">Request ID</th>
                <th className="w-32 text-left">Student</th>
                <th className="w-36 text-left">Leave Duration</th>
                <th className="w-24 text-left">Category</th>
                <th className="text-left">Stated Reason & Docs</th>
                <th className="w-24 text-center">Status</th>
                <th className="w-44 text-left">Advisor Remarks</th>
                <th className="w-16 text-center">Action</th>
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
                    <td className="font-mono font-bold text-slate-900">{req.requestId}</td>
                    <td>
                      <span className="font-semibold text-slate-800 block leading-tight">{req.studentName}</span>
                      <span className="text-[10px] text-slate-500 font-mono">{req.className}</span>
                    </td>
                    <td>
                      <span className="font-medium text-slate-900 block leading-tight font-mono text-[11px]">
                        {req.startDate} to {req.endDate}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {req.totalDays} {req.totalDays === 1 ? 'day' : 'days'}
                      </span>
                    </td>
                    <td className="font-semibold text-slate-700">{req.leaveType}</td>
                    <td>
                      <p className="text-slate-700 line-clamp-1">{req.reason}</p>
                      {req.documentName && (
                        <span className="inline-flex items-center gap-1 text-[10px] text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200 mt-0.5">
                          <FileText className="w-3 h-3" />
                          {req.documentName}
                        </span>
                      )}
                    </td>
                    <td className="text-center">
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
                        size="xs"
                      >
                        {req.status}
                      </Badge>
                    </td>
                    <td className="text-[11px] text-slate-600">
                      {req.reviewerRemarks ? (
                        <div>
                          <p className="italic leading-snug">"{req.reviewerRemarks}"</p>
                          <span className="text-[10px] text-slate-400 mt-0.5 block">
                            — {req.reviewerName || 'Advisor'}
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Awaiting review</span>
                      )}
                    </td>
                    <td className="text-center">
                      {req.status === 'Pending' ? (
                        <button
                          type="button"
                          onClick={() => setCancellingRequestId(req.requestId)}
                          className="text-[11px] font-bold text-rose-600 hover:text-rose-800 transition-colors"
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

      {/* Cancel Confirmation Modal */}
      {cancellingRequestId && (
        <Modal
          isOpen={!!cancellingRequestId}
          onClose={() => setCancellingRequestId(null)}
          title="Confirm Leave Application Withdrawal"
          footer={
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setCancellingRequestId(null)}
                className="px-3 py-1.5 border border-slate-200 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-50"
              >
                Keep Application
              </button>
              <button
                type="button"
                onClick={() => {
                  cancelLeaveRequest(cancellingRequestId);
                  setCancellingRequestId(null);
                }}
                className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold shadow-xs"
              >
                Withdraw Request
              </button>
            </div>
          }
        >
          <p className="text-xs text-slate-600 leading-relaxed">
            Are you sure you want to withdraw leave application <strong>{cancellingRequestId}</strong>? This action cannot be undone and the class advisor will be updated.
          </p>
        </Modal>
      )}
    </div>
  );
};
