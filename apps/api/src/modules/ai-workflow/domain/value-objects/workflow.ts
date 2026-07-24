import { Identifier, DomainPrimitive } from '@saas/domain';
import { ValueObject } from '@saas/core';

// ENUMS

export enum WorkflowStatusEnum {
  CREATED = 'CREATED',
  RUNNING = 'RUNNING',
  WAITING = 'WAITING',
  PAUSED = 'PAUSED',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED'
}

export class WorkflowStatus extends DomainPrimitive<WorkflowStatusEnum> {
  private constructor(value: WorkflowStatusEnum) { super(value); }
  public static create(value: WorkflowStatusEnum): WorkflowStatus { return new WorkflowStatus(value); }
}

export enum ToolStatusEnum {
  REGISTERED = 'REGISTERED',
  AVAILABLE = 'AVAILABLE',
  DISABLED = 'DISABLED',
  DEPRECATED = 'DEPRECATED'
}

export class ToolStatus extends DomainPrimitive<ToolStatusEnum> {
  private constructor(value: ToolStatusEnum) { super(value); }
  public static create(value: ToolStatusEnum): ToolStatus { return new ToolStatus(value); }
}

// VALUE OBJECTS

export class WorkflowId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): WorkflowId { return new WorkflowId(value); }
  public static generate(): WorkflowId { return new WorkflowId(crypto.randomUUID()); }
}

export interface WorkflowDefinitionProps {
  [key: string]: unknown;
  name: string;
  type: string;
  steps: any[];
}

export class WorkflowDefinition extends ValueObject<WorkflowDefinitionProps> {
  private constructor(props: WorkflowDefinitionProps) { super(props); }
  public static create(props: WorkflowDefinitionProps): WorkflowDefinition { return new WorkflowDefinition(props); }
}

export class WorkflowExecutionId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): WorkflowExecutionId { return new WorkflowExecutionId(value); }
  public static generate(): WorkflowExecutionId { return new WorkflowExecutionId(crypto.randomUUID()); }
}

export class WorkflowStepId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): WorkflowStepId { return new WorkflowStepId(value); }
  public static generate(): WorkflowStepId { return new WorkflowStepId(crypto.randomUUID()); }
}

export interface WorkflowContextProps {
  [key: string]: unknown;
  variables: Record<string, any>;
  state: Record<string, any>;
}

export class WorkflowContext extends ValueObject<WorkflowContextProps> {
  private constructor(props: WorkflowContextProps) { super(props); }
  public static create(props: WorkflowContextProps): WorkflowContext { return new WorkflowContext(props); }
}

export interface WorkflowCheckpointProps {
  [key: string]: unknown;
  executionId: string;
  stepId: string;
  context: Record<string, any>;
  savedAt: Date;
}

export class WorkflowCheckpoint extends ValueObject<WorkflowCheckpointProps> {
  private constructor(props: WorkflowCheckpointProps) { super(props); }
  public static create(props: WorkflowCheckpointProps): WorkflowCheckpoint { return new WorkflowCheckpoint(props); }
}

export class ToolId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): ToolId { return new ToolId(value); }
  public static generate(): ToolId { return new ToolId(crypto.randomUUID()); }
}

export interface ToolDefinitionProps {
  [key: string]: unknown;
  name: string;
  description: string;
  type: string;
}

export class ToolDefinition extends ValueObject<ToolDefinitionProps> {
  private constructor(props: ToolDefinitionProps) { super(props); }
  public static create(props: ToolDefinitionProps): ToolDefinition { return new ToolDefinition(props); }
}

export class ToolInvocationId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): ToolInvocationId { return new ToolInvocationId(value); }
  public static generate(): ToolInvocationId { return new ToolInvocationId(crypto.randomUUID()); }
}

export interface ToolInputProps {
  [key: string]: unknown;
  payload: Record<string, any>;
}

export class ToolInput extends ValueObject<ToolInputProps> {
  private constructor(props: ToolInputProps) { super(props); }
  public static create(props: ToolInputProps): ToolInput { return new ToolInput(props); }
}

export interface ToolOutputProps {
  [key: string]: unknown;
  result: Record<string, any>;
  success: boolean;
}

export class ToolOutput extends ValueObject<ToolOutputProps> {
  private constructor(props: ToolOutputProps) { super(props); }
  public static create(props: ToolOutputProps): ToolOutput { return new ToolOutput(props); }
}

export interface ToolSchemaProps {
  [key: string]: unknown;
  jsonSchema: string;
}

export class ToolSchema extends ValueObject<ToolSchemaProps> {
  private constructor(props: ToolSchemaProps) { super(props); }
  public static create(props: ToolSchemaProps): ToolSchema { return new ToolSchema(props); }
}

export interface ToolPermissionProps {
  [key: string]: unknown;
  requiredRoles: string[];
  requiresApproval: boolean;
}

export class ToolPermission extends ValueObject<ToolPermissionProps> {
  private constructor(props: ToolPermissionProps) { super(props); }
  public static create(props: ToolPermissionProps): ToolPermission { return new ToolPermission(props); }
}
