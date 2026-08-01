/**
 * Enterprise Platform Operations Module
 *
 * Registers controllers, domain services, infrastructure repositories, and event publishers for:
 * 1. Enterprise Platform Health & Operations Platform
 * 2. Enterprise Distributed Configuration Platform
 */

import { Module } from '@nestjs/common';
import { EnterpriseHealthController } from './presentation/controllers/enterprise-health.controller';
import { EnterpriseConfigController } from './presentation/controllers/enterprise-config.controller';
import {
  HealthService,
  DependencyService,
  HeartbeatService,
  AvailabilityService,
  MaintenanceService,
  HealthAggregationService,
  EnterprisePlatformHealthService,
} from './application/services/health-platform.services';
import {
  ValidationService,
  PropagationService,
  EnvironmentService,
  VersionService,
  SnapshotService,
  ConfigurationService,
  EnterpriseDistributedConfigService,
} from './application/services/config-platform.services';
import {
  HEALTH_REPOSITORY_TOKEN,
  HEALTH_QUERY_REPOSITORY_TOKEN,
  HEALTH_PROVIDER_TOKEN,
} from './domain/ports/health.ports';
import {
  CONFIGURATION_REPOSITORY_TOKEN,
  CONFIGURATION_QUERY_REPOSITORY_TOKEN,
  CONFIGURATION_PROVIDER_TOKEN,
} from './domain/ports/config.ports';
import { InMemoryHealthRepository } from './infrastructure/repositories/in-memory-health.repository';
import { InMemoryConfigurationRepository } from './infrastructure/repositories/in-memory-config.repository';
import { IntegrationModule } from '../integration/integration.module';

@Module({
  imports: [IntegrationModule],
  controllers: [EnterpriseHealthController, EnterpriseConfigController],
  providers: [
    // Health Repositories & Providers
    {
      provide: HEALTH_REPOSITORY_TOKEN,
      useClass: InMemoryHealthRepository,
    },
    {
      provide: HEALTH_QUERY_REPOSITORY_TOKEN,
      useClass: InMemoryHealthRepository,
    },
    {
      provide: HEALTH_PROVIDER_TOKEN,
      useClass: InMemoryHealthRepository,
    },

    // Health Services
    HealthService,
    DependencyService,
    HeartbeatService,
    AvailabilityService,
    MaintenanceService,
    HealthAggregationService,
    EnterprisePlatformHealthService,

    // Configuration Repositories & Providers
    {
      provide: CONFIGURATION_REPOSITORY_TOKEN,
      useClass: InMemoryConfigurationRepository,
    },
    {
      provide: CONFIGURATION_QUERY_REPOSITORY_TOKEN,
      useClass: InMemoryConfigurationRepository,
    },
    {
      provide: CONFIGURATION_PROVIDER_TOKEN,
      useClass: InMemoryConfigurationRepository,
    },

    // Configuration Services
    ValidationService,
    PropagationService,
    EnvironmentService,
    VersionService,
    SnapshotService,
    ConfigurationService,
    EnterpriseDistributedConfigService,
  ],
  exports: [
    EnterprisePlatformHealthService,
    HealthService,
    DependencyService,
    HeartbeatService,
    AvailabilityService,
    MaintenanceService,
    HealthAggregationService,
    HEALTH_REPOSITORY_TOKEN,
    HEALTH_QUERY_REPOSITORY_TOKEN,
    HEALTH_PROVIDER_TOKEN,

    EnterpriseDistributedConfigService,
    ConfigurationService,
    ValidationService,
    PropagationService,
    EnvironmentService,
    VersionService,
    SnapshotService,
    CONFIGURATION_REPOSITORY_TOKEN,
    CONFIGURATION_QUERY_REPOSITORY_TOKEN,
    CONFIGURATION_PROVIDER_TOKEN,
  ],
})
export class PlatformHealthModule {}
