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
  Server,
  UserCheck
} from 'lucide-react';

export const AdminSettingsPage: React.FC = () => {
  const { resetToDemoDefaults } = useApp();

  return (
    <div className="space-y-4 max-w-3xl">
      <div>
        <div className="flex items-center gap-2 flex-wrap">
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            System Administration &amp; Security Configuration
          </h1>
          <Badge variant="primary">CoE Access Control</Badge>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Lumina Parent Connect prototype security, role-based authorization rules, and database reset
        </p>
      </div>

      <Card
        density="compact"
        accent="indigo"
        title={
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-indigo-600" />
            <span>Role-Based Access Control (RBAC) Policies</span>
          </div>
        }
      >
        <div className="space-y-2.5 text-xs text-slate-700 leading-relaxed">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
            <strong className="text-slate-900 block font-bold text-xs">1. Parent Access Constraint</strong>
            <p className="text-[11px] text-slate-600">
              Parents are cryptographically restricted to querying records strictly matching their linked child IDs (e.g., Rajesh Kumar &rarr; Aarav Kumar STU-001 &amp; Ananya Kumar STU-002).
            </p>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
            <strong className="text-slate-900 block font-bold text-xs">2. Faculty Access Constraint</strong>
            <p className="text-[11px] text-slate-600">
              Class advisors and subject teachers can modify marks and attendance only for courses and sections explicitly assigned by the Dean of Academics (e.g. Dr. Kavitha Menon &rarr; CSE-B).
            </p>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
            <strong className="text-slate-900 block font-bold text-xs">3. CoE Release Gate</strong>
            <p className="text-[11px] text-slate-600">
              Unpublished report cards remain in draft status and cannot be viewed or downloaded by parents until formal administrative release by the Controller of Examinations.
            </p>
          </div>
        </div>
      </Card>

      <Card
        density="compact"
        accent="rose"
        title={
          <div className="flex items-center gap-2">
            <RotateCcw className="w-4 h-4 text-rose-600" />
            <span>Prototype Demonstration State Management</span>
          </div>
        }
      >
        <div className="space-y-3 text-xs text-slate-600">
          <p className="leading-relaxed">
            Reset all test submissions, modified grades, and recorded attendance back to the pristine faculty presentation baseline.
          </p>

          <button
            type="button"
            onClick={() => {
              if (confirm('Reset all demo attendance, marks, and leave records to the factory presentation baseline?')) {
                resetToDemoDefaults();
                alert('Prototype database restored to factory demo state.');
              }
            }}
            className="px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Records</span>
          </button>
        </div>
      </Card>
    </div>
  );
};
