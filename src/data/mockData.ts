import {
  Student,
  Parent,
  Teacher,
  Examination,
  StudentReportCard,
  AttendanceRecord,
  LeaveRequest,
  Notification,
  Announcement
} from '../types';

export const INITIAL_STUDENTS: Student[] = [
  {
    studentId: 'STU-001',
    registerNumber: 'CSE2026001',
    fullName: 'Aarav Kumar',
    department: 'Computer Science and Engineering',
    departmentCode: 'CSE',
    className: 'III Year CSE - B',
    section: 'B',
    semester: 3,
    academicYear: '2026-2027',
    dob: '2005-08-14',
    bloodGroup: 'B+',
    mentorName: 'Dr. K. Senthil Kumar',
    parentIds: ['PAR-001'],
    profileImage: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=300',
    batch: '2025-2029',
    hostelDayScholar: 'Day Scholar',
    busRoute: 'Route 14 (Tambaram to MSEC Kodambakkam)'
  },
  {
    studentId: 'STU-002',
    registerNumber: 'ECE2026045',
    fullName: 'Ananya Kumar',
    department: 'Electronics and Communication Engineering',
    departmentCode: 'ECE',
    className: 'I Year ECE - A',
    section: 'A',
    semester: 1,
    academicYear: '2026-2027',
    dob: '2007-03-22',
    bloodGroup: 'O+',
    mentorName: 'Prof. Lakshmi Narayanan',
    parentIds: ['PAR-001'],
    profileImage: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=300',
    batch: '2026-2030',
    hostelDayScholar: 'Day Scholar',
    busRoute: 'Route 14 (Tambaram to MSEC Kodambakkam)'
  },
  {
    studentId: 'STU-003',
    registerNumber: 'CSE2026002',
    fullName: 'Karthik V',
    department: 'Computer Science and Engineering',
    departmentCode: 'CSE',
    className: 'III Year CSE - B',
    section: 'B',
    semester: 3,
    academicYear: '2026-2027',
    dob: '2005-09-10',
    bloodGroup: 'A+',
    mentorName: 'Dr. K. Senthil Kumar',
    parentIds: ['PAR-002'],
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
    batch: '2025-2029',
    hostelDayScholar: 'Hostelite'
  },
  {
    studentId: 'STU-004',
    registerNumber: 'CSE2026003',
    fullName: 'Priya M',
    department: 'Computer Science and Engineering',
    departmentCode: 'CSE',
    className: 'III Year CSE - B',
    section: 'B',
    semester: 3,
    academicYear: '2026-2027',
    dob: '2005-11-05',
    bloodGroup: 'O-',
    mentorName: 'Dr. K. Senthil Kumar',
    parentIds: ['PAR-003'],
    profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=300',
    batch: '2025-2029',
    hostelDayScholar: 'Day Scholar',
    busRoute: 'Route 07 (Anna Nagar to MSEC)'
  },
  {
    studentId: 'STU-005',
    registerNumber: 'CSE2026004',
    fullName: 'Harish R',
    department: 'Computer Science and Engineering',
    departmentCode: 'CSE',
    className: 'III Year CSE - B',
    section: 'B',
    semester: 3,
    academicYear: '2026-2027',
    dob: '2005-06-18',
    bloodGroup: 'AB+',
    mentorName: 'Dr. K. Senthil Kumar',
    parentIds: ['PAR-004'],
    profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300',
    batch: '2025-2029',
    hostelDayScholar: 'Hostelite'
  }
];

export const INITIAL_PARENTS: Parent[] = [
  {
    parentId: 'PAR-001',
    fullName: 'Rajesh Kumar',
    relationship: 'Father',
    email: 'rajesh.kumar@parent.msec.edu',
    phoneNumber: '+91 98401 23456',
    linkedStudentIds: ['STU-001', 'STU-002'],
    address: 'No. 42, 3rd Main Road, Chromepet, Chennai - 600044',
    occupation: 'Senior IT Consultant'
  }
];

export const INITIAL_TEACHERS: Teacher[] = [
  {
    teacherId: 'TCH-001',
    fullName: 'Dr. K. Senthil Kumar',
    designation: 'Associate Professor & Class Advisor',
    department: 'Computer Science and Engineering',
    email: 'senthilkumar.k@msec.edu.in',
    phoneNumber: '+91 94440 98765',
    assignedClasses: ['III Year CSE - B', 'II Year CSE - A'],
    assignedSubjects: [
      { subjectCode: 'CS3301', subjectName: 'Data Structures', className: 'III Year CSE - B' },
      { subjectCode: 'CS3381', subjectName: 'Data Structures Laboratory', className: 'III Year CSE - B' }
    ]
  }
];

