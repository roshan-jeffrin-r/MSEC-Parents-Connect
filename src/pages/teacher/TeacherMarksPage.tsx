import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp, matchesAssignedClass } from '../../context/AppContext';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import {
  Award,
  BookOpen,
  CheckCircle2,
  Save,
  Globe,
  AlertTriangle,
  FileCheck,
  ShieldCheck
} from 'lucide-react';

export const TeacherMarksPage: React.FC = () => {
  const {
    currentStaff,
    students,
    examinations,
    reportCards,
    updateReportCardMarks,
    publishReportCard
  } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentStaff) {
      navigate('/teacher/login');
    }
  }, [currentStaff, navigate]);

  const scopedStudents = students.filter((s) =>
    currentStaff ? matchesAssignedClass(s.className, currentStaff.assignedClass) : false
  );

  const availableClasses = Array.from(new Set(scopedStudents.map((s) => s.className)));
  const [selectedClass, setSelectedClass] = useState<string>('');

  useEffect(() => {
    if (availableClasses.length > 0 && (!selectedClass || !availableClasses.includes(selectedClass))) {
      setSelectedClass(availableClasses[0]);
    }
  }, [availableClasses, selectedClass]);

  const effectiveClass = selectedClass || availableClasses[0] || (currentStaff ? currentStaff.assignedClass : 'CSE-B');
  const classStudents = scopedStudents.filter((s) => s.className === effectiveClass);

  const [selectedExamId, setSelectedExamId] = useState<string>('EXAM-MODEL');

  // Subjects based on staff department
  const subjectsList =
    currentStaff?.department === 'ECE'
      ? [
          { subjectCode: 'EC3301', subjectName: 'Signals and Systems' },
          { subjectCode: 'EC3302', subjectName: 'Digital Electronics' },
          { subjectCode: 'EC3303', subjectName: 'Analog Circuits' }
        ]
      : [
          { subjectCode: 'CS3301', subjectName: 'Data Structures' },
          { subjectCode: 'CS3391', subjectName: 'Object Oriented Programming' },
          { subjectCode: 'MA3354', subjectName: 'Discrete Mathematics' }
        ];

  const [selectedSubjectCode, setSelectedSubjectCode] = useState<string>(subjectsList[0].subjectCode);

  const firstStudent = classStudents[0];
  const targetReport = reportCards.find(
    (rc) => (rc.studentId === firstStudent?.studentId || rc.studentId === 'STU-001') && rc.examId === selectedExamId
  );

  const [studentMarks, setStudentMarks] = useState<number>(
    targetReport?.subjects.find((s) => s.subjectCode === selectedSubjectCode)?.marksObtained || 93
  );

  const [teacherRemarks, setTeacherRemarks] = useState<string>(
    targetReport?.teacherRemarks ||
      'Student demonstrates strong grasp of core fundamentals and analytical problem-solving.'
  );

  const [showPublishModal, setShowPublishModal] = useState(false);
  const [savedBanner, setSavedBanner] = useState(false);

  if (!currentStaff) return null;

  const currentExam = examinations.find((e) => e.examId === selectedExamId);
  const isCurrentlyPublished = currentExam?.publicationStatus === 'Published';
  const maxMarks = selectedExamId === 'EXAM-MODEL' ? 100 : 50;

  const handleSaveMarks = () => {
    if (!targetReport) return;

    const updatedSubjects = targetReport.subjects.map((s) => {
      if (s.subjectCode === selectedSubjectCode) {
        const grade =
          studentMarks >= 91 ? 'O' : studentMarks >= 81 ? 'A+' : studentMarks >= 71 ? 'A' : 'B+';
        const gradePoints =
          studentMarks >= 91 ? 10 : studentMarks >= 81 ? 9 : studentMarks >= 71 ? 8 : 7;
        return {
          ...s,
          marksObtained: studentMarks,
          grade: grade as any,
          gradePoints
        };
      }
      return s;
    });

    updateReportCardMarks(targetReport.reportCardId, updatedSubjects, teacherRemarks);
    setSavedBanner(true);
    setTimeout(() => setSavedBanner(false), 4000);
  };

  const handleTogglePublish = () => {
    publishReportCard(selectedExamId, !isCurrentlyPublished);
    setShowPublishModal(false);
    setSavedBanner(true);
    setTimeout(() => setSavedBanner(false), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Assessment Marks Entry & Publishing
            </h1>
            <Badge variant="primary">{effectiveClass}</Badge>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-md">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              Scope: {currentStaff.assignedClass}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Faculty: <strong className="text-slate-800">{currentStaff.fullName}</strong> • Department of {currentStaff.department}
          </p>
        </div>

        {/* Publish / Unpublish Toggle Button */}
        <button
          type="button"
          onClick={() => setShowPublishModal(true)}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs ${
            isCurrentlyPublished
              ? 'bg-amber-100 text-amber-900 hover:bg-amber-200 border border-amber-300'
              : 'bg-emerald-600 hover:bg-emerald-700 text-white'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>{isCurrentlyPublished ? 'Unpublish from Parents' : 'Publish Report Cards'}</span>
        </button>
      </div>

      {savedBanner && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-xs font-semibold flex items-center gap-2.5 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Marks and report card status successfully updated! Reflected in parent digital report cards.</span>
        </div>
      )}

      {/* Selectors Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          {availableClasses.length > 1 && (
            <div>
              <label className="block text-[10px] font-semibold uppercase text-slate-400 mb-0.5">
                Section
              </label>
              <select
                value={effectiveClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-800 bg-white"
              >
                {availableClasses.map((cls) => (
                  <option key={cls} value={cls}>
                    {cls}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-[10px] font-semibold uppercase text-slate-400 mb-0.5">
              Select Examination
            </label>
            <select
              value={selectedExamId}
              onChange={(e) => setSelectedExamId(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-800 bg-white"
            >
              {examinations.map((ex) => (
                <option key={ex.examId} value={ex.examId}>
                  {ex.examName} ({ex.publicationStatus})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-semibold uppercase text-slate-400 mb-0.5">
              Course / Subject
            </label>
            <select
              value={selectedSubjectCode}
              onChange={(e) => setSelectedSubjectCode(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-800 bg-white"
            >
              {subjectsList.map((s) => (
                <option key={s.subjectCode} value={s.subjectCode}>
                  {s.subjectCode} — {s.subjectName}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant={isCurrentlyPublished ? 'success' : 'warning'}>
            Status: {isCurrentlyPublished ? 'Published to Parents' : 'Draft / Grading in Progress'}
          </Badge>
        </div>
      </div>

      {/* Marks Entry Table */}
      <Card
        title={
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-purple-600" />
            <span>Class Marks Entry Register (Max Marks: {maxMarks})</span>
          </div>
        }
        subtitle="Enter or adjust marks for students. Edits update the student's GPA, percentage, and report card transcript."
      >
        <div className="overflow-x-auto border border-slate-200 rounded-xl mb-4">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <th className="py-3 px-4 w-14 text-center">S.No</th>
                <th className="py-3 px-4 w-32">Register No</th>
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4 w-32 text-center">Max Marks</th>
                <th className="py-3 px-4 w-40 text-center">Marks Obtained</th>
                <th className="py-3 px-4 w-28 text-center">Calculated Grade</th>
                <th className="py-3 px-4 w-28 text-center">Result</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {classStudents.map((s, idx) => {
                const isTarget = s.studentId === (firstStudent?.studentId || 'STU-001');
                const marksVal = isTarget ? studentMarks : idx === 1 ? 84 : idx === 2 ? 88 : 79;
                const grade =
                  marksVal >= 91 ? 'O' : marksVal >= 81 ? 'A+' : marksVal >= 71 ? 'A' : 'B+';

                return (
                  <tr
                    key={s.studentId}
                    className={`hover:bg-slate-50 transition-colors ${
                      isTarget ? 'bg-blue-50/40 ring-1 ring-blue-200' : ''
                    }`}
                  >
                    <td className="py-3 px-4 text-center text-slate-400 font-medium">{idx + 1}</td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">{s.registerNumber}</td>
                    <td className="py-3 px-4">
                      <strong className="text-slate-900">{s.fullName}</strong>
                      {isTarget && (
                        <span className="ml-2 text-[10px] bg-blue-100 text-blue-800 font-bold px-1.5 py-0.5 rounded">
                          Selected Student
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center text-slate-600 font-semibold">{maxMarks}</td>
                    <td className="py-3 px-4 text-center">
                      {isTarget ? (
                        <input
                          type="number"
                          min={0}
                          max={maxMarks}
                          value={studentMarks}
                          onChange={(e) => setStudentMarks(Number(e.target.value))}
                          className="w-20 px-2 py-1 rounded border border-blue-400 bg-blue-50 text-center font-bold text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                      ) : (
                        <span className="font-semibold text-slate-800">{marksVal}</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Badge variant="primary" size="sm">
                        Grade {grade}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-center font-semibold text-emerald-700">
                      PASS
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Advisor Remarks */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
          <label className="block text-xs font-bold text-slate-800">
            Class Advisor Remarks for {firstStudent?.fullName || 'Student'}:
          </label>
          <textarea
            rows={2}
            value={teacherRemarks}
            onChange={(e) => setTeacherRemarks(e.target.value)}
            className="w-full p-2.5 rounded-lg border border-slate-300 text-xs text-slate-800 bg-white"
          />
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-400">
              Remarks appear directly on the parent's printable report card.
            </span>
            <button
              type="button"
              onClick={handleSaveMarks}
              className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-bold transition-colors shadow-2xs flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save & Calculate GPA</span>
            </button>
          </div>
        </div>
      </Card>

      {/* Confirmation Modal */}
      <Modal
        isOpen={showPublishModal}
        onClose={() => setShowPublishModal(false)}
        title={isCurrentlyPublished ? 'Unpublish Examination Results?' : 'Publish Examination Results to Parents?'}
        footer={
          <div className="w-full flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowPublishModal(false)}
              className="px-3 py-1.5 border border-slate-200 text-slate-700 rounded-lg text-xs font-medium hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleTogglePublish}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold shadow-xs ${
                isCurrentlyPublished
                  ? 'bg-amber-600 hover:bg-amber-700 text-white'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
            >
              {isCurrentlyPublished ? 'Confirm Unpublish' : 'Confirm & Publish'}
            </button>
          </div>
        }
      >
        <div className="space-y-3 text-xs text-slate-700 leading-relaxed">
          <p>
            {isCurrentlyPublished
              ? 'Unpublishing will hide this report card from parent portals while revisions are being made.'
              : `Publishing will make the official Statement of Marks immediately accessible to all parents of ${effectiveClass}, and send an automated in-app notification.`}
          </p>
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 font-medium">
            Examination: <strong>{currentExam?.examName}</strong>
          </div>
        </div>
      </Modal>
    </div>
  );
};
