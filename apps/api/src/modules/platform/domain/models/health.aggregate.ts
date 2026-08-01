/**
 * Enterprise Platform Health & Operations Platform - Domain Aggregate Root
 *
 * ServiceHealthAggregate encapsulates service registration, health status state transitions
 * (UNKNOWN -> STARTING -> HEALTHY -> DEGRADED -> MAINTENANCE -> UNAVAILABLE -> STOPPED),
 * directed dependency tracking, health check execution results, heartbeats, SLA scoring, and domain events.
 */

import { CheckType, HealthSeverity, HealthType, ServiceStatus } from '../enums/health.enums';
import {
  AvailabilityScore,
  DependencyEdge,
  DependencyGraph,
  HealthCheckResult,
  HealthStatus,
  Heartbeat,
  ServiceId,
  ServiceName,
  ServiceVersion,
} from '../value-objects/health-vo';
import { BasePlatformDomainEvent } from '../events/health.events';
import {
  AvailabilityUpdatedEvent,
  HealthCheckFailedEvent,
  HealthCheckPassedEvent,
  ServiceRegisteredEvent,
} from '../events/health.events';

export interface RegisterServiceProps {
  serviceName: string;
  tenantId: string;
  healthType: HealthType;
  serviceVersion?: string;
  dependencies?: DependencyEdge[];
  tags?: string[];
  registeredBy?: string;
}

export class ServiceHealthAggregate {
  private readonly id: ServiceId;
  private readonly tenantId: string;
  private serviceName: ServiceName;
  private serviceVersion: ServiceVersion;
  private healthType: HealthType;
  private status: ServiceStatus;
  private dependencies: DependencyEdge[];
  private checkResults: Map<string, HealthCheckResult>;
  private latestHeartbeat?: Heartbeat;
  private availability: AvailabilityScore;
  private tags: string[];
  private registeredBy: string;
  private updatedBy: string;
  private readonly createdAt: Date;
  private updatedAt: Date;
  private uncommittedEvents: BasePlatformDomainEvent[] = [];

