/**
 * Enterprise Frontend Architecture Platform - Read Models (CQRS Projections)
 *
 * Strongly-typed read models for Route Catalog, Module Catalog, Navigation History,
 * API statistics, Cache performance, and Frontend Tracing Metrics.
 */

import { ModuleStatus, RouteType } from '../domain/enums/frontend.enums';

export interface RouteSummaryReadModel {
  path: string;
  routeType: RouteType;
  requiredPermissions: string[];
  isDynamic: boolean;
}

export interface RouteCatalogReadModel {
  totalRoutes: number;
  byRouteType: Record<RouteType, number>;
  routes: RouteSummaryReadModel[];
}

export interface ModuleSummaryReadModel {
  moduleId: string;
  moduleName: string;
  version: string;
  status: ModuleStatus;
  targetApplications: string[];
  registeredRoutesCount: number;
}

export interface ModuleCatalogReadModel {
  totalModules: number;
  byStatus: Record<ModuleStatus, number>;
  modules: ModuleSummaryReadModel[];
}

export interface NavigationHistoryEntry {
  path: string;
  timestamp: string;
  referrer?: string;
}

export interface NavigationHistoryReadModel {
  totalNavigations: number;
  history: NavigationHistoryEntry[];
}

export interface ApiStatisticsReadModel {
  totalRequestsExecuted: number;
  successfulRequestsCount: number;
  failedRequestsCount: number;
  averageLatencyMs: number;
  activeCorrelationIdsCount: number;
}

export interface CacheStatisticsReadModel {
  activeQueryKeysCount: number;
  cacheHitRatioPercentage: number;
  offlineCachedItemsCount: number;
  totalMemoryBytes: number;
}

export interface PerformanceMetricsReadModel {
  firstContentfulPaintMs: number;
  largestContentfulPaintMs: number;
  cumulativeLayoutShift: number;
  firstInputDelayMs: number;
  timeToInteractiveMs: number;
}
