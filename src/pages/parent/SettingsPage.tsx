import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import {
  Settings,
  Bell,
  Globe,
  RotateCcw,
  ShieldCheck,
  Check,
  Smartphone,
  Mail,
  AlertTriangle,
  Cookie,
  Sliders
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { resetToDemoDefaults, currentParent, currentStaff, role } = useApp();

  const [smsAbsence, setSmsAbsence] = useState(true);
  const [smsLateArrival, setSmsLateArrival] = useState(true);
  const [examResults, setExamResults] = useState(true);
  const [collegeNotices, setCollegeNotices] = useState(true);
  const [language, setLanguage] = useState<'en' | 'ta'>('en');
  const [savedBanner, setSavedBanner] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);

  const handleSave = () => {
    setSavedBanner(true);
    setTimeout(() => setSavedBanner(false), 3000);
  };

  return (
    <div className="space-y-4 sm:space-y-5 max-w-4xl">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
            Settings & Portal Preferences
          </h1>
          <Badge variant="neutral">Institutional Configuration</Badge>
        </div>
        <p className="text-xs text-slate-500 mt-0.5">
          Configure notification dispatch channels, preferred language, and session state
        </p>
      </div>

      {savedBanner && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Preferences updated and saved to local storage.</span>
        </div>
      )}

      {/* Alert Preferences */}
      <Card
        title={
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-blue-600" />
            <span>Parent Notification Dispatch Rules</span>
          </div>
        }
        subtitle="Configure which institutional muster events dispatch instant notifications"
      >
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold text-slate-900 block leading-tight">Unexcused Absence Alerts</span>
              <span className="text-[11px] text-slate-500">
                Triggered immediately when student is marked absent during morning roll call muster (08:45 AM).
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
              <span className="text-xs font-bold text-slate-900 block leading-tight">Late-Arrival Gate Timestamp</span>
              <span className="text-[11px] text-slate-500">
                Triggered when student arrival is recorded after 08:30 AM with exact in-time.
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
              <span className="text-xs font-bold text-slate-900 block leading-tight">Examination Results Publication</span>
              <span className="text-[11px] text-slate-500">
                Notification when Internal Assessment, Model Exam, or Semester marks are published.
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
              <span className="text-xs font-bold text-slate-900 block leading-tight">Official College Circulars</span>
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
              className="px-3.5 py-1.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-lg transition-colors shadow-2xs"
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
            <span>Communication Language</span>
          </div>
        }
        subtitle="Select the primary language for portal circulars and notification summaries"
      >
        <div className="space-y-2.5">
          <div className="flex flex-wrap items-center gap-4">
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-800 cursor-pointer">
              <input
                type="radio"
                name="lang"
                value="en"
                checked={language === 'en'}
                onChange={() => setLanguage('en')}
                className="text-blue-600"
              />
              <span>English (Default Academic Medium)</span>
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
              <span>தமிழ் (Tamil Regional Preview)</span>
            </label>
          </div>
          <p className="text-[11px] text-slate-500">
            Official degree transcripts and Statement of Marks are strictly rendered in English per Anna University Autonomous regulations.
          </p>
        </div>
      </Card>

      {/* Session & Storage Status */}
      <Card
        title={
          <div className="flex items-center gap-2">
            <Cookie className="w-4 h-4 text-indigo-600" />
            <span>Active Session State</span>
          </div>
        }
        subtitle="Browser cookies and device persistence configuration"
      >
        <div className="space-y-2.5 text-xs text-slate-600">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Parent Cookie Session</span>
              <strong className="text-slate-900 block mt-0.5">msec_parent_id (30 Days Active)</strong>
              <span className="text-[11px] text-slate-500">
                Active: {currentParent ? `${currentParent.fullName} (${currentParent.phoneNumber})` : 'Default'}
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Staff Session Scope</span>
              <strong className="text-slate-900 block mt-0.5">msec_staff_session</strong>
              <span className="text-[11px] text-slate-500">
                {currentStaff ? `${currentStaff.fullName} • ${currentStaff.assignedClass}` : 'No active staff session'}
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Demo Reset Box */}
      <Card
        title={
          <div className="flex items-center gap-2">
            <RotateCcw className="w-4 h-4 text-rose-600" />
            <span>Reset Demonstration Records</span>
          </div>
        }
        subtitle="Restore initial demo state for faculty presentation"
      >
        <div className="space-y-2.5 text-xs text-slate-600">
          <p>
            During your faculty presentation, you may submit new leave applications, update muster roll call, or grade examinations. Use this action to restore all student data, examinations, and attendance records back to the pristine starting state.
          </p>

          <button
            type="button"
            onClick={() => setShowResetModal(true)}
            className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Records</span>
          </button>
        </div>
      </Card>

      {/* Reset Confirmation Modal */}
      {showResetModal && (
        <Modal
          isOpen={showResetModal}
          onClose={() => setShowResetModal(false)}
          title="Confirm Prototype Data Reset"
          footer={
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowResetModal(false)}
                className="px-3 py-1.5 border border-slate-200 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  resetToDemoDefaults();
                  setShowResetModal(false);
                  alert('All sample records reset to initial state.');
                }}
                className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold shadow-xs"
              >
                Confirm Factory Reset
              </button>
            </div>
          }
        >
          <p className="text-xs text-slate-600 leading-relaxed">
            This will clear all newly submitted leave applications, reset attendance muster records back to default, and restore original model examination grades.
          </p>
        </Modal>
      )}
    </div>
  );
};
