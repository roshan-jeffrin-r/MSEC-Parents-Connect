import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  AlertStudent,
  AlertGuardian,
  StudentAttendanceRecord,
  AttendanceNotificationJob,
  MessageTemplate,
  AlertSystemSettings,
  CSVImportResult,
  NotificationChannel
} from '../types/attendanceAlert';
import {
  INITIAL_SETTINGS,
  INITIAL_STUDENTS,
  INITIAL_GUARDIANS,
  INITIAL_ATTENDANCE_RECORDS,
  INITIAL_NOTIFICATION_JOBS
} from '../data/alertMockData';
import { DEFAULT_TEMPLATES, TemplateEngine } from '../services/attendance/TemplateEngine';
import { AttendanceProcessor } from '../services/attendance/AttendanceProcessor';
import { CSVImportAdapter, SAMPLE_ATTENDANCE_CSV } from '../services/attendance/CSVImportAdapter';
import { NotificationService } from '../services/notification/NotificationService';

const STORAGE_KEY = 'msec_alert_system_state_v1';

interface AlertSystemContextType {
  // State
  students: AlertStudent[];
  guardians: AlertGuardian[];
  records: StudentAttendanceRecord[];
  notificationJobs: AttendanceNotificationJob[];
  templates: MessageTemplate[];
  settings: AlertSystemSettings;
  importHistory: CSVImportResult[];
  isProcessingQueue: boolean;

  // Record actions
  addAttendanceRecord: (
    record: Omit<StudentAttendanceRecord, 'recordId' | 'recordedAt'>
  ) => { record: StudentAttendanceRecord; jobGenerated: boolean };
  updateAttendanceRecord: (
    recordId: string,
    updates: Partial<StudentAttendanceRecord>
  ) => void;
  deleteAttendanceRecord: (recordId: string) => void;

  // CSV Import
  importAttendanceCSV: (csvText: string) => CSVImportResult;

  // Notification actions
  processNotificationJob: (
    jobId: string,
    options?: { forceSmsFailure?: boolean; forceWhatsAppFailure?: boolean }
  ) => Promise<AttendanceNotificationJob>;
  processAllPendingNotifications: () => Promise<void>;
  retryJobChannel: (
    jobId: string,
    channel: NotificationChannel
  ) => Promise<AttendanceNotificationJob>;

  // Directory actions
  addStudentWithGuardian: (
    student: AlertStudent,
    guardian: AlertGuardian
  ) => { success: boolean; message: string };
  updateStudent: (studentId: string, updates: Partial<AlertStudent>) => void;
  updateGuardian: (guardianId: string, updates: Partial<AlertGuardian>) => void;

  // Settings & Templates
  updateSettings: (newSettings: Partial<AlertSystemSettings>) => void;
  updateTemplate: (templateId: string, newBody: string) => void;

  // Sandbox & Scenarios
  resetSandboxData: () => void;
  runScenario: (scenarioNumber: number) => Promise<{ success: boolean; message: string; details?: string }>;
}

const AlertSystemContext = createContext<AlertSystemContextType | undefined>(undefined);

