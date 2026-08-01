/**
 * Enterprise Platform Health & Operations Platform - Read Models (CQRS Queries)
 *
 * Strongly-typed read projections optimized for operational health dashboards, dependency graph visualization,
 * availability SLA historical tracking, maintenance history, and overall platform health statistics.
 */

import { CheckType, HealthSeverity, HealthType, ServiceStatus } from '../../domain/enums/health.enums';

export interface ServiceSummaryReadModel {
  id: string;
  tenantId: string;
  serviceName: string;
  serviceVersion: string;
  healthType: HealthType;
  status: ServiceStatus;
  uptimePercentage: number;
  meetsSla: boolean;
  activeDependenciesCount: number;
  lastHeartbeatTime?: string;
  registeredBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceCatalogReadModel {
  tenantId?: string;
  totalServices: number;
  services: ServiceSummaryReadModel[];
}

export interface HealthDashboardItem {
  serviceId: string;
  serviceName: string;
  healthType: HealthType;
  status: ServiceStatus;
  severity: HealthSeverity;
  uptimePercentage: number;
  lastCheckTime: string;
  lastCheckMessage?: string;
  missedHeartbeat: boolean;
}

export interface HealthDashboardReadModel {
  tenantId?: string;
  overallStatus: ServiceStatus;
  healthyCount: number;
  degradedCount: number;
  unavailableCount: number;
  maintenanceCount: number;
  services: HealthDashboardItem[];
}

export interface DependencyNodeReadModel {
  serviceId: string;
  serviceName: string;
  status: ServiceStatus;
  healthType: HealthType;
}

export interface DependencyEdgeReadModel {
  sourceServiceId: string;
  targetServiceId: string;
  targetServiceName: string;
  isCritical: boolean;
}

export interface DependencyMapReadModel {
  tenantId?: string;
  nodes: DependencyNodeReadModel[];
  edges: DependencyEdgeReadModel[];
  hasCycles: boolean;
}

export interface AvailabilityLogEntry {
  logId: string;
  serviceId: string;
  serviceName: string;
  tenantId: string;
  uptimePercentage: number;
  downtimeSeconds: number;
  slaTarget: number;
  meetsSla: boolean;
  timestamp: string;
}

export interface AvailabilityHistoryReadModel {
  tenantId?: string;
  averageUptimePercentage: number;
  servicesMeetingSlaCount: number;
  history: AvailabilityLogEntry[];
}

export interface MaintenanceLogEntry {
  windowId: string;
  tenantId: string;
  reason: string;
  scheduledStart: string;
  scheduledEnd: string;
  affectedServiceIds: string[];
  isActive: boolean;
  createdAt: string;
}

export interface MaintenanceHistoryReadModel {
  tenantId?: string;
  totalWindowsScheduled: number;
  activeWindowsCount: number;
  windows: MaintenanceLogEntry[];
}

export interface HealthStatisticsReadModel {
  tenantId?: string;
  totalRegisteredServices: number;
  servicesByStatus: Record<ServiceStatus, number>;
  servicesByHealthType: Record<HealthType, number>;
  totalHealthChecksExecuted: number;
  totalHeartbeatsReceived: number;
  overallPlatformUptime: number;
}
