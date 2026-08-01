/**
 * Enterprise Mobile Push Notification Platform - Value Objects
 *
 * Immutable Value Objects encapsulating push tokens, notification payloads, categories, actions,
 * channels, deep link targets, badge counters, delivery receipts, and user notification preferences.
 */

import { NotificationPriority, NotificationStatus } from '../enums/mobile-notifications.enums';

/**
 * PushToken Value Object
 */
export class PushToken {
  public readonly token: string;
  public readonly provider: 'Expo' | 'APNs' | 'FCM';

  private constructor(token: string, provider: 'Expo' | 'APNs' | 'FCM') {
    this.token = token;
    this.provider = provider;
  }

  public static create(token: string, provider: 'Expo' | 'APNs' | 'FCM' = 'Expo'): PushToken {
    return new PushToken(token, provider);
  }
}

/**
 * DeepLinkTarget Value Object
 */
export class DeepLinkTarget {
  public readonly url: string;
  public readonly targetScreen: string;

  private constructor(url: string, targetScreen: string) {
    this.url = url;
    this.targetScreen = targetScreen;
  }

  public static create(url: string, targetScreen: string = 'OrderDetails'): DeepLinkTarget {
    return new DeepLinkTarget(url, targetScreen);
  }
}

/**
 * NotificationAction & NotificationCategory Value Objects
 */
export class NotificationAction {
  public readonly actionId: string;
  public readonly title: string;

  private constructor(actionId: string, title: string) {
    this.actionId = actionId;
    this.title = title;
  }

  public static create(actionId: string, title: string): NotificationAction {
    return new NotificationAction(actionId, title);
  }
}

export class NotificationCategory {
  public readonly categoryId: string;
  public readonly name: string;
  public readonly actions: NotificationAction[];

  private constructor(categoryId: string, name: string, actions: NotificationAction[]) {
    this.categoryId = categoryId;
    this.name = name;
    this.actions = actions;
  }

  public static create(categoryId: string, name: string, actions: NotificationAction[] = []): NotificationCategory {
    return new NotificationCategory(categoryId, name, actions);
  }
}

/**
 * NotificationChannel Value Object
 */
export class NotificationChannel {
  public readonly channelId: string;
  public readonly name: string;
  public readonly isEnabled: boolean;

  private constructor(channelId: string, name: string, isEnabled: boolean) {
    this.channelId = channelId;
    this.name = name;
    this.isEnabled = isEnabled;
  }

  public static create(channelId: string, name: string, isEnabled: boolean = true): NotificationChannel {
    return new NotificationChannel(channelId, name, isEnabled);
  }
}

/**
 * NotificationPayload Value Object
 */
export class NotificationPayload {
  public readonly notificationId: string;
  public readonly title: string;
  public readonly body: string;
  public readonly priority: NotificationPriority;
  public readonly category: NotificationCategory;
  public readonly deepLink?: DeepLinkTarget;
  public readonly data: Record<string, any>;

  private constructor(props: {
    notificationId: string;
    title: string;
    body: string;
    priority: NotificationPriority;
    category: NotificationCategory;
    deepLink?: DeepLinkTarget;
    data: Record<string, any>;
  }) {
    this.notificationId = props.notificationId;
    this.title = props.title;
    this.body = props.body;
    this.priority = props.priority;
    this.category = props.category;
    this.deepLink = props.deepLink;
    this.data = props.data;
  }

  public static create(props: {
    notificationId?: string;
    title: string;
    body: string;
    priority?: NotificationPriority;
    category?: NotificationCategory;
    deepLink?: DeepLinkTarget;
    data?: Record<string, any>;
  }): NotificationPayload {
    return new NotificationPayload({
      notificationId: props.notificationId || `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title: props.title,
      body: props.body,
      priority: props.priority || NotificationPriority.NORMAL,
      category: props.category || NotificationCategory.create('ORDER_ALERTS', 'Order Alerts'),
      deepLink: props.deepLink,
      data: props.data || {},
    });
  }
}

/**
 * NotificationBadge & DeliveryReceipt & NotificationPreferences Value Objects
 */
export class NotificationBadge {
  public readonly count: number;

  private constructor(count: number) {
    this.count = Math.max(0, count);
  }

  public static create(count: number): NotificationBadge {
    return new NotificationBadge(count);
  }
}

export class DeliveryReceipt {
  public readonly notificationId: string;
  public readonly status: NotificationStatus;
  public readonly deliveredAt: Date;

  private constructor(notificationId: string, status: NotificationStatus) {
    this.notificationId = notificationId;
    this.status = status;
    this.deliveredAt = new Date();
  }

  public static create(notificationId: string, status: NotificationStatus = NotificationStatus.DELIVERED): DeliveryReceipt {
    return new DeliveryReceipt(notificationId, status);
  }
}

export class NotificationPreferences {
  public readonly isPushEnabled: boolean;
  public readonly soundEnabled: boolean;

  private constructor(isPushEnabled: boolean, soundEnabled: boolean) {
    this.isPushEnabled = isPushEnabled;
    this.soundEnabled = soundEnabled;
  }

  public static default(): NotificationPreferences {
    return new NotificationPreferences(true, true);
  }
}
