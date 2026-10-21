/**
 * MSEC Parent Connect — Student Attendance Monitoring and Parent Notification System
 * Domain Types & Interfaces
 */

export type AttendanceRecordStatus = 'Present' | 'Absent' | 'Late';

export type AttendanceSource = 'csv_import' | 'manual_entry' | 'sandbox_sim';

export type AlertType = 'Absent' | 'Late';

export type DeliveryStatus = 'Pending' | 'Queued' | 'Sending' | 'Sent' | 'Delivered' | 'Failed';

export type NotificationChannel = 'sms' | 'whatsapp';

export type SupportedLanguage = 'en' | 'ta';

/**
 * Fictional Student Record
 */
export interface AlertStudent {
  studentId: string; // e.g. "STU-001" or "MSEC26CSE01"
  registerNumber: string; // e.g. "311522104001"
  fullName: string;
  department: string;
  className: string; // e.g. "CSE-B"
  section: string;
  semester: number;
  guardianId: string;
  profileImage?: string;
}

/**
 * Guardian / Parent Contact Record
 */
export interface AlertGuardian {
  guardianId: string;
  fullName: string;
  relationship: 'Father' | 'Mother' | 'Guardian';
  mobileNumber: string; // 10-digit number e.g. "9840123456"
  whatsAppNumber?: string;
  hasWhatsApp: boolean;
  preferredLanguage: SupportedLanguage;
  smsEnabled: boolean;
  whatsAppEnabled: boolean;
  studentIds: string[];
}

/**
 * Daily Student Attendance Record
 */
export interface StudentAttendanceRecord {
  recordId: string;
  studentId: string;
  date: string; // YYYY-MM-DD
  status: AttendanceRecordStatus;
  arrivalTime?: string; // e.g. "09:15 AM" or "09:15"
  source: AttendanceSource;
  recordedAt: string;
  notes?: string;
  alertGenerated?: boolean;
}

/**
 * Delivery Attempt Audit Log
 */
export interface DeliveryAttemptLog {
  attemptId: string;
  timestamp: string;
  channel: NotificationChannel;
  recipient: string;
  status: DeliveryStatus;
  latencyMs: number;
  error?: string;
  providerResponse: string; // Clearly labeled "[Sandbox / Mock Delivery]"
}

/**
 * Notification Job (Attendance Alert)
 */
export interface AttendanceNotificationJob {
  jobId: string;
  recordId: string;
  studentId: string;
  studentName: string;
  guardianId: string;
  guardianName: string;
  guardianPhone: string;
  guardianWhatsApp?: string;
  attendanceDate: string;
  alertType: AlertType;
  arrivalTime?: string;
  renderedMessage: {
    sms: string;
    whatsApp: string;
  };
  smsStatus: DeliveryStatus;
  whatsAppStatus: DeliveryStatus;
  createdAt: string;
  lastAttemptAt?: string;
  generatedReason: string;
  idempotencyKey: string; // e.g. `${studentId}_${attendanceDate}_${alertType}`
  smsAttemptLogs: DeliveryAttemptLog[];
  whatsAppAttemptLogs: DeliveryAttemptLog[];
}

/**
 * Configurable Message Template
 */
export interface MessageTemplate {
  templateId: string;
  alertType: AlertType;
  channel: NotificationChannel;
  language: SupportedLanguage;
  body: string; // Tokens: [Student Name], [Student ID], [Date], [Arrival Time], [College Name], [Class Name]
}

/**
 * System Rules & Threshold Settings
 */
export interface AlertSystemSettings {
  expectedArrivalTime: string; // "09:00" (24h or HH:mm)
  gracePeriodMinutes: number; // e.g. 10 minutes -> 09:10 is late cutoff
  collegeName: string;
  collegeShortName: string;
  contactPhone: string;
  defaultLanguage: SupportedLanguage;
  autoProcessOnImport: boolean;
  simulateDeliveryDelay: boolean;
}

/**
 * CSV Import Result Summary
 */
export interface CSVImportResult {
  totalRows: number;
  acceptedRows: number;
  skippedRows: number;
  errorRows: number;
  records: StudentAttendanceRecord[];
  alertsGenerated: number;
  errors: {
    row: number;
    rawText: string;
    reason: string;
  }[];
  timestamp: string;
}

/**
 * Sandbox Test Scenario Definition
 */
export interface SandboxScenario {
  id: string;
  number: number;
  title: string;
  description: string;
  badge: string;
}
