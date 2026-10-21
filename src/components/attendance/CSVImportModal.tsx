import React, { useState } from 'react';
import { useAlertSystem } from '../../context/AlertSystemContext';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { SAMPLE_ATTENDANCE_CSV } from '../../services/attendance/CSVImportAdapter';
import { CSVImportResult } from '../../types/attendanceAlert';
import {
  Upload,
  FileSpreadsheet,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  FileText,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';

interface CSVImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CSVImportModal: React.FC<CSVImportModalProps> = ({
  isOpen,
  onClose
}) => {
  const { importAttendanceCSV, students } = useAlertSystem();

  const [csvText, setCsvText] = useState<string>(SAMPLE_ATTENDANCE_CSV);
  const [importResult, setImportResult] = useState<CSVImportResult | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setCsvText(content);
      setImportResult(null);
    };
    reader.readAsText(file);
  };

  const handleExecuteImport = () => {
    if (!csvText.trim()) return;
    const res = importAttendanceCSV(csvText);
    setImportResult(res);
  };

  const handleLoadSample = () => {
    setCsvText(SAMPLE_ATTENDANCE_CSV);
    setImportResult(null);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="xl"
      title={
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-700 text-white flex items-center justify-center font-bold text-xs shadow-2xs">
            <FileSpreadsheet className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Import Attendance Data via CSV</h3>
            <p className="text-[11px] text-slate-500 font-normal">
              Validate schema, map student IDs to guardians, and generate absence &amp; late alerts
            </p>
          </div>
        </div>
      }
      footer={
        <div className="w-full flex items-center justify-between text-xs">
          <button
            type="button"
            onClick={handleLoadSample}
            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold flex items-center gap-1 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Load Sample CSV</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 border border-slate-200 text-slate-700 rounded-lg font-semibold hover:bg-slate-100 transition-colors"
            >
              {importResult ? 'Done' : 'Cancel'}
            </button>
            <button
              type="button"
              onClick={handleExecuteImport}
              className="px-3.5 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded-lg font-bold shadow-2xs transition-colors flex items-center gap-1.5"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Validate &amp; Import</span>
            </button>
          </div>
        </div>
      }
    >
      <div className="space-y-3.5 text-xs">
        {/* CSV Format Documentation Box */}
        <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-700 space-y-1">
          <div className="flex items-center justify-between text-[11px]">
            <strong className="text-slate-900 font-bold">Documented Attendance CSV Format:</strong>
            <span className="font-mono text-slate-500 text-[10px]">Expected 4 columns</span>
          </div>
          <p className="font-mono text-[10px] text-blue-900 bg-white p-1 rounded border border-slate-200/80">
            student_id,attendance_date,attendance_status,arrival_time
          </p>
          <p className="text-[10px] text-slate-500 leading-tight">
            Columns: <code>student_id</code> (matched against directory), <code>attendance_date</code> (YYYY-MM-DD), <code>attendance_status</code> (Present/Absent/Late), <code>arrival_time</code> (optional, e.g. 09:15 AM).
          </p>
        </div>

        {/* Input & File Upload */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label htmlFor="csv-textarea" className="font-bold text-slate-800 text-xs">
              CSV Content:
            </label>
            <label className="cursor-pointer text-[11px] text-blue-700 font-bold flex items-center gap-1 hover:text-blue-800">
              <Upload className="w-3 h-3" />
              <span>Browse File (.csv)</span>
              <input type="file" accept=".csv,.txt" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>
          <textarea
            id="csv-textarea"
            rows={5}
            value={csvText}
            onChange={(e) => {
              setCsvText(e.target.value);
              setImportResult(null);
            }}
            placeholder="Paste your attendance CSV here..."
            className="w-full p-2.5 font-mono text-[11px] text-slate-800 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        {/* Import Results Summary & Error Breakdown */}
        {importResult && (
          <div className="space-y-2.5 animate-in fade-in">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-slate-900 text-xs">Import Validation Summary</span>
                <span className="text-[10px] font-mono text-slate-400">{importResult.timestamp.split('T')[1]?.slice(0, 8)}</span>
              </div>
              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                <div className="p-1.5 bg-white rounded-lg border border-slate-200">
                  <span className="block text-[10px] text-slate-400 font-bold uppercase">Total</span>
                  <strong className="text-slate-900 font-mono text-sm">{importResult.totalRows}</strong>
                </div>
                <div className="p-1.5 bg-emerald-50 rounded-lg border border-emerald-200 text-emerald-950">
                  <span className="block text-[10px] text-emerald-700 font-bold uppercase">Accepted</span>
                  <strong className="font-mono text-sm">{importResult.acceptedRows}</strong>
                </div>
                <div className="p-1.5 bg-amber-50 rounded-lg border border-amber-200 text-amber-950">
                  <span className="block text-[10px] text-amber-700 font-bold uppercase">Skipped</span>
                  <strong className="font-mono text-sm">{importResult.skippedRows}</strong>
                </div>
                <div className="p-1.5 bg-blue-50 rounded-lg border border-blue-200 text-blue-950">
                  <span className="block text-[10px] text-blue-700 font-bold uppercase">Alerts</span>
                  <strong className="font-mono text-sm">{importResult.alertsGenerated}</strong>
                </div>
              </div>
            </div>

            {/* Error List if any */}
            {importResult.errors.length > 0 && (
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-rose-950 text-xs">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>Validation Errors ({importResult.errors.length} rejected rows):</span>
                </div>
                <div className="max-h-32 overflow-y-auto space-y-1 pr-1">
                  {importResult.errors.map((err, idx) => (
                    <div key={idx} className="p-1.5 bg-white/80 rounded border border-rose-200/60 text-[11px] font-mono">
                      <span className="font-bold text-rose-800">Row {err.row}:</span> {err.reason}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};