export const INITIAL_EXAMINATIONS: Examination[] = [
  {
    examId: 'EXAM-IA1',
    examName: 'Internal Assessment - 1',
    academicYear: '2026-2027',
    semester: 3,
    publicationStatus: 'Published',
    publicationDate: '2026-08-28',
    examStartDate: '2026-08-18',
    examEndDate: '2026-08-23'
  },
  {
    examId: 'EXAM-IA2',
    examName: 'Internal Assessment - 2',
    academicYear: '2026-2027',
    semester: 3,
    publicationStatus: 'Published',
    publicationDate: '2026-09-30',
    examStartDate: '2026-09-20',
    examEndDate: '2026-09-25'
  },
  {
    examId: 'EXAM-MODEL',
    examName: 'Model Examination',
    academicYear: '2026-2027',
    semester: 3,
    publicationStatus: 'Published',
    publicationDate: '2026-10-12',
    examStartDate: '2026-10-01',
    examEndDate: '2026-10-08'
  },
  {
    examId: 'EXAM-SEM3',
    examName: 'Anna University Semester Examination',
    academicYear: '2026-2027',
    semester: 3,
    publicationStatus: 'Draft',
    publicationDate: '2026-11-25',
    examStartDate: '2026-11-10',
    examEndDate: '2026-11-22'
  }
];

