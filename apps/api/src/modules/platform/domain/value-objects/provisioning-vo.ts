/**
 * Enterprise Tenant Provisioning Platform - Value Objects
 *
 * Immutable Value Objects encapsulating tenant provisioning identity, workspaces, templates,
 * provisioning plans, initialization steps, resource allocations, module assignments, results, metadata, and policies.
 */

import { InitializationStatus, ProvisioningStatus, ResourceType, TenantType } from '../enums/provisioning.enums';
import { InvalidProvisioningPlanException } from '../exceptions/provisioning.exceptions';

/**
 * TenantProvisionId Value Object
 */
export class TenantProvisionId {
  private readonly value: string;

  private constructor(value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('TenantProvisionId cannot be empty');
    }
    this.value = value;
  }

  public static create(id?: string): TenantProvisionId {
    return new TenantProvisionId(id || `tp-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`);
  }

  public static fromString(id: string): TenantProvisionId {
    return new TenantProvisionId(id);
  }

  public getValue(): string {
    return this.value;
  }

  public equals(other: TenantProvisionId): boolean {
    return this.value === other.getValue();
  }
}

/**
 * WorkspaceId Value Object
 */
export class WorkspaceId {
  private readonly value: string;

  private constructor(value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('WorkspaceId cannot be empty');
    }
    this.value = value;
  }

  public static create(id?: string): WorkspaceId {
    return new WorkspaceId(id || `ws-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`);
  }

  public getValue(): string {
    return this.value;
  }
}

/**
 * WorkspaceTemplate Value Object
 */
export class WorkspaceTemplate {
  public readonly templateName: string;
  public readonly defaultModules: string[];
  public readonly defaultSettings: Record<string, unknown>;

  private constructor(templateName: string, defaultModules: string[], defaultSettings?: Record<string, unknown>) {
    this.templateName = templateName;
    this.defaultModules = defaultModules;
    this.defaultSettings = defaultSettings || {};
  }

  public static create(templateName: string, defaultModules: string[], defaultSettings?: Record<string, unknown>): WorkspaceTemplate {
    return new WorkspaceTemplate(templateName, defaultModules, defaultSettings);
  }

  public static defaultTemplate(tenantType: TenantType): WorkspaceTemplate {
    const modules = ['identity', 'restaurant', 'menu', 'order', 'kitchen', 'analytics'];
    if (tenantType === TenantType.ENTERPRISE || tenantType === TenantType.FRANCHISE) {
      modules.push('automation', 'integration', 'ai', 'platform');
    }
    return new WorkspaceTemplate(`${tenantType.toLowerCase()}-standard-template`, modules);
  }
}

/**
 * InitializationStep Value Object
 */
export class InitializationStep {
  public readonly stepName: string;
  public readonly status: InitializationStatus;
  public readonly executionTimeMs: number;
  public readonly compensationName?: string;
  public readonly errorMessage?: string;

  private constructor(props: {
    stepName: string;
    status: InitializationStatus;
    executionTimeMs?: number;
    compensationName?: string;
    errorMessage?: string;
  }) {
    this.stepName = props.stepName;
    this.status = props.status;
    this.executionTimeMs = props.executionTimeMs ?? 0;
    this.compensationName = props.compensationName;
    this.errorMessage = props.errorMessage;
  }

  public static create(props: {
    stepName: string;
    status: InitializationStatus;
    executionTimeMs?: number;
    compensationName?: string;
    errorMessage?: string;
  }): InitializationStep {
    return new InitializationStep(props);
  }
}

/**
 * ProvisioningPlan Value Object
 */
export class ProvisioningPlan {
  public readonly steps: string[];
  public readonly timeoutMs: number;
  public readonly retryAttempts: number;

  private constructor(steps: string[], timeoutMs: number = 30000, retryAttempts: number = 3) {
    if (steps.length === 0) {
      throw new InvalidProvisioningPlanException('ProvisioningPlan must contain at least one step');
    }
    this.steps = steps;
    this.timeoutMs = timeoutMs;
    this.retryAttempts = retryAttempts;
  }

  public static create(steps: string[], timeoutMs?: number, retryAttempts?: number): ProvisioningPlan {
    return new ProvisioningPlan(steps, timeoutMs, retryAttempts);
  }

