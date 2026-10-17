import React from 'react';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import {
  Settings,
  Shield,
  RotateCcw,
  Database,
  Lock,
  Server
} from 'lucide-react';

export const AdminSettingsPage: React.FC = () => {
  const { resetToDemoDefaults } = useApp();

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            System Administration & Security Configuration
          </h1>
          <Badge variant="primary">CoE Access Control</Badge>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Lumina Parent Connect prototype security, role-based authorization rules, and database reset
        </p>
      </div>

      <Card
        title={
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-purple-600" />
            <span>Role-Based Access Control (RBAC) Policies</span>
          </div>
        }
      >
        <div className="space-y-3 text-xs text-slate-700 leading-relaxed">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <strong className="text-slate-900 block font-semibold">1. Parent Access Constraint</strong>
            Parents are cryptographically restricted to querying records strictly matching their linked child IDs (e.g., Rajesh Kumar &rarr; Aarav Kumar STU-001 & Ananya Kumar STU-002).
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <strong className="text-slate-900 block font-semibold">2. Faculty Access Constraint</strong>
            Class advisors and subject teachers can modify marks and attendance only for courses and sections explicitly assigned by the Dean of Academics.
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <strong className="text-slate-900 block font-semibold">3. CoE Release Gate</strong>
            Unpublished report cards remain in draft status and cannot be viewed or downloaded by parents until formal administrative release.
          </div>
        </div>
      </Card>

      <Card
        title={
          <div className="flex items-center gap-2">
            <RotateCcw className="w-4 h-4 text-rose-600" />
            <span>Prototype Demonstration State Management</span>
          </div>
        }
      >
        <div className="space-y-3 text-xs text-slate-600">
          <p>
            Reset all test submissions, modified grades, and recorded attendance back to the pristine faculty presentation baseline.
          </p>

          <button
            type="button"
            onClick={() => {
              if (confirm('Reset all demo attendance, marks, and leave records?')) {
                resetToDemoDefaults();
                alert('Prototype database restored to factory demo state.');
              }
            }}
            className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-bold flex items-center gap-2 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Records</span>
          </button>
        </div>
      </Card>
    </div>
  );
};
