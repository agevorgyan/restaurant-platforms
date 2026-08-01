/**
 * Enterprise Platform Health & Operations Platform - Value Objects
 *
 * Immutable Value Objects encapsulating service identity, versioning, health check results,
 * availability SLA scores, directed dependency graphs, maintenance windows, heartbeats, and operational states.
 */

import { CheckType, HealthSeverity, HealthType, ServiceStatus } from '../enums/health.enums';
import {
  InvalidDependencyGraphException,
  InvalidMaintenanceWindowException,
} from '../exceptions/health.exceptions';

/**
 * ServiceId Value Object
 */
export class ServiceId {
  private readonly value: string;

  private constructor(value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('ServiceId cannot be empty');
    }
    this.value = value;
  }

  public static create(id?: string): ServiceId {
    return new ServiceId(id || `svc-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`);
  }

  public static fromString(id: string): ServiceId {
    return new ServiceId(id);
  }

  public getValue(): string {
    return this.value;
  }

  public equals(other: ServiceId): boolean {
    return this.value === other.getValue();
  }
}

/**
 * ServiceName Value Object
 */
export class ServiceName {
  private readonly value: string;

  private constructor(value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('ServiceName cannot be empty');
    }
    this.value = value.trim();
  }

  public static create(name: string): ServiceName {
    return new ServiceName(name);
  }

  public getValue(): string {
    return this.value;
  }
}

/**
 * ServiceVersion Value Object
 */
export class ServiceVersion {
  private readonly value: string;

  private constructor(value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('ServiceVersion cannot be empty');
    }
    this.value = value.trim();
  }

  public static create(version: string): ServiceVersion {
    return new ServiceVersion(version);
  }

  public static defaultVersion(): ServiceVersion {
    return new ServiceVersion('1.0.0');
  }

  public getValue(): string {
    return this.value;
  }
}

/**
 * HealthStatus Value Object
 */
export class HealthStatus {
  public readonly status: ServiceStatus;
  public readonly severity: HealthSeverity;
  public readonly isHealthy: boolean;
  public readonly message?: string;

  private constructor(status: ServiceStatus, severity?: HealthSeverity, message?: string) {
    this.status = status;
    this.severity = severity || (status === ServiceStatus.HEALTHY ? HealthSeverity.INFO : HealthSeverity.WARNING);
    this.isHealthy = status === ServiceStatus.HEALTHY || status === ServiceStatus.STARTING;
    this.message = message;
  }

  public static create(status: ServiceStatus, severity?: HealthSeverity, message?: string): HealthStatus {
    return new HealthStatus(status, severity, message);
  }

  public static healthy(message?: string): HealthStatus {
    return new HealthStatus(ServiceStatus.HEALTHY, HealthSeverity.INFO, message || 'Service operating normally');
  }

  public static degraded(message: string): HealthStatus {
    return new HealthStatus(ServiceStatus.DEGRADED, HealthSeverity.WARNING, message);
  }

  public static unavailable(message: string): HealthStatus {
    return new HealthStatus(ServiceStatus.UNAVAILABLE, HealthSeverity.CRITICAL, message);
  }
}

/**
 * HealthCheckResult Value Object
 */
export class HealthCheckResult {
  public readonly checkId: string;
  public readonly checkType: CheckType;
  public readonly status: ServiceStatus;
  public readonly severity: HealthSeverity;
  public readonly responseTimeMs: number;
  public readonly message?: string;
  public readonly timestamp: Date;
  public readonly details?: Record<string, unknown>;