  private constructor(props: {
    id: ServiceId;
    tenantId: string;
    serviceName: ServiceName;
    serviceVersion: ServiceVersion;
    healthType: HealthType;
    status: ServiceStatus;
    dependencies?: DependencyEdge[];
    checkResults?: HealthCheckResult[];
    latestHeartbeat?: Heartbeat;
    availability?: AvailabilityScore;
    tags?: string[];
    registeredBy?: string;
    updatedBy?: string;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    this.id = props.id;
    this.tenantId = props.tenantId;
    this.serviceName = props.serviceName;
    this.serviceVersion = props.serviceVersion;
    this.healthType = props.healthType;
    this.status = props.status;
    this.dependencies = props.dependencies || [];
    this.checkResults = new Map();
    if (props.checkResults) {
      props.checkResults.forEach((r) => this.checkResults.set(r.checkId, r));
    }
    this.latestHeartbeat = props.latestHeartbeat;
    this.availability = props.availability || AvailabilityScore.perfect();
    this.tags = props.tags || [];
    this.registeredBy = props.registeredBy || 'system';
    this.updatedBy = props.updatedBy || props.registeredBy || 'system';
    this.createdAt = props.createdAt || new Date();
    this.updatedAt = props.updatedAt || new Date();
  }

  /**
   * Factory method to register a new Service aggregate
   */
  public static register(props: RegisterServiceProps): ServiceHealthAggregate {
    const id = ServiceId.create();
    const serviceName = ServiceName.create(props.serviceName);
    const serviceVersion = props.serviceVersion
      ? ServiceVersion.create(props.serviceVersion)
      : ServiceVersion.defaultVersion();

    const aggregate = new ServiceHealthAggregate({
      id,
      tenantId: props.tenantId,
      serviceName,
      serviceVersion,
      healthType: props.healthType,
      status: ServiceStatus.HEALTHY,
      dependencies: props.dependencies,
      tags: props.tags,
      registeredBy: props.registeredBy,
    });

    aggregate.addDomainEvent(
      new ServiceRegisteredEvent(
        id.getValue(),
        props.tenantId,
        serviceName.getValue(),
        serviceVersion.getValue(),
        props.healthType
      )
    );

    return aggregate;
  }

  /**
   * Reconstitute aggregate from persistent storage
   */
  public static reconstitute(props: {
    id: ServiceId;
    tenantId: string;
    serviceName: ServiceName;
    serviceVersion: ServiceVersion;
    healthType: HealthType;
    status: ServiceStatus;
    dependencies: DependencyEdge[];
    checkResults: HealthCheckResult[];
    latestHeartbeat?: Heartbeat;
    availability: AvailabilityScore;
    tags: string[];
    registeredBy: string;
    updatedBy: string;
    createdAt: Date;
    updatedAt: Date;
  }): ServiceHealthAggregate {
    return new ServiceHealthAggregate(props);
  }

  // Getters
  public getId(): ServiceId {
    return this.id;
  }

  public getTenantId(): string {
    return this.tenantId;
  }

  public getServiceName(): ServiceName {
    return this.serviceName;
  }

  public getServiceVersion(): ServiceVersion {
    return this.serviceVersion;
  }

  public getHealthType(): HealthType {
    return this.healthType;
  }

  public getStatus(): ServiceStatus {
    return this.status;
  }

  public getDependencies(): DependencyEdge[] {
    return [...this.dependencies];
  }

  public getCheckResults(): HealthCheckResult[] {
    return Array.from(this.checkResults.values());
  }

  public getLatestHeartbeat(): Heartbeat | undefined {
    return this.latestHeartbeat;
  }

  public getAvailability(): AvailabilityScore {
    return this.availability;
  }

  public getTags(): string[] {
    return [...this.tags];
  }

  public getRegisteredBy(): string {
    return this.registeredBy;
  }

  public getUpdatedBy(): string {
    return this.updatedBy;
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }

  public getUpdatedAt(): Date {
    return this.updatedAt;
  }

  // Domain Mutations & State Machine
  public updateStatus(status: ServiceStatus, updatedBy: string = 'system'): void {
    this.status = status;
    this.updatedBy = updatedBy;
    this.updatedAt = new Date();
  }

  public recordCheckResult(result: HealthCheckResult, updatedBy: string = 'system'): void {
    this.checkResults.set(result.checkId, result);
    this.updatedBy = updatedBy;
    this.updatedAt = new Date();

    if (result.status === ServiceStatus.HEALTHY) {
      if (this.status !== ServiceStatus.MAINTENANCE) {
        this.status = ServiceStatus.HEALTHY;
      }
      this.addDomainEvent(
        new HealthCheckPassedEvent(
          this.id.getValue(),
          this.tenantId,
          result.checkType,
          result.responseTimeMs
        )
      );
    } else {
      if (this.status !== ServiceStatus.MAINTENANCE) {
        this.status = result.status;
      }
      this.addDomainEvent(
        new HealthCheckFailedEvent(
          this.id.getValue(),
          this.tenantId,
          result.checkType,
          result.severity,
          result.message || 'Health check failed'
        )
      );
    }
  }

  public recordHeartbeat(heartbeat: Heartbeat, updatedBy: string = 'system'): void {
    this.latestHeartbeat = heartbeat;
    this.updatedBy = updatedBy;
    this.updatedAt = new Date();
  }

  public updateDependencies(dependencies: DependencyEdge[], updatedBy: string = 'system'): void {
    // Validate directed graph (no self-loops)
    DependencyGraph.create(this.id.getValue(), dependencies);

    this.dependencies = dependencies;
    this.updatedBy = updatedBy;
    this.updatedAt = new Date();
  }

  public setMaintenance(isMaintenance: boolean, reason?: string, updatedBy: string = 'system'): void {
    if (isMaintenance) {
      this.status = ServiceStatus.MAINTENANCE;
    } else {
      this.status = ServiceStatus.HEALTHY;
    }
    this.updatedBy = updatedBy;
    this.updatedAt = new Date();
  }

  public updateAvailability(uptimePercentage: number, totalDowntimeSeconds?: number): void {
    this.availability = AvailabilityScore.create({
      uptimePercentage,
      totalDowntimeSeconds,
    });
    this.updatedAt = new Date();

    this.addDomainEvent(
      new AvailabilityUpdatedEvent(
        this.id.getValue(),
        this.tenantId,
        this.availability.uptimePercentage,
        this.availability.meetsSla
      )
    );
  }

  // Events Management
  private addDomainEvent(event: BasePlatformDomainEvent): void {
    this.uncommittedEvents.push(event);
  }

  public getUncommittedEvents(): BasePlatformDomainEvent[] {
    return [...this.uncommittedEvents];
  }

  public clearUncommittedEvents(): void {
    this.uncommittedEvents = [];
  }
}
