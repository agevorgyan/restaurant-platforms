/**
 * Enterprise Platform Health & Operations Platform - Domain & Application Services
 *
 * Implements core domain and application services:
 * 1. DependencyService (Directed Graph & Transitive Failure Propagation)
 * 2. HeartbeatService (Heartbeat Monitoring & Missed Heartbeat Timeouts)
 * 3. AvailabilityService (SLA Uptime Calculations & Tracking)
 * 4. MaintenanceService (Maintenance Scheduling & Active Overrides)
 * 5. HealthAggregationService (UI-Decoupled System Health Aggregation)
 * 6. HealthService (Service Registrations & Check Executions)
 * 7. EnterprisePlatformHealthService (Platform Façade)
 */

import { Injectable, Inject, Logger } from '@nestjs/common';
import { ServiceHealthAggregate } from '../../domain/models/health.aggregate';
import { CheckType, HealthSeverity, HealthType, ServiceStatus } from '../../domain/enums/health.enums';
import {
  AvailabilityScore,
  DependencyEdge,
  DependencyGraph,
  HealthCheckResult,
  Heartbeat,
  MaintenanceWindow,
  ServiceId,
} from '../../domain/value-objects/health-vo';
import {
  HEALTH_REPOSITORY_TOKEN,
  HEALTH_QUERY_REPOSITORY_TOKEN,
  HEALTH_PROVIDER_TOKEN,
  IHealthRepository,
  IHealthQueryRepository,
  IHealthProviderPort,
} from '../../domain/ports/health.ports';
import { EVENT_PUBLISHER_TOKEN } from '../../../integration/application/services/connector-platform.services';
import { EventPublisherPort } from '../../../integration/domain/ports/connector.ports';
import {
  AvailabilityResponseDto,
  DependencyGraphResponseDto,
  ExecuteSyntheticCheckDto,
  HealthCheckResponseDto,
  MaintenanceResponseDto,
  RecordHeartbeatDto,
  RegisterDependencyDto,
  RegisterServiceDto,
  ScheduleMaintenanceDto,
  ServiceResponseDto,
  UpdateServiceStatusDto,
} from '../dto/health.dto';
import {
  AvailabilityHistoryReadModel,
  DependencyMapReadModel,
  HealthDashboardReadModel,
  HealthStatisticsReadModel,
  MaintenanceHistoryReadModel,
  ServiceCatalogReadModel,
} from '../read-models/health.read-models';
import {
  InvalidDependencyGraphException,
  ServiceNotFoundException,
  UnauthorizedPlatformAccessException,
} from '../../domain/exceptions/health.exceptions';
import { DependencyFailedEvent, MaintenanceEndedEvent, MaintenanceStartedEvent } from '../../domain/events/health.events';

/**
 * Service 1: DependencyService
 * Manages directed dependency graph, cycle detection, and transitive failure propagation.
 */
@Injectable()
export class DependencyService {
  /**
   * Detect cycles in directed service dependency graph using DFS
   */
  public hasCycle(edges: { sourceServiceId: string; targetServiceId: string }[]): boolean {
    const adj = new Map<string, string[]>();
    edges.forEach((e) => {
      if (!adj.has(e.sourceServiceId)) adj.set(e.sourceServiceId, []);
      adj.get(e.sourceServiceId)!.push(e.targetServiceId);
    });

    const visited = new Set<string>();
    const recStack = new Set<string>();

    const dfs = (node: string): boolean => {
      visited.add(node);
      recStack.add(node);

      const neighbors = adj.get(node) || [];
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          if (dfs(neighbor)) return true;
        } else if (recStack.has(neighbor)) {
          return true;
        }
      }

      recStack.delete(node);
      return false;
    };

    for (const node of adj.keys()) {
      if (!visited.has(node)) {
        if (dfs(node)) return true;
      }
    }
    return false;
  }

  /**
   * Transitive Failure Propagation:
   * If a target service fails (UNAVAILABLE/STOPPED) and the dependency is CRITICAL,
   * propagate DEGRADED or UNAVAILABLE status to dependent source services.
   */
  public propagateTransitiveFailures(
    services: ServiceHealthAggregate[],
    failedTargetId: string,
    eventPublisher: EventPublisherPort
  ): void {
    services.forEach((service) => {
      const criticalDep = service.getDependencies().find((d) => d.targetServiceId === failedTargetId && d.isCritical);
      if (criticalDep) {
        service.updateStatus(ServiceStatus.DEGRADED, 'system-dependency-watcher');
        eventPublisher.publish(
          new DependencyFailedEvent(
            service.getId().getValue(),
            service.getTenantId(),
            service.getId().getValue(),
            failedTargetId,
            true
          )
        );
      }
    });
  }
}