  private constructor(props: {
    checkId?: string;
    checkType: CheckType;
    status: ServiceStatus;
    severity?: HealthSeverity;
    responseTimeMs: number;
    message?: string;
    timestamp?: Date;
    details?: Record<string, unknown>;
  }) {
    this.checkId = props.checkId || `chk-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    this.checkType = props.checkType;
    this.status = props.status;
    this.severity = props.severity || (props.status === ServiceStatus.HEALTHY ? HealthSeverity.INFO : HealthSeverity.CRITICAL);
    this.responseTimeMs = props.responseTimeMs;
    this.message = props.message;
    this.timestamp = props.timestamp || new Date();
    this.details = props.details || {};
  }

  public static create(props: {
    checkId?: string;
    checkType: CheckType;
    status: ServiceStatus;
    severity?: HealthSeverity;
    responseTimeMs: number;
    message?: string;
    timestamp?: Date;
    details?: Record<string, unknown>;
  }): HealthCheckResult {
    return new HealthCheckResult(props);
  }
}

/**
 * AvailabilityScore Value Object
 */
export class AvailabilityScore {
  public readonly uptimePercentage: number; // e.g. 99.999
  public readonly totalDowntimeSeconds: number;
  public readonly totalUptimeSeconds: number;
  public readonly slaTarget: number; // e.g. 99.999
  public readonly meetsSla: boolean;

  private constructor(props: {
    uptimePercentage: number;
    totalDowntimeSeconds?: number;
    totalUptimeSeconds?: number;
    slaTarget?: number;
  }) {
    this.uptimePercentage = Math.min(100.0, Math.max(0.0, Math.round(props.uptimePercentage * 1000) / 1000));
    this.totalDowntimeSeconds = props.totalDowntimeSeconds ?? 0;
    this.totalUptimeSeconds = props.totalUptimeSeconds ?? 86400;
    this.slaTarget = props.slaTarget ?? 99.999;
    this.meetsSla = this.uptimePercentage >= this.slaTarget;
  }

  public static create(props: {
    uptimePercentage: number;
    totalDowntimeSeconds?: number;
    totalUptimeSeconds?: number;
    slaTarget?: number;
  }): AvailabilityScore {
    return new AvailabilityScore(props);
  }

  public static perfect(): AvailabilityScore {
    return new AvailabilityScore({ uptimePercentage: 100.0, totalDowntimeSeconds: 0, totalUptimeSeconds: 86400 });
  }
}

/**
 * Directed Dependency Edge representation
 */
export interface DependencyEdge {
  targetServiceId: string;
  targetServiceName: string;
  isCritical: boolean; // if true, failure of target degrades source service
}

/**
 * DependencyGraph Value Object (Directed Graph for service dependencies)
 */
export class DependencyGraph {
  public readonly serviceId: string;
  public readonly dependencies: DependencyEdge[];

  private constructor(serviceId: string, dependencies: DependencyEdge[]) {
    this.serviceId = serviceId;
    this.dependencies = dependencies;

    // Detect self-dependency cycles
    if (dependencies.some((d) => d.targetServiceId === serviceId)) {
      throw new InvalidDependencyGraphException(`Service '${serviceId}' cannot depend on itself.`);
    }
  }

  public static create(serviceId: string, dependencies: DependencyEdge[]): DependencyGraph {
    return new DependencyGraph(serviceId, dependencies);
  }

  public hasCriticalDependency(targetId: string): boolean {
    return this.dependencies.some((d) => d.targetServiceId === targetId && d.isCritical);
  }
}

/**
 * MaintenanceWindow Value Object
 */
export class MaintenanceWindow {
  public readonly windowId: string;
  public readonly scheduledStart: Date;
  public readonly scheduledEnd: Date;
  public readonly reason: string;
  public readonly affectedServiceIds: string[];
  public readonly isActive: boolean;

  private constructor(props: {
    windowId?: string;
    scheduledStart: Date;
    scheduledEnd: Date;
    reason: string;
    affectedServiceIds?: string[];
    isActive?: boolean;
  }) {
    if (props.scheduledStart >= props.scheduledEnd) {
      throw new InvalidMaintenanceWindowException('scheduledStart must be earlier than scheduledEnd');
    }
    this.windowId = props.windowId || `maint-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    this.scheduledStart = props.scheduledStart;
    this.scheduledEnd = props.scheduledEnd;
    this.reason = props.reason;
    this.affectedServiceIds = props.affectedServiceIds || [];

    const now = new Date();
    this.isActive = props.isActive ?? (now >= props.scheduledStart && now <= props.scheduledEnd);
  }

  public static create(props: {
    windowId?: string;
    scheduledStart: Date;
    scheduledEnd: Date;
    reason: string;
    affectedServiceIds?: string[];
    isActive?: boolean;
  }): MaintenanceWindow {
    return new MaintenanceWindow(props);
  }
}

/**
 * Heartbeat Value Object
 */
export class Heartbeat {
  public readonly serviceId: string;
  public readonly sequenceNumber: number;
  public readonly timestamp: Date;
  public readonly metrics: {
    memoryUsageMb?: number;
    cpuUsagePct?: number;
    activeConnections?: number;
  };

  private constructor(props: {
    serviceId: string;
    sequenceNumber: number;
    timestamp?: Date;
    metrics?: {
      memoryUsageMb?: number;
      cpuUsagePct?: number;
      activeConnections?: number;
    };
  }) {
    this.serviceId = props.serviceId;
    this.sequenceNumber = props.sequenceNumber;
    this.timestamp = props.timestamp || new Date();
    this.metrics = props.metrics || {};
  }

  public static create(props: {
    serviceId: string;
    sequenceNumber: number;
    timestamp?: Date;
    metrics?: {
      memoryUsageMb?: number;
      cpuUsagePct?: number;
      activeConnections?: number;
    };
  }): Heartbeat {
    return new Heartbeat(props);
  }
}

/**
 * OperationalState Value Object
 */
export class OperationalState {
  public readonly status: ServiceStatus;
  public readonly healthType: HealthType;
  public readonly activeAlertsCount: number;
  public readonly lastCheckTime: Date;

  private constructor(props: {
    status: ServiceStatus;
    healthType: HealthType;
    activeAlertsCount?: number;
    lastCheckTime?: Date;
  }) {
    this.status = props.status;
    this.healthType = props.healthType;
    this.activeAlertsCount = props.activeAlertsCount ?? 0;
    this.lastCheckTime = props.lastCheckTime || new Date();
  }

  public static create(props: {
    status: ServiceStatus;
    healthType: HealthType;
    activeAlertsCount?: number;
    lastCheckTime?: Date;
  }): OperationalState {
    return new OperationalState(props);
  }
}
