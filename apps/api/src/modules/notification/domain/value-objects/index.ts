// ─── Core notification value objects (primary definitions) ────────────────────
export * from './notification-core';

// ─── Email value objects ──────────────────────────────────────────────────────
export {
  EmailId,
  EmailAddress,
  EmailSubject,
  EmailBodyProps,
  EmailBody,
  EmailTemplateId,
  EmailPriorityEnum,
  EmailPriority,
  EmailStatusEnum,
  EmailStatus,
  ProviderReferenceProps,
  ProviderReference,
  BounceReasonEnum,
  BounceReason,
} from './email-core';

// ─── SMS value objects ────────────────────────────────────────────────────────
export {
  SmsId,
  PhoneNumber,
  SmsMessage,
  SmsPriorityEnum,
  SmsPriority,
  SmsStatusEnum,
  SmsStatus,
  ProviderReferenceProps as SmsProviderReferenceProps,
  ProviderReference as SmsProviderReference,
  DeliveryReceiptId,
  CountryCode,
  SenderId,
} from './sms-core';

// ─── Push value objects ───────────────────────────────────────────────────────
export {
  PushNotificationId,
  DeviceToken,
  DevicePlatformEnum,
  DevicePlatform,
  PushTopic,
  PushPriorityEnum,
  PushPriority,
  PushStatusEnum,
  PushStatus,
  CollapseKey,
  TimeToLive,
  ProviderReferenceProps as PushProviderReferenceProps,
  ProviderReference as PushProviderReference,
} from './push-core';

// ─── In-app value objects (NotificationPriority/Status aliased) ───────────────
export {
  InAppNotificationId,
  NotificationCategoryEnum,
  NotificationCategory,
  NotificationSeverityEnum,
  NotificationSeverity,
  NotificationPriorityEnum as InAppNotificationPriorityEnum,
  NotificationPriority as InAppNotificationPriority,
  NotificationStatusEnum as InAppNotificationStatusEnum,
  NotificationStatus as InAppNotificationStatus,
  RecipientReference,
  BadgeCount,
  NotificationExpiry,
  NotificationActionProps,
  NotificationAction,
} from './inapp-core';

// ─── Conversation value objects ───────────────────────────────────────────────
export {
  ConversationChannelEnum,
  ConversationChannel,
  PhoneNumber as ConversationPhoneNumber,
  TelegramChatId,
  TemplateId,
  MessageId,
  MessageStatusEnum,
  MessageStatus,
  MediaReferenceProps,
  MediaReference,
  ProviderReferenceProps as ConversationProviderReferenceProps,
  ProviderReference as ConversationProviderReference,
} from './conversation-core';
