export type UserRole = 'parent' | 'teacher' | 'admin';

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'on_leave';

export type LeaveType = 'Medical' | 'Personal' | 'Family Emergency' | 'Other';

export type LeaveStatus = 'Pending' | 'Approved' | 'Rejected' | 'Cancelled';

export type ExamStatus = 'Draft' | 'Grading' | 'Published';

export type NotificationCategory = 'attendance' | 'academic' | 'leave' | 'announcement' | 'general';

export interface Student {
  studentId: string;
  registerNumber: string;
  fullName: string;
  department: string;
  departmentCode: string;
  className: string;
  section: string;
  semester: number;
  academicYear: string;
  dob: string;
  gender?: 'Male' | 'Female' | 'Other';
  bloodGroup: string;
  mentorName: string;
  parentIds: string[];
  profileImage: string;
  batch: string;
  hostelDayScholar: 'Day Scholar' | 'Hostelite';
  busRoute?: string;
  modeOfTransport?: string;
  transportReference?: string;
  studentMobile?: string;
  studentEmail?: string;
}

export interface Parent {
  parentId: string;
  fullName: string;
  fatherName?: string;
  motherName?: string;
  relationship: 'Father' | 'Mother' | 'Guardian';
  email: string;
  phoneNumber: string;
  linkedStudentIds: string[];
  address: string;
  city?: string;
  pincode?: string;
  occupation: string;
}

export interface StudentOnboardData {
  registerNumber: string;
  fullName: string;
  department: string;
  className: string;
  semester: number;
  dob: string;
  gender: 'Male' | 'Female' | 'Other';
  bloodGroup: string;
  mentorName: string;
  scholarType: 'Day Scholar' | 'Hostelite';
  modeOfTransport: string;
  transportReference: string;
  studentMobile: string;
  studentEmail: string;
  fatherName: string;
  motherName: string;
  primaryAccountRelation: 'Father' | 'Mother' | 'Guardian';
  parentPhone: string;
  parentEmail: string;
  residentialAddress: string;
  city: string;
  pincode: string;
}

export interface Teacher {
  teacherId: string;
  fullName: string;
  designation: string;
  department: string;
  email: string;
  phoneNumber: string;
  assignedClasses: string[];
  assignedSubjects: {
    subjectCode: string;
    subjectName: string;
    className: string;
  }[];
}

export interface SubjectMark {
  subjectCode: string;
  subjectName: string;
  credits: number;
  maximumMarks: number;
  marksObtained: number;
  grade: 'O' | 'A+' | 'A' | 'B+' | 'B' | 'RA';
  gradePoints: number;
  status: 'PASS' | 'FAIL';
  classAverage?: number;
  highestMark?: number;
}

export interface Examination {
  examId: string;
  examName: string;
  academicYear: string;
  semester: number;
  publicationStatus: ExamStatus;
  publicationDate: string;
  examStartDate: string;
  examEndDate: string;
}

export interface StudentReportCard {
  reportCardId: string;
  studentId: string;
  examId: string;
  examName: string;
  semester: number;
  academicYear: string;
  subjects: SubjectMark[];
  totalMaximumMarks: number;
  totalMarksObtained: number;
  percentage: number;
  gpa: number;
  cgpa: number;
  resultStatus: 'FIRST CLASS WITH DISTINCTION' | 'FIRST CLASS' | 'SECOND CLASS' | 'RE-APPEAR';
  classRank?: number;
  totalStudentsInClass: number;
  teacherRemarks: string;
  publishedDate: string;
  isPublished: boolean;
}

export interface AttendanceRecord {
  attendanceId: string;
  studentId: string;
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
  arrivalTime?: string; // e.g. "09:12 AM"
  recordedBy: string; // Teacher name
  updatedAt: string;
  notes?: string;
  periodBreakdown?: {
    period: number;
    subject: string;
    status: AttendanceStatus;
  }[];
}

export interface LeaveRequest {
  requestId: string;
  studentId: string;
  studentName: string;
  className: string;
  submittedBy: string; // Parent Name
  parentEmail: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  leaveType: LeaveType;
  reason: string;
  documentName?: string;
  status: LeaveStatus;
  reviewerId?: string;
  reviewerName?: string;
  reviewerRemarks?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  notificationId: string;
  recipientId: string;
  studentId: string;
  title: string;
  message: string;
  category: NotificationCategory;
  readStatus: boolean;
  createdAt: string;
  actionUrl?: string;
}

export interface Announcement {
  announcementId: string;
  title: string;
  message: string;
  category: 'Examination' | 'Academic' | 'Holiday' | 'Event' | 'Administration';
  priority: 'Normal' | 'Important' | 'Urgent';
  publishedAt: string;
  publishedBy: string;
  attachmentName?: string;
}
