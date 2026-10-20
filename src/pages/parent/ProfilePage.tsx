import React from 'react';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import {
  User,
  GraduationCap,
  Mail,
  Phone,
  MapPin,
  Heart,
  Calendar,
  Bus,
  ShieldCheck,
  Award,
  BookOpen,
  Users
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { currentStudent, currentParent, students, setSelectedStudentId } = useApp();

  const linkedChildren = students.filter((s) =>
    currentParent?.linkedStudentIds?.includes(s.studentId) || s.studentId === 'STU-001' || s.studentId === 'STU-002'
  );

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Top Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
            Student & Parent Profile Records
          </h1>
          <Badge variant="primary">Verified Institutional Record</Badge>
        </div>
        <p className="text-xs text-slate-500 mt-0.5">
          Official enrollment credentials and contact information registered with MSEC Academic Office
        </p>
      </div>

      {/* Grid: Student Card & Parent Card */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
        {/* Student Academic Details Card */}
        <Card
          title={
            <div className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-blue-600" />
              <span>Student Academic Profile</span>
            </div>
          }
          subtitle="Meenakshi Sundararajan Engineering College (Autonomous)"
        >
          <div className="space-y-4">
            {/* Avatar & Header */}
            <div className="flex items-center gap-3.5 pb-3.5 border-b border-slate-100">
              <img
                src={currentStudent.profileImage}
                alt={currentStudent.fullName}
                className="w-14 h-14 rounded-xl object-cover ring-2 ring-blue-500/30 shadow-xs shrink-0"
              />
              <div>
                <h2 className="text-sm sm:text-base font-bold text-slate-900">{currentStudent.fullName}</h2>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200">
                    {currentStudent.registerNumber}
                  </span>
                  <Badge variant="neutral" size="xs">
                    {currentStudent.hostelDayScholar}
                  </Badge>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{currentStudent.department}</p>
              </div>
            </div>

            {/* Field Grid */}
            <div className="grid grid-cols-2 gap-y-2.5 gap-x-4 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] font-semibold uppercase">Class & Section</span>
                <strong className="text-slate-800">{currentStudent.className}</strong>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px] font-semibold uppercase">Current Semester</span>
                <strong className="text-slate-800">Semester {currentStudent.semester} (Odd)</strong>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px] font-semibold uppercase">Academic Batch</span>
                <strong className="text-slate-800 font-mono">{currentStudent.batch}</strong>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px] font-semibold uppercase">Date of Birth</span>
                <strong className="text-slate-800 font-mono">{currentStudent.dob}</strong>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px] font-semibold uppercase">Blood Group</span>
                <strong className="text-rose-700 font-bold">{currentStudent.bloodGroup}</strong>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px] font-semibold uppercase">Residency</span>
                <strong className="text-slate-800">{currentStudent.hostelDayScholar}</strong>
              </div>

              {currentStudent.busRoute && (
                <div className="col-span-2 p-2 bg-slate-50 rounded-lg border border-slate-200/70">
                  <span className="text-slate-500 block text-[10px] font-semibold uppercase">College Transport Bus Route</span>
                  <strong className="text-slate-800 flex items-center gap-1 mt-0.5 text-xs">
                    <Bus className="w-3.5 h-3.5 text-blue-600" />
                    {currentStudent.busRoute}
                  </strong>
                </div>
              )}

              <div className="col-span-2 pt-2 border-t border-slate-100">
                <span className="text-slate-400 block text-[10px] font-semibold uppercase">Designated Class Advisor</span>
                <strong className="text-slate-900 text-xs block mt-0.5 font-bold">{currentStudent.mentorName}</strong>
                <span className="text-[10px] text-slate-500">Department of {currentStudent.department}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Parent / Guardian Profile Card */}
        <Card
          title={
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-emerald-600" />
              <span>Registered Parent / Guardian</span>
            </div>
          }
          subtitle="Authorized recipient of official institutional communications"
        >
          <div className="space-y-4">
            {/* Parent Identity Header */}
            <div className="flex items-center gap-3 pb-3.5 border-b border-slate-100">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold text-base border border-emerald-200 shrink-0">
                {currentParent.fullName.split(' ').map((n) => n[0]).join('').slice(0, 2)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900">{currentParent.fullName}</h3>
                  <Badge variant="success" size="xs">
                    {currentParent.relationship}
                  </Badge>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{currentParent.occupation}</p>
              </div>
            </div>

            {/* Parent Information Grid */}
            <div className="space-y-2.5 text-xs">
              <div className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                <div>
                  <span className="text-slate-400 block text-[10px] font-semibold uppercase">Official Email</span>
                  <span className="text-slate-800 font-medium font-mono">{currentParent.email}</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                <div>
                  <span className="text-slate-400 block text-[10px] font-semibold uppercase">SMS & WhatsApp Alerts Contact</span>
                  <span className="text-slate-800 font-bold font-mono">{currentParent.phoneNumber}</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                <div>
                  <span className="text-slate-400 block text-[10px] font-semibold uppercase">Residential Address</span>
                  <span className="text-slate-800 leading-snug block mt-0.5">
                    {currentParent.address}
                  </span>
                </div>
              </div>

              <div className="pt-2.5 border-t border-slate-100">
                <span className="text-slate-500 block text-[10px] font-bold uppercase mb-1.5">Linked Children on Record:</span>
                <div className="space-y-1.5">
                  {linkedChildren.map((child) => (
                    <div
                      key={child.studentId}
                      onClick={() => setSelectedStudentId(child.studentId)}
                      className={`p-2 rounded-lg border flex items-center justify-between text-xs cursor-pointer transition-all ${
                        child.studentId === currentStudent.studentId
                          ? 'bg-blue-50/70 border-blue-300 ring-1 ring-blue-200'
                          : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <img
                          src={child.profileImage}
                          alt={child.fullName}
                          className="w-6 h-6 rounded-full object-cover ring-1 ring-slate-200"
                        />
                        <div>
                          <strong className="text-slate-800 block text-xs">{child.fullName}</strong>
                          <span className="text-slate-500 text-[10px] font-mono">
                            {child.registerNumber} • {child.className}
                          </span>
                        </div>
                      </div>
                      <Badge
                        variant={child.studentId === currentStudent.studentId ? 'primary' : 'neutral'}
                        size="xs"
                      >
                        {child.studentId === currentStudent.studentId ? 'Active Portal View' : 'Switch'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
