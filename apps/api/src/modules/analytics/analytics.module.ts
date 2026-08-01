/**
 * Enterprise Analytics Platform Module
 *
 * Registers controllers, domain services, infrastructure repositories, and event publishers for:
 * 1. Enterprise Analytics Foundation
 * 2. Enterprise KPI Platform
 * 3. Enterprise Business Intelligence (BI) Platform
 * 4. Enterprise Dashboard Platform
 */

import { Module } from '@nestjs/common';
import { EnterpriseAnalyticsController } from './presentation/controllers/enterprise-analytics.controller';
import { EnterpriseKpiController } from './presentation/controllers/enterprise-kpi.controller';
import { EnterpriseBiController } from './presentation/controllers/enterprise-bi.controller';
import { EnterpriseDashboardController } from './presentation/controllers/enterprise-dashboard.controller';

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

import {
  DashboardService,
  WidgetService,
  LayoutService,
  PersonalizationService,
  RefreshService,
  PermissionService,
  EnterpriseDashboardPlatformService,
} from './application/services/dashboard-platform.services';
import {
  DASHBOARD_REPOSITORY_TOKEN,
  DASHBOARD_QUERY_REPOSITORY_TOKEN,
} from './domain/ports/dashboard.ports';

import { InMemoryAnalyticsRepository } from './infrastructure/repositories/in-memory-analytics.repository';
import { InMemoryKpiRepository } from './infrastructure/repositories/in-memory-kpi.repository';
import { InMemoryBiRepository } from './infrastructure/repositories/in-memory-bi.repository';
import { InMemoryDashboardRepository } from './infrastructure/repositories/in-memory-dashboard.repository';
import { IntegrationModule } from '../integration/integration.module';

@Module({
  imports: [IntegrationModule],
  controllers: [
    EnterpriseAnalyticsController,
    EnterpriseKpiController,
    EnterpriseBiController,
    EnterpriseDashboardController,
  ],
  providers: [
    // Repositories & Tokens
    {
      provide: ANALYTICS_REPOSITORY_TOKEN,
      useClass: InMemoryAnalyticsRepository,
    },
    {
      provide: KPI_REPOSITORY_TOKEN,
      useClass: InMemoryKpiRepository,
    },
    {
      provide: BI_REPOSITORY_TOKEN,
      useClass: InMemoryBiRepository,
    },
    {
      provide: OLAP_ENGINE_TOKEN,
      useClass: InMemoryBiRepository,
    },
    {
      provide: DASHBOARD_REPOSITORY_TOKEN,
      useClass: InMemoryDashboardRepository,
    },
    {
      provide: DASHBOARD_QUERY_REPOSITORY_TOKEN,
      useClass: InMemoryDashboardRepository,
    },

    // Analytics Foundation Services
    MetricCollectionService,
    AggregationService,
    EnterpriseAnalyticsFoundationService,

    // KPI Platform Services
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

    // Dashboard Platform Services
    DashboardService,
    WidgetService,
    LayoutService,
    PersonalizationService,
    RefreshService,
    PermissionService,
    EnterpriseDashboardPlatformService,
  ],
  exports: [
    // Foundation Exports
    EnterpriseAnalyticsFoundationService,
    MetricCollectionService,
    AggregationService,
    ANALYTICS_REPOSITORY_TOKEN,

    // KPI Exports
    EnterpriseKpiPlatformService,
    FormulaService,
    ScorecardService,
    KPI_REPOSITORY_TOKEN,

    // BI Exports
    EnterpriseBiPlatformService,
    SemanticModelService,
    CubeService,
    AnalyticalQueryService,
    DrillService,
    BiAggregationService,
    BiDimensionService,
    BI_REPOSITORY_TOKEN,
    OLAP_ENGINE_TOKEN,

    // Dashboard Exports
    EnterpriseDashboardPlatformService,
    DashboardService,
    WidgetService,
    LayoutService,
    PersonalizationService,
    RefreshService,
    PermissionService,
    DASHBOARD_REPOSITORY_TOKEN,
    DASHBOARD_QUERY_REPOSITORY_TOKEN,
  ],
})
export class AnalyticsModule {}
