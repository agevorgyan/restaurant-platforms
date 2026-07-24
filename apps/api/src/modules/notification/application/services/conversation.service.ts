import { 
  OutgoingMessage, 
  IncomingWebhook, 
  DeliveryReceipt, 
  ProviderHealth 
} from '../read-models';

export interface IConversationProvider {
  name: string;
  channel: 'WHATSAPP' | 'TELEGRAM';
  isAvailable(): boolean;
  sendMessage(message: OutgoingMessage): Promise<string>;
}

export class MockWhatsAppProvider implements IConversationProvider {
  name = 'WHATSAPP_CLOUD';
  channel = 'WHATSAPP' as const;
  isAvailable() { return true; }
  async sendMessage(message: OutgoingMessage): Promise<string> {
    console.log(`[WhatsApp] Sending message to ${message.recipientId}`);
    return `wa-${crypto.randomUUID()}`;
  }
}

export class MockTelegramProvider implements IConversationProvider {
  name = 'TELEGRAM_BOT';
  channel = 'TELEGRAM' as const;
  isAvailable() { return true; }
  async sendMessage(message: OutgoingMessage): Promise<string> {
    console.log(`[Telegram] Sending message to ${message.recipientId}`);
    return `tg-${crypto.randomUUID()}`;
  }
}

export class ProviderHealthService {
  public getHealth(providerName: string): ProviderHealth {
    return {
      providerName,
      isAvailable: true,
      latencyMs: 150,
      errorRatePercentage: 0.1,
      lastCheckedAt: new Date()
    };
  }
}

export class ProviderRegistry {
  private providers: IConversationProvider[] = [];

  constructor(private readonly healthService: ProviderHealthService) {
    this.providers.push(new MockWhatsAppProvider());
    this.providers.push(new MockTelegramProvider());
  }

  public getProvider(channel: string): IConversationProvider {
    const provider = this.providers.find(p => p.channel === channel);
    if (!provider || !this.healthService.getHealth(provider.name).isAvailable) {
      throw new Error(`Provider for channel ${channel} is unavailable`);
    }
    return provider;
  }

  public getAllProviders(): string[] {
    return this.providers.map(p => p.name);
  }
}

export class TemplateRenderingService {
  public async renderTemplate(templateId: string, payload: any): Promise<any> {
    // Return pre-approved structured payload for WhatsApp/Telegram HSMs
    return {
      type: 'template',
      templateId,
      parameters: payload
    };
  }
}

export class DeliveryTrackingService {
  public async processReceipt(receipt: DeliveryReceipt): Promise<void> {
    console.log(`[DeliveryTrackingService] Message ${receipt.messageId} status updated to ${receipt.status} by ${receipt.providerName}`);
  }

  public getStatistics(): any {
    return {
      tenantId: 'global',
      period: new Date().toISOString().slice(0, 7),
      totalSent: 8000,
      totalDelivered: 7800,
      totalRead: 7000, // Blue ticks / Seen
      totalFailed: 200,
      deliveryRatePercentage: 97.5
    };
  }
}

export class WebhookReceiver {
  constructor(private readonly tracking: DeliveryTrackingService) {}

  public async handleIncomingWebhook(webhook: IncomingWebhook): Promise<void> {
    console.log(`[WebhookReceiver] Received ${webhook.eventType} from ${webhook.providerName}`);
    
    if (webhook.eventType === 'DELIVERY_RECEIPT' || webhook.eventType === 'READ_RECEIPT') {
      const receipt: DeliveryReceipt = {
        receiptId: crypto.randomUUID(),
        messageId: webhook.payload.messageId || 'unknown',
        providerName: webhook.providerName,
        providerMessageId: webhook.payload.providerMessageId || 'unknown',
        status: webhook.eventType === 'READ_RECEIPT' ? 'READ' : 'DELIVERED',
        timestamp: new Date()
      };
      await this.tracking.processReceipt(receipt);
    }
    
    // Inbound messages (replies) would be routed to a conversational AI or inbox service here.
  }
}

export class ConversationDeliveryService {
  constructor(
    private readonly registry: ProviderRegistry,
    private readonly renderer: TemplateRenderingService,
    private readonly tracking: DeliveryTrackingService
  ) {}

  public async dispatchMessage(message: OutgoingMessage): Promise<OutgoingMessage> {
    const provider = this.registry.getProvider(message.channel);
    
    if (message.messageType === 'TEMPLATE' && message.templateId) {
      message.content = await this.renderer.renderTemplate(message.templateId, message.content);
    }

    const providerMessageId = await provider.sendMessage(message);

    message.status = 'SENT';
    
    // Create initial tracking record
    await this.tracking.processReceipt({
      receiptId: crypto.randomUUID(),
      messageId: message.messageId,
      providerName: provider.name,
      providerMessageId,
      status: 'SENT',
      timestamp: new Date()
    });

    return message;
  }
}
