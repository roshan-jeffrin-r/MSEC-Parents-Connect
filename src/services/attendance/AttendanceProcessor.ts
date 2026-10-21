import {
  StudentAttendanceRecord,
  AlertStudent,
  AlertGuardian,
  AttendanceNotificationJob,
  AlertSystemSettings,
  AlertType
} from '../../types/attendanceAlert';
import { TemplateEngine } from './TemplateEngine';

export class AttendanceProcessor {
  private templateEngine: TemplateEngine;

  constructor(templateEngine?: TemplateEngine) {
    this.templateEngine = templateEngine || new TemplateEngine();
  }

  /**
   * Parse various time strings into minutes since midnight (0 - 1439).
   * Supports: "09:12 AM", "9:12 am", "09:12", "14:30"
   */
  public parseTimeToMinutes(timeStr?: string): number | null {
    if (!timeStr || typeof timeStr !== 'string') return null;

    const trimmed = timeStr.trim().toUpperCase();

    // Match 12-hour format: "09:15 AM" or "9:15PM"
    const match12 = trimmed.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/);
    if (match12) {
      let hours = parseInt(match12[1], 10);
      const minutes = parseInt(match12[2], 10);
      const ampm = match12[3];

      if (hours < 1 || hours > 12 || minutes < 0 || minutes > 59) return null;

      if (ampm === 'PM' && hours < 12) hours += 12;
      if (ampm === 'AM' && hours === 12) hours = 0;

      return hours * 60 + minutes;
    }

    // Match 24-hour format: "09:15" or "14:30"
    const match24 = trimmed.match(/^(\d{1,2}):(\d{2})$/);
    if (match24) {
      const hours = parseInt(match24[1], 10);
      const minutes = parseInt(match24[2], 10);

      if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return null;

      return hours * 60 + minutes;
    }

