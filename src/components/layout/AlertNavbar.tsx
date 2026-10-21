import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAlertSystem } from '../../context/AlertSystemContext';
import {
  GraduationCap,
  Sparkles,
  Upload,
  RotateCcw,
  Menu,
  Shield,
  Zap,
  CheckCircle2,
  Bell,
  CalendarCheck
} from 'lucide-react';
import { ScenarioRunnerModal } from '../notification/ScenarioRunnerModal';
import { CSVImportModal } from '../attendance/CSVImportModal';

interface AlertNavbarProps {
  onToggleSidebar: () => void;
}

export const AlertNavbar: React.FC<AlertNavbarProps> = ({ onToggleSidebar }) => {
  const { students, records, notificationJobs, resetSandboxData } = useAlertSystem();
  const navigate = useNavigate();
  const location = useLocation();

  const [isScenarioModalOpen, setIsScenarioModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  // Dynamic calculations for today (2026-10-21)
  const today = '2026-10-21';
  const todayRecords = records.filter((r) => r.date === today);
  const absentCount = todayRecords.filter((r) => r.status === 'Absent').length;
  const lateCount = todayRecords.filter((r) => r.status === 'Late').length;
  const pendingJobsCount = notificationJobs.filter(
    (j) => j.smsStatus === 'Pending' || j.whatsAppStatus === 'Pending'
  ).length;

  const handleReset = () => {
    if (confirm('Restore attendance records and notifications to the factory sandbox baseline?')) {
      resetSandboxData();
    }
  };

  return (
    <>
      <header className="h-14 bg-white border-b border-slate-200 sticky top-0 z-30 px-3 sm:px-5 flex items-center justify-between gap-3 shadow-2xs">
        {/* Left: Mobile Toggle & Branding */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onToggleSidebar}
            aria-label="Toggle navigation menu"
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 md:hidden transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div
            onClick={() => navigate('/')}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-900 text-amber-300 flex items-center justify-center font-bold text-sm shadow-2xs ring-1 ring-blue-800/20 group-hover:bg-blue-950 transition-colors">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-xs sm:text-sm text-slate-900 tracking-tight">
                  MSEC Parent Connect
                </span>
                <span className="hidden sm:inline-block px-1.5 py-0.2 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200/80">
                  Attendance Alerts
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden sm:block">
                Meenakshi Sundararajan Engineering College (Autonomous)
              </p>
            </div>
          </div>
        </div>

        {/* Center: Live Quick Metrics Strip (Hidden on small mobile) */}
        <div className="hidden lg:flex items-center gap-2 text-xs">
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200/80 font-mono text-[11px]">
            <span className="text-slate-500 font-sans font-medium">Students:</span>
            <strong className="text-slate-900">{students.length}</strong>
          </div>

          <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-50 border border-rose-200/60 font-mono text-[11px] text-rose-900">
            <span className="font-sans font-medium text-rose-700">Absent:</span>
            <strong>{absentCount}</strong>
          </div>

          <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200/60 font-mono text-[11px] text-amber-900">
            <span className="font-sans font-medium text-amber-700">Late:</span>
            <strong>{lateCount}</strong>
          </div>

          <div
            onClick={() => navigate('/notifications')}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-200/60 font-mono text-[11px] text-blue-900 cursor-pointer hover:bg-blue-100 transition-colors"
          >
            <Bell className="w-3 h-3 text-blue-600" />
            <span className="font-sans font-medium text-blue-700">Pending Alerts:</span>
            <strong>{pendingJobsCount}</strong>
          </div>
        </div>

        {/* Right: Quick Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Run Test Scenarios Button */}
          <button
            type="button"
            onClick={() => setIsScenarioModalOpen(true)}
            className="px-2.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-lg text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span className="hidden sm:inline">Run Scenarios</span>
            <span className="sm:hidden">Test</span>
          </button>

          {/* Import CSV Shortcut */}
          <button
            type="button"
            onClick={() => setIsImportModalOpen(true)}
            className="px-2.5 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-bold transition-colors shadow-2xs flex items-center gap-1.5"
          >
            <Upload className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Import CSV</span>
          </button>

          {/* Reset Baseline */}
          <button
            type="button"
            onClick={handleReset}
            title="Reset to factory sandbox state"
            className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

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
    </>
  );
};
