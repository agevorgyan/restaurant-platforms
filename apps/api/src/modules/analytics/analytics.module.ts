/**
 * Enterprise Analytics Foundation, KPI Platform & BI Platform Module
 *
 * Registers controllers, domain services, infrastructure repositories,
 * and event publishers into NestJS DI container.
 */

import { Module } from '@nestjs/common';
import { EnterpriseAnalyticsController } from './presentation/controllers/enterprise-analytics.controller';
import { EnterpriseKpiController } from './presentation/controllers/enterprise-kpi.controller';
import { EnterpriseBiController } from './presentation/controllers/enterprise-bi.controller';
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
import {
  SemanticModelService,
  CubeService,
  AnalyticalQueryService,
  DrillService,
  BiAggregationService,
  BiDimensionService,
  EnterpriseBiPlatformService,
  BI_REPOSITORY_TOKEN,
  OLAP_ENGINE_TOKEN,
} from './application/services/bi-platform.services';
import { InMemoryAnalyticsRepository } from './infrastructure/repositories/in-memory-analytics.repository';
import { InMemoryKpiRepository } from './infrastructure/repositories/in-memory-kpi.repository';
import { InMemoryBiRepository } from './infrastructure/repositories/in-memory-bi.repository';
import { IntegrationModule } from '../integration/integration.module';

@Module({
  imports: [IntegrationModule],
  controllers: [
    EnterpriseAnalyticsController,
    EnterpriseKpiController,
    EnterpriseBiController,
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
    // BI Platform Repositories & Pluggable OLAP Engine
    {
      provide: BI_REPOSITORY_TOKEN,
      useClass: InMemoryBiRepository,
    },
    {
      provide: OLAP_ENGINE_TOKEN,
      useClass: InMemoryBiRepository,
    },
    // Analytics & KPI Services
    MetricCollectionService,
    AggregationService,
    EnterpriseAnalyticsFoundationService,
    FormulaService,
    ScorecardService,
    EnterpriseKpiPlatformService,
    // BI Platform Services
    SemanticModelService,
    CubeService,
    AnalyticalQueryService,
    DrillService,
    BiAggregationService,
    BiDimensionService,
    EnterpriseBiPlatformService,
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
    EnterpriseBiPlatformService,
    SemanticModelService,
    CubeService,
    AnalyticalQueryService,
    DrillService,
    BiAggregationService,
    BiDimensionService,
    BI_REPOSITORY_TOKEN,
    OLAP_ENGINE_TOKEN,
  ],
})
export class AnalyticsModule {}