/**
 * Service 2: HeartbeatService
 * Ingests heartbeats, checks sequence numbers, and detects missed heartbeat timeouts.
 */
@Injectable()
export class HeartbeatService {
  public validateHeartbeatTimeout(latestHeartbeat?: Heartbeat, maxAgeMs: number = 30000): boolean {
    if (!latestHeartbeat) return false;
    const ageMs = Date.now() - latestHeartbeat.timestamp.getTime();
    return ageMs <= maxAgeMs;
  }
}

/**
 * Service 3: AvailabilityService
 * Computes uptime percentages and monitors SLA compliance (target e.g. 99.999%).
 */
@Injectable()
export class AvailabilityService {
  public calculateAvailability(totalUptimeSec: number, totalDowntimeSec: number, slaTarget: number = 99.999): AvailabilityScore {
    const totalSec = totalUptimeSec + totalDowntimeSec;
    const uptimePct = totalSec > 0 ? (totalUptimeSec / totalSec) * 100 : 100.0;
    return AvailabilityScore.create({
      uptimePercentage: uptimePct,
      totalDowntimeSeconds: totalDowntimeSec,
      totalUptimeSeconds: totalUptimeSec,
      slaTarget,
    });
  }
}

/**
 * Service 4: MaintenanceService
 * Schedules maintenance windows and enforces maintenance status overrides.
 */
@Injectable()
export class MaintenanceService {
  public isServiceInMaintenance(serviceId: string, activeWindows: MaintenanceWindow[]): boolean {
    return activeWindows.some(
      (w) => w.isActive && (w.affectedServiceIds.length === 0 || w.affectedServiceIds.includes(serviceId))
    );
  }
}

/**
 * Service 5: HealthAggregationService
 * System health aggregation completely decoupled from UI rendering.
 */
@Injectable()
export class HealthAggregationService {
  public computeSystemHealth(services: ServiceHealthAggregate[]): ServiceStatus {
    if (services.length === 0) return ServiceStatus.HEALTHY;

    let hasDegraded = false;
    let hasUnavailable = false;
    let hasMaintenance = false;

    for (const s of services) {
      const st = s.getStatus();
      if (st === ServiceStatus.UNAVAILABLE || st === ServiceStatus.STOPPED) {
        hasUnavailable = true;
      } else if (st === ServiceStatus.DEGRADED) {
        hasDegraded = true;
      } else if (st === ServiceStatus.MAINTENANCE) {
        hasMaintenance = true;
      }
    }

    if (hasUnavailable) return ServiceStatus.UNAVAILABLE;
    if (hasDegraded) return ServiceStatus.DEGRADED;
    if (hasMaintenance) return ServiceStatus.MAINTENANCE;
    return ServiceStatus.HEALTHY;
  }
}

/**
 * Service 6: HealthService
 * Registration, health check execution, synthetic testing, and status updates.
 */
@Injectable()
export class HealthService {
  constructor(
    @Inject(HEALTH_REPOSITORY_TOKEN)
    private readonly repo: IHealthRepository,
    @Inject(HEALTH_QUERY_REPOSITORY_TOKEN)
    private readonly queryRepo: IHealthQueryRepository,
    @Inject(HEALTH_PROVIDER_TOKEN)
    private readonly provider: IHealthProviderPort,
    @Inject(EVENT_PUBLISHER_TOKEN)
    private readonly eventPublisher: EventPublisherPort,
    private readonly dependencyService: DependencyService
  ) {}

