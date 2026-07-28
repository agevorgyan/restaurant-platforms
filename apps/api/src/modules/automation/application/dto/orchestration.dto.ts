/**
 * Automation Orchestration Platform — Application DTOs
 *
 * All DTOs are plain TypeScript classes (no decorators — framework agnostic).
 * Validation is enforced at the service boundary via OrchestrationService.
 *
 * Naming convention:
 *   {Verb}{Resource}Dto  — command-side inputs
 *   List{Resource}Dto    — query-side filter inputs
 *   {Resource}View       — CQRS read-model projection outputs
 */

import {
  OrchestrationStatus,
  ExecutionMode,
  TriggerType,
  OrchestrationStepType,
  CompensationStrategy,
  TemplateCategory,
  OrchestrationExecutionStatus,
  StepExecutionStatus,
} from '../../domain/enums/orchestration.enums';

// ---------------------------------------------------------------------------
// Step Definition DTOs
// ---------------------------------------------------------------------------

/** Defines a single step node within an orchestration definition. */
export class StepDefinitionDto {
  stepId!: string;
  label!: string;
  stepType!: OrchestrationStepType;
  /** Resource ID within the target platform (workflowId, ruleId, etc.). */
  platformTarget!: string;
  config!: Record<string, unknown>;
  timeoutSeconds!: number;
  maxRetries!: number;
  compensationStrategy!: CompensationStrategy;
  /** Optional condition expression for conditional branches. */
  conditionExpression?: string;
}

/** Defines a directed edge between two step nodes. */
export class StepEdgeDto {
  from!: string;
  to!: string;
}

/** Defines a trigger for an orchestration. */
export class TriggerDefinitionDto {
  triggerId!: string;
  triggerType!: TriggerType;
  config!: Record<string, unknown>;
  filters!: Array<{ key: string; operator: string; value: unknown }>;
  debounceMs!: number;
  isEnabled!: boolean;
}

/** Declares an input parameter for an orchestration or template. */
export class ParameterDefinitionDto {
  key!: string;
  type!: 'string' | 'number' | 'boolean' | 'object' | 'array';
  required!: boolean;
  defaultValue?: unknown;
  description!: string;
  validation?: string;
}

/** Declares a variable scoped to the execution context. */
export class VariableDefinitionDto {
  key!: string;
  type!: 'string' | 'number' | 'boolean' | 'object' | 'array';
  value!: unknown;
  scope!: 'execution' | 'global' | 'template';
}

// ---------------------------------------------------------------------------
// Command DTOs — Orchestration CRUD
// ---------------------------------------------------------------------------

/**
 * Input for creating a new orchestration definition (Draft state).
 */
export class CreateOrchestrationDto {
  name!: string;
  description!: string;
  executionMode!: ExecutionMode;
  steps!: StepDefinitionDto[];
  edges!: StepEdgeDto[];
  triggers!: TriggerDefinitionDto[];
  parameters!: ParameterDefinitionDto[];
  variables!: VariableDefinitionDto[];
  metadata!: Record<string, unknown>;
  globalTimeoutSeconds!: number;
  compensationStrategy!: CompensationStrategy;
}

/**
 * Input for patching a Draft orchestration.
 * All fields are optional — only supplied fields are updated.
 * A published orchestration cannot be patched.
 */
export class UpdateOrchestrationDto {
  name?: string;
  description?: string;
  executionMode?: ExecutionMode;
  steps?: StepDefinitionDto[];
  edges?: StepEdgeDto[];
  triggers?: TriggerDefinitionDto[];
  parameters?: ParameterDefinitionDto[];
  variables?: VariableDefinitionDto[];
  metadata?: Record<string, unknown>;
  globalTimeoutSeconds?: number;
  compensationStrategy?: CompensationStrategy;
}

/** Input for publishing an orchestration. Triggers DAG validation before sealing. */
export class PublishOrchestrationDto {
  /** Optional comment recorded in the audit log. */
  comment?: string;
}

/** Input for manually executing an orchestration. */
export class ExecuteOrchestrationDto {
  /** Runtime parameter values. Must satisfy the orchestration's parameter declarations. */
  parameters!: Record<string, unknown>;
  /** Correlation ID for linking this execution to a business saga. */
  correlationId?: string;
  /** Free-form metadata attached to the execution context. */
  metadata?: Record<string, unknown>;
}

/** Input for pausing a running execution. */
export class PauseOrchestrationDto {
  executionId!: string;
  reason?: string;
}

/** Input for resuming a paused execution from its last checkpoint. */
export class ResumeOrchestrationDto {
  executionId!: string;
}

// ---------------------------------------------------------------------------
// Command DTOs — Template CRUD
// ---------------------------------------------------------------------------

