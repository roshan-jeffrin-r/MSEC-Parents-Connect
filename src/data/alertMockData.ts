import {
  AlertStudent,
  AlertGuardian,
  StudentAttendanceRecord,
  AttendanceNotificationJob,
  AlertSystemSettings
} from '../types/attendanceAlert';

export const INITIAL_SETTINGS: AlertSystemSettings = {
  expectedArrivalTime: '09:00',
  gracePeriodMinutes: 10,
  collegeName: 'Meenakshi Sundararajan Engineering College (Autonomous)',
  collegeShortName: 'MSEC',
  contactPhone: '044-24801636',
  defaultLanguage: 'en',
  autoProcessOnImport: false,
  simulateDeliveryDelay: true
};

export const INITIAL_GUARDIANS: AlertGuardian[] = [
  {
    guardianId: 'GUAR-001',
    fullName: 'Rajesh Kumar',
    relationship: 'Father',
    mobileNumber: '9840123456',
    whatsAppNumber: '9840123456',
    hasWhatsApp: true,
    preferredLanguage: 'en',
    smsEnabled: true,
    whatsAppEnabled: true,
    studentIds: ['STU-001', 'STU-002']
  },
  {
    guardianId: 'GUAR-002',
    fullName: 'Suresh V',
    relationship: 'Father',
    mobileNumber: '9840234567',
    whatsAppNumber: '9840234567',
    hasWhatsApp: true,
    preferredLanguage: 'en',
    smsEnabled: true,
    whatsAppEnabled: true,
    studentIds: ['STU-003']
  },
  {
    guardianId: 'GUAR-003',
    fullName: 'Meena Dharshini',
    relationship: 'Mother',
    mobileNumber: '9840345678',
    whatsAppNumber: undefined,
    hasWhatsApp: false, // SMS only test
    preferredLanguage: 'en',
    smsEnabled: true,
    whatsAppEnabled: false,
    studentIds: ['STU-004']
  },
  {
    guardianId: 'GUAR-004',
    fullName: 'Ramani Sharma',
    relationship: 'Father',
    mobileNumber: '9840456789',
    whatsAppNumber: '9840456789',
    hasWhatsApp: true,
    preferredLanguage: 'en',
    smsEnabled: true,
    whatsAppEnabled: true,
    studentIds: ['STU-005']
  },
  {
    guardianId: 'GUAR-005',
    fullName: 'Ramanathan K',
    relationship: 'Father',
    mobileNumber: '9840567890',
    whatsAppNumber: '9840567890',
    hasWhatsApp: true,
    preferredLanguage: 'ta', // Tamil preference
    smsEnabled: true,
    whatsAppEnabled: true,
    studentIds: ['STU-006']
  },
  {
    guardianId: 'GUAR-006',
    fullName: 'Krishnan M',
    relationship: 'Father',
    mobileNumber: '9840678901',
    whatsAppNumber: '9840678901',
    hasWhatsApp: true,
    preferredLanguage: 'en',
    smsEnabled: true,
    whatsAppEnabled: true,
    studentIds: ['STU-007']
  },
  {
    guardianId: 'GUAR-007',
    fullName: 'Malathi M',
    relationship: 'Mother',
    mobileNumber: '9840789012',
    whatsAppNumber: '9840789012',
    hasWhatsApp: true,
    preferredLanguage: 'en',
    smsEnabled: true,
    whatsAppEnabled: true,
    studentIds: ['STU-008']
  },
  {
    guardianId: 'GUAR-008',
    fullName: 'Senthil S',
    relationship: 'Father',
    mobileNumber: '9840890123',
    whatsAppNumber: '9840890123',
    hasWhatsApp: true,
    preferredLanguage: 'en',
    smsEnabled: true,
    whatsAppEnabled: true,
    studentIds: ['STU-009']
  },
  // Fictional Guardian for Scenario 4 (No Valid Contact Number)
  {
    guardianId: 'GUAR-009',
    fullName: 'Unknown Guardian',
    relationship: 'Guardian',
    mobileNumber: '', // Intentionally invalid / empty for testing
    whatsAppNumber: '',
    hasWhatsApp: false,
    preferredLanguage: 'en',
    smsEnabled: true,
    whatsAppEnabled: true,
    studentIds: ['STU-010']
  }
];

