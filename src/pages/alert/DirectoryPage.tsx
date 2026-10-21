import React, { useState, useMemo } from 'react';
import { useAlertSystem } from '../../context/AlertSystemContext';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { EmptyState } from '../../components/common/EmptyState';
import { StudentGuardianModal } from '../../components/directory/StudentGuardianModal';
import { AlertStudent } from '../../types/attendanceAlert';
import {
  Users,
  Search,
  UserPlus,
  Phone,
  MessageSquare,
  Smartphone,
  Shield,
  Edit2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const DirectoryPage: React.FC = () => {
  const { students, guardians } = useAlertSystem();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudentToEdit, setSelectedStudentToEdit] = useState<AlertStudent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredStudents = useMemo(() => {
    if (!searchQuery) return students;
    const q = searchQuery.toLowerCase();
    return students.filter((s) => {
      const guardian = guardians.find((g) => g.guardianId === s.guardianId);
      return (
        s.fullName.toLowerCase().includes(q) ||
        s.studentId.toLowerCase().includes(q) ||
        s.className.toLowerCase().includes(q) ||
        (guardian && guardian.fullName.toLowerCase().includes(q)) ||
        (guardian && guardian.mobileNumber.includes(q))
      );
    });
  }, [students, guardians, searchQuery]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Student &amp; Guardian Directory
            </h1>
            <Badge variant="primary">{students.length} Registered</Badge>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Verified guardian contact numbers and notification channel preferences for automated alert dispatches
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setSelectedStudentToEdit(null);
            setIsModalOpen(true);
          }}
          className="px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-bold transition-colors shadow-2xs flex items-center gap-1.5 self-start sm:self-auto"
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>Register Student &amp; Guardian</span>
        </button>
      </div>

      {/* Search Bar Strip */}
      <div className="bg-white p-3 rounded-xl border border-slate-200/90 shadow-2xs flex items-center justify-between gap-3 flex-wrap">
        <div className="relative w-full max-w-md">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          <input
            type="text"
            placeholder="Search by student name, ID, class, or guardian phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-slate-50/50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 placeholder:text-slate-400 font-mono"
          />
        </div>
        <span className="text-xs text-slate-500 font-medium">
          Showing <strong className="text-slate-900 font-mono">{filteredStudents.length}</strong> of {students.length} profiles
        </span>
      </div>

      {/* Directory Table */}
      <Card
        density="compact"
        noPadding
        title={
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-600" />
            <span>Campus Registry &amp; Alert Routing Ledger</span>
          </div>
        }
      >
        <div
          className="table-wrapper"
          tabIndex={0}
          role="region"
          aria-label="Student and guardian directory table"
        >
          <table className="compact-table w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                <th className="w-24">Student ID</th>
                <th>Student Profile</th>
                <th className="w-28">Class / Dept</th>
                <th className="w-44">Guardian Name</th>
                <th className="w-36">Mobile (SMS)</th>
                <th className="w-28 text-center">WhatsApp</th>
                <th className="w-24 text-center">Language</th>
                <th className="w-20 text-center">Edit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((s) => {
                  const guardian = guardians.find((g) => g.guardianId === s.guardianId);
                  const isInvalidPhone = !guardian?.mobileNumber || guardian.mobileNumber.length < 10;

                  return (
                    <tr key={s.studentId} className="hover:bg-slate-50/70 transition-colors">
                      <td className="font-mono font-bold text-slate-900 text-[11px]">{s.studentId}</td>
                      <td>
                        <div className="flex items-center gap-2 py-0.5">
                          {s.profileImage ? (
                            <img
                              src={s.profileImage}
                              alt={s.fullName}
                              className="w-6 h-6 rounded-full object-cover ring-1 ring-slate-200"
                            />
                          ) : (
                            <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-[10px]">
                              {s.fullName[0]}
                            </div>
                          )}
                          <div>
                            <strong className="text-slate-900 block font-semibold">{s.fullName}</strong>
                            <span className="text-[10px] text-slate-400 font-mono">Reg: {s.registerNumber}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="font-bold text-slate-800 block text-[11px]">{s.className}</span>
                        <span className="text-[10px] text-slate-400 block truncate max-w-[120px]">{s.department}</span>
                      </td>
                      <td>
                        {guardian ? (
                          <div>
                            <strong className="text-slate-800 block font-semibold text-[11px]">{guardian.fullName}</strong>
                            <span className="text-[10px] text-slate-500">{guardian.relationship}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic text-[11px]">No guardian record</span>
                        )}
                      </td>
                      <td>
                        {guardian && !isInvalidPhone ? (
                          <span className="inline-flex items-center gap-1 font-mono text-[11px] text-slate-800 font-semibold">
                            <Phone className="w-3 h-3 text-blue-600" />
                            +91 {guardian.mobileNumber}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] text-rose-700 bg-rose-50 px-1.5 py-0.2 rounded font-bold border border-rose-200">
                            <AlertCircle className="w-3 h-3 text-rose-600" />
                            Missing Contact
                          </span>
                        )}
                      </td>
                      <td className="text-center">
                        {guardian?.hasWhatsApp && guardian.whatsAppEnabled ? (
                          <Badge variant="success" size="sm" dot>Enabled</Badge>
                        ) : (
                          <span className="text-[10px] text-slate-400 font-semibold">Disabled</span>
                        )}
                      </td>
                      <td className="text-center">
                        <span className="text-[11px] font-mono text-slate-600 uppercase font-bold">
                          {guardian?.preferredLanguage || 'en'}
                        </span>
                      </td>
                      <td className="text-center">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedStudentToEdit(s);
                            setIsModalOpen(true);
                          }}
                          className="p-1 rounded text-slate-400 hover:text-blue-700 hover:bg-blue-50 transition-colors"
                          title="Edit student and guardian"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="py-8 text-center">
                    <EmptyState
                      icon={Users}
                      title="No Directory Profiles Found"
                      description={`No students or guardians match "${searchQuery}".`}
                      compact
                    />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Registration & Edit Modal */}
      <StudentGuardianModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        studentToEdit={selectedStudentToEdit}
      />
    </div>
  );
};
