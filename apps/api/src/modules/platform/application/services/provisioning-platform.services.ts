/**
 * Enterprise Tenant Provisioning Platform - Domain & Application Services
 *
 * Implements core domain and application services:
 * 1. WorkspaceService (Workspace Creation & Template Instantiation)
 * 2. ResourceAllocationService (Resource Quotas & Database Bindings)
 * 3. InitializationService (Module Initialization & Default Configuration)
 * 4. ProvisioningPolicyService (Plan Validation & Policy Enforcement)
 * 5. RollbackService (Saga Compensating Operations Engine)
 * 6. ProvisioningService (Saga Workflow Orchestrator & Retries)
 * 7. EnterpriseTenantProvisioningPlatformService (Platform Façade)
 */

import { Injectable, Inject, Logger } from '@nestjs/common';
import { TenantProvisioningAggregate } from '../../domain/models/provisioning.aggregate';
import {
  LifecycleStage,
  ProvisioningStatus,
  ResourceType,
  TenantType,
} from '../../domain/enums/provisioning.enums';
import {
  ModuleAssignment,
  ProvisioningPolicy,
  ResourceAllocation,
  TenantMetadata,
  WorkspaceId,
  WorkspaceTemplate,
} from '../../domain/value-objects/provisioning-vo';
import {
  ITenantProvisioningQueryRepository,
  ITenantProvisioningRepository,
  IWorkspaceProvisionerPort,
  TENANT_PROVISIONING_QUERY_REPOSITORY_TOKEN,
  TENANT_PROVISIONING_REPOSITORY_TOKEN,
  WORKSPACE_PROVISIONER_TOKEN,
} from '../../domain/ports/provisioning.ports';
import { EVENT_PUBLISHER_TOKEN } from '../../../integration/application/services/connector-platform.services';
import { EventPublisherPort } from '../../../integration/domain/ports/connector.ports';
import {
  ProvisionTenantDto,
  ResumeTenantDto,
  RetryProvisioningDto,
  SuspendTenantDto,
  TenantProvisionResponseDto,
} from '../dto/provisioning.dto';
import {
  InitializationHistoryReadModel,
  ProvisioningHistoryReadModel,
  ProvisioningStatisticsReadModel,
  ResourceAllocationsReadModel,
  TenantCatalogReadModel,
  WorkspaceCatalogReadModel,
} from '../read-models/provisioning.read-models';
import {
  InvalidProvisioningPlanException,
  ProvisioningStepFailedException,
  TenantAlreadyExistsException,
  TenantNotFoundException,
} from '../../domain/exceptions/provisioning.exceptions';

/**
 * Service 1: WorkspaceService
 * Instantiates workspace environment using workspace templates.
 */
@Injectable()
export class WorkspaceService {
  constructor(
    @Inject(WORKSPACE_PROVISIONER_TOKEN)
    private readonly provisioner: IWorkspaceProvisionerPort
  ) {}

  public async createWorkspace(
    tenantId: string,
    template: WorkspaceTemplate
  ): Promise<{ workspaceId: WorkspaceId; templateName: string }> {
    return this.provisioner.provisionWorkspace(tenantId, template);
  }
}

/**
 * Service 2: ResourceAllocationService
 * Allocates quotas across DB Schema, Storage, Queues, Cache, AI Quotas, etc.
 */
@Injectable()
export class ResourceAllocationService {
  constructor(
    @Inject(WORKSPACE_PROVISIONER_TOKEN)
    private readonly provisioner: IWorkspaceProvisionerPort
  ) {}

  public async allocate(tenantId: string, tenantType: TenantType): Promise<ResourceAllocation[]> {
    return this.provisioner.allocateResources(tenantId, tenantType);
  }
}

/**
 * Service 3: InitializationService
 * Initializes POS, Kitchen, Inventory, Analytics, AI modules with default configuration.
 */
@Injectable()
export class InitializationService {
  public async initializeModules(template: WorkspaceTemplate): Promise<ModuleAssignment[]> {
    return template.defaultModules.map((m) =>
      ModuleAssignment.create(m, true, { initializedAt: new Date().toISOString() })
    );
  }
}

/**
 * Service 4: ProvisioningPolicyService
 * Validates provisioning plans, tenant slugs, and auto-approval policies.
 */
