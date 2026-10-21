import { INotificationProvider, NotificationPayload, DeliveryResult } from './types';

/**
 * MockWhatsAppProvider
 *
 * Simulates an official WhatsApp Business Cloud API / Gupshup provider
 * locally in the browser sandbox. Never contacts real WhatsApp accounts.
 */
export class MockWhatsAppProvider implements INotificationProvider {
  public readonly channel = 'whatsapp';
  public readonly name = 'MSEC Mock WhatsApp Cloud API';
  public readonly isMock = true;

  public async send(payload: NotificationPayload): Promise<DeliveryResult> {
    const startTime = Date.now();

    // Small simulated network latency
    await new Promise((resolve) => setTimeout(resolve, 100 + Math.random() * 90));

    const latencyMs = Date.now() - startTime;

    // Validate phone number format
    const cleanPhone = (payload.recipientPhone || '').replace(/\D/g, '');

    if (!cleanPhone || cleanPhone.length < 10) {
      return {
        success: false,
        status: 'Failed',
        latencyMs,
        error: `Invalid WhatsApp number: "${payload.recipientPhone}". Requires valid 10-digit number.`,
        providerResponse: `[Sandbox / Mock Delivery - WhatsApp Simulator] Rejected: Invalid recipient phone format`
      };
    }

    // Check for simulated failure mode (scenario testing)
    if (payload.forceFailure) {
      return {
        success: false,
        status: 'Failed',
        latencyMs,
        error: 'Simulated WhatsApp Cloud API delivery failure: Recipient WhatsApp account inactive or opted out.',
        providerResponse: `[Sandbox / Mock Delivery - WhatsApp Simulator] Meta Cloud API: Delivery status failed (Error code 131026)`
      };
    }

    // Realistic WhatsApp Message ID format
    const mockWamid = `wamid.MOCK-WA-${cleanPhone.slice(-4)}-${Date.now()}`;

    return {
      success: true,
      status: 'Delivered', // Marked as simulated delivery
      latencyMs,
      messageId: mockWamid,
      providerResponse: `[Sandbox / Mock Delivery - WhatsApp Simulator] Message delivered to WhatsApp account +91 ${cleanPhone}. Ref: ${mockWamid}`
    };
  }
}