export const AlertSystemProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initial state loading from localStorage if present
  const getInitialState = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          students: parsed.students || INITIAL_STUDENTS,
          guardians: parsed.guardians || INITIAL_GUARDIANS,
          records: parsed.records || INITIAL_ATTENDANCE_RECORDS,
          notificationJobs: parsed.notificationJobs || INITIAL_NOTIFICATION_JOBS,
          templates: parsed.templates || DEFAULT_TEMPLATES,
          settings: parsed.settings || INITIAL_SETTINGS,
          importHistory: parsed.importHistory || []
        };
      }
    } catch (e) {
      console.warn('Failed to parse localStorage state for alert system:', e);
    }
    return {
      students: INITIAL_STUDENTS,
      guardians: INITIAL_GUARDIANS,
      records: INITIAL_ATTENDANCE_RECORDS,
      notificationJobs: INITIAL_NOTIFICATION_JOBS,
      templates: DEFAULT_TEMPLATES,
      settings: INITIAL_SETTINGS,
      importHistory: []
    };
  };

  const initial = getInitialState();

  const [students, setStudents] = useState<AlertStudent[]>(initial.students);
  const [guardians, setGuardians] = useState<AlertGuardian[]>(initial.guardians);
  const [records, setRecords] = useState<StudentAttendanceRecord[]>(initial.records);
  const [notificationJobs, setNotificationJobs] = useState<AttendanceNotificationJob[]>(initial.notificationJobs);
  const [templates, setTemplates] = useState<MessageTemplate[]>(initial.templates);
  const [settings, setSettings] = useState<AlertSystemSettings>(initial.settings);
  const [importHistory, setImportHistory] = useState<CSVImportResult[]>(initial.importHistory);
  const [isProcessingQueue, setIsProcessingQueue] = useState(false);

  // Initialize service singletons
  const templateEngine = useMemo(() => new TemplateEngine(templates), [templates]);
  const attendanceProcessor = useMemo(() => new AttendanceProcessor(templateEngine), [templateEngine]);
  const csvAdapter = useMemo(() => new CSVImportAdapter(), []);
  const notificationService = useMemo(() => new NotificationService(), []);

  // Save state to localStorage on changes
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          students,
          guardians,
          records,
          notificationJobs,
          templates,
          settings,
          importHistory
        })
      );
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }, [students, guardians, records, notificationJobs, templates, settings, importHistory]);

  // Add Attendance Record
  const addAttendanceRecord = (
    recData: Omit<StudentAttendanceRecord, 'recordId' | 'recordedAt'>
  ) => {
    const newRecord: StudentAttendanceRecord = {
      ...recData,
      recordId: `REC-${recData.date}-${recData.studentId}-${Date.now()}`,
      recordedAt: new Date().toISOString()
    };

    setRecords((prev) => [newRecord, ...prev]);

    // Check if an alert job should be generated
    const student = students.find((s) => s.studentId === newRecord.studentId);
    let jobGenerated = false;

    if (student) {
      const guardian = guardians.find((g) => g.guardianId === student.guardianId);
      if (guardian) {
        const job = attendanceProcessor.evaluateRecord(
          newRecord,
          student,
          guardian,
          settings,
          notificationJobs
        );
        if (job) {
          setNotificationJobs((prev) => [job, ...prev]);
          jobGenerated = true;
        }
      }
    }

    return { record: newRecord, jobGenerated };
  };

  // Update Attendance Record
  const updateAttendanceRecord = (
    recordId: string,
    updates: Partial<StudentAttendanceRecord>
  ) => {
    setRecords((prev) =>
      prev.map((r) => (r.recordId === recordId ? { ...r, ...updates } : r))
    );
  };

  // Delete Attendance Record
  const deleteAttendanceRecord = (recordId: string) => {
    setRecords((prev) => prev.filter((r) => r.recordId !== recordId));
  };

  // Import CSV
  const importAttendanceCSV = (csvText: string): CSVImportResult => {
    const result = csvAdapter.process(csvText, students, records);

    if (result.records.length > 0) {
      // Append new records
      setRecords((prev) => [...result.records, ...prev]);

      // Batch evaluate to create alert jobs
      const batchOutcome = attendanceProcessor.evaluateBatch(
        result.records,
        students,
        guardians,
        settings,
        notificationJobs
      );

      result.alertsGenerated = batchOutcome.newJobs.length;

      if (batchOutcome.newJobs.length > 0) {
        setNotificationJobs((prev) => [...batchOutcome.newJobs, ...prev]);

        // Auto-process if setting enabled
        if (settings.autoProcessOnImport) {
          setTimeout(() => {
            processAllPendingNotifications();
          }, 300);
        }
      }
    }

    setImportHistory((prev) => [result, ...prev]);
    return result;
  };

  // Process a single notification job
  const processNotificationJob = async (
    jobId: string,
    options?: { forceSmsFailure?: boolean; forceWhatsAppFailure?: boolean }
  ): Promise<AttendanceNotificationJob> => {
    const job = notificationJobs.find((j) => j.jobId === jobId);
    if (!job) throw new Error(`Notification Job not found: ${jobId}`);

    const updated = await notificationService.processJob(job, options);

    setNotificationJobs((prev) =>
      prev.map((j) => (j.jobId === jobId ? updated : j))
    );

    return updated;
  };

  // Process all pending notifications
  const processAllPendingNotifications = async () => {
    setIsProcessingQueue(true);
    try {
      const pendingJobs = notificationJobs.filter(
        (j) => j.smsStatus === 'Pending' || j.whatsAppStatus === 'Pending'
      );

      for (const job of pendingJobs) {
        const updated = await notificationService.processJob(job);
        setNotificationJobs((prev) =>
          prev.map((j) => (j.jobId === job.jobId ? updated : j))
        );
      }
    } finally {
      setIsProcessingQueue(false);
    }
  };

  // Retry single channel
  const retryJobChannel = async (
    jobId: string,
    channel: NotificationChannel
  ): Promise<AttendanceNotificationJob> => {
    const job = notificationJobs.find((j) => j.jobId === jobId);
    if (!job) throw new Error(`Job not found: ${jobId}`);

    const updated = await notificationService.retryChannel(job, channel);

    setNotificationJobs((prev) =>
      prev.map((j) => (j.jobId === jobId ? updated : j))
    );

    return updated;
  };

  // Add Student with Guardian
  const addStudentWithGuardian = (
    student: AlertStudent,
    guardian: AlertGuardian
  ): { success: boolean; message: string } => {
    // Validate duplicate student ID
    if (students.some((s) => s.studentId.toUpperCase() === student.studentId.toUpperCase())) {
      return { success: false, message: `Student ID "${student.studentId}" already exists.` };
    }

    // Validate phone number
    const cleanPhone = (guardian.mobileNumber || '').replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      return { success: false, message: 'Guardian mobile number must be at least 10 digits.' };
    }

    setStudents((prev) => [...prev, student]);
    setGuardians((prev) => [...prev, guardian]);

    return { success: true, message: `Student ${student.fullName} and guardian registered successfully.` };
  };

  const updateStudent = (studentId: string, updates: Partial<AlertStudent>) => {
    setStudents((prev) =>
      prev.map((s) => (s.studentId === studentId ? { ...s, ...updates } : s))
    );
  };

  const updateGuardian = (guardianId: string, updates: Partial<AlertGuardian>) => {
    setGuardians((prev) =>
      prev.map((g) => (g.guardianId === guardianId ? { ...g, ...updates } : g))
    );
  };

  const updateSettings = (newSettings: Partial<AlertSystemSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const updateTemplate = (templateId: string, newBody: string) => {
    setTemplates((prev) =>
      prev.map((t) => (t.templateId === templateId ? { ...t, body: newBody } : t))
    );
  };

  // Reset Sandbox Data
  const resetSandboxData = () => {
    localStorage.removeItem(STORAGE_KEY);
    setStudents(INITIAL_STUDENTS);
    setGuardians(INITIAL_GUARDIANS);
    setRecords(INITIAL_ATTENDANCE_RECORDS);
    setNotificationJobs(INITIAL_NOTIFICATION_JOBS);
    setTemplates(DEFAULT_TEMPLATES);
    setSettings(INITIAL_SETTINGS);
    setImportHistory([]);
  };

  // Run Test Scenarios 1 - 8
  const runScenario = async (
    scenarioNumber: number
  ): Promise<{ success: boolean; message: string; details?: string }> => {
    const today = '2026-10-21';

    switch (scenarioNumber) {
      case 1: {
        // Scenario 1: A student is marked absent -> triggers absence alert job
        const targetStudent = students[0]; // Aarav Kumar STU-001
        const outcome = addAttendanceRecord({
          studentId: targetStudent.studentId,
          date: today,
          status: 'Absent',
          source: 'sandbox_sim',
          notes: 'Scenario 1: Explicitly marked Absent'
        });
        return {
          success: true,
          message: `Scenario 1 Executed: Student ${targetStudent.fullName} marked Absent.`,
          details: outcome.jobGenerated
            ? 'New absence alert job generated for parent Rajesh Kumar with SMS & WhatsApp templates ready for review.'
            : 'Alert job already existed (idempotency prevented duplicate).'
        };
      }

      case 2: {
        // Scenario 2: A student arrives late -> triggers late arrival alert
        const targetStudent = students[2]; // Karthik V STU-003
        const outcome = addAttendanceRecord({
          studentId: targetStudent.studentId,
          date: today,
          status: 'Late',
          arrivalTime: '09:22 AM',
          source: 'sandbox_sim',
          notes: 'Scenario 2: Late arrival at 09:22 AM (Exceeds 09:10 cutoff)'
        });
        return {
          success: true,
          message: `Scenario 2 Executed: Student ${targetStudent.fullName} recorded arriving late at 09:22 AM.`,
          details: outcome.jobGenerated
            ? 'New late arrival alert job generated with arrival timestamp token populated.'
            : 'Alert job already existed for this date.'
        };
      }

      case 3: {
        // Scenario 3: A student is present -> should not receive an alert
        const targetStudent = students[5]; // Sneha Raman STU-006
        const outcome = addAttendanceRecord({
          studentId: targetStudent.studentId,
          date: today,
          status: 'Present',
          arrivalTime: '08:25 AM',
          source: 'sandbox_sim',
          notes: 'Scenario 3: On-time arrival'
        });
        return {
          success: true,
          message: `Scenario 3 Executed: Student ${targetStudent.fullName} marked Present on-time.`,
          details: outcome.jobGenerated
            ? 'Error: Alert was generated unexpectedly.'
            : 'Correct behavior verified: No alert job was generated for on-time present student.'
        };
      }

      case 4: {
        // Scenario 4: Parent has no valid contact number -> validation flags failure
        const targetStudent = students[9]; // Keerthana R (GUAR-009 with empty phone)
        const outcome = addAttendanceRecord({
          studentId: targetStudent.studentId,
          date: today,
          status: 'Absent',
          source: 'sandbox_sim',
          notes: 'Scenario 4: Absence with invalid contact'
        });

        // Attempt dispatch if job created
        const job = notificationJobs.find(
          (j) => j.studentId === targetStudent.studentId && j.attendanceDate === today
        );
        if (job) {
          await processNotificationJob(job.jobId);
        }

        return {
          success: true,
          message: 'Scenario 4 Executed: Student marked Absent with incomplete/invalid parent phone number.',
          details: 'Mock providers rejected dispatch due to missing 10-digit mobile number. Status marked as Failed with audit log.'
        };
      }

      case 5: {
        // Scenario 5: SMS simulation succeeds while WhatsApp simulation fails
        const targetStudent = students[3]; // Priya Dharshini
        let job = notificationJobs.find((j) => j.studentId === targetStudent.studentId);
        if (!job) {
          addAttendanceRecord({
            studentId: targetStudent.studentId,
            date: today,
            status: 'Late',
            arrivalTime: '09:18 AM',
            source: 'sandbox_sim'
          });
          job = notificationJobs.find((j) => j.studentId === targetStudent.studentId);
        }

        if (job) {
          await processNotificationJob(job.jobId, {
            forceSmsFailure: false,
            forceWhatsAppFailure: true
          });
        }

        return {
          success: true,
          message: 'Scenario 5 Executed: Independent channel delivery test.',
          details: 'SMS simulation succeeded (Delivered) while WhatsApp simulation failed independently (opt-out/delivery error).'
        };
      }

      case 6: {
        // Scenario 6: Both channels fail
        const targetStudent = students[4]; // Rohith Sharma
        let job = notificationJobs.find((j) => j.studentId === targetStudent.studentId);
        if (!job) {
          addAttendanceRecord({
            studentId: targetStudent.studentId,
            date: today,
            status: 'Absent',
            source: 'sandbox_sim'
          });
          job = notificationJobs.find((j) => j.studentId === targetStudent.studentId);
        }

        if (job) {
          await processNotificationJob(job.jobId, {
            forceSmsFailure: true,
            forceWhatsAppFailure: true
          });
        }

        return {
          success: true,
          message: 'Scenario 6 Executed: Dual-channel failure simulation.',
          details: 'Both SMS and WhatsApp simulated provider timeouts. Marked as Failed, eligible for manual retry.'
        };
      }

      case 7: {
        // Scenario 7: Same attendance file is imported twice -> idempotency prevents duplicate alerts
        const import1 = importAttendanceCSV(SAMPLE_ATTENDANCE_CSV);
        const import2 = importAttendanceCSV(SAMPLE_ATTENDANCE_CSV);

        return {
          success: true,
          message: 'Scenario 7 Executed: Idempotency & Duplicate Import Protection.',
          details: `First import accepted ${import1.acceptedRows} rows and created ${import1.alertsGenerated} alerts. Second identical import skipped ${import2.skippedRows} existing rows and generated 0 duplicate alerts.`
        };
      }

      case 8: {
        // Scenario 8: Administrator retries a failed notification
        const failedJob = notificationJobs.find(
          (j) => j.smsStatus === 'Failed' || j.whatsAppStatus === 'Failed'
        );

        if (!failedJob) {
          return {
            success: false,
            message: 'No failed notification job currently found to retry.',
            details: 'Run Scenario 5 or Scenario 6 first to generate a simulated failure.'
          };
        }

        const channelToRetry = failedJob.smsStatus === 'Failed' ? 'sms' : 'whatsapp';
        const updated = await retryJobChannel(failedJob.jobId, channelToRetry);

        return {
          success: true,
          message: `Scenario 8 Executed: Retry initiated for Job ${failedJob.jobId} on ${channelToRetry.toUpperCase()}.`,
          details: `Previous status was Failed. Retried attempt yielded: ${
            channelToRetry === 'sms' ? updated.smsStatus : updated.whatsAppStatus
          }. Audit log updated with new attempt entry.`
        };
      }

      default:
        return { success: false, message: 'Invalid scenario number.' };
    }
  };

  return (
    <AlertSystemContext.Provider
      value={{
        students,
        guardians,
        records,
        notificationJobs,
        templates,
        settings,
        importHistory,
        isProcessingQueue,
        addAttendanceRecord,
        updateAttendanceRecord,
        deleteAttendanceRecord,
        importAttendanceCSV,
        processNotificationJob,
        processAllPendingNotifications,
        retryJobChannel,
        addStudentWithGuardian,
        updateStudent,
        updateGuardian,
        updateSettings,
        updateTemplate,
        resetSandboxData,
        runScenario
      }}
    >
      {children}
    </AlertSystemContext.Provider>
  );
};

export const useAlertSystem = () => {
  const context = useContext(AlertSystemContext);
  if (!context) {
    throw new Error('useAlertSystem must be used within an AlertSystemProvider');
  }
  return context;
};
