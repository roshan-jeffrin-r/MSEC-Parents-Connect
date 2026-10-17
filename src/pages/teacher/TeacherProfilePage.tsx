import React from 'react';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import {
  User,
  GraduationCap,
  Mail,
  Phone,
  BookOpen,
  Building,
  Award
} from 'lucide-react';

export const TeacherProfilePage: React.FC = () => {
  const { currentTeacher } = useApp();

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Faculty Profile & Course Assignments
          </h1>
          <Badge variant="primary">MSEC Academic Staff</Badge>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Meenakshi Sundararajan Engineering College (Autonomous) • Faculty ID: {currentTeacher.teacherId}
        </p>
      </div>

      <Card
        title={
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-emerald-600" />
            <span>Faculty Information</span>
          </div>
        }
      >
        <div className="space-y-6 text-xs">
          <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xl border border-emerald-300">
              SK
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">{currentTeacher.fullName}</h2>
              <span className="text-emerald-700 font-semibold">{currentTeacher.designation}</span>
              <p className="text-slate-500 mt-0.5">Department of {currentTeacher.department}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <span className="text-slate-400 block text-[11px]">Official Email</span>
              <strong className="text-slate-800 text-xs">{currentTeacher.email}</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Contact Number</span>
              <strong className="text-slate-800 text-xs">{currentTeacher.phoneNumber}</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Advisory Role</span>
              <strong className="text-slate-800 text-xs">Class Advisor — III Year CSE - B</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Cabin Location</span>
              <strong className="text-slate-800 text-xs">Room 204, CSE Department Block</strong>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <h3 className="font-bold text-slate-900 mb-2">Assigned Courses (Odd Semester 2026):</h3>
            <div className="space-y-2">
              {currentTeacher.assignedSubjects.map((s) => (
                <div key={s.subjectCode} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="font-mono font-bold text-blue-700 mr-2">{s.subjectCode}</span>
                    <strong className="text-slate-900">{s.subjectName}</strong>
                  </div>
                  <Badge variant="neutral">{s.className}</Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
