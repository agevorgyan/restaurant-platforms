/**
 * Enterprise Integration Module - Connector, HTTP, Webhook & Transformation Integration
 *
 * Registers NestJS controllers, domain services, infrastructure repositories,
 * and hexagonal adapters into the dependency injection container for:
 * 1. Enterprise Connector Platform
 * 2. Enterprise HTTP & API Integration Platform
 * 3. Enterprise Webhook Platform
 * 4. Enterprise Data Transformation Platform
 */

import { Module } from '@nestjs/common';
import { EnterpriseConnectorController } from './presentation/controllers/enterprise-connector.controller';
import { EnterpriseHttpController } from './presentation/controllers/enterprise-http.controller';
import { EnterpriseWebhookController } from './presentation/controllers/enterprise-webhook.controller';
import {
  EnterpriseTransformationController,
  EnterpriseSchemaController,
} from './presentation/controllers/enterprise-transformation.controller';

// Connector Platform Services & Tokens
import {
  ConnectorService,
  ConfigurationService,
  CapabilityService,
  HealthService,
  VersionService,
  CredentialReferenceService,
  ConnectorRegistryService,
  CONNECTOR_REPOSITORY_TOKEN,
  SECRET_RESOLVER_TOKEN,
  EVENT_PUBLISHER_TOKEN,
  HEALTH_CHECK_PORT_TOKEN,
} from './application/services/connector-platform.services';

// HTTP Platform Services & Tokens
import {
  CorrelationService,
  IdempotencyService,
  RateLimiterService,
  CircuitBreakerService,
  RetryPolicyService,
  HttpClientService,
  GraphQLClientService,
  GrpcClientService,
  HttpIntegrationService,
  HTTP_CLIENT_PORT_TOKEN,
  GRAPHQL_CLIENT_PORT_TOKEN,
  GRPC_CLIENT_PORT_TOKEN,
  CIRCUIT_BREAKER_REPOSITORY_TOKEN,
  IDEMPOTENCY_REPOSITORY_TOKEN,
  REQUEST_HISTORY_REPOSITORY_TOKEN,
} from './application/services/http-platform.services';

// Webhook Platform Services & Tokens
import {
  SignatureVerificationService,
  ReplayProtectionService,
  RoutingService,
  WebhookPublicationService,
  DeadLetterService,
  WebhookPlatformService,
  WEBHOOK_REPOSITORY_TOKEN,
  DEAD_LETTER_REPOSITORY_TOKEN,
  NONCE_STORE_TOKEN,
  WEBHOOK_SECRET_RESOLVER_TOKEN,
  SIGNATURE_VERIFIER_TOKEN,
} from './application/services/webhook-platform.services';

// Transformation Platform Services & Tokens
import {
  SchemaValidationService,
  ExpressionService,
  NormalizationService,
  MappingService,
  TransformationRegistryService,
  TransformationPlatformService,
  TRANSFORMATION_REPOSITORY_TOKEN,
  SCHEMA_REPOSITORY_TOKEN,
  EXPRESSION_ENGINE_TOKEN,
} from './application/services/transformation-platform.services';

// Infrastructure Repositories
import { InMemoryConnectorRepository } from './infrastructure/repositories/in-memory-connector.repository';
import { InMemoryCircuitBreakerRepository } from './infrastructure/repositories/in-memory-circuit-breaker.repository';
import {
  InMemoryRequestHistoryRepository,
  InMemoryIdempotencyRepository,
} from './infrastructure/repositories/in-memory-request-history.repository';
import {
  InMemoryWebhookRepository,
  InMemoryDeadLetterRepository,
  InMemoryNonceStore,
} from './infrastructure/repositories/in-memory-webhook.repository';
import {
  InMemoryTransformationRepository,
  InMemorySchemaRepository,
} from './infrastructure/repositories/in-memory-transformation.repository';

// Infrastructure Adapters
import {
  EnterpriseSecretResolverAdapter,
  EnterpriseHealthMonitorAdapter,
  MetadataSignerAdapter,
  NestEventPublisherAdapter,
} from './infrastructure/adapters/connector.adapters';
import {
  NodeHttpClientAdapter,
  NodeGraphQLClientAdapter,
  NodeGrpcClientAdapter,
} from './infrastructure/adapters/http.adapters';
import {
  HmacSignatureVerifierAdapter,
  EnterpriseWebhookSecretResolverAdapter,
} from './infrastructure/adapters/webhook-verifier.adapters';
import { SafeExpressionEngineAdapter } from './infrastructure/adapters/expression-engine.adapter';

