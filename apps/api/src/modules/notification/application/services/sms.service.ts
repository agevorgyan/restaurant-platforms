import { 
  SmsMessageRecord,
  SmsDelivery,
  SmsStatistics,
  GatewayHealth
} from '../read-models';

export interface ISmsGateway {
  name: string;
  isAvailable(): boolean;
  sendSms(message: SmsMessageRecord): Promise<string>;
}

export class MockTwilioGateway implements ISmsGateway {
  name = 'TWILIO';
  isAvailable() { return true; }
  async sendSms(message: SmsMessageRecord): Promise<string> {
    console.log(`[Twilio] Sending SMS to ${message.recipientNumber}`);
    return `SM${crypto.randomUUID().replace(/-/g, '')}`;
  }
}

export class MockVonageGateway implements ISmsGateway {
  name = 'VONAGE';
  isAvailable() { return true; }
  async sendSms(message: SmsMessageRecord): Promise<string> {
    console.log(`[Vonage] Sending SMS to ${message.recipientNumber}`);
    return `VN${crypto.randomUUID().replace(/-/g, '')}`;
  }
}

export class PhoneNumberValidationService {
  public isValidE164(phoneNumber: string): boolean {
    return /^\+[1-9]\d{1,14}$/.test(phoneNumber);
  }

  public extractCountryCode(phoneNumber: string): string | null {
    if (!this.isValidE164(phoneNumber)) return null;
    // Mock extraction
    return 'US';
  }
}

export class GatewayHealthService {
  public getHealth(gatewayName: string): GatewayHealth {
    return {
      gatewayName,
      isAvailable: true,
      latencyMs: 80,
      errorRatePercentage: 0.05,
      lastCheckedAt: new Date()
    };
  }
}

export class SmsGatewayRegistry {
  private gateways: ISmsGateway[] = [];

  constructor(private readonly healthService: GatewayHealthService) {
    this.gateways.push(new MockTwilioGateway());
    this.gateways.push(new MockVonageGateway());
  }

  public getBestGateway(countryCode?: string): ISmsGateway {
    const available = this.gateways.filter(g => this.healthService.getHealth(g.name).isAvailable);
    if (available.length === 0) throw new Error('No SMS gateways available');
    return available[0];
  }

  public getAllGateways(): string[] {
    return this.gateways.map(g => g.name);
  }
}

export class SmsTrackingService {
  public async recordDelivery(delivery: SmsDelivery): Promise<void> {
    console.log(`[SmsTrackingService] SMS delivered via ${delivery.gatewayName}, id: ${delivery.gatewayMessageId}`);
  }

  public getStatistics(): SmsStatistics {
    return {
      tenantId: 'global',
      period: new Date().toISOString().slice(0, 7),
      totalSent: 5000,
      totalDelivered: 4950,
      totalFailed: 50,
      totalSegments: 5200,
      deliveryRatePercentage: 99.0,
      averageLatencyMs: 120
    };
  }
}

export class DeliveryReceiptService {
  public processDlrWebhook(payload: any): void {
    console.log(`[DeliveryReceiptService] Processed DLR from gateway: ${JSON.stringify(payload)}`);
  }
}

export class SmsDeliveryService {
  constructor(
    private readonly registry: SmsGatewayRegistry,
    private readonly validator: PhoneNumberValidationService,
    private readonly tracking: SmsTrackingService
  ) {}

  public async dispatchSms(message: SmsMessageRecord): Promise<SmsDelivery> {
    if (!this.validator.isValidE164(message.recipientNumber)) {
      throw new Error('Invalid phone number');
    }

    const countryCode = this.validator.extractCountryCode(message.recipientNumber) || undefined;
    const gateway = this.registry.getBestGateway(countryCode);

    const gatewayMessageId = await gateway.sendSms(message);

    const delivery: SmsDelivery = {
      deliveryId: crypto.randomUUID(),
      smsId: message.smsId,
      gatewayName: gateway.name as any,
      gatewayMessageId,
      dispatchedAt: new Date()
    };

    await this.tracking.recordDelivery(delivery);
    return delivery;
  }
}
