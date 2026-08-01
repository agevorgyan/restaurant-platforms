/**
 * Enterprise Analytics Foundation & KPI Platform Module
 *
 * Registers controllers, domain services, infrastructure repositories,
 * and event publishers into NestJS DI container.
 */

import { Module } from '@nestjs/common';
import { EnterpriseAnalyticsController } from './presentation/controllers/enterprise-analytics.controller';
import { EnterpriseKpiController } from './presentation/controllers/enterprise-kpi.controller';
import {
  MetricCollectionService,
  AggregationService,
  EnterpriseAnalyticsFoundationService,
  ANALYTICS_REPOSITORY_TOKEN,
} from './application/services/analytics-foundation.services';
import {
  FormulaService,
  ScorecardService,
  EnterpriseKpiPlatformService,
  KPI_REPOSITORY_TOKEN,
} from './application/services/kpi-platform.services';
import { InMemoryAnalyticsRepository } from './infrastructure/repositories/in-memory-analytics.repository';
import { InMemoryKpiRepository } from './infrastructure/repositories/in-memory-kpi.repository';
import { IntegrationModule } from '../integration/integration.module';

@Module({
  imports: [IntegrationModule],
  controllers: [
    EnterpriseAnalyticsController,
    EnterpriseKpiController,
  ],
  providers: [
    // Analytics Foundation Repositories
    {
      provide: ANALYTICS_REPOSITORY_TOKEN,
      useClass: InMemoryAnalyticsRepository,
    },
    // KPI Platform Repositories
    {
      provide: KPI_REPOSITORY_TOKEN,
      useClass: InMemoryKpiRepository,
    },
    // Services
    MetricCollectionService,
    AggregationService,
    EnterpriseAnalyticsFoundationService,
    FormulaService,
    ScorecardService,
    EnterpriseKpiPlatformService,
  ],
  exports: [
    EnterpriseAnalyticsFoundationService,
    MetricCollectionService,
    AggregationService,
    ANALYTICS_REPOSITORY_TOKEN,
    EnterpriseKpiPlatformService,
    FormulaService,
    ScorecardService,
    KPI_REPOSITORY_TOKEN,
  ],
})
export class AnalyticsModule {}
