import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAlertSystem } from '../../context/AlertSystemContext';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { EmptyState } from '../../components/common/EmptyState';
import { ManualRecordModal } from '../../components/attendance/ManualRecordModal';
import { CSVImportModal } from '../../components/attendance/CSVImportModal';
import { AlertDetailModal } from '../../components/notification/AlertDetailModal';
import {
  CalendarCheck,
  Search,
  Filter,
  Plus,
  Upload,
  Clock,
  User,
  Smartphone,
  MessageSquare,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  Trash2
} from 'lucide-react';
import { AttendanceNotificationJob } from '../../types/attendanceAlert';

export const AttendanceRecordsPage: React.FC = () => {
  const { records, students, guardians, notificationJobs, deleteAttendanceRecord } = useAlertSystem();
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>(searchParams.get('status') || 'All');

  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<AttendanceNotificationJob | null>(null);

  // Filtered attendance records
  const filteredRecords = useMemo(() => {
    return records.filter((rec) => {
      const student = students.find((s) => s.studentId === rec.studentId);
      const studentName = student ? student.fullName.toLowerCase() : '';
      const query = searchQuery.toLowerCase();

      // Search matching
      if (
        query &&
        !rec.studentId.toLowerCase().includes(query) &&
        !studentName.includes(query)
      ) {
        return false;
      }

      // Date matching
      if (dateFilter && rec.date !== dateFilter) {
        return false;
      }

      // Status matching
      if (statusFilter !== 'All') {
        if (statusFilter === 'flagged') {
          if (rec.status === 'Present') return false;
        } else if (rec.status !== statusFilter) {
          return false;
        }
      }

      return true;
    });
  }, [records, students, searchQuery, dateFilter, statusFilter]);

  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Attendance Records &amp; Source Muster
            </h1>
            <Badge variant="primary">{records.length} Recorded</Badge>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Imported attendance muster and manual test records with real-time alert trigger tracking
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          <button
            type="button"
            onClick={() => setIsImportModalOpen(true)}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Import CSV</span>
          </button>

          <button
            type="button"
            onClick={() => setIsManualModalOpen(true)}
            className="px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-bold transition-colors shadow-2xs flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add / Simulate Record</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3 rounded-xl border border-slate-200/90 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5">
        <div className="flex items-center gap-2 flex-1 flex-wrap">
          {/* Search box */}
          <div className="relative min-w-[220px] flex-1 sm:flex-none">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Search student name or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-slate-50/50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 placeholder:text-slate-400 font-mono"
            />
          </div>

          {/* Date filter */}
          <div>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono"
            />
          </div>

          {/* Status pill selectors */}
          <div className="flex items-center gap-1">
            {['All', 'Absent', 'Late', 'Present'].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 rounded-md text-xs font-bold transition-colors ${
                  statusFilter === st
                    ? 'bg-blue-700 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {(searchQuery || dateFilter || statusFilter !== 'All') && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setDateFilter('');
                setStatusFilter('All');
              }}
              className="text-[11px] text-blue-700 hover:text-blue-800 font-bold ml-1"
            >
              Clear Filters
            </button>
          )}
        </div>

        <span className="text-xs text-slate-500 font-medium">
          Showing <strong className="text-slate-900 font-mono">{filteredRecords.length}</strong> of {records.length} records
        </span>
      </div>

      {/* Attendance Table */}
      <Card
        density="compact"
        noPadding
        title={
          <div className="flex items-center gap-2">
            <CalendarCheck className="w-4 h-4 text-blue-600" />
            <span>Attendance Muster Ledger</span>
          </div>
        }
      >
        <div
          className="table-wrapper"
          tabIndex={0}
          role="region"
          aria-label="Attendance records table"
        >
          <table className="compact-table w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                <th className="w-28">Student ID</th>
                <th>Student &amp; Class</th>
                <th className="w-24">Date</th>
                <th className="w-24 text-center">Status</th>
                <th className="w-24">Arrival Time</th>
                <th className="w-44">Parent / Guardian</th>
                <th className="w-28 text-center">Source</th>
                <th className="w-32 text-center">Alert Status</th>
                <th className="w-16 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.length > 0 ? (
                filteredRecords.map((rec) => {
                  const student = students.find((s) => s.studentId === rec.studentId);
                  const guardian = student ? guardians.find((g) => g.guardianId === student.guardianId) : undefined;
                  const alertJob = notificationJobs.find(
                    (j) => j.studentId === rec.studentId && j.attendanceDate === rec.date
                  );

                  return (
                    <tr key={rec.recordId} className="hover:bg-slate-50/70 transition-colors">
                      <td className="font-mono font-bold text-slate-900 text-[11px]">{rec.studentId}</td>
                      <td>
                        <strong className="text-slate-900 block font-semibold">{student?.fullName || 'Unknown Student'}</strong>
                        <span className="text-[10px] text-slate-400 font-mono">{student?.className || '—'}</span>
                      </td>
                      <td className="font-mono text-slate-700 text-[11px]">{rec.date}</td>
                      <td className="text-center">
                        <Badge
                          variant={
                            rec.status === 'Absent'
                              ? 'danger'
                              : rec.status === 'Late'
                              ? 'warning'
                              : 'success'
                          }
                          size="sm"
                          dot
                        >
                          {rec.status}
                        </Badge>
                      </td>
                      <td className="font-mono text-[11px] text-slate-600">
                        {rec.arrivalTime ? (
                          <span className="inline-flex items-center gap-1 font-semibold text-slate-800">
                            <Clock className="w-3 h-3 text-amber-500" />
                            {rec.arrivalTime}
                          </span>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                      <td>
                        {guardian ? (
                          <div>
                            <span className="font-semibold text-slate-800 block text-[11px]">{guardian.fullName}</span>
                            <span className="text-[10px] text-slate-500 font-mono">+91 {guardian.mobileNumber}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic text-[11px]">Unlinked guardian</span>
                        )}
                      </td>
                      <td className="text-center">
                        <span
                          className={`inline-block px-1.5 py-0.2 rounded text-[10px] font-mono font-bold border ${
                            rec.source === 'csv_import'
                              ? 'bg-blue-50 text-blue-800 border-blue-200'
                              : rec.source === 'manual_entry'
                              ? 'bg-purple-50 text-purple-800 border-purple-200'
                              : 'bg-amber-50 text-amber-800 border-amber-200'
                          }`}
                        >
                          {rec.source === 'csv_import' ? 'CSV Import' : rec.source === 'manual_entry' ? 'Manual' : 'Sandbox'}
                        </span>
                      </td>
                      <td className="text-center">
                        {alertJob ? (
                          <button
                            type="button"
                            onClick={() => setSelectedJob(alertJob)}
                            className="inline-flex items-center gap-1 hover:opacity-80 transition-opacity"
                          >
                            <Badge
                              variant={
                                alertJob.smsStatus === 'Delivered' || alertJob.whatsAppStatus === 'Delivered'
                                  ? 'success'
                                  : alertJob.smsStatus === 'Failed' || alertJob.whatsAppStatus === 'Failed'
                                  ? 'danger'
                                  : 'warning'
                              }
                              size="sm"
                              dot
                            >
                              {alertJob.smsStatus === 'Delivered' ? 'Delivered' : alertJob.smsStatus}
                            </Badge>
                          </button>
                        ) : rec.status === 'Present' ? (
                          <span className="text-[11px] text-slate-400">No Alert</span>
                        ) : (
                          <span className="text-[11px] text-amber-700 font-semibold">Job Pending</span>
                        )}
                      </td>
                      <td className="text-center">
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm('Delete this test attendance record?')) {
                              deleteAttendanceRecord(rec.recordId);
                            }
                          }}
                          className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Delete record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={9} className="py-8 text-center">
                    <EmptyState
                      icon={CalendarCheck}
                      title="No Attendance Records Found"
                      description="No records match your current search and filter criteria."
                      compact
                    />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modals */}
      <ManualRecordModal
        isOpen={isManualModalOpen}
        onClose={() => setIsManualModalOpen(false)}
      />

      <CSVImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
      />

      <AlertDetailModal
        job={selectedJob}
        isOpen={!!selectedJob}
        onClose={() => setSelectedJob(null)}
      />
    </div>
  );
};