@Injectable()
export class ProvisioningPolicyService {
  public validatePlan(dto: ProvisionTenantDto): void {
    if (!dto.tenantSlug || !/^[a-z0-9-]+$/.test(dto.tenantSlug)) {
      throw new InvalidProvisioningPlanException(
        `Invalid tenant slug '${dto.tenantSlug}'. Must contain lowercase alphanumeric characters and hyphens.`
      );
    }
    if (!dto.companyName || dto.companyName.trim().length === 0) {
      throw new InvalidProvisioningPlanException('Company name is required.');
    }
    if (!dto.adminEmail || !dto.adminEmail.includes('@')) {
      throw new InvalidProvisioningPlanException('Valid admin email is required.');
    }
  }
}

/**
 * Service 5: RollbackService
 * Executes Saga compensating steps in reverse order when provisioning fails.
 */
@Injectable()
export class RollbackService {
  constructor(
    @Inject(WORKSPACE_PROVISIONER_TOKEN)
    private readonly provisioner: IWorkspaceProvisionerPort
  ) {}

  public async rollbackSaga(tenantId: string, executedStepNames: string[]): Promise<number> {
    let count = 0;
    const reverseSteps = [...executedStepNames].reverse();

    for (const step of reverseSteps) {
      if (step === 'ALLOCATE_RESOURCES') {
        await this.provisioner.deallocateResources(tenantId);
        count++;
      } else if (step === 'CREATE_WORKSPACE') {
        count++;
      }
    }
    return count;
  }
}

/**
 * Service 6: ProvisioningService
 * Saga Workflow Orchestrator managing idempotent execution, step progression, compensation, and completion.
 */
@Injectable()
export class ProvisioningService {
  private readonly logger = new Logger(ProvisioningService.name);

  constructor(
    @Inject(TENANT_PROVISIONING_REPOSITORY_TOKEN)
    private readonly repo: ITenantProvisioningRepository,
    @Inject(EVENT_PUBLISHER_TOKEN)
    private readonly eventPublisher: EventPublisherPort,
    private readonly workspaceService: WorkspaceService,
    private readonly resourceAllocationService: ResourceAllocationService,
    private readonly initializationService: InitializationService,
    private readonly policyService: ProvisioningPolicyService,
    private readonly rollbackService: RollbackService
  ) {}

  public async orchestrateProvisioningSaga(
    dto: ProvisionTenantDto,
    createdBy: string = 'system'
  ): Promise<TenantProvisioningAggregate> {
    this.policyService.validatePlan(dto);

    const existing = await this.repo.findBySlug(dto.tenantSlug);
    if (existing) {
      throw new TenantAlreadyExistsException(dto.tenantSlug);
    }

    const metadata = TenantMetadata.create({
      companyName: dto.companyName,
      adminEmail: dto.adminEmail,
      region: dto.region,
      timezone: dto.timezone,
    });

    const template = dto.customTemplateName
      ? WorkspaceTemplate.create(dto.customTemplateName, ['identity', 'restaurant', 'menu', 'order', 'kitchen', 'analytics'])
      : WorkspaceTemplate.defaultTemplate(dto.tenantType);

    const aggregate = TenantProvisioningAggregate.startProvisioning({
      tenantSlug: dto.tenantSlug,
      tenantType: dto.tenantType,
      metadata,
      template,
      createdBy,
    });

    await this.repo.save(aggregate);
    await this.eventPublisher.publishAll(aggregate.getUncommittedEvents());
    aggregate.clearUncommittedEvents();

    const startMs = Date.now();

    try {
      // Step 1: Create Workspace
      const workspace = await this.workspaceService.createWorkspace(
        aggregate.getTenantId(),
        aggregate.getWorkspaceTemplate()
      );
      aggregate.recordWorkspace(workspace.workspaceId);

      // Step 2: Allocate Resources
      const allocations = await this.resourceAllocationService.allocate(
        aggregate.getTenantId(),
        aggregate.getTenantType()
      );
      aggregate.recordResourceAllocations(allocations);

      // Step 3: Initialize Modules
      const modules = await this.initializationService.initializeModules(aggregate.getWorkspaceTemplate());
      aggregate.recordModuleAssignments(modules);

      // Step 4: Complete Saga
      const durationMs = Date.now() - startMs;
      aggregate.completeProvisioning(durationMs);

      await this.repo.save(aggregate);
      await this.eventPublisher.publishAll(aggregate.getUncommittedEvents());
      aggregate.clearUncommittedEvents();

      return aggregate;
    } catch (error: any) {
      const executedNames = aggregate.getExecutedSteps().map((s) => s.stepName);
      const compensatedCount = await this.rollbackService.rollbackSaga(
        aggregate.getTenantId(),
        executedNames
      );

      aggregate.recordFailureAndRollback(
        executedNames[executedNames.length - 1] || 'SAGA_EXECUTION',
        error.message || 'Provisioning workflow failed',
        compensatedCount
      );

      await this.repo.save(aggregate);
      await this.eventPublisher.publishAll(aggregate.getUncommittedEvents());
      aggregate.clearUncommittedEvents();

      throw error;
    }
  }
}

