import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import {
  Users,
  GraduationCap,
  CalendarCheck,
  Award,
  Megaphone,
  CheckSquare,
  Shield,
  ArrowRight,
  TrendingUp,
  Building,
  Sparkles,
  Server
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { students, examinations, leaveRequests, announcements, setIsDemoGuideOpen } = useApp();
  const navigate = useNavigate();

  const unpublishedExams = examinations.filter((e) => e.publicationStatus !== 'Published');
  const pendingLeaves = leaveRequests.filter((l) => l.status === 'Pending');

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-blue-950 rounded-2xl p-5 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold border border-purple-400/30 mb-2">
            <Shield className="w-3.5 h-3.5" />
            <span>Administrator Control Center</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
            Academic Dean & Controller of Examinations Portal
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Institutional overview for Meenakshi Sundararajan Engineering College (Autonomous).
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsDemoGuideOpen(true)}
          className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2 self-start md:self-auto"
        >
          <Sparkles className="w-4 h-4" />
          <span>Faculty Demo Guide (Step 10)</span>
        </button>
      </div>

      {/* Campus Metrics KPI Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Total Students</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="mt-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">1,480</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Across 6 Departments</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Registered Parents</span>
            <Users className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">1,420</span>
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">96% Onboarded</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Faculty Members</span>
            <GraduationCap className="w-4 h-4 text-purple-600" />
          </div>
          <div className="mt-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">84</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Teaching & Advisory</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Overall Campus Attendance</span>
            <CalendarCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-black text-emerald-700">92.4%</span>
            <span className="text-xs text-emerald-600 font-bold">Good</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Today's Campus Muster</span>
        </div>
      </div>

      {/* Middle Grid: Unpublished Exams & Pending Leaves & Announcements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Examinations & Publishing */}
        <Card
          title={
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-purple-600" />
              <span>Examination Status & Publishing</span>
            </div>
          }
          subtitle="Controller of Examinations Assessment Schedule"
          action={
            <button
              type="button"
              onClick={() => navigate('/admin/examinations')}
              className="text-xs font-semibold text-blue-700 hover:text-blue-800"
            >
              Manage Exams →
            </button>
          }
        >
          <div className="divide-y divide-slate-100">
            {examinations.map((exam) => (
              <div key={exam.examId} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <strong className="text-slate-900 block">{exam.examName}</strong>
                  <span className="text-[11px] text-slate-500">
                    Sem {exam.semester} • Window: {exam.examStartDate} to {exam.examEndDate}
                  </span>
                </div>
                <Badge
                  variant={
                    exam.publicationStatus === 'Published'
                      ? 'success'
                      : exam.publicationStatus === 'Grading'
                      ? 'warning'
                      : 'neutral'
                  }
                >
                  {exam.publicationStatus}
                </Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* Institutional Announcements Publisher */}
        <Card
          title={
            <div className="flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-blue-600" />
              <span>Campus Circulars & Broadcasts</span>
            </div>
          }
          subtitle="Publish notices to parent and faculty dashboards"
          action={
            <button
              type="button"
              onClick={() => navigate('/admin/announcements')}
              className="text-xs font-semibold text-blue-700 hover:text-blue-800"
            >
              Create New Notice →
            </button>
          }
        >
          <div className="space-y-3">
            {announcements.slice(0, 3).map((ann) => (
              <div key={ann.announcementId} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <Badge variant="primary" size="sm">{ann.category}</Badge>
                  <span className="text-[10px] text-slate-400">{ann.publishedAt.split(' ')[0]}</span>
                </div>
                <strong className="text-slate-900 block">{ann.title}</strong>
                <p className="text-slate-600 line-clamp-1 mt-0.5 text-[11px]">{ann.message}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Integration Blueprint Note for Faculty Presentation (Step 10) */}
      <Card
        title={
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-blue-600" />
            <span>MSEC SIS / ERP Integration Architecture (Next Steps)</span>
          </div>
        }
        subtitle="Technical pathway to connect Lumina Parent Connect to the college's live infrastructure"
      >
        <div className="space-y-4 text-xs text-slate-700 leading-relaxed">
          <p>
            During your meeting demonstration, faculty members will ask how this prototype bridges with the existing MSEC academic ERP. Lumina Parent Connect has been architected with a clean, decoupled data-access layer:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <strong className="text-blue-900 block font-sans font-semibold mb-1">1. Student Information Sync</strong>
              REST / GraphQL connector syncs student attendance rosters and credit hours from college ERP database.
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <strong className="text-emerald-900 block font-sans font-semibold mb-1">2. Event-Driven Notifications</strong>
              Firebase Cloud Messaging (FCM) & college SMS gateway trigger automated alerts on gate timestamps & results publication.
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <strong className="text-purple-900 block font-sans font-semibold mb-1">3. Anna University Results API</strong>
              Official grades imported via CoE ledger and automatically formatted into CBCS digital report cards.
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
