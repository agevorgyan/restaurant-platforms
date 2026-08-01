/**
 * Enterprise Mobile Push Notification Platform - Read Models (CQRS Projections)
 *
 * Strongly-typed read models for Registered Devices, Notification History, Delivery Statistics,
 * Notification Preferences, and Badge Counter Overview.
 */

import { NotificationPriority, NotificationStatus } from '../domain/enums/mobile-notifications.enums';

export interface DeviceTokenSummaryReadModel {
  token: string;
  provider: string;
  registeredAt: string;
}

export interface RegisteredDevicesReadModel {
  totalRegisteredDevicesCount: number;
  tokens: DeviceTokenSummaryReadModel[];
}

export interface NotificationHistoryEntryReadModel {
  notificationId: string;
  title: string;
  body: string;
  status: NotificationStatus;
  priority: NotificationPriority;
  sentAt: string;
}

export interface NotificationHistoryReadModel {
  totalNotificationsSent: number;
  history: NotificationHistoryEntryReadModel[];
}

export interface DeliveryStatisticsReadModel {
  totalDelivered: number;
  totalOpened: number;
  totalDismissed: number;
  totalFailed: number;
  openRatePercentage: number;
}

export interface NotificationPreferencesReadModel {
  userId: string;
  isPushEnabled: boolean;
  soundEnabled: boolean;
  activeChannels: Array<{
    channelId: string;
    name: string;
    isEnabled: boolean;
  }>;
}

export interface BadgeOverviewReadModel {
  unreadCount: number;
  lastUpdated: string;
}
