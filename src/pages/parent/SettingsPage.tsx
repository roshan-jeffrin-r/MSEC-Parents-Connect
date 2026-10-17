import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import {
  Settings,
  Bell,
  Globe,
  RotateCcw,
  ShieldCheck,
  Check,
  Smartphone,
  Mail,
  AlertTriangle
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { resetToDemoDefaults } = useApp();

  const [smsAbsence, setSmsAbsence] = useState(true);
  const [smsLateArrival, setSmsLateArrival] = useState(true);
  const [examResults, setExamResults] = useState(true);
  const [collegeNotices, setCollegeNotices] = useState(true);
  const [language, setLanguage] = useState<'en' | 'ta'>('en');
  const [savedBanner, setSavedBanner] = useState(false);

  const handleSave = () => {
    setSavedBanner(true);
    setTimeout(() => setSavedBanner(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Settings & Preferences
          </h1>
          <Badge variant="neutral">Prototype Configuration</Badge>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Manage alert delivery channels, preferred language, and demonstration sample data
        </p>
      </div>

      {savedBanner && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Preferences updated successfully.</span>
        </div>
      )}

      {/* Alert Preferences */}
      <Card
        title={
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-blue-600" />
            <span>Parent Notification Channels</span>
          </div>
        }
        subtitle="Configure which institutional triggers dispatch instant SMS and in-app alerts"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between py-2 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold text-slate-900 block">Absence Alerts</span>
              <span className="text-[11px] text-slate-500">
                Triggered immediately when student is marked absent during morning muster (08:45 AM).
              </span>
            </div>
            <input
              type="checkbox"
              checked={smsAbsence}
              onChange={(e) => setSmsAbsence(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between py-2 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold text-slate-900 block">Late-Arrival Gate Timestamp</span>
              <span className="text-[11px] text-slate-500">
                Triggered when biometric or manual gate in-time is later than 08:30 AM.
              </span>
            </div>
            <input
              type="checkbox"
              checked={smsLateArrival}
              onChange={(e) => setSmsLateArrival(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between py-2 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold text-slate-900 block">Examination Results Publication</span>
              <span className="text-[11px] text-slate-500">
                Notification when IA, Model Exam, or Semester marks are approved and published.
              </span>
            </div>
            <input
              type="checkbox"
              checked={examResults}
              onChange={(e) => setExamResults(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between py-2">
            <div>
              <span className="text-xs font-bold text-slate-900 block">Official College Circulars</span>
              <span className="text-[11px] text-slate-500">
                Parent-teacher meeting notices, holiday announcements, and academic timetables.
              </span>
            </div>
            <input
              type="checkbox"
              checked={collegeNotices}
              onChange={(e) => setCollegeNotices(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold rounded-lg transition-colors"
            >
              Save Notification Preferences
            </button>
          </div>
        </div>
      </Card>

      {/* Language Preference */}
      <Card
        title={
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-emerald-600" />
            <span>Preferred Communication Language</span>
          </div>
        }
        subtitle="Select the primary language for portal circulars and notification summaries"
      >
        <div className="space-y-3">
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-800 cursor-pointer">
              <input
                type="radio"
                name="lang"
                value="en"
                checked={language === 'en'}
                onChange={() => setLanguage('en')}
                className="text-blue-600"
              />
              <span>English (Default Academic Language)</span>
            </label>

            <label className="flex items-center gap-2 text-xs font-semibold text-slate-800 cursor-pointer">
              <input
                type="radio"
                name="lang"
                value="ta"
                checked={language === 'ta'}
                onChange={() => setLanguage('ta')}
                className="text-blue-600"
              />
              <span>தமிழ் (Tamil Regional Translation Preview)</span>
            </label>
          </div>
          <p className="text-[11px] text-slate-500">
            College reports and official transcripts are rendered in English per Anna University CBCS regulations.
          </p>
        </div>
      </Card>

      {/* Demo Reset Box */}
      <Card
        title={
          <div className="flex items-center gap-2">
            <RotateCcw className="w-4 h-4 text-rose-600" />
            <span>Reset Prototype Demonstration Records</span>
          </div>
        }
        subtitle="Clear all test leave requests, teacher attendance marks, and return to default state"
      >
        <div className="space-y-3 text-xs text-slate-600">
          <p>
            During your faculty presentation, you may submit new leave requests or mark attendance in Teacher Mode. Use this button to instantly restore all student data, examinations, and attendance records back to the pristine initial state.
          </p>

          <button
            type="button"
            onClick={() => {
              if (confirm('Are you sure you want to reset all demo data to factory defaults?')) {
                resetToDemoDefaults();
                alert('All sample records reset successfully.');
              }
            }}
            className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-bold flex items-center gap-2 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All Demo Data</span>
          </button>
        </div>
      </Card>
    </div>
  );
};
