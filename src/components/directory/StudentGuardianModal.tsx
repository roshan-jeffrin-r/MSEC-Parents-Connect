import React, { useState } from 'react';
import { useAlertSystem } from '../../context/AlertSystemContext';
import { Modal } from '../common/Modal';
import { AlertStudent, AlertGuardian, SupportedLanguage } from '../../types/attendanceAlert';
import {
  UserPlus,
  Phone,
  MessageSquare,
  Smartphone,
  Shield,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface StudentGuardianModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentToEdit?: AlertStudent | null;
}

export const StudentGuardianModal: React.FC<StudentGuardianModalProps> = ({
  isOpen,
  onClose,
  studentToEdit
}) => {
  const { addStudentWithGuardian, updateStudent, updateGuardian, guardians } = useAlertSystem();

  const [studentId, setStudentId] = useState(studentToEdit?.studentId || '');
  const [registerNumber, setRegisterNumber] = useState(studentToEdit?.registerNumber || '');
  const [fullName, setFullName] = useState(studentToEdit?.fullName || '');
  const [department, setDepartment] = useState(studentToEdit?.department || 'Computer Science and Engineering');
  const [className, setClassName] = useState(studentToEdit?.className || 'CSE-B');
  const [section, setSection] = useState(studentToEdit?.section || 'B');
  const [semester, setSemester] = useState(studentToEdit?.semester || 5);

  const existingGuardian = studentToEdit
    ? guardians.find((g) => g.guardianId === studentToEdit.guardianId)
    : undefined;

  const [guardianName, setGuardianName] = useState(existingGuardian?.fullName || '');
  const [relationship, setRelationship] = useState<'Father' | 'Mother' | 'Guardian'>(existingGuardian?.relationship || 'Father');
  const [mobileNumber, setMobileNumber] = useState(existingGuardian?.mobileNumber || '');
  const [whatsAppNumber, setWhatsAppNumber] = useState(existingGuardian?.whatsAppNumber || '');
  const [hasWhatsApp, setHasWhatsApp] = useState(existingGuardian?.hasWhatsApp ?? true);
  const [preferredLanguage, setPreferredLanguage] = useState<SupportedLanguage>(existingGuardian?.preferredLanguage || 'en');
  const [smsEnabled, setSmsEnabled] = useState(existingGuardian?.smsEnabled ?? true);
  const [whatsAppEnabled, setWhatsAppEnabled] = useState(existingGuardian?.whatsAppEnabled ?? true);

  const [errorMsg, setErrorMsg] = useState('');
  const [successBanner, setSuccessBanner] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!studentId.trim() || !fullName.trim() || !guardianName.trim()) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }

    const cleanPhone = mobileNumber.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setErrorMsg('Guardian mobile number must be at least 10 digits.');
      return;
    }

    if (studentToEdit && existingGuardian) {
      // Update
      updateStudent(studentToEdit.studentId, {
        fullName,
        registerNumber,
        department,
        className,
        section,
        semester
      });

      updateGuardian(existingGuardian.guardianId, {
        fullName: guardianName,
        relationship,
        mobileNumber: cleanPhone,
        whatsAppNumber: hasWhatsApp ? (whatsAppNumber || cleanPhone) : undefined,
        hasWhatsApp,
        preferredLanguage,
        smsEnabled,
        whatsAppEnabled
      });

      setSuccessBanner('Student & Guardian details updated.');
    } else {
      // Create
      const newGuardianId = `GUAR-${Date.now().toString().slice(-4)}`;
      const newGuardian: AlertGuardian = {
        guardianId: newGuardianId,
        fullName: guardianName,
        relationship,
        mobileNumber: cleanPhone,
        whatsAppNumber: hasWhatsApp ? (whatsAppNumber || cleanPhone) : undefined,
        hasWhatsApp,
        preferredLanguage,
        smsEnabled,
        whatsAppEnabled,
        studentIds: [studentId]
      };

      const newStudent: AlertStudent = {
        studentId: studentId.trim().toUpperCase(),
        registerNumber: registerNumber || `311522${Math.floor(100000 + Math.random() * 900000)}`,
        fullName,
        department,
        className,
        section,
        semester,
        guardianId: newGuardianId,
        profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'
      };

      const outcome = addStudentWithGuardian(newStudent, newGuardian);
      if (!outcome.success) {
        setErrorMsg(outcome.message);
        return;
      }
      setSuccessBanner(outcome.message);
    }

    setTimeout(() => {
      setSuccessBanner('');
      onClose();
    }, 1000);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="lg"
      title={
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-700 text-white flex items-center justify-center font-bold text-xs shadow-2xs">
            <UserPlus className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              {studentToEdit ? 'Edit Student & Guardian Record' : 'Register Student & Guardian Profile'}
            </h3>
            <p className="text-[11px] text-slate-500 font-normal">
              Maintains contact numbers and messaging preferences for automated attendance alerts
            </p>
          </div>
        </div>
      }
      footer={
        <div className="w-full flex items-center justify-end gap-2 text-xs">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 border border-slate-200 text-slate-700 rounded-lg font-semibold hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-3.5 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded-lg font-bold shadow-2xs transition-colors"
          >
            {studentToEdit ? 'Save Changes' : 'Register Profile'}
          </button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
        {errorMsg && (
          <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 flex items-center gap-2 font-medium">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successBanner && (
          <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-2 font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successBanner}</span>
          </div>
        )}

        {/* Student Details Section */}
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
          <span className="font-bold text-slate-900 text-xs block">1. Student Information</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <label htmlFor="reg-stu-id" className="block text-[11px] font-bold text-slate-700 mb-0.5">
                Student ID <span className="text-rose-500">*</span>
              </label>
              <input
                id="reg-stu-id"
                type="text"
                required
                disabled={!!studentToEdit}
                placeholder="e.g. STU-011"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs bg-white text-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:bg-slate-100"
              />
            </div>

            <div>
              <label htmlFor="reg-stu-name" className="block text-[11px] font-bold text-slate-700 mb-0.5">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                id="reg-stu-name"
                type="text"
                required
                placeholder="e.g. Varun Kumar"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label htmlFor="reg-stu-class" className="block text-[11px] font-bold text-slate-700 mb-0.5">
                Class / Section <span className="text-rose-500">*</span>
              </label>
              <input
                id="reg-stu-class"
                type="text"
                required
                placeholder="e.g. CSE-B"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs bg-white text-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label htmlFor="reg-stu-regno" className="block text-[11px] font-bold text-slate-700 mb-0.5">
                University Register No
              </label>
              <input
                id="reg-stu-regno"
                type="text"
                placeholder="e.g. 311522104011"
                value={registerNumber}
                onChange={(e) => setRegisterNumber(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs bg-white text-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>
        </div>

        {/* Guardian Details Section */}
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
          <span className="font-bold text-slate-900 text-xs block">2. Guardian Contact &amp; Channels</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <label htmlFor="reg-guard-name" className="block text-[11px] font-bold text-slate-700 mb-0.5">
                Guardian Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                id="reg-guard-name"
                type="text"
                required
                placeholder="e.g. G. Sundararaman"
                value={guardianName}
                onChange={(e) => setGuardianName(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label htmlFor="reg-guard-rel" className="block text-[11px] font-bold text-slate-700 mb-0.5">
                Relationship
              </label>
              <select
                id="reg-guard-rel"
                value={relationship}
                onChange={(e) => setRelationship(e.target.value as any)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs bg-white text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="Father">Father</option>
                <option value="Mother">Mother</option>
                <option value="Guardian">Guardian</option>
              </select>
            </div>

            <div>
              <label htmlFor="reg-guard-phone" className="block text-[11px] font-bold text-slate-700 mb-0.5">
                Mobile Number (SMS alerts) <span className="text-rose-500">*</span>
              </label>
              <input
                id="reg-guard-phone"
                type="text"
                required
                placeholder="10-digit number e.g. 9840123456"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs bg-white text-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label htmlFor="reg-guard-lang" className="block text-[11px] font-bold text-slate-700 mb-0.5">
                Preferred Notification Language
              </label>
              <select
                id="reg-guard-lang"
                value={preferredLanguage}
                onChange={(e) => setPreferredLanguage(e.target.value as SupportedLanguage)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs bg-white text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="en">English (Default)</option>
                <option value="ta">Tamil (தமிழ்)</option>
              </select>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200 flex items-center gap-4 flex-wrap">
            <label className="flex items-center gap-1.5 cursor-pointer font-medium text-[11px]">
              <input
                type="checkbox"
                checked={smsEnabled}
                onChange={(e) => setSmsEnabled(e.target.checked)}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <span>Enable SMS Alerts</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer font-medium text-[11px]">
              <input
                type="checkbox"
                checked={hasWhatsApp}
                onChange={(e) => {
                  setHasWhatsApp(e.target.checked);
                  if (!e.target.checked) setWhatsAppEnabled(false);
                }}
                className="rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span>WhatsApp Number Available</span>
            </label>

            {hasWhatsApp && (
              <label className="flex items-center gap-1.5 cursor-pointer font-medium text-[11px]">
                <input
                  type="checkbox"
                  checked={whatsAppEnabled}
                  onChange={(e) => setWhatsAppEnabled(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span>Enable WhatsApp Alerts</span>
              </label>
            )}
          </div>
        </div>
      </form>
    </Modal>
  );
};
