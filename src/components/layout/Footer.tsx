import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, RotateCcw, HelpCircle } from 'lucide-react';

export const Footer: React.FC = () => {
  const { resetToDemoDefaults, setIsDemoGuideOpen } = useApp();

  return (
    <footer className="mt-auto border-t border-slate-200/90 bg-white py-2.5 px-4 sm:px-6 text-xs text-slate-500 no-print">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 max-w-7xl mx-auto">
        <div className="flex items-center gap-2 text-center sm:text-left text-[11px]">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0 hidden sm:block" />
          <span>
            <strong className="text-slate-800">MSEC Parent Connect</strong> • Meenakshi Sundararajan Engineering College (Autonomous), Kodambakkam, Chennai.
          </span>
        </div>

        <div className="flex items-center gap-3 text-[11px]">
          <button
            type="button"
            onClick={() => setIsDemoGuideOpen(true)}
            className="hover:text-blue-700 font-semibold flex items-center gap-1 transition-colors"
          >
            <HelpCircle className="w-3 h-3 text-blue-600" />
            <span>Demo Guide</span>
          </button>
          <span className="text-slate-300">•</span>
          <button
            type="button"
            onClick={() => {
              if (confirm('Reset all demo attendance, marks, and leave requests back to initial state?')) {
                resetToDemoDefaults();
              }
            }}
            className="hover:text-rose-600 font-medium flex items-center gap-1 transition-colors text-slate-400 hover:underline"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Demo State</span>
          </button>
        </div>
      </div>
    </footer>
  );
};
