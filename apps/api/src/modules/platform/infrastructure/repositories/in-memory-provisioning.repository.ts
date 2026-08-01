/**
 * Enterprise Tenant Provisioning Platform - Infrastructure Repository & Workspace Provisioner
 *
 * Implements ITenantProvisioningRepository, ITenantProvisioningQueryRepository, and IWorkspaceProvisionerPort for multi-tenant persistence,
 * CQRS read projections, workspace creation, resource allocation reservations, and seed defaults.
 */

import { Injectable } from '@nestjs/common';
import { TenantProvisioningAggregate } from '../../domain/models/provisioning.aggregate';
import { LifecycleStage, ProvisioningStatus, ResourceType, TenantType } from '../../domain/enums/provisioning.enums';
import {
  ModuleAssignment,
  ProvisioningPlan,
  ProvisioningPolicy,
  ResourceAllocation,
  TenantMetadata,
  TenantProvisionId,
  WorkspaceId,
  WorkspaceTemplate,
} from '../../domain/value-objects/provisioning-vo';
import {
  ITenantProvisioningQueryRepository,
  ITenantProvisioningRepository,
  IWorkspaceProvisionerPort,
} from '../../domain/ports/provisioning.ports';
import {
  InitializationHistoryReadModel,
  ProvisioningHistoryReadModel,
  ProvisioningStatisticsReadModel,
  ResourceAllocationsReadModel,
  TenantCatalogReadModel,
  WorkspaceCatalogReadModel,
} from '../../application/read-models/provisioning.read-models';

