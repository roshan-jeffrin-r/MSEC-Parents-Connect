import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserRole,
  Student,
  Parent,
  Teacher,
  Examination,
  StudentReportCard,
  AttendanceRecord,
  LeaveRequest,
  Notification,
  Announcement,
  AttendanceStatus,
  LeaveStatus,
  SubjectMark,
  StudentOnboardData
} from '../types';
import {
  INITIAL_STUDENTS,
  INITIAL_PARENTS,
  INITIAL_TEACHERS,
  INITIAL_EXAMINATIONS,
  INITIAL_REPORT_CARDS,
  INITIAL_ATTENDANCE,
  INITIAL_LEAVE_REQUESTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_ANNOUNCEMENTS
} from '../data/mockData';

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  selectedStudentId: string;
  setSelectedStudentId: (id: string) => void;
  currentStudent: Student;
  currentParent: Parent;
  currentTeacher: Teacher;
  students: Student[];
  parents: Parent[];
  examinations: Examination[];
  reportCards: StudentReportCard[];
  attendance: AttendanceRecord[];
  leaveRequests: LeaveRequest[];
  notifications: Notification[];
  announcements: Announcement[];
  
  // Actions
  upsertStudentProfile: (data: StudentOnboardData) => {
    success: boolean;
    studentId: string;
    isNew: boolean;
    message: string;
  };
  submitLeaveRequest: (data: {
    studentId: string;
    startDate: string;
    endDate: string;
    leaveType: LeaveRequest['leaveType'];
    reason: string;
    documentName?: string;
  }) => { success: boolean; message: string };
  cancelLeaveRequest: (requestId: string) => void;
  reviewLeaveRequest: (requestId: string, status: LeaveStatus, reviewerRemarks: string) => void;
  recordAttendanceForDate: (
    records: { studentId: string; status: AttendanceStatus; arrivalTime?: string; notes?: string }[],
    date: string
  ) => void;
  publishReportCard: (examId: string, isPublished: boolean) => void;
  updateReportCardMarks: (reportCardId: string, subjects: SubjectMark[], teacherRemarks?: string) => void;
  markNotificationAsRead: (notificationId: string) => void;
  markAllNotificationsAsRead: () => void;
  createAnnouncement: (announcement: Omit<Announcement, 'announcementId' | 'publishedAt'>) => void;
  resetToDemoDefaults: () => void;
  
  // Faculty Demo Assistant
  isDemoGuideOpen: boolean;
  setIsDemoGuideOpen: (open: boolean) => void;
  demoStep: number;
  setDemoStep: (step: number) => void;
}

