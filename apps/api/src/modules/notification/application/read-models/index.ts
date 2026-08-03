// ─── Core notification read-models ────────────────────────────────────────────
export {
  NotificationDefinition,
  NotificationDelivery,
  NotificationAttempt,
  NotificationPreference,
  NotificationStatistics,
  FailedNotification,
} from './notification.read-model';

// ─── Email read-models ────────────────────────────────────────────────────────
export {
  EmailMessage,
  EmailDelivery,
  EmailAttempt,
  EmailStatistics,
  ProviderHealth,
  FailedEmail,
} from './email.read-model';

// ─── SMS read-models ──────────────────────────────────────────────────────────
export * from './sms.read-model';

// ─── Push read-models (ProviderHealth excluded — already exported from email) ─
export {
  PushMessage,
  PushDelivery,
  PushAttempt,
  PushStatistics,
  RegisteredDevice,
  ProviderHealth as PushProviderHealth,
} from './push.read-model';

// ─── In-app read-models (deduplicates NotificationPreference/Statistics) ──────
export {
  InAppNotification,
  NotificationFeed,
  UnreadCounter,
  NotificationStatistics as InAppNotificationStatistics,
  NotificationPreference as InAppNotificationPreference,
  ExpiredNotification,
} from './inapp.read-model';

// ─── Conversation read-models ─────────────────────────────────────────────────
export * from './conversation.read-model';
