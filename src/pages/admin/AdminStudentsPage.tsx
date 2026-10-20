import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { EmptyState } from '../../components/common/EmptyState';
import {
  Users,
  Search,
  UserCheck,
  Mail,
  Phone,
  Building,
  GraduationCap
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
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Student &amp; Parent Account Directory
            </h1>
            <Badge variant="primary">Campus Registry</Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Associate each student with verified parent accounts and monitor onboarding status
          </p>
        </div>
      </div>

      {/* Search Bar Strip */}
      <div className="bg-white p-3 rounded-xl border border-slate-200/90 shadow-2xs flex items-center justify-between gap-3 flex-wrap">
        <div className="relative w-full max-w-md">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          <input
            type="text"
            placeholder="Search by student name, register number, class..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 pr-3 py-1.5 rounded-lg border border-slate-300 bg-slate-50/50 text-xs w-full focus:outline-none focus:ring-2 focus:ring-blue-600 placeholder:text-slate-400 font-mono"
          />
        </div>
        <span className="text-xs text-slate-500 font-medium">
          Showing <strong className="text-slate-900">{filtered.length}</strong> of {students.length} records
        </span>
      </div>

      {/* Students Table */}
      <Card
        density="compact"
        noPadding
        title={
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-600" />
            <span>Enrolled Students &amp; Linked Parent Accounts</span>
          </div>
        }
      >
        <div
          className="table-wrapper"
          tabIndex={0}
          role="region"
          aria-label="Student and parent registry table"
        >
          <table className="compact-table w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                <th className="w-12 text-center">S.No</th>
                <th className="w-32">Register No</th>
                <th>Student Profile</th>
                <th className="w-48">Department &amp; Class</th>
                <th className="w-24 text-center">Semester</th>
                <th className="w-64">Linked Parent / Contact</th>
                <th className="w-28 text-center">Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length > 0 ? (
                filtered.map((s, idx) => {
                  const parent = parents?.find((p: any) => p.linkedStudentIds?.includes(s.studentId));

                  return (
                    <tr key={s.studentId} className="hover:bg-slate-50/70 transition-colors">
                      <td className="text-center text-slate-400 font-mono text-[11px]">{idx + 1}</td>
                      <td className="font-mono font-bold text-slate-900">{s.registerNumber}</td>
                      <td>
                        <div className="flex items-center gap-2 py-0.5">
                          <img
                            src={s.profileImage}
                            alt={s.fullName}
                            className="w-6 h-6 rounded-full object-cover ring-1 ring-slate-200"
                          />
                          <strong className="text-slate-900 font-semibold">{s.fullName}</strong>
                        </div>
                      </td>
                      <td>
                        <span className="text-slate-800 font-medium block">{s.department}</span>
                        <span className="text-[10px] text-slate-500 font-mono">{s.className}</span>
                      </td>
                      <td className="text-center font-bold text-slate-700 font-mono">
                        Sem {s.semester}
                      </td>
                      <td>
                        {parent ? (
                          <div className="py-0.5">
                            <strong className="text-slate-900 block font-semibold">
                              {parent.fullName} <span className="text-slate-500 font-normal text-[11px]">({parent.relationship})</span>
                            </strong>
                            <span className="text-[10px] text-slate-500 font-mono">{parent.email} • {parent.phoneNumber}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic text-[11px]">No parent linked</span>
                        )}
                      </td>
                      <td className="text-center">
                        <Badge variant="success" size="sm" dot>
                          Verified
                        </Badge>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center">
                    <EmptyState
                      icon={Users}
                      title="No Records Found"
                      description={`No students found matching "${search}".`}
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
