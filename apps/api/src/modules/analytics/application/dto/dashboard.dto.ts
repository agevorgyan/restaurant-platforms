/**
 * Enterprise Dashboard Platform - Data Transfer Objects (DTOs)
 *
 * Command and Query request/response DTOs for REST presentation layer validation.
 */

import { DashboardType, LayoutType, RefreshStrategy, WidgetType } from '../../domain/enums/dashboard.enums';
import { BiQueryBinding, KpiBinding } from '../../domain/value-objects/dashboard-vo';

export interface WidgetPositionDto {
  x: number;
  y: number;
  zIndex?: number;
}

export interface WidgetSizeDto {
  width: number;
  height: number;
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
}

export interface RefreshPolicyDto {
  strategy: RefreshStrategy;
  intervalSeconds?: number;
  eventTriggers?: string[];
  realtimeTopic?: string;
}

export interface DashboardFilterDto {
  filterId?: string;
  name: string;
  field: string;
  targetWidgetIds?: string[];
  filterType: 'SELECT' | 'DATE_RANGE' | 'MULTI_SELECT' | 'TEXT' | 'NUMERIC_RANGE';
  defaultValue?: unknown;
  options?: string[];
}

export interface DashboardLayoutDto {
  layoutType: LayoutType;
  columns?: number;
  rowHeightPx?: number;
  gapPx?: number;
  responsiveBreakpoints?: Record<string, number>;
}

export interface DashboardThemeDto {
  mode?: 'LIGHT' | 'DARK' | 'SYSTEM';
  colorScheme?: string;
  primaryColor?: string;
  cardStyle?: 'DEFAULT' | 'BORDERED' | 'GLASS' | 'MINIMAL';
  fontFamily?: string;
}

export interface AddWidgetDto {
  type: WidgetType;
  title: string;
  subtitle?: string;
  position: WidgetPositionDto;
  size: WidgetSizeDto;
  refreshPolicy?: RefreshPolicyDto;
  biQueryBinding?: BiQueryBinding;
  kpiBinding?: KpiBinding;
  requiredRoles?: string[];
  customProps?: Record<string, unknown>;
}

export interface UpdateWidgetDto {
  title?: string;
  subtitle?: string;
  position?: WidgetPositionDto;
  size?: WidgetSizeDto;
  refreshPolicy?: RefreshPolicyDto;
  biQueryBinding?: BiQueryBinding;
  kpiBinding?: KpiBinding;
  requiredRoles?: string[];
  customProps?: Record<string, unknown>;
}

export interface CreateDashboardDto {
  name: string;
  description?: string;
  dashboardType: DashboardType;
  layout?: DashboardLayoutDto;
  theme?: DashboardThemeDto;
  widgets?: AddWidgetDto[];
  filters?: DashboardFilterDto[];
  tags?: string[];
  templateId?: string;
}

export interface UpdateDashboardDto {
  name?: string;
  description?: string;
  layout?: DashboardLayoutDto;
  theme?: DashboardThemeDto;
  filters?: DashboardFilterDto[];
  tags?: string[];
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
}

export interface RefreshDashboardDto {
  strategy?: RefreshStrategy;
  widgetIds?: string[];
}

export interface ApplyFilterDto {
  filterId: string;
  value: unknown;
}

export interface SavePersonalizationDto {
  hiddenWidgetIds?: string[];
  widgetOrderOverride?: string[];
  filterOverrides?: Record<string, unknown>;
  customThemeOverride?: {
    mode?: 'LIGHT' | 'DARK' | 'SYSTEM';
    primaryColor?: string;
    cardStyle?: 'DEFAULT' | 'BORDERED' | 'GLASS' | 'MINIMAL';
  };
}

export interface WidgetResponseDto {
  widgetId: string;
  type: WidgetType;
  title: string;
  subtitle?: string;
  position: WidgetPositionDto;
  size: WidgetSizeDto;
  refreshPolicy: RefreshPolicyDto;
  biQueryBinding?: BiQueryBinding;
  kpiBinding?: KpiBinding;
  requiredRoles: string[];
  customProps: Record<string, unknown>;
}

export interface DashboardResponseDto {
  id: string;
  tenantId: string;
  name: string;
  description?: string;
  dashboardType: DashboardType;
  status: string;
  version: string;
  layout: DashboardLayoutDto;
  theme: DashboardThemeDto;
  widgets: WidgetResponseDto[];
  filters: DashboardFilterDto[];
  tags: string[];
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardRefreshResponseDto {
  dashboardId: string;
  tenantId: string;
  refreshedAt: string;
  strategy: RefreshStrategy;
  executionLatencyMs: number;
  refreshedWidgetCount: number;
  status: 'SUCCESS' | 'FAILED';
}
