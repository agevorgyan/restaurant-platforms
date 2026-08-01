/**
 * Enterprise Platform Health & Operations Platform - Domain Ports (Interfaces)
 *
 * Hexagonal architecture ports for persistence, query projections, maintenance scheduling,
 * and pluggable health check providers.
 */

import { ServiceHealthAggregate } from '../models/health.aggregate';
import { CheckType, HealthType, ServiceStatus } from '../enums/health.enums';
import { HealthCheckResult, Heartbeat, MaintenanceWindow } from '../value-objects/health-vo';
import {
  AvailabilityHistoryReadModel,
  DependencyMapReadModel,
  HealthDashboardReadModel,
  HealthStatisticsReadModel,
  MaintenanceHistoryReadModel,
  ServiceCatalogReadModel,
} from '../../application/read-models/health.read-models';

export const HEALTH_REPOSITORY_TOKEN = Symbol('IHealthRepository');
export const HEALTH_QUERY_REPOSITORY_TOKEN = Symbol('IHealthQueryRepository');
export const HEALTH_PROVIDER_TOKEN = Symbol('IHealthProviderPort');

export interface IHealthRepository {
  save(service: ServiceHealthAggregate): Promise<void>;
  findById(id: string, tenantId?: string): Promise<ServiceHealthAggregate | null>;
  findByName(name: string, tenantId?: string): Promise<ServiceHealthAggregate | null>;
  findByTenant(
    tenantId: string,
    healthType?: HealthType,
    status?: ServiceStatus
  ): Promise<ServiceHealthAggregate[]>;
  delete(id: string, tenantId: string): Promise<boolean>;
}

export interface IHealthQueryRepository {
  getCatalog(
    tenantId?: string,
    healthType?: HealthType,
    status?: ServiceStatus
  ): Promise<ServiceCatalogReadModel>;

  getHealthDashboard(tenantId?: string): Promise<HealthDashboardReadModel>;

  getDependencyMap(tenantId?: string): Promise<DependencyMapReadModel>;

  getAvailabilityHistory(tenantId?: string, serviceId?: string): Promise<AvailabilityHistoryReadModel>;

  getMaintenanceHistory(tenantId?: string): Promise<MaintenanceHistoryReadModel>;

  getStatistics(tenantId?: string): Promise<HealthStatisticsReadModel>;

  saveHealthCheckLog(tenantId: string, serviceId: string, result: HealthCheckResult): Promise<void>;

  saveHeartbeatLog(tenantId: string, serviceId: string, heartbeat: Heartbeat): Promise<void>;

  saveMaintenanceWindow(tenantId: string, window: MaintenanceWindow): Promise<MaintenanceWindow>;
}

export interface IHealthProviderPort {
  executeHealthCheck(
    service: ServiceHealthAggregate,
    checkType: CheckType
  ): Promise<HealthCheckResult>;
}
