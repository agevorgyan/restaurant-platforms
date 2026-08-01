/**
 * Enterprise Mobile Push Notification Platform - Domain Services
 *
 * Implements core domain services for mobile push notifications:
 * 1. PushRegistrationService (APNs / FCM / Expo Push Token Manager)
 * 2. NotificationService (Payload Parsing & Presentation Display Runner)
 * 3. NotificationPreferenceService (Channel Category & User Preferences)
 * 4. DeepLinkService (Notification Deep-Link Target Router)
 * 5. BadgeService (App Icon Badge Counter Synchronizer)
 * 6. BackgroundNotificationService (Silent Background Push Notification Handler)
 * 7. EnterpriseMobileNotificationsPlatformService (Primary Application Façade)
 */

import { NotificationPriority, NotificationStatus } from '../domain/enums/mobile-notifications.enums';
import {
  DeepLinkTarget,
  DeliveryReceipt,
  NotificationBadge,
  NotificationChannel,
  NotificationPayload,
  NotificationPreferences,
  PushToken,
} from '../domain/value-objects/mobile-notifications-vo';
import {
  BadgeOverviewReadModel,
  DeliveryStatisticsReadModel,
  NotificationHistoryReadModel,
  NotificationPreferencesReadModel,
  RegisteredDevicesReadModel,
} from '../read-models/mobile-notifications.read-models';

/**
 * Service 1: PushRegistrationService
 * Push token registration & rotation manager (Expo Push, APNs, FCM).
 */
export class PushRegistrationService {
  private readonly registeredTokens = new Map<string, { token: PushToken; registeredAt: Date }>();

  public registerPushToken(tokenString: string, provider: 'Expo' | 'APNs' | 'FCM' = 'Expo'): PushToken {
    const token = PushToken.create(tokenString, provider);
    this.registeredTokens.set(token.token, { token, registeredAt: new Date() });
    return token;
  }

  public getRegisteredDevices(): RegisteredDevicesReadModel {
    const list = Array.from(this.registeredTokens.values());
    return {
      totalRegisteredDevicesCount: list.length,
      tokens: list.map((item) => ({
        token: item.token.token,
        provider: item.token.provider,
        registeredAt: item.registeredAt.toISOString(),
      })),
    };
  }
}

/**
 * Service 2: NotificationService
 * Notification presentation, display runner, and delivery receipt generator.
 */
export class NotificationService {
  private readonly notificationLogs: Array<{ payload: NotificationPayload; receipt: DeliveryReceipt }> = [];

  public presentNotification(payload: NotificationPayload): DeliveryReceipt {
    const receipt = DeliveryReceipt.create(payload.notificationId, NotificationStatus.DELIVERED);
    this.notificationLogs.unshift({ payload, receipt });
    return receipt;
  }

  public openNotification(notificationId: string): void {
    const item = this.notificationLogs.find((l) => l.payload.notificationId === notificationId);
    if (item) {
      (item.receipt as any).status = NotificationStatus.OPENED;
    }
  }

  public getNotificationHistory(): NotificationHistoryReadModel {
    return {
      totalNotificationsSent: this.notificationLogs.length,
      history: this.notificationLogs.map((l) => ({
        notificationId: l.payload.notificationId,
        title: l.payload.title,
        body: l.payload.body,
        status: l.receipt.status,
        priority: l.payload.priority,
        sentAt: l.receipt.deliveredAt.toISOString(),
      })),
    };
  }

  public getDeliveryStatistics(): DeliveryStatisticsReadModel {
    const total = this.notificationLogs.length;
    const opened = this.notificationLogs.filter((l) => l.receipt.status === NotificationStatus.OPENED).length;

    return {
      totalDelivered: total,
      totalOpened: opened,
      totalDismissed: 0,
      totalFailed: 0,
      openRatePercentage: total > 0 ? Math.round((opened / total) * 100) : 0,
    };
  }
}

/**
 * Service 3: NotificationPreferenceService
 * Notification channel categories & user preferences manager.
 */
export class NotificationPreferenceService {
  private preferences: NotificationPreferences = NotificationPreferences.default();
  private readonly channels = new Map<string, NotificationChannel>();

  constructor() {
    this.seedDefaultChannels();
  }

  public getPreferences(userId: string = 'usr-current'): NotificationPreferencesReadModel {
    const list = Array.from(this.channels.values());
    return {
      userId,
      isPushEnabled: this.preferences.isPushEnabled,
      soundEnabled: this.preferences.soundEnabled,
      activeChannels: list.map((c) => ({
        channelId: c.channelId,
        name: c.name,
        isEnabled: c.isEnabled,
      })),
    };
  }

  private seedDefaultChannels(): void {
    this.channels.set('ORDER_ALERTS', NotificationChannel.create('ORDER_ALERTS', 'Order Alerts', true));
    this.channels.set('KITCHEN_BUMP', NotificationChannel.create('KITCHEN_BUMP', 'Kitchen Bump Alerts', true));
    this.channels.set('INVENTORY_ALERTS', NotificationChannel.create('INVENTORY_ALERTS', 'Inventory Warnings', true));
  }
}

/**
 * Service 4: DeepLinkService
 * Notification deep-link target router.
 */
export class DeepLinkService {
  public resolveDeepLinkFromNotification(payload: NotificationPayload): DeepLinkTarget | undefined {
    return payload.deepLink;
  }
}

/**
 * Service 5: BadgeService
 * App icon badge counter synchronizer.
 */
export class BadgeService {
  private currentBadge: NotificationBadge = NotificationBadge.create(0);

  public setBadgeCount(count: number): NotificationBadge {
    this.currentBadge = NotificationBadge.create(count);
    return this.currentBadge;
  }

  public getBadgeOverview(): BadgeOverviewReadModel {
    return {
      unreadCount: this.currentBadge.count,
      lastUpdated: new Date().toISOString(),
    };
  }
}

/**
 * Service 6: BackgroundNotificationService
 * Silent push notification background runner.
 */
export class BackgroundNotificationService {
  public async handleSilentNotification(data: Record<string, any>): Promise<boolean> {
    return true;
  }
}

/**
 * Service 7: EnterpriseMobileNotificationsPlatformService
 * High-level application façade for mobile push notifications infrastructure.
 */
export class EnterpriseMobileNotificationsPlatformService {
  constructor(
    public readonly registrationService: PushRegistrationService,
    public readonly notificationService: NotificationService,
    public readonly preferenceService: NotificationPreferenceService,
    public readonly deepLinkService: DeepLinkService,
    public readonly badgeService: BadgeService,
    public readonly backgroundService: BackgroundNotificationService
  ) {}
}