export const INITIAL_REPORT_CARDS: StudentReportCard[] = [
  {
    reportCardId: 'RC-MODEL-001',
    studentId: 'STU-001',
    examId: 'EXAM-MODEL',
    examName: 'Model Examination',
    semester: 3,
    academicYear: '2026-2027',
    publishedDate: '2026-10-12',
    isPublished: true,
    totalMaximumMarks: 600,
    totalMarksObtained: 524,
    percentage: 87.33,
    gpa: 8.78,
    cgpa: 8.65,
    resultStatus: 'FIRST CLASS WITH DISTINCTION',
    classRank: 4,
    totalStudentsInClass: 62,
    teacherRemarks: 'Aarav has shown remarkable progress in Data Structures and DBMS. Consistent lab execution. Maintain the same momentum for the upcoming University Semester Examinations.',
    subjects: [
      {
        subjectCode: 'MA3354',
        subjectName: 'Discrete Mathematics',
        credits: 4,
        maximumMarks: 100,
        marksObtained: 84,
        grade: 'A+',
        gradePoints: 9,
        status: 'PASS',
        classAverage: 71,
        highestMark: 98
      },
      {
        subjectCode: 'CS3351',
        subjectName: 'Digital Principles & Computer Organization',
        credits: 4,
        maximumMarks: 100,
        marksObtained: 88,
        grade: 'A+',
        gradePoints: 9,
        status: 'PASS',
        classAverage: 68,
        highestMark: 94
      },
      {
        subjectCode: 'CS3352',
        subjectName: 'Foundations of Data Science',
        credits: 3,
        maximumMarks: 100,
        marksObtained: 81,
        grade: 'A+',
        gradePoints: 9,
        status: 'PASS',
        classAverage: 72,
        highestMark: 92
      },
      {
        subjectCode: 'CS3301',
        subjectName: 'Data Structures',
        credits: 3,
        maximumMarks: 100,
        marksObtained: 93,
        grade: 'O',
        gradePoints: 10,
        status: 'PASS',
        classAverage: 74,
        highestMark: 97
      },
      {
        subjectCode: 'CS3391',
        subjectName: 'Object Oriented Programming',
        credits: 3,
        maximumMarks: 100,
        marksObtained: 86,
        grade: 'A+',
        gradePoints: 9,
        status: 'PASS',
        classAverage: 70,
        highestMark: 95
      },
      {
        subjectCode: 'CS3381',
        subjectName: 'Data Structures Laboratory',
        credits: 1.5,
        maximumMarks: 100,
        marksObtained: 92,
        grade: 'O',
        gradePoints: 10,
        status: 'PASS',
        classAverage: 82,
        highestMark: 99
      }
    ]
  },
  {
    reportCardId: 'RC-IA2-001',
    studentId: 'STU-001',
    examId: 'EXAM-IA2',
    examName: 'Internal Assessment - 2',
    semester: 3,
    academicYear: '2026-2027',
    publishedDate: '2026-09-30',
    isPublished: true,
    totalMaximumMarks: 300,
    totalMarksObtained: 258,
    percentage: 86.0,
    gpa: 8.6,
    cgpa: 8.58,
    resultStatus: 'FIRST CLASS WITH DISTINCTION',
    classRank: 5,
    totalStudentsInClass: 62,
    teacherRemarks: 'Good conceptual clarity in OOP and Data Structures. Advised to focus on proof-based problems in Discrete Mathematics.',
    subjects: [
      {
        subjectCode: 'MA3354',
        subjectName: 'Discrete Mathematics',
        credits: 4,
        maximumMarks: 50,
        marksObtained: 40,
        grade: 'A+',
        gradePoints: 9,
        status: 'PASS'
      },
      {
        subjectCode: 'CS3351',
        subjectName: 'Digital Principles & Computer Organization',
        credits: 4,
        maximumMarks: 50,
        marksObtained: 44,
        grade: 'A+',
        gradePoints: 9,
        status: 'PASS'
      },
      {
        subjectCode: 'CS3352',
        subjectName: 'Foundations of Data Science',
        credits: 3,
        maximumMarks: 50,
        marksObtained: 41,
        grade: 'A+',
        gradePoints: 9,
        status: 'PASS'
      },
      {
        subjectCode: 'CS3301',
        subjectName: 'Data Structures',
        credits: 3,
        maximumMarks: 50,
        marksObtained: 47,
        grade: 'O',
        gradePoints: 10,
        status: 'PASS'
      },
      {
        subjectCode: 'CS3391',
        subjectName: 'Object Oriented Programming',
        credits: 3,
        maximumMarks: 50,
        marksObtained: 43,
        grade: 'A+',
        gradePoints: 9,
        status: 'PASS'
      },
      {
        subjectCode: 'CS3381',
        subjectName: 'Data Structures Laboratory',
        credits: 1.5,
        maximumMarks: 50,
        marksObtained: 43,
        grade: 'A+',
        gradePoints: 9,
        status: 'PASS'
      }
    ]
  },
  {
    reportCardId: 'RC-IA1-001',
    studentId: 'STU-001',
    examId: 'EXAM-IA1',
    examName: 'Internal Assessment - 1',
    semester: 3,
    academicYear: '2026-2027',
    publishedDate: '2026-08-28',
    isPublished: true,
    totalMaximumMarks: 300,
    totalMarksObtained: 252,
    percentage: 84.0,
    gpa: 8.4,
    cgpa: 8.52,
    resultStatus: 'FIRST CLASS WITH DISTINCTION',
    classRank: 6,
    totalStudentsInClass: 62,
    teacherRemarks: 'Satisfactory performance in unit test. Good start to the semester.',
    subjects: [
      {
        subjectCode: 'MA3354',
        subjectName: 'Discrete Mathematics',
        credits: 4,
        maximumMarks: 50,
        marksObtained: 39,
        grade: 'A',
        gradePoints: 8,
        status: 'PASS'
      },
      {
        subjectCode: 'CS3351',
        subjectName: 'Digital Principles & Computer Organization',
        credits: 4,
        maximumMarks: 50,
        marksObtained: 42,
        grade: 'A+',
        gradePoints: 9,
        status: 'PASS'
      },
      {
        subjectCode: 'CS3352',
        subjectName: 'Foundations of Data Science',
        credits: 3,
        maximumMarks: 50,
        marksObtained: 42,
        grade: 'A+',
        gradePoints: 9,
        status: 'PASS'
      },
      {
        subjectCode: 'CS3301',
        subjectName: 'Data Structures',
        credits: 3,
        maximumMarks: 50,
        marksObtained: 46,
        grade: 'O',
        gradePoints: 10,
        status: 'PASS'
      },
      {
        subjectCode: 'CS3391',
        subjectName: 'Object Oriented Programming',
        credits: 3,
        maximumMarks: 50,
        marksObtained: 41,
        grade: 'A+',
        gradePoints: 9,
        status: 'PASS'
      },
      {
        subjectCode: 'CS3381',
        subjectName: 'Data Structures Laboratory',
        credits: 1.5,
        maximumMarks: 50,
        marksObtained: 42,
        grade: 'A+',
        gradePoints: 9,
        status: 'PASS'
      }
    ]
  },
  // Ananya Kumar (STU-002) sample report card
  {
    reportCardId: 'RC-MODEL-002',
    studentId: 'STU-002',
    examId: 'EXAM-MODEL',
    examName: 'Model Examination',
    semester: 1,
    academicYear: '2026-2027',
    publishedDate: '2026-10-12',
    isPublished: true,
    totalMaximumMarks: 500,
    totalMarksObtained: 448,
    percentage: 89.6,
    gpa: 8.92,
    cgpa: 8.92,
    resultStatus: 'FIRST CLASS WITH DISTINCTION',
    classRank: 2,
    totalStudentsInClass: 58,
    teacherRemarks: 'Excellent analytical approach in Circuit Theory and Engineering Mathematics. Very disciplined.',
    subjects: [
      {
        subjectCode: 'MA3151',
        subjectName: 'Matrices and Calculus',
        credits: 4,
        maximumMarks: 100,
        marksObtained: 94,
        grade: 'O',
        gradePoints: 10,
        status: 'PASS'
      },
      {
        subjectCode: 'PH3151',
        subjectName: 'Engineering Physics',
        credits: 3,
        maximumMarks: 100,
        marksObtained: 89,
        grade: 'A+',
        gradePoints: 9,
        status: 'PASS'
      },
      {
        subjectCode: 'CY3151',
        subjectName: 'Engineering Chemistry',
        credits: 3,
        maximumMarks: 100,
        marksObtained: 87,
        grade: 'A+',
        gradePoints: 9,
        status: 'PASS'
      },
      {
        subjectCode: 'GE3151',
        subjectName: 'Problem Solving and Python Programming',
        credits: 3,
        maximumMarks: 100,
        marksObtained: 92,
        grade: 'O',
        gradePoints: 10,
        status: 'PASS'
      },
      {
        subjectCode: 'GE3171',
        subjectName: 'Problem Solving and Python Programming Lab',
        credits: 2,
        maximumMarks: 100,
        marksObtained: 86,
        grade: 'A+',
        gradePoints: 9,
        status: 'PASS'
      }
    ]
  }
];

