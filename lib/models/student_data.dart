import 'package:flutter/material.dart';

enum CalendarEventType {
  absent,
  late,
  leave,
  celebration,
  event,
}

class CalendarEvent {
  final DateTime date;
  final String title;
  final CalendarEventType type;

  const CalendarEvent({
    required this.date,
    required this.title,
    required this.type,
  });

  factory CalendarEvent.fromJson(Map<String, dynamic> json) {
    return CalendarEvent(
      date: DateTime.parse(json['date'] as String),
      title: json['title'] as String,
      type: parseType(json['type'] as String),
    );
  }

  static CalendarEventType parseType(String typeStr) {
    switch (typeStr.toLowerCase()) {
      case 'absent':
        return CalendarEventType.absent;
      case 'late':
        return CalendarEventType.late;
      case 'leave':
        return CalendarEventType.leave;
      case 'celebration':
        return CalendarEventType.celebration;
      case 'event':
      default:
        return CalendarEventType.event;
    }
  }

  Color get color {
    switch (type) {
      case CalendarEventType.absent:
        return const Color(0xFFEF4444); // Coral Red
      case CalendarEventType.late:
        return const Color(0xFFF59E0B); // Amber
      case CalendarEventType.leave:
        return const Color(0xFF8B5CF6); // Purple
      case CalendarEventType.celebration:
        return const Color(0xFFEC4899); // Pink
      case CalendarEventType.event:
        return const Color(0xFF2563EB); // Royal Blue
    }
  }

  String get label {
    switch (type) {
      case CalendarEventType.absent:
        return 'Student Absent';
      case CalendarEventType.late:
        return 'Late Coming';
      case CalendarEventType.leave:
        return 'College Holiday';
      case CalendarEventType.celebration:
        return 'Campus Event';
      case CalendarEventType.event:
        return 'Academic Schedule';
    }
  }
}

class StudentProfile {
  final String name;
  final String registerNumber;
  final String department;
  final String year;
  final String semester;
  final String section;
  final String batch;
  final String advisor;
  final String parentName;
  final String parentPhone;
  final double overallAttendance;
  final double latestGpa;
  final String resultStatus;
  final String todayStatusText;
  final bool isTodayPresent;

  const StudentProfile({
    required this.name,
    required this.registerNumber,
    required this.department,
    required this.year,
    required this.semester,
    required this.section,
    required this.batch,
    required this.advisor,
    required this.parentName,
    required this.parentPhone,
    required this.overallAttendance,
    required this.latestGpa,
    required this.resultStatus,
    required this.todayStatusText,
    required this.isTodayPresent,
  });
}

class AttendanceSummary {
  final int totalWorkingDays;
  final int absentDays;
  final double absentPercentage;
  final int lateDays;
  final double latePercentage;
  final int presentDays;

  const AttendanceSummary({
    required this.totalWorkingDays,
    required this.absentDays,
    required this.absentPercentage,
    required this.lateDays,
    required this.latePercentage,
    required this.presentDays,
  });
}

class RecentAlert {
  final String id;
  final String title;
  final String subtitle;
  final String timeAgo;
  final CalendarEventType type;

  const RecentAlert({
    required this.id,
    required this.title,
    required this.subtitle,
    required this.timeAgo,
    required this.type,
  });
}

class SubjectMark {
  final String code;
  final String name;
  final int credits;
  final int marks;
  final int maxMarks;
  final String grade;
  final String status;

  const SubjectMark({
    required this.code,
    required this.name,
    required this.credits,
    required this.marks,
    required this.maxMarks,
    required this.grade,
    required this.status,
  });
}

class SemesterMarksheet {
  final String semesterId;
  final String title;
  final double gpa;
  final int totalMarks;
  final int maxMarks;
  final String resultStatus;
  final bool isVerified;
  final List<SubjectMark> subjects;

  const SemesterMarksheet({
    required this.semesterId,
    required this.title,
    required this.gpa,
    required this.totalMarks,
    required this.maxMarks,
    required this.resultStatus,
    required this.isVerified,
    required this.subjects,
  });
}

// ==========================================
// STATIC MOCK DATA REPOSITORY
// ==========================================