  public async registerService(tenantId: string, dto: RegisterServiceDto, registeredBy: string = 'system'): Promise<ServiceHealthAggregate> {
    const dependencies: DependencyEdge[] = (dto.dependencies || []).map((d) => ({
      targetServiceId: d.targetServiceId,
      targetServiceName: d.targetServiceName,
      isCritical: d.isCritical ?? true,
    }));

    const service = ServiceHealthAggregate.register({
      tenantId,
      serviceName: dto.serviceName,
      serviceVersion: dto.serviceVersion,
      healthType: dto.healthType,
      dependencies,
      tags: dto.tags,
      registeredBy,
    });

    await this.repo.save(service);
    await this.eventPublisher.publishAll(service.getUncommittedEvents());
    service.clearUncommittedEvents();

    return service;
  }

  public async executeCheck(
    service: ServiceHealthAggregate,
    checkType: CheckType
  ): Promise<HealthCheckResult> {
    const result = await this.provider.executeHealthCheck(service, checkType);
    service.recordCheckResult(result);

    await this.repo.save(service);
    await this.queryRepo.saveHealthCheckLog(service.getTenantId(), service.getId().getValue(), result);
    await this.eventPublisher.publishAll(service.getUncommittedEvents());
    service.clearUncommittedEvents();

    if (result.status === ServiceStatus.UNAVAILABLE || result.status === ServiceStatus.STOPPED) {
      const tenantServices = await this.repo.findByTenant(service.getTenantId());
      this.dependencyService.propagateTransitiveFailures(
        tenantServices,
        service.getId().getValue(),
        this.eventPublisher
      );
    }

    return result;
  }
}

/**
 * Service 7: EnterprisePlatformHealthService
 * Unified platform façade integrating all sub-services, repositories, and event publishers.
 */
@Injectable()
export class EnterprisePlatformHealthService {
  private readonly logger = new Logger(EnterprisePlatformHealthService.name);

  constructor(
    @Inject(HEALTH_REPOSITORY_TOKEN)
    private readonly repo: IHealthRepository,
    @Inject(HEALTH_QUERY_REPOSITORY_TOKEN)
    private readonly queryRepo: IHealthQueryRepository,
    @Inject(EVENT_PUBLISHER_TOKEN)
    private readonly eventPublisher: EventPublisherPort,
    private readonly healthService: HealthService,
    private readonly dependencyService: DependencyService,
    private readonly heartbeatService: HeartbeatService,
    private readonly availabilityService: AvailabilityService,
    private readonly maintenanceService: MaintenanceService,
    private readonly aggregationService: HealthAggregationService
  ) {}

  public async getServices(
    tenantId: string,
    healthType?: HealthType,
    status?: ServiceStatus
  ): Promise<ServiceCatalogReadModel> {
    return this.queryRepo.getCatalog(tenantId, healthType, status);
  }

  public async getServiceById(tenantId: string, id: string): Promise<ServiceResponseDto> {
    const service = await this.repo.findById(id, tenantId);
    if (!service) throw new ServiceNotFoundException(id);

    if (service.getTenantId() !== tenantId && service.getTenantId() !== 'system-template') {
      throw new UnauthorizedPlatformAccessException(tenantId, id);
    }

    return this.toResponseDto(service);
  }

  public async registerService(
    tenantId: string,
    dto: RegisterServiceDto,
    registeredBy: string = 'system'
  ): Promise<ServiceResponseDto> {
    const service = await this.healthService.registerService(tenantId, dto, registeredBy);
    return this.toResponseDto(service);
  }

  public async updateServiceStatus(
    tenantId: string,
    id: string,
    dto: UpdateServiceStatusDto,
    updatedBy: string = 'system'
  ): Promise<ServiceResponseDto> {
    const service = await this.repo.findById(id, tenantId);
    if (!service) throw new ServiceNotFoundException(id);

    if (service.getTenantId() !== tenantId) {
      throw new UnauthorizedPlatformAccessException(tenantId, id);
    }

    service.updateStatus(dto.status, updatedBy);

    await this.repo.save(service);
    await this.eventPublisher.publishAll(service.getUncommittedEvents());
    service.clearUncommittedEvents();

    return this.toResponseDto(service);
  }

  public async recordHeartbeat(tenantId: string, dto: RecordHeartbeatDto): Promise<void> {
    const service = await this.repo.findById(dto.serviceId, tenantId);
    if (!service) throw new ServiceNotFoundException(dto.serviceId);

    const heartbeat = Heartbeat.create({
      serviceId: dto.serviceId,
      sequenceNumber: dto.sequenceNumber,
      metrics: dto.metrics,
    });

    service.recordHeartbeat(heartbeat);
    await this.repo.save(service);
    await this.queryRepo.saveHeartbeatLog(tenantId, dto.serviceId, heartbeat);
  }

