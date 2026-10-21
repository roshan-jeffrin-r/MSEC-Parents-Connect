import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAlertSystem } from '../../context/AlertSystemContext';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { EmptyState } from '../../components/common/EmptyState';
import { AlertDetailModal } from '../../components/notification/AlertDetailModal';
import { ScenarioRunnerModal } from '../../components/notification/ScenarioRunnerModal';
import { CSVImportModal } from '../../components/attendance/CSVImportModal';
import { AttendanceNotificationJob } from '../../types/attendanceAlert';
import {
  Users,
  UserX,
  Clock,
  Bell,
  CheckCircle2,
  AlertCircle,
  Upload,
  Zap,
  ArrowRight,
  Send,
  Smartphone,
  MessageSquare,
  ShieldAlert,
  CalendarCheck
} from 'lucide-react';

export const OverviewPage: React.FC = () => {
  const {
    students,
    records,
    notificationJobs,
    processAllPendingNotifications,
    isProcessingQueue
  } = useAlertSystem();
  const navigate = useNavigate();

  const [selectedJob, setSelectedJob] = useState<AttendanceNotificationJob | null>(null);
  const [isScenarioModalOpen, setIsScenarioModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [processBanner, setProcessBanner] = useState('');

  // Dynamically calculated statistics for today (2026-10-21)
  const today = '2026-10-21';
  const todayRecords = records.filter((r) => r.date === today);

  const totalStudents = students.length;
  const absentToday = todayRecords.filter((r) => r.status === 'Absent').length;
  const lateToday = todayRecords.filter((r) => r.status === 'Late').length;

  const pendingAlerts = notificationJobs.filter(
    (j) => j.smsStatus === 'Pending' || j.whatsAppStatus === 'Pending'
  ).length;

  const deliveredAlerts = notificationJobs.filter(
    (j) => j.smsStatus === 'Delivered' || j.whatsAppStatus === 'Delivered'
  ).length;

  const failedAlerts = notificationJobs.filter(
    (j) => j.smsStatus === 'Failed' || j.whatsAppStatus === 'Failed'
  ).length;

  const handleProcessAll = async () => {
    setProcessBanner('Dispatching simulated SMS and WhatsApp notifications...');
    await processAllPendingNotifications();
    setProcessBanner('All pending notifications processed in sandbox environment.');
    setTimeout(() => setProcessBanner(''), 4000);
  };

  const recentJobs = [...notificationJobs].slice(0, 5);

  return (
    <div className="space-y-4">
      {/* Executive Operational Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Attendance Alert &amp; Parent Notification Center
            </h1>
            <Badge variant="primary">Campus Sandbox</Badge>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time monitoring of student absences, late arrivals, and automated SMS &amp; WhatsApp parent alerts
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          <button
            type="button"
            onClick={() => setIsScenarioModalOpen(true)}
            className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-lg text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>Test Scenarios</span>
          </button>

          <button
            type="button"
            onClick={() => setIsImportModalOpen(true)}
            className="px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-bold transition-colors shadow-2xs flex items-center gap-1.5"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Import CSV</span>
          </button>
        </div>
      </div>

      {processBanner && (
        <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs font-semibold flex items-center gap-2 animate-in fade-in shadow-2xs">
          <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
          <span>{processBanner}</span>
        </div>
      )}

      {/* 6 High-Density KPI Cards (Calculated dynamically) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3">
        {/* Total Students */}
        <div
          onClick={() => navigate('/directory')}
          className="bg-white p-3 rounded-xl border border-slate-200/90 shadow-2xs hover:border-blue-300 cursor-pointer transition-all border-t-2 border-t-blue-600"
        >
          <div className="flex items-center justify-between text-slate-500 text-[11px] font-medium">
            <span>Total Students</span>
            <Users className="w-3.5 h-3.5 text-blue-600" />
          </div>
          <div className="mt-1.5 flex items-baseline gap-1">
            <span className="text-xl font-black text-slate-900 font-mono">{totalStudents}</span>
          </div>
          <span className="text-[10px] text-blue-700 font-bold mt-1 block">In Sandbox Directory →</span>
        </div>

        {/* Absent Today */}
        <div
          onClick={() => navigate('/attendance-records?status=Absent')}
          className="bg-white p-3 rounded-xl border border-slate-200/90 shadow-2xs hover:border-rose-300 cursor-pointer transition-all border-t-2 border-t-rose-600"
        >
          <div className="flex items-center justify-between text-slate-500 text-[11px] font-medium">
            <span>Absent Today</span>
            <UserX className="w-3.5 h-3.5 text-rose-600" />
          </div>
          <div className="mt-1.5 flex items-baseline gap-1">
            <span className="text-xl font-black text-rose-700 font-mono">{absentToday}</span>
            <span className="text-[10px] text-slate-400">students</span>
          </div>
          <span className="text-[10px] text-rose-700 font-bold mt-1 block">Review Absentees →</span>
        </div>

        {/* Late Today */}
        <div
          onClick={() => navigate('/attendance-records?status=Late')}
          className="bg-white p-3 rounded-xl border border-slate-200/90 shadow-2xs hover:border-amber-300 cursor-pointer transition-all border-t-2 border-t-amber-500"
        >
          <div className="flex items-center justify-between text-slate-500 text-[11px] font-medium">
            <span>Late Arrivals</span>
            <Clock className="w-3.5 h-3.5 text-amber-600" />
          </div>
          <div className="mt-1.5 flex items-baseline gap-1">
            <span className="text-xl font-black text-amber-700 font-mono">{lateToday}</span>
            <span className="text-[10px] text-slate-400">students</span>
          </div>
          <span className="text-[10px] text-amber-800 font-bold mt-1 block">Beyond threshold →</span>
        </div>

        {/* Awaiting Processing */}
        <div
          onClick={() => navigate('/notifications?status=Pending')}
          className="bg-white p-3 rounded-xl border border-slate-200/90 shadow-2xs hover:border-blue-400 cursor-pointer transition-all border-t-2 border-t-indigo-600"
        >
          <div className="flex items-center justify-between text-slate-500 text-[11px] font-medium">
            <span>Pending Alerts</span>
            <Bell className="w-3.5 h-3.5 text-indigo-600" />
          </div>
          <div className="mt-1.5 flex items-baseline gap-1">
            <span className="text-xl font-black text-indigo-900 font-mono">{pendingAlerts}</span>
            <span className="text-[10px] text-slate-400">queued</span>
          </div>
          <span className="text-[10px] text-indigo-700 font-bold mt-1 block">Review Queue →</span>
        </div>

        {/* Successful Deliveries */}
        <div
          onClick={() => navigate('/notifications?status=Delivered')}
          className="bg-white p-3 rounded-xl border border-slate-200/90 shadow-2xs hover:border-emerald-300 cursor-pointer transition-all border-t-2 border-t-emerald-600"
        >
          <div className="flex items-center justify-between text-slate-500 text-[11px] font-medium">
            <span>Simulated Sent</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div className="mt-1.5 flex items-baseline gap-1">
            <span className="text-xl font-black text-emerald-700 font-mono">{deliveredAlerts}</span>
            <span className="text-[10px] text-emerald-600 font-bold">Mock</span>
          </div>
          <span className="text-[10px] text-emerald-700 font-bold mt-1 block">Delivered logs →</span>
        </div>

        {/* Failed Attempts */}
        <div
          onClick={() => navigate('/notifications?status=Failed')}
          className="bg-white p-3 rounded-xl border border-slate-200/90 shadow-2xs hover:border-rose-300 cursor-pointer transition-all border-t-2 border-t-rose-500"
        >
          <div className="flex items-center justify-between text-slate-500 text-[11px] font-medium">
            <span>Failed Attempts</span>
            <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
          </div>
          <div className="mt-1.5 flex items-baseline gap-1">
            <span className="text-xl font-black text-rose-700 font-mono">{failedAlerts}</span>
            <span className="text-[10px] text-rose-500 font-bold">Needs retry</span>
          </div>
          <span className="text-[10px] text-rose-700 font-bold mt-1 block">View Failures →</span>
        </div>
      </div>

      {/* Quick Action Banner */}
      <div className="bg-white p-3 rounded-xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold shrink-0">
            <Send className="w-4 h-4" />
          </div>
          <div>
            <strong className="text-xs font-bold text-slate-900 block">
              Automated Alert Processing Engine
            </strong>
            <p className="text-[11px] text-slate-500">
              {pendingAlerts} notification jobs are awaiting simulated carrier delivery to registered guardians.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleProcessAll}
            disabled={pendingAlerts === 0 || isProcessingQueue}
            className="px-3.5 py-1.5 bg-blue-700 hover:bg-blue-800 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-lg text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isProcessingQueue ? 'Processing Queue...' : `Process All Pending (${pendingAlerts})`}</span>
          </button>
        </div>
      </div>

      {/* Main Dual-Column Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
        {/* Recent Attendance Alerts Feed (8 cols) */}
        <div className="lg:col-span-8">
          <Card
            density="compact"
            noPadding
            title={
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-blue-600" />
                <span>Recent Attendance Alerts &amp; Delivery Ledger</span>
              </div>
            }
            subtitle="Flagged absence and late-arrival jobs with simulated SMS and WhatsApp status"
            action={
              <button
                type="button"
                onClick={() => navigate('/notifications')}
                className="text-xs font-bold text-blue-700 hover:text-blue-800 flex items-center gap-1"
              >
                <span>All Alerts ({notificationJobs.length})</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            }
          >
            <div
              className="table-wrapper"
              tabIndex={0}
              role="region"
              aria-label="Recent attendance alerts table"
            >
              <table className="compact-table w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                    <th className="w-28">Alert Job</th>
                    <th>Student Name</th>
                    <th className="w-20 text-center">Type</th>
                    <th className="w-36">Guardian Contact</th>
                    <th className="w-24 text-center">SMS</th>
                    <th className="w-24 text-center">WhatsApp</th>
                    <th className="w-20 text-center">Inspect</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentJobs.length > 0 ? (
                    recentJobs.map((job) => (
                      <tr key={job.jobId} className="hover:bg-slate-50/70 transition-colors">
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
                        <td>
                          <span className="block font-semibold text-slate-800 text-[11px]">{job.guardianName}</span>
                          <span className="text-[10px] text-slate-500 font-mono">+91 {job.guardianPhone}</span>
                        </td>
                        <td className="text-center">
                          <Badge
                            variant={
                              job.smsStatus === 'Delivered'
                                ? 'success'
                                : job.smsStatus === 'Failed'
                                ? 'danger'
                                : 'warning'
                            }
                            size="sm"
                            dot
                          >
                            {job.smsStatus}
                          </Badge>
                        </td>
                        <td className="text-center">
                          <Badge
                            variant={
                              job.whatsAppStatus === 'Delivered'
                                ? 'success'
                                : job.whatsAppStatus === 'Failed'
                                ? 'danger'
                                : 'warning'
                            }
                            size="sm"
                            dot
                          >
                            {job.whatsAppStatus}
                          </Badge>
                        </td>
                        <td className="text-center">
                          <button
                            type="button"
                            onClick={() => setSelectedJob(job)}
                            className="px-2 py-0.5 rounded text-[11px] font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="py-8 text-center">
                        <EmptyState
                          icon={Bell}
                          title="No Attendance Alerts"
                          description="No student absence or late arrival alerts have been generated yet."
                          compact
                        />
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Side Panel: Rules & Channel Health (4 cols) */}
        <div className="lg:col-span-4 space-y-3.5">
          {/* Active Rules Card */}
          <Card
            density="compact"
            accent="blue"
            title={
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-blue-600" />
                <span>Attendance Alert Rules</span>
              </div>
            }
          >
            <div className="space-y-2 text-xs leading-relaxed">
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="font-bold text-slate-900 block text-[11px]">1. Explicit Absence Trigger</span>
                <p className="text-[11px] text-slate-600">
                  Alerts are strictly generated when an attendance record is marked <strong>Absent</strong>. Missing records are never assumed absent.
                </p>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="font-bold text-slate-900 block text-[11px]">2. Late Arrival Threshold</span>
                <p className="text-[11px] text-slate-600">
                  Expected: <strong>09:00 AM</strong> + <strong>10m grace</strong>. Arrivals after <strong>09:10 AM</strong> trigger late arrival alert.
                </p>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="font-bold text-slate-900 block text-[11px]">3. Duplicate Protection</span>
                <p className="text-[11px] text-slate-600">
                  Idempotency keys prevent repeated alerts during re-imports of the same attendance file.
                </p>
              </div>
            </div>
          </Card>

          {/* Simulated Channel Health Card */}
          <Card
            density="compact"
            accent="indigo"
            title="Notification Channel Health"
          >
            <div className="space-y-2.5 text-xs">
              <div className="p-2.5 rounded-lg bg-blue-50/60 border border-blue-200/70 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-blue-600" />
                  <div>
                    <strong className="text-slate-900 block text-xs">Mock SMS Gateway</strong>
                    <span className="text-[10px] text-slate-500 font-mono">10-Digit GSM Validation</span>
                  </div>
                </div>
                <Badge variant="success" size="sm">Active (Mock)</Badge>
              </div>

              <div className="p-2.5 rounded-lg bg-emerald-50/60 border border-emerald-200/70 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-emerald-600" />
                  <div>
                    <strong className="text-slate-900 block text-xs">Mock WhatsApp API</strong>
                    <span className="text-[10px] text-slate-500 font-mono">Business Cloud Simulator</span>
                  </div>
                </div>
                <Badge variant="success" size="sm">Active (Mock)</Badge>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Inspect Alert Modal */}
      <AlertDetailModal
        job={selectedJob}
        isOpen={!!selectedJob}
        onClose={() => setSelectedJob(null)}
      />

      {/* Scenario Runner Modal */}
      <ScenarioRunnerModal
        isOpen={isScenarioModalOpen}
        onClose={() => setIsScenarioModalOpen(false)}
      />

      {/* CSV Import Modal */}
      <CSVImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
      />
    </div>
  );
};