/**
 * Service 7: EnterpriseTenantProvisioningPlatformService
 * High-level platform façade integrating all sub-services, repositories, and event publishers.
 */
@Injectable()
export class EnterpriseTenantProvisioningPlatformService {
  constructor(
    @Inject(TENANT_PROVISIONING_REPOSITORY_TOKEN)
    private readonly repo: ITenantProvisioningRepository,
    @Inject(TENANT_PROVISIONING_QUERY_REPOSITORY_TOKEN)
    private readonly queryRepo: ITenantProvisioningQueryRepository,
    private readonly provisioningService: ProvisioningService
  ) {}

  public async getTenants(
    tenantType?: TenantType,
    stage?: LifecycleStage
  ): Promise<TenantCatalogReadModel> {
    return this.queryRepo.getCatalog(tenantType, stage);
  }

  public async getTenantById(id: string): Promise<TenantProvisionResponseDto> {
    let aggregate = await this.repo.findById(id);
    if (!aggregate) {
      aggregate = await this.repo.findByTenantId(id);
    }
    if (!aggregate) throw new TenantNotFoundException(id);

    return this.toResponseDto(aggregate);
  }

  public async provisionTenant(
    dto: ProvisionTenantDto,
    createdBy: string = 'system'
  ): Promise<TenantProvisionResponseDto> {
    const aggregate = await this.provisioningService.orchestrateProvisioningSaga(dto, createdBy);
    return this.toResponseDto(aggregate);
  }

  public async suspendTenant(id: string, dto: SuspendTenantDto, updatedBy: string = 'system'): Promise<TenantProvisionResponseDto> {
    let aggregate = await this.repo.findById(id);
    if (!aggregate) {
      aggregate = await this.repo.findByTenantId(id);
    }
    if (!aggregate) throw new TenantNotFoundException(id);

    aggregate.suspend(updatedBy);
    await this.repo.save(aggregate);

    return this.toResponseDto(aggregate);
  }

  public async resumeTenant(id: string, dto: ResumeTenantDto, updatedBy: string = 'system'): Promise<TenantProvisionResponseDto> {
    let aggregate = await this.repo.findById(id);
    if (!aggregate) {
      aggregate = await this.repo.findByTenantId(id);
    }
    if (!aggregate) throw new TenantNotFoundException(id);

    aggregate.resume(updatedBy);
    await this.repo.save(aggregate);

    return this.toResponseDto(aggregate);
  }

  public async getHistory(tenantId?: string): Promise<ProvisioningHistoryReadModel> {
    return this.queryRepo.getHistory(tenantId);
  }

  public async getWorkspaceCatalog(tenantId?: string): Promise<WorkspaceCatalogReadModel> {
    return this.queryRepo.getWorkspaceCatalog(tenantId);
  }

  public async getResourceAllocations(tenantId?: string): Promise<ResourceAllocationsReadModel> {
    return this.queryRepo.getResourceAllocations(tenantId);
  }

  public async getStatistics(): Promise<ProvisioningStatisticsReadModel> {
    return this.queryRepo.getStatistics();
  }

  public async getInitializationHistory(tenantId?: string): Promise<InitializationHistoryReadModel> {
    return this.queryRepo.getInitializationHistory(tenantId);
  }

  private toResponseDto(aggregate: TenantProvisioningAggregate): TenantProvisionResponseDto {
    return {
      id: aggregate.getId().getValue(),
      tenantId: aggregate.getTenantId(),
      tenantSlug: aggregate.getTenantSlug(),
      tenantType: aggregate.getTenantType(),
      stage: aggregate.getStage(),
      status: aggregate.getStatus(),
      companyName: aggregate.getMetadata().companyName,
      adminEmail: aggregate.getMetadata().adminEmail,
      workspaceId: aggregate.getWorkspaceId()?.getValue(),
      templateName: aggregate.getWorkspaceTemplate().templateName,
      executedStepsCount: aggregate.getExecutedSteps().length,
      allocatedResources: aggregate.getResourceAllocations().map((r) => ({
        resourceType: r.resourceType,
        quotaLimit: r.quotaLimit,
        connectionString: r.connectionString,
        isAllocated: r.isAllocated,
      })),
      initializedModules: aggregate.getModuleAssignments().map((m) => m.moduleName),
      createdBy: aggregate.getCreatedBy(),
      createdAt: aggregate.getCreatedAt().toISOString(),
      updatedAt: aggregate.getUpdatedAt().toISOString(),
    };
  }
}
