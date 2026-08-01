/**
 * Enterprise Tenant Provisioning Platform - Domain Aggregate Root
 *
 * TenantProvisioningAggregate encapsulates automated onboarding workflows, lifecycle stages
 * (PROVISIONING -> INITIALIZING -> ACTIVE -> SUSPENDED -> ARCHIVED -> DELETED),
 * Saga step execution tracking, resource allocations, module assignments, compensation rollbacks,
 * and domain event publishing.
 */

import {
  InitializationStatus,
  LifecycleStage,
  ProvisioningStatus,
  ResourceType,
  TenantType,
} from '../enums/provisioning.enums';
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
} from '../value-objects/provisioning-vo';
import { BasePlatformDomainEvent } from '../events/health.events';
import {
  ModulesInitializedEvent,
  ProvisioningCompletedEvent,
  ProvisioningFailedEvent,
  ProvisioningRolledBackEvent,
  ProvisioningStartedEvent,
  ResourcesAllocatedEvent,
  WorkspaceCreatedEvent,
} from '../events/provisioning.events';

export interface StartProvisioningProps {
  tenantSlug: string;
  tenantType: TenantType;
  metadata: TenantMetadata;
  template?: WorkspaceTemplate;
  policy?: ProvisioningPolicy;
  createdBy?: string;
}

export class TenantProvisioningAggregate {
  private readonly id: TenantProvisionId;
  private readonly tenantId: string;
  private readonly tenantSlug: string;
  private readonly tenantType: TenantType;
  private stage: LifecycleStage;
  private status: ProvisioningStatus;
  private workspaceId?: WorkspaceId;
  private workspaceTemplate: WorkspaceTemplate;
  private plan: ProvisioningPlan;
  private executedSteps: InitializationStep[];
  private resourceAllocations: ResourceAllocation[];
  private moduleAssignments: ModuleAssignment[];
  private metadata: TenantMetadata;
  private policy: ProvisioningPolicy;
  private createdBy: string;
  private updatedBy: string;
  private readonly createdAt: Date;
  private updatedAt: Date;
  private uncommittedEvents: BasePlatformDomainEvent[] = [];

