import { Identifier, DomainPrimitive } from '@saas/domain';
import { ValueObject } from '@saas/core';

// ENUMS

export enum AgentStatusEnum {
  IDLE = 'IDLE',
  PLANNING = 'PLANNING',
  EXECUTING = 'EXECUTING',
  WAITING_FOR_TOOL = 'WAITING_FOR_TOOL',
  WAITING_FOR_APPROVAL = 'WAITING_FOR_APPROVAL',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED'
}

export class AgentStatus extends DomainPrimitive<AgentStatusEnum> {
  private constructor(value: AgentStatusEnum) { super(value); }
  public static create(value: AgentStatusEnum): AgentStatus { return new AgentStatus(value); }
}

export enum AgentStepStatusEnum {
  PENDING = 'PENDING',
  RUNNING = 'RUNNING',
  COMPLETED = 'COMPLETED',
  SKIPPED = 'SKIPPED',
  FAILED = 'FAILED'
}

export class AgentStepStatus extends DomainPrimitive<AgentStepStatusEnum> {
  private constructor(value: AgentStepStatusEnum) { super(value); }
  public static create(value: AgentStepStatusEnum): AgentStepStatus { return new AgentStepStatus(value); }
}

// VALUE OBJECTS

export class AgentId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): AgentId { return new AgentId(value); }
  public static generate(): AgentId { return new AgentId(crypto.randomUUID()); }
}

export class AgentType extends DomainPrimitive<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): AgentType { return new AgentType(value); }
}

export class AgentExecutionId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): AgentExecutionId { return new AgentExecutionId(value); }
  public static generate(): AgentExecutionId { return new AgentExecutionId(crypto.randomUUID()); }
}

export class AgentMemoryId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): AgentMemoryId { return new AgentMemoryId(value); }
  public static generate(): AgentMemoryId { return new AgentMemoryId(crypto.randomUUID()); }
}

export class AgentGoal extends DomainPrimitive<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): AgentGoal { return new AgentGoal(value); }
}

export interface AgentStepProps {
  [key: string]: unknown;
  stepId: string;
  description: string;
  status: AgentStepStatusEnum;
  dependencies: string[];
}

export class AgentStep extends ValueObject<AgentStepProps> {
  private constructor(props: AgentStepProps) { super(props); }
  public static create(props: AgentStepProps): AgentStep { return new AgentStep(props); }
}

export interface AgentPlanProps {
  [key: string]: unknown;
  steps: AgentStepProps[];
}

export class AgentPlan extends ValueObject<AgentPlanProps> {
  private constructor(props: AgentPlanProps) { super(props); }
  public static create(props: AgentPlanProps): AgentPlan { return new AgentPlan(props); }
}

export class AgentCapability extends DomainPrimitive<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): AgentCapability { return new AgentCapability(value); }
}

export interface ToolInvocationProps {
  [key: string]: unknown;
  toolName: string;
  arguments: Record<string, any>;
  invocationId: string;
}

export class ToolInvocation extends ValueObject<ToolInvocationProps> {
  private constructor(props: ToolInvocationProps) { super(props); }
  public static create(props: ToolInvocationProps): ToolInvocation { return new ToolInvocation(props); }
}

export class AgentObservation extends DomainPrimitive<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): AgentObservation { return new AgentObservation(value); }
}

export class AgentDecision extends DomainPrimitive<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): AgentDecision { return new AgentDecision(value); }
}

export interface AgentResultProps {
  [key: string]: unknown;
  success: boolean;
  output: string;
  metrics: Record<string, any>;
}

export class AgentResult extends ValueObject<AgentResultProps> {
  private constructor(props: AgentResultProps) { super(props); }
  public static create(props: AgentResultProps): AgentResult { return new AgentResult(props); }
}