@Injectable()
export class InMemoryTenantProvisioningRepository
  implements ITenantProvisioningRepository, ITenantProvisioningQueryRepository, IWorkspaceProvisionerPort
{
  private readonly tenantMap = new Map<string, TenantProvisioningAggregate>();
  private readonly historyLogs: Array<{
    logId: string;
    provisionId: string;
    tenantId: string;
    tenantSlug: string;
    status: ProvisioningStatus;
    stage: LifecycleStage;
    durationMs: number;
    failureReason?: string;
    timestamp: Date;
  }> = [];

  constructor() {
    this.seedDefaultTenants();
  }

  // --- ITenantProvisioningRepository Implementation ---

  public async save(provisioning: TenantProvisioningAggregate): Promise<void> {
    this.tenantMap.set(provisioning.getId().getValue(), provisioning);

    this.historyLogs.unshift({
      logId: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      provisionId: provisioning.getId().getValue(),
      tenantId: provisioning.getTenantId(),
      tenantSlug: provisioning.getTenantSlug(),
      status: provisioning.getStatus(),
      stage: provisioning.getStage(),
      durationMs: 120,
      timestamp: new Date(),
    });
  }

  public async findById(id: string): Promise<TenantProvisioningAggregate | null> {
    const aggregate = this.tenantMap.get(id);
    if (!aggregate) return null;
    return aggregate;
  }

  public async findByTenantId(tenantId: string): Promise<TenantProvisioningAggregate | null> {
    for (const aggregate of this.tenantMap.values()) {
      if (aggregate.getTenantId() === tenantId) {
        return aggregate;
      }
    }
    return null;
  }

  public async findBySlug(slug: string): Promise<TenantProvisioningAggregate | null> {
    for (const aggregate of this.tenantMap.values()) {
      if (aggregate.getTenantSlug().toLowerCase() === slug.toLowerCase()) {
        return aggregate;
      }
    }
    return null;
  }

  public async findAll(tenantType?: TenantType, stage?: LifecycleStage): Promise<TenantProvisioningAggregate[]> {
    const list: TenantProvisioningAggregate[] = [];
    for (const aggregate of this.tenantMap.values()) {
      if (tenantType && aggregate.getTenantType() !== tenantType) continue;
      if (stage && aggregate.getStage() !== stage) continue;
      list.push(aggregate);
    }
    return list;
  }

  public async delete(id: string): Promise<boolean> {
    return this.tenantMap.delete(id);
  }

  // --- ITenantProvisioningQueryRepository Implementation ---

  public async getCatalog(tenantType?: TenantType, stage?: LifecycleStage): Promise<TenantCatalogReadModel> {
    const list = await this.findAll(tenantType, stage);

    const tenants = list.map((t) => ({
      id: t.getId().getValue(),
      tenantId: t.getTenantId(),
      tenantSlug: t.getTenantSlug(),
      tenantType: t.getTenantType(),
      stage: t.getStage(),
      status: t.getStatus(),
      companyName: t.getMetadata().companyName,
      adminEmail: t.getMetadata().adminEmail,
      workspaceId: t.getWorkspaceId()?.getValue(),
      templateName: t.getWorkspaceTemplate().templateName,
      executedStepsCount: t.getExecutedSteps().length,
      allocatedResourcesCount: t.getResourceAllocations().length,
      createdBy: t.getCreatedBy(),
      createdAt: t.getCreatedAt().toISOString(),
      updatedAt: t.getUpdatedAt().toISOString(),
    }));

    return {
      totalTenants: tenants.length,
      tenants,
    };
  }

  public async getHistory(tenantId?: string): Promise<ProvisioningHistoryReadModel> {
    const filtered = tenantId
      ? this.historyLogs.filter((h) => h.tenantId === tenantId)
      : this.historyLogs;

    return {
      tenantId,
      totalLogs: filtered.length,
      history: filtered.map((h) => ({
        logId: h.logId,
        provisionId: h.provisionId,
        tenantId: h.tenantId,
        tenantSlug: h.tenantSlug,
        status: h.status,
        stage: h.stage,
        durationMs: h.durationMs,
        failureReason: h.failureReason,
        timestamp: h.timestamp.toISOString(),
      })),
    };
  }

  public async getWorkspaceCatalog(tenantId?: string): Promise<WorkspaceCatalogReadModel> {
    const list = tenantId
      ? [await this.findByTenantId(tenantId)].filter((t): t is TenantProvisioningAggregate => t !== null)
      : Array.from(this.tenantMap.values());

    const workspaces = list
      .filter((t) => t.getWorkspaceId() !== undefined)
      .map((t) => ({
        workspaceId: t.getWorkspaceId()!.getValue(),
        tenantId: t.getTenantId(),
        tenantSlug: t.getTenantSlug(),
        templateName: t.getWorkspaceTemplate().templateName,
        defaultModules: t.getWorkspaceTemplate().defaultModules,
        createdAt: t.getCreatedAt().toISOString(),
      }));

    return {
      tenantId,
      totalWorkspaces: workspaces.length,
      workspaces,
    };
  }

  public async getResourceAllocations(tenantId?: string): Promise<ResourceAllocationsReadModel> {
    const list = tenantId
      ? [await this.findByTenantId(tenantId)].filter((t): t is TenantProvisioningAggregate => t !== null)
      : Array.from(this.tenantMap.values());

    const items: any[] = [];
    list.forEach((t) => {
      t.getResourceAllocations().forEach((r) => {
        items.push({
          tenantId: t.getTenantId(),
          resourceType: r.resourceType,
          quotaLimit: r.quotaLimit,
          connectionString: r.connectionString,
          isAllocated: r.isAllocated,
        });
      });
    });

    return {
      tenantId,
      totalAllocations: items.length,
      allocations: items,
    };
  }

  public async getStatistics(): Promise<ProvisioningStatisticsReadModel> {
    const list = Array.from(this.tenantMap.values());

    const byTenantType: Record<TenantType, number> = {} as any;
    for (const t of Object.values(TenantType)) byTenantType[t] = 0;

    const byStage: Record<LifecycleStage, number> = {} as any;
    for (const s of Object.values(LifecycleStage)) byStage[s] = 0;

    const byStatus: Record<ProvisioningStatus, number> = {} as any;
    for (const st of Object.values(ProvisioningStatus)) byStatus[st] = 0;

    let activeCount = 0;
    let suspendedCount = 0;

    list.forEach((t) => {
      byTenantType[t.getTenantType()] = (byTenantType[t.getTenantType()] || 0) + 1;
      byStage[t.getStage()] = (byStage[t.getStage()] || 0) + 1;
      byStatus[t.getStatus()] = (byStatus[t.getStatus()] || 0) + 1;
      if (t.getStage() === LifecycleStage.ACTIVE) activeCount++;
      if (t.getStage() === LifecycleStage.SUSPENDED) suspendedCount++;
    });

    return {
      totalTenantsProvisioned: list.length,
      activeTenantsCount: activeCount,
      suspendedTenantsCount: suspendedCount,
      byTenantType,
      byStage,
      byStatus,
      averageProvisioningDurationMs: 145.0,
      rollbackRatePercentage: 0.0,
    };
  }

  public async getInitializationHistory(tenantId?: string): Promise<InitializationHistoryReadModel> {
    const list = tenantId
      ? [await this.findByTenantId(tenantId)].filter((t): t is TenantProvisioningAggregate => t !== null)
      : Array.from(this.tenantMap.values());

    const steps: any[] = [];
    list.forEach((t) => {
      t.getExecutedSteps().forEach((s) => {
        steps.push({
          stepName: s.stepName,
          tenantId: t.getTenantId(),
          status: s.status,
          executionTimeMs: s.executionTimeMs,
          compensationName: s.compensationName,
          errorMessage: s.errorMessage,
          timestamp: t.getUpdatedAt().toISOString(),
        });
      });
    });

    return {
      tenantId,
      totalStepsExecuted: steps.length,
      steps,
    };
  }

  // --- IWorkspaceProvisionerPort Implementation ---

  public async provisionWorkspace(
    tenantId: string,
    template: WorkspaceTemplate
  ): Promise<{ workspaceId: WorkspaceId; templateName: string }> {
    const workspaceId = WorkspaceId.create();
    return { workspaceId, templateName: template.templateName };
  }

  public async allocateResources(
    tenantId: string,
    tenantType: TenantType
  ): Promise<ResourceAllocation[]> {
    const isEnterprise = tenantType === TenantType.ENTERPRISE || tenantType === TenantType.FRANCHISE;

    return [
      ResourceAllocation.create({
        resourceType: ResourceType.DATABASE_SCHEMA,
        quotaLimit: isEnterprise ? 500 : 50,
        connectionString: `postgresql://db-cluster.internal:5432/${tenantId}_db`,
      }),
      ResourceAllocation.create({
        resourceType: ResourceType.STORAGE,
        quotaLimit: isEnterprise ? 1000 : 100, // GB
      }),
      ResourceAllocation.create({
        resourceType: ResourceType.QUEUES,
        quotaLimit: isEnterprise ? 20 : 5,
      }),
      ResourceAllocation.create({
        resourceType: ResourceType.CACHE,
        quotaLimit: isEnterprise ? 64 : 8, // GB Redis
      }),
      ResourceAllocation.create({
        resourceType: ResourceType.AI_QUOTA,
        quotaLimit: isEnterprise ? 1000000 : 50000, // Tokens/mo
      }),
    ];
  }

  public async deallocateResources(tenantId: string): Promise<boolean> {
    return true;
  }

  // Seed Out-of-the-box Default Tenants across all 7 Tenant Types
  private seedDefaultTenants(): void {
    const seedDefs = [
      { slug: 'trial-bistro', type: TenantType.TRIAL, company: 'Trial Bistro & Cafe', email: 'admin@trialbistro.com' },
      { slug: 'standard-diner', type: TenantType.STANDARD, company: 'Standard City Diner', email: 'owner@standarddiner.com' },
      { slug: 'pro-pizzeria', type: TenantType.PROFESSIONAL, company: 'Pro Artisan Pizzeria Group', email: 'ops@propizzeria.com' },
      { slug: 'enterprise-hospitality', type: TenantType.ENTERPRISE, company: 'Global Hospitality Enterprise Inc', email: 'cto@globalhospitality.com' },
      { slug: 'partner-integrators', type: TenantType.PARTNER, company: 'POS Partner Integrators', email: 'dev@partnerintegrators.com' },
      { slug: 'franchise-burger', type: TenantType.FRANCHISE, company: 'National Burger Franchise Network', email: 'franchise@nationalburger.com' },
      { slug: 'sandbox-dev', type: TenantType.SANDBOX, company: 'Developer Sandbox Test Tenant', email: 'sandbox@restaurant-saas.internal' },
    ];

    seedDefs.forEach((def, idx) => {
      const id = TenantProvisionId.create(`tp-seed-${idx + 1}`);
      const tenantId = `tenant-${def.slug}`;
      const metadata = TenantMetadata.create({ companyName: def.company, adminEmail: def.email });
      const template = WorkspaceTemplate.defaultTemplate(def.type);
      const policy = ProvisioningPolicy.defaultPolicy();
      const plan = ProvisioningPlan.standardSagaPlan();
      const workspaceId = WorkspaceId.create(`ws-seed-${idx + 1}`);

      const aggregate = TenantProvisioningAggregate.reconstitute({
        id,
        tenantId,
        tenantSlug: def.slug,
        tenantType: def.type,
        stage: LifecycleStage.ACTIVE,
        status: ProvisioningStatus.COMPLETED,
        workspaceId,
        workspaceTemplate: template,
        plan,
        executedSteps: [],
        resourceAllocations: [
          ResourceAllocation.create({ resourceType: ResourceType.DATABASE_SCHEMA, quotaLimit: 100 }),
          ResourceAllocation.create({ resourceType: ResourceType.STORAGE, quotaLimit: 50 }),
        ],
        moduleAssignments: template.defaultModules.map((m) => ModuleAssignment.create(m, true)),
        metadata,
        policy,
        createdBy: 'system-seeder',
        updatedBy: 'system-seeder',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      this.tenantMap.set(id.getValue(), aggregate);
      this.historyLogs.push({
        logId: `log-seed-${idx + 1}`,
        provisionId: id.getValue(),
        tenantId,
        tenantSlug: def.slug,
        status: ProvisioningStatus.COMPLETED,
        stage: LifecycleStage.ACTIVE,
        durationMs: 145,
        timestamp: new Date(),
      });
    });
  }
}
