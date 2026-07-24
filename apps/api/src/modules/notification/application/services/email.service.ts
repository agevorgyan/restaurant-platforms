import { 
  EmailMessage,
  EmailDelivery,
  EmailStatistics,
  ProviderHealth
} from '../read-models';

export interface IEmailProvider {
  name: string;
  isAvailable(): boolean;
  sendEmail(message: EmailMessage): Promise<string>;
}

export class MockSesProvider implements IEmailProvider {
  name = 'AWS_SES';
  isAvailable() { return true; }
  async sendEmail(message: EmailMessage): Promise<string> {
    console.log(`[SES] Sending email to ${message.toAddress}`);
    return `ses-${crypto.randomUUID()}`;
  }
}

export class MockSendGridProvider implements IEmailProvider {
  name = 'SENDGRID';
  isAvailable() { return true; }
  async sendEmail(message: EmailMessage): Promise<string> {
    console.log(`[SendGrid] Sending email to ${message.toAddress}`);
    return `sg-${crypto.randomUUID()}`;
  }
}

export class ProviderHealthService {
  public getHealth(providerName: string): ProviderHealth {
    return {
      providerName,
      isAvailable: true,
      activeConnections: 5,
      latencyMs: 120,
      errorRatePercentage: 0.1
    };
  }
}

export class EmailProviderRegistry {
  private providers: IEmailProvider[] = [];

  constructor(private readonly healthService: ProviderHealthService) {
    this.providers.push(new MockSesProvider());
    this.providers.push(new MockSendGridProvider());
  }

  public getBestProvider(): IEmailProvider {
    const available = this.providers.filter(p => this.healthService.getHealth(p.name).isAvailable);
    if (available.length === 0) throw new Error('No email providers available');
    return available[0];
  }

  public getAllProviders(): string[] {
    return this.providers.map(p => p.name);
  }
}

export class EmailTemplateRenderer {
  public async renderHtml(templateId: string, context: any): Promise<string> {
    return `<html><body><h1>Hello ${context.name || 'User'}</h1></body></html>`;
  }

  public async renderText(templateId: string, context: any): Promise<string> {
    return `Hello ${context.name || 'User'}, this is a plain text email.`;
  }
}

export class EmailTrackingService {
  public async recordDelivery(delivery: EmailDelivery): Promise<void> {
    console.log(`[EmailTrackingService] Email delivered via ${delivery.providerName}, id: ${delivery.providerMessageId}`);
  }

  public getStatistics(): EmailStatistics {
    return {
      tenantId: 'global',
      period: new Date().toISOString().slice(0, 7),
      totalSent: 15000,
      totalDelivered: 14950,
      totalBounced: 40,
      totalComplained: 10,
      deliveryRatePercentage: 99.6,
      averageLatencyMs: 250
    };
  }
}

export class BounceProcessingService {
  public processBounceWebhook(payload: any): void {
    console.log(`[BounceProcessingService] Processed bounce from provider: ${JSON.stringify(payload)}`);
  }
}

export class EmailDeliveryService {
  constructor(
    private readonly registry: EmailProviderRegistry,
    private readonly renderer: EmailTemplateRenderer,
    private readonly tracking: EmailTrackingService
  ) {}

  public async dispatchEmail(message: EmailMessage, templateId?: string, context?: any): Promise<EmailDelivery> {
    const provider = this.registry.getBestProvider();

    if (templateId && context) {
      // Mock render step, usually we would update the message body here
      await this.renderer.renderHtml(templateId, context);
    }

    const providerMessageId = await provider.sendEmail(message);

    const delivery: EmailDelivery = {
      deliveryId: crypto.randomUUID(),
      emailId: message.emailId,
      providerName: provider.name as any,
      providerMessageId,
      dispatchedAt: new Date()
    };

    await this.tracking.recordDelivery(delivery);
    return delivery;
  }
}
