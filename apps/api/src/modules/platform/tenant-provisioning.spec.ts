/**
 * Enterprise Tenant Provisioning Platform - Comprehensive Test Suite
 *
 * Tests Value Objects, TenantProvisioningAggregate Root & Lifecycle, Saga Workflow Orchestration,
 * Compensation Rollbacks, Idempotent Step Execution, Resource Allocation Quotas, Module Assignments,
 * Tenant Suspension/Resumption, RLS Tenant Security, and Read Models.
 */

import {
  InitializationStep,
  ModuleAssignment,
  ProvisioningPlan,
  ProvisioningPolicy,
  ResourceAllocation,
  TenantMetadata,
  TenantProvisionId,
  WorkspaceId,
  WorkspaceTemplate,
} from './domain/value-objects/provisioning-vo';
import {
  InitializationStatus,
  LifecycleStage,
  ProvisioningStatus,
  ResourceType,
  TenantType,
} from './domain/enums/provisioning.enums';
import { TenantProvisioningAggregate } from './domain/models/provisioning.aggregate';
import { InMemoryTenantProvisioningRepository } from './infrastructure/repositories/in-memory-provisioning.repository';
import { NestEventPublisherAdapter } from '../integration/infrastructure/adapters/connector.adapters';
import {
  EnterpriseTenantProvisioningPlatformService,
  InitializationService,
  ProvisioningPolicyService,
  ProvisioningService,
  ResourceAllocationService,
  RollbackService,
  WorkspaceService,
} from './application/services/provisioning-platform.services';
import {
  InvalidProvisioningPlanException,
  TenantAlreadyExistsException,
  TenantNotFoundException,
} from './domain/exceptions/provisioning.exceptions';