  public static standardSagaPlan(): ProvisioningPlan {
    return new ProvisioningPlan([
      'VALIDATE_PLAN',
      'CREATE_WORKSPACE',
      'ALLOCATE_RESOURCES',
      'INITIALIZE_MODULES',
      'APPLY_DEFAULT_CONFIG',
    ]);
  }
}

/**
 * ResourceAllocation Value Object
 */
export class ResourceAllocation {
  public readonly resourceType: ResourceType;
  public readonly quotaLimit: number;
  public readonly connectionString?: string;
  public readonly isAllocated: boolean;

  private constructor(props: {
    resourceType: ResourceType;
    quotaLimit: number;
    connectionString?: string;
    isAllocated?: boolean;
  }) {
    this.resourceType = props.resourceType;
    this.quotaLimit = props.quotaLimit;
    this.connectionString = props.connectionString;
    this.isAllocated = props.isAllocated ?? true;
  }

  public static create(props: {
    resourceType: ResourceType;
    quotaLimit: number;
    connectionString?: string;
    isAllocated?: boolean;
  }): ResourceAllocation {
    return new ResourceAllocation(props);
  }
}

/**
 * ModuleAssignment Value Object
 */
export class ModuleAssignment {
  public readonly moduleName: string;
  public readonly isEnabled: boolean;
  public readonly configDefaults: Record<string, unknown>;

  private constructor(moduleName: string, isEnabled: boolean = true, configDefaults?: Record<string, unknown>) {
    this.moduleName = moduleName;
    this.isEnabled = isEnabled;
    this.configDefaults = configDefaults || {};
  }

  public static create(moduleName: string, isEnabled: boolean = true, configDefaults?: Record<string, unknown>): ModuleAssignment {
    return new ModuleAssignment(moduleName, isEnabled, configDefaults);
  }
}

/**
 * ProvisioningResult Value Object
 */
export class ProvisioningResult {
  public readonly status: ProvisioningStatus;
  public readonly stepsExecutedCount: number;
  public readonly failureReason?: string;
  public readonly rollbackCompleted: boolean;

  private constructor(props: {
    status: ProvisioningStatus;
    stepsExecutedCount: number;
    failureReason?: string;
    rollbackCompleted?: boolean;
  }) {
    this.status = props.status;
    this.stepsExecutedCount = props.stepsExecutedCount;
    this.failureReason = props.failureReason;
    this.rollbackCompleted = props.rollbackCompleted ?? false;
  }

  public static success(stepsCount: number): ProvisioningResult {
    return new ProvisioningResult({ status: ProvisioningStatus.COMPLETED, stepsExecutedCount: stepsCount });
  }

  public static failed(stepsCount: number, reason: string, rollbackCompleted: boolean = true): ProvisioningResult {
    return new ProvisioningResult({
      status: rollbackCompleted ? ProvisioningStatus.ROLLED_BACK : ProvisioningStatus.FAILED,
      stepsExecutedCount: stepsCount,
      failureReason: reason,
      rollbackCompleted,
    });
  }
}

/**
 * TenantMetadata Value Object
 */
export class TenantMetadata {
  public readonly companyName: string;
  public readonly adminEmail: string;
  public readonly region: string;
  public readonly timezone: string;

  private constructor(companyName: string, adminEmail: string, region?: string, timezone?: string) {
    this.companyName = companyName.trim();
    this.adminEmail = adminEmail.trim().toLowerCase();
    this.region = region || 'us-east-1';
    this.timezone = timezone || 'UTC';
  }

  public static create(props: {
    companyName: string;
    adminEmail: string;
    region?: string;
    timezone?: string;
  }): TenantMetadata {
    return new TenantMetadata(props.companyName, props.adminEmail, props.region, props.timezone);
  }
}

/**
 * ProvisioningPolicy Value Object
 */
export class ProvisioningPolicy {
  public readonly autoApprove: boolean;
  public readonly maxRetries: number;
  public readonly requireApproval: boolean;

  private constructor(autoApprove: boolean = true, maxRetries: number = 3, requireApproval: boolean = false) {
    this.autoApprove = autoApprove;
    this.maxRetries = maxRetries;
    this.requireApproval = requireApproval;
  }

  public static create(autoApprove: boolean = true, maxRetries: number = 3, requireApproval: boolean = false): ProvisioningPolicy {
    return new ProvisioningPolicy(autoApprove, maxRetries, requireApproval);
  }

  public static defaultPolicy(): ProvisioningPolicy {
    return new ProvisioningPolicy(true, 3, false);
  }
}
