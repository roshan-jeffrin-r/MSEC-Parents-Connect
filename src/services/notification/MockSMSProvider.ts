import { INotificationProvider, NotificationPayload, DeliveryResult } from './types';

/**
 * MockSMSProvider
 *
 * Simulates an enterprise SMS gateway (e.g. AWS SNS, Twilio, Gupshup, Textlocal)
 * locally in the browser sandbox. Never contacts real mobile numbers.
 */
export class MockSMSProvider implements INotificationProvider {
  public readonly channel = 'sms';
  public readonly name = 'MSEC Mock SMS Gateway';
  public readonly isMock = true;

  public async send(payload: NotificationPayload): Promise<DeliveryResult> {
    const startTime = Date.now();

    // Small simulated network latency (50ms - 200ms)
    await new Promise((resolve) => setTimeout(resolve, 80 + Math.random() * 80));

    const latencyMs = Date.now() - startTime;

    // Validate phone number format
    const cleanPhone = (payload.recipientPhone || '').replace(/\D/g, '');

    if (!cleanPhone || cleanPhone.length < 10) {
      return {
        success: false,
        status: 'Failed',
        latencyMs,
        error: `Invalid phone number: "${payload.recipientPhone}". Requires 10-digit contact number.`,
        providerResponse: `[Sandbox / Mock Delivery - SMS Simulator] Rejected: Invalid mobile format`
      };
    }

    // Check for simulated failure mode (scenario testing)
    if (payload.forceFailure) {
      return {
        success: false,
        status: 'Failed',
        latencyMs,
        error: 'Simulated SMS gateway timeout (HTTP 504 Gateway Error).',
        providerResponse: `[Sandbox / Mock Delivery - SMS Simulator] Provider rejected dispatch`
      };
    }

    // Realistic mock SMS message ID
    const mockMessageId = `MOCK-SMS-${cleanPhone.slice(-4)}-${Date.now()}`;

    return {
      success: true,
      status: 'Delivered', // Marked as simulated delivery
      latencyMs,
      messageId: mockMessageId,
      providerResponse: `[Sandbox / Mock Delivery - SMS Simulator] Dispatched successfully to +91 ${cleanPhone}. Ref: ${mockMessageId}`
    };
  }
}
