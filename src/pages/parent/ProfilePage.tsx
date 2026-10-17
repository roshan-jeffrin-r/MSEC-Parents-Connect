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
  BookOpen
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { currentStudent, currentParent } = useApp();

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Student & Parent Profile
          </h1>
          <Badge variant="primary">Verified Institutional Record</Badge>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Official enrollment credentials and contact information registered with MSEC Academic Office
        </p>
      </div>

      {/* Grid: Student Card & Parent Card */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
          <div className="space-y-5">
            {/* Avatar & Header */}
            <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
              <img
                src={currentStudent.profileImage}
                alt={currentStudent.fullName}
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-blue-500/30 shadow-xs"
              />
              <div>
                <h2 className="text-base font-bold text-slate-900">{currentStudent.fullName}</h2>
                <span className="font-mono text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  Reg No: {currentStudent.registerNumber}
                </span>
                <p className="text-xs text-slate-500 mt-1">{currentStudent.department}</p>
              </div>
            </div>

            {/* Field Grid */}
            <div className="grid grid-cols-2 gap-y-3.5 gap-x-4 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">Class & Section</span>
                <strong className="text-slate-800">{currentStudent.className}</strong>
              </div>

              <div>
                <span className="text-slate-400 block text-[11px]">Current Semester</span>
                <strong className="text-slate-800">Semester {currentStudent.semester} (Odd)</strong>
              </div>

              <div>
                <span className="text-slate-400 block text-[11px]">Academic Batch</span>
                <strong className="text-slate-800">{currentStudent.batch}</strong>
              </div>

              <div>
                <span className="text-slate-400 block text-[11px]">Date of Birth</span>
                <strong className="text-slate-800">{currentStudent.dob}</strong>
              </div>

              <div>
                <span className="text-slate-400 block text-[11px]">Blood Group</span>
                <strong className="text-rose-700 font-bold">{currentStudent.bloodGroup}</strong>
              </div>

              <div>
                <span className="text-slate-400 block text-[11px]">Residency Status</span>
                <strong className="text-slate-800">{currentStudent.hostelDayScholar}</strong>
              </div>

              {currentStudent.busRoute && (
                <div className="col-span-2">
                  <span className="text-slate-400 block text-[11px]">College Transport Route</span>
                  <strong className="text-slate-800 flex items-center gap-1.5 mt-0.5">
                    <Bus className="w-3.5 h-3.5 text-blue-600" />
                    {currentStudent.busRoute}
                  </strong>
                </div>
              )}

              <div className="col-span-2 pt-2 border-t border-slate-100">
                <span className="text-slate-400 block text-[11px]">Designated Class Advisor & Mentor</span>
                <strong className="text-slate-900 text-sm block mt-0.5">{currentStudent.mentorName}</strong>
                <span className="text-[11px] text-slate-500">Associate Professor, Department of CSE</span>
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
          <div className="space-y-5">
            {/* Parent Identity Header */}
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-lg border border-emerald-200">
                RK
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900">{currentParent.fullName}</h3>
                  <Badge variant="success" size="sm">
                    {currentParent.relationship}
                  </Badge>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{currentParent.occupation}</p>
              </div>
            </div>

            {/* Parent Information Grid */}
            <div className="space-y-3.5 text-xs">
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                <div>
                  <span className="text-slate-400 block text-[11px]">Registered Email Address</span>
                  <span className="text-slate-800 font-medium">{currentParent.email}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                <div>
                  <span className="text-slate-400 block text-[11px]">SMS & WhatsApp Contact</span>
                  <span className="text-slate-800 font-medium">{currentParent.phoneNumber}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                <div>
                  <span className="text-slate-400 block text-[11px]">Residential Address</span>
                  <span className="text-slate-800 leading-relaxed block mt-0.5">
                    {currentParent.address}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <span className="text-slate-400 block text-[11px] mb-1.5">Linked Children on Record:</span>
                <div className="space-y-1.5">
                  <div className="p-2 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between text-xs">
                    <div>
                      <strong className="text-slate-800">Aarav Kumar</strong>
                      <span className="text-slate-500 block text-[11px]">CSE2026001 • III Year CSE - B</span>
                    </div>
                    <Badge variant="primary" size="sm">Active</Badge>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between text-xs">
                    <div>
                      <strong className="text-slate-800">Ananya Kumar</strong>
                      <span className="text-slate-500 block text-[11px]">ECE2026045 • I Year ECE - A</span>
                    </div>
                    <Badge variant="primary" size="sm">Active</Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
