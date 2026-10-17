import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldAlert, RotateCcw, HelpCircle } from 'lucide-react';

export const Footer: React.FC = () => {
  const { resetToDemoDefaults, setIsDemoGuideOpen } = useApp();

  return (
    <footer className="mt-auto border-t border-slate-200 bg-white py-4 px-4 sm:px-6 lg:px-8 text-xs text-slate-500 no-print">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-center sm:text-left">
          <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 hidden sm:block" />
          <span>
            <strong className="text-slate-700">Lumina Parent Connect</strong> • Meenakshi Sundararajan Engineering College (Autonomous) Prototype. Fictional sample data.
          </span>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setIsDemoGuideOpen(true)}
            className="hover:text-blue-600 flex items-center gap-1 transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Faculty Demo Script</span>
          </button>
          <span>•</span>
          <button
            type="button"
            onClick={() => {
              if (confirm('Reset all demo attendance, marks, and leave requests back to initial state?')) {
                resetToDemoDefaults();
              }
            }}
            className="hover:text-rose-600 flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>
    </footer>
  );
};