const mockStudentProfile = StudentProfile(
  name: 'Karthik R',
  registerNumber: '311524104001',
  department: 'B.E. Computer Science and Engineering',
  year: 'II Year',
  semester: 'Sem IV',
  section: 'Section B',
  batch: '2024 - 2028',
  advisor: 'Dr. Kavitha Menon, M.E., Ph.D.',
  parentName: 'Rajesh R',
  parentPhone: '+91 98765 43210',
  overallAttendance: 89.1,
  latestGpa: 8.78,
  resultStatus: 'First Class with Distinction',
  todayStatusText: 'Marked Present today at 8:32 AM',
  isTodayPresent: true,
);

const mockAttendanceSummary = AttendanceSummary(
  totalWorkingDays: 92,
  absentDays: 4,
  absentPercentage: 4.3,
  lateDays: 6,
  latePercentage: 6.5,
  presentDays: 82,
);

const List<RecentAlert> mockRecentAlerts = [
  RecentAlert(
    id: 'ALR-001',
    title: 'Internal Assessment II Marksheet Published',
    subtitle: 'Autonomous CoE portal updated with subject grades.',
    timeAgo: 'Today, 8:45 AM',
    type: CalendarEventType.event,
  ),
  RecentAlert(
    id: 'ALR-002',
    title: 'Upcoming College Holiday: Ayudha Pooja',
    subtitle: 'Institutional holiday declared as per academic calendar.',
    timeAgo: 'Yesterday, 4:15 PM',
    type: CalendarEventType.leave,
  ),
  RecentAlert(
    id: 'ALR-003',
    title: 'Late Arrival Recorded on Oct 14',
    subtitle: 'Clocked in at 8:52 AM at Main Gate biometric terminal.',
    timeAgo: 'Oct 14, 2026',
    type: CalendarEventType.late,
  ),
];

