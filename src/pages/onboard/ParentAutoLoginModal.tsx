import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../../components/common/Modal';
import { Badge } from '../../components/common/Badge';
import {
  UserCheck,
  Phone,
  Mail,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Smartphone,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';

export const ParentAutoLoginModal: React.FC = () => {
  const {
    isParentLoginModalOpen,
    setIsParentLoginModalOpen,
    loginParentByIdentifier,
    currentParent,
    currentStudent,
    parents,
    students
  } = useApp();

  const [identifier, setIdentifier] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleIdentify = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const res = loginParentByIdentifier(identifier);
    if (res.success) {
      setSuccessMsg(res.message);
      setTimeout(() => {
        setIsParentLoginModalOpen(false);
        setSuccessMsg('');
        setIdentifier('');
      }, 1500);
    } else {
      setErrorMsg(res.message);
    }
  };

  const handleQuickSelect = (value: string) => {
    setIdentifier(value);
    const res = loginParentByIdentifier(value);
    if (res.success) {
      setSuccessMsg(res.message);
      setTimeout(() => {
        setIsParentLoginModalOpen(false);
        setSuccessMsg('');
        setIdentifier('');
      }, 1200);
    } else {
      setErrorMsg(res.message);
    }
  };

  return (
    <Modal
      isOpen={isParentLoginModalOpen}
      onClose={() => setIsParentLoginModalOpen(false)}
      title={
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-700 text-white flex items-center justify-center font-bold text-sm shadow-xs">
            <UserCheck className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Parent Identification (Passwordless)</h3>
            <p className="text-xs text-slate-500 font-normal">
              Frictionless verification via phone number, email address, or student register number
            </p>
          </div>
        </div>
      }
      maxWidth="md"
      footer={
        <div className="w-full flex items-center justify-between text-xs">
          <span className="text-slate-400">Sets a secure 30-day session cookie</span>
          <button
            type="button"
            onClick={() => setIsParentLoginModalOpen(false)}
            className="px-3.5 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors"
          >
            Close
          </button>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Future Mobile App Badge requested in prompt */}
        <div className="p-2.5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80 rounded-xl flex items-center gap-2 text-xs text-blue-900 font-semibold shadow-2xs">
          <Smartphone className="w-4 h-4 text-blue-700 shrink-0" />
          <span>Future Mobile App: Login via Mobile OTP &amp; Google OAuth</span>
        </div>

        {/* Current logged-in badge */}
        {currentParent && (
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex items-center justify-between">
            <div>
              <span className="text-[11px] text-slate-500 block">Current Active Session:</span>
              <strong className="text-slate-900">{currentParent.fullName}</strong>
              <span className="text-slate-500 block text-[11px]">
                Active Child: {currentStudent.fullName} ({currentStudent.registerNumber})
              </span>
            </div>
            <Badge variant="success" size="sm">Active Cookie</Badge>
          </div>
        )}

        {/* Feedback messages */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-start gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Identification Form */}
        <form onSubmit={handleIdentify} className="space-y-3">
          <div>
            <label htmlFor="parent-identifier" className="block text-xs font-semibold text-slate-800 mb-1">
              Enter Registered Mobile No / Parent Email / Student Reg No:
            </label>
            <input
              type="text"
              id="parent-identifier"
              autoFocus
              required
              placeholder="e.g. 9840123456 or rajesh.kumar@parent.msec.edu or CSE2026001"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 placeholder:text-slate-400"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5"
          >
            <span>Verify &amp; Auto-Login</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* One-Click Sample Parent Pickers for Demo */}
        <div className="pt-2 border-t border-slate-100">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
            Demo Parent Shortcuts (Click to Auto-Login):
          </span>
          <div className="space-y-1.5">
            <button
              type="button"
              onClick={() => handleQuickSelect('9840123456')}
              className="w-full p-2 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-lg text-left text-xs flex items-center justify-between transition-colors group"
            >
              <div>
                <strong className="text-slate-800 group-hover:text-blue-700">Rajesh Kumar (Father)</strong>
                <span className="text-[11px] text-slate-500 block">
                  Phone: 9840123456 • Children: Aarav (CSE-B) &amp; Ananya (ECE-A)
                </span>
              </div>
              <span className="text-[11px] text-blue-600 font-bold">Select →</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickSelect('CSE2026002')}
              className="w-full p-2 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-lg text-left text-xs flex items-center justify-between transition-colors group"
            >
              <div>
                <strong className="text-slate-800 group-hover:text-blue-700">Suresh V (Father)</strong>
                <span className="text-[11px] text-slate-500 block">
                  Reg No: CSE2026002 • Child: Karthik V (CSE-B)
                </span>
              </div>
              <span className="text-[11px] text-blue-600 font-bold">Select →</span>
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};