    return null;
  }

  /**
   * Format minutes from midnight to readable string (e.g. 550 -> "09:10 AM")
   */
  public formatMinutesToTime(minutes: number): string {
    const hours24 = Math.floor(minutes / 60) % 24;
    const mins = minutes % 60;
    const ampm = hours24 >= 12 ? 'PM' : 'AM';
    const hours12 = hours24 % 12 || 12;
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${pad(hours12)}:${pad(mins)} ${ampm}`;
  }

  /**
   * Evaluate if a student is late based on arrival time vs expected time + grace period.
   */
  public evaluateLateStatus(
    arrivalTime: string | undefined,
    expectedTimeStr: string,
    gracePeriodMinutes: number
  ): { isLate: boolean; reason: string } {
    if (!arrivalTime) {
      return {
        isLate: false,
        reason: 'No arrival time timestamp recorded; cannot classify as late based on missing data.'
      };
    }

    const arrivalMinutes = this.parseTimeToMinutes(arrivalTime);
    const expectedMinutes = this.parseTimeToMinutes(expectedTimeStr);

    if (arrivalMinutes === null || expectedMinutes === null) {
      return {
        isLate: false,
        reason: 'Incomplete or unparseable time format; late classification skipped.'
      };
    }

    const thresholdMinutes = expectedMinutes + gracePeriodMinutes;

    if (arrivalMinutes > thresholdMinutes) {
      const thresholdFormatted = this.formatMinutesToTime(thresholdMinutes);
      return {
        isLate: true,
        reason: `Recorded arrival at ${arrivalTime} is after late threshold (${thresholdFormatted}).`
      };
    }

    return {
      isLate: false,
      reason: `Recorded arrival at ${arrivalTime} is within permitted grace window.`
    };
  }

  /**
   * Generate stable idempotency key to prevent duplicate alert jobs.
   */
  public generateIdempotencyKey(studentId: string, date: string, alertType: AlertType): string {
    return `${studentId}_${date}_${alertType}`;
  }

  /**
   * Evaluates a single attendance record and generates an Alert Job if eligible.
   * Returns null if record is Present, if parent info is missing, or if an alert already exists.
   */
  public evaluateRecord(
    record: StudentAttendanceRecord,
    student: AlertStudent,
    guardian: AlertGuardian,
    settings: AlertSystemSettings,
    existingJobs: AttendanceNotificationJob[] = []
  ): AttendanceNotificationJob | null {
    let alertType: AlertType | null = null;
    let reason = '';

    if (record.status === 'Absent') {
      alertType = 'Absent';
      reason = 'Student was explicitly marked Absent in attendance register.';
    } else if (record.status === 'Late') {
      alertType = 'Late';
      reason = record.notes || 'Student was recorded as Late arrival by faculty / gate muster.';
    } else if (record.status === 'Present') {
      // Check if arrival time qualifies as late even if source marked present
      const lateCheck = this.evaluateLateStatus(
        record.arrivalTime,
        settings.expectedArrivalTime,
        settings.gracePeriodMinutes
      );
      if (lateCheck.isLate) {
        alertType = 'Late';
        reason = lateCheck.reason;
      }
    }

    // Present students or unflagged records receive no alerts
    if (!alertType) {
      return null;
    }

    // Check duplicate protection (idempotency key)
    const idempotencyKey = this.generateIdempotencyKey(record.studentId, record.date, alertType);
    const alreadyExists = existingJobs.some((j) => j.idempotencyKey === idempotencyKey);

    if (alreadyExists) {
      return null; // Idempotent: prevent duplicate creation
    }

    // Prepare template context
    const templateContext = {
      studentName: student.fullName,
      studentId: student.studentId,
      date: record.date,
      arrivalTime: record.arrivalTime,
      className: student.className,
      parentName: guardian.fullName,
      collegeName: settings.collegeName,
      collegeShortName: settings.collegeShortName,
      contactPhone: settings.contactPhone
    };

    // Render SMS and WhatsApp templates
    const smsRendered = this.templateEngine.renderForAlert(
      alertType,
      'sms',
      guardian.preferredLanguage,
      templateContext
    );

    const waRendered = this.templateEngine.renderForAlert(
      alertType,
      'whatsapp',
      guardian.preferredLanguage,
      templateContext
    );

    const nowIso = new Date().toISOString();

    const job: AttendanceNotificationJob = {
      jobId: `JOB-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      recordId: record.recordId,
      studentId: student.studentId,
      studentName: student.fullName,
      guardianId: guardian.guardianId,
      guardianName: guardian.fullName,
      guardianPhone: guardian.mobileNumber,
      guardianWhatsApp: guardian.whatsAppNumber || guardian.mobileNumber,
      attendanceDate: record.date,
      alertType,
      arrivalTime: record.arrivalTime,
      renderedMessage: {
        sms: smsRendered.text,
        whatsApp: waRendered.text
      },
      smsStatus: guardian.smsEnabled ? 'Pending' : 'Failed',
      whatsAppStatus: guardian.whatsAppEnabled && guardian.hasWhatsApp ? 'Pending' : 'Failed',
      createdAt: nowIso,
      generatedReason: reason,
      idempotencyKey,
      smsAttemptLogs: [],
      whatsAppAttemptLogs: []
    };

    return job;
  }

  /**
   * Batch evaluate multiple records against the student & guardian directory.
   */
  public evaluateBatch(
    records: StudentAttendanceRecord[],
    students: AlertStudent[],
    guardians: AlertGuardian[],
    settings: AlertSystemSettings,
    existingJobs: AttendanceNotificationJob[] = []
  ): {
    newJobs: AttendanceNotificationJob[];
    skippedPresentCount: number;
    duplicateIgnoredCount: number;
    unmatchedCount: number;
  } {
    const newJobs: AttendanceNotificationJob[] = [];
    const allJobs = [...existingJobs];
    let skippedPresentCount = 0;
    let duplicateIgnoredCount = 0;
    let unmatchedCount = 0;

    for (const record of records) {
      const student = students.find(
        (s) => s.studentId === record.studentId || s.registerNumber === record.studentId
      );

      if (!student) {
        unmatchedCount++;
        continue;
      }

      const guardian = guardians.find((g) => g.guardianId === student.guardianId);
      if (!guardian) {
        unmatchedCount++;
        continue;
      }

      if (record.status === 'Present') {
        const lateCheck = this.evaluateLateStatus(
          record.arrivalTime,
          settings.expectedArrivalTime,
          settings.gracePeriodMinutes
        );
        if (!lateCheck.isLate) {
          skippedPresentCount++;
          continue;
        }
      }

      // Check idempotency before calling evaluateRecord
      const candidateAlertType: AlertType = record.status === 'Absent' ? 'Absent' : 'Late';
      const key = this.generateIdempotencyKey(record.studentId, record.date, candidateAlertType);

      if (allJobs.some((j) => j.idempotencyKey === key)) {
        duplicateIgnoredCount++;
        continue;
      }

      const job = this.evaluateRecord(record, student, guardian, settings, allJobs);
      if (job) {
        newJobs.push(job);
        allJobs.push(job);
      }
    }

    return {
      newJobs,
      skippedPresentCount,
      duplicateIgnoredCount,
      unmatchedCount
    };
  }
}
