import { 
  InAppNotification,
  NotificationFeed,
  NotificationStatistics,
  NotificationPreference
} from '../read-models';

export class NotificationPreferenceService {
  private preferences: Map<string, NotificationPreference> = new Map();

  public getPreferences(userId: string): NotificationPreference {
    return this.preferences.get(userId) || {
      userId,
      tenantId: 'global',
      optedOutChannels: [],
      optedOutTypes: [],
      mutedCategories: [],
      timezone: 'UTC',
      desktopNotificationsEnabled: true,
      soundEnabled: true
    };
  }

  public shouldMute(userId: string, category: string): boolean {
    const prefs = this.getPreferences(userId);
    return prefs.mutedCategories.includes(category);
  }
}

export class NotificationFeedService {
  private feeds: Map<string, InAppNotification[]> = new Map();

  public async saveToFeed(notification: InAppNotification): Promise<void> {
    const feed = this.feeds.get(notification.recipientId) || [];
    feed.unshift(notification); // Add to top
    this.feeds.set(notification.recipientId, feed);
  }

  public async getFeed(userId: string, limit: number = 50): Promise<NotificationFeed> {
    const all = this.feeds.get(userId) || [];
    const active = all.filter(n => n.status !== 'DISMISSED' && n.status !== 'EXPIRED');
    const unread = active.filter(n => n.status === 'UNREAD');

    return {
      userId,
      tenantId: 'global',
      notifications: active.slice(0, limit),
      totalCount: active.length,
      unreadCount: unread.length,
      lastUpdated: new Date()
    };
  }
}

export class NotificationReadService {
  constructor(private readonly feedService: NotificationFeedService) {}

  public async markAsRead(userId: string, notificationId: string): Promise<void> {
    console.log(`[NotificationReadService] Marked ${notificationId} as read for ${userId}`);
    // State mutation would happen here
  }

  public async markAsArchived(userId: string, notificationId: string): Promise<void> {
    console.log(`[NotificationReadService] Archived ${notificationId} for ${userId}`);
  }

  public async dismiss(userId: string, notificationId: string): Promise<void> {
    console.log(`[NotificationReadService] Dismissed ${notificationId} for ${userId}`);
  }
}

export class BadgeCounterService {
  constructor(private readonly feedService: NotificationFeedService) {}

  public async getUnreadCount(userId: string): Promise<number> {
    const feed = await this.feedService.getFeed(userId, 100);
    return feed.unreadCount;
  }
}

export class RealTimeDeliveryService {
  public async pushToClient(userId: string, notification: InAppNotification): Promise<void> {
    // Mock WebSocket/SSE push
    console.log(`[RealTimeDeliveryService] Emitting WebSocket event to user ${userId} for notification ${notification.inAppId}`);
  }
}

export class NotificationCleanupService {
  public async cleanupExpiredNotifications(): Promise<number> {
    console.log(`[NotificationCleanupService] Sweeping expired notifications...`);
    return 0;
  }
}

export class InAppDeliveryService {
  constructor(
    private readonly preferences: NotificationPreferenceService,
    private readonly feedService: NotificationFeedService,
    private readonly realtimeService: RealTimeDeliveryService
  ) {}

  public async dispatchNotification(
    recipientId: string, 
    payload: Omit<InAppNotification, 'inAppId' | 'status' | 'createdAt' | 'isPinned' | 'recipientId'>
  ): Promise<InAppNotification> {
    
    if (this.preferences.shouldMute(recipientId, payload.category)) {
      console.log(`[InAppDeliveryService] Notification muted for ${recipientId}`);
      // In real scenario we might still persist it as UNREAD but not emit realtime, 
      // or we might drop it based on domain rules. We'll persist but skip realtime.
    }

    const notification: InAppNotification = {
      ...payload,
      inAppId: crypto.randomUUID(),
      recipientId,
      status: 'UNREAD',
      isPinned: false,
      createdAt: new Date()
    };

    // 1. Persist to durable feed
    await this.feedService.saveToFeed(notification);

    // 2. Attempt realtime delivery
    if (!this.preferences.shouldMute(recipientId, payload.category)) {
      await this.realtimeService.pushToClient(recipientId, notification);
    }

    return notification;
  }
}
