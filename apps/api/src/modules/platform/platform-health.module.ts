/**
 * Enterprise Platform Health & Operations Platform Module
 *
 * Registers controllers, domain services, infrastructure repositories, and event publishers for:
 * 1. Service Health Registry & Status Lifecycle
 * 2. Directed Dependency Graphs & Transitive Failure Propagation
 * 3. Heartbeat Monitoring & Missed Heartbeat Timeouts
 * 4. Availability SLA Calculations (99.999% SLA)
 * 5. Maintenance Window Scheduling & Overrides
 * 6. Health Check Aggregation & Operational Dashboards
 */

import { Module } from '@nestjs/common';
import { EnterpriseHealthController } from './presentation/controllers/enterprise-health.controller';
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
  HEALTH_REPOSITORY_TOKEN,
  HEALTH_QUERY_REPOSITORY_TOKEN,
  HEALTH_PROVIDER_TOKEN,
} from './domain/ports/health.ports';
import { InMemoryHealthRepository } from './infrastructure/repositories/in-memory-health.repository';
import { IntegrationModule } from '../integration/integration.module';

@Module({
  imports: [IntegrationModule],
  controllers: [EnterpriseHealthController],
  providers: [
    // Repositories & Providers
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

    // Domain & Application Services
    HealthService,
    DependencyService,
    HeartbeatService,
    AvailabilityService,
    MaintenanceService,
    HealthAggregationService,
    EnterprisePlatformHealthService,
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
  ],
})
export class PlatformHealthModule {}