@Module({
  controllers: [
    EnterpriseConnectorController,
    EnterpriseHttpController,
    EnterpriseWebhookController,
    EnterpriseTransformationController,
    EnterpriseSchemaController,
  ],
  providers: [
    // Connector Repositories & Adapters
    {
      provide: CONNECTOR_REPOSITORY_TOKEN,
      useClass: InMemoryConnectorRepository,
    },
    {
      provide: SECRET_RESOLVER_TOKEN,
      useClass: EnterpriseSecretResolverAdapter,
    },
    {
      provide: EVENT_PUBLISHER_TOKEN,
      useClass: NestEventPublisherAdapter,
    },
    {
      provide: HEALTH_CHECK_PORT_TOKEN,
      useClass: EnterpriseHealthMonitorAdapter,
    },
    MetadataSignerAdapter,

    // HTTP Repositories & Adapters
    {
      provide: CIRCUIT_BREAKER_REPOSITORY_TOKEN,
      useClass: InMemoryCircuitBreakerRepository,
    },
    {
      provide: IDEMPOTENCY_REPOSITORY_TOKEN,
      useClass: InMemoryIdempotencyRepository,
    },
    {
      provide: REQUEST_HISTORY_REPOSITORY_TOKEN,
      useClass: InMemoryRequestHistoryRepository,
    },
    {
      provide: HTTP_CLIENT_PORT_TOKEN,
      useClass: NodeHttpClientAdapter,
    },
    {
      provide: GRAPHQL_CLIENT_PORT_TOKEN,
      useClass: NodeGraphQLClientAdapter,
    },
    {
      provide: GRPC_CLIENT_PORT_TOKEN,
      useClass: NodeGrpcClientAdapter,
    },

    // Webhook Repositories & Adapters
    {
      provide: WEBHOOK_REPOSITORY_TOKEN,
      useClass: InMemoryWebhookRepository,
    },
    {
      provide: DEAD_LETTER_REPOSITORY_TOKEN,
      useClass: InMemoryDeadLetterRepository,
    },
    {
      provide: NONCE_STORE_TOKEN,
      useClass: InMemoryNonceStore,
    },
    {
      provide: WEBHOOK_SECRET_RESOLVER_TOKEN,
      useClass: EnterpriseWebhookSecretResolverAdapter,
    },
    {
      provide: SIGNATURE_VERIFIER_TOKEN,
      useClass: HmacSignatureVerifierAdapter,
    },

    // Transformation Repositories & Adapters
    {
      provide: TRANSFORMATION_REPOSITORY_TOKEN,
      useClass: InMemoryTransformationRepository,
    },
    {
      provide: SCHEMA_REPOSITORY_TOKEN,
      useClass: InMemorySchemaRepository,
    },
    {
      provide: EXPRESSION_ENGINE_TOKEN,
      useClass: SafeExpressionEngineAdapter,
    },

    // Connector Platform Domain Services
    CredentialReferenceService,
    ConfigurationService,
    CapabilityService,
    VersionService,
    HealthService,
    ConnectorRegistryService,
    ConnectorService,

    // HTTP Platform Domain Services
    CorrelationService,
    IdempotencyService,
    RateLimiterService,
    CircuitBreakerService,
    RetryPolicyService,
    HttpClientService,
    GraphQLClientService,
    GrpcClientService,
    HttpIntegrationService,

    // Webhook Platform Domain Services
    SignatureVerificationService,
    ReplayProtectionService,
    RoutingService,
    WebhookPublicationService,
    DeadLetterService,
    WebhookPlatformService,

    // Transformation Platform Domain Services
    SchemaValidationService,
    ExpressionService,
    NormalizationService,
    MappingService,
    TransformationRegistryService,
    TransformationPlatformService,
  ],
  exports: [
    ConnectorService,
    ConfigurationService,
    CapabilityService,
    HealthService,
    VersionService,
    CredentialReferenceService,
    ConnectorRegistryService,
    CONNECTOR_REPOSITORY_TOKEN,

    // HTTP Exports
    HttpIntegrationService,
    HttpClientService,
    GraphQLClientService,
    GrpcClientService,
    CircuitBreakerService,
    RateLimiterService,
    IdempotencyService,
    CorrelationService,
    RetryPolicyService,

    // Webhook Exports
    WebhookPlatformService,
    SignatureVerificationService,
    ReplayProtectionService,
    RoutingService,
    DeadLetterService,

    // Transformation Exports
    TransformationPlatformService,
    SchemaValidationService,
    MappingService,
    NormalizationService,
    ExpressionService,
    TransformationRegistryService,
  ],
})
export class IntegrationModule {}