  private constructor(props: {
    id: TenantProvisionId;
    tenantId: string;
    tenantSlug: string;
    tenantType: TenantType;
    stage: LifecycleStage;
    status: ProvisioningStatus;
    workspaceId?: WorkspaceId;
    workspaceTemplate: WorkspaceTemplate;
    plan: ProvisioningPlan;
    executedSteps?: InitializationStep[];
    resourceAllocations?: ResourceAllocation[];
    moduleAssignments?: ModuleAssignment[];
    metadata: TenantMetadata;
    policy: ProvisioningPolicy;
    createdBy?: string;
    updatedBy?: string;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    this.id = props.id;
    this.tenantId = props.tenantId;
    this.tenantSlug = props.tenantSlug;
    this.tenantType = props.tenantType;
    this.stage = props.stage;
    this.status = props.status;
    this.workspaceId = props.workspaceId;
    this.workspaceTemplate = props.workspaceTemplate;
    this.plan = props.plan;
    this.executedSteps = props.executedSteps || [];
    this.resourceAllocations = props.resourceAllocations || [];
    this.moduleAssignments = props.moduleAssignments || [];
    this.metadata = props.metadata;
    this.policy = props.policy;
    this.createdBy = props.createdBy || 'system';
    this.updatedBy = props.updatedBy || props.createdBy || 'system';
    this.createdAt = props.createdAt || new Date();
    this.updatedAt = props.updatedAt || new Date();
  }

  /**
   * Factory method to start a new Tenant Provisioning Saga Aggregate
   */
  public static startProvisioning(props: StartProvisioningProps): TenantProvisioningAggregate {
    const id = TenantProvisionId.create();
    const tenantId = `tenant-${props.tenantSlug.toLowerCase()}`;
    const template = props.template || WorkspaceTemplate.defaultTemplate(props.tenantType);
    const policy = props.policy || ProvisioningPolicy.defaultPolicy();
    const plan = ProvisioningPlan.standardSagaPlan();

    const aggregate = new TenantProvisioningAggregate({
      id,
      tenantId,
      tenantSlug: props.tenantSlug,
      tenantType: props.tenantType,
      stage: LifecycleStage.PROVISIONING,
      status: ProvisioningStatus.RUNNING,
      workspaceTemplate: template,
      plan,
      metadata: props.metadata,
      policy,
      createdBy: props.createdBy,
    });

    aggregate.addDomainEvent(
      new ProvisioningStartedEvent(
        id.getValue(),
        tenantId,
        props.tenantSlug,
        props.tenantType
      )
    );

    return aggregate;
  }

  /**
   * Reconstitute aggregate from persistent storage
   */
  public static reconstitute(props: {
    id: TenantProvisionId;
    tenantId: string;
    tenantSlug: string;
    tenantType: TenantType;
    stage: LifecycleStage;
    status: ProvisioningStatus;
    workspaceId?: WorkspaceId;
    workspaceTemplate: WorkspaceTemplate;
    plan: ProvisioningPlan;
    executedSteps: InitializationStep[];
    resourceAllocations: ResourceAllocation[];
    moduleAssignments: ModuleAssignment[];
    metadata: TenantMetadata;
    policy: ProvisioningPolicy;
    createdBy: string;
    updatedBy: string;
    createdAt: Date;
    updatedAt: Date;
  }): TenantProvisioningAggregate {
    return new TenantProvisioningAggregate(props);
  }

  // Getters
  public getId(): TenantProvisionId {
    return this.id;
  }

  public getTenantId(): string {
    return this.tenantId;
  }

  public getTenantSlug(): string {
    return this.tenantSlug;
  }

  public getTenantType(): TenantType {
    return this.tenantType;
  }

  public getStage(): LifecycleStage {
    return this.stage;
  }

  public getStatus(): ProvisioningStatus {
    return this.status;
  }

  public getWorkspaceId(): WorkspaceId | undefined {
    return this.workspaceId;
  }

  public getWorkspaceTemplate(): WorkspaceTemplate {
    return this.workspaceTemplate;
  }

  public getPlan(): ProvisioningPlan {
    return this.plan;
  }

  public getExecutedSteps(): InitializationStep[] {
    return [...this.executedSteps];
  }

  public getResourceAllocations(): ResourceAllocation[] {
    return [...this.resourceAllocations];
  }

  public getModuleAssignments(): ModuleAssignment[] {
    return [...this.moduleAssignments];
  }

  public getMetadata(): TenantMetadata {
    return this.metadata;
  }

  public getPolicy(): ProvisioningPolicy {
    return this.policy;
  }

  public getCreatedBy(): string {
    return this.createdBy;
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

  // Aggregate Mutations & Saga Steps
  public recordWorkspace(workspaceId: WorkspaceId): void {
    this.workspaceId = workspaceId;
    this.stage = LifecycleStage.INITIALIZING;
    this.executedSteps.push(
      InitializationStep.create({
        stepName: 'CREATE_WORKSPACE',
        status: InitializationStatus.COMPLETED,
        executionTimeMs: 45,
        compensationName: 'REMOVE_WORKSPACE',
      })
    );
    this.updatedAt = new Date();

    this.addDomainEvent(
      new WorkspaceCreatedEvent(
        this.id.getValue(),
        this.tenantId,
        workspaceId.getValue(),
        this.workspaceTemplate.templateName
      )
    );
  }

  public recordResourceAllocations(allocations: ResourceAllocation[]): void {
    this.resourceAllocations = allocations;
    this.executedSteps.push(
      InitializationStep.create({
        stepName: 'ALLOCATE_RESOURCES',
        status: InitializationStatus.COMPLETED,
        executionTimeMs: 60,
        compensationName: 'DEALLOCATE_RESOURCES',
      })
    );
    this.updatedAt = new Date();

    this.addDomainEvent(
      new ResourcesAllocatedEvent(
        this.id.getValue(),
        this.tenantId,
        allocations.length
      )
    );
  }

  public recordModuleAssignments(assignments: ModuleAssignment[]): void {
    this.moduleAssignments = assignments;
    this.executedSteps.push(
      InitializationStep.create({
        stepName: 'INITIALIZE_MODULES',
        status: InitializationStatus.COMPLETED,
        executionTimeMs: 80,
        compensationName: 'DISABLE_MODULES',
      })
    );
    this.updatedAt = new Date();

    this.addDomainEvent(
      new ModulesInitializedEvent(
        this.id.getValue(),
        this.tenantId,
        assignments.map((m) => m.moduleName)
      )
    );
  }

  public completeProvisioning(durationMs: number): void {
    this.status = ProvisioningStatus.COMPLETED;
    this.stage = LifecycleStage.ACTIVE;
    this.executedSteps.push(
      InitializationStep.create({
        stepName: 'APPLY_DEFAULT_CONFIG',
        status: InitializationStatus.COMPLETED,
        executionTimeMs: 25,
      })
    );
    this.updatedAt = new Date();

    this.addDomainEvent(
      new ProvisioningCompletedEvent(
        this.id.getValue(),
        this.tenantId,
        this.tenantSlug,
        this.stage,
        durationMs
      )
    );
  }

  public recordFailureAndRollback(failedStep: string, reason: string, compensatedStepsCount: number): void {
    this.status = ProvisioningStatus.ROLLED_BACK;
    this.stage = LifecycleStage.DELETED;
    this.executedSteps.push(
      InitializationStep.create({
        stepName: failedStep,
        status: InitializationStatus.FAILED,
        errorMessage: reason,
      })
    );
    this.updatedAt = new Date();

    this.addDomainEvent(
      new ProvisioningFailedEvent(
        this.id.getValue(),
        this.tenantId,
        failedStep,
        reason
      )
    );

    this.addDomainEvent(
      new ProvisioningRolledBackEvent(
        this.id.getValue(),
        this.tenantId,
        compensatedStepsCount,
        reason
      )
    );
  }

  public suspend(updatedBy: string = 'system'): void {
    this.stage = LifecycleStage.SUSPENDED;
    this.updatedBy = updatedBy;
    this.updatedAt = new Date();
  }

  public resume(updatedBy: string = 'system'): void {
    this.stage = LifecycleStage.ACTIVE;
    this.updatedBy = updatedBy;
    this.updatedAt = new Date();
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