export const INITIAL_STUDENTS: AlertStudent[] = [
  {
    studentId: 'STU-001',
    registerNumber: '311522104001',
    fullName: 'Aarav Kumar',
    department: 'Computer Science and Engineering',
    className: 'CSE-B',
    section: 'B',
    semester: 5,
    guardianId: 'GUAR-001',
    profileImage: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120&auto=format&fit=crop&q=80'
  },
  {
    studentId: 'STU-002',
    registerNumber: '311522106002',
    fullName: 'Ananya Kumar',
    department: 'Electronics and Communication Engineering',
    className: 'ECE-A',
    section: 'A',
    semester: 3,
    guardianId: 'GUAR-001',
    profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'
  },
  {
    studentId: 'STU-003',
    registerNumber: '311522104003',
    fullName: 'Karthik V',
    department: 'Computer Science and Engineering',
    className: 'CSE-B',
    section: 'B',
    semester: 5,
    guardianId: 'GUAR-002',
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80'
  },
  {
    studentId: 'STU-004',
    registerNumber: '311522104004',
    fullName: 'Priya Dharshini',
    department: 'Computer Science and Engineering',
    className: 'CSE-B',
    section: 'B',
    semester: 5,
    guardianId: 'GUAR-003',
    profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80'
  },
  {
    studentId: 'STU-005',
    registerNumber: '311522104005',
    fullName: 'Rohith Sharma',
    department: 'Computer Science and Engineering',
    className: 'CSE-B',
    section: 'B',
    semester: 5,
    guardianId: 'GUAR-004',
    profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80'
  },
  {
    studentId: 'STU-006',
    registerNumber: '311522104006',
    fullName: 'Sneha Raman',
    department: 'Computer Science and Engineering',
    className: 'CSE-B',
    section: 'B',
    semester: 5,
    guardianId: 'GUAR-005',
    profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&auto=format&fit=crop&q=80'
  },
  {
    studentId: 'STU-007',
    registerNumber: '311522104007',
    fullName: 'Harish K',
    department: 'Computer Science and Engineering',
    className: 'CSE-B',
    section: 'B',
    semester: 5,
    guardianId: 'GUAR-006',
    profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80'
  },
  {
    studentId: 'STU-008',
    registerNumber: '311522104008',
    fullName: 'Divya M',
    department: 'Computer Science and Engineering',
    className: 'CSE-B',
    section: 'B',
    semester: 5,
    guardianId: 'GUAR-007',
    profileImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80'
  },
  {
    studentId: 'STU-009',
    registerNumber: '311522104009',
    fullName: 'Vikram S',
    department: 'Computer Science and Engineering',
    className: 'CSE-B',
    section: 'B',
    semester: 5,
    guardianId: 'GUAR-008',
    profileImage: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&auto=format&fit=crop&q=80'
  },
  {
    studentId: 'STU-010',
    registerNumber: '311522104010',
    fullName: 'Keerthana R (Test Incomplete Contact)',
    department: 'Computer Science and Engineering',
    className: 'CSE-B',
    section: 'B',
    semester: 5,
    guardianId: 'GUAR-009',
    profileImage: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80'
  }
];

export const INITIAL_ATTENDANCE_RECORDS: StudentAttendanceRecord[] = [
  // Today's records (2026-10-21)
  {
    recordId: 'REC-2026-10-21-STU-001',
    studentId: 'STU-001',
    date: '2026-10-21',
    status: 'Absent',
    source: 'csv_import',
    recordedAt: '2026-10-21T08:35:00Z',
    notes: 'Absent at morning roll call muster.'
  },
  {
    recordId: 'REC-2026-10-21-STU-002',
    studentId: 'STU-002',
    date: '2026-10-21',
    status: 'Late',
    arrivalTime: '09:24 AM',
    source: 'csv_import',
    recordedAt: '2026-10-21T09:24:00Z',
    notes: 'Gate scanner recorded entry at 09:24 AM.'
  },
  {
    recordId: 'REC-2026-10-21-STU-003',
    studentId: 'STU-003',
    date: '2026-10-21',
    status: 'Present',
    arrivalTime: '08:22 AM',
    source: 'csv_import',
    recordedAt: '2026-10-21T08:22:00Z'
  },
  {
    recordId: 'REC-2026-10-21-STU-004',
    studentId: 'STU-004',
    date: '2026-10-21',
    status: 'Late',
    arrivalTime: '09:18 AM',
    source: 'csv_import',
    recordedAt: '2026-10-21T09:18:00Z',
    notes: 'Arrived after 09:10 AM grace cutoff.'
  },
  {
    recordId: 'REC-2026-10-21-STU-005',
    studentId: 'STU-005',
    date: '2026-10-21',
    status: 'Absent',
    source: 'csv_import',
    recordedAt: '2026-10-21T08:35:00Z',
    notes: 'No leave request submitted.'
  },
  {
    recordId: 'REC-2026-10-21-STU-006',
    studentId: 'STU-006',
    date: '2026-10-21',
    status: 'Present',
    arrivalTime: '08:26 AM',
    source: 'csv_import',
    recordedAt: '2026-10-21T08:26:00Z'
  },
  {
    recordId: 'REC-2026-10-21-STU-007',
    studentId: 'STU-007',
    date: '2026-10-21',
    status: 'Absent',
    source: 'manual_entry',
    recordedAt: '2026-10-21T08:40:00Z',
    notes: 'Manually flagged by class advisor.'
  },
  {
    recordId: 'REC-2026-10-21-STU-008',
    studentId: 'STU-008',
    date: '2026-10-21',
    status: 'Present',
    arrivalTime: '08:20 AM',
    source: 'csv_import',
    recordedAt: '2026-10-21T08:20:00Z'
  },
  {
    recordId: 'REC-2026-10-21-STU-009',
    studentId: 'STU-009',
    date: '2026-10-21',
    status: 'Present',
    arrivalTime: '08:30 AM',
    source: 'manual_entry',
    recordedAt: '2026-10-21T08:30:00Z'
  }
];

