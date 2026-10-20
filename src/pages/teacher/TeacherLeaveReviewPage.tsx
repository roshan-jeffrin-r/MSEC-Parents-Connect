import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp, matchesAssignedClass } from '../../context/AppContext';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { EmptyState } from '../../components/common/EmptyState';
import type { LeaveRequest, LeaveStatus } from '../../types';
import {
  CheckSquare,
  CheckCircle2,
  XCircle,
  Clock,
  FileText,
  User,
  Calendar,
  AlertCircle,
  ShieldCheck,
  Send
} from 'lucide-react';

export const TeacherLeaveReviewPage: React.FC = () => {
  const { leaveRequests, reviewLeaveRequest, currentStaff } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentStaff) {
      navigate('/teacher/login');
    }
  }, [currentStaff, navigate]);

  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);
  const [decision, setDecision] = useState<LeaveStatus>('Approved');
  const [remarks, setRemarks] = useState<string>('');
  const [savedBanner, setSavedBanner] = useState<string>('');

  if (!currentStaff) return null;

  const scopedRequests = leaveRequests.filter((req) =>
    matchesAssignedClass(req.className, currentStaff.assignedClass)
  );

  const handleOpenReview = (req: LeaveRequest, action: LeaveStatus) => {
    setSelectedRequest(req);
    setDecision(action);
    setRemarks(
      action === 'Approved'
        ? 'Sanctioned. Advised the student to collect notes and complete laboratory assignments upon return.'
        : 'Request declined due to scheduled assessments and mandatory lab attendance.'
    );
  };

  const handleConfirmDecision = () => {
    if (!selectedRequest) return;

    reviewLeaveRequest(selectedRequest.requestId, decision, remarks);
    setSavedBanner(`Leave application ${selectedRequest.requestId} has been marked as ${decision}. Parent has been notified.`);
    setSelectedRequest(null);
    setTimeout(() => setSavedBanner(''), 5000);
  };

  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div>
        <div className="flex items-center gap-2 flex-wrap">
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Review Student Leave Applications
          </h1>
          <Badge variant="primary">Faculty Sanction Workflow</Badge>
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/80 px-2 py-0.5 rounded-md">
            <ShieldCheck className="w-3 h-3 text-emerald-600" />
            Scope: {currentStaff.assignedClass}
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Review leave requests submitted by parents for class <strong className="text-slate-800">{currentStaff.assignedClass}</strong>. Faculty Advisor: <strong className="text-slate-800">{currentStaff.fullName}</strong>. Approved leaves automatically reflect in the attendance muster.
        </p>
      </div>

      {savedBanner && (
        <div className="p-3 bg-emerald-50 border border-emerald-200/80 rounded-xl text-emerald-950 text-xs font-semibold flex items-center gap-2.5 animate-in fade-in shadow-2xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{savedBanner}</span>
        </div>
      )}

      {/* Leave Requests Table */}
      <Card
        density="compact"
        noPadding
        title={
          <div className="flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-emerald-600" />
            <span>Class Leave Applications Ledger ({scopedRequests.length})</span>
          </div>
        }
        subtitle={`Showing requests strictly scoped to ${currentStaff.assignedClass}`}
      >
        <div
          className="table-wrapper"
          tabIndex={0}
          role="region"
          aria-label="Class leave applications table"
        >
          <table className="compact-table w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                <th className="w-28">Request ID</th>
                <th className="w-40">Student &amp; Class</th>
                <th className="w-40">Leave Dates</th>
                <th className="w-28">Type</th>
                <th>Reason &amp; Documents</th>
                <th className="w-24 text-center">Status</th>
                <th className="w-44 text-center">Faculty Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {scopedRequests.length > 0 ? (
                scopedRequests.map((req) => {
                  const isPending = req.status === 'Pending';

                  return (
                    <tr
                      key={req.requestId}
                      className={`hover:bg-slate-50/70 transition-colors ${
                        isPending ? 'bg-amber-50/30' : ''
                      }`}
                    >
                      <td className="font-mono font-bold text-slate-900">{req.requestId}</td>
                      <td>
                        <strong className="text-slate-900 block font-semibold">{req.studentName}</strong>
                        <span className="text-[10px] text-slate-500 font-mono">{req.className}</span>
                      </td>
                      <td>
                        <span className="font-semibold text-slate-800 block text-[11px]">
                          {req.startDate} to {req.endDate}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {req.totalDays} {req.totalDays === 1 ? 'day' : 'days'}
                        </span>
                      </td>
                      <td className="font-medium text-slate-700">
                        <Badge variant="neutral" size="sm">{req.leaveType}</Badge>
                      </td>
                      <td>
                        <p className="text-slate-700 line-clamp-1 italic">"{req.reason}"</p>
                        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                          {req.documentName && (
                            <span className="inline-flex items-center gap-1 text-[10px] text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded font-medium border border-blue-200/60">
                              <FileText className="w-2.5 h-2.5" />
                              {req.documentName}
                            </span>
                          )}
                          <span className="text-[10px] text-slate-400">
                            By: {req.submittedBy}
                          </span>
                        </div>
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
                          size="sm"
                          dot
                        >
                          {req.status}
                        </Badge>
                      </td>
                      <td className="text-center">
                        {isPending ? (
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleOpenReview(req, 'Approved')}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-[11px] font-bold transition-colors shadow-2xs"
                            >
                              Approve
                            </button>
                            <button
                              type="button"
                              onClick={() => handleOpenReview(req, 'Rejected')}
                              className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-md text-[11px] font-bold transition-colors"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-400 italic">
                            Reviewed ({req.status})
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center">
                    <EmptyState
                      icon={CheckSquare}
                      title="No Leave Applications"
                      description={`No leave requests found for class ${currentStaff.assignedClass}.`}
                      compact
                    />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Review Modal */}
      {selectedRequest && (
        <Modal
          isOpen={!!selectedRequest}
          onClose={() => setSelectedRequest(null)}
          title={`Review Leave Application: ${selectedRequest.requestId}`}
          footer={
            <div className="w-full flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setSelectedRequest(null)}
                className="px-3 py-1.5 border border-slate-200 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDecision}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold text-white shadow-2xs ${
                  decision === 'Approved' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'
                }`}
              >
                Confirm {decision}
              </button>
            </div>
          }
        >
          <div className="space-y-3 text-xs leading-relaxed">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <div>Student: <strong className="text-slate-900">{selectedRequest.studentName}</strong></div>
              <div>Duration: <strong>{selectedRequest.startDate} to {selectedRequest.endDate}</strong> ({selectedRequest.totalDays} days)</div>
              <div>Category: <strong>{selectedRequest.leaveType}</strong></div>
              <div>Submitted By: <span className="text-slate-700">{selectedRequest.submittedBy}</span></div>
            </div>

            <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-900">
              <strong className="block mb-0.5 text-[11px] uppercase tracking-wider font-bold">Applicant's Stated Reason:</strong>
              <p className="italic">"{selectedRequest.reason}"</p>
            </div>

            <div>
              <label htmlFor="leave-remarks" className="block text-xs font-bold text-slate-800 mb-1">
                Faculty Advisor Remarks / Conditions:
              </label>
              <textarea
                id="leave-remarks"
                rows={3}
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Enter remarks to be shared with the parent..."
                className="w-full p-2.5 rounded-lg border border-slate-300 text-xs text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
