import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import {
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  Sparkles,
  RotateCcw,
  ShieldCheck,
  GraduationCap,
  CalendarCheck,
  FileText,
  Bell,
  Send,
  Users,
  Database
} from 'lucide-react';

export const DemoGuideModal: React.FC = () => {
  const {
    isDemoGuideOpen,
    setIsDemoGuideOpen,
    demoStep,
    setDemoStep,
    setRole,
    setSelectedStudentId,
    resetToDemoDefaults
  } = useApp();
  const navigate = useNavigate();

  const steps = [
    {
      step: 1,
      title: 'Application Overview & Demo Login',
      desc: 'Introduce Lumina Parent Connect for Meenakshi Sundararajan Engineering College. Review the purpose: simplify academic and attendance communication with parents.',
      role: 'parent',
      path: '/',
      studentId: 'STU-001',
      icon: GraduationCap,
      actionLabel: 'Go to Welcome Overview'
    },
    {
      step: 2,
      title: 'Parent Dashboard (Aarav Kumar)',
      desc: "Present Aarav Kumar's student profile (III Year CSE - B), quick access cards, academic highlights, and multi-child support (Aarav & sibling Ananya).",
      role: 'parent',
      path: '/',
      studentId: 'STU-001',
      icon: Users,
      actionLabel: 'Open Parent Dashboard'
    },
    {
      step: 3,
      title: 'Attendance % & Latest Exam Result',
      desc: "Highlight Aarav's overall attendance (88.5% — well clear of Anna University 75% norm) and Model Exam GPA (8.78 / 87.33%).",
      role: 'parent',
      path: '/',
      studentId: 'STU-001',
      icon: CalendarCheck,
      actionLabel: 'View Key Metrics'
    },
    {
      step: 4,
      title: 'Digital Report Cards & Print View',
      desc: 'Explore subject-wise marks, credit weights, grades (O, A+, A), faculty remarks, and trigger the printable/PDF report card layout.',
      role: 'parent',
      path: '/report-cards',
      studentId: 'STU-001',
      icon: FileText,
      actionLabel: 'Open Digital Report Card'
    },
    {
      step: 5,
      title: 'Attendance History & Late Arrival Record',
      desc: 'Inspect the daily log covering August-October 2026. Highlight the Oct 14 Late Arrival (09:12 AM) and Oct 08 Absence.',
      role: 'parent',
      path: '/attendance',
      studentId: 'STU-001',
      icon: CalendarCheck,
      actionLabel: 'Open Attendance Log'
    },
    {
      step: 6,
      title: 'Absence & Late Arrival Notifications',
      desc: 'Open the Notification Center. Demonstrate simulated in-app alerts for late arrival, absence, and examination results with unread badges.',
      role: 'parent',
      path: '/notifications',
      studentId: 'STU-001',
      icon: Bell,
      actionLabel: 'Open Notification Center'
    },
    {
      step: 7,
      title: 'Submit a Leave Request',
      desc: 'Demonstrate the accessible leave request form with validation, dates selection, medical certificate attachment, and real-time validation.',
      role: 'parent',
      path: '/leave-requests',
      studentId: 'STU-001',
      icon: Send,
      actionLabel: 'Open Leave Request Form'
    },
    {
      step: 8,
      title: 'Track Leave Status in Real-Time',
      desc: 'Show the submitted leave request in history with status Pending, and show how parent can track status updates.',
      role: 'parent',
      path: '/leave-requests',
      studentId: 'STU-001',
      icon: CheckCircle2,
      actionLabel: 'View Leave History'
    },
    {
      step: 9,
      title: 'Faculty / Teacher Approval Workflow',
      desc: "Switch to Dr. K. Senthil Kumar (Teacher Portal). Review Aarav's pending leave request, click Approve, and record class attendance.",
      role: 'teacher',
      path: '/teacher/leave-requests',
      studentId: 'STU-001',
      icon: ShieldCheck,
      actionLabel: 'Switch to Teacher Portal'
    },
    {
      step: 10,
      title: 'Enterprise Integration & Next Steps',
      desc: 'Explain how Lumina Parent Connect can connect to MSEC SIS database, SMS gateways, and Anna University result APIs using Cloud Firestore and Firebase Auth.',
      role: 'admin',
      path: '/admin',
      studentId: 'STU-001',
      icon: Database,
      actionLabel: 'Open Admin & Architecture'
    }
  ];

  const handleExecuteStep = (stepItem: typeof steps[0]) => {
    setRole(stepItem.role as any);
    setSelectedStudentId(stepItem.studentId);
    setDemoStep(stepItem.step);
    navigate(stepItem.path);
    setIsDemoGuideOpen(false);
  };

  return (
    <Modal
      isOpen={isDemoGuideOpen}
      onClose={() => setIsDemoGuideOpen(false)}
      title={
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-700 text-white flex items-center justify-center font-bold text-sm shadow-xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Faculty Demonstration Script & Checklist</h3>
            <p className="text-xs text-slate-500 font-normal">
              10-step guided presentation flow for the October 21 faculty demonstration
            </p>
          </div>
        </div>
      }
      maxWidth="2xl"
      footer={
        <div className="w-full flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              if (confirm('Reset all demo records back to initial factory state?')) {
                resetToDemoDefaults();
                navigate('/');
              }
            }}
            className="text-xs text-slate-500 hover:text-rose-600 flex items-center gap-1.5 font-medium transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset All Sample Data
          </button>
          <button
            type="button"
            onClick={() => setIsDemoGuideOpen(false)}
            className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors"
          >
            Close Guide
          </button>
        </div>
      }
    >
      <div className="space-y-3">
        <div className="p-3.5 bg-blue-50/70 border border-blue-200/80 rounded-xl text-xs text-blue-900 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold block">Independent Faculty Prototype Notice</span>
            This application uses realistic fictional student data for Aarav Kumar (CSE2026001). Clicking any
            step below automatically switches to the correct role, loads the relevant screen, and updates the step pointer.
          </div>
        </div>

        <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-white">
          {steps.map((item) => {
            const Icon = item.icon;
            const isCurrent = demoStep === item.step;
            return (
              <div
                key={item.step}
                className={`p-3.5 transition-colors flex items-center justify-between gap-3 ${
                  isCurrent ? 'bg-blue-50/60 border-l-4 border-l-blue-600' : 'hover:bg-slate-50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                      isCurrent
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}
                  >
                    {item.step}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-900">{item.title}</span>
                      <span className="text-[10px] font-medium uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                        {item.role}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{item.desc}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleExecuteStep(item)}
                  className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isCurrent
                      ? 'bg-blue-600 text-white shadow-xs hover:bg-blue-700'
                      : 'bg-slate-100 text-slate-700 hover:bg-blue-50 hover:text-blue-700'
                  }`}
                >
                  <span>{item.actionLabel}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </Modal>
  );
};
