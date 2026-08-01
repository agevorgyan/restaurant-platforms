/**
 * Enterprise Platform Health & Operations Platform - Comprehensive Test Suite
 *
 * Tests Value Objects, ServiceHealthAggregate Root & Lifecycle, Directed Dependency Graph (DAG) Engine,
 * Cycle Detection, Transitive Failure Propagation, Heartbeat Monitoring, SLA Availability Scoring,
 * Maintenance Window Overrides, Health Aggregation, RLS Tenant Security, and Read Models.
 */

import {
  ServiceId,
  ServiceName,
  ServiceVersion,
  HealthStatus,
  HealthCheckResult,
  AvailabilityScore,
  DependencyGraph,
  MaintenanceWindow,
  Heartbeat,
} from './domain/value-objects/health-vo';
import { CheckType, HealthSeverity, HealthType, ServiceStatus } from './domain/enums/health.enums';
import { ServiceHealthAggregate } from './domain/models/health.aggregate';
import { InMemoryHealthRepository } from './infrastructure/repositories/in-memory-health.repository';
import { NestEventPublisherAdapter } from '../integration/infrastructure/adapters/connector.adapters';
import {
  HealthService,
  DependencyService,
  HeartbeatService,
  AvailabilityService,
  MaintenanceService,
  HealthAggregationService,
  EnterprisePlatformHealthService,
} from './application/services/health-platform.services';
import {
  InvalidDependencyGraphException,
  InvalidMaintenanceWindowException,
  UnauthorizedPlatformAccessException,
} from './domain/exceptions/health.exceptions';