export const INITIAL_NOTIFICATION_JOBS: AttendanceNotificationJob[] = [
  {
    jobId: 'JOB-2026-10-21-001',
    recordId: 'REC-2026-10-21-STU-001',
    studentId: 'STU-001',
    studentName: 'Aarav Kumar',
    guardianId: 'GUAR-001',
    guardianName: 'Rajesh Kumar',
    guardianPhone: '9840123456',
    guardianWhatsApp: '9840123456',
    attendanceDate: '2026-10-21',
    alertType: 'Absent',
    renderedMessage: {
      sms: 'Dear Parent/Guardian, our attendance record indicates that Aarav Kumar (STU-001) was marked absent on 2026-10-21. Please contact the college at 044-24801636 if you need clarification. — MSEC',
      whatsApp: 'Dear Rajesh Kumar, this is an automated attendance alert from Meenakshi Sundararajan Engineering College (Autonomous). Our attendance muster records that your ward Aarav Kumar (STU-001, CSE-B) was marked absent on 2026-10-21. If this record requires correction, please contact the class advisor or administrative office at 044-24801636. — MSEC'
    },
    smsStatus: 'Delivered',
    whatsAppStatus: 'Delivered',
    createdAt: '2026-10-21T08:36:00Z',
    lastAttemptAt: '2026-10-21T08:36:05Z',
    generatedReason: 'Student was explicitly marked Absent in attendance register.',
    idempotencyKey: 'STU-001_2026-10-21_Absent',
    smsAttemptLogs: [
      {
        attemptId: 'ATT-SMS-001',
        timestamp: '2026-10-21T08:36:02Z',
        channel: 'sms',
        recipient: '+91 9840123456',
        status: 'Delivered',
        latencyMs: 142,
        providerResponse: '[Sandbox / Mock Delivery - SMS Gateway Simulator] Dispatched successfully to +91 9840123456. Ref: MOCK-SMS-3456-17384901'
      }
    ],
    whatsAppAttemptLogs: [
      {
        attemptId: 'ATT-WA-001',
        timestamp: '2026-10-21T08:36:05Z',
        channel: 'whatsapp',
        recipient: '+91 9840123456',
        status: 'Delivered',
        latencyMs: 188,
        providerResponse: '[Sandbox / Mock Delivery - WhatsApp Cloud Simulator] Message delivered to WhatsApp account +91 9840123456. Ref: wamid.MOCK-WA-3456-17384902'
      }
    ]
  },
  {
    jobId: 'JOB-2026-10-21-002',
    recordId: 'REC-2026-10-21-STU-002',
    studentId: 'STU-002',
    studentName: 'Ananya Kumar',
    guardianId: 'GUAR-001',
    guardianName: 'Rajesh Kumar',
    guardianPhone: '9840123456',
    guardianWhatsApp: '9840123456',
    attendanceDate: '2026-10-21',
    alertType: 'Late',
    arrivalTime: '09:24 AM',
    renderedMessage: {
      sms: 'Dear Parent/Guardian, Ananya Kumar (STU-002) was recorded arriving at 09:24 AM on 2026-10-21, later than the configured arrival time. — MSEC',
      whatsApp: 'Dear Rajesh Kumar, this is an attendance notification from Meenakshi Sundararajan Engineering College (Autonomous). Your ward Ananya Kumar (STU-002, ECE-A) was recorded arriving on campus at 09:24 AM on 2026-10-21, after the official commencement bell. Please advise your ward regarding punctual attendance. — MSEC'
    },
    smsStatus: 'Delivered',
    whatsAppStatus: 'Delivered',
    createdAt: '2026-10-21T09:25:00Z',
    lastAttemptAt: '2026-10-21T09:25:04Z',
    generatedReason: 'Gate scanner recorded entry at 09:24 AM.',
    idempotencyKey: 'STU-002_2026-10-21_Late',
    smsAttemptLogs: [
      {
        attemptId: 'ATT-SMS-002',
        timestamp: '2026-10-21T09:25:02Z',
        channel: 'sms',
        recipient: '+91 9840123456',
        status: 'Delivered',
        latencyMs: 120,
        providerResponse: '[Sandbox / Mock Delivery - SMS Gateway Simulator] Dispatched successfully to +91 9840123456. Ref: MOCK-SMS-3456-17384915'
      }
    ],
    whatsAppAttemptLogs: [
      {
        attemptId: 'ATT-WA-002',
        timestamp: '2026-10-21T09:25:04Z',
        channel: 'whatsapp',
        recipient: '+91 9840123456',
        status: 'Delivered',
        latencyMs: 165,
        providerResponse: '[Sandbox / Mock Delivery - WhatsApp Cloud Simulator] Message delivered to WhatsApp account +91 9840123456. Ref: wamid.MOCK-WA-3456-17384916'
      }
    ]
  },
  {
    jobId: 'JOB-2026-10-21-003',
    recordId: 'REC-2026-10-21-STU-004',
    studentId: 'STU-004',
    studentName: 'Priya Dharshini',
    guardianId: 'GUAR-003',
    guardianName: 'Meena Dharshini',
    guardianPhone: '9840345678',
    attendanceDate: '2026-10-21',
    alertType: 'Late',
    arrivalTime: '09:18 AM',
    renderedMessage: {
      sms: 'Dear Parent/Guardian, Priya Dharshini (STU-004) was recorded arriving at 09:18 AM on 2026-10-21, later than the configured arrival time. — MSEC',
      whatsApp: 'Dear Meena Dharshini, this is an attendance notification from Meenakshi Sundararajan Engineering College (Autonomous). Your ward Priya Dharshini (STU-004, CSE-B) was recorded arriving on campus at 09:18 AM on 2026-10-21, after the official commencement bell. — MSEC'
    },
    smsStatus: 'Pending',
    whatsAppStatus: 'Failed', // Guardian does not have WhatsApp
    createdAt: '2026-10-21T09:20:00Z',
    generatedReason: 'Arrived after 09:10 AM grace cutoff.',
    idempotencyKey: 'STU-004_2026-10-21_Late',
    smsAttemptLogs: [],
    whatsAppAttemptLogs: [
      {
        attemptId: 'ATT-WA-003',
        timestamp: '2026-10-21T09:20:02Z',
        channel: 'whatsapp',
        recipient: '+91 9840345678',
        status: 'Failed',
        latencyMs: 80,
        error: 'Guardian opted out of WhatsApp alerts / WhatsApp contact disabled.',
        providerResponse: '[Sandbox / Mock Delivery - WhatsApp Simulator] Rejected: Recipient channel preference disabled'
      }
    ]
  },
  {
    jobId: 'JOB-2026-10-21-004',
    recordId: 'REC-2026-10-21-STU-005',
    studentId: 'STU-005',
    studentName: 'Rohith Sharma',
    guardianId: 'GUAR-004',
    guardianName: 'Ramani Sharma',
    guardianPhone: '9840456789',
    guardianWhatsApp: '9840456789',
    attendanceDate: '2026-10-21',
    alertType: 'Absent',
    renderedMessage: {
      sms: 'Dear Parent/Guardian, our attendance record indicates that Rohith Sharma (STU-005) was marked absent on 2026-10-21. Please contact the college at 044-24801636 if you need clarification. — MSEC',
      whatsApp: 'Dear Ramani Sharma, this is an automated attendance alert from Meenakshi Sundararajan Engineering College (Autonomous). Our attendance muster records that your ward Rohith Sharma (STU-005, CSE-B) was marked absent on 2026-10-21. — MSEC'
    },
    smsStatus: 'Pending',
    whatsAppStatus: 'Pending',
    createdAt: '2026-10-21T08:40:00Z',
    generatedReason: 'Student was explicitly marked Absent in attendance register.',
    idempotencyKey: 'STU-005_2026-10-21_Absent',
    smsAttemptLogs: [],
    whatsAppAttemptLogs: []
  }
];
