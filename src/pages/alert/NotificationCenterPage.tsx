import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAlertSystem } from '../../context/AlertSystemContext';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { EmptyState } from '../../components/common/EmptyState';
import { AlertDetailModal } from '../../components/notification/AlertDetailModal';
import { AttendanceNotificationJob, NotificationChannel } from '../../types/attendanceAlert';
import {
  Bell,
  Search,
  Send,
  CheckCircle2
} from 'lucide-react';

export const NotificationCenterPage: React.FC = () => {
  const {
    notificationJobs,
    processNotificationJob,
    processAllPendingNotifications,
    retryJobChannel,
    isProcessingQueue
  } = useAlertSystem();
  const [searchParams] = useSearchParams();

  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'All' | 'Absent' | 'Late'>('All');
  const [statusFilter, setStatusFilter] = useState<string>(searchParams.get('status') || 'All');
  const [channelFilter, setChannelFilter] = useState<'All' | 'SMS' | 'WhatsApp'>('All');
  const [dateFilter, setDateFilter] = useState('');

  const [selectedJob, setSelectedJob] = useState<AttendanceNotificationJob | null>(null);
  const [actionBanner, setActionBanner] = useState('');
  const [processingJobId, setProcessingJobId] = useState<string | null>(null);

  // Filtered Alert Jobs
  const filteredJobs = useMemo(() => {
    return notificationJobs.filter((job) => {
      const q = searchQuery.toLowerCase();
      if (
        q &&
        !job.studentName.toLowerCase().includes(q) &&
        !job.studentId.toLowerCase().includes(q) &&
        !job.guardianName.toLowerCase().includes(q) &&
        !job.guardianPhone.includes(q)
      ) {
        return false;
      }

      if (typeFilter !== 'All' && job.alertType !== typeFilter) {
        return false;
      }

      if (dateFilter && job.attendanceDate !== dateFilter) {
        return false;
      }

      if (statusFilter !== 'All') {
        const matchesSms = job.smsStatus === statusFilter;
        const matchesWa = job.whatsAppStatus === statusFilter;
        if (!matchesSms && !matchesWa) {
          return false;
        }
      }

      if (channelFilter === 'SMS') {
        // filter condition for SMS channel active
      } else if (channelFilter === 'WhatsApp') {
        // filter condition for WhatsApp channel active
      }

      return true;
    });
  }, [notificationJobs, searchQuery, typeFilter, statusFilter, channelFilter, dateFilter]);

  const pendingCount = notificationJobs.filter(
    (j) => j.smsStatus === 'Pending' || j.whatsAppStatus === 'Pending'
  ).length;

  const handleProcessJob = async (jobId: string) => {
    setProcessingJobId(jobId);
    try {
      await processNotificationJob(jobId);
      setActionBanner(`Notification Job #${jobId.slice(0, 16)} processed via mock providers.`);
      setTimeout(() => setActionBanner(''), 3000);
    } finally {
      setProcessingJobId(null);
    }
  };

  const handleProcessAll = async () => {
    setActionBanner('Simulating automated carrier dispatch for all pending jobs...');
    await processAllPendingNotifications();
    setActionBanner('All pending alerts processed successfully.');
    setTimeout(() => setActionBanner(''), 4000);
  };

  const getStatusBadge = (status: AttendanceNotificationJob['smsStatus']) => {
    switch (status) {
      case 'Delivered':
      case 'Sent':
        return <Badge variant="success" size="sm" dot>{status}</Badge>;
      case 'Failed':
        return <Badge variant="danger" size="sm" dot>{status}</Badge>;
      case 'Sending':
      case 'Queued':
        return <Badge variant="info" size="sm" dot>{status}</Badge>;
      default:
        return <Badge variant="warning" size="sm" dot>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Attendance Notification Center &amp; Delivery Logs
            </h1>
            <Badge variant="primary">{notificationJobs.length} Alert Jobs</Badge>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit trail of absence &amp; late arrival alerts, delivery statuses, and provider retry controls
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={handleProcessAll}
            disabled={pendingCount === 0 || isProcessingQueue}
            className="px-3.5 py-1.5 bg-blue-700 hover:bg-blue-800 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-lg text-xs font-bold transition-colors shadow-2xs flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isProcessingQueue ? 'Dispatching Queue...' : `Process All Pending (${pendingCount})`}</span>
          </button>
        </div>
      </div>

      {actionBanner && (
        <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs font-semibold flex items-center gap-2 animate-in fade-in shadow-2xs">
          <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
          <span>{actionBanner}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-3 rounded-xl border border-slate-200/90 shadow-2xs space-y-2.5">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5">
          {/* Search box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Search student, register no, guardian..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-slate-50/50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 placeholder:text-slate-400 font-mono"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Alert Type filter */}
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-bold uppercase text-slate-400 mr-0.5">Type:</span>
              {(['All', 'Absent', 'Late'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTypeFilter(t)}
                  className={`px-2 py-0.5 rounded text-xs font-bold transition-colors ${
                    typeFilter === t
                      ? 'bg-blue-700 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Status filter */}
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-bold uppercase text-slate-400 mr-0.5">Status:</span>
              {['All', 'Pending', 'Delivered', 'Failed'].map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatusFilter(st)}
                  className={`px-2 py-0.5 rounded text-xs font-bold transition-colors ${
                    statusFilter === st
                      ? 'bg-blue-700 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            {/* Date filter */}
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-2 py-1 rounded-lg border border-slate-300 text-xs bg-white text-slate-800 font-mono focus:outline-none focus:ring-1 focus:ring-blue-600"
            />

            {(searchQuery || typeFilter !== 'All' || statusFilter !== 'All' || dateFilter) && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setTypeFilter('All');
                  setStatusFilter('All');
                  setDateFilter('');
                }}
                className="text-[11px] text-blue-700 hover:text-blue-800 font-bold"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Notification Jobs Table */}
      <Card
        density="compact"
        noPadding
        title={
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-blue-600" />
            <span>Attendance Notification Ledger</span>
          </div>
        }
        subtitle={`Showing ${filteredJobs.length} alerts matching criteria`}
      >
        <div
          className="table-wrapper"
          tabIndex={0}
          role="region"
          aria-label="Attendance notification jobs table"
        >
          <table className="compact-table w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                <th className="w-28">Job ID</th>
                <th>Student Profile</th>
                <th className="w-20 text-center">Alert Type</th>
                <th className="w-24">Date</th>
                <th className="w-40">Recipient Guardian</th>
                <th className="w-28 text-center">SMS Status</th>
                <th className="w-28 text-center">WhatsApp Status</th>
                <th className="w-32">Created / Attempt</th>
                <th className="w-24 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredJobs.length > 0 ? (
                filteredJobs.map((job) => {
                  const isPending = job.smsStatus === 'Pending' || job.whatsAppStatus === 'Pending';
                  const isFailed = job.smsStatus === 'Failed' || job.whatsAppStatus === 'Failed';
                  const isProcessing = processingJobId === job.jobId;

                  return (
                    <tr
                      key={job.jobId}
                      className={`hover:bg-slate-50/70 transition-colors ${
                        isFailed ? 'bg-rose-50/20' : ''
                      }`}
                    >
                      <td className="font-mono font-bold text-slate-900 text-[11px]">
                        {job.jobId.slice(0, 16)}
                      </td>
                      <td>
                        <strong className="text-slate-900 block font-semibold">{job.studentName}</strong>
                        <span className="text-[10px] text-slate-500 font-mono">{job.studentId}</span>
                      </td>
                      <td className="text-center">
                        <Badge
                          variant={job.alertType === 'Absent' ? 'danger' : 'warning'}
                          size="sm"
                        >
                          {job.alertType}
                        </Badge>
                      </td>
                      <td className="font-mono text-slate-700 text-[11px]">{job.attendanceDate}</td>
                      <td>
                        <strong className="text-slate-800 block font-semibold text-[11px]">{job.guardianName}</strong>
                        <span className="text-[10px] text-slate-500 font-mono">+91 {job.guardianPhone}</span>
                      </td>
                      <td className="text-center">
                        {getStatusBadge(job.smsStatus)}
                      </td>
                      <td className="text-center">
                        {getStatusBadge(job.whatsAppStatus)}
                      </td>
                      <td>
                        <span className="font-mono text-slate-600 block text-[11px]">
                          {job.createdAt.split('T')[1]?.slice(0, 5)}
                        </span>
                        {job.lastAttemptAt && (
                          <span className="text-[10px] text-slate-400 font-mono">
                            Sent {job.lastAttemptAt.split('T')[1]?.slice(0, 5)}
                          </span>
                        )}
                      </td>
                      <td className="text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {isPending && (
                            <button
                              type="button"
                              onClick={() => handleProcessJob(job.jobId)}
                              disabled={isProcessing}
                              className="px-2 py-0.5 rounded text-[11px] font-bold text-white bg-blue-700 hover:bg-blue-800 transition-colors shadow-2xs"
                              title="Simulate immediate send"
                            >
                              {isProcessing ? '...' : 'Send'}
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => setSelectedJob(job)}
                            className="px-2 py-0.5 rounded text-[11px] font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                          >
                            Inspect
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={9} className="py-8 text-center">
                    <EmptyState
                      icon={Bell}
                      title="No Alerts Found"
                      description="No notification jobs match your current search and filter settings."
                      compact
                    />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Inspect Alert Detail Modal */}
      <AlertDetailModal
        job={selectedJob}
        isOpen={!!selectedJob}
        onClose={() => setSelectedJob(null)}
      />
    </div>
  );
};