// Generate realistic daily attendance history for August, September, October 2026
export const INITIAL_ATTENDANCE: AttendanceRecord[] = [
  // October 2026 records
  {
    attendanceId: 'ATT-2026-10-17',
    studentId: 'STU-001',
    date: '2026-10-17',
    status: 'present',
    arrivalTime: '08:24 AM',
    recordedBy: 'Dr. K. Senthil Kumar',
    updatedAt: '2026-10-17 08:35 AM',
    notes: 'On time for 1st hour Discrete Mathematics lecture.'
  },
  {
    attendanceId: 'ATT-2026-10-16',
    studentId: 'STU-001',
    date: '2026-10-16',
    status: 'present',
    arrivalTime: '08:22 AM',
    recordedBy: 'Dr. K. Senthil Kumar',
    updatedAt: '2026-10-16 08:30 AM'
  },
  {
    attendanceId: 'ATT-2026-10-15',
    studentId: 'STU-001',
    date: '2026-10-15',
    status: 'present',
    arrivalTime: '08:28 AM',
    recordedBy: 'Dr. K. Senthil Kumar',
    updatedAt: '2026-10-15 08:32 AM'
  },
  {
    attendanceId: 'ATT-2026-10-14',
    studentId: 'STU-001',
    date: '2026-10-14',
    status: 'late',
    arrivalTime: '09:12 AM',
    recordedBy: 'Dr. K. Senthil Kumar',
    updatedAt: '2026-10-14 09:15 AM',
    notes: 'Late arrival recorded at College Gate 2. Arrived during 2nd period (Data Structures). Parent alerted.'
  },
  {
    attendanceId: 'ATT-2026-10-13',
    studentId: 'STU-001',
    date: '2026-10-13',
    status: 'present',
    arrivalTime: '08:25 AM',
    recordedBy: 'Dr. K. Senthil Kumar',
    updatedAt: '2026-10-13 08:30 AM'
  },
  {
    attendanceId: 'ATT-2026-10-10',
    studentId: 'STU-001',
    date: '2026-10-10',
    status: 'present',
    arrivalTime: '08:20 AM',
    recordedBy: 'Dr. K. Senthil Kumar',
    updatedAt: '2026-10-10 08:30 AM'
  },
  {
    attendanceId: 'ATT-2026-10-09',
    studentId: 'STU-001',
    date: '2026-10-09',
    status: 'present',
    arrivalTime: '08:18 AM',
    recordedBy: 'Dr. K. Senthil Kumar',
    updatedAt: '2026-10-09 08:30 AM'
  },
  {
    attendanceId: 'ATT-2026-10-08',
    studentId: 'STU-001',
    date: '2026-10-08',
    status: 'absent',
    recordedBy: 'Dr. K. Senthil Kumar',
    updatedAt: '2026-10-08 08:45 AM',
    notes: 'Unexcused absence recorded during morning attendance muster. Automated SMS alert dispatched.'
  },
  {
    attendanceId: 'ATT-2026-10-07',
    studentId: 'STU-001',
    date: '2026-10-07',
    status: 'present',
    arrivalTime: '08:22 AM',
    recordedBy: 'Dr. K. Senthil Kumar',
    updatedAt: '2026-10-07 08:30 AM'
  },
  {
    attendanceId: 'ATT-2026-10-06',
    studentId: 'STU-001',
    date: '2026-10-06',
    status: 'present',
    arrivalTime: '08:25 AM',
    recordedBy: 'Dr. K. Senthil Kumar',
    updatedAt: '2026-10-06 08:30 AM'
  },
  {
    attendanceId: 'ATT-2026-10-05',
    studentId: 'STU-001',
    date: '2026-10-05',
    status: 'present',
    arrivalTime: '08:27 AM',
    recordedBy: 'Dr. K. Senthil Kumar',
    updatedAt: '2026-10-05 08:30 AM'
  },
  // September 2026 records
  {
    attendanceId: 'ATT-2026-09-30',
    studentId: 'STU-001',
    date: '2026-09-30',
    status: 'present',
    arrivalTime: '08:21 AM',
    recordedBy: 'Dr. K. Senthil Kumar',
    updatedAt: '2026-09-30 08:30 AM'
  },
  {
    attendanceId: 'ATT-2026-09-29',
    studentId: 'STU-001',
    date: '2026-09-29',
    status: 'present',
    arrivalTime: '08:26 AM',
    recordedBy: 'Dr. K. Senthil Kumar',
    updatedAt: '2026-09-29 08:30 AM'
  },
  {
    attendanceId: 'ATT-2026-09-26',
    studentId: 'STU-001',
    date: '2026-09-26',
    status: 'late',
    arrivalTime: '09:05 AM',
    recordedBy: 'Dr. K. Senthil Kumar',
    updatedAt: '2026-09-26 09:10 AM',
    notes: 'Late arrival recorded due to suburban train delay on Tambaram-Beach route.'
  },
  {
    attendanceId: 'ATT-2026-09-25',
    studentId: 'STU-001',
    date: '2026-09-25',
    status: 'present',
    arrivalTime: '08:23 AM',
    recordedBy: 'Dr. K. Senthil Kumar',
    updatedAt: '2026-09-25 08:30 AM'
  },
  {
    attendanceId: 'ATT-2026-09-24',
    studentId: 'STU-001',
    date: '2026-09-24',
    status: 'present',
    arrivalTime: '08:20 AM',
    recordedBy: 'Dr. K. Senthil Kumar',
    updatedAt: '2026-09-24 08:30 AM'
  },
  {
    attendanceId: 'ATT-2026-09-23',
    studentId: 'STU-001',
    date: '2026-09-23',
    status: 'present',
    arrivalTime: '08:29 AM',
    recordedBy: 'Dr. K. Senthil Kumar',
    updatedAt: '2026-09-23 08:30 AM'
  },
  {
    attendanceId: 'ATT-2026-09-22',
    studentId: 'STU-001',
    date: '2026-09-22',
    status: 'present',
    arrivalTime: '08:24 AM',
    recordedBy: 'Dr. K. Senthil Kumar',
    updatedAt: '2026-09-22 08:30 AM'
  },
  {
    attendanceId: 'ATT-2026-09-19',
    studentId: 'STU-001',
    date: '2026-09-19',
    status: 'on_leave',
    recordedBy: 'Dr. K. Senthil Kumar',
    updatedAt: '2026-09-19 08:30 AM',
    notes: 'Officially sanctioned leave (Req #LR-2026-089) - Family function in Tiruchirappalli.'
  },
  {
    attendanceId: 'ATT-2026-09-18',
    studentId: 'STU-001',
    date: '2026-09-18',
    status: 'on_leave',
    recordedBy: 'Dr. K. Senthil Kumar',
    updatedAt: '2026-09-18 08:30 AM',
    notes: 'Officially sanctioned leave (Req #LR-2026-089) - Family function in Tiruchirappalli.'
  },
  {
    attendanceId: 'ATT-2026-09-17',
    studentId: 'STU-001',
    date: '2026-09-17',
    status: 'present',
    arrivalTime: '08:15 AM',
    recordedBy: 'Dr. K. Senthil Kumar',
    updatedAt: '2026-09-17 08:30 AM'
  },
  {
    attendanceId: 'ATT-2026-09-16',
    studentId: 'STU-001',
    date: '2026-09-16',
    status: 'present',
    arrivalTime: '08:26 AM',
    recordedBy: 'Dr. K. Senthil Kumar',
    updatedAt: '2026-09-16 08:30 AM'
  },
  {
    attendanceId: 'ATT-2026-09-15',
    studentId: 'STU-001',
    date: '2026-09-15',
    status: 'present',
    arrivalTime: '08:25 AM',
    recordedBy: 'Dr. K. Senthil Kumar',
    updatedAt: '2026-09-15 08:30 AM'
  },
  {
    attendanceId: 'ATT-2026-09-12',
    studentId: 'STU-001',
    date: '2026-09-12',
    status: 'present',
    arrivalTime: '08:24 AM',
    recordedBy: 'Dr. K. Senthil Kumar',
    updatedAt: '2026-09-12 08:30 AM'
  },
  {
    attendanceId: 'ATT-2026-09-11',
    studentId: 'STU-001',
    date: '2026-09-11',
    status: 'present',
    arrivalTime: '08:21 AM',
    recordedBy: 'Dr. K. Senthil Kumar',
    updatedAt: '2026-09-11 08:30 AM'
  },
  {
    attendanceId: 'ATT-2026-09-10',
    studentId: 'STU-001',
    date: '2026-09-10',
    status: 'absent',
    recordedBy: 'Dr. K. Senthil Kumar',
    updatedAt: '2026-09-10 08:40 AM',
    notes: 'Absence recorded for entire day.'
  },
  {
    attendanceId: 'ATT-2026-09-09',
    studentId: 'STU-001',
    date: '2026-09-09',
    status: 'present',
    arrivalTime: '08:27 AM',
    recordedBy: 'Dr. K. Senthil Kumar',
    updatedAt: '2026-09-09 08:30 AM'
  },
  {
    attendanceId: 'ATT-2026-09-08',
    studentId: 'STU-001',
    date: '2026-09-08',
    status: 'present',
    arrivalTime: '08:19 AM',
    recordedBy: 'Dr. K. Senthil Kumar',
    updatedAt: '2026-09-08 08:30 AM'
  },
  {
    attendanceId: 'ATT-2026-09-05',
    studentId: 'STU-001',
    date: '2026-09-05',
    status: 'present',
    arrivalTime: '08:22 AM',
    recordedBy: 'Dr. K. Senthil Kumar',
    updatedAt: '2026-09-05 08:30 AM'
  },
  {
    attendanceId: 'ATT-2026-09-04',
    studentId: 'STU-001',
    date: '2026-09-04',
    status: 'present',
    arrivalTime: '08:20 AM',
    recordedBy: 'Dr. K. Senthil Kumar',
    updatedAt: '2026-09-04 08:30 AM'
  },
  {
    attendanceId: 'ATT-2026-09-03',
    studentId: 'STU-001',
    date: '2026-09-03',
    status: 'present',
    arrivalTime: '08:25 AM',
    recordedBy: 'Dr. K. Senthil Kumar',
    updatedAt: '2026-09-03 08:30 AM'
  },
  {
    attendanceId: 'ATT-2026-09-02',
    studentId: 'STU-001',
    date: '2026-09-02',
    status: 'present',
    arrivalTime: '08:23 AM',
    recordedBy: 'Dr. K. Senthil Kumar',
    updatedAt: '2026-09-02 08:30 AM'
  },
  {
    attendanceId: 'ATT-2026-09-01',
    studentId: 'STU-001',
    date: '2026-09-01',
    status: 'present',
    arrivalTime: '08:25 AM',
    recordedBy: 'Dr. K. Senthil Kumar',
    updatedAt: '2026-09-01 08:30 AM'
  },
  // August 2026 records
  {
    attendanceId: 'ATT-2026-08-29',
    studentId: 'STU-001',
    date: '2026-08-29',
    status: 'present',
    arrivalTime: '08:22 AM',
    recordedBy: 'Dr. K. Senthil Kumar',
    updatedAt: '2026-08-29 08:30 AM'
  },
  {
    attendanceId: 'ATT-2026-08-28',
    studentId: 'STU-001',
    date: '2026-08-28',
    status: 'present',
    arrivalTime: '08:24 AM',
    recordedBy: 'Dr. K. Senthil Kumar',
    updatedAt: '2026-08-28 08:30 AM'
  },
  {
    attendanceId: 'ATT-2026-08-27',
    studentId: 'STU-001',
    date: '2026-08-27',
    status: 'present',
    arrivalTime: '08:21 AM',
    recordedBy: 'Dr. K. Senthil Kumar',
    updatedAt: '2026-08-27 08:30 AM'
  },
  {
    attendanceId: 'ATT-2026-08-26',
    studentId: 'STU-001',
    date: '2026-08-26',
    status: 'late',
    arrivalTime: '09:18 AM',
    recordedBy: 'Dr. K. Senthil Kumar',
    updatedAt: '2026-08-26 09:20 AM',
    notes: 'Heavy rainfall in Chennai; delayed college bus Route 14.'
  },
  {
    attendanceId: 'ATT-2026-08-25',
    studentId: 'STU-001',
    date: '2026-08-25',
    status: 'present',
    arrivalTime: '08:25 AM',
    recordedBy: 'Dr. K. Senthil Kumar',
    updatedAt: '2026-08-25 08:30 AM'
  },
  {
    attendanceId: 'ATT-2026-08-22',
    studentId: 'STU-001',
    date: '2026-08-22',
    status: 'present',
    arrivalTime: '08:22 AM',
    recordedBy: 'Dr. K. Senthil Kumar',
    updatedAt: '2026-08-22 08:30 AM'
  },
  {
    attendanceId: 'ATT-2026-08-21',
    studentId: 'STU-001',
    date: '2026-08-21',
    status: 'present',
    arrivalTime: '08:24 AM',
    recordedBy: 'Dr. K. Senthil Kumar',
    updatedAt: '2026-08-21 08:30 AM'
  },
  {
    attendanceId: 'ATT-2026-08-20',
    studentId: 'STU-001',
    date: '2026-08-20',
    status: 'present',
    arrivalTime: '08:20 AM',
    recordedBy: 'Dr. K. Senthil Kumar',
    updatedAt: '2026-08-20 08:30 AM'
  },
  {
    attendanceId: 'ATT-2026-08-19',
    studentId: 'STU-001',
    date: '2026-08-19',
    status: 'present',
    arrivalTime: '08:28 AM',
    recordedBy: 'Dr. K. Senthil Kumar',
    updatedAt: '2026-08-19 08:30 AM'
  },
  {
    attendanceId: 'ATT-2026-08-18',
    studentId: 'STU-001',
    date: '2026-08-18',
    status: 'present',
    arrivalTime: '08:25 AM',
    recordedBy: 'Dr. K. Senthil Kumar',
    updatedAt: '2026-08-18 08:30 AM'
  },
  {
    attendanceId: 'ATT-2026-08-14',
    studentId: 'STU-001',
    date: '2026-08-14',
    status: 'absent',
    recordedBy: 'Dr. K. Senthil Kumar',
    updatedAt: '2026-08-14 08:45 AM',
    notes: 'Absent on Friday prior to holiday weekend.'
  },
  {
    attendanceId: 'ATT-2026-08-13',
    studentId: 'STU-001',
    date: '2026-08-13',
    status: 'present',
    arrivalTime: '08:26 AM',
    recordedBy: 'Dr. K. Senthil Kumar',
    updatedAt: '2026-08-13 08:30 AM'
  },
  {
    attendanceId: 'ATT-2026-08-12',
    studentId: 'STU-001',
    date: '2026-08-12',
    status: 'present',
    arrivalTime: '08:24 AM',
    recordedBy: 'Dr. K. Senthil Kumar',
    updatedAt: '2026-08-12 08:30 AM'
  },
  {
    attendanceId: 'ATT-2026-08-11',
    studentId: 'STU-001',
    date: '2026-08-11',
    status: 'present',
    arrivalTime: '08:22 AM',
    recordedBy: 'Dr. K. Senthil Kumar',
    updatedAt: '2026-08-11 08:30 AM'
  },
  {
    attendanceId: 'ATT-2026-08-08',
    studentId: 'STU-001',
    date: '2026-08-08',
    status: 'present',
    arrivalTime: '08:25 AM',
    recordedBy: 'Dr. K. Senthil Kumar',
    updatedAt: '2026-08-08 08:30 AM'
  },
  {
    attendanceId: 'ATT-2026-08-07',
    studentId: 'STU-001',
    date: '2026-08-07',
    status: 'present',
    arrivalTime: '08:27 AM',
    recordedBy: 'Dr. K. Senthil Kumar',
    updatedAt: '2026-08-07 08:30 AM'
  },
  {
    attendanceId: 'ATT-2026-08-06',
    studentId: 'STU-001',
    date: '2026-08-06',
    status: 'present',
    arrivalTime: '08:23 AM',
    recordedBy: 'Dr. K. Senthil Kumar',
    updatedAt: '2026-08-06 08:30 AM'
  },
  {
    attendanceId: 'ATT-2026-08-05',
    studentId: 'STU-001',
    date: '2026-08-05',
    status: 'present',
    arrivalTime: '08:25 AM',
    recordedBy: 'Dr. K. Senthil Kumar',
    updatedAt: '2026-08-05 08:30 AM'
  },
  {
    attendanceId: 'ATT-2026-08-04',
    studentId: 'STU-001',
    date: '2026-08-04',
    status: 'present',
    arrivalTime: '08:21 AM',
    recordedBy: 'Dr. K. Senthil Kumar',
    updatedAt: '2026-08-04 08:30 AM'
  },
  {
    attendanceId: 'ATT-2026-08-01',
    studentId: 'STU-001',
    date: '2026-08-01',
    status: 'present',
    arrivalTime: '08:26 AM',
    recordedBy: 'Dr. K. Senthil Kumar',
    updatedAt: '2026-08-01 08:30 AM'
  },
  // Ananya Kumar (STU-002) sample attendance records
  {
    attendanceId: 'ATT-ANANYA-10-17',
    studentId: 'STU-002',
    date: '2026-10-17',
    status: 'present',
    arrivalTime: '08:20 AM',
    recordedBy: 'Prof. Lakshmi Narayanan',
    updatedAt: '2026-10-17 08:30 AM'
  },
  {
    attendanceId: 'ATT-ANANYA-10-16',
    studentId: 'STU-002',
    date: '2026-10-16',
    status: 'present',
    arrivalTime: '08:18 AM',
    recordedBy: 'Prof. Lakshmi Narayanan',
    updatedAt: '2026-10-16 08:30 AM'
  },
  {
    attendanceId: 'ATT-ANANYA-10-15',
    studentId: 'STU-002',
    date: '2026-10-15',
    status: 'present',
    arrivalTime: '08:22 AM',
    recordedBy: 'Prof. Lakshmi Narayanan',
    updatedAt: '2026-10-15 08:30 AM'
  },
  {
    attendanceId: 'ATT-ANANYA-10-14',
    studentId: 'STU-002',
    date: '2026-10-14',
    status: 'present',
    arrivalTime: '08:25 AM',
    recordedBy: 'Prof. Lakshmi Narayanan',
    updatedAt: '2026-10-14 08:30 AM'
  }
];

