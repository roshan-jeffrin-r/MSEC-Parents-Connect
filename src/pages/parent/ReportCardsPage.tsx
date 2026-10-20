import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import {
  FileText,
  Printer,
  Download,
  Award,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  Calendar,
  Building,
  GraduationCap,
  ShieldCheck,
  Check
} from 'lucide-react';

export const ReportCardsPage: React.FC = () => {
  const { currentStudent, reportCards, examinations } = useApp();

  // Find all report cards for current student
  const studentReports = reportCards.filter(
    (rc) => rc.studentId === currentStudent.studentId && rc.isPublished
  );

  const [selectedExamId, setSelectedExamId] = useState<string>(
    studentReports.length > 0 ? studentReports[0].examId : 'EXAM-MODEL'
  );

  const currentReport = studentReports.find((rc) => rc.examId === selectedExamId) || studentReports[0];

  const handlePrint = () => {
    window.print();
  };

  const isCSE = currentStudent.departmentCode === 'CSE' || currentStudent.className.includes('CSE');
  const advisorName = currentStudent.mentorName || (isCSE ? 'Dr. Kavitha Menon' : 'Prof. S. Ramesh');
  const hodName = isCSE ? 'Dr. V. Subramanian' : 'Dr. R. Sundar Raj';

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 no-print">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              Digital Report Cards
            </h1>
            <Badge variant="primary">Official Transcript</Badge>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Certified academic assessment records for <strong className="text-slate-800">{currentStudent.fullName}</strong> ({currentStudent.registerNumber})
          </p>
        </div>

        {/* Print / Download Button */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <Printer className="w-3.5 h-3.5 text-slate-300" />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>

      {/* Examination Selector Tabs */}
      <div className="bg-white p-1.5 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap gap-1.5 no-print">
        {examinations.map((exam) => {
          const hasReport = reportCards.some(
            (r) => r.studentId === currentStudent.studentId && r.examId === exam.examId && r.isPublished
          );
          const isSelected = selectedExamId === exam.examId;

          return (
            <button
              key={exam.examId}
              type="button"
              disabled={!hasReport}
              onClick={() => setSelectedExamId(exam.examId)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                isSelected
                  ? 'bg-blue-600 text-white shadow-xs'
                  : hasReport
                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  : 'bg-slate-50 text-slate-400 cursor-not-allowed border border-dashed border-slate-200'
              }`}
            >
              <span>{exam.examName}</span>
              {hasReport ? (
                <span
                  className={`text-[9px] px-1 py-0.2 rounded font-bold ${
                    isSelected ? 'bg-blue-500 text-white' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  Published
                </span>
              ) : (
                <span className="text-[9px] text-slate-400 italic">Scheduled</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Official Report Card Sheet (High-Fidelity Printable Document) */}
      <div className="bg-white rounded-2xl border border-slate-300 shadow-sm p-4 sm:p-7 print-card print:border-none print:shadow-none print:p-0">
        {/* College Institutional Letterhead Header */}
        <div className="border-b-2 border-slate-900 pb-4 mb-5">
          <div className="flex flex-col sm:flex-row items-center justify-between text-center sm:text-left gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-950 via-blue-900 to-slate-900 text-white flex items-center justify-center font-bold text-lg shadow-xs ring-1 ring-blue-900/30 shrink-0">
                <GraduationCap className="w-6 h-6 text-amber-300" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-black text-slate-950 uppercase tracking-tight font-serif">
                  Meenakshi Sundararajan Engineering College
                </h2>
                <p className="text-xs text-slate-600 font-medium">
                  (An Autonomous Institution Affiliated to Anna University, Chennai)
                </p>
                <p className="text-[10px] text-slate-500">
                  363, Arcot Road, Kodambakkam, Chennai - 600024 • Office of Controller of Examinations
                </p>
              </div>
            </div>

            <div className="text-center sm:text-right border sm:border-0 border-slate-200 rounded-lg p-2 sm:p-0 shrink-0">
              <span className="inline-block px-2.5 py-0.5 bg-blue-50 text-blue-900 border border-blue-200 rounded text-[11px] font-bold uppercase tracking-wider">
                Official Statement of Marks
              </span>
              <p className="text-[10px] text-slate-500 mt-0.5">
                Regulation: <strong className="text-slate-800">2021 CBCS Autonomous</strong>
              </p>
            </div>
          </div>
        </div>

        {/* Student & Examination Information Block */}
        <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 mb-5">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-2.5 gap-x-4 text-xs">
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Student Name</span>
              <strong className="text-slate-900 text-xs sm:text-sm">{currentStudent.fullName}</strong>
            </div>

            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Register Number</span>
              <strong className="text-slate-900 font-mono text-xs sm:text-sm">{currentStudent.registerNumber}</strong>
            </div>

            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Branch & Class</span>
              <strong className="text-slate-800 text-xs">{currentStudent.department} • {currentStudent.className}</strong>
            </div>

            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Examination</span>
              <strong className="text-blue-800 text-xs font-bold">{currentReport?.examName || 'Assessment'}</strong>
            </div>

            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Semester / Batch</span>
              <strong className="text-slate-800 text-xs">Semester {currentStudent.semester} (Odd) • Batch {currentStudent.batch}</strong>
            </div>

            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Publication Date</span>
              <strong className="text-slate-800 text-xs font-mono">{currentReport?.publishedDate || '2026-10-12'}</strong>
            </div>

            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Class Rank Standing</span>
              <strong className="text-emerald-700 text-xs font-bold">
                Rank #{currentReport?.classRank || 4} of {currentReport?.totalStudentsInClass || 62} Students
              </strong>
            </div>

            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Class Advisor</span>
              <strong className="text-slate-800 text-xs">{advisorName}</strong>
            </div>
          </div>
        </div>

        {/* Subject-Wise Marks & Grade Table using responsive-table guidance */}
        {currentReport ? (
          <div className="table-wrapper border border-slate-200 rounded-xl mb-5 shadow-2xs">
            <table
              role="region"
              aria-label="Official Statement of Marks"
              tabIndex={0}
              className="compact-table"
            >
              <thead>
                <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-200">
                  <th className="w-10 text-center">S.No</th>
                  <th className="w-28 text-left">Subject Code</th>
                  <th className="text-left">Subject Title</th>
                  <th className="w-16 text-center">Credits</th>
                  <th className="w-20 text-center">Max Marks</th>
                  <th className="w-20 text-center">Marks</th>
                  <th className="w-20 text-center">Grade</th>
                  <th className="w-16 text-center">Points</th>
                  <th className="w-20 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {currentReport.subjects.map((sub, index) => (
                  <tr key={sub.subjectCode} className="hover:bg-slate-50/70 transition-colors">
                    <td className="text-center text-slate-400 font-mono text-[11px]">{index + 1}</td>
                    <td className="font-mono font-bold text-slate-900 text-xs">{sub.subjectCode}</td>
                    <td className="font-medium text-slate-800">
                      {sub.subjectName}
                      {sub.classAverage && (
                        <span className="text-[10px] text-slate-400 block no-print font-mono">
                          Class Avg: {sub.classAverage} | High: {sub.highestMark}
                        </span>
                      )}
                    </td>
                    <td className="text-center text-slate-600 font-mono">{sub.credits}</td>
                    <td className="text-center text-slate-600 font-mono">{sub.maximumMarks}</td>
                    <td className="text-center font-bold text-slate-900 font-mono text-sm">
                      {sub.marksObtained}
                    </td>
                    <td className="text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded font-bold text-xs ${
                          sub.grade === 'O'
                            ? 'bg-purple-50 text-purple-700 border border-purple-200'
                            : sub.grade === 'A+'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}
                      >
                        {sub.grade}
                      </span>
                    </td>
                    <td className="text-center font-semibold text-slate-700 font-mono">{sub.gradePoints}</td>
                    <td className="text-center">
                      <span className="inline-flex items-center gap-1 font-bold text-emerald-700 text-[11px]">
                        <Check className="w-3 h-3" />
                        {sub.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
              {/* Grand Total Row */}
              <tfoot>
                <tr className="bg-slate-100 font-bold text-slate-900 border-t-2 border-slate-200 text-xs">
                  <td colSpan={3} className="py-2.5 px-3 text-right uppercase tracking-wider text-[10px]">
                    Grand Total
                  </td>
                  <td className="text-center font-mono font-bold">
                    {currentReport.subjects.reduce((sum, s) => sum + s.credits, 0)}
                  </td>
                  <td className="text-center font-mono font-bold">{currentReport.totalMaximumMarks}</td>
                  <td className="text-center font-mono text-sm font-black text-blue-900">
                    {currentReport.totalMarksObtained}
                  </td>
                  <td colSpan={3} className="text-center text-blue-800 font-bold">
                    Overall: {currentReport.percentage}%
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        ) : (
          <div className="py-10 text-center text-slate-400 text-xs">
            No report card published for this assessment yet.
          </div>
        )}

        {/* Assessment Performance Summary Cards */}
        {currentReport && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                Total Marks Percentage
              </span>
              <span className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5 block font-mono">
                {currentReport.percentage}%
              </span>
              <span className="text-[10px] text-slate-500 font-mono">
                ({currentReport.totalMarksObtained} out of {currentReport.totalMaximumMarks})
              </span>
            </div>

            <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200 text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800 block">
                Semester GPA
              </span>
              <span className="text-xl sm:text-2xl font-black text-blue-950 mt-0.5 block font-mono">
                {currentReport.gpa} / 10.0
              </span>
              <span className="text-[10px] text-blue-700 font-mono">Cumulative CGPA: {currentReport.cgpa}</span>
            </div>

            <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">
                Assessment Standing
              </span>
              <span className="text-xs font-black text-emerald-900 mt-1.5 block">
                {currentReport.resultStatus}
              </span>
              <span className="text-[10px] text-emerald-700 font-medium">All Courses Cleared</span>
            </div>
          </div>
        )}

        {/* Teacher Remarks Box */}
        {currentReport && (
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl mb-5">
            <span className="text-[11px] font-bold text-slate-900 uppercase tracking-wider block">
              Faculty Advisor Remarks:
            </span>
            <p className="text-xs text-slate-700 mt-1 italic leading-relaxed">
              "{currentReport.teacherRemarks}"
            </p>
            <span className="text-[10px] text-slate-500 mt-1 block font-medium">
              — {advisorName} ({currentStudent.department})
            </span>
          </div>
        )}

        {/* Grading Scale Legend Note */}
        <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl mb-6 text-[10px] text-slate-600 no-print">
          <div className="font-bold text-slate-800 mb-1 flex items-center gap-1">
            <HelpCircle className="w-3 h-3 text-blue-600" />
            <span>Anna University 10-Point CBCS Grading Scale:</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-6 gap-1.5 text-center mt-1.5 font-mono">
            <div className="p-1 bg-white rounded border border-slate-200">
              <strong className="text-purple-700">O</strong>: 91-100 (10 Pts)
            </div>
            <div className="p-1 bg-white rounded border border-slate-200">
              <strong className="text-blue-700">A+</strong>: 81-90 (9 Pts)
            </div>
            <div className="p-1 bg-white rounded border border-slate-200">
              <strong className="text-emerald-700">A</strong>: 71-80 (8 Pts)
            </div>
            <div className="p-1 bg-white rounded border border-slate-200">
              <strong className="text-amber-700">B+</strong>: 61-70 (7 Pts)
            </div>
            <div className="p-1 bg-white rounded border border-slate-200">
              <strong className="text-slate-700">B</strong>: 50-60 (6 Pts)
            </div>
            <div className="p-1 bg-white rounded border border-slate-200">
              <strong className="text-rose-700">RA</strong>: &lt;50 (0 Pts)
            </div>
          </div>
        </div>

        {/* Institutional Signatures / Seal Block for PDF Printing */}
        <div className="mt-8 pt-4 border-t border-slate-300 grid grid-cols-3 gap-4 text-center text-xs">
          <div>
            <div className="h-10 flex items-end justify-center font-serif text-slate-700 italic">
              {advisorName}
            </div>
            <div className="border-t border-slate-400 pt-1 font-semibold text-slate-800 text-[11px]">
              Class Advisor
            </div>
            <span className="text-[10px] text-slate-500">{currentStudent.department}</span>
          </div>

          <div>
            <div className="h-10 flex items-end justify-center font-serif text-slate-700 italic">
              {hodName}
            </div>
            <div className="border-t border-slate-400 pt-1 font-semibold text-slate-800 text-[11px]">
              Head of Department
            </div>
            <span className="text-[10px] text-slate-500">{currentStudent.department}</span>
          </div>

          <div>
            <div className="h-10 flex items-end justify-center font-serif text-slate-700 italic">
              Dr. R. Ramanathan
            </div>
            <div className="border-t border-slate-400 pt-1 font-semibold text-slate-800 text-[11px]">
              Controller of Examinations
            </div>
            <span className="text-[10px] text-slate-500">MSEC Autonomous</span>
          </div>
        </div>

        {/* Verification Footer */}
        <div className="mt-6 text-center text-[10px] text-slate-400 print:block">
          Official digital grade sheet generated by MSEC Parent Connect on {new Date().toLocaleDateString()}. Fictional prototype record.
        </div>
      </div>
    </div>
  );
};