const STORAGE_KEY = 'lumina_parent_connect_storage_v1';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>('parent');
  const [selectedStudentId, setSelectedStudentId] = useState<string>('STU-001');
  const [isDemoGuideOpen, setIsDemoGuideOpen] = useState<boolean>(false);
  const [demoStep, setDemoStep] = useState<number>(1);

  // Core Data Collections
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_students`);
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
  });

  const [parents, setParents] = useState<Parent[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_parents`);
    return saved ? JSON.parse(saved) : INITIAL_PARENTS;
  });
  const [teachers] = useState<Teacher[]>(INITIAL_TEACHERS);

  const [examinations, setExaminations] = useState<Examination[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_examinations`);
    return saved ? JSON.parse(saved) : INITIAL_EXAMINATIONS;
  });

  const [reportCards, setReportCards] = useState<StudentReportCard[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_reportCards`);
    return saved ? JSON.parse(saved) : INITIAL_REPORT_CARDS;
  });

  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_attendance`);
    return saved ? JSON.parse(saved) : INITIAL_ATTENDANCE;
  });

  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_leaveRequests`);
    return saved ? JSON.parse(saved) : INITIAL_LEAVE_REQUESTS;
  });

  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_notifications`);
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_announcements`);
    return saved ? JSON.parse(saved) : INITIAL_ANNOUNCEMENTS;
  });

  // Persist state changes to localStorage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_students`, JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_parents`, JSON.stringify(parents));
  }, [parents]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_examinations`, JSON.stringify(examinations));
  }, [examinations]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_reportCards`, JSON.stringify(reportCards));
  }, [reportCards]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_attendance`, JSON.stringify(attendance));
  }, [attendance]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_leaveRequests`, JSON.stringify(leaveRequests));
  }, [leaveRequests]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_notifications`, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_announcements`, JSON.stringify(announcements));
  }, [announcements]);

  const currentStudent = students.find((s) => s.studentId === selectedStudentId) || students[0];
  const currentParent = parents[0];
  const currentTeacher = teachers[0];

  // Helper to format timestamps
  const getCurrentFormattedTime = () => {
    const now = new Date();
    return now.toISOString().replace('T', ' ').substring(0, 16);
  };

  // Upsert Student & Parent Profile (Self-Service Onboarding)
  const upsertStudentProfile = (data: StudentOnboardData) => {
    const regNo = data.registerNumber.trim().toUpperCase();

    // Check if student exists by registerNumber or studentId
    const existingIdx = students.findIndex(
      (s) => s.registerNumber.toUpperCase() === regNo || s.studentId.toUpperCase() === regNo
    );

    const isNew = existingIdx < 0;
    const targetStudentId = isNew ? `STU-${String(students.length + 1).padStart(3, '0')}` : students[existingIdx].studentId;
    const targetParentId = existingIdx >= 0 && students[existingIdx].parentIds?.[0]
      ? students[existingIdx].parentIds[0]
      : `PAR-${targetStudentId}`;

    const deptCode = data.department.includes('CSE') ? 'CSE'
      : data.department.includes('ECE') ? 'ECE'
      : data.department.includes('IT') ? 'IT'
      : data.department.includes('EEE') ? 'EEE'
      : data.department.includes('MECH') ? 'MECH'
      : data.department.includes('CIVIL') ? 'CIVIL'
      : 'ENGG';

    const updatedStudent: Student = {
      studentId: targetStudentId,
      registerNumber: regNo,
      fullName: data.fullName.trim(),
      department: data.department,
      departmentCode: deptCode,
      className: data.className.trim(),
      section: data.className.split('-')[1]?.trim() || 'A',
      semester: Number(data.semester),
      academicYear: existingIdx >= 0 ? students[existingIdx].academicYear : '2026-2027',
      dob: data.dob,
      gender: data.gender,
      bloodGroup: data.bloodGroup,
      mentorName: data.mentorName.trim() || 'Dr. K. Senthil Kumar',
      parentIds: [targetParentId],
      profileImage: existingIdx >= 0
        ? students[existingIdx].profileImage
        : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
      batch: existingIdx >= 0 ? students[existingIdx].batch : '2026-2030',
      hostelDayScholar: data.scholarType,
      busRoute: data.scholarType === 'Day Scholar' ? data.transportReference : undefined,
      modeOfTransport: data.modeOfTransport,
      transportReference: data.transportReference,
      studentMobile: data.studentMobile,
      studentEmail: data.studentEmail
    };

    // Upsert student
    setStudents((prev) => {
      if (existingIdx >= 0) {
        const copy = [...prev];
        copy[existingIdx] = updatedStudent;
        return copy;
      } else {
        return [...prev, updatedStudent];
      }
    });

    // Primary parent account name based on selection
    const primaryName = data.primaryAccountRelation === 'Father'
      ? data.fatherName
      : data.primaryAccountRelation === 'Mother'
      ? data.motherName
      : `${data.fatherName || data.motherName || 'Authorized'} (Guardian)`;

    // Upsert parent with bidirectional link
    setParents((prev) => {
      const parentIdx = prev.findIndex((p) => p.parentId === targetParentId || p.linkedStudentIds.includes(targetStudentId));
      const parentRecord: Parent = {
        parentId: targetParentId,
        fullName: primaryName.trim(),
        fatherName: data.fatherName.trim(),
        motherName: data.motherName.trim(),
        relationship: data.primaryAccountRelation,
        email: data.parentEmail.trim(),
        phoneNumber: data.parentPhone.trim(),
        linkedStudentIds: parentIdx >= 0
          ? Array.from(new Set([...prev[parentIdx].linkedStudentIds, targetStudentId]))
          : [targetStudentId],
        address: data.residentialAddress.trim(),
        city: data.city.trim(),
        pincode: data.pincode.trim(),
        occupation: parentIdx >= 0 ? prev[parentIdx].occupation : 'Parent / Guardian'
      };

      if (parentIdx >= 0) {
        const pCopy = [...prev];
        pCopy[parentIdx] = parentRecord;
        return pCopy;
      } else {
        return [...prev, parentRecord];
      }
    });

    // Seed muster attendance if new student
    if (isNew) {
      setAttendance((prev) => [
        {
          attendanceId: `ATT-${Date.now()}-${targetStudentId}`,
          studentId: targetStudentId,
          date: '2026-10-17',
          status: 'present',
          arrivalTime: '08:24 AM',
          recordedBy: updatedStudent.mentorName,
          updatedAt: '2026-10-17 08:30 AM',
          notes: 'Enrolled in academic database.'
        },
        ...prev
      ]);
    }

    // Activate this student in the portal
    setSelectedStudentId(targetStudentId);

    // Create system notification
    const timeNow = getCurrentFormattedTime();
    setNotifications((prev) => [
      {
        notificationId: `NOTIF-${Date.now()}`,
        recipientId: targetParentId,
        studentId: targetStudentId,
        title: isNew ? 'Student Profile Registered' : 'Student Records Verified',
        message: `Profile data for ${updatedStudent.fullName} (${regNo}) has been updated. Registered parent contact: ${data.parentPhone}.`,
        category: 'general',
        readStatus: false,
        createdAt: timeNow,
        actionUrl: '/profile'
      },
      ...prev
    ]);

    return {
      success: true,
      studentId: targetStudentId,
      isNew,
      message: isNew
        ? `Student ${updatedStudent.fullName} (${regNo}) successfully onboarded and linked to parent account!`
        : `Official profile and parent contact records for ${updatedStudent.fullName} (${regNo}) successfully updated!`
    };
  };

  // Submit Leave Request
  const submitLeaveRequest = (data: {
    studentId: string;
    startDate: string;
    endDate: string;
    leaveType: LeaveRequest['leaveType'];
    reason: string;
    documentName?: string;
  }) => {
    const targetStudent = students.find((s) => s.studentId === data.studentId) || currentStudent;
    
    // Calculate total days
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    const newRequestId = `LR-2026-${String(leaveRequests.length + 103).padStart(3, '0')}`;
    const newRequest: LeaveRequest = {
      requestId: newRequestId,
      studentId: data.studentId,
      studentName: targetStudent.fullName,
      className: targetStudent.className,
      submittedBy: `${currentParent.fullName} (${currentParent.relationship})`,
      parentEmail: currentParent.email,
      startDate: data.startDate,
      endDate: data.endDate,
      totalDays: isNaN(totalDays) ? 1 : totalDays,
      leaveType: data.leaveType,
      reason: data.reason,
      documentName: data.documentName,
      status: 'Pending',
      createdAt: getCurrentFormattedTime(),
      updatedAt: getCurrentFormattedTime()
    };

    setLeaveRequests((prev) => [newRequest, ...prev]);

    // Dispatch automated confirmation notification
    const newNotification: Notification = {
      notificationId: `NOTIF-${Date.now()}`,
      recipientId: currentParent.parentId,
      studentId: data.studentId,
      title: 'Leave Application Submitted',
      message: `Your ${data.leaveType} leave request (${newRequestId}) for ${targetStudent.fullName} (${data.startDate} to ${data.endDate}) has been submitted for faculty review.`,
      category: 'leave',
      readStatus: false,
      createdAt: getCurrentFormattedTime(),
      actionUrl: '/leave-requests'
    };

    setNotifications((prev) => [newNotification, ...prev]);

    return { success: true, message: `Leave request ${newRequestId} submitted successfully.` };
  };

  // Cancel Leave Request (Parent action)
  const cancelLeaveRequest = (requestId: string) => {
    setLeaveRequests((prev) =>
      prev.map((req) => (req.requestId === requestId ? { ...req, status: 'Cancelled', updatedAt: getCurrentFormattedTime() } : req))
    );
  };

  // Review Leave Request (Teacher / Admin action)
  const reviewLeaveRequest = (requestId: string, status: LeaveStatus, reviewerRemarks: string) => {
    const targetReq = leaveRequests.find((r) => r.requestId === requestId);
    if (!targetReq) return;

    setLeaveRequests((prev) =>
      prev.map((req) =>
        req.requestId === requestId
          ? {
              ...req,
              status,
              reviewerId: currentTeacher.teacherId,
              reviewerName: currentTeacher.fullName,
              reviewerRemarks,
              updatedAt: getCurrentFormattedTime()
            }
          : req
      )
    );

    // If approved, institutional policy updates attendance records for those dates to 'on_leave'
    if (status === 'Approved') {
      const start = new Date(targetReq.startDate);
      const end = new Date(targetReq.endDate);
      const datesToUpdate: string[] = [];
      const cur = new Date(start);
      while (cur <= end) {
        datesToUpdate.push(cur.toISOString().split('T')[0]);
        cur.setDate(cur.getDate() + 1);
      }

      setAttendance((prev) => {
        let updated = [...prev];
        datesToUpdate.forEach((d) => {
          const existingIdx = updated.findIndex((a) => a.studentId === targetReq.studentId && a.date === d);
          if (existingIdx >= 0) {
            updated[existingIdx] = {
              ...updated[existingIdx],
              status: 'on_leave',
              notes: `Approved leave (${targetReq.requestId}): ${reviewerRemarks}`,
              updatedAt: getCurrentFormattedTime()
            };
          } else {
            updated.unshift({
              attendanceId: `ATT-${d}-${targetReq.studentId}`,
              studentId: targetReq.studentId,
              date: d,
              status: 'on_leave',
              recordedBy: currentTeacher.fullName,
              updatedAt: getCurrentFormattedTime(),
              notes: `Approved leave (${targetReq.requestId}): ${reviewerRemarks}`
            });
          }
        });
        return updated;
      });
    }

    // Dispatch notification to parent
    const newNotification: Notification = {
      notificationId: `NOTIF-${Date.now()}`,
      recipientId: currentParent.parentId,
      studentId: targetReq.studentId,
      title: `Leave Request ${status}`,
      message: `Your leave request (${requestId}) for ${targetReq.studentName} has been ${status.toLowerCase()} by ${currentTeacher.fullName}. Remarks: "${reviewerRemarks}"`,
      category: 'leave',
      readStatus: false,
      createdAt: getCurrentFormattedTime(),
      actionUrl: '/leave-requests'
    };

    setNotifications((prev) => [newNotification, ...prev]);
  };

  // Record Attendance for a Date (Teacher action)
  const recordAttendanceForDate = (
    records: { studentId: string; status: AttendanceStatus; arrivalTime?: string; notes?: string }[],
    date: string
  ) => {
    setAttendance((prev) => {
      let updated = [...prev];
      records.forEach((rec) => {
        const existingIdx = updated.findIndex((a) => a.studentId === rec.studentId && a.date === date);
        const recordData: AttendanceRecord = {
          attendanceId: existingIdx >= 0 ? updated[existingIdx].attendanceId : `ATT-${date}-${rec.studentId}`,
          studentId: rec.studentId,
          date,
          status: rec.status,
          arrivalTime: rec.arrivalTime,
          recordedBy: currentTeacher.fullName,
          updatedAt: getCurrentFormattedTime(),
          notes: rec.notes
        };

        if (existingIdx >= 0) {
          updated[existingIdx] = recordData;
        } else {
          updated.unshift(recordData);
        }

        // If student is linked to Rajesh Kumar and status is late or absent, trigger alert
        if (rec.studentId === 'STU-001' && (rec.status === 'absent' || rec.status === 'late')) {
          const studentObj = students.find((s) => s.studentId === rec.studentId);
          const title = rec.status === 'late' ? 'Late Arrival Notification' : 'Absence Alert';
          const msg =
            rec.status === 'late'
              ? `Your child ${studentObj?.fullName || 'Aarav'} arrived late on ${date}${rec.arrivalTime ? ` at ${rec.arrivalTime}` : ''}.`
              : `Your child ${studentObj?.fullName || 'Aarav'} was marked absent on ${date} during morning attendance call.`;

          setNotifications((nPrev) => [
            {
              notificationId: `NOTIF-${Date.now()}-${rec.studentId}`,
              recipientId: currentParent.parentId,
              studentId: rec.studentId,
              title,
              message: msg,
              category: 'attendance',
              readStatus: false,
              createdAt: getCurrentFormattedTime(),
              actionUrl: '/attendance'
            },
            ...nPrev
          ]);
        }
      });
      return updated;
    });
  };

  // Publish / Unpublish Report Card
  const publishReportCard = (examId: string, isPublished: boolean) => {
    setExaminations((prev) =>
      prev.map((e) => (e.examId === examId ? { ...e, publicationStatus: isPublished ? 'Published' : 'Draft' } : e))
    );

    setReportCards((prev) =>
      prev.map((rc) => (rc.examId === examId ? { ...rc, isPublished } : rc))
    );

    if (isPublished) {
      const exam = examinations.find((e) => e.examId === examId);
      const newNotification: Notification = {
        notificationId: `NOTIF-${Date.now()}`,
        recipientId: currentParent.parentId,
        studentId: currentStudent.studentId,
        title: `${exam?.examName || 'Examination'} Results Published`,
        message: `The official report card for ${exam?.examName || 'Examination'} is now published and available for download.`,
        category: 'academic',
        readStatus: false,
        createdAt: getCurrentFormattedTime(),
        actionUrl: '/report-cards'
      };
      setNotifications((prev) => [newNotification, ...prev]);
    }
  };

  // Update Report Card Marks
  const updateReportCardMarks = (reportCardId: string, subjects: SubjectMark[], teacherRemarks?: string) => {
    setReportCards((prev) =>
      prev.map((rc) => {
        if (rc.reportCardId !== reportCardId) return rc;

        const totalMarksObtained = subjects.reduce((sum, s) => sum + s.marksObtained, 0);
        const totalMaximumMarks = subjects.reduce((sum, s) => sum + s.maximumMarks, 0);
        const percentage = Number(((totalMarksObtained / totalMaximumMarks) * 100).toFixed(2));
        
        // Calculate GPA based on credits
        const totalCredits = subjects.reduce((sum, s) => sum + s.credits, 0);
        const weightedPoints = subjects.reduce((sum, s) => sum + s.gradePoints * s.credits, 0);
        const gpa = Number((weightedPoints / totalCredits).toFixed(2));

        const resultStatus = percentage >= 85 ? 'FIRST CLASS WITH DISTINCTION' : percentage >= 60 ? 'FIRST CLASS' : 'SECOND CLASS';

        return {
          ...rc,
          subjects,
          totalMarksObtained,
          totalMaximumMarks,
          percentage,
          gpa,
          resultStatus,
          teacherRemarks: teacherRemarks !== undefined ? teacherRemarks : rc.teacherRemarks
        };
      })
    );
  };

  // Mark notification as read
  const markNotificationAsRead = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.notificationId === notificationId ? { ...n, readStatus: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, readStatus: true })));
  };

  // Create Announcement
  const createAnnouncement = (data: Omit<Announcement, 'announcementId' | 'publishedAt'>) => {
    const newAnn: Announcement = {
      ...data,
      announcementId: `ANN-${String(announcements.length + 1).padStart(3, '0')}`,
      publishedAt: getCurrentFormattedTime()
    };
    setAnnouncements((prev) => [newAnn, ...prev]);
  };

  // Reset to Demo Defaults
  const resetToDemoDefaults = () => {
    localStorage.removeItem(`${STORAGE_KEY}_students`);
    localStorage.removeItem(`${STORAGE_KEY}_parents`);
    localStorage.removeItem(`${STORAGE_KEY}_examinations`);
    localStorage.removeItem(`${STORAGE_KEY}_reportCards`);
    localStorage.removeItem(`${STORAGE_KEY}_attendance`);
    localStorage.removeItem(`${STORAGE_KEY}_leaveRequests`);
    localStorage.removeItem(`${STORAGE_KEY}_notifications`);
    localStorage.removeItem(`${STORAGE_KEY}_announcements`);

    setStudents(INITIAL_STUDENTS);
    setParents(INITIAL_PARENTS);
    setExaminations(INITIAL_EXAMINATIONS);
    setReportCards(INITIAL_REPORT_CARDS);
    setAttendance(INITIAL_ATTENDANCE);
    setLeaveRequests(INITIAL_LEAVE_REQUESTS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setAnnouncements(INITIAL_ANNOUNCEMENTS);
    setSelectedStudentId('STU-001');
    setRole('parent');
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        selectedStudentId,
        setSelectedStudentId,
        currentStudent,
        currentParent,
        currentTeacher,
        students,
        parents,
        examinations,
        reportCards,
        attendance,
        leaveRequests,
        notifications,
        announcements,
        upsertStudentProfile,
        submitLeaveRequest,
        cancelLeaveRequest,
        reviewLeaveRequest,
        recordAttendanceForDate,
        publishReportCard,
        updateReportCardMarks,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        createAnnouncement,
        resetToDemoDefaults,
        isDemoGuideOpen,
        setIsDemoGuideOpen,
        demoStep,
        setDemoStep
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
