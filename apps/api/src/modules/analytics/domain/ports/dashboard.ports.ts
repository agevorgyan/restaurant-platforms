/**
 * Enterprise Dashboard Platform - Domain Ports (Interfaces)
 *
 * Hexagonal architecture ports for persistence, query projections, personalization storage,
 * and read-model generation.
 */

import { DashboardAggregate } from '../models/dashboard.aggregate';
import { DashboardStatus, DashboardType } from '../enums/dashboard.enums';
import {
  DashboardCatalogReadModel,
  WidgetCatalogReadModel,
  DashboardUsageReadModel,
  RefreshHistoryReadModel,
  DashboardStatisticsReadModel,
  PersonalizationProfilesReadModel,
  UserDashboardPersonalization,
} from '../../application/read-models/dashboard.read-models';

export const DASHBOARD_REPOSITORY_TOKEN = Symbol('IDashboardRepository');
export const DASHBOARD_QUERY_REPOSITORY_TOKEN = Symbol('IDashboardQueryRepository');

export interface IDashboardRepository {
  save(dashboard: DashboardAggregate): Promise<void>;
  findById(id: string, tenantId?: string): Promise<DashboardAggregate | null>;
  findByTenant(
    tenantId: string,
    type?: DashboardType,
    status?: DashboardStatus
  ): Promise<DashboardAggregate[]>;
  delete(id: string, tenantId: string): Promise<boolean>;
}

export interface IDashboardQueryRepository {
  getCatalog(
    tenantId?: string,
    type?: DashboardType,
    status?: DashboardStatus
  ): Promise<DashboardCatalogReadModel>;

  getWidgetCatalog(tenantId?: string, widgetType?: string): Promise<WidgetCatalogReadModel>;

  getDashboardUsage(tenantId?: string, dashboardId?: string): Promise<DashboardUsageReadModel>;

  getRefreshHistory(tenantId?: string, limit?: number): Promise<RefreshHistoryReadModel>;

  getStatistics(tenantId?: string): Promise<DashboardStatisticsReadModel>;

  getPersonalization(
    tenantId: string,
    userId: string,
    dashboardId: string
  ): Promise<UserDashboardPersonalization | null>;

  getUserPersonalizationProfiles(
    tenantId: string,
    userId: string
  ): Promise<PersonalizationProfilesReadModel>;

  savePersonalization(
    personalization: UserDashboardPersonalization
  ): Promise<UserDashboardPersonalization>;

  recordRefreshLog(entry: {
    refreshId: string;
    dashboardId: string;
    tenantId: string;
    strategy: any;
    latencyMs: number;
    widgetCountRefreshed: number;
    status: 'SUCCESS' | 'FAILED' | 'TIMEOUT';
    timestamp: string;
  }): Promise<void>;
}
