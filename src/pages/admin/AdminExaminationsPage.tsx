import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import {
  Award,
  Globe,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';

export const AdminExaminationsPage: React.FC = () => {
  const { examinations, publishReportCard } = useApp();
  const [successBanner, setSuccessBanner] = useState('');

  const handleToggle = (examId: string, currentStatus: string) => {
    const nextStatus = currentStatus !== 'Published';
    publishReportCard(examId, nextStatus);
    setSuccessBanner(
      `Examination ${examId} publication status updated to: ${nextStatus ? 'Published' : 'Draft'}.`
    );
    setTimeout(() => setSuccessBanner(''), 4000);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 flex-wrap">
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Examination Administration &amp; Publishing
          </h1>
          <Badge variant="primary">Office of the CoE</Badge>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Control publication release gates for Internal Assessments, Model Exams, and End-Semester report cards
        </p>
      </div>

      {successBanner && (
        <div className="p-3 bg-emerald-50 border border-emerald-200/80 rounded-xl text-emerald-950 text-xs font-semibold flex items-center gap-2.5 animate-in fade-in shadow-2xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successBanner}</span>
        </div>
      )}

      {/* Examinations Table */}
      <Card
        density="compact"
        noPadding
        title={
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-indigo-600" />
            <span>Academic Assessment Cycles (Odd Semester 2026-27)</span>
          </div>
        }
      >
        <div
          className="table-wrapper"
          tabIndex={0}
          role="region"
          aria-label="Controller of examinations assessment table"
        >
          <table className="compact-table w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                <th className="w-32">Exam ID</th>
                <th>Examination Title</th>
                <th className="w-24 text-center">Semester</th>
                <th className="w-44">Exam Window</th>
                <th className="w-32">Release Date</th>
                <th className="w-28 text-center">Status</th>
                <th className="w-36 text-center">Publication Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {examinations.map((exam) => {
                const isPublished = exam.publicationStatus === 'Published';

                return (
                  <tr key={exam.examId} className="hover:bg-slate-50/70 transition-colors">
                    <td className="font-mono font-bold text-slate-900">{exam.examId}</td>
                    <td className="font-semibold text-slate-900">{exam.examName}</td>
                    <td className="text-center text-slate-700 font-bold font-mono">
                      Sem {exam.semester}
                    </td>
                    <td className="text-slate-600 font-mono text-[11px]">
                      {exam.examStartDate} to {exam.examEndDate}
                    </td>
                    <td className="text-slate-600 font-mono text-[11px]">{exam.publicationDate}</td>
                    <td className="text-center">
                      <Badge variant={isPublished ? 'success' : 'warning'} size="sm" dot>
                        {exam.publicationStatus}
                      </Badge>
                    </td>
                    <td className="text-center">
                      <button
                        type="button"
                        onClick={() => handleToggle(exam.examId, exam.publicationStatus)}
                        className={`px-3 py-1 rounded-md text-xs font-bold transition-all shadow-2xs ${
                          isPublished
                            ? 'bg-amber-100 text-amber-900 hover:bg-amber-200 border border-amber-300'
                            : 'bg-emerald-600 text-white hover:bg-emerald-700'
                        }`}
                      >
                        {isPublished ? 'Unpublish' : 'Publish to Parents'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
