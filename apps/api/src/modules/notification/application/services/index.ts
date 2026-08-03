// ─── Core notification services ───────────────────────────────────────────────
export {
  NotificationPreferenceService,
  TemplateRenderingService,
  ChannelSelectionService,
  RetryService,
  NotificationScheduler,
  DeliveryTrackingService,
  NotificationDispatcher,
} from './notification.service';

// ─── Email services ───────────────────────────────────────────────────────────
export {
  IEmailProvider,
  MockSesProvider,
  MockSendGridProvider,
  ProviderHealthService,
  EmailProviderRegistry,
  EmailTemplateRenderer,
  EmailTrackingService,
  BounceProcessingService,
  EmailDeliveryService,
} from './email.service';

// ─── SMS services ─────────────────────────────────────────────────────────────
export {
  ISmsGateway,
  MockTwilioGateway,
  MockVonageGateway,
  PhoneNumberValidationService,
  GatewayHealthService,
  SmsGatewayRegistry,
  SmsTrackingService,
  DeliveryReceiptService,
  SmsDeliveryService,
} from './sms.service';

// ─── Push services ────────────────────────────────────────────────────────────
export {
  IPushProvider,
  MockFcmProvider,
  MockApnsProvider,
  TokenValidationService,
  DeviceRegistrationService,
  ProviderHealthService as PushProviderHealthService,
  PushProviderRegistry,
  PushTrackingService,
  PushDeliveryService,
} from './push.service';

// ─── In-app services ──────────────────────────────────────────────────────────
export {
  NotificationPreferenceService as InAppNotificationPreferenceService,
  NotificationFeedService,
  NotificationReadService,
  BadgeCounterService,
  RealTimeDeliveryService,
  NotificationCleanupService,
  InAppDeliveryService,
} from './inapp.service';

// ─── Conversation services ────────────────────────────────────────────────────
export {
  IConversationProvider,
  MockWhatsAppProvider,
  MockTelegramProvider,
  ProviderHealthService as ConversationProviderHealthService,
  ProviderRegistry,
  ConversationDeliveryService,
  WebhookReceiver,
} from './conversation.service';
