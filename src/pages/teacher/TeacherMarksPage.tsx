import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
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
  FileCheck
} from 'lucide-react';

export const TeacherMarksPage: React.FC = () => {
  const {
    currentTeacher,
    students,
    examinations,
    reportCards,
    updateReportCardMarks,
    publishReportCard
  } = useApp();

  const cseStudents = students.filter((s) => s.className === 'III Year CSE - B');

  const [selectedExamId, setSelectedExamId] = useState<string>('EXAM-MODEL');
  const [selectedSubjectCode, setSelectedSubjectCode] = useState<string>('CS3301');

  // Find Aarav's report card for this exam
  const aaravReport = reportCards.find(
    (rc) => rc.studentId === 'STU-001' && rc.examId === selectedExamId
  );

  const [aaravMarks, setAaravMarks] = useState<number>(
    aaravReport?.subjects.find((s) => s.subjectCode === selectedSubjectCode)?.marksObtained || 93
  );

  const [teacherRemarks, setTeacherRemarks] = useState<string>(
    aaravReport?.teacherRemarks ||
      'Aarav shows excellent analytical thinking in Data Structures and DBMS. Consistent lab execution.'
  );

  const [showPublishModal, setShowPublishModal] = useState(false);
  const [savedBanner, setSavedBanner] = useState(false);

  const currentExam = examinations.find((e) => e.examId === selectedExamId);
  const isCurrentlyPublished = currentExam?.publicationStatus === 'Published';

  const maxMarks = selectedExamId === 'EXAM-MODEL' ? 100 : 50;

  const handleSaveMarks = () => {
    if (!aaravReport) return;

    // Update the subject mark inside aarav's report card
    const updatedSubjects = aaravReport.subjects.map((s) => {
      if (s.subjectCode === selectedSubjectCode) {
        const grade =
          aaravMarks >= 91 ? 'O' : aaravMarks >= 81 ? 'A+' : aaravMarks >= 71 ? 'A' : 'B+';
        const gradePoints =
          aaravMarks >= 91 ? 10 : aaravMarks >= 81 ? 9 : aaravMarks >= 71 ? 8 : 7;
        return {
          ...s,
          marksObtained: aaravMarks,
          grade: grade as any,
          gradePoints
        };
      }
      return s;
    });

    updateReportCardMarks(aaravReport.reportCardId, updatedSubjects, teacherRemarks);
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
            <Badge variant="primary">III Year CSE - B</Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Faculty: <strong className="text-slate-800">{currentTeacher.fullName}</strong> • Subject: CS3301 Data Structures
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
              {currentTeacher.assignedSubjects.map((s) => (
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
              {cseStudents.map((s, idx) => {
                const isAarav = s.studentId === 'STU-001';
                const marksVal = isAarav ? aaravMarks : idx === 1 ? 84 : idx === 2 ? 88 : 79;
                const grade =
                  marksVal >= 91 ? 'O' : marksVal >= 81 ? 'A+' : marksVal >= 71 ? 'A' : 'B+';

                return (
                  <tr
                    key={s.studentId}
                    className={`hover:bg-slate-50 transition-colors ${
                      isAarav ? 'bg-blue-50/40 ring-1 ring-blue-200' : ''
                    }`}
                  >
                    <td className="py-3 px-4 text-center text-slate-400 font-medium">{idx + 1}</td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">{s.registerNumber}</td>
                    <td className="py-3 px-4">
                      <strong className="text-slate-900">{s.fullName}</strong>
                      {isAarav && (
                        <span className="ml-2 text-[10px] bg-blue-100 text-blue-800 font-bold px-1.5 py-0.5 rounded">
                          Demo Student
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center text-slate-600 font-semibold">{maxMarks}</td>
                    <td className="py-3 px-4 text-center">
                      {isAarav ? (
                        <input
                          type="number"
                          min={0}
                          max={maxMarks}
                          value={aaravMarks}
                          onChange={(e) => setAaravMarks(Number(e.target.value))}
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

        {/* Advisor Remarks for Aarav */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
          <label className="block text-xs font-bold text-slate-800">
            Class Advisor Remarks for Aarav Kumar:
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
              : 'Publishing will make the official Statement of Marks immediately accessible to all parents of III Year CSE - B, and send an automated in-app notification.'}
          </p>
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 font-medium">
            Examination: <strong>{currentExam?.examName}</strong>
          </div>
        </div>
      </Modal>
    </div>
  );
};
