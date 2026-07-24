import { 
  NotificationDefinition, 
  NotificationDelivery,
  NotificationStatistics,
  NotificationPreference,
  FailedNotification
} from '../read-models';

export class NotificationPreferenceService {
  private preferences: Map<string, NotificationPreference> = new Map();

  public async getPreferences(userId: string): Promise<NotificationPreference | null> {
    return this.preferences.get(userId) || null;
  }

  public async updatePreferences(userId: string, pref: NotificationPreference): Promise<void> {
    this.preferences.set(userId, pref);
  }

  public shouldSendToChannel(userId: string, channel: string, type: string): boolean {
    const pref = this.preferences.get(userId);
    if (!pref) return true; // default opt-in
    
    if (pref.optedOutTypes.includes(type)) return false;
    if (pref.optedOutChannels.includes(channel)) return false;
    
    return true;
  }
}

export class TemplateRenderingService {
  public async renderTemplate(templateId: string, payload: any, locale: string): Promise<string> {
    // Mock Handlebars/MJML compilation
    console.log(`[TemplateRenderingService] Rendering template ${templateId} in locale ${locale}`);
    return `<html>Rendered Mock Content: ${JSON.stringify(payload)}</html>`;
  }
}

export class ChannelSelectionService {
  constructor(private readonly preferences: NotificationPreferenceService) {}

  public async selectBestChannels(userId: string, type: string, priority: string): Promise<string[]> {
    const available = ['EMAIL', 'IN_APP'];
    
    if (priority === 'CRITICAL') available.push('SMS');
    
    return available.filter(channel => 
      this.preferences.shouldSendToChannel(userId, channel, type)
    );
  }
}

export class RetryService {
  public calculateNextBackoff(attempt: number): number {
    return Math.pow(2, attempt) * 1000;
  }
}

export class NotificationScheduler {
  public schedule(notification: NotificationDefinition, executeAt: Date): void {
    console.log(`[NotificationScheduler] Scheduled notification ${notification.notificationId} to execute at ${executeAt.toISOString()}`);
  }
}

export class DeliveryTrackingService {
  public async trackDelivery(delivery: NotificationDelivery): Promise<void> {
    console.log(`[DeliveryTrackingService] Delivery ${delivery.deliveryId} updated to status ${delivery.status}`);
  }

  public getStatistics(tenantId: string): NotificationStatistics {
    return {
      tenantId,
      period: new Date().toISOString().slice(0, 7),
      totalSent: 10000,
      totalDelivered: 9900,
      totalFailed: 100,
      deliveryRatePercentage: 99.0
    };
  }
}

export class NotificationDispatcher {
  constructor(
    private readonly channelSelection: ChannelSelectionService,
    private readonly renderingService: TemplateRenderingService,
    private readonly tracking: DeliveryTrackingService,
    private readonly scheduler: NotificationScheduler
  ) {}

  public async dispatch(definition: NotificationDefinition): Promise<NotificationDelivery[]> {
    if (!definition.recipientId) throw new Error('Recipient required');
    
    const channels = await this.channelSelection.selectBestChannels(
      definition.recipientId, 
      definition.type, 
      definition.priority
    );

    const deliveries: NotificationDelivery[] = [];
    
    for (const channel of channels) {
      await this.renderingService.renderTemplate('default', definition.payload, 'en-US');
      
      const delivery: NotificationDelivery = {
        deliveryId: crypto.randomUUID(),
        notificationId: definition.notificationId,
        channel: channel as any,
        status: 'QUEUED'
      };
      
      await this.tracking.trackDelivery(delivery);
      deliveries.push(delivery);
    }
    
    return deliveries;
  }
}
