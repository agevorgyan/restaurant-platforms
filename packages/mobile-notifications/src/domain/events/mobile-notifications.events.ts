/**
 * Enterprise Mobile Push Notification Platform - Domain Events
 *
 * Domain events emitted during push token registration, delivery, open/dismiss actions, and preference updates.
 */

import { NotificationPriority } from '../enums/mobile-notifications.enums';

export interface PushTokenRegisteredEvent {
  eventName: 'PushTokenRegistered';
  token: string;
  provider: 'Expo' | 'APNs' | 'FCM';
  timestamp: Date;
}

export interface PushDeliveredEvent {
  eventName: 'PushDelivered';
  notificationId: string;
  priority: NotificationPriority;
  timestamp: Date;
}

export interface PushOpenedEvent {
  eventName: 'PushOpened';
  notificationId: string;
  targetUrl?: string;
  timestamp: Date;
}

export interface PushDismissedEvent {
  eventName: 'PushDismissed';
  notificationId: string;
  timestamp: Date;
}

export interface NotificationActionExecutedEvent {
  eventName: 'NotificationActionExecuted';
  notificationId: string;
  actionId: string;
  timestamp: Date;
}

export interface NotificationPreferenceChangedEvent {
  eventName: 'NotificationPreferenceChanged';
  channelId: string;
  isEnabled: boolean;
  timestamp: Date;
}

export type MobileNotificationDomainEvent =
  | PushTokenRegisteredEvent
  | PushDeliveredEvent
  | PushOpenedEvent
  | PushDismissedEvent
  | NotificationActionExecutedEvent
  | NotificationPreferenceChangedEvent;
