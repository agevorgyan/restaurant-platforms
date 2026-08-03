// ─── Gateway services ────────────────────────────────────────────────────────
export {
  AuthenticationService,
  AuthorizationService,
  RateLimitingService,
  RequestValidationService,
  ResponseTransformationService,
  RoutingService,
} from './gateway.service';

// ─── Event bus services ───────────────────────────────────────────────────────
export {
  SchemaRegistryService,
  SubscriptionRegistry,
  EventPublisher,
  RetryService,
  DeadLetterService,
  EventReplayService,
  EventDispatcher,
} from './event-bus.service';

// ─── Webhook service (base) ───────────────────────────────────────────────────
export * from './webhook.service';

// ─── Connector service ────────────────────────────────────────────────────────
export {
  CredentialManagementService,
  ConnectorHealthService,
  SchemaTransformationService,
  ConnectorLoader,
  ConnectorFactory,
} from './connector.service';

// ─── Connector platform services ─────────────────────────────────────────────
export {
  CredentialReferenceService,
  ConfigurationService,
  CapabilityService,
  VersionService,
  HealthService,
  ConnectorRegistryService,
  ConnectorService,
} from './connector-platform.services';

// ─── HTTP platform services ───────────────────────────────────────────────────
export {
  CorrelationService,
  IdempotencyService,
  RateLimiterService,
  CircuitBreakerService,
  RetryPolicyService,
  HttpClientService,
  GraphQLClientService,
  GrpcClientService,
  HttpIntegrationService,
} from './http-platform.services';

// ─── Webhook platform services ────────────────────────────────────────────────
export {
  SignatureVerificationService,
  ReplayProtectionService,
  WebhookPublicationService,
  DeadLetterService as WebhookDeadLetterService,
  WebhookPlatformService,
} from './webhook-platform.services';

// Note: WebhookRoutingService is available as WebhookPlatformService above;
// RoutingService from webhook-platform is excluded to avoid conflict with gateway.

// ─── Transformation platform services ────────────────────────────────────────
export {
  SchemaValidationService,
  ExpressionService,
  NormalizationService,
  MappingService,
  VersionService as TransformationVersionService,
  TransformationRegistryService,
  TransformationPlatformService,
} from './transformation-platform.services';

// ─── Bridge platform services ─────────────────────────────────────────────────
export {
  TranslationService,
  PublicationService,
  IntegrationBridgePlatformService,
} from './bridge-platform.services';

// Note: CorrelationService, RoutingService, DeadLetterService from bridge-platform
// are excluded to avoid conflict with HTTP/gateway/event-bus versions already exported.

// ─── Catalog, workflow, identity, developer ───────────────────────────────────
export * from './catalog-platform.services';
export * from './workflow.service';
export * from './identity.service';
export * from './developer.service';
