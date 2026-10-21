import {
  AttendanceNotificationJob,
  DeliveryAttemptLog,
  DeliveryStatus,
  NotificationChannel
} from '../../types/attendanceAlert';
import { INotificationProvider, NotificationPayload, DeliveryResult } from './types';
import { MockSMSProvider } from './MockSMSProvider';
import { MockWhatsAppProvider } from './MockWhatsAppProvider';

export class NotificationService {
  private smsProvider: INotificationProvider;
  private whatsAppProvider: INotificationProvider;

  constructor(
    smsProvider?: INotificationProvider,
    whatsAppProvider?: INotificationProvider
  ) {
    this.smsProvider = smsProvider || new MockSMSProvider();
    this.whatsAppProvider = whatsAppProvider || new MockWhatsAppProvider();
  }

  /**
   * Process a single channel delivery for a notification job.
   */
  public async sendChannel(
    job: AttendanceNotificationJob,
    channel: NotificationChannel,
    options?: { forceFailure?: boolean }
  ): Promise<{ status: DeliveryStatus; log: DeliveryAttemptLog }> {
    const isSms = channel === 'sms';
    const provider = isSms ? this.smsProvider : this.whatsAppProvider;
    const recipientPhone = isSms ? job.guardianPhone : (job.guardianWhatsApp || job.guardianPhone);
    const message = isSms ? job.renderedMessage.sms : job.renderedMessage.whatsApp;

    const payload: NotificationPayload = {
      jobId: job.jobId,
      recipientPhone,
      recipientName: job.guardianName,
      message,
      channel,
      alertType: job.alertType,
      studentName: job.studentName,
      forceFailure: options?.forceFailure
    };

    const result: DeliveryResult = await provider.send(payload);

    const log: DeliveryAttemptLog = {
      attemptId: `ATT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      channel,
      recipient: recipientPhone,
      status: result.status,
      latencyMs: result.latencyMs,
      error: result.error,
      providerResponse: result.providerResponse
    };

    return {
      status: result.status,
      log
    };
  }

  /**
   * Process both configured channels for a notification job.
   */
  public async processJob(
    job: AttendanceNotificationJob,
    options?: { forceSmsFailure?: boolean; forceWhatsAppFailure?: boolean }
  ): Promise<AttendanceNotificationJob> {
    const updatedJob: AttendanceNotificationJob = {
      ...job,
      smsAttemptLogs: [...job.smsAttemptLogs],
      whatsAppAttemptLogs: [...job.whatsAppAttemptLogs]
    };

    // SMS dispatch
    if (job.smsStatus === 'Pending' || job.smsStatus === 'Queued' || job.smsStatus === 'Failed') {
      const smsOutcome = await this.sendChannel(job, 'sms', {
        forceFailure: options?.forceSmsFailure
      });
      updatedJob.smsStatus = smsOutcome.status;
      updatedJob.smsAttemptLogs.unshift(smsOutcome.log);
    }

    // WhatsApp dispatch
    if (
      job.whatsAppStatus === 'Pending' ||
      job.whatsAppStatus === 'Queued' ||
      job.whatsAppStatus === 'Failed'
    ) {
      const waOutcome = await this.sendChannel(job, 'whatsapp', {
        forceFailure: options?.forceWhatsAppFailure
      });
      updatedJob.whatsAppStatus = waOutcome.status;
      updatedJob.whatsAppAttemptLogs.unshift(waOutcome.log);
    }

    updatedJob.lastAttemptAt = new Date().toISOString();

    return updatedJob;
  }

  /**
   * Retry failed channel specifically for an existing job.
   */
  public async retryChannel(
    job: AttendanceNotificationJob,
    channel: NotificationChannel
  ): Promise<AttendanceNotificationJob> {
    const outcome = await this.sendChannel(job, channel);

    const updatedJob: AttendanceNotificationJob = {
      ...job,
      lastAttemptAt: new Date().toISOString(),
      smsAttemptLogs: [...job.smsAttemptLogs],
      whatsAppAttemptLogs: [...job.whatsAppAttemptLogs]
    };

    if (channel === 'sms') {
      updatedJob.smsStatus = outcome.status;
      updatedJob.smsAttemptLogs.unshift(outcome.log);
    } else {
      updatedJob.whatsAppStatus = outcome.status;
      updatedJob.whatsAppAttemptLogs.unshift(outcome.log);
    }

    return updatedJob;
  }
}