const Map<String, SemesterMarksheet> mockMarksheets = {
  'Sem I': SemesterMarksheet(
    semesterId: 'Sem I',
    title: 'Semester I • Nov/Dec 2024 Exam',
    gpa: 8.62,
    totalMarks: 535,
    maxMarks: 600,
    resultStatus: 'FIRST CLASS WITH DISTINCTION',
    isVerified: true,
    subjects: [
      SubjectMark(code: 'HS3151', name: 'Professional English - I', credits: 3, marks: 88, maxMarks: 100, grade: 'A+', status: 'P'),
      SubjectMark(code: 'MA3151', name: 'Matrices and Calculus', credits: 4, marks: 91, maxMarks: 100, grade: 'O', status: 'P'),
      SubjectMark(code: 'PH3151', name: 'Engineering Physics', credits: 3, marks: 84, maxMarks: 100, grade: 'A+', status: 'P'),
      SubjectMark(code: 'CY3151', name: 'Engineering Chemistry', credits: 3, marks: 89, maxMarks: 100, grade: 'A+', status: 'P'),
      SubjectMark(code: 'GE3151', name: 'Problem Solving & Python', credits: 3, marks: 96, maxMarks: 100, grade: 'O', status: 'P'),
      SubjectMark(code: 'GE3171', name: 'Python Laboratory', credits: 2, marks: 97, maxMarks: 100, grade: 'O', status: 'P'),
    ],
  ),
  'Sem II': SemesterMarksheet(
    semesterId: 'Sem II',
    title: 'Semester II • Apr/May 2025 Exam',
    gpa: 8.71,
    totalMarks: 541,
    maxMarks: 600,
    resultStatus: 'FIRST CLASS WITH DISTINCTION',
    isVerified: true,
    subjects: [
      SubjectMark(code: 'HS3252', name: 'Professional English - II', credits: 2, marks: 86, maxMarks: 100, grade: 'A+', status: 'P'),
      SubjectMark(code: 'MA3251', name: 'Statistics & Numerical Methods', credits: 4, marks: 89, maxMarks: 100, grade: 'A+', status: 'P'),
      SubjectMark(code: 'PH3256', name: 'Physics for Information Science', credits: 3, marks: 87, maxMarks: 100, grade: 'A+', status: 'P'),
      SubjectMark(code: 'BE3251', name: 'Basic Electrical & Electronics', credits: 3, marks: 82, maxMarks: 100, grade: 'A', status: 'P'),
      SubjectMark(code: 'GE3251', name: 'Engineering Graphics', credits: 4, marks: 93, maxMarks: 100, grade: 'O', status: 'P'),
      SubjectMark(code: 'CS3251', name: 'Programming in C', credits: 3, marks: 94, maxMarks: 100, grade: 'O', status: 'P'),
    ],
  ),
  'Sem III': SemesterMarksheet(
    semesterId: 'Sem III',
    title: 'Semester III • Nov/Dec 2025 Exam',
    gpa: 8.84,
    totalMarks: 552,
    maxMarks: 600,
    resultStatus: 'FIRST CLASS WITH DISTINCTION',
    isVerified: true,
    subjects: [
      SubjectMark(code: 'MA3354', name: 'Discrete Mathematics', credits: 4, marks: 92, maxMarks: 100, grade: 'O', status: 'P'),
      SubjectMark(code: 'CS3351', name: 'Digital Principles & Arch.', credits: 4, marks: 88, maxMarks: 100, grade: 'A+', status: 'P'),
      SubjectMark(code: 'CS3352', name: 'Data Structures with C++', credits: 3, marks: 96, maxMarks: 100, grade: 'O', status: 'P'),
      SubjectMark(code: 'CS3391', name: 'Object Oriented Programming', credits: 3, marks: 91, maxMarks: 100, grade: 'O', status: 'P'),
      SubjectMark(code: 'CS3311', name: 'Data Structures Laboratory', credits: 2, marks: 98, maxMarks: 100, grade: 'O', status: 'P'),
      SubjectMark(code: 'GE3361', name: 'Professional Development Lab', credits: 1, marks: 97, maxMarks: 100, grade: 'O', status: 'P'),
    ],
  ),
  'Internal I': SemesterMarksheet(
    semesterId: 'Internal I',
    title: 'Semester IV • Internal Assessment I (Sept 2026)',
    gpa: 8.75,
    totalMarks: 271,
    maxMarks: 300,
    resultStatus: 'PASSED (IA-I RATIFIED)',
    isVerified: true,
    subjects: [
      SubjectMark(code: 'CS3452', name: 'Theory of Computation', credits: 3, marks: 46, maxMarks: 50, grade: 'O', status: 'P'),
      SubjectMark(code: 'CS3491', name: 'Artificial Intelligence & ML', credits: 4, marks: 44, maxMarks: 50, grade: 'A+', status: 'P'),
      SubjectMark(code: 'CS3492', name: 'Database Management Systems', credits: 3, marks: 47, maxMarks: 50, grade: 'O', status: 'P'),
      SubjectMark(code: 'CS3401', name: 'Algorithms', credits: 4, marks: 45, maxMarks: 50, grade: 'A+', status: 'P'),
      SubjectMark(code: 'GE3451', name: 'Environmental Sciences', credits: 2, marks: 43, maxMarks: 50, grade: 'A+', status: 'P'),
      SubjectMark(code: 'CS3461', name: 'Operating Systems Lab', credits: 2, marks: 46, maxMarks: 50, grade: 'O', status: 'P'),
    ],
  ),
  'Internal II': SemesterMarksheet(
    semesterId: 'Internal II',
    title: 'Semester IV • Internal Assessment II (Oct 2026)',
    gpa: 8.78,
    totalMarks: 274,
    maxMarks: 300,
    resultStatus: 'PASSED (IA-II PROVISIONAL)',
    isVerified: true,
    subjects: [
      SubjectMark(code: 'CS3452', name: 'Theory of Computation', credits: 3, marks: 47, maxMarks: 50, grade: 'O', status: 'P'),
      SubjectMark(code: 'CS3491', name: 'Artificial Intelligence & ML', credits: 4, marks: 46, maxMarks: 50, grade: 'O', status: 'P'),
      SubjectMark(code: 'CS3492', name: 'Database Management Systems', credits: 3, marks: 48, maxMarks: 50, grade: 'O', status: 'P'),
      SubjectMark(code: 'CS3401', name: 'Algorithms', credits: 4, marks: 43, maxMarks: 50, grade: 'A+', status: 'P'),
      SubjectMark(code: 'GE3451', name: 'Environmental Sciences', credits: 2, marks: 44, maxMarks: 50, grade: 'A+', status: 'P'),
      SubjectMark(code: 'CS3461', name: 'Operating Systems Lab', credits: 2, marks: 46, maxMarks: 50, grade: 'O', status: 'P'),
    ],
  ),
};