describe('Enterprise Platform Health & Operations Platform', () => {
  describe('Value Objects & Invariants', () => {
    it('should generate unique IDs for ServiceId and format ServiceName & Version', () => {
      const svcId = ServiceId.create();
      expect(svcId.getValue()).toMatch(/^svc-/);

      const name = ServiceName.create('SaaS API Gateway');
      expect(name.getValue()).toBe('SaaS API Gateway');

      const version = ServiceVersion.create('2.1.0');
      expect(version.getValue()).toBe('2.1.0');
    });

    it('should calculate SLA Availability Scores and check SLA targets (99.999%)', () => {
      const score = AvailabilityScore.create({ uptimePercentage: 99.999 });
      expect(score.meetsSla).toBe(true);

      const degradedScore = AvailabilityScore.create({ uptimePercentage: 99.5 });
      expect(degradedScore.meetsSla).toBe(false);
    });

    it('should throw exception if dependency graph contains a self-loop cycle', () => {
      expect(() =>
        DependencyGraph.create('svc-1', [{ targetServiceId: 'svc-1', targetServiceName: 'Self', isCritical: true }])
      ).toThrow(InvalidDependencyGraphException);
    });

    it('should throw exception if MaintenanceWindow scheduledStart >= scheduledEnd', () => {
      const now = new Date();
      const earlier = new Date(now.getTime() - 10000);
      expect(() =>
        MaintenanceWindow.create({ scheduledStart: now, scheduledEnd: earlier, reason: 'Test' })
      ).toThrow(InvalidMaintenanceWindowException);
    });
  });

  describe('ServiceHealthAggregate Root & Lifecycle', () => {
    it('should register a new service in HEALTHY status and emit ServiceRegistered event', () => {
      const service = ServiceHealthAggregate.register({
        serviceName: 'Order Processing Engine',
        healthType: HealthType.APPLICATION,
        tenantId: 'tenant-order-1',
      });

      expect(service.getStatus()).toBe(ServiceStatus.HEALTHY);
      expect(service.getUncommittedEvents().length).toBe(1);
      expect(service.getUncommittedEvents()[0].eventName).toBe('ServiceRegistered');
    });

    it('should record check results and emit HealthCheckPassed / HealthCheckFailed events', () => {
      const service = ServiceHealthAggregate.register({
        serviceName: 'PostgreSQL Database',
        healthType: HealthType.DATABASE,
        tenantId: 'tenant-db-1',
      });

      const checkPassed = HealthCheckResult.create({
        checkType: CheckType.LIVENESS,
        status: ServiceStatus.HEALTHY,
        responseTimeMs: 4,
      });

      service.recordCheckResult(checkPassed);
      expect(service.getStatus()).toBe(ServiceStatus.HEALTHY);

      const checkFailed = HealthCheckResult.create({
        checkType: CheckType.READINESS,
        status: ServiceStatus.DEGRADED,
        severity: HealthSeverity.WARNING,
        responseTimeMs: 450,
        message: 'High connection pool latency',
      });

      service.recordCheckResult(checkFailed);
      expect(service.getStatus()).toBe(ServiceStatus.DEGRADED);
    });

    it('should record heartbeats and update latest heartbeat metrics', () => {
      const service = ServiceHealthAggregate.register({
        serviceName: 'Worker Queue Service',
        healthType: HealthType.QUEUE,
        tenantId: 'tenant-queue-1',
      });

      const heartbeat = Heartbeat.create({
        serviceId: service.getId().getValue(),
        sequenceNumber: 1,
        metrics: { memoryUsageMb: 256, cpuUsagePct: 12.5 },
      });

      service.recordHeartbeat(heartbeat);
      expect(service.getLatestHeartbeat()?.sequenceNumber).toBe(1);
      expect(service.getLatestHeartbeat()?.metrics.memoryUsageMb).toBe(256);
    });
  });

  describe('Directed Dependency Graph & Cycle Detection', () => {
    let dependencyService: DependencyService;

    beforeEach(() => {
      dependencyService = new DependencyService();
    });

    it('should detect cycles in directed service dependency graphs', () => {
      const edgesWithCycle = [
        { sourceServiceId: 'svc-A', targetServiceId: 'svc-B' },
        { sourceServiceId: 'svc-B', targetServiceId: 'svc-C' },
        { sourceServiceId: 'svc-C', targetServiceId: 'svc-A' }, // cycle A -> B -> C -> A
      ];

      expect(dependencyService.hasCycle(edgesWithCycle)).toBe(true);

      const edgesWithoutCycle = [
        { sourceServiceId: 'svc-A', targetServiceId: 'svc-B' },
        { sourceServiceId: 'svc-B', targetServiceId: 'svc-C' },
      ];

      expect(dependencyService.hasCycle(edgesWithoutCycle)).toBe(false);
    });

    it('should propagate transitive failure when a critical dependency fails', () => {
      const eventPublisher = new NestEventPublisherAdapter();

      const sourceService = ServiceHealthAggregate.register({
        serviceName: 'Checkout API',
        healthType: HealthType.APPLICATION,
        tenantId: 'tenant-check-1',
        dependencies: [{ targetServiceId: 'svc-db-critical', targetServiceName: 'Primary DB', isCritical: true }],
      });

      dependencyService.propagateTransitiveFailures([sourceService], 'svc-db-critical', eventPublisher);
      expect(sourceService.getStatus()).toBe(ServiceStatus.DEGRADED);
    });
  });

  describe('Platform Domain & Application Services', () => {
    let repo: InMemoryHealthRepository;
    let eventPublisher: NestEventPublisherAdapter;
    let dependencyService: DependencyService;
    let heartbeatService: HeartbeatService;
    let availabilityService: AvailabilityService;
    let maintenanceService: MaintenanceService;
    let aggregationService: HealthAggregationService;
    let healthService: HealthService;
    let platformService: EnterprisePlatformHealthService;

    beforeEach(() => {
      repo = new InMemoryHealthRepository();
      eventPublisher = new NestEventPublisherAdapter();

      dependencyService = new DependencyService();
      heartbeatService = new HeartbeatService();
      availabilityService = new AvailabilityService();
      maintenanceService = new MaintenanceService();
      aggregationService = new HealthAggregationService();

      healthService = new HealthService(
        repo,
        repo,
        repo,
        eventPublisher,
        dependencyService
      );

      platformService = new EnterprisePlatformHealthService(
        repo,
        repo,
        eventPublisher,
        healthService,
        dependencyService,
        heartbeatService,
        availabilityService,
        maintenanceService,
        aggregationService
      );
    });

    it('should query seeded default services for all 8 health types', async () => {
      const catalog = await platformService.getServices('tenant-default');
      expect(catalog.totalServices).toBe(8);

      const types = catalog.services.map((s) => s.healthType);
      expect(types).toContain(HealthType.APPLICATION);
      expect(types).toContain(HealthType.INFRASTRUCTURE);
      expect(types).toContain(HealthType.DATABASE);
      expect(types).toContain(HealthType.QUEUE);
      expect(types).toContain(HealthType.INTEGRATION);
      expect(types).toContain(HealthType.AI_PLATFORM);
      expect(types).toContain(HealthType.ANALYTICS);
      expect(types).toContain(HealthType.TENANT);
    });

    it('should register a new service and execute synthetic checks', async () => {
      const created = await platformService.registerService('tenant-kitch-100', {
        serviceName: 'Kitchen Display Controller',
        healthType: HealthType.APPLICATION,
        serviceVersion: '1.4.0',
      });

      expect(created.id).toBeDefined();
      expect(created.status).toBe(ServiceStatus.HEALTHY);

      const checkResult = await platformService.executeSyntheticCheck('tenant-kitch-100', {
        serviceId: created.id,
        checkType: CheckType.SYNTHETIC,
      });

      expect(checkResult.status).toBe(ServiceStatus.HEALTHY);
      expect(checkResult.checkType).toBe(CheckType.SYNTHETIC);
    });

    it('should schedule maintenance window and set active maintenance status override', async () => {
      const catalog = await platformService.getServices('tenant-default');
      const targetServiceId = catalog.services[0].id;

      const now = new Date();
      const end = new Date(now.getTime() + 2 * 60 * 60 * 1000);

      const maintenance = await platformService.scheduleMaintenance('tenant-default', {
        scheduledStart: now.toISOString(),
        scheduledEnd: end.toISOString(),
        reason: 'Database Index Optimization',
        affectedServiceIds: [targetServiceId],
      });

      expect(maintenance.windowId).toBeDefined();
      expect(maintenance.isActive).toBe(true);

      const updatedService = await platformService.getServiceById('tenant-default', targetServiceId);
      expect(updatedService.status).toBe(ServiceStatus.MAINTENANCE);
    });

    it('should aggregate overall system health without UI dependency', async () => {
      const dashboard = await platformService.getHealthDashboard('tenant-default');
      expect(dashboard.overallStatus).toBe(ServiceStatus.HEALTHY);
      expect(dashboard.healthyCount).toBe(8);
    });

    it('should enforce Tenant RLS Isolation', async () => {
      const created = await platformService.registerService('tenant-alpha', {
        serviceName: 'Alpha Microservice',
        healthType: HealthType.APPLICATION,
      });

      await expect(
        platformService.getServiceById('tenant-beta', created.id)
      ).rejects.toThrow(UnauthorizedPlatformAccessException);
    });

    it('should query Dependency Map, Availability History, and Health Statistics read models', async () => {
      const depMap = await platformService.getDependencyMap('tenant-default');
      expect(depMap.nodes.length).toBe(8);
      expect(depMap.hasCycles).toBe(false);

      const avail = await platformService.getAvailabilityHistory('tenant-default');
      expect(avail.history.length).toBeGreaterThan(0);
      expect(avail.averageUptimePercentage).toBeGreaterThan(99);

      const stats = await platformService.getStatistics('tenant-default');
      expect(stats.totalRegisteredServices).toBe(8);
      expect(stats.overallPlatformUptime).toBe(99.999);
    });
  });
});
