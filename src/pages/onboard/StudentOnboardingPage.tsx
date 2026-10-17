import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { StudentOnboardData } from '../../types';
import {
  GraduationCap,
  Bus,
  Users,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Save,
  ArrowRight,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  Building,
  User,
  Heart,
  Calendar,
  Check,
  RotateCcw
} from 'lucide-react';

export const StudentOnboardingPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { students, parents, upsertStudentProfile, setRole, setSelectedStudentId } = useApp();

  // Query parameter inspection
  const regNoParam = (searchParams.get('regNo') || searchParams.get('id') || searchParams.get('studentId') || '').trim();

  // Form State
  const [formData, setFormData] = useState<StudentOnboardData>({
    registerNumber: '',
    fullName: '',
    department: 'Computer Science and Engineering',
    className: 'III Year CSE - B',
    semester: 3,
    dob: '2005-08-14',
    gender: 'Male',
    bloodGroup: 'B+',
    mentorName: 'Dr. K. Senthil Kumar',
    scholarType: 'Day Scholar',
    modeOfTransport: 'College Bus',
    transportReference: 'Route 14 (Tambaram to MSEC Kodambakkam)',
    studentMobile: '98401 98765',
    studentEmail: 'aarav.kumar@student.msec.edu.in',
    fatherName: 'Rajesh Kumar',
    motherName: 'Meenakshi Kumar',
    primaryAccountRelation: 'Father',
    parentPhone: '9840123456',
    parentEmail: 'rajesh.kumar@parent.msec.edu',
    residentialAddress: 'No. 42, 3rd Main Road, Chromepet',
    city: 'Chennai',
    pincode: '600044'
  });

  const [isPreFilled, setIsPreFilled] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [submissionResult, setSubmissionResult] = useState<{
    studentId: string;
    isNew: boolean;
    message: string;
  } | null>(null);

  // Helper to load student data into form
  const loadStudentIntoForm = (regNumber: string) => {
    const norm = regNumber.trim().toUpperCase();
    const existing = students.find(
      (s) => s.registerNumber.toUpperCase() === norm || s.studentId.toUpperCase() === norm
    );

    if (existing) {
      // Find linked parent
      const linkedParent = parents.find(
        (p) => p.linkedStudentIds.includes(existing.studentId) || existing.parentIds?.includes(p.parentId)
      );

      setFormData({
        registerNumber: existing.registerNumber,
        fullName: existing.fullName,
        department: existing.department,
        className: existing.className,
        semester: existing.semester,
        dob: existing.dob,
        gender: existing.gender || 'Male',
        bloodGroup: existing.bloodGroup,
        mentorName: existing.mentorName,
        scholarType: existing.hostelDayScholar as any,
        modeOfTransport: existing.modeOfTransport || (existing.hostelDayScholar === 'Hostelite' ? 'Hostel Resident' : 'College Bus'),
        transportReference: existing.transportReference || existing.busRoute || '',
        studentMobile: existing.studentMobile || '98401 98765',
        studentEmail: existing.studentEmail || `${existing.fullName.toLowerCase().replace(' ', '.')}@student.msec.edu.in`,
        fatherName: linkedParent?.fatherName || linkedParent?.fullName || 'Rajesh Kumar',
        motherName: linkedParent?.motherName || 'Meenakshi Kumar',
        primaryAccountRelation: linkedParent?.relationship || 'Father',
        parentPhone: linkedParent?.phoneNumber.replace(/[^0-9]/g, '').slice(-10) || '9840123456',
        parentEmail: linkedParent?.email || 'rajesh.kumar@parent.msec.edu',
        residentialAddress: linkedParent?.address || 'No. 42, 3rd Main Road, Chromepet',
        city: linkedParent?.city || 'Chennai',
        pincode: linkedParent?.pincode || '600044'
      });
      setIsPreFilled(true);
    } else {
      // New student with query param as register number
      setFormData((prev) => ({
        ...prev,
        registerNumber: norm,
        fullName: '',
        transportReference: '',
        parentPhone: '',
        parentEmail: ''
      }));
      setIsPreFilled(false);
    }
  };

  // On mount or URL param change
  useEffect(() => {
    if (regNoParam) {
      loadStudentIntoForm(regNoParam);
    } else {
      // Default to Aarav Kumar for easy verification
      loadStudentIntoForm('CSE2026001');
    }
  }, [regNoParam, students, parents]);

  // Modern-web-guidance aria sync
  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const el = e.target;
    if (el.checkValidity) {
      if (!el.checkValidity()) {
        el.setAttribute('aria-invalid', 'true');
      } else {
        el.removeAttribute('aria-invalid');
      }
    }
  };

  const handleInput = (e: React.FormEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const el = e.target as HTMLInputElement;
    if (el.checkValidity && el.checkValidity()) {
      el.removeAttribute('aria-invalid');
    }
  };

  const handleFieldChange = (field: keyof StudentOnboardData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;

    // Validate phone number format (must be 10 digits)
    const phoneClean = formData.parentPhone.replace(/[^0-9]/g, '');
    if (phoneClean.length !== 10) {
      alert('Please enter a valid 10-digit mobile number for the parent contact.');
      return;
    }

    if (!form.checkValidity()) {
      const inputs = form.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>('input, select, textarea');
      inputs.forEach((input) => {
        if (!input.checkValidity()) {
          input.setAttribute('aria-invalid', 'true');
        }
      });
      return;
    }

    const result = upsertStudentProfile({
      ...formData,
      registerNumber: formData.registerNumber.trim().toUpperCase(),
      parentPhone: phoneClean
    });

    setSubmissionResult(result);
    setIsSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenParentPortal = () => {
    setRole('parent');
    if (submissionResult?.studentId) {
      setSelectedStudentId(submissionResult.studentId);
    }
    navigate('/');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* College Institutional Header */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-400/30 mb-3">
            <GraduationCap className="w-4 h-4 text-amber-300" />
            <span>MSEC Academic Self-Service Portal</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            Student Onboarding & Profile Verification
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Verify or update your official academic enrollment records, daily transit details, and parent emergency SMS contact for Meenakshi Sundararajan Engineering College.
          </p>

          {/* Quick Demo Pre-fill Helper Tabs */}
          <div className="mt-4 pt-4 border-t border-slate-800/80 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-400 font-semibold text-[11px] uppercase tracking-wider">
              Quick Test Scenarios:
            </span>
            <button
              type="button"
              onClick={() => loadStudentIntoForm('CSE2026001')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                formData.registerNumber === 'CSE2026001'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Verify Aarav Kumar (CSE2026001)
            </button>
            <button
              type="button"
              onClick={() => loadStudentIntoForm('ECE2026045')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                formData.registerNumber === 'ECE2026045'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Verify Ananya Kumar (ECE2026045)
            </button>
            <button
              type="button"
              onClick={() => {
                const nextNo = `CSE2026${String(students.length + 1).padStart(3, '0')}`;
                loadStudentIntoForm(nextNo);
              }}
              className="px-3 py-1 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-lg text-xs font-bold transition-all"
            >
              + Register New Student
            </button>
          </div>
        </div>

        {/* Decorative backdrop */}
        <div className="absolute right-0 top-0 -mt-8 -mr-8 w-72 h-72 rounded-full bg-blue-600/10 pointer-events-none blur-3xl" />
      </div>

      {/* Confirmation / Success Screen State */}
      {isSubmitted && submissionResult && (
        <div className="p-6 bg-white rounded-2xl border-2 border-emerald-500 shadow-xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900">
                  {submissionResult.isNew ? 'Student Onboarding Complete!' : 'Profile Records Successfully Updated!'}
                </h2>
                <Badge variant="success">Synchronized with MSEC Parent Connect</Badge>
              </div>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                {submissionResult.message} The parent contact has been registered to receive automated attendance, late-arrival notifications, and digital report cards.
              </p>
            </div>
          </div>

          {/* Summary Preview Card */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <span className="text-slate-400 block text-[11px]">Enrolled Student</span>
              <strong className="text-slate-900">{formData.fullName}</strong>
              <span className="font-mono text-blue-700 block text-[11px] font-semibold">{formData.registerNumber}</span>
            </div>

            <div>
              <span className="text-slate-400 block text-[11px]">Department & Class</span>
              <strong className="text-slate-800">{formData.department}</strong>
              <span className="text-slate-500 block text-[11px]">{formData.className} • Sem {formData.semester}</span>
            </div>

            <div>
              <span className="text-slate-400 block text-[11px]">Emergency Parent Contact</span>
              <strong className="text-emerald-700">
                {formData.primaryAccountRelation === 'Father' ? formData.fatherName : formData.motherName} ({formData.primaryAccountRelation})
              </strong>
              <span className="text-slate-600 block text-[11px] font-mono">+91 {formData.parentPhone}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsSubmitted(false)}
              className="text-xs text-slate-500 hover:text-slate-800 font-semibold flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Edit Details Again</span>
            </button>

            <button
              type="button"
              onClick={handleOpenParentPortal}
              className="px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2"
            >
              <span>Open Parent Portal for this Student</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Self-Service Form */}
      {!isSubmitted && (
        <form onSubmit={handleSubmit} className="space-y-6" noValidate={false}>
          {/* Section A: Academic & Student Identity */}
          <Card
            title={
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-blue-600" />
                <span>Section A: Academic & Student Identity</span>
              </div>
            }
            subtitle={
              isPreFilled
                ? 'Existing student record detected from database. Please verify and correct any outdated fields.'
                : 'New student registration. Fill in verified credentials as per Anna University admission records.'
            }
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              {/* Register Number */}
              <div>
                <label htmlFor="reg-no" className="block font-semibold text-slate-800 mb-1">
                  Register Number / Student ID <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  id="reg-no"
                  name="regNo"
                  required
                  value={formData.registerNumber}
                  onChange={(e) => handleFieldChange('registerNumber', e.target.value.toUpperCase())}
                  onBlur={handleBlur}
                  onInput={handleInput}
                  placeholder="e.g. CSE2026001"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono text-xs uppercase font-bold text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">Official Anna University Reg No</span>
              </div>

              {/* Student Full Name */}
              <div className="sm:col-span-2">
                <label htmlFor="full-name" className="block font-semibold text-slate-800 mb-1">
                  Student Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  id="full-name"
                  name="name"
                  required
                  autoComplete="name"
                  value={formData.fullName}
                  onChange={(e) => handleFieldChange('fullName', e.target.value)}
                  onBlur={handleBlur}
                  onInput={handleInput}
                  placeholder="As per 10th / 12th mark sheets"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              {/* Department */}
              <div>
                <label htmlFor="dept" className="block font-semibold text-slate-800 mb-1">
                  Department / Branch <span className="text-rose-500">*</span>
                </label>
                <select
                  id="dept"
                  required
                  value={formData.department}
                  onChange={(e) => handleFieldChange('department', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="Computer Science and Engineering">Computer Science and Engineering (CSE)</option>
                  <option value="Electronics and Communication Engineering">Electronics and Communication (ECE)</option>
                  <option value="Information Technology">Information Technology (IT)</option>
                  <option value="Electrical and Electronics Engineering">Electrical & Electronics (EEE)</option>
                  <option value="Mechanical Engineering">Mechanical Engineering (MECH)</option>
                  <option value="Civil Engineering">Civil Engineering (CIVIL)</option>
                  <option value="Artificial Intelligence and Data Science">AI & Data Science (AIDS)</option>
                </select>
              </div>

              {/* Class & Section */}
              <div>
                <label htmlFor="class-section" className="block font-semibold text-slate-800 mb-1">
                  Class & Section <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  id="class-section"
                  required
                  value={formData.className}
                  onChange={(e) => handleFieldChange('className', e.target.value)}
                  onBlur={handleBlur}
                  onInput={handleInput}
                  placeholder="e.g. III Year CSE - B"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              {/* Current Semester */}
              <div>
                <label htmlFor="semester" className="block font-semibold text-slate-800 mb-1">
                  Current Semester <span className="text-rose-500">*</span>
                </label>
                <select
                  id="semester"
                  required
                  value={formData.semester}
                  onChange={(e) => handleFieldChange('semester', Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                    <option key={sem} value={sem}>
                      Semester {sem} ({sem % 2 === 1 ? 'Odd' : 'Even'})
                    </option>
                  ))}
                </select>
              </div>

              {/* Date of Birth */}
              <div>
                <label htmlFor="dob" className="block font-semibold text-slate-800 mb-1">
                  Date of Birth <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  id="dob"
                  required
                  value={formData.dob}
                  onChange={(e) => handleFieldChange('dob', e.target.value)}
                  onBlur={handleBlur}
                  onInput={handleInput}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              {/* Gender */}
              <div>
                <label htmlFor="gender" className="block font-semibold text-slate-800 mb-1">
                  Gender <span className="text-rose-500">*</span>
                </label>
                <select
                  id="gender"
                  required
                  value={formData.gender}
                  onChange={(e) => handleFieldChange('gender', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Blood Group */}
              <div>
                <label htmlFor="blood-group" className="block font-semibold text-slate-800 mb-1">
                  Blood Group <span className="text-rose-500">*</span>
                </label>
                <select
                  id="blood-group"
                  required
                  value={formData.bloodGroup}
                  onChange={(e) => handleFieldChange('bloodGroup', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-bold text-rose-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map((bg) => (
                    <option key={bg} value={bg}>
                      {bg}
                    </option>
                  ))}
                </select>
              </div>

              {/* Class Advisor */}
              <div className="sm:col-span-2 lg:col-span-3">
                <label htmlFor="advisor" className="block font-semibold text-slate-800 mb-1">
                  Assigned Class Advisor / Mentor
                </label>
                <input
                  type="text"
                  id="advisor"
                  value={formData.mentorName}
                  onChange={(e) => handleFieldChange('mentorName', e.target.value)}
                  placeholder="e.g. Dr. K. Senthil Kumar (Associate Professor)"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>
          </Card>

          {/* Section B: Commute & Residence Details */}
          <Card
            title={
              <div className="flex items-center gap-2">
                <Bus className="w-4 h-4 text-emerald-600" />
                <span>Section B: Commute & Residence Details</span>
              </div>
            }
            subtitle="Campus transit mode determines gate attendance logging and late-arrival dispatch thresholds"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {/* Scholar Type */}
              <div>
                <label htmlFor="scholar-type" className="block font-semibold text-slate-800 mb-1">
                  Scholar Type <span className="text-rose-500">*</span>
                </label>
                <select
                  id="scholar-type"
                  required
                  value={formData.scholarType}
                  onChange={(e) => {
                    const nextVal = e.target.value as any;
                    handleFieldChange('scholarType', nextVal);
                    if (nextVal === 'Hostelite') {
                      handleFieldChange('modeOfTransport', 'Hostel Resident');
                      handleFieldChange('transportReference', 'Block B, Room 204');
                    } else {
                      handleFieldChange('modeOfTransport', 'College Bus');
                      handleFieldChange('transportReference', 'Route 14 (Tambaram to MSEC)');
                    }
                  }}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="Day Scholar">Day Scholar (Commuter)</option>
                  <option value="Hostelite">Hosteller (Campus Resident)</option>
                </select>
              </div>

              {/* Mode of Transport */}
              <div>
                <label htmlFor="mode-of-transport" className="block font-semibold text-slate-800 mb-1">
                  Mode of Daily Transport <span className="text-rose-500">*</span>
                </label>
                <select
                  id="mode-of-transport"
                  required
                  value={formData.modeOfTransport}
                  onChange={(e) => handleFieldChange('modeOfTransport', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  {formData.scholarType === 'Hostelite' ? (
                    <option value="Hostel Resident">Hostel Resident (On-campus)</option>
                  ) : (
                    <>
                      <option value="College Bus">Official College Bus</option>
                      <option value="Suburban Train">Suburban Train (Kodambakkam Station)</option>
                      <option value="MTC Public Bus">MTC Public Bus</option>
                      <option value="Two-Wheeler / Own Vehicle">Two-Wheeler / Personal Vehicle</option>
                      <option value="Walk / Bicycle">Bicycle / Walking</option>
                    </>
                  )}
                </select>
              </div>

              {/* Transport Reference (Dynamic Label) */}
              <div className="sm:col-span-2">
                <label htmlFor="transport-ref" className="block font-semibold text-slate-800 mb-1">
                  {formData.scholarType === 'Day Scholar'
                    ? 'Bus Route No. & Boarding Point / Commute Details'
                    : 'Hostel Block & Room Number'}{' '}
                  <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  id="transport-ref"
                  required
                  value={formData.transportReference}
                  onChange={(e) => handleFieldChange('transportReference', e.target.value)}
                  onBlur={handleBlur}
                  onInput={handleInput}
                  placeholder={
                    formData.scholarType === 'Day Scholar'
                      ? 'e.g. Route 14 (Tambaram Sanatorium Boarding Point)'
                      : 'e.g. Cauvery Men’s Hostel Block B, Room 204'
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              {/* Student Mobile */}
              <div>
                <label htmlFor="student-mobile" className="block font-semibold text-slate-800 mb-1">
                  Student Mobile Number
                </label>
                <input
                  type="tel"
                  id="student-mobile"
                  name="tel"
                  inputMode="numeric"
                  value={formData.studentMobile}
                  onChange={(e) => handleFieldChange('studentMobile', e.target.value)}
                  placeholder="e.g. 98401 98765"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              {/* Student Email */}
              <div>
                <label htmlFor="student-email" className="block font-semibold text-slate-800 mb-1">
                  Student College Email
                </label>
                <input
                  type="email"
                  id="student-email"
                  name="email"
                  value={formData.studentEmail}
                  onChange={(e) => handleFieldChange('studentEmail', e.target.value)}
                  placeholder="student@student.msec.edu.in"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>
          </Card>

          {/* Section C: Parent / Guardian Communication Profile */}
          <Card
            title={
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-600" />
                <span>Section C: Parent / Guardian Communication Profile</span>
              </div>
            }
            subtitle="CRITICAL: This contact receives instant automated SMS/App notifications if the student arrives late (after 08:30 AM) or is absent."
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              {/* Father Name */}
              <div>
                <label htmlFor="father-name" className="block font-semibold text-slate-800 mb-1">
                  Father's Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  id="father-name"
                  required
                  value={formData.fatherName}
                  onChange={(e) => handleFieldChange('fatherName', e.target.value)}
                  onBlur={handleBlur}
                  onInput={handleInput}
                  placeholder="e.g. Rajesh Kumar"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              {/* Mother Name */}
              <div>
                <label htmlFor="mother-name" className="block font-semibold text-slate-800 mb-1">
                  Mother's Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  id="mother-name"
                  required
                  value={formData.motherName}
                  onChange={(e) => handleFieldChange('motherName', e.target.value)}
                  onBlur={handleBlur}
                  onInput={handleInput}
                  placeholder="e.g. Meenakshi Kumar"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              {/* Primary Account Relation */}
              <div>
                <label htmlFor="account-relation" className="block font-semibold text-slate-800 mb-1">
                  Primary Account Holder <span className="text-rose-500">*</span>
                </label>
                <select
                  id="account-relation"
                  required
                  value={formData.primaryAccountRelation}
                  onChange={(e) => handleFieldChange('primaryAccountRelation', e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="Father">Father (Primary Recipient)</option>
                  <option value="Mother">Mother (Primary Recipient)</option>
                  <option value="Guardian">Legal Guardian</option>
                </select>
              </div>

              {/* Parent Mobile Number (Required, 10-digit) */}
              <div className="sm:col-span-2 lg:col-span-1">
                <label htmlFor="parent-phone" className="block font-semibold text-slate-800 mb-1">
                  Parent Mobile Number <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-xs font-bold text-slate-400">+91</span>
                  <input
                    type="tel"
                    id="parent-phone"
                    name="parentPhone"
                    inputMode="numeric"
                    autoComplete="tel"
                    required
                    pattern="[0-9]{10}"
                    value={formData.parentPhone}
                    onChange={(e) => handleFieldChange('parentPhone', e.target.value.replace(/[^0-9]/g, '').slice(0, 10))}
                    onBlur={handleBlur}
                    onInput={handleInput}
                    placeholder="10-digit mobile"
                    className="w-full pl-11 pr-3 py-2 rounded-lg border border-slate-300 font-mono text-xs font-bold text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <span className="text-[10px] text-amber-700 font-medium mt-0.5 block">
                  Mandatory for automated late-arrival SMS
                </span>
              </div>

              {/* Parent Email Address */}
              <div className="sm:col-span-2">
                <label htmlFor="parent-email" className="block font-semibold text-slate-800 mb-1">
                  Parent Email Address <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  id="parent-email"
                  name="parentEmail"
                  autoComplete="email"
                  required
                  value={formData.parentEmail}
                  onChange={(e) => handleFieldChange('parentEmail', e.target.value)}
                  onBlur={handleBlur}
                  onInput={handleInput}
                  placeholder="parent@example.com (Official statement of marks recipient)"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              {/* Residential Address */}
              <div className="sm:col-span-2 lg:col-span-3">
                <label htmlFor="address" className="block font-semibold text-slate-800 mb-1">
                  Residential Street Address <span className="text-rose-500">*</span>
                </label>
                <textarea
                  id="address"
                  name="streetAddress"
                  autoComplete="street-address"
                  required
                  rows={2}
                  value={formData.residentialAddress}
                  onChange={(e) => handleFieldChange('residentialAddress', e.target.value)}
                  onBlur={handleBlur}
                  onInput={handleInput}
                  placeholder="Door No, Street Name, Area..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              {/* City */}
              <div>
                <label htmlFor="city" className="block font-semibold text-slate-800 mb-1">
                  City / Town <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  id="city"
                  autoComplete="address-level2"
                  required
                  value={formData.city}
                  onChange={(e) => handleFieldChange('city', e.target.value)}
                  onBlur={handleBlur}
                  onInput={handleInput}
                  placeholder="e.g. Chennai"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              {/* Pin Code */}
              <div>
                <label htmlFor="pincode" className="block font-semibold text-slate-800 mb-1">
                  Postal PIN Code <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  id="pincode"
                  name="postalCode"
                  inputMode="numeric"
                  autoComplete="postal-code"
                  required
                  pattern="[0-9]{6}"
                  value={formData.pincode}
                  onChange={(e) => handleFieldChange('pincode', e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                  onBlur={handleBlur}
                  onInput={handleInput}
                  placeholder="6-digit PIN"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono text-xs text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>
          </Card>

          {/* Submit Action Box */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-500">
              <span className="font-semibold text-slate-700 block">Instant Institutional Verification:</span>
              Saving will immediately update both student and parent records across Parent, Teacher, and Administrator dashboards.
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Link
                to="/"
                className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-semibold transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                className="px-6 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-1"
              >
                <Save className="w-4 h-4" />
                <span>Save & Verify Records</span>
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};
