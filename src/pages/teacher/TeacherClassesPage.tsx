import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp, matchesAssignedClass } from '../../context/AppContext';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { EmptyState } from '../../components/common/EmptyState';
import {
  Users,
  Search,
  CalendarCheck,
  Award,
  ShieldCheck,
  User,
  Phone,
  Mail,
  Home,
  HeartPulse
} from 'lucide-react';

export const TeacherClassesPage: React.FC = () => {
  const { students, currentStaff, parents } = useApp();
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

  const [searchQuery, setSearchQuery] = useState<string>('');

  if (!currentStaff) return null;

  const effectiveClass = selectedClass || availableClasses[0] || currentStaff.assignedClass;
  const classStudents = scopedStudents.filter((s) => s.className === effectiveClass);

  const filteredStudents = classStudents.filter((s) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        s.fullName.toLowerCase().includes(q) ||
        s.registerNumber.toLowerCase().includes(q) ||
        s.bloodGroup.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Class Roster &amp; Student Directory
            </h1>
            <Badge variant="primary">{effectiveClass}</Badge>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/80 px-2 py-0.5 rounded-md">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              Scope: {currentStaff.assignedClass}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Faculty Advisor: <strong className="text-slate-800">{currentStaff.fullName}</strong> • Department of {currentStaff.department}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate('/teacher/attendance')}
            className="px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-bold transition-colors shadow-2xs flex items-center gap-1.5"
          >
            <CalendarCheck className="w-3.5 h-3.5" />
            <span>Roll Call</span>
          </button>
          <button
            type="button"
            onClick={() => navigate('/teacher/marks')}
            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-colors shadow-2xs flex items-center gap-1.5"
          >
            <Award className="w-3.5 h-3.5" />
            <span>Enter Marks</span>
          </button>
        </div>
      </div>

      {/* Class Selector & Search Strip */}
      <div className="bg-white p-3 rounded-xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-bold text-slate-500 mr-1 uppercase tracking-wider text-[10px]">Section:</span>
          {availableClasses.length > 0 ? (
            availableClasses.map((cls) => (
              <button
                key={cls}
                type="button"
                onClick={() => setSelectedClass(cls)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                  effectiveClass === cls
                    ? 'bg-blue-700 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cls}
              </button>
            ))
          ) : (
            <span className="text-xs text-slate-400 font-medium">No sections available</span>
          )}
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          <input
            type="text"
            placeholder="Search student, reg no, blood group..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 pr-3 py-1.5 rounded-lg border border-slate-300 bg-slate-50/50 text-xs w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-600 placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Students List Table */}
      <Card
        density="compact"
        noPadding
        title={
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-600" />
            <span>Enrolled Students — {effectiveClass}</span>
          </div>
        }
        subtitle={`Showing ${filteredStudents.length} enrolled students in this section`}
      >
        <div
          className="table-wrapper"
          tabIndex={0}
          role="region"
          aria-label="Enrolled students class roster table"
        >
          <table className="compact-table w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                <th className="w-12 text-center">S.No</th>
                <th className="w-32">Register No</th>
                <th>Student Profile</th>
                <th className="w-28">Residence</th>
                <th className="w-24 text-center">Blood Group</th>
                <th className="w-56">Registered Parent Contact</th>
                <th className="w-24 text-center">Semester</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((s, idx) => {
                  const parent = parents.find((p) => p.linkedStudentIds.includes(s.studentId));
                  return (
                    <tr key={s.studentId} className="hover:bg-slate-50/70 transition-colors">
                      <td className="text-center text-slate-400 font-mono text-[11px]">{idx + 1}</td>
                      <td className="font-mono font-bold text-slate-900">{s.registerNumber}</td>
                      <td>
                        <div className="flex items-center gap-2.5 py-1">
                          <img
                            src={s.profileImage}
                            alt={s.fullName}
                            className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200"
                          />
                          <div>
                            <strong className="text-slate-900 block font-semibold">{s.fullName}</strong>
                            <span className="text-[10px] text-slate-400">
                              Advisor: {s.mentorName || currentStaff.fullName}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="inline-flex items-center gap-1 text-[11px] text-slate-700 font-medium">
                          <Home className="w-3 h-3 text-slate-400" />
                          <span>{s.hostelDayScholar}</span>
                        </span>
                      </td>
                      <td className="text-center">
                        <span className="inline-flex items-center gap-1 font-bold font-mono text-rose-700 bg-rose-50 px-2 py-0.5 rounded text-[11px] border border-rose-200/60">
                          <HeartPulse className="w-3 h-3 text-rose-500" />
                          <span>{s.bloodGroup}</span>
                        </span>
                      </td>
                      <td>
                        {parent ? (
                          <div className="py-0.5">
                            <span className="block font-semibold text-slate-900 text-xs">
                              {parent.fullName} <span className="text-slate-500 font-normal text-[11px]">({parent.relationship})</span>
                            </span>
                            <span className="text-[11px] text-slate-500 font-mono">
                              {parent.phoneNumber}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic text-[11px]">Not registered</span>
                        )}
                      </td>
                      <td className="text-center font-bold text-slate-700 font-mono">
                        Sem {s.semester}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center">
                    <EmptyState
                      icon={Users}
                      title="No Students Found"
                      description={`No students in ${effectiveClass} matched "${searchQuery}".`}
                      compact
                    />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