export const INITIAL_LEAVE_REQUESTS: LeaveRequest[] = [
  {
    requestId: 'LR-2026-102',
    studentId: 'STU-001',
    studentName: 'Aarav Kumar',
    className: 'III Year CSE - B',
    submittedBy: 'Rajesh Kumar (Father)',
    parentEmail: 'rajesh.kumar@parent.msec.edu',
    startDate: '2026-10-24',
    endDate: '2026-10-25',
    totalDays: 2,
    leaveType: 'Medical',
    reason: 'Scheduled specialist ophthalmic examination and corrective procedure at Sankara Nethralaya, Chennai.',
    documentName: 'Medical_Appointment_Slip_Oct2026.pdf',
    status: 'Pending',
    createdAt: '2026-10-16 06:45 PM',
    updatedAt: '2026-10-16 06:45 PM'
  },
  {
    requestId: 'LR-2026-089',
    studentId: 'STU-001',
    studentName: 'Aarav Kumar',
    className: 'III Year CSE - B',
    submittedBy: 'Rajesh Kumar (Father)',
    parentEmail: 'rajesh.kumar@parent.msec.edu',
    startDate: '2026-09-18',
    endDate: '2026-09-19',
    totalDays: 2,
    leaveType: 'Family Emergency',
    reason: 'Attending elder sister marriage ceremony and related family rituals in native town Tiruchirappalli.',
    status: 'Approved',
    reviewerId: 'TCH-001',
    reviewerName: 'Dr. K. Senthil Kumar',
    reviewerRemarks: 'Sanctioned. Advised the student to collect lecture notes for Data Structures from Karthik V upon return.',
    createdAt: '2026-09-12 10:15 AM',
    updatedAt: '2026-09-13 11:30 AM'
  },
  {
    requestId: 'LR-2026-041',
    studentId: 'STU-001',
    studentName: 'Aarav Kumar',
    className: 'III Year CSE - B',
    submittedBy: 'Rajesh Kumar (Father)',
    parentEmail: 'rajesh.kumar@parent.msec.edu',
    startDate: '2026-08-11',
    endDate: '2026-08-11',
    totalDays: 1,
    leaveType: 'Personal',
    reason: 'Passport renewal appointment at Regional Passport Office, Aminjikarai.',
    documentName: 'Passport_Appointment_Confirmation.pdf',
    status: 'Approved',
    reviewerId: 'TCH-001',
    reviewerName: 'Dr. K. Senthil Kumar',
    reviewerRemarks: 'Approved with verified appointment acknowledgment.',
    createdAt: '2026-08-08 09:20 AM',
    updatedAt: '2026-08-09 02:15 PM'
  }
];

