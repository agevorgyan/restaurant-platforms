/**
 * Enterprise Platform Health & Operations Platform - Data Transfer Objects (DTOs)
 *
 * Command and Query request/response DTOs for REST presentation layer validation.
 */

import { CheckType, HealthSeverity, HealthType, ServiceStatus } from '../../domain/enums/health.enums';

export interface DependencyEdgeDto {
  targetServiceId: string;
  targetServiceName: string;
  isCritical?: boolean;
}

export interface RegisterServiceDto {
  serviceName: string;
  healthType: HealthType;
  serviceVersion?: string;
  dependencies?: DependencyEdgeDto[];
  tags?: string[];
}

export interface UpdateServiceStatusDto {
  status: ServiceStatus;
  reason?: string;
}

export interface RegisterDependencyDto {
  targetServiceId: string;
  targetServiceName: string;
  isCritical?: boolean;
}

export interface ScheduleMaintenanceDto {
  scheduledStart: string;
  scheduledEnd: string;
  reason: string;
  affectedServiceIds?: string[];
}

export interface RecordHeartbeatDto {
  serviceId: string;
  sequenceNumber: number;
  metrics?: {
    memoryUsageMb?: number;
    cpuUsagePct?: number;
    activeConnections?: number;
  };
}

export interface ExecuteSyntheticCheckDto {
  serviceId: string;
  checkType: CheckType;
}

export interface HealthCheckResponseDto {
  checkId: string;
  serviceId: string;
  checkType: CheckType;
  status: ServiceStatus;
  severity: HealthSeverity;
  responseTimeMs: number;
  message?: string;
  timestamp: string;
  details?: Record<string, unknown>;
}

export interface ServiceResponseDto {
  id: string;
  tenantId: string;
  serviceName: string;
  serviceVersion: string;
  healthType: HealthType;
  status: ServiceStatus;
  dependencies: DependencyEdgeDto[];
  uptimePercentage: number;
  meetsSla: boolean;
  lastHeartbeatTime?: string;
  tags: string[];
  registeredBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface DependencyGraphResponseDto {
  tenantId?: string;
  nodes: { serviceId: string; serviceName: string; status: ServiceStatus; healthType: HealthType }[];
  edges: { sourceServiceId: string; targetServiceId: string; targetServiceName: string; isCritical: boolean }[];
  hasCycles: boolean;
}

export interface AvailabilityResponseDto {
  serviceId?: string;
  tenantId: string;
  uptimePercentage: number;
  totalDowntimeSeconds: number;
  slaTarget: number;
  meetsSla: boolean;
}

export interface MaintenanceResponseDto {
  windowId: string;
  tenantId: string;
  reason: string;
  scheduledStart: string;
  scheduledEnd: string;
  affectedServiceIds: string[];
  isActive: boolean;
}
