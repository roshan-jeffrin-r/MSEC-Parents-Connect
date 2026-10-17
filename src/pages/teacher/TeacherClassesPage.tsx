import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import {
  Users,
  Search,
  CalendarCheck,
  Award,
  Phone,
  Mail,
  ArrowRight
} from 'lucide-react';

export const TeacherClassesPage: React.FC = () => {
  const { students, currentTeacher } = useApp();
  const navigate = useNavigate();

  const [selectedClass, setSelectedClass] = useState<string>('III Year CSE - B');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const classStudents = students.filter((s) => s.className === selectedClass);

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
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Class Roster & Student Directory
            </h1>
            <Badge variant="primary">{selectedClass}</Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Faculty Advisor: <strong className="text-slate-800">{currentTeacher.fullName}</strong> • Department of Computer Science & Engineering
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate('/teacher/attendance')}
            className="px-3.5 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold transition-colors shadow-2xs flex items-center gap-1.5"
          >
            <CalendarCheck className="w-3.5 h-3.5" />
            <span>Record Attendance</span>
          </button>
          <button
            type="button"
            onClick={() => navigate('/teacher/marks')}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors shadow-2xs flex items-center gap-1.5"
          >
            <Award className="w-3.5 h-3.5" />
            <span>Enter Marks</span>
          </button>
        </div>
      </div>

      {/* Class Selector & Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {currentTeacher.assignedClasses.map((cls) => (
            <button
              key={cls}
              type="button"
              onClick={() => setSelectedClass(cls)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                selectedClass === cls
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cls}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search student or register no..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-xs w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>
      </div>

      {/* Students List Table */}
      <Card
        title={
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-600" />
            <span>Enrolled Students — {selectedClass}</span>
          </div>
        }
        subtitle={`Total ${filteredStudents.length} students enrolled in this section`}
      >
        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <th className="py-3 px-4 w-14 text-center">S.No</th>
                <th className="py-3 px-4 w-32">Register No</th>
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4 w-32">Residence</th>
                <th className="py-3 px-4 w-24">Blood Group</th>
                <th className="py-3 px-4 w-44">Registered Parent Contact</th>
                <th className="py-3 px-4 w-32 text-center">Semester</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map((s, idx) => (
                <tr key={s.studentId} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 text-center text-slate-400 font-medium">{idx + 1}</td>
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">{s.registerNumber}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={s.profileImage}
                        alt={s.fullName}
                        className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200"
                      />
                      <div>
                        <strong className="text-slate-900 block">{s.fullName}</strong>
                        {s.studentId === 'STU-001' && (
                          <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-1.5 py-0.5 rounded">
                            Demo Primary
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-600">{s.hostelDayScholar}</td>
                  <td className="py-3 px-4 font-semibold text-rose-700">{s.bloodGroup}</td>
                  <td className="py-3 px-4 text-slate-600">
                    <span className="block font-medium text-slate-800">
                      {s.studentId === 'STU-001' ? 'Rajesh Kumar (Father)' : 'Authorized Guardian'}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {s.studentId === 'STU-001' ? '+91 98401 23456' : '+91 94440 12345'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center font-bold text-slate-700">
                    Semester {s.semester}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
