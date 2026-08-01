/**
 * Enterprise Mobile Push Notification Platform - Domain Enums
 *
 * Defines core domain enumerations for push notification lifecycle statuses and priority levels.
 */

export enum NotificationStatus {
  REGISTERED = 'REGISTERED',
  PENDING = 'PENDING',
  DELIVERED = 'DELIVERED',
  DISPLAYED = 'DISPLAYED',
  OPENED = 'OPENED',
  DISMISSED = 'DISMISSED',
  FAILED = 'FAILED',
}

export enum NotificationPriority {
  LOW = 'LOW',
  NORMAL = 'NORMAL',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}
