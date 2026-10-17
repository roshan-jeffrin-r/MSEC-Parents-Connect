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
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Examination Administration & Publishing
          </h1>
          <Badge variant="primary">Office of the CoE</Badge>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Control publication release gates for Internal Assessments, Model Exams, and End-Semester report cards
        </p>
      </div>

      {successBanner && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-xs font-semibold flex items-center gap-2.5 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successBanner}</span>
        </div>
      )}

      {/* Examinations Table */}
      <Card
        title={
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-purple-600" />
            <span>Academic Assessment Cycles (Odd Semester 2026-27)</span>
          </div>
        }
      >
        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <th className="py-3 px-4 w-32">Exam ID</th>
                <th className="py-3 px-4">Examination Title</th>
                <th className="py-3 px-4 w-28 text-center">Semester</th>
                <th className="py-3 px-4 w-44">Exam Window</th>
                <th className="py-3 px-4 w-32">Release Date</th>
                <th className="py-3 px-4 w-32 text-center">Status</th>
                <th className="py-3 px-4 w-40 text-center">Publication Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {examinations.map((exam) => {
                const isPublished = exam.publicationStatus === 'Published';

                return (
                  <tr key={exam.examId} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">{exam.examId}</td>
                    <td className="py-3 px-4 font-semibold text-slate-900">{exam.examName}</td>
                    <td className="py-3 px-4 text-center text-slate-700 font-bold">
                      Semester {exam.semester}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {exam.examStartDate} to {exam.examEndDate}
                    </td>
                    <td className="py-3 px-4 text-slate-600 font-mono">{exam.publicationDate}</td>
                    <td className="py-3 px-4 text-center">
                      <Badge variant={isPublished ? 'success' : 'warning'}>
                        {exam.publicationStatus}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggle(exam.examId, exam.publicationStatus)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          isPublished
                            ? 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                            : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-2xs'
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
