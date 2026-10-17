import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import {
  Users,
  Search,
  UserCheck,
  Mail,
  Phone,
  Building,
  GraduationCap,
  ExternalLink,
  UserPlus
} from 'lucide-react';

export const AdminStudentsPage: React.FC = () => {
  const { students, parents } = useApp();
  const [search, setSearch] = useState('');

  const filtered = students.filter((s) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      s.fullName.toLowerCase().includes(q) ||
      s.registerNumber.toLowerCase().includes(q) ||
      s.department.toLowerCase().includes(q) ||
      s.className.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Student & Parent Account Directory
            </h1>
            <Badge variant="primary">Campus Registry</Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Associate each student with verified parent accounts and monitor onboarding status
          </p>
        </div>

        <Link
          to="/onboard"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>+ Onboard Student</span>
        </Link>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div className="relative w-full max-w-md">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by student name, register number, class..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-xs w-full focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>
        <span className="text-xs text-slate-500 font-medium">
          Showing {filtered.length} of {students.length} records
        </span>
      </div>

      {/* Students Table */}
      <Card
        title={
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-600" />
            <span>Enrolled Students & Linked Parent Accounts</span>
          </div>
        }
      >
        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <th className="py-3 px-4 w-12 text-center">S.No</th>
                <th className="py-3 px-4 w-32">Register No</th>
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4">Department & Class</th>
                <th className="py-3 px-4 w-28 text-center">Semester</th>
                <th className="py-3 px-4">Linked Parent / Contact</th>
                <th className="py-3 px-4 w-28 text-center">Parent Status</th>
                <th className="py-3 px-4 w-36 text-center">Self-Service Link</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((s, idx) => {
                const parent = parents?.find((p: any) => p.linkedStudentIds?.includes(s.studentId));

                return (
                  <tr key={s.studentId} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 text-center text-slate-400 font-medium">{idx + 1}</td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">{s.registerNumber}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={s.profileImage}
                          alt={s.fullName}
                          className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200"
                        />
                        <strong className="text-slate-900">{s.fullName}</strong>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-slate-800 font-medium block">{s.department}</span>
                      <span className="text-[11px] text-slate-500">{s.className}</span>
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-slate-700">
                      Sem {s.semester}
                    </td>
                    <td className="py-3 px-4">
                      {parent ? (
                        <div>
                          <strong className="text-slate-800 block">{parent.fullName} ({parent.relationship})</strong>
                          <span className="text-[11px] text-slate-500">{parent.email} • {parent.phoneNumber}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">No parent linked</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Badge variant="success" size="sm">
                        Verified
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Link
                        to={`/onboard?regNo=${s.registerNumber}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold border border-blue-200 transition-colors"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>Onboard Link</span>
                      </Link>
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