/** Input for creating a new automation template in the catalog. */
export class CreateTemplateDto {
  name!: string;
  description!: string;
  category!: TemplateCategory;
  definitionBlueprint!: CreateOrchestrationDto;
  requiredParameters!: string[];
  isPublic!: boolean;
}

/** Input for instantiating a template into a new orchestration. */
export class InstantiateTemplateDto {
  templateId!: string;
  parameterValues!: Record<string, unknown>;
  /** Name override for the produced orchestration. Defaults to template name. */
  orchestrationName?: string;
}

// ---------------------------------------------------------------------------
// Query DTOs — List / Filter inputs
// ---------------------------------------------------------------------------

/** Filter and pagination options for listing orchestrations. */
export class ListOrchestrationsDto {
  status?: OrchestrationStatus;
  executionMode?: ExecutionMode;
  search?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/** Filter and pagination options for listing executions. */
export class ListExecutionsDto {
  orchestrationId?: string;
  status?: OrchestrationExecutionStatus;
  triggerType?: TriggerType;
  correlationId?: string;
  fromDate?: Date;
  toDate?: Date;
  page?: number;
  pageSize?: number;
}

// ---------------------------------------------------------------------------
// Read Model Views — CQRS output projections
// ---------------------------------------------------------------------------

/** Step summary projected in catalog and graph views. */
export class StepSummaryView {
  stepId!: string;
  label!: string;
  stepType!: OrchestrationStepType;
  platformTarget!: string;
}

/** Edge projected in graph views. */
export class EdgeView {
  from!: string;
  to!: string;
}

/**
 * AutomationCatalog read model.
 * Lists all orchestration definitions visible to the tenant.
 */
export class AutomationCatalogView {
  id!: string;
  name!: string;
  description!: string;
  version!: number;
  status!: OrchestrationStatus;
  executionMode!: ExecutionMode;
  stepCount!: number;
  triggerCount!: number;
  createdAt!: Date;
  updatedAt!: Date;
  createdBy!: string;
  tags!: string[];
}

/**
 * AutomationExecutions read model.
 * Projects execution summaries for the execution dashboard.
 */
export class AutomationExecutionsView {
  executionId!: string;
  orchestrationId!: string;
  orchestrationName!: string;
  version!: number;
  status!: OrchestrationExecutionStatus;
  triggerType!: TriggerType;
  correlationId!: string;
  startedAt?: Date;
  completedAt?: Date;
  durationMs?: number;
  completedStepCount!: number;
  totalStepCount!: number;
  failureReason?: string;
}

/**
 * ExecutionGraphView read model.
 * Full DAG representation for graph visualisation UI.
 */
export class ExecutionGraphView {
  orchestrationId!: string;
  version!: number;
  steps!: StepSummaryView[];
  edges!: EdgeView[];
  executionMode!: ExecutionMode;
  /** Topological order of step IDs (Sequential mode). */
  topologicalOrder!: string[];
  /** Parallel group layers (Parallel mode). */
  parallelGroups!: string[][];
}

/**
 * AutomationTemplates read model.
 * Projects template catalog entries.
 */
export class AutomationTemplatesView {
  id!: string;
  name!: string;
  description!: string;
  category!: TemplateCategory;
  version!: number;
  isPublic!: boolean;
  usageCount!: number;
  requiredParameters!: string[];
  createdAt!: Date;
}

/**
 * ExecutionTimeline read model.
 * Time-ordered list of events for a single execution.
 */
export class ExecutionTimelineEntry {
  timestamp!: Date;
  eventType!: string;
  stepId?: string;
  stepLabel?: string;
  status?: StepExecutionStatus;
  durationMs?: number;
  error?: string;
}

export class ExecutionTimelineView {
  executionId!: string;
  orchestrationId!: string;
  entries!: ExecutionTimelineEntry[];
}

/**
 * AutomationStatistics read model.
 * Aggregated execution metrics for the orchestration platform.
 */
export class AutomationStatisticsView {
  totalOrchestrations!: number;
  publishedOrchestrations!: number;
  totalExecutions!: number;
  runningExecutions!: number;
  completedExecutions!: number;
  failedExecutions!: number;
  cancelledExecutions!: number;
  averageExecutionDurationMs!: number;
  p95ExecutionDurationMs!: number;
  checkpointsRecorded!: number;
  compensationsInitiated!: number;
  templateUsageCount!: number;
  mostUsedTemplates!: Array<{ templateId: string; name: string; usageCount: number }>;
  executionsByTriggerType!: Record<TriggerType, number>;
  periodFrom!: Date;
  periodTo!: Date;
}
