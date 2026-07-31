/**
 * Enterprise Connector Platform - Integration Module
 *
 * Registers NestJS controllers, domain services, infrastructure repositories,
 * and hexagonal adapters into the dependency injection container.
 */

import { Module } from '@nestjs/common';
import { EnterpriseConnectorController } from './presentation/controllers/enterprise-connector.controller';
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
import { InMemoryConnectorRepository } from './infrastructure/repositories/in-memory-connector.repository';
import {
  EnterpriseSecretResolverAdapter,
  EnterpriseHealthMonitorAdapter,
  MetadataSignerAdapter,
  NestEventPublisherAdapter,
} from './infrastructure/adapters/connector.adapters';

@Module({
  controllers: [EnterpriseConnectorController],
  providers: [
    // Repositories & Adapters
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

    // Domain & Application Services
    CredentialReferenceService,
    ConfigurationService,
    CapabilityService,
    VersionService,
    HealthService,
    ConnectorRegistryService,
    ConnectorService,
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
  ],
})
export class IntegrationModule {}
