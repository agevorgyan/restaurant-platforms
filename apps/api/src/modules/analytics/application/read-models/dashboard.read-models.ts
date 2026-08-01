/**
 * Enterprise Dashboard Platform - Application Read Models (CQRS Queries)
 *
 * Strongly-typed read projections optimized for UI layout rendering, catalog browsing,
 * usage tracking, refresh audit history, and personalization profiles.
 */

import { DashboardStatus, DashboardType, LayoutType, RefreshStrategy, WidgetType } from '../../domain/enums/dashboard.enums';

export interface DashboardSummaryReadModel {
  id: string;
  tenantId: string;
  name: string;
  description?: string;
  dashboardType: DashboardType;
  status: DashboardStatus;
  version: string;
  layoutType: LayoutType;
  widgetCount: number;
  tags: string[];
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardCatalogReadModel {
  tenantId?: string;
  totalDashboards: number;
  dashboards: DashboardSummaryReadModel[];
}

export interface WidgetSummaryReadModel {
  widgetId: string;
  type: WidgetType;
  title: string;
  subtitle?: string;
  columns: number;
  height: number;
  refreshStrategy: RefreshStrategy;
  hasBiBinding: boolean;
  hasKpiBinding: boolean;
  requiredRoles: string[];
}

export interface WidgetCatalogReadModel {
  tenantId?: string;
  totalWidgets: number;
  widgets: WidgetSummaryReadModel[];
}

export interface DashboardUsageItem {
  dashboardId: string;
  dashboardName: string;
  dashboardType: DashboardType;
  totalViews: number;
  totalRefreshes: number;
  avgLoadLatencyMs: number;
  lastViewedAt?: string;
}

export interface DashboardUsageReadModel {
  tenantId?: string;
  totalViewsAllDashboards: number;
  totalRefreshesAllDashboards: number;
  usageByDashboard: DashboardUsageItem[];
}

export interface RefreshLogEntry {
  refreshId: string;
  dashboardId: string;
  tenantId: string;
  strategy: RefreshStrategy;
  latencyMs: number;
  widgetCountRefreshed: number;
  status: 'SUCCESS' | 'FAILED' | 'TIMEOUT';
  timestamp: string;
}

export interface RefreshHistoryReadModel {
  tenantId?: string;
  totalRefreshExecutions: number;
  avgRefreshLatencyMs: number;
  history: RefreshLogEntry[];
}

export interface DashboardStatisticsReadModel {
  tenantId?: string;
  totalDashboards: number;
  publishedDashboards: number;
  draftDashboards: number;
  archivedDashboards: number;
  dashboardsByType: Record<DashboardType, number>;
  totalWidgetsDeployed: number;
}

export interface UserDashboardPersonalization {
  personalizationId: string;
  tenantId: string;
  userId: string;
  dashboardId: string;
  hiddenWidgetIds: string[];
  widgetOrderOverride?: string[];
  filterOverrides?: Record<string, unknown>;
  customThemeOverride?: {
    mode?: 'LIGHT' | 'DARK' | 'SYSTEM';
    primaryColor?: string;
    cardStyle?: 'DEFAULT' | 'BORDERED' | 'GLASS' | 'MINIMAL';
  };
  updatedAt: string;
}

export interface PersonalizationProfilesReadModel {
  tenantId: string;
  userId: string;
  personalizations: UserDashboardPersonalization[];
}
