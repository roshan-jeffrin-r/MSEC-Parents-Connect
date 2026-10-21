import { NotificationChannel, DeliveryStatus } from '../../types/attendanceAlert';

export interface NotificationPayload {
  jobId: string;
  recipientPhone: string;
  recipientName: string;
  message: string;
  channel: NotificationChannel;
  alertType: 'Absent' | 'Late';
  studentName: string;
  forceFailure?: boolean; // For testing scenarios
}

export interface DeliveryResult {
  success: boolean;
  status: DeliveryStatus;
  providerResponse: string;
  latencyMs: number;
  error?: string;
  messageId?: string;
}

export interface INotificationProvider {
  channel: NotificationChannel;
  name: string;
  isMock: boolean;
  send(payload: NotificationPayload): Promise<DeliveryResult>;
}
