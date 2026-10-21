import React, { useState } from 'react';
import { useAlertSystem } from '../../context/AlertSystemContext';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { AttendanceNotificationJob, NotificationChannel } from '../../types/attendanceAlert';
import {
  Bell,
  MessageSquare,
  Smartphone,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Clock,
  User,
  Phone,
  ShieldAlert,
  Send,
  Info
} from 'lucide-react';

interface AlertDetailModalProps {
  job: AttendanceNotificationJob | null;
  isOpen: boolean;
  onClose: () => void;
}

export const AlertDetailModal: React.FC<AlertDetailModalProps> = ({
  job,
  isOpen,
  onClose
}) => {
  const { processNotificationJob, retryJobChannel } = useAlertSystem();
  const [retryingChannel, setRetryingChannel] = useState<NotificationChannel | null>(null);
  const [activeTab, setActiveTab] = useState<'preview' | 'audit'>('preview');

  if (!job) return null;

  const handleRetry = async (channel: NotificationChannel) => {
    setRetryingChannel(channel);
    try {
      await retryJobChannel(job.jobId, channel);
    } finally {
      setRetryingChannel(null);
    }
  };

  const handleProcessBoth = async () => {
    setRetryingChannel('sms');
    try {
      await processNotificationJob(job.jobId);
    } finally {
      setRetryingChannel(null);
    }
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
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="lg"
      title={
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-700 text-white flex items-center justify-center font-bold text-xs shadow-2xs">
            <Bell className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Attendance Alert Job #{job.jobId}</h3>
            <p className="text-[11px] text-slate-500 font-normal">
              {job.alertType} alert for {job.studentName} ({job.studentId}) on {job.attendanceDate}
            </p>
          </div>
        </div>
      }
      footer={
        <div className="w-full flex items-center justify-between text-xs">
          <span className="text-[11px] text-slate-400">Sandbox / Mock delivery environment</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 border border-slate-200 text-slate-700 rounded-lg font-semibold hover:bg-slate-100 transition-colors"
            >
              Close
            </button>
            {(job.smsStatus === 'Pending' || job.whatsAppStatus === 'Pending') && (
              <button
                type="button"
                onClick={handleProcessBoth}
                disabled={!!retryingChannel}
                className="px-3.5 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded-lg font-bold shadow-2xs transition-colors flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{retryingChannel ? 'Dispatching...' : 'Simulate Send Now'}</span>
              </button>
            )}
          </div>
        </div>
      }
    >
      <div className="space-y-3.5 text-xs">
        {/* Top Header Card */}
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/90 space-y-2">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <strong className="text-sm font-bold text-slate-900">{job.studentName}</strong>
              <Badge variant={job.alertType === 'Absent' ? 'danger' : 'warning'} size="sm">
                {job.alertType}
              </Badge>
              <span className="font-mono text-[11px] text-slate-500">{job.studentId}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-500">Attendance Date:</span>
              <strong className="font-mono text-slate-800">{job.attendanceDate}</strong>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-2 border-t border-slate-200/70">
            <div>
              <span className="text-slate-500">Recipient Guardian:</span>{' '}
              <strong className="text-slate-900">{job.guardianName}</strong>
            </div>
            <div>
              <span className="text-slate-500">Contact Number:</span>{' '}
              <strong className="text-slate-900 font-mono">+91 {job.guardianPhone}</strong>
            </div>
          </div>

          <div className="text-[11px] text-slate-600 bg-white p-2 rounded-lg border border-slate-200/70">
            <span className="font-bold text-slate-700">Trigger Reason:</span> {job.generatedReason}
          </div>
        </div>

        {/* Channel Status & Action Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {/* SMS Status Box */}
          <div className="p-2.5 rounded-xl border border-slate-200 bg-white space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-blue-600" />
                <span>SMS Channel</span>
              </span>
              {getStatusBadge(job.smsStatus)}
            </div>
            <div className="text-[11px] text-slate-500 font-mono">
              To: +91 {job.guardianPhone}
            </div>
            {job.smsStatus === 'Failed' && (
              <button
                type="button"
                onClick={() => handleRetry('sms')}
                disabled={!!retryingChannel}
                className="w-full py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                <span>{retryingChannel === 'sms' ? 'Retrying...' : 'Retry SMS Simulation'}</span>
              </button>
            )}
          </div>

          {/* WhatsApp Status Box */}
          <div className="p-2.5 rounded-xl border border-slate-200 bg-white space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                <span>WhatsApp Channel</span>
              </span>
              {getStatusBadge(job.whatsAppStatus)}
            </div>
            <div className="text-[11px] text-slate-500 font-mono">
              To: +91 {job.guardianWhatsApp || job.guardianPhone}
            </div>
            {job.whatsAppStatus === 'Failed' && (
              <button
                type="button"
                onClick={() => handleRetry('whatsapp')}
                disabled={!!retryingChannel}
                className="w-full py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                <span>{retryingChannel === 'whatsapp' ? 'Retrying...' : 'Retry WhatsApp Simulation'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Tab Switcher: Message Preview vs Audit Trail */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-1">
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
              activeTab === 'preview'
                ? 'bg-blue-700 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Rendered Message Previews
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('audit')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
              activeTab === 'audit'
                ? 'bg-blue-700 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Delivery Audit Logs ({job.smsAttemptLogs.length + job.whatsAppAttemptLogs.length})
          </button>
        </div>

        {activeTab === 'preview' ? (
          <div className="space-y-2.5">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Rendered SMS Message (160-char GSM compatible)
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {job.renderedMessage.sms.length} chars
                </span>
              </div>
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-sans text-xs text-slate-800 leading-relaxed">
                "{job.renderedMessage.sms}"
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Rendered WhatsApp Business Template
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {job.renderedMessage.whatsApp.length} chars
                </span>
              </div>
              <div className="p-2.5 bg-emerald-50/50 border border-emerald-200/80 rounded-xl font-sans text-xs text-slate-800 leading-relaxed">
                "{job.renderedMessage.whatsApp}"
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {[...job.smsAttemptLogs, ...job.whatsAppAttemptLogs].length === 0 ? (
              <p className="text-center py-4 text-slate-400 text-xs">
                No delivery attempts logged yet. Alert is awaiting simulation dispatch.
              </p>
            ) : (
              [...job.smsAttemptLogs, ...job.whatsAppAttemptLogs]
                .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
                .map((log) => (
                  <div
                    key={log.attemptId}
                    className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 font-bold">
                        <span className="uppercase text-[10px] text-slate-500">{log.channel}</span>
                        {getStatusBadge(log.status)}
                      </div>
                      <span className="font-mono text-[10px] text-slate-400">
                        {log.timestamp.split('T')[1]?.slice(0, 8)} ({log.latencyMs}ms)
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-700 font-mono bg-white p-1 rounded border border-slate-200/60">
                      {log.providerResponse}
                    </p>
                    {log.error && (
                      <p className="text-[11px] text-rose-700 font-semibold">
                        Error: {log.error}
                      </p>
                    )}
                  </div>
                ))
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};
