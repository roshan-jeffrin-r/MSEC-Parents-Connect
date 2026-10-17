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
  StaffAccount,
  GoogleFormStudentRecord
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
  INITIAL_ANNOUNCEMENTS,
  FIXED_STAFF_ACCOUNTS
} from '../data/mockData';

// Cookie Helpers
export const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
};

export const setCookie = (name: string, value: string, days = 30): void => {
  if (typeof document === 'undefined') return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
};

export const deleteCookie = (name: string): void => {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax`;
};

// Strict Class Scoping Matcher Helper
export const matchesAssignedClass = (className: string, assignedClass: string): boolean => {
  if (!assignedClass || assignedClass === 'ALL') return true;
  if (assignedClass === 'ALL_CSE') {
    return className.includes('CSE');
  }
  const cleanAssigned = assignedClass.replace(/\s+/g, '').toUpperCase();
  const cleanClass = className.replace(/\s+/g, '').toUpperCase();
  return cleanClass.includes(cleanAssigned) || cleanAssigned.includes(cleanClass);
};

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

  // Workflow 1: Staff Authentication & Class Scoping
  currentStaff: StaffAccount | null;
  staffLogin: (username: string, password: string) => { success: boolean; message: string; staff?: StaffAccount };
  staffLogout: () => void;
  staffAccounts: StaffAccount[];

  // Workflow 2: Frictionless Parent Auto-Login (Phone/Email/RegNo)
  isParentLoginModalOpen: boolean;
  setIsParentLoginModalOpen: (open: boolean) => void;
  loginParentByIdentifier: (identifier: string) => { success: boolean; message: string; parent?: Parent; student?: Student };
  parentLogout: () => void;

  // Workflow 3: Google Form CSV/JSON Auto-Sorter & Sibling Linker
  importGoogleFormRecords: (records: GoogleFormStudentRecord[]) => {
    success: boolean;
    studentsAdded: number;
    familiesCount: number;
    siblingsLinkedCount: number;
    message: string;
  };

  // Actions
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

const STORAGE_KEY = 'lumina_parent_connect_storage_v2';
const COOKIE_STAFF_KEY = 'msec_staff_session';
const COOKIE_PARENT_KEY = 'msec_parent_id';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>('parent');
  const [isDemoGuideOpen, setIsDemoGuideOpen] = useState<boolean>(false);
  const [demoStep, setDemoStep] = useState<number>(1);
  const [isParentLoginModalOpen, setIsParentLoginModalOpen] = useState<boolean>(false);

  // Staff State
  const [currentStaff, setCurrentStaff] = useState<StaffAccount | null>(() => {
    const sessionCookie = getCookie(COOKIE_STAFF_KEY);
    const sessionStorage = localStorage.getItem(COOKIE_STAFF_KEY);
    const username = sessionCookie || sessionStorage;
    if (username) {
      const found = FIXED_STAFF_ACCOUNTS.find((s) => s.username === username);
      return found || null;
    }
    return null;
  });

  // Data Collections
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_students`);
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
  });

  const [parents, setParents] = useState<Parent[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_parents`);
    return saved ? JSON.parse(saved) : INITIAL_PARENTS;
  });

  const [teachers] = useState<Teacher[]>(INITIAL_TEACHERS);

  // Parent State: check cookie or localStorage for returning parent
  const [currentParentId, setCurrentParentId] = useState<string>(() => {
    const savedCookie = getCookie(COOKIE_PARENT_KEY);
    const savedStorage = localStorage.getItem(COOKIE_PARENT_KEY);
    return savedCookie || savedStorage || 'PAR-001';
  });

  const [selectedStudentId, setSelectedStudentId] = useState<string>(() => {
    const savedStudent = localStorage.getItem(`${STORAGE_KEY}_selected_student`);
    return savedStudent || 'STU-001';
  });

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

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_students`, JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_parents`, JSON.stringify(parents));
  }, [parents]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_selected_student`, selectedStudentId);
  }, [selectedStudentId]);

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

  // Derived current entities
  const currentParent = parents.find((p) => p.parentId === currentParentId) || parents[0];

  // Current student fallback to linked students of current parent
  const currentStudent =
    students.find((s) => s.studentId === selectedStudentId) ||
    students.find((s) => currentParent?.linkedStudentIds?.includes(s.studentId)) ||
    students[0];

  // Current teacher derived from active staff session or fallback
  const currentTeacher =
    teachers.find((t) => t.fullName === currentStaff?.fullName) ||
    (currentStaff
      ? {
          teacherId: `STAFF-${currentStaff.username}`,
          fullName: currentStaff.fullName,
          designation: currentStaff.designation,
          department: currentStaff.department,
          email: currentStaff.email,
          phoneNumber: currentStaff.phoneNumber || '+91 94440 00000',
          assignedClasses: [currentStaff.assignedClass],
          assignedSubjects: [
            { subjectCode: 'CS3301', subjectName: 'Data Structures', className: currentStaff.assignedClass }
          ]
        }
      : teachers[0]);

  const getCurrentFormattedTime = () => {
    const now = new Date();
    return now.toISOString().replace('T', ' ').substring(0, 16);
  };

  // Workflow 1: Staff Authentication
  const staffLogin = (username: string, password: string) => {
    const matched = FIXED_STAFF_ACCOUNTS.find(
      (s) => s.username.toLowerCase() === username.trim().toLowerCase() && s.password === password
    );

    if (matched) {
      setCurrentStaff(matched);
      setRole('teacher');
      setCookie(COOKIE_STAFF_KEY, matched.username, 7);
      localStorage.setItem(COOKIE_STAFF_KEY, matched.username);
      return { success: true, message: `Welcome back, ${matched.fullName}! Logged into ${matched.assignedClass}.`, staff: matched };
    }

    return { success: false, message: 'Invalid credentials. Password issued by Principal/HOD cannot be changed in-app.' };
  };

  const staffLogout = () => {
    deleteCookie(COOKIE_STAFF_KEY);
    localStorage.removeItem(COOKIE_STAFF_KEY);
    setCurrentStaff(null);
    setRole('parent');
  };

  // Workflow 2: Frictionless Parent Auto-Login (Phone / Email / RegNo)
  const loginParentByIdentifier = (rawIdentifier: string) => {
    const cleanId = rawIdentifier.trim();
    if (!cleanId) {
      return { success: false, message: 'Please enter a Mobile Number, Email, or Register Number.' };
    }

    const digitsOnly = cleanId.replace(/\D/g, '');

    // 1. Try matching by Phone
    let matchedParent = parents.find((p) => {
      const pDigits = p.phoneNumber.replace(/\D/g, '');
      return digitsOnly.length >= 7 && (pDigits.endsWith(digitsOnly) || digitsOnly.endsWith(pDigits));
    });

    // 2. Try matching by Email
    if (!matchedParent) {
      matchedParent = parents.find((p) => p.email.toLowerCase() === cleanId.toLowerCase());
    }

    // 3. Try matching by Student Register Number
    let matchedStudent: Student | undefined;
    if (!matchedParent) {
      matchedStudent = students.find(
        (s) => s.registerNumber.toUpperCase() === cleanId.toUpperCase()
      );
      if (matchedStudent) {
        matchedParent = parents.find((p) => p.linkedStudentIds.includes(matchedStudent!.studentId));
      }
    }

    if (matchedParent) {
      setCurrentParentId(matchedParent.parentId);
      setCookie(COOKIE_PARENT_KEY, matchedParent.parentId, 30);
      localStorage.setItem(COOKIE_PARENT_KEY, matchedParent.parentId);

      // Select student
      if (matchedStudent) {
        setSelectedStudentId(matchedStudent.studentId);
      } else if (matchedParent.linkedStudentIds.length > 0) {
        setSelectedStudentId(matchedParent.linkedStudentIds[0]);
      }

      setRole('parent');
      return {
        success: true,
        parent: matchedParent,
        student: matchedStudent,
        message: `Welcome, ${matchedParent.fullName}! Auto-authenticated with 30-day session cookie.`
      };
    }

    return {
      success: false,
      message: 'No record found matching that Mobile Number, Email, or Register Number. Please check and retry.'
    };
  };

  const parentLogout = () => {
    deleteCookie(COOKIE_PARENT_KEY);
    localStorage.removeItem(COOKIE_PARENT_KEY);
    setCurrentParentId('');
  };

  // Workflow 3: Google Form CSV/JSON Auto-Sorter & Sibling Linker
  const importGoogleFormRecords = (records: GoogleFormStudentRecord[]) => {
    if (!records || records.length === 0) {
      return { success: false, studentsAdded: 0, familiesCount: 0, siblingsLinkedCount: 0, message: 'No records to process.' };
    }

    // 1. Sort records by batch -> className -> fullName
    const sorted = [...records].sort((a, b) => {
      if (a.batch !== b.batch) return a.batch.localeCompare(b.batch);
      if (a.className !== b.className) return a.className.localeCompare(b.className);
      return a.fullName.localeCompare(b.fullName);
    });

    // 2. Group by normalized parentPhone or parentEmail to identify siblings
    const familyGroups = new Map<string, GoogleFormStudentRecord[]>();

    sorted.forEach((rec) => {
      const cleanPhone = rec.parentPhone ? rec.parentPhone.replace(/\D/g, '').slice(-10) : '';
      const cleanEmail = rec.parentEmail ? rec.parentEmail.trim().toLowerCase() : '';
      const groupKey = cleanPhone || cleanEmail || `single_${rec.registerNumber}`;

      if (!familyGroups.has(groupKey)) {
        familyGroups.set(groupKey, []);
      }
      familyGroups.get(groupKey)!.push(rec);
    });

    let siblingsLinkedCount = 0;
    const newStudents: Student[] = [];
    const newParents: Parent[] = [];

    // 3. Create Student and Parent records with advisors and linked siblings
    familyGroups.forEach((groupRecords, groupKey) => {
      const parentId = `PAR-SYNC-${groupKey.slice(0, 10)}`;
      const first = groupRecords[0];
      const linkedIds: string[] = [];

      groupRecords.forEach((rec) => {
        const studentId = `STU-SYNC-${rec.registerNumber}`;
        linkedIds.push(studentId);

        // Advisor assignment based on className
        let advisor = 'Dr. Kavitha Menon';
        if (rec.className.toUpperCase().includes('ECE')) {
          advisor = 'Prof. S. Ramesh';
        } else if (rec.className.toUpperCase().includes('CSE')) {
          advisor = 'Dr. Kavitha Menon';
        }

        newStudents.push({
          studentId,
          registerNumber: rec.registerNumber,
          fullName: rec.fullName,
          department: rec.department,
          departmentCode: rec.department.includes('Electronics') ? 'ECE' : 'CSE',
          className: rec.className,
          section: rec.className.slice(-1) || 'A',
          semester: rec.semester || 1,
          academicYear: '2026-2027',
          dob: '2005-01-01',
          bloodGroup: 'O+',
          mentorName: advisor,
          parentIds: [parentId],
          profileImage: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=300',
          batch: rec.batch || '2025-2029',
          hostelDayScholar: 'Day Scholar'
        });
      });

      if (groupRecords.length > 1) {
        siblingsLinkedCount += groupRecords.length;
      }

      newParents.push({
        parentId,
        fullName: first.parentName,
        relationship: (first.relation as any) || 'Father',
        email: first.parentEmail || `${first.parentName.toLowerCase().replace(/\s+/g, '.')}@parent.msec.edu`,
        phoneNumber: first.parentPhone || '+91 98401 00000',
        linkedStudentIds: linkedIds,
        address: 'Chennai, Tamil Nadu',
        occupation: 'Parent'
      });
    });

    // Update context state
    setStudents((prev) => {
      const filtered = prev.filter((s) => !newStudents.some((ns) => ns.registerNumber === s.registerNumber));
      return [...filtered, ...newStudents];
    });

    setParents((prev) => {
      const filtered = prev.filter((p) => !newParents.some((np) => np.parentId === p.parentId));
      return [...filtered, ...newParents];
    });

    return {
      success: true,
      studentsAdded: newStudents.length,
      familiesCount: familyGroups.size,
      siblingsLinkedCount,
      message: `Successfully sorted ${newStudents.length} students across ${familyGroups.size} families. Linked ${siblingsLinkedCount} siblings under unified parent accounts!`
    };
  };

  // Standard Leave and Attendance Actions
  const submitLeaveRequest = (data: {
    studentId: string;
    startDate: string;
    endDate: string;
    leaveType: LeaveRequest['leaveType'];
    reason: string;
    documentName?: string;
  }) => {
    const targetStudent = students.find((s) => s.studentId === data.studentId) || currentStudent;
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

    setNotifications((prev) => [
      {
        notificationId: `NOTIF-${Date.now()}`,
        recipientId: currentParent.parentId,
        studentId: data.studentId,
        title: 'Leave Application Submitted',
        message: `Your ${data.leaveType} leave request (${newRequestId}) for ${targetStudent.fullName} (${data.startDate} to ${data.endDate}) has been submitted to Class Advisor ${targetStudent.mentorName}.`,
        category: 'leave',
        readStatus: false,
        createdAt: getCurrentFormattedTime(),
        actionUrl: '/leave-requests'
      },
      ...prev
    ]);

    return { success: true, message: `Leave request ${newRequestId} submitted successfully.` };
  };

  const cancelLeaveRequest = (requestId: string) => {
    setLeaveRequests((prev) =>
      prev.map((req) => (req.requestId === requestId ? { ...req, status: 'Cancelled', updatedAt: getCurrentFormattedTime() } : req))
    );
  };

  const reviewLeaveRequest = (requestId: string, status: LeaveStatus, reviewerRemarks: string) => {
    const targetReq = leaveRequests.find((r) => r.requestId === requestId);
    if (!targetReq) return;

    setLeaveRequests((prev) =>
      prev.map((req) =>
        req.requestId === requestId
          ? {
              ...req,
              status,
              reviewerId: currentStaff?.username || currentTeacher.teacherId,
              reviewerName: currentStaff?.fullName || currentTeacher.fullName,
              reviewerRemarks,
              updatedAt: getCurrentFormattedTime()
            }
          : req
      )
    );

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
              recordedBy: currentStaff?.fullName || currentTeacher.fullName,
              updatedAt: getCurrentFormattedTime(),
              notes: `Approved leave (${targetReq.requestId}): ${reviewerRemarks}`
            });
          }
        });
        return updated;
      });
    }

    setNotifications((prev) => [
      {
        notificationId: `NOTIF-${Date.now()}`,
        recipientId: currentParent.parentId,
        studentId: targetReq.studentId,
        title: `Leave Request ${status}`,
        message: `Your leave request (${requestId}) for ${targetReq.studentName} was ${status.toLowerCase()} by ${currentStaff?.fullName || currentTeacher.fullName}. Remarks: "${reviewerRemarks}"`,
        category: 'leave',
        readStatus: false,
        createdAt: getCurrentFormattedTime(),
        actionUrl: '/leave-requests'
      },
      ...prev
    ]);
  };

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
          recordedBy: currentStaff?.fullName || currentTeacher.fullName,
          updatedAt: getCurrentFormattedTime(),
          notes: rec.notes
        };

        if (existingIdx >= 0) {
          updated[existingIdx] = recordData;
        } else {
          updated.unshift(recordData);
        }

        // Notify parents of late/absent students
        if (rec.status === 'absent' || rec.status === 'late') {
          const studentObj = students.find((s) => s.studentId === rec.studentId);
          const title = rec.status === 'late' ? 'Late Arrival Notification' : 'Absence Alert';
          const msg =
            rec.status === 'late'
              ? `Your child ${studentObj?.fullName || 'Student'} arrived late on ${date}${rec.arrivalTime ? ` at ${rec.arrivalTime}` : ''}.`
              : `Your child ${studentObj?.fullName || 'Student'} was marked absent on ${date} during morning attendance call.`;

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

  const publishReportCard = (examId: string, isPublished: boolean) => {
    setExaminations((prev) =>
      prev.map((e) => (e.examId === examId ? { ...e, publicationStatus: isPublished ? 'Published' : 'Draft' } : e))
    );

    setReportCards((prev) =>
      prev.map((rc) => (rc.examId === examId ? { ...rc, isPublished } : rc))
    );

    if (isPublished) {
      const exam = examinations.find((e) => e.examId === examId);
      setNotifications((prev) => [
        {
          notificationId: `NOTIF-${Date.now()}`,
          recipientId: currentParent.parentId,
          studentId: currentStudent.studentId,
          title: `${exam?.examName || 'Examination'} Results Published`,
          message: `The official report card for ${exam?.examName || 'Examination'} is now published and available for download.`,
          category: 'academic',
          readStatus: false,
          createdAt: getCurrentFormattedTime(),
          actionUrl: '/report-cards'
        },
        ...prev
      ]);
    }
  };

  const updateReportCardMarks = (reportCardId: string, subjects: SubjectMark[], teacherRemarks?: string) => {
    setReportCards((prev) =>
      prev.map((rc) => {
        if (rc.reportCardId !== reportCardId) return rc;

        const totalMarksObtained = subjects.reduce((sum, s) => sum + s.marksObtained, 0);
        const totalMaximumMarks = subjects.reduce((sum, s) => sum + s.maximumMarks, 0);
        const percentage = Number(((totalMarksObtained / totalMaximumMarks) * 100).toFixed(2));
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

  const markNotificationAsRead = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.notificationId === notificationId ? { ...n, readStatus: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, readStatus: true })));
  };

  const createAnnouncement = (data: Omit<Announcement, 'announcementId' | 'publishedAt'>) => {
    const newAnn: Announcement = {
      ...data,
      announcementId: `ANN-${String(announcements.length + 1).padStart(3, '0')}`,
      publishedAt: getCurrentFormattedTime()
    };
    setAnnouncements((prev) => [newAnn, ...prev]);
  };

  const resetToDemoDefaults = () => {
    localStorage.clear();
    deleteCookie(COOKIE_STAFF_KEY);
    deleteCookie(COOKIE_PARENT_KEY);

    setStudents(INITIAL_STUDENTS);
    setParents(INITIAL_PARENTS);
    setExaminations(INITIAL_EXAMINATIONS);
    setReportCards(INITIAL_REPORT_CARDS);
    setAttendance(INITIAL_ATTENDANCE);
    setLeaveRequests(INITIAL_LEAVE_REQUESTS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setAnnouncements(INITIAL_ANNOUNCEMENTS);
    setSelectedStudentId('STU-001');
    setCurrentParentId('PAR-001');
    setCurrentStaff(null);
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
        currentStaff,
        staffLogin,
        staffLogout,
        staffAccounts: FIXED_STAFF_ACCOUNTS,
        isParentLoginModalOpen,
        setIsParentLoginModalOpen,
        loginParentByIdentifier,
        parentLogout,
        importGoogleFormRecords,
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
