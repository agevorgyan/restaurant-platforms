import { Identifier, DomainPrimitive } from '@saas/domain';

export class WorkflowId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): WorkflowId { return new WorkflowId(value); }
  public static generate(): WorkflowId { return new WorkflowId(crypto.randomUUID()); }
}

export class WorkflowDefinitionId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): WorkflowDefinitionId { return new WorkflowDefinitionId(value); }
  public static generate(): WorkflowDefinitionId { return new WorkflowDefinitionId(crypto.randomUUID()); }
}

export class WorkflowInstanceId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): WorkflowInstanceId { return new WorkflowInstanceId(value); }
  public static generate(): WorkflowInstanceId { return new WorkflowInstanceId(crypto.randomUUID()); }
}

export class WorkflowStepId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): WorkflowStepId { return new WorkflowStepId(value); }
  public static generate(): WorkflowStepId { return new WorkflowStepId(crypto.randomUUID()); }
}

export enum WorkflowStatusEnum {
  PENDING = 'PENDING',
  RUNNING = 'RUNNING',
  PAUSED = 'PAUSED',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
  COMPENSATING = 'COMPENSATING',
  COMPENSATED = 'COMPENSATED'
}

export class WorkflowStatus extends DomainPrimitive<WorkflowStatusEnum> {
  private constructor(value: WorkflowStatusEnum) { super(value); }
  public static create(value: WorkflowStatusEnum): WorkflowStatus {
    if (!Object.values(WorkflowStatusEnum).includes(value)) throw new Error(`Invalid WorkflowStatus: ${value}`);
    return new WorkflowStatus(value);
  }
}

export class WorkflowVersion extends DomainPrimitive<number> {
  private constructor(value: number) { super(value); }
  public static create(value: number): WorkflowVersion {
    if (value < 1) throw new Error('WorkflowVersion must be >= 1');
    return new WorkflowVersion(value);
  }
}

export enum WorkflowTriggerEnum {
  API = 'API',
  DOMAIN_EVENT = 'DOMAIN_EVENT',
  INTEGRATION_EVENT = 'INTEGRATION_EVENT',
  SCHEDULED_JOB = 'SCHEDULED_JOB',
  MANUAL = 'MANUAL'
}

export class WorkflowTrigger extends DomainPrimitive<WorkflowTriggerEnum> {
  private constructor(value: WorkflowTriggerEnum) { super(value); }
  public static create(value: WorkflowTriggerEnum): WorkflowTrigger {
    if (!Object.values(WorkflowTriggerEnum).includes(value)) throw new Error(`Invalid WorkflowTrigger: ${value}`);
    return new WorkflowTrigger(value);
  }
}

export class WorkflowTimeout extends DomainPrimitive<number> {
  private constructor(value: number) { super(value); }
  public static create(value: number): WorkflowTimeout {
    if (value < 0) throw new Error('WorkflowTimeout cannot be negative');
    return new WorkflowTimeout(value);
  }
}

export enum CompensationPolicyEnum {
  AUTOMATIC = 'AUTOMATIC',
  MANUAL_INTERVENTION_REQUIRED = 'MANUAL_INTERVENTION_REQUIRED',
  IGNORE = 'IGNORE'
}

export class CompensationPolicy extends DomainPrimitive<CompensationPolicyEnum> {
  private constructor(value: CompensationPolicyEnum) { super(value); }
  public static create(value: CompensationPolicyEnum): CompensationPolicy {
    if (!Object.values(CompensationPolicyEnum).includes(value)) throw new Error(`Invalid CompensationPolicy: ${value}`);
    return new CompensationPolicy(value);
  }
}

export interface WorkflowRetryPolicyProps {
  maxRetries: number;
  backoffMultiplier: number;
  initialDelayMs: number;
}

export class WorkflowRetryPolicy extends DomainPrimitive<WorkflowRetryPolicyProps> {
  private constructor(value: WorkflowRetryPolicyProps) { super(value); }
  public static create(value: WorkflowRetryPolicyProps): WorkflowRetryPolicy {
    if (value.maxRetries < 0) throw new Error('maxRetries cannot be negative');
    if (value.backoffMultiplier < 1) throw new Error('backoffMultiplier must be >= 1');
    return new WorkflowRetryPolicy(value);
  }
}