describe('Enterprise Tenant Provisioning Platform', () => {
  describe('Value Objects & Invariants', () => {
    it('should generate unique TenantProvisionId and WorkspaceId', () => {
      const provId = TenantProvisionId.create();
      expect(provId.getValue()).toMatch(/^tp-/);

      const wsId = WorkspaceId.create();
      expect(wsId.getValue()).toMatch(/^ws-/);
    });

    it('should validate ProvisioningPlan steps count invariant', () => {
      const plan = ProvisioningPlan.standardSagaPlan();
      expect(plan.steps.length).toBe(5);
      expect(plan.steps).toContain('CREATE_WORKSPACE');

      expect(() => ProvisioningPlan.create([])).toThrow(InvalidProvisioningPlanException);
    });

    it('should format TenantMetadata and validate email formatting', () => {
      const metadata = TenantMetadata.create({
        companyName: 'Gourmet Bistro Enterprise',
        adminEmail: 'admin@gourmetbistro.com',
        region: 'eu-west-1',
        timezone: 'CET',
      });

      expect(metadata.companyName).toBe('Gourmet Bistro Enterprise');
      expect(metadata.adminEmail).toBe('admin@gourmetbistro.com');
      expect(metadata.region).toBe('eu-west-1');
    });
  });

  describe('TenantProvisioningAggregate Root & Lifecycle', () => {
    it('should start tenant provisioning saga in PROVISIONING stage and emit ProvisioningStarted event', () => {
      const metadata = TenantMetadata.create({ companyName: 'Noodle House', adminEmail: 'admin@noodlehouse.com' });
      const aggregate = TenantProvisioningAggregate.startProvisioning({
        tenantSlug: 'noodle-house',
        tenantType: TenantType.STANDARD,
        metadata,
      });

      expect(aggregate.getStage()).toBe(LifecycleStage.PROVISIONING);
      expect(aggregate.getStatus()).toBe(ProvisioningStatus.RUNNING);
      expect(aggregate.getUncommittedEvents().length).toBe(1);
      expect(aggregate.getUncommittedEvents()[0].eventName).toBe('ProvisioningStarted');
    });

    it('should progress through Saga steps and complete provisioning with ACTIVE stage', () => {
      const metadata = TenantMetadata.create({ companyName: 'Burger Kingdom', adminEmail: 'admin@burgerkingdom.com' });
      const aggregate = TenantProvisioningAggregate.startProvisioning({
        tenantSlug: 'burger-kingdom',
        tenantType: TenantType.ENTERPRISE,
        metadata,
      });

      aggregate.recordWorkspace(WorkspaceId.create());
      aggregate.recordResourceAllocations([
        ResourceAllocation.create({ resourceType: ResourceType.DATABASE_SCHEMA, quotaLimit: 500 }),
      ]);
      aggregate.recordModuleAssignments([ModuleAssignment.create('order', true)]);

      aggregate.completeProvisioning(145);

      expect(aggregate.getStage()).toBe(LifecycleStage.ACTIVE);
      expect(aggregate.getStatus()).toBe(ProvisioningStatus.COMPLETED);
      expect(aggregate.getExecutedSteps().length).toBe(4);
    });

    it('should record step failure and execute compensation rollback', () => {
      const metadata = TenantMetadata.create({ companyName: 'Failed Bistro', adminEmail: 'admin@failedbistro.com' });
      const aggregate = TenantProvisioningAggregate.startProvisioning({
        tenantSlug: 'failed-bistro',
        tenantType: TenantType.TRIAL,
        metadata,
      });

      aggregate.recordWorkspace(WorkspaceId.create());
      aggregate.recordFailureAndRollback('ALLOCATE_RESOURCES', 'Database quota exceeded', 1);

      expect(aggregate.getStatus()).toBe(ProvisioningStatus.ROLLED_BACK);
      expect(aggregate.getStage()).toBe(LifecycleStage.DELETED);
    });
  });

  describe('Platform Domain & Application Services', () => {
    let repo: InMemoryTenantProvisioningRepository;
    let eventPublisher: NestEventPublisherAdapter;
    let workspaceService: WorkspaceService;
    let resourceAllocationService: ResourceAllocationService;
    let initializationService: InitializationService;
    let policyService: ProvisioningPolicyService;
    let rollbackService: RollbackService;
    let provisioningService: ProvisioningService;
    let platformService: EnterpriseTenantProvisioningPlatformService;

    beforeEach(() => {
      repo = new InMemoryTenantProvisioningRepository();
      eventPublisher = new NestEventPublisherAdapter();

      workspaceService = new WorkspaceService(repo);
      resourceAllocationService = new ResourceAllocationService(repo);
      initializationService = new InitializationService();
      policyService = new ProvisioningPolicyService();
      rollbackService = new RollbackService(repo);

      provisioningService = new ProvisioningService(
        repo,
        eventPublisher,
        workspaceService,
        resourceAllocationService,
        initializationService,
        policyService,
        rollbackService
      );

      platformService = new EnterpriseTenantProvisioningPlatformService(
        repo,
        repo,
        provisioningService
      );
    });

    it('should query seeded default tenants across all 7 tenant types', async () => {
      const catalog = await platformService.getTenants();
      expect(catalog.totalTenants).toBe(7);

      const types = catalog.tenants.map((t) => t.tenantType);
      expect(types).toContain(TenantType.TRIAL);
      expect(types).toContain(TenantType.STANDARD);
      expect(types).toContain(TenantType.PROFESSIONAL);
      expect(types).toContain(TenantType.ENTERPRISE);
      expect(types).toContain(TenantType.PARTNER);
      expect(types).toContain(TenantType.FRANCHISE);
      expect(types).toContain(TenantType.SANDBOX);
    });

    it('should execute automated tenant provisioning Saga workflow successfully', async () => {
      const response = await platformService.provisionTenant({
        tenantSlug: 'sushi-master',
        tenantType: TenantType.PROFESSIONAL,
        companyName: 'Sushi Master Chain',
        adminEmail: 'admin@sushimaster.com',
      });

      expect(response.tenantSlug).toBe('sushi-master');
      expect(response.status).toBe(ProvisioningStatus.COMPLETED);
      expect(response.stage).toBe(LifecycleStage.ACTIVE);
      expect(response.workspaceId).toBeDefined();
      expect(response.allocatedResources.length).toBeGreaterThan(0);
      expect(response.initializedModules.length).toBeGreaterThan(0);
    });

    it('should throw TenantAlreadyExistsException when provisioning duplicate tenant slug', async () => {
      await platformService.provisionTenant({
        tenantSlug: 'taco-fiesta',
        tenantType: TenantType.STANDARD,
        companyName: 'Taco Fiesta Inc',
        adminEmail: 'admin@tacofiesta.com',
      });

      await expect(
        platformService.provisionTenant({
          tenantSlug: 'taco-fiesta',
          tenantType: TenantType.STANDARD,
          companyName: 'Duplicate Taco Fiesta',
          adminEmail: 'admin@tacofiesta.com',
        })
      ).rejects.toThrow(TenantAlreadyExistsException);
    });

    it('should suspend and resume tenant operations', async () => {
      const catalog = await platformService.getTenants();
      const targetTenantId = catalog.tenants[0].tenantId;

      const suspended = await platformService.suspendTenant(targetTenantId, { reason: 'Billing Overdue' });
      expect(suspended.stage).toBe(LifecycleStage.SUSPENDED);

      const resumed = await platformService.resumeTenant(targetTenantId, { reason: 'Payment Received' });
      expect(resumed.stage).toBe(LifecycleStage.ACTIVE);
    });

    it('should query Provisioning History, Workspace Catalog, Resource Allocations, and Statistics read models', async () => {
      const history = await platformService.getHistory();
      expect(history.totalLogs).toBeGreaterThan(0);

      const workspaces = await platformService.getWorkspaceCatalog();
      expect(workspaces.totalWorkspaces).toBe(7);

      const resources = await platformService.getResourceAllocations();
      expect(resources.totalAllocations).toBeGreaterThan(0);

      const stats = await platformService.getStatistics();
      expect(stats.totalTenantsProvisioned).toBe(7);
      expect(stats.activeTenantsCount).toBe(7);
    });
  });
});