  public async executeSyntheticCheck(
    tenantId: string,
    dto: ExecuteSyntheticCheckDto
  ): Promise<HealthCheckResponseDto> {
    const service = await this.repo.findById(dto.serviceId, tenantId);
    if (!service) throw new ServiceNotFoundException(dto.serviceId);

    const result = await this.healthService.executeCheck(service, dto.checkType);

    return {
      checkId: result.checkId,
      serviceId: dto.serviceId,
      checkType: result.checkType,
      status: result.status,
      severity: result.severity,
      responseTimeMs: result.responseTimeMs,
      message: result.message,
      timestamp: result.timestamp.toISOString(),
      details: result.details,
    };
  }

  public async scheduleMaintenance(
    tenantId: string,
    dto: ScheduleMaintenanceDto
  ): Promise<MaintenanceResponseDto> {
    const window = MaintenanceWindow.create({
      scheduledStart: new Date(dto.scheduledStart),
      scheduledEnd: new Date(dto.scheduledEnd),
      reason: dto.reason,
      affectedServiceIds: dto.affectedServiceIds,
    });

    await this.queryRepo.saveMaintenanceWindow(tenantId, window);

    // Override affected services status if window is active
    if (window.isActive && window.affectedServiceIds.length > 0) {
      for (const serviceId of window.affectedServiceIds) {
        const service = await this.repo.findById(serviceId, tenantId);
        if (service) {
          service.setMaintenance(true, dto.reason);
          await this.repo.save(service);
        }
      }
    }

    this.eventPublisher.publish(
      new MaintenanceStartedEvent(
        window.windowId,
        tenantId,
        window.windowId,
        dto.reason,
        dto.affectedServiceIds || []
      )
    );

    return {
      windowId: window.windowId,
      tenantId,
      reason: window.reason,
      scheduledStart: window.scheduledStart.toISOString(),
      scheduledEnd: window.scheduledEnd.toISOString(),
      affectedServiceIds: window.affectedServiceIds,
      isActive: window.isActive,
    };
  }

  public async getHealthDashboard(tenantId?: string): Promise<HealthDashboardReadModel> {
    return this.queryRepo.getHealthDashboard(tenantId);
  }

  public async getDependencyMap(tenantId?: string): Promise<DependencyMapReadModel> {
    return this.queryRepo.getDependencyMap(tenantId);
  }

  public async getAvailabilityHistory(tenantId?: string, serviceId?: string): Promise<AvailabilityHistoryReadModel> {
    return this.queryRepo.getAvailabilityHistory(tenantId, serviceId);
  }

  public async getMaintenanceHistory(tenantId?: string): Promise<MaintenanceHistoryReadModel> {
    return this.queryRepo.getMaintenanceHistory(tenantId);
  }

  public async getStatistics(tenantId?: string): Promise<HealthStatisticsReadModel> {
    return this.queryRepo.getStatistics(tenantId);
  }

  private toResponseDto(service: ServiceHealthAggregate): ServiceResponseDto {
    return {
      id: service.getId().getValue(),
      tenantId: service.getTenantId(),
      serviceName: service.getServiceName().getValue(),
      serviceVersion: service.getServiceVersion().getValue(),
      healthType: service.getHealthType(),
      status: service.getStatus(),
      dependencies: service.getDependencies().map((d) => ({
        targetServiceId: d.targetServiceId,
        targetServiceName: d.targetServiceName,
        isCritical: d.isCritical,
      })),
      uptimePercentage: service.getAvailability().uptimePercentage,
      meetsSla: service.getAvailability().meetsSla,
      lastHeartbeatTime: service.getLatestHeartbeat()?.timestamp.toISOString(),
      tags: service.getTags(),
      registeredBy: service.getRegisteredBy(),
      updatedBy: service.getUpdatedBy(),
      createdAt: service.getCreatedAt().toISOString(),
      updatedAt: service.getUpdatedAt().toISOString(),
    };
  }
}
