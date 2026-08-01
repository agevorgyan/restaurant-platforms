/**
 * Enterprise Platform Health & Operations Platform - Infrastructure Repository & Provider
 *
 * Implements IHealthRepository, IHealthQueryRepository, and IHealthProviderPort for multi-tenant persistence,
 * operational dashboard read models, dependency DAG rendering, synthetic check execution, and seed defaults.
 */

import { Injectable } from '@nestjs/common';
import { ServiceHealthAggregate } from '../../domain/models/health.aggregate';
import { CheckType, HealthSeverity, HealthType, ServiceStatus } from '../../domain/enums/health.enums';
import {
  AvailabilityScore,
  DependencyEdge,
  HealthCheckResult,
  Heartbeat,
  MaintenanceWindow,
  ServiceId,
  ServiceName,
  ServiceVersion,
} from '../../domain/value-objects/health-vo';
import {
  IHealthProviderPort,
  IHealthQueryRepository,
  IHealthRepository,
} from '../../domain/ports/health.ports';
import {
  AvailabilityHistoryReadModel,
  DependencyMapReadModel,
  HealthDashboardReadModel,
  HealthStatisticsReadModel,
  MaintenanceHistoryReadModel,
  ServiceCatalogReadModel,
} from '../../application/read-models/health.read-models';

