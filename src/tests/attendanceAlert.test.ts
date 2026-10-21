import { describe, it, expect, beforeEach } from 'vitest';
import { AttendanceProcessor } from '../services/attendance/AttendanceProcessor';
import { TemplateEngine } from '../services/attendance/TemplateEngine';
import { CSVImportAdapter } from '../services/attendance/CSVImportAdapter';
import { MockSMSProvider } from '../services/notification/MockSMSProvider';
import { MockWhatsAppProvider } from '../services/notification/MockWhatsAppProvider';
import { NotificationService } from '../services/notification/NotificationService';
import {
  AlertStudent,
  AlertGuardian,
  StudentAttendanceRecord,
  AlertSystemSettings
} from '../types/attendanceAlert';

describe('Attendance Monitoring & Parent Notification System Tests', () => {
  let templateEngine: TemplateEngine;
  let attendanceProcessor: AttendanceProcessor;
  let csvAdapter: CSVImportAdapter;
  let mockSms: MockSMSProvider;
  let mockWhatsApp: MockWhatsAppProvider;
  let notificationService: NotificationService;

  const mockSettings: AlertSystemSettings = {
    expectedArrivalTime: '09:00',
    gracePeriodMinutes: 10,
    collegeName: 'Meenakshi Sundararajan Engineering College',
    collegeShortName: 'MSEC',
    contactPhone: '044-24801636',
    defaultLanguage: 'en',
    autoProcessOnImport: false,
    simulateDeliveryDelay: false
  };

  const sampleStudent: AlertStudent = {
    studentId: 'STU-001',
    registerNumber: '311522104001',
    fullName: 'Aarav Kumar',
    department: 'Computer Science and Engineering',
    className: 'CSE-B',
    section: 'B',
    semester: 5,
    guardianId: 'GUAR-001'
  };

  const sampleGuardian: AlertGuardian = {
    guardianId: 'GUAR-001',
    fullName: 'Rajesh Kumar',
    relationship: 'Father',
    mobileNumber: '9840123456',
    whatsAppNumber: '9840123456',
    hasWhatsApp: true,
    preferredLanguage: 'en',
    smsEnabled: true,
    whatsAppEnabled: true,
    studentIds: ['STU-001']
  };

  beforeEach(() => {
    templateEngine = new TemplateEngine();
    attendanceProcessor = new AttendanceProcessor(templateEngine);
    csvAdapter = new CSVImportAdapter();
    mockSms = new MockSMSProvider();
    mockWhatsApp = new MockWhatsAppProvider();
    notificationService = new NotificationService(mockSms, mockWhatsApp);
  });

  describe('1. Attendance Classification & Threshold Rules', () => {
    it('generates an Absent alert job when student is explicitly marked Absent', () => {
      const record: StudentAttendanceRecord = {
        recordId: 'REC-1',
        studentId: 'STU-001',
        date: '2026-10-21',
        status: 'Absent',
        source: 'manual_entry',
        recordedAt: '2026-10-21T08:30:00Z'
      };

      const job = attendanceProcessor.evaluateRecord(record, sampleStudent, sampleGuardian, mockSettings, []);
      expect(job).not.toBeNull();
      expect(job?.alertType).toBe('Absent');
      expect(job?.studentName).toBe('Aarav Kumar');
      expect(job?.renderedMessage.sms).toContain('Aarav Kumar (STU-001) was marked absent on 2026-10-21');
    });

    it('does NOT generate an alert when a student is marked Present on-time', () => {
      const record: StudentAttendanceRecord = {
        recordId: 'REC-2',
        studentId: 'STU-001',
        date: '2026-10-21',
        status: 'Present',
        arrivalTime: '08:45 AM',
        source: 'manual_entry',
        recordedAt: '2026-10-21T08:45:00Z'
      };

      const job = attendanceProcessor.evaluateRecord(record, sampleStudent, sampleGuardian, mockSettings, []);
      expect(job).toBeNull();
    });

    it('generates a Late alert when arrival time exceeds expected time + grace period', () => {
      // Expected: 09:00 AM + 10 min grace = 09:10 AM. Arrived at 09:18 AM -> Late
      const record: StudentAttendanceRecord = {
        recordId: 'REC-3',
        studentId: 'STU-001',
        date: '2026-10-21',
        status: 'Late',
        arrivalTime: '09:18 AM',
        source: 'manual_entry',
        recordedAt: '2026-10-21T09:18:00Z'
      };

      const job = attendanceProcessor.evaluateRecord(record, sampleStudent, sampleGuardian, mockSettings, []);
      expect(job).not.toBeNull();
      expect(job?.alertType).toBe('Late');
      expect(job?.arrivalTime).toBe('09:18 AM');
      expect(job?.renderedMessage.sms).toContain('recorded arriving at 09:18 AM on 2026-10-21');
    });

    it('does NOT classify a student as late when timestamp is missing or incomplete', () => {
      const evalResult = attendanceProcessor.evaluateLateStatus(undefined, '09:00', 10);
      expect(evalResult.isLate).toBe(false);
      expect(evalResult.reason).toContain('No arrival time timestamp recorded');

      const evalResultInvalid = attendanceProcessor.evaluateLateStatus('invalid-time', '09:00', 10);
      expect(evalResultInvalid.isLate).toBe(false);
      expect(evalResultInvalid.reason).toContain('late classification skipped');
    });
  });

  describe('2. Idempotency & Duplicate Alert Prevention', () => {
    it('prevents generating duplicate alert jobs for the same student, date, and alert type', () => {
      const record: StudentAttendanceRecord = {
        recordId: 'REC-1',
        studentId: 'STU-001',
        date: '2026-10-21',
        status: 'Absent',
        source: 'manual_entry',
        recordedAt: '2026-10-21T08:30:00Z'
      };

      const firstJob = attendanceProcessor.evaluateRecord(record, sampleStudent, sampleGuardian, mockSettings, []);
      expect(firstJob).not.toBeNull();

      // Second evaluation with existing job in list
      const secondJob = attendanceProcessor.evaluateRecord(
        record,
        sampleStudent,
        sampleGuardian,
        mockSettings,
        [firstJob!]
      );
      expect(secondJob).toBeNull();
    });
  });

  describe('3. Message Template Rendering & Token Replacement', () => {
    it('renders all tokens properly in message templates', () => {
      const template = 'Dear Parent, [Student Name] ([Student ID]) was marked absent on [Date]. Contact [Contact Phone] — [College Short Name]';
      const context = {
        studentName: 'Aarav Kumar',
        studentId: 'STU-001',
        date: '2026-10-21',
        collegeShortName: 'MSEC',
        contactPhone: '044-24801636'
      };

      const result = templateEngine.render(template, context);
      expect(result.missingVariables.length).toBe(0);
      expect(result.text).toBe(
        'Dear Parent, Aarav Kumar (STU-001) was marked absent on 2026-10-21. Contact 044-24801636 — MSEC'
      );
    });

    it('detects and flags missing mandatory template variables', () => {
      const template = 'Alert for [Student Name] on [Date]. Arrived at [Arrival Time].';
      const context = {
        studentName: 'Aarav Kumar',
        studentId: 'STU-001',
        date: '2026-10-21'
        // Missing arrivalTime
      };

      const result = templateEngine.render(template, context);
      expect(result.missingVariables).toContain('[Arrival Time]');
    });
  });

  describe('4. CSV Import Adapter Validation', () => {
    it('accepts valid CSV rows and skips empty lines', () => {
      const csv = `student_id,attendance_date,attendance_status,arrival_time
STU-001,2026-10-21,Absent,
STU-001,2026-10-22,Present,08:30 AM
`;
      const result = csvAdapter.process(csv, [sampleStudent], []);
      expect(result.acceptedRows).toBe(2);
      expect(result.errorRows).toBe(0);
    });

    it('rejects unknown student IDs not present in student directory', () => {
      const csv = `student_id,attendance_date,attendance_status
UNKNOWN-999,2026-10-21,Absent
`;
      const result = csvAdapter.process(csv, [sampleStudent], []);
      expect(result.acceptedRows).toBe(0);
      expect(result.errorRows).toBe(1);
      expect(result.errors[0].reason).toContain('not found in local Student and Guardian Directory');
    });

    it('rejects invalid attendance status values', () => {
      const csv = `student_id,attendance_date,attendance_status
STU-001,2026-10-21,Suspended
`;
      const result = csvAdapter.process(csv, [sampleStudent], []);
      expect(result.errorRows).toBe(1);
      expect(result.errors[0].reason).toContain('Must be Present, Absent, or Late');
    });

    it('rejects invalid date formats', () => {
      const csv = `student_id,attendance_date,attendance_status
STU-001,21/10/2026,Absent
`;
      const result = csvAdapter.process(csv, [sampleStudent], []);
      expect(result.errorRows).toBe(1);
      expect(result.errors[0].reason).toContain('Invalid date format');
    });

    it('safely skips already imported rows (idempotent)', () => {
      const existingRecord: StudentAttendanceRecord = {
        recordId: 'REC-EXISTING',
        studentId: 'STU-001',
        date: '2026-10-21',
        status: 'Absent',
        source: 'csv_import',
        recordedAt: '2026-10-21T08:00:00Z'
      };

      const csv = `student_id,attendance_date,attendance_status
STU-001,2026-10-21,Absent
`;
      const result = csvAdapter.process(csv, [sampleStudent], [existingRecord]);
      expect(result.acceptedRows).toBe(0);
      expect(result.skippedRows).toBe(1);
      expect(result.errorRows).toBe(0);
    });
  });

  describe('5. Independent Mock SMS & WhatsApp Providers and Lifecycle', () => {
    it('simulates SMS delivery and transitions to Delivered state with mock tracking ref', async () => {
      const payload = {
        jobId: 'JOB-1',
        recipientPhone: '9840123456',
        recipientName: 'Rajesh Kumar',
        message: 'Test message',
        channel: 'sms' as const,
        alertType: 'Absent' as const,
        studentName: 'Aarav Kumar'
      };

      const result = await mockSms.send(payload);
      expect(result.success).toBe(true);
      expect(result.status).toBe('Delivered');
      expect(result.providerResponse).toContain('[Sandbox / Mock Delivery');
      expect(result.messageId).toContain('MOCK-SMS-');
    });

    it('fails SMS delivery when phone number is invalid / incomplete', async () => {
      const payload = {
        jobId: 'JOB-2',
        recipientPhone: '123', // Invalid
        recipientName: 'Unknown',
        message: 'Test message',
        channel: 'sms' as const,
        alertType: 'Absent' as const,
        studentName: 'Aarav Kumar'
      };

      const result = await mockSms.send(payload);
      expect(result.success).toBe(false);
      expect(result.status).toBe('Failed');
      expect(result.error).toContain('Requires 10-digit contact number');
    });

    it('operates WhatsApp provider independently without coupling to SMS state', async () => {
      const job = attendanceProcessor.evaluateRecord(
        {
          recordId: 'REC-1',
          studentId: 'STU-001',
          date: '2026-10-21',
          status: 'Absent',
          source: 'manual_entry',
          recordedAt: '2026-10-21T08:30:00Z'
        },
        sampleStudent,
        sampleGuardian,
        mockSettings
      )!;

      // Simulate SMS success while forcing WhatsApp failure
      const processedJob = await notificationService.processJob(job, {
        forceSmsFailure: false,
        forceWhatsAppFailure: true
      });

      expect(processedJob.smsStatus).toBe('Delivered');
      expect(processedJob.whatsAppStatus).toBe('Failed');
      expect(processedJob.smsAttemptLogs.length).toBe(1);
      expect(processedJob.whatsAppAttemptLogs.length).toBe(1);
      expect(processedJob.whatsAppAttemptLogs[0].status).toBe('Failed');

      // Now retry WhatsApp independently
      const retriedJob = await notificationService.retryChannel(processedJob, 'whatsapp');
      expect(retriedJob.whatsAppStatus).toBe('Delivered');
      expect(retriedJob.whatsAppAttemptLogs.length).toBe(2);
      expect(retriedJob.whatsAppAttemptLogs[0].status).toBe('Delivered');
    });
  });
});