export const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    notificationId: 'NOTIF-001',
    recipientId: 'PAR-001',
    studentId: 'STU-001',
    title: 'Late Arrival Alert',
    message: 'Your child Aarav Kumar arrived late to college today at 9:12 AM (Gate 2 timestamp). Arrived during Period 2.',
    category: 'attendance',
    readStatus: false,
    createdAt: '2026-10-14 09:16 AM',
    actionUrl: '/attendance'
  },
  {
    notificationId: 'NOTIF-002',
    recipientId: 'PAR-001',
    studentId: 'STU-001',
    title: 'Model Examination Report Card Published',
    message: 'The Model Examination results for III Year CSE - B have been officially released. Aarav secured 87.33% (GPA 8.78).',
    category: 'academic',
    readStatus: false,
    createdAt: '2026-10-12 04:30 PM',
    actionUrl: '/report-cards'
  },
  {
    notificationId: 'NOTIF-003',
    recipientId: 'PAR-001',
    studentId: 'STU-001',
    title: 'Leave Request Received',
    message: 'Your medical leave request (Req #LR-2026-102) for Oct 24 - Oct 25 has been submitted and assigned to Dr. K. Senthil Kumar for review.',
    category: 'leave',
    readStatus: false,
    createdAt: '2026-10-16 06:45 PM',
    actionUrl: '/leave-requests'
  },
  {
    notificationId: 'NOTIF-004',
    recipientId: 'PAR-001',
    studentId: 'STU-001',
    title: 'Student Absence Recorded',
    message: 'Your child Aarav Kumar was marked absent during morning attendance muster on October 08, 2026.',
    category: 'attendance',
    readStatus: true,
    createdAt: '2026-10-08 08:50 AM',
    actionUrl: '/attendance'
  },
  {
    notificationId: 'NOTIF-005',
    recipientId: 'PAR-001',
    studentId: 'STU-001',
    title: 'Leave Request Approved',
    message: 'Your leave application (Req #LR-2026-089) for Sep 18-19 was approved by Class Advisor Dr. K. Senthil Kumar.',
    category: 'leave',
    readStatus: true,
    createdAt: '2026-09-13 11:32 AM',
    actionUrl: '/leave-requests'
  },
  {
    notificationId: 'NOTIF-006',
    recipientId: 'PAR-001',
    studentId: 'STU-001',
    title: 'Internal Assessment - 2 Released',
    message: 'Internal Assessment 2 report card is now available for review.',
    category: 'academic',
    readStatus: true,
    createdAt: '2026-09-30 05:00 PM',
    actionUrl: '/report-cards'
  }
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    announcementId: 'ANN-001',
    title: 'Anna University Odd Semester Theory Examination Schedule 2026-27',
    message: 'The Controller of Examinations has published the tentative timetable for the upcoming November/December 2026 Theory Examinations. Practical lab exams for 3rd semester CSE commence from November 04, 2026. Hall tickets will be issued following clearance of attendance norms (minimum 75%).',
    category: 'Examination',
    priority: 'Urgent',
    publishedAt: '2026-10-15 11:00 AM',
    publishedBy: 'Dr. R. Ramanathan (Controller of Examinations)',
    attachmentName: 'AU_Odd_Sem_Nov2026_Schedule.pdf'
  },
  {
    announcementId: 'ANN-002',
    title: 'Parent-Teacher Council Consultation Meeting on October 25',
    message: 'A formal Parent-Teacher consultation meeting is scheduled for Saturday, October 25, 2026, from 9:30 AM to 1:00 PM in the CSE Department Seminar Hall. Parents are cordially invited to review Model Exam performance and attendance standing with class advisors and subject faculties.',
    category: 'Event',
    priority: 'Important',
    publishedAt: '2026-10-14 02:30 PM',
    publishedBy: 'Head of Department, CSE',
    attachmentName: 'PTM_Circular_Oct2026.pdf'
  },
  {
    announcementId: 'ANN-003',
    title: 'Deepavali Vacation & Resumption of Academic Classes',
    message: 'The college will remain closed for Deepavali festival from October 31, 2026 to November 02, 2026. Academic sessions will resume on Tuesday, November 03, 2026 on a normal working schedule.',
    category: 'Holiday',
    priority: 'Normal',
    publishedAt: '2026-10-11 10:00 AM',
    publishedBy: 'Principal Office, MSEC'
  },
  {
    announcementId: 'ANN-004',
    title: 'Odd Semester Tuition Fee Balance Payment Reminder',
    message: 'Parents and guardians who have outstanding installments for the Odd Semester 2026-27 are requested to complete payment before October 30, 2026 through the college netbanking portal or accounts section.',
    category: 'Administration',
    priority: 'Important',
    publishedAt: '2026-10-05 09:00 AM',
    publishedBy: 'Finance & Accounts Office'
  },
  {
    announcementId: 'ANN-005',
    title: 'Campus Placement & Internship Training Session for Pre-Final Years',
    message: 'Department Training & Placement Cell conducts a 3-day special aptitude and coding bootcamp for 3rd year students starting October 21. Attendance is mandatory for all registered students.',
    category: 'Academic',
    priority: 'Normal',
    publishedAt: '2026-10-02 03:00 PM',
    publishedBy: 'Head of Placement & Training'
  }
];