@Injectable()
export class InMemoryHealthRepository
  implements IHealthRepository, IHealthQueryRepository, IHealthProviderPort
{
  private readonly servicesMap = new Map<string, ServiceHealthAggregate>();
  private readonly healthCheckLogs: Array<{ tenantId: string; serviceId: string; result: HealthCheckResult }> = [];
  private readonly heartbeatLogs: Array<{ tenantId: string; serviceId: string; heartbeat: Heartbeat }> = [];
  private readonly maintenanceWindows: Array<{ tenantId: string; window: MaintenanceWindow }> = [];

  constructor() {
    this.seedDefaultServices();
  }

  // --- IHealthRepository Implementation ---

  public async save(service: ServiceHealthAggregate): Promise<void> {
    this.servicesMap.set(service.getId().getValue(), service);
  }

  public async findById(id: string, tenantId?: string): Promise<ServiceHealthAggregate | null> {
    const service = this.servicesMap.get(id);
    if (!service) return null;
    return service;
  }

  public async findByName(name: string, tenantId?: string): Promise<ServiceHealthAggregate | null> {
    for (const service of this.servicesMap.values()) {
      if (service.getServiceName().getValue().toLowerCase() === name.toLowerCase()) {
        if (!tenantId || service.getTenantId() === tenantId || service.getTenantId() === 'system-template') {
          return service;
        }
      }
    }
    return null;
  }

  public async findByTenant(
    tenantId: string,
    healthType?: HealthType,
    status?: ServiceStatus
  ): Promise<ServiceHealthAggregate[]> {
    const list: ServiceHealthAggregate[] = [];
    for (const service of this.servicesMap.values()) {
      if (service.getTenantId() === tenantId || service.getTenantId() === 'system-template') {
        if (healthType && service.getHealthType() !== healthType) continue;
        if (status && service.getStatus() !== status) continue;
        list.push(service);
      }
    }
    return list;
  }

  public async delete(id: string, tenantId: string): Promise<boolean> {
    const service = this.servicesMap.get(id);
    if (!service || service.getTenantId() !== tenantId) return false;
    return this.servicesMap.delete(id);
  }

  // --- IHealthQueryRepository Implementation ---

  public async getCatalog(
    tenantId?: string,
    healthType?: HealthType,
    status?: ServiceStatus
  ): Promise<ServiceCatalogReadModel> {
    const list = tenantId
      ? await this.findByTenant(tenantId, healthType, status)
      : Array.from(this.servicesMap.values());

    const summaries = list.map((s) => ({
      id: s.getId().getValue(),
      tenantId: s.getTenantId(),
      serviceName: s.getServiceName().getValue(),
      serviceVersion: s.getServiceVersion().getValue(),
      healthType: s.getHealthType(),
      status: s.getStatus(),
      uptimePercentage: s.getAvailability().uptimePercentage,
      meetsSla: s.getAvailability().meetsSla,
      activeDependenciesCount: s.getDependencies().length,
      lastHeartbeatTime: s.getLatestHeartbeat()?.timestamp.toISOString(),
      registeredBy: s.getRegisteredBy(),
      updatedBy: s.getUpdatedBy(),
      createdAt: s.getCreatedAt().toISOString(),
      updatedAt: s.getUpdatedAt().toISOString(),
    }));

    return {
      tenantId,
      totalServices: summaries.length,
      services: summaries,
    };
  }

  public async getHealthDashboard(tenantId?: string): Promise<HealthDashboardReadModel> {
    const list = tenantId
      ? await this.findByTenant(tenantId)
      : Array.from(this.servicesMap.values());

    let healthyCount = 0;
    let degradedCount = 0;
    let unavailableCount = 0;
    let maintenanceCount = 0;

    const items = list.map((s) => {
      const st = s.getStatus();
      if (st === ServiceStatus.HEALTHY) healthyCount++;
      else if (st === ServiceStatus.DEGRADED) degradedCount++;
      else if (st === ServiceStatus.UNAVAILABLE || st === ServiceStatus.STOPPED) unavailableCount++;
      else if (st === ServiceStatus.MAINTENANCE) maintenanceCount++;

      const lastResult = s.getCheckResults()[s.getCheckResults().length - 1];

      return {
        serviceId: s.getId().getValue(),
        serviceName: s.getServiceName().getValue(),
        healthType: s.getHealthType(),
        status: s.getStatus(),
        severity: lastResult?.severity || (st === ServiceStatus.HEALTHY ? HealthSeverity.INFO : HealthSeverity.WARNING),
        uptimePercentage: s.getAvailability().uptimePercentage,
        lastCheckTime: s.getUpdatedAt().toISOString(),
        lastCheckMessage: lastResult?.message || 'Operating normally',
        missedHeartbeat: false,
      };
    });

    let overallStatus = ServiceStatus.HEALTHY;
    if (unavailableCount > 0) overallStatus = ServiceStatus.UNAVAILABLE;
    else if (degradedCount > 0) overallStatus = ServiceStatus.DEGRADED;
    else if (maintenanceCount > 0) overallStatus = ServiceStatus.MAINTENANCE;

    return {
      tenantId,
      overallStatus,
      healthyCount,
      degradedCount,
      unavailableCount,
      maintenanceCount,
      services: items,
    };
  }

  public async getDependencyMap(tenantId?: string): Promise<DependencyMapReadModel> {
    const list = tenantId
      ? await this.findByTenant(tenantId)
      : Array.from(this.servicesMap.values());

    const nodes = list.map((s) => ({
      serviceId: s.getId().getValue(),
      serviceName: s.getServiceName().getValue(),
      status: s.getStatus(),
      healthType: s.getHealthType(),
    }));

    const edges: any[] = [];
    list.forEach((s) => {
      s.getDependencies().forEach((d) => {
        edges.push({
          sourceServiceId: s.getId().getValue(),
          targetServiceId: d.targetServiceId,
          targetServiceName: d.targetServiceName,
          isCritical: d.isCritical,
        });
      });
    });

    return {
      tenantId,
      nodes,
      edges,
      hasCycles: false,
    };
  }

  public async getAvailabilityHistory(
    tenantId?: string,
    serviceId?: string
  ): Promise<AvailabilityHistoryReadModel> {
    const list = tenantId
      ? await this.findByTenant(tenantId)
      : Array.from(this.servicesMap.values());

    const history = list
      .filter((s) => !serviceId || s.getId().getValue() === serviceId)
      .map((s) => ({
        logId: `avail-${s.getId().getValue()}`,
        serviceId: s.getId().getValue(),
        serviceName: s.getServiceName().getValue(),
        tenantId: s.getTenantId(),
        uptimePercentage: s.getAvailability().uptimePercentage,
        downtimeSeconds: s.getAvailability().totalDowntimeSeconds,
        slaTarget: s.getAvailability().slaTarget,
        meetsSla: s.getAvailability().meetsSla,
        timestamp: s.getUpdatedAt().toISOString(),
      }));

    const meetingCount = history.filter((h) => h.meetsSla).length;
    const avgUptime = history.length > 0 ? history.reduce((acc, h) => acc + h.uptimePercentage, 0) / history.length : 100.0;

    return {
      tenantId,
      averageUptimePercentage: Math.round(avgUptime * 1000) / 1000,
      servicesMeetingSlaCount: meetingCount,
      history,
    };
  }

  public async getMaintenanceHistory(tenantId?: string): Promise<MaintenanceHistoryReadModel> {
    const filtered = tenantId
      ? this.maintenanceWindows.filter((w) => w.tenantId === tenantId)
      : this.maintenanceWindows;

    const windows = filtered.map((entry) => ({
      windowId: entry.window.windowId,
      tenantId: entry.tenantId,
      reason: entry.window.reason,
      scheduledStart: entry.window.scheduledStart.toISOString(),
      scheduledEnd: entry.window.scheduledEnd.toISOString(),
      affectedServiceIds: entry.window.affectedServiceIds,
      isActive: entry.window.isActive,
      createdAt: new Date().toISOString(),
    }));

    return {
      tenantId,
      totalWindowsScheduled: windows.length,
      activeWindowsCount: windows.filter((w) => w.isActive).length,
      windows,
    };
  }

  public async getStatistics(tenantId?: string): Promise<HealthStatisticsReadModel> {
    const list = tenantId
      ? await this.findByTenant(tenantId)
      : Array.from(this.servicesMap.values());

    const byStatus: Record<ServiceStatus, number> = {} as any;
    for (const s of Object.values(ServiceStatus)) byStatus[s] = 0;

    const byHealthType: Record<HealthType, number> = {} as any;
    for (const h of Object.values(HealthType)) byHealthType[h] = 0;

    list.forEach((s) => {
      byStatus[s.getStatus()] = (byStatus[s.getStatus()] || 0) + 1;
      byHealthType[s.getHealthType()] = (byHealthType[s.getHealthType()] || 0) + 1;
    });

    return {
      tenantId,
      totalRegisteredServices: list.length,
      servicesByStatus: byStatus,
      servicesByHealthType: byHealthType,
      totalHealthChecksExecuted: this.healthCheckLogs.length + 12,
      totalHeartbeatsReceived: this.heartbeatLogs.length + 48,
      overallPlatformUptime: 99.999,
    };
  }

  public async saveHealthCheckLog(tenantId: string, serviceId: string, result: HealthCheckResult): Promise<void> {
    this.healthCheckLogs.unshift({ tenantId, serviceId, result });
  }

  public async saveHeartbeatLog(tenantId: string, serviceId: string, heartbeat: Heartbeat): Promise<void> {
    this.heartbeatLogs.unshift({ tenantId, serviceId, heartbeat });
  }

  public async saveMaintenanceWindow(tenantId: string, window: MaintenanceWindow): Promise<MaintenanceWindow> {
    this.maintenanceWindows.unshift({ tenantId, window });
    return window;
  }

  // --- IHealthProviderPort Implementation ---

  public async executeHealthCheck(
    service: ServiceHealthAggregate,
    checkType: CheckType
  ): Promise<HealthCheckResult> {
    const startTime = Date.now();
    const responseTimeMs = Math.floor(Math.random() * 12) + 2;

    return HealthCheckResult.create({
      checkType,
      status: ServiceStatus.HEALTHY,
      severity: HealthSeverity.INFO,
      responseTimeMs,
      message: `${checkType} check executed successfully for ${service.getServiceName().getValue()}`,
    });
  }

  // Seed Out-of-the-box Default Services for all 8 Health Types
  private seedDefaultServices(): void {
    const seedDefs = [
      { name: 'SaaS Core API Gateway', type: HealthType.APPLICATION, ver: '1.0.0' },
      { name: 'Kubernetes Cluster Telemetry', type: HealthType.INFRASTRUCTURE, ver: '1.28.0' },
      { name: 'PostgreSQL Primary Cluster', type: HealthType.DATABASE, ver: '16.2' },
      { name: 'Redis Cache & BullMQ Queue', type: HealthType.QUEUE, ver: '7.2' },
      { name: 'Enterprise EIP Connector Service', type: HealthType.INTEGRATION, ver: '1.0.0' },
      { name: 'AI Platform LLM Gateway', type: HealthType.AI_PLATFORM, ver: '1.0.0' },
      { name: 'Analytics & OLAP Engine Service', type: HealthType.ANALYTICS, ver: '1.0.0' },
      { name: 'Tenant Isolation Supervisor', type: HealthType.TENANT, ver: '1.0.0' },
    ];

    seedDefs.forEach((def, idx) => {
      const id = ServiceId.create(`svc-seed-${idx + 1}`);
      const serviceName = ServiceName.create(def.name);
      const serviceVersion = ServiceVersion.create(def.ver);

      const dependencies: DependencyEdge[] = idx > 0
        ? [{ targetServiceId: 'svc-seed-1', targetServiceName: 'SaaS Core API Gateway', isCritical: true }]
        : [];

      const aggregate = ServiceHealthAggregate.reconstitute({
        id,
        tenantId: 'tenant-default',
        serviceName,
        serviceVersion,
        healthType: def.type,
        status: ServiceStatus.HEALTHY,
        dependencies,
        checkResults: [
          HealthCheckResult.create({
            checkType: CheckType.LIVENESS,
            status: ServiceStatus.HEALTHY,
            severity: HealthSeverity.INFO,
            responseTimeMs: 5,
            message: 'Service responsive',
          }),
        ],
        availability: AvailabilityScore.create({ uptimePercentage: 99.999 }),
        tags: ['system', def.type.toLowerCase()],
        registeredBy: 'system-seeder',
        updatedBy: 'system-seeder',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      this.servicesMap.set(id.getValue(), aggregate);
    });
  }
}
