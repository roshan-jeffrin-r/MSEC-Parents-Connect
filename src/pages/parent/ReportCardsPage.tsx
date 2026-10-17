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
  GraduationCap
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

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Digital Report Cards
            </h1>
            <Badge variant="primary">Official Transcript</Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Certified academic assessment records for <strong className="text-slate-800">{currentStudent.fullName}</strong> ({currentStudent.registerNumber})
          </p>
        </div>

        {/* Print / Download Button */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <Printer className="w-4 h-4 text-slate-300" />
            <span>Print / Save as PDF</span>
          </button>
        </div>
      </div>

      {/* Examination Selector Tabs */}
      <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-xs flex flex-wrap gap-2 no-print">
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
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
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
                  className={`text-[10px] px-1.5 py-0.5 rounded ${
                    isSelected ? 'bg-blue-500 text-white' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  Published
                </span>
              ) : (
                <span className="text-[10px] text-slate-400 italic">Scheduled</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Official Report Card Sheet (High-Fidelity Printable Document) */}
      <div className="bg-white rounded-2xl border border-slate-300 shadow-sm p-6 sm:p-10 print-card print:border-none print:shadow-none print:p-0">
        {/* College Institutional Letterhead Header */}
        <div className="border-b-2 border-slate-900 pb-6 mb-6">
          <div className="flex flex-col sm:flex-row items-center justify-between text-center sm:text-left gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-950 via-blue-900 to-slate-900 text-white flex items-center justify-center font-bold text-xl shadow-md ring-2 ring-blue-900/30">
                <GraduationCap className="w-8 h-8 text-amber-300" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-black text-slate-950 uppercase tracking-tight font-serif">
                  Meenakshi Sundararajan Engineering College
                </h2>
                <p className="text-xs text-slate-600 font-medium">
                  (An Autonomous Institution Affiliated to Anna University, Chennai)
                </p>
                <p className="text-[11px] text-slate-500">
                  363, Arcot Road, Kodambakkam, Chennai - 600024 • Office of the Controller of Examinations
                </p>
              </div>
            </div>

            <div className="text-center sm:text-right border sm:border-0 border-slate-200 rounded-lg p-2 sm:p-0">
              <span className="inline-block px-3 py-1 bg-blue-50 text-blue-900 border border-blue-200 rounded-md text-xs font-bold uppercase tracking-wider">
                Official Statement of Marks
              </span>
              <p className="text-[11px] text-slate-500 mt-1">
                Regulation: <strong className="text-slate-800">2021 Choice Based Credit System (CBCS)</strong>
              </p>
            </div>
          </div>
        </div>

        {/* Student & Examination Information Block */}
        <div className="bg-slate-50/80 rounded-xl p-4 sm:p-5 border border-slate-200/90 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-3 gap-x-6 text-xs">
            <div>
              <span className="text-slate-500 block text-[11px]">Student Full Name</span>
              <strong className="text-slate-900 text-sm">{currentStudent.fullName}</strong>
            </div>

            <div>
              <span className="text-slate-500 block text-[11px]">Register Number / ID</span>
              <strong className="text-slate-900 font-mono text-sm">{currentStudent.registerNumber}</strong>
            </div>

            <div>
              <span className="text-slate-500 block text-[11px]">Branch / Department</span>
              <strong className="text-slate-800">{currentStudent.department}</strong>
            </div>

            <div>
              <span className="text-slate-500 block text-[11px]">Class & Section</span>
              <strong className="text-slate-800">{currentStudent.className}</strong>
            </div>

            <div>
              <span className="text-slate-500 block text-[11px]">Examination</span>
              <strong className="text-blue-800 font-semibold">{currentReport?.examName || 'Assessment'}</strong>
            </div>

            <div>
              <span className="text-slate-500 block text-[11px]">Semester & Academic Year</span>
              <strong className="text-slate-800">Semester {currentStudent.semester} (Odd) • {currentStudent.academicYear}</strong>
            </div>

            <div>
              <span className="text-slate-500 block text-[11px]">Publication Date</span>
              <strong className="text-slate-800">{currentReport?.publishedDate || '2026-10-12'}</strong>
            </div>

            <div>
              <span className="text-slate-500 block text-[11px]">Class Rank Standing</span>
              <strong className="text-emerald-700 font-bold">
                Rank #{currentReport?.classRank || 4} of {currentReport?.totalStudentsInClass || 62} students
              </strong>
            </div>
          </div>
        </div>

        {/* Subject-Wise Marks & Grade Table */}
        {currentReport ? (
          <div className="overflow-x-auto border border-slate-200 rounded-xl mb-6 shadow-2xs">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100/90 text-slate-800 font-bold border-b border-slate-200">
                  <th className="py-3 px-3 w-12 text-center">S.No</th>
                  <th className="py-3 px-3 w-28">Subject Code</th>
                  <th className="py-3 px-4">Subject Title</th>
                  <th className="py-3 px-3 text-center">Credits</th>
                  <th className="py-3 px-3 text-center">Max Marks</th>
                  <th className="py-3 px-3 text-center">Marks Obtained</th>
                  <th className="py-3 px-3 text-center">Letter Grade</th>
                  <th className="py-3 px-3 text-center">Grade Point</th>
                  <th className="py-3 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {currentReport.subjects.map((sub, index) => (
                  <tr key={sub.subjectCode} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-2.5 px-3 text-center text-slate-400 font-medium">{index + 1}</td>
                    <td className="py-2.5 px-3 font-mono font-semibold text-slate-900">{sub.subjectCode}</td>
                    <td className="py-2.5 px-4 font-medium text-slate-800">
                      {sub.subjectName}
                      {sub.classAverage && (
                        <span className="text-[10px] text-slate-400 block no-print">
                          Class Avg: {sub.classAverage} | Highest: {sub.highestMark}
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-center text-slate-600">{sub.credits}</td>
                    <td className="py-2.5 px-3 text-center text-slate-600">{sub.maximumMarks}</td>
                    <td className="py-2.5 px-3 text-center font-bold text-slate-900 text-sm">
                      {sub.marksObtained}
                    </td>
                    <td className="py-2.5 px-3 text-center">
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
                    <td className="py-2.5 px-3 text-center font-semibold text-slate-700">{sub.gradePoints}</td>
                    <td className="py-2.5 px-3 text-center">
                      <span className="inline-flex items-center gap-1 font-semibold text-emerald-700">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {sub.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
              {/* Grand Total Row */}
              <tfoot>
                <tr className="bg-slate-100/80 font-bold text-slate-900 border-t-2 border-slate-200">
                  <td colSpan={3} className="py-3 px-4 text-right uppercase tracking-wider text-[11px]">
                    Grand Total
                  </td>
                  <td className="py-3 px-3 text-center">
                    {currentReport.subjects.reduce((sum, s) => sum + s.credits, 0)}
                  </td>
                  <td className="py-3 px-3 text-center">{currentReport.totalMaximumMarks}</td>
                  <td className="py-3 px-3 text-center text-sm font-black text-blue-900">
                    {currentReport.totalMarksObtained}
                  </td>
                  <td colSpan={3} className="py-3 px-4 text-center text-blue-800 font-bold">
                    Overall: {currentReport.percentage}%
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center text-slate-400 text-sm">
            No report card published for this assessment yet.
          </div>
        )}

        {/* Assessment Performance Summary Cards */}
        {currentReport && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block">
                Total Marks Percentage
              </span>
              <span className="text-2xl font-black text-slate-900 mt-1 block">
                {currentReport.percentage}%
              </span>
              <span className="text-[11px] text-slate-500">
                ({currentReport.totalMarksObtained} out of {currentReport.totalMaximumMarks})
              </span>
            </div>

            <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-center">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-800 block">
                Semester Grade Point Average (GPA)
              </span>
              <span className="text-2xl font-black text-blue-950 mt-1 block">
                {currentReport.gpa} / 10.0
              </span>
              <span className="text-[11px] text-blue-700">Cumulative CGPA: {currentReport.cgpa}</span>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 text-center">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-800 block">
                Final Assessment Result
              </span>
              <span className="text-sm font-extrabold text-emerald-900 mt-2 block">
                {currentReport.resultStatus}
              </span>
              <span className="text-[11px] text-emerald-700">All Subjects Cleared</span>
            </div>
          </div>
        )}

        {/* Teacher Remarks Box */}
        {currentReport && (
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl mb-8">
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
              Class Advisor & Faculty Remarks
            </span>
            <p className="text-xs text-slate-700 mt-1 italic leading-relaxed">
              "{currentReport.teacherRemarks}"
            </p>
          </div>
        )}

        {/* Grading Scale Legend Note */}
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl mb-8 text-[11px] text-slate-600">
          <div className="font-bold text-slate-800 mb-1 flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
            <span>Sample Anna University 10-Point CBCS Grading Scale Definition:</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-center mt-2 font-mono">
            <div className="p-1 bg-white rounded border border-slate-200">
              <strong className="text-purple-700">O (Outstanding)</strong>: 91-100 (10 Pts)
            </div>
            <div className="p-1 bg-white rounded border border-slate-200">
              <strong className="text-blue-700">A+ (Excellent)</strong>: 81-90 (9 Pts)
            </div>
            <div className="p-1 bg-white rounded border border-slate-200">
              <strong className="text-emerald-700">A (Very Good)</strong>: 71-80 (8 Pts)
            </div>
            <div className="p-1 bg-white rounded border border-slate-200">
              <strong className="text-amber-700">B+ (Good)</strong>: 61-70 (7 Pts)
            </div>
            <div className="p-1 bg-white rounded border border-slate-200">
              <strong className="text-slate-700">B (Average)</strong>: 50-60 (6 Pts)
            </div>
            <div className="p-1 bg-white rounded border border-slate-200">
              <strong className="text-rose-700">RA (Re-appear)</strong>: &lt;50 (0 Pts)
            </div>
          </div>
        </div>

        {/* Institutional Signatures / Seal Block for PDF Printing */}
        <div className="mt-12 pt-6 border-t border-slate-300 grid grid-cols-3 gap-6 text-center text-xs">
          <div>
            <div className="h-12 flex items-end justify-center font-serif text-slate-700 italic">
              Dr. K. Senthil Kumar
            </div>
            <div className="border-t border-slate-400 pt-1 font-semibold text-slate-800">
              Class Advisor
            </div>
            <span className="text-[10px] text-slate-500">Department of CSE</span>
          </div>

          <div>
            <div className="h-12 flex items-end justify-center font-serif text-slate-700 italic">
              Dr. J. Prasanna
            </div>
            <div className="border-t border-slate-400 pt-1 font-semibold text-slate-800">
              Head of Department
            </div>
            <span className="text-[10px] text-slate-500">Computer Science & Engg.</span>
          </div>

          <div>
            <div className="h-12 flex items-end justify-center font-serif text-slate-700 italic">
              Dr. R. Ramanathan
            </div>
            <div className="border-t border-slate-400 pt-1 font-semibold text-slate-800">
              Controller of Examinations
            </div>
            <span className="text-[10px] text-slate-500">MSEC Autonomous</span>
          </div>
        </div>

        {/* Verification Footer */}
        <div className="mt-8 text-center text-[10px] text-slate-400 print:block">
          This digital grade sheet is generated by Lumina Parent Connect on {new Date().toLocaleDateString()}. Fictional prototype record.
        </div>
      </div>
    </div>
  );
};
