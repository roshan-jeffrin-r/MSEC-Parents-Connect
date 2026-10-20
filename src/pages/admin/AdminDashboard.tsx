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
  Server,
  Layers,
  Database
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { students, examinations, leaveRequests, announcements, setIsDemoGuideOpen } = useApp();
  const navigate = useNavigate();

  const unpublishedExams = examinations.filter((e) => e.publicationStatus !== 'Published');
  const pendingLeaves = leaveRequests.filter((l) => l.status === 'Pending');

  return (
    <div className="space-y-4">
      {/* Executive CoE & Dean Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 rounded-2xl p-4 sm:p-5 text-white shadow-md border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[11px] font-semibold border border-purple-400/30">
              <Shield className="w-3.5 h-3.5" />
              <span>Institutional Control Center</span>
            </span>
            <Badge variant="primary" size="sm">Autonomous Governance</Badge>
          </div>

          <h1 className="text-lg sm:text-xl font-black tracking-tight text-white">
            Academic Dean &amp; Controller of Examinations (CoE) Portal
          </h1>

          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            Institutional overview for Meenakshi Sundararajan Engineering College (Autonomous). Campus-wide roll call, result release gates, and verified parent links.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsDemoGuideOpen(true)}
          className="px-3.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 self-start md:self-auto shrink-0"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Demo Guide (Step 10)</span>
        </button>
      </div>

      {/* Campus Metrics KPI Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200/90 shadow-2xs border-t-2 border-t-blue-600">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Total Students</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-black text-slate-900 font-mono">1,480</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Across 6 Departments</span>
        </div>

        <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200/90 shadow-2xs border-t-2 border-t-emerald-600">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Registered Parents</span>
            <Users className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-black text-slate-900 font-mono">1,420</span>
          </div>
          <span className="text-[11px] text-emerald-700 font-bold mt-1 block">96% Onboarded</span>
        </div>

        <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200/90 shadow-2xs border-t-2 border-t-purple-600">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Faculty Members</span>
            <GraduationCap className="w-4 h-4 text-purple-600" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-black text-slate-900 font-mono">84</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Teaching &amp; Advisory</span>
        </div>

        <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200/90 shadow-2xs border-t-2 border-t-emerald-500">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Overall Campus Muster</span>
            <CalendarCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-emerald-700 font-mono">92.4%</span>
            <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200/60">
              Good
            </span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Today's Campus Muster</span>
        </div>
      </div>

      {/* Middle Grid: Unpublished Exams & Announcements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Examinations & Publishing */}
        <Card
          density="compact"
          accent="indigo"
          title={
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-indigo-600" />
              <span>Examination Status &amp; Publishing Gate</span>
            </div>
          }
          subtitle="Controller of Examinations (CoE) Assessment Cycle"
          action={
            <button
              type="button"
              onClick={() => navigate('/admin/examinations')}
              className="text-xs font-bold text-blue-700 hover:text-blue-800 flex items-center gap-1"
            >
              <span>Manage Exams</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          }
        >
          <div className="divide-y divide-slate-100">
            {examinations.map((exam) => (
              <div key={exam.examId} className="py-2.5 flex items-center justify-between text-xs hover:bg-slate-50/50 px-1 rounded transition-colors">
                <div>
                  <strong className="text-slate-900 block font-semibold">{exam.examName}</strong>
                  <span className="text-[11px] text-slate-500 font-mono">
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
                  size="sm"
                  dot
                >
                  {exam.publicationStatus}
                </Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* Institutional Announcements Publisher */}
        <Card
          density="compact"
          accent="blue"
          title={
            <div className="flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-blue-600" />
              <span>Campus Circulars &amp; Broadcasts</span>
            </div>
          }
          subtitle="Publish notices to parent and faculty dashboards"
          action={
            <button
              type="button"
              onClick={() => navigate('/admin/announcements')}
              className="text-xs font-bold text-blue-700 hover:text-blue-800 flex items-center gap-1"
            >
              <span>Create Circular</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          }
        >
          <div className="space-y-2">
            {announcements.slice(0, 3).map((ann) => (
              <div key={ann.announcementId} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 text-xs hover:bg-slate-100/60 transition-colors">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <Badge variant="primary" size="sm">{ann.category}</Badge>
                  <span className="text-[10px] text-slate-400 font-mono">{ann.publishedAt.split(' ')[0]}</span>
                </div>
                <strong className="text-slate-900 block font-semibold text-xs">{ann.title}</strong>
                <p className="text-slate-600 line-clamp-1 mt-0.5 text-[11px]">{ann.message}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Integration Blueprint Note for Faculty Presentation (Step 10) */}
      <Card
        density="compact"
        accent="blue"
        title={
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-blue-600" />
            <span>MSEC SIS / ERP Live Integration Architecture</span>
          </div>
        }
        subtitle="Production deployment blueprint to connect Lumina Parent Connect to college infrastructure"
      >
        <div className="space-y-3 text-xs text-slate-700 leading-relaxed">
          <p>
            Lumina Parent Connect has been architected with a decoupled data-access layer that cleanly bridges with the college's legacy academic servers:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <strong className="text-blue-900 block font-bold mb-1 flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-blue-600" />
                <span>1. Student ERP Sync</span>
              </strong>
              <p className="text-[11px] text-slate-600">
                REST / GraphQL connector syncs attendance muster and credit hours from college Oracle/PostgreSQL databases.
              </p>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <strong className="text-emerald-900 block font-bold mb-1 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-emerald-600" />
                <span>2. Event-Driven Alerts</span>
              </strong>
              <p className="text-[11px] text-slate-600">
                Firebase Cloud Messaging (FCM) &amp; institutional SMS gateway trigger automated alerts on gate timestamps and result releases.
              </p>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <strong className="text-purple-900 block font-bold mb-1 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-purple-600" />
                <span>3. Anna University API</span>
              </strong>
              <p className="text-[11px] text-slate-600">
                Official marks imported via CoE ledger and automatically formatted into autonomous CBCS digital report cards.
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
