/**
 * Enterprise Integration Module - Connector & HTTP Platform Integration
 *
 * Registers NestJS controllers, domain services, infrastructure repositories,
 * and hexagonal adapters into the dependency injection container for both
 * Enterprise Connector Platform and Enterprise HTTP & API Integration Platform.
 */

import { Module } from '@nestjs/common';
import { EnterpriseConnectorController } from './presentation/controllers/enterprise-connector.controller';
import { EnterpriseHttpController } from './presentation/controllers/enterprise-http.controller';

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

// Infrastructure Repositories
import { InMemoryConnectorRepository } from './infrastructure/repositories/in-memory-connector.repository';
import { InMemoryCircuitBreakerRepository } from './infrastructure/repositories/in-memory-circuit-breaker.repository';
import {
  InMemoryRequestHistoryRepository,
  InMemoryIdempotencyRepository,
} from './infrastructure/repositories/in-memory-request-history.repository';

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

@Module({
  controllers: [
    EnterpriseConnectorController,
    EnterpriseHttpController,
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
  ],
})
export class IntegrationModule {}
