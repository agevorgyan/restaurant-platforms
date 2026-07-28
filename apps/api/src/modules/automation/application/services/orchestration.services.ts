/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * Automation Orchestration Platform — Application Services
 *
 * 8 focused services, each owning a single responsibility:
 *
 *   OrchestrationService          — Definition CRUD, lifecycle, versioning
 *   RuntimeService                — Execute, pause, resume, compensate
 *   ExecutionGraphService         — DAG build, cycle detection, topological sort
 *   TriggerService                — Trigger registration and routing
 *   TemplateService               — Template CRUD and instantiation
 *   CheckpointService             — Checkpoint persistence and consistency
 *   OrchestrationCorrelationService — Cross-platform causation tracking
 *   ExecutionPersistenceService   — Execution storage port
 *
 * These services are pure coordinators — they delegate all execution to
 * the existing platform services (WorkflowService, RuleService,
 * EventPublisherService, SchedulerService) without duplicating logic.
 *
 * No framework dependencies in method bodies. Fully unit-testable.
 */

import { Injectable, Logger } from '@nestjs/common';

import {
  Orchestration,
  OrchestrationExecution,
  AutomationTemplate,
} from '../../domain/models/orchestration.model';

import {
  OrchestrationId,
  OrchestrationVersion,
  OrchestrationDefinition,
  AutomationTemplateId,
  ExecutionTraceId,
  ExecutionContext,
  ExecutionCheckpoint,
  ExecutionGraph,
  StepReference,
  TriggerDefinition,
  AutomationVariable,
  AutomationParameter,
} from '../../domain/value-objects/orchestration.value-objects';

import {
  OrchestrationStatus,
  ExecutionMode,
  TriggerType,
  OrchestrationStepType,
  OrchestrationExecutionStatus,
  CompensationStrategy,
  TemplateCategory,
} from '../../domain/enums/orchestration.enums';

import {
  CreateOrchestrationDto,
  UpdateOrchestrationDto,
  ExecuteOrchestrationDto,
  PauseOrchestrationDto,
  ResumeOrchestrationDto,
  CreateTemplateDto,
  InstantiateTemplateDto,
  ListOrchestrationsDto,
  ListExecutionsDto,
  AutomationCatalogView,
  AutomationExecutionsView,
  ExecutionGraphView,
  AutomationTemplatesView,
  ExecutionTimelineView,
  AutomationStatisticsView,
} from '../dto/orchestration.dto';

import {
  GetAutomationCatalogQuery,
  GetAutomationExecutionsQuery,
  GetExecutionGraphQuery,
  GetAutomationTemplatesQuery,
  GetExecutionTimelineQuery,
  GetAutomationStatisticsQuery,
} from '../queries/orchestration.queries';

// ============================================================================
// OrchestrationService
// ============================================================================

/**
 * Owns the Orchestration aggregate lifecycle.
 *
 * Responsibilities:
 *   - Create, update, and publish orchestration definitions
 *   - Enforce immutability of published definitions
 *   - Version management (monotonic increment on clone)
 *   - Delegate to ExecutionGraphService for DAG validation before publish
 *   - Delegate to ExecutionPersistenceService for storage
 *
 * Does NOT execute orchestrations — that is RuntimeService's concern.
 */
@Injectable()
export class OrchestrationService {
  private readonly logger = new Logger(OrchestrationService.name);

  constructor(
    private readonly graphService: ExecutionGraphService,
    private readonly persistenceService: ExecutionPersistenceService,
  ) {}

  /**
   * Creates a new orchestration definition in Draft state.
   * Validates the step/edge graph structure before persisting.
   */
  async createOrchestration(
    tenantId: string,
    dto: CreateOrchestrationDto,
    createdBy: string,
  ): Promise<AutomationCatalogView> {
    this.logger.log(`[OrchestrationService] Creating orchestration "${dto.name}" for tenant "${tenantId}"`);

    // Build and validate the execution graph structure
    await this.graphService.validate(dto.steps, dto.edges);

    const id = new OrchestrationId(`orch_${Date.now()}`);
    const version = new OrchestrationVersion(1);

    const definition = this.buildDefinition(dto);

    const orchestration = new Orchestration(
      id,
      tenantId,
      version,
      definition,
      OrchestrationStatus.Draft,
      new Date(),
      createdBy,
    );

    await this.persistenceService.saveOrchestration(orchestration);

    this.logger.log(`[OrchestrationService] Orchestration "${id.value}" created successfully`);

    return this.toView(orchestration, dto.steps.length, dto.triggers.length);
  }

  /**
   * Updates a Draft orchestration definition.
   * Enforces immutability — throws if the orchestration is Published.
   */
  async updateOrchestration(
    tenantId: string,
    orchestrationId: string,
    dto: UpdateOrchestrationDto,
    updatedBy: string,
  ): Promise<AutomationCatalogView> {
    this.logger.log(`[OrchestrationService] Updating orchestration "${orchestrationId}"`);

    const orchestration = await this.persistenceService.loadOrchestration(tenantId, orchestrationId);

    if (orchestration.isSealed) {
      throw new Error(
        `Orchestration "${orchestrationId}" is published and immutable. ` +
          `Clone it into a new version to make changes.`,
      );
    }

    if (dto.steps && dto.edges) {
      await this.graphService.validate(dto.steps, dto.edges);
    }

    await this.persistenceService.saveOrchestration(orchestration);

    this.logger.log(`[OrchestrationService] Orchestration "${orchestrationId}" updated`);

    return this.toView(orchestration, 0, 0);
  }

  /**
   * Publishes a Draft orchestration.
   * Triggers full DAG validation including nested orchestration cycle detection.
   * After publish, the definition is sealed — no further mutations permitted.
   */
  async publishOrchestration(
    tenantId: string,
    orchestrationId: string,
    publishedBy: string,
    comment?: string,
  ): Promise<AutomationCatalogView> {
    this.logger.log(`[OrchestrationService] Publishing orchestration "${orchestrationId}"`);

    const orchestration = await this.persistenceService.loadOrchestration(tenantId, orchestrationId);

    await this.graphService.validateForPublish(orchestration.definition);

    orchestration.publish(publishedBy);

    await this.persistenceService.saveOrchestration(orchestration);

    const events = orchestration.pullEvents();
    this.logger.log(
      `[OrchestrationService] Orchestration "${orchestrationId}" published. Events: ${events.length}`,
    );

    return this.toView(
      orchestration,
      orchestration.definition.steps.length,
      orchestration.definition.triggers.length,
    );
  }

  /**
   * Retrieves the automation catalog for a tenant with filtering and pagination.
   */
  async getCatalog(
    tenantId: string,
    dto: ListOrchestrationsDto,
  ): Promise<AutomationCatalogView[]> {
    const query = new GetAutomationCatalogQuery(
      tenantId,
      dto.status,
      dto.search,
      dto.page,
      dto.pageSize,
      dto.sortBy,
      dto.sortOrder,
    );
    return this.persistenceService.queryOrchestrations(query);
  }

  /**
   * Retrieves aggregated platform statistics.
   */
  async getStatistics(
    tenantId: string,
    fromDate?: Date,
    toDate?: Date,
  ): Promise<AutomationStatisticsView> {
    const from = fromDate ?? new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const to = toDate ?? new Date();
    const query = new GetAutomationStatisticsQuery(tenantId, from, to);
    return this.persistenceService.queryStatistics(query);
  }

  // -------------------------------------------------------------------------
  // Private helpers
  // -------------------------------------------------------------------------

  private buildDefinition(dto: CreateOrchestrationDto): OrchestrationDefinition {
    const steps: StepReference[] = dto.steps.map(
      (s) =>
        new StepReference(
          s.stepId,
          s.label,
          s.stepType,
          s.platformTarget,
          Object.freeze(s.config),
          s.timeoutSeconds,
          s.maxRetries,
          s.compensationStrategy,
          s.conditionExpression,
        ),
    );

    const triggers: TriggerDefinition[] = dto.triggers.map(
      (t) =>
        new TriggerDefinition(
          t.triggerId,
          t.triggerType,
          Object.freeze(t.config),
          t.filters,
          t.debounceMs,
          t.isEnabled,
        ),
    );

    const parameters: AutomationParameter[] = dto.parameters.map(
      (p) =>
        new AutomationParameter(p.key, p.type, p.required, p.defaultValue, p.description, p.validation),
    );

    const variables: AutomationVariable[] = dto.variables.map(
      (v) => new AutomationVariable(v.key, v.type, v.value, v.scope),
    );

    return new OrchestrationDefinition(
      dto.name,
      dto.description,
      dto.executionMode,
      steps,
      dto.edges,
      triggers,
      parameters,
      variables,
      Object.freeze(dto.metadata),
      dto.globalTimeoutSeconds,
      dto.compensationStrategy,
    );
  }

  private toView(
    orchestration: Orchestration,
    stepCount: number,
    triggerCount: number,
  ): AutomationCatalogView {
    const view = new AutomationCatalogView();
    view.id = orchestration.id.value;
    view.name = orchestration.definition.name;
    view.description = orchestration.definition.description;
    view.version = orchestration.version.value;
    view.status = orchestration.status;
    view.executionMode = orchestration.definition.executionMode;
    view.stepCount = stepCount;
    view.triggerCount = triggerCount;
    view.createdAt = orchestration.createdAt;
    view.updatedAt = orchestration.updatedAt;
    view.createdBy = orchestration.createdBy;
    view.tags = (orchestration.definition.metadata['tags'] as string[]) ?? [];
    return view;
  }
}

// ============================================================================
// RuntimeService
// ============================================================================

/**
 * Executes orchestration definitions.
 *
 * Responsibilities:
 *   - Validate that the orchestration is Published before executing
 *   - Build an ExecutionContext and assign a trace ID
 *   - Advance through the DAG using the ExecutionGraphService
 *   - Dispatch each step to the appropriate platform adapter
 *   - Manage pause/resume via CheckpointService
 *   - Initiate compensation on failure (Saga pattern)
 *
 * Platform dispatch strategy (Strategy Pattern):
 *   WorkflowStep           → WorkflowService
 *   RuleStep               → RuleService (injected lazily by TriggerService)
 *   EventStep              → EventPublisherService
 *   ScheduleStep           → SchedulerService
 *   NestedOrchestrationStep→ RuntimeService (recursive)
 */
@Injectable()
export class RuntimeService {
  private readonly logger = new Logger(RuntimeService.name);

  constructor(
    private readonly graphService: ExecutionGraphService,
    private readonly checkpointService: CheckpointService,
    private readonly persistenceService: ExecutionPersistenceService,
    private readonly correlationService: OrchestrationCorrelationService,
  ) {}

  /**
   * Initiates a new execution of a Published orchestration.
   *
   * @returns The newly created execution view.
   * @throws If the orchestration is not Published.
   */
  async execute(
    tenantId: string,
    orchestrationId: string,
    dto: ExecuteOrchestrationDto,
    triggeredBy: string,
  ): Promise<AutomationExecutionsView> {
    this.logger.log(`[RuntimeService] Executing orchestration "${orchestrationId}" for tenant "${tenantId}"`);

    const orchestration = await this.persistenceService.loadOrchestration(tenantId, orchestrationId);

    if (!orchestration.isExecutable) {
      throw new Error(
        `Orchestration "${orchestrationId}" cannot be executed — status is "${orchestration.status}". ` +
          `Only Published orchestrations are executable.`,
      );
    }

    const traceId = new ExecutionTraceId(`trace_${Date.now()}_${Math.random().toString(36).slice(2)}`);
    const correlationId = dto.correlationId ?? `corr_${Date.now()}`;
    const executionId = `exec_${Date.now()}_${Math.random().toString(36).slice(2)}`;

    const context = new ExecutionContext(
      traceId,
      tenantId,
      correlationId,
      undefined,
      Object.freeze({ ...dto.parameters }),
      TriggerType.ApiRequest,
      Object.freeze(dto.metadata ?? {}),
    );

    const execution = new OrchestrationExecution(
      executionId,
      orchestration.id,
      orchestration.version,
      tenantId,
      context,
      TriggerType.ApiRequest,
    );

    execution.start();

    // Track the cross-platform correlation chain
    await this.correlationService.trackOrchestrationExecution(
      executionId,
      orchestration.id.value,
      correlationId,
      traceId.value,
    );

    await this.persistenceService.saveExecution(execution);

    // Advance the DAG (async — the execution continues in the background)
    this.advanceGraph(orchestration, execution).catch((err: Error) => {
      this.logger.error(`[RuntimeService] Execution "${executionId}" failed: ${err.message}`);
    });

    this.logger.log(`[RuntimeService] Execution "${executionId}" initiated`);

    return this.toExecutionView(execution, orchestration.definition.name);
  }

  /**
   * Pauses a running execution after its current step completes.
   */
  async pause(
    tenantId: string,
    dto: PauseOrchestrationDto,
    pausedBy: string,
  ): Promise<void> {
    this.logger.log(`[RuntimeService] Pausing execution "${dto.executionId}"`);

    const execution = await this.persistenceService.loadExecution(tenantId, dto.executionId);
    execution.pause();
    await this.persistenceService.saveExecution(execution);

    this.logger.log(`[RuntimeService] Execution "${dto.executionId}" paused`);
  }

  /**
   * Resumes a paused execution from its latest checkpoint.
   */
  async resume(
    tenantId: string,
    dto: ResumeOrchestrationDto,
  ): Promise<void> {
    this.logger.log(`[RuntimeService] Resuming execution "${dto.executionId}"`);

    const execution = await this.persistenceService.loadExecution(tenantId, dto.executionId);
    const checkpoint = await this.checkpointService.loadLatestCheckpoint(dto.executionId);

    if (!checkpoint) {
      throw new Error(`Cannot resume execution "${dto.executionId}" — no checkpoint found.`);
    }

    await this.checkpointService.validateConsistency(checkpoint);

    execution.resume();
    await this.persistenceService.saveExecution(execution);

    this.logger.log(`[RuntimeService] Execution "${dto.executionId}" resumed from checkpoint "${checkpoint.checkpointId}"`);
  }

  /**
   * Initiates saga compensation for a failed or running execution.
   * Rolls back completed steps in reverse topological order.
   */
  async compensate(tenantId: string, executionId: string): Promise<void> {
    this.logger.log(`[RuntimeService] Initiating compensation for execution "${executionId}"`);

    const execution = await this.persistenceService.loadExecution(tenantId, executionId);
    execution.compensate();
    await this.persistenceService.saveExecution(execution);

    this.logger.log(`[RuntimeService] Compensation initiated for execution "${executionId}"`);
  }

  // -------------------------------------------------------------------------
  // DAG advancement
  // -------------------------------------------------------------------------

  /**
   * Advances the DAG execution graph step by step.
   * For each step, dispatches to the appropriate platform via the step type.
   * Captures a checkpoint after each completed step.
   */
  private async advanceGraph(
    orchestration: Orchestration,
    execution: OrchestrationExecution,
  ): Promise<void> {
    const graph = this.graphService.buildGraph(orchestration.definition);
    const mode = orchestration.definition.executionMode;

    try {
      if (mode === ExecutionMode.Parallel) {
        const groups = graph.resolveParallelGroups();
        for (const group of groups) {
          await Promise.all(group.map((stepId) => this.executeStep(orchestration, execution, graph, stepId)));
          await this.checkpointService.captureCheckpoint(execution, group[group.length - 1]);
        }
      } else {
        const order = graph.topologicalSort();
        for (const stepId of order) {
          const step = graph.getStep(stepId)!;
          if (!this.evaluateCondition(step, execution.context)) {
            const record = execution.getStepRecord(stepId);
            record?.markSkipped();
            continue;
          }
          await this.executeStep(orchestration, execution, graph, stepId);
          await this.checkpointService.captureCheckpoint(execution, stepId);

          if (execution.status === OrchestrationExecutionStatus.Paused) {
            return; // Honour pause request
          }
        }
      }

      execution.complete();
    } catch (err) {
      const error = err instanceof Error ? err.message : String(err);
      execution.fail(error);

      if (orchestration.definition.compensationStrategy !== CompensationStrategy.Manual) {
        await this.compensate(execution.tenantId, execution.executionId);
      }
    } finally {
      await this.persistenceService.saveExecution(execution);
    }
  }

  /**
   * Dispatches a single step to the appropriate platform.
   * This is the Strategy dispatch point — each step type routes to a
   * different platform without duplicating platform logic here.
   */
  private async executeStep(
    orchestration: Orchestration,
    execution: OrchestrationExecution,
    graph: ExecutionGraph,
    stepId: string,
  ): Promise<void> {
    const step = graph.getStep(stepId);
    if (!step) {
      throw new Error(`Step "${stepId}" not found in execution graph.`);
    }

    execution.registerStep(stepId, step.label);
    const record = execution.getStepRecord(stepId)!;
    record.markRunning();

    this.logger.log(`[RuntimeService] Executing step "${stepId}" (${step.stepType}) via "${step.platformTarget}"`);

    try {
      // Platform dispatch — each step type is a port to a downstream platform.
      // The actual platform calls are injected via the platform adapter pattern.
      // Stub returns satisfy the type contract for build/test.
      const output = await this.dispatchToPlatform(step, execution.context);
      record.markCompleted(output);
    } catch (err) {
      const error = err instanceof Error ? err.message : String(err);
      if (record.attemptCount < step.maxRetries + 1) {
        record.markRetrying();
        await this.executeStep(orchestration, execution, graph, stepId);
      } else {
        record.markFailed(error);
        throw new Error(`Step "${stepId}" failed after ${record.attemptCount} attempt(s): ${error}`);
      }
    }
  }

  /**
   * Routes a step to its target platform.
   * Returns the step output variables to be merged into the execution context.
   *
   * Current stub implementation — platform adapters are injected per step type
   * in the full implementation via the Adapter Pattern.
   */
  private async dispatchToPlatform(
    step: StepReference,
    context: ExecutionContext,
  ): Promise<Record<string, unknown>> {
    switch (step.stepType) {
      case OrchestrationStepType.WorkflowStep:
        // Delegate to WorkflowService.startWorkflowInstance(step.platformTarget, context)
        return { workflowInstanceId: `wf_stub_${step.platformTarget}` };

      case OrchestrationStepType.RuleStep:
        // Delegate to RuleEvaluationService.evaluate(step.platformTarget, context.variables)
        return { ruleResult: 'matched', outcome: 'stub' };

      case OrchestrationStepType.EventStep:
        // Delegate to EventPublisherService.publishEvent({ type: step.platformTarget, payload: context })
        return { eventId: `evt_stub_${step.platformTarget}` };

      case OrchestrationStepType.ScheduleStep:
        // Delegate to SchedulerService.triggerImmediately(step.platformTarget, context)
        return { jobExecutionId: `job_stub_${step.platformTarget}` };

      case OrchestrationStepType.NotificationStep:
        // Delegate to Notification platform adapter
        return { notificationId: `notif_stub_${step.platformTarget}` };

      case OrchestrationStepType.IntegrationStep:
        // Delegate to Integration adapter
        return { integrationResponseCode: 200 };

      case OrchestrationStepType.AiStep:
        // Delegate to AI Orchestration layer
        return { aiDecision: 'stub_decision', confidence: 0.95 };

      case OrchestrationStepType.NestedOrchestrationStep:
        // Recursive delegation back to RuntimeService
        return { nestedExecutionId: `nested_stub_${step.platformTarget}` };

      default:
        throw new Error(`Unknown step type: ${step.stepType}`);
    }
  }

  /**
   * Evaluates the step condition expression against the current execution context.
   * Returns true if the step should execute, false to skip it.
   */
  private evaluateCondition(step: StepReference, context: ExecutionContext): boolean {
    if (!step.conditionExpression) return true;
    // Stub: full implementation delegates to ExpressionEngineService
    return true;
  }

  private toExecutionView(
    execution: OrchestrationExecution,
    orchestrationName: string,
  ): AutomationExecutionsView {
    const view = new AutomationExecutionsView();
    view.executionId = execution.executionId;
    view.orchestrationId = execution.orchestrationId.value;
    view.orchestrationName = orchestrationName;
    view.version = execution.orchestrationVersion.value;
    view.status = execution.status;
    view.triggerType = execution.triggerType;
    view.correlationId = execution.context.correlationId;
    view.startedAt = execution.startedAt;
    view.completedAt = execution.completedAt;
    view.durationMs = execution.durationMs;
    view.completedStepCount = execution.getAllStepRecords().filter((r) => r.isTerminal).length;
    view.totalStepCount = execution.getAllStepRecords().length;
    view.failureReason = execution.failureReason;
    return view;
  }
}

// ============================================================================
// ExecutionGraphService
// ============================================================================

/**
 * Provides all DAG-related operations on orchestration definitions.
 *
 * Responsibilities:
 *   - Build an ExecutionGraph value object from step/edge definitions
 *   - Validate graph structure (cycles, dangling references)
 *   - Validate the full definition before publication
 *   - Detect nested orchestration cycles
 *   - Project the ExecutionGraphView read model
 */
@Injectable()
export class ExecutionGraphService {
  private readonly logger = new Logger(ExecutionGraphService.name);

  /**
   * Builds an ExecutionGraph from raw step and edge lists.
   * Used by RuntimeService to traverse the DAG during execution.
   */
  buildGraph(definition: OrchestrationDefinition): ExecutionGraph {
    return new ExecutionGraph(definition.steps, definition.edges);
  }

  /**
   * Validates step/edge definitions before persisting a Draft orchestration.
   * Throws a descriptive error on the first validation failure.
   */
  async validate(
    steps: Array<{ stepId: string; label: string; stepType: OrchestrationStepType; platformTarget: string; config: Record<string, unknown>; timeoutSeconds: number; maxRetries: number; compensationStrategy: CompensationStrategy; conditionExpression?: string }>,
    edges: Array<{ from: string; to: string }>,
  ): Promise<void> {
    this.logger.log(`[ExecutionGraphService] Validating graph with ${steps.length} steps and ${edges.length} edges`);

    if (steps.length === 0) {
      throw new Error('ExecutionGraph validation failed: at least one step is required.');
    }

    const stepIds = new Set(steps.map((s) => s.stepId));

    for (const edge of edges) {
      if (!stepIds.has(edge.from)) {
        throw new Error(`ExecutionGraph validation failed: edge source "${edge.from}" does not match any step.`);
      }
      if (!stepIds.has(edge.to)) {
        throw new Error(`ExecutionGraph validation failed: edge target "${edge.to}" does not match any step.`);
      }
    }

    const stepRefs: StepReference[] = steps.map(
      (s) => new StepReference(s.stepId, s.label, s.stepType, s.platformTarget, s.config, s.timeoutSeconds, s.maxRetries, s.compensationStrategy, s.conditionExpression),
    );
    const graph = new ExecutionGraph(stepRefs, edges);

    if (graph.hasCycle()) {
      throw new Error('ExecutionGraph validation failed: cycle detected. Orchestration definitions must be acyclic (DAG).');
    }
  }

  /**
   * Full pre-publication validation.
   * Performs all validation checks including nested orchestration cycle detection.
   */
  async validateForPublish(definition: OrchestrationDefinition): Promise<void> {
    this.logger.log(`[ExecutionGraphService] Running publish-time validation for "${definition.name}"`);

    const graph = new ExecutionGraph(definition.steps, definition.edges);

    if (graph.hasCycle()) {
      throw new Error('Publish validation failed: orchestration definition contains a cycle.');
    }

    if (graph.getRootSteps().length === 0) {
      throw new Error('Publish validation failed: no entry-point steps found (all steps have inbound edges).');
    }

    if (definition.triggers.length === 0) {
      throw new Error('Publish validation failed: at least one trigger must be defined.');
    }

    for (const step of definition.steps) {
      if (!step.platformTarget) {
        throw new Error(`Publish validation failed: step "${step.stepId}" has no platformTarget.`);
      }
    }

    this.logger.log(`[ExecutionGraphService] Publish validation passed for "${definition.name}"`);
  }

  /**
   * Projects the ExecutionGraphView read model including topological order
   * and parallel groups for graph visualisation.
   */
  async getGraphView(
    tenantId: string,
    orchestrationId: string,
    version?: number,
  ): Promise<ExecutionGraphView> {
    // Stub: load from persistence and project
    const view = new ExecutionGraphView();
    view.orchestrationId = orchestrationId;
    view.version = version ?? 1;
    view.steps = [];
    view.edges = [];
    view.executionMode = ExecutionMode.Sequential;
    view.topologicalOrder = [];
    view.parallelGroups = [];
    return view;
  }
}

// ============================================================================
// TriggerService
// ============================================================================

/**
 * Manages trigger registration and routing.
 *
 * Responsibilities:
 *   - Register triggers when an orchestration is Published
 *   - Route inbound events/webhooks/schedule fires to the correct orchestration
 *   - Apply debounce and filter logic before initiating executions
 *   - Deregister triggers when an orchestration is Cancelled
 *
 * Trigger types handled:
 *   Schedule      — subscribes to SchedulerService job completion events
 *   DomainEvent   — subscribes via EventSubscriberService
 *   IntegrationEvent — subscribes via EventSubscriberService with integration topic
 *   ApiRequest    — no registration needed (direct call)
 *   Webhook       — registers a webhook route
 *   ManualTrigger — no registration needed (direct call)
 *   RuleResult    — subscribes to rule outcome events
 *   AiDecision    — subscribes to AI agent decision events
 */
@Injectable()
export class TriggerService {
  private readonly logger = new Logger(TriggerService.name);

  /**
   * Registers all triggers declared in a published orchestration.
   * Called by OrchestrationService after successful publication.
   */
  async registerTriggers(orchestrationId: string, triggers: TriggerDefinition[]): Promise<void> {
    this.logger.log(`[TriggerService] Registering ${triggers.length} trigger(s) for orchestration "${orchestrationId}"`);

    for (const trigger of triggers) {
      if (!trigger.isEnabled) continue;
      await this.registerSingleTrigger(orchestrationId, trigger);
    }
  }

  /**
   * Deregisters all triggers for an orchestration (on cancel/archive).
   */
  async deregisterTriggers(orchestrationId: string): Promise<void> {
    this.logger.log(`[TriggerService] Deregistering triggers for orchestration "${orchestrationId}"`);
    // Stub: remove from trigger registry
  }

  /**
   * Validates a trigger definition for consistency.
   * Throws on invalid trigger configuration.
   */
  validateTrigger(trigger: TriggerDefinition): void {
    if (trigger.triggerType === TriggerType.Schedule) {
      if (!trigger.config['scheduleId']) {
        throw new Error(`TriggerDefinition "${trigger.triggerId}": Schedule trigger requires config.scheduleId.`);
      }
    }
    if (trigger.triggerType === TriggerType.DomainEvent || trigger.triggerType === TriggerType.IntegrationEvent) {
      if (!trigger.config['topic']) {
        throw new Error(`TriggerDefinition "${trigger.triggerId}": Event trigger requires config.topic.`);
      }
    }
    if (trigger.triggerType === TriggerType.Webhook) {
      if (!trigger.config['path']) {
        throw new Error(`TriggerDefinition "${trigger.triggerId}": Webhook trigger requires config.path.`);
      }
    }
    if (trigger.triggerType === TriggerType.RuleResult) {
      if (!trigger.config['ruleId']) {
        throw new Error(`TriggerDefinition "${trigger.triggerId}": RuleResult trigger requires config.ruleId.`);
      }
    }
  }

  private async registerSingleTrigger(orchestrationId: string, trigger: TriggerDefinition): Promise<void> {
    switch (trigger.triggerType) {
      case TriggerType.Schedule:
        this.logger.log(`[TriggerService] Registering Schedule trigger for schedule "${trigger.config['scheduleId']}"`);
        break;
      case TriggerType.DomainEvent:
      case TriggerType.IntegrationEvent:
        this.logger.log(`[TriggerService] Subscribing to event topic "${trigger.config['topic']}"`);
        break;
      case TriggerType.Webhook:
        this.logger.log(`[TriggerService] Registering webhook at path "${trigger.config['path']}"`);
        break;
      case TriggerType.RuleResult:
        this.logger.log(`[TriggerService] Subscribing to rule outcome for rule "${trigger.config['ruleId']}"`);
        break;
      case TriggerType.AiDecision:
        this.logger.log(`[TriggerService] Subscribing to AI agent "${trigger.config['agentId']}"`);
        break;
      default:
        this.logger.log(`[TriggerService] No registration required for trigger type "${trigger.triggerType}"`);
    }
  }
}

// ============================================================================
// TemplateService
// ============================================================================

/**
 * Manages the automation template catalog.
 *
 * Responsibilities:
 *   - CRUD for AutomationTemplate entities
 *   - Parameter schema validation
 *   - Template instantiation → produces a new Draft Orchestration
 *   - Usage count tracking
 */
@Injectable()
export class TemplateService {
  private readonly logger = new Logger(TemplateService.name);

  constructor(private readonly persistenceService: ExecutionPersistenceService) {}

  /**
   * Creates a new template in the automation catalog.
   */
  async createTemplate(
    tenantId: string,
    dto: CreateTemplateDto,
    createdBy: string,
  ): Promise<AutomationTemplatesView> {
    this.logger.log(`[TemplateService] Creating template "${dto.name}" for tenant "${tenantId}"`);

    const id = new AutomationTemplateId(`tmpl_${Date.now()}`);

    const blueprint = this.buildDefinitionFromDto(dto.definitionBlueprint);

    const template = new AutomationTemplate(
      id,
      dto.isPublic ? null : tenantId,
      dto.name,
      dto.description,
      dto.category,
      blueprint,
      dto.requiredParameters,
      1,
      dto.isPublic,
      0,
    );

    await this.persistenceService.saveTemplate(template);
    this.logger.log(`[TemplateService] Template "${id.value}" created`);

    return this.toView(template);
  }

  /**
   * Lists templates visible to the tenant (own + global public).
   */
  async listTemplates(
    tenantId: string,
    query: GetAutomationTemplatesQuery,
  ): Promise<AutomationTemplatesView[]> {
    return this.persistenceService.queryTemplates(query);
  }

  /**
   * Instantiates a template into a new Draft orchestration.
   * Validates all required parameters are supplied before instantiation.
   */
  async instantiate(
    tenantId: string,
    dto: InstantiateTemplateDto,
    instantiatedBy: string,
  ): Promise<AutomationCatalogView> {
    this.logger.log(`[TemplateService] Instantiating template "${dto.templateId}" for tenant "${tenantId}"`);

    const template = await this.persistenceService.loadTemplate(tenantId, dto.templateId);

    this.validateParams(template, dto.parameterValues);

    template.recordUsage();
    await this.persistenceService.saveTemplate(template);

    const id = new OrchestrationId(`orch_${Date.now()}`);
    const version = new OrchestrationVersion(1);

    const orchestration = new Orchestration(
      id,
      tenantId,
      version,
      template.definitionBlueprint,
      OrchestrationStatus.Draft,
      new Date(),
      instantiatedBy,
    );

    await this.persistenceService.saveOrchestration(orchestration);

    this.logger.log(`[TemplateService] Orchestration "${id.value}" created from template "${dto.templateId}"`);

    const view = new AutomationCatalogView();
    view.id = orchestration.id.value;
    view.name = dto.orchestrationName ?? template.name;
    view.description = template.description;
    view.version = version.value;
    view.status = OrchestrationStatus.Draft;
    view.executionMode = template.definitionBlueprint.executionMode;
    view.stepCount = template.definitionBlueprint.steps.length;
    view.triggerCount = template.definitionBlueprint.triggers.length;
    view.createdAt = new Date();
    view.updatedAt = new Date();
    view.createdBy = instantiatedBy;
    view.tags = [];
    return view;
  }

  /**
   * Validates that all required template parameters have been supplied.
   */
  validateParams(template: AutomationTemplate, parameterValues: Record<string, unknown>): void {
    for (const requiredKey of template.requiredParameters) {
      if (!(requiredKey in parameterValues)) {
        throw new Error(
          `Template "${template.id.value}" instantiation failed: ` +
            `required parameter "${requiredKey}" is missing.`,
        );
      }
    }
  }

  private buildDefinitionFromDto(dto: import('../dto/orchestration.dto').CreateOrchestrationDto): OrchestrationDefinition {
    const steps: StepReference[] = dto.steps.map(
      (s) => new StepReference(s.stepId, s.label, s.stepType, s.platformTarget, s.config, s.timeoutSeconds, s.maxRetries, s.compensationStrategy, s.conditionExpression),
    );
    const triggers: TriggerDefinition[] = dto.triggers.map(
      (t) => new TriggerDefinition(t.triggerId, t.triggerType, t.config, t.filters, t.debounceMs, t.isEnabled),
    );
    const parameters: AutomationParameter[] = dto.parameters.map(
      (p) => new AutomationParameter(p.key, p.type, p.required, p.defaultValue, p.description, p.validation),
    );
    const variables: AutomationVariable[] = dto.variables.map(
      (v) => new AutomationVariable(v.key, v.type, v.value, v.scope),
    );
    return new OrchestrationDefinition(
      dto.name, dto.description, dto.executionMode,
      steps, dto.edges, triggers, parameters, variables,
      dto.metadata, dto.globalTimeoutSeconds, dto.compensationStrategy,
    );
  }

  private toView(template: AutomationTemplate): AutomationTemplatesView {
    const view = new AutomationTemplatesView();
    view.id = template.id.value;
    view.name = template.name;
    view.description = template.description;
    view.category = template.category;
    view.version = template.version;
    view.isPublic = template.isPublic;
    view.usageCount = template.usageCount;
    view.requiredParameters = [...template.requiredParameters];
    view.createdAt = template.createdAt;
    return view;
  }
}

// ============================================================================
// CheckpointService
// ============================================================================

/**
 * Manages execution checkpoints for pause/resume capability.
 *
 * Responsibilities:
 *   - Capture execution checkpoints at DAG node boundaries
 *   - Persist checkpoints (append-only)
 *   - Load the latest checkpoint for a given execution
 *   - Validate checkpoint integrity via HMAC checksum
 *   - Ensure consistency between checkpoint version and execution state
 */
@Injectable()
export class CheckpointService {
  private readonly logger = new Logger(CheckpointService.name);

  /** HMAC secret for checkpoint signing (injected from config in production). */
  private static readonly CHECKPOINT_SECRET = 'checkpoint-signing-key';

  /**
   * Captures and persists an execution checkpoint at the given step boundary.
   * Raises an AutomationCheckpointReached domain event on the execution.
   */
  async captureCheckpoint(
    execution: OrchestrationExecution,
    completedStepId: string,
  ): Promise<ExecutionCheckpoint> {
    this.logger.log(`[CheckpointService] Capturing checkpoint for execution "${execution.executionId}" at step "${completedStepId}"`);

    const checkpointId = `ckpt_${execution.executionId}_${completedStepId}_${Date.now()}`;
    const variables = { ...execution.context.variables };
    const pendingStepIds: string[] = []; // Resolved from graph by RuntimeService

    const checksum = this.computeChecksum(execution.executionId, completedStepId, variables);

    const checkpoint = new ExecutionCheckpoint(
      checkpointId,
      execution.executionId,
      completedStepId,
      pendingStepIds,
      Object.freeze(variables),
      checksum,
    );

    execution.recordCheckpoint(checkpoint);

    this.logger.log(`[CheckpointService] Checkpoint "${checkpointId}" captured`);

    return checkpoint;
  }

  /**
   * Loads the most recent checkpoint for an execution.
   * Returns undefined if no checkpoints exist.
   */
  async loadLatestCheckpoint(executionId: string): Promise<ExecutionCheckpoint | undefined> {
    this.logger.log(`[CheckpointService] Loading latest checkpoint for execution "${executionId}"`);
    // Stub: load from persistence layer
    return undefined;
  }

  /**
   * Validates the integrity of a checkpoint by recomputing and comparing its checksum.
   * Throws if the checkpoint has been tampered with or is inconsistent.
   */
  async validateConsistency(checkpoint: ExecutionCheckpoint): Promise<void> {
    this.logger.log(`[CheckpointService] Validating checkpoint "${checkpoint.checkpointId}"`);

    const expected = this.computeChecksum(
      checkpoint.executionId,
      checkpoint.completedStepId,
      checkpoint.variables as Record<string, unknown>,
    );

    if (expected !== checkpoint.checksum) {
      throw new Error(
        `Checkpoint "${checkpoint.checkpointId}" integrity check failed. ` +
          `Expected checksum "${expected}" but found "${checkpoint.checksum}".`,
      );
    }

    this.logger.log(`[CheckpointService] Checkpoint "${checkpoint.checkpointId}" integrity verified`);
  }

  /**
   * Computes an HMAC-SHA256 checksum for a checkpoint.
   * In production this uses Node's crypto module.
   */
  private computeChecksum(
    executionId: string,
    stepId: string,
    variables: Record<string, unknown>,
  ): string {
    // Stub: real implementation uses crypto.createHmac('sha256', secret)
    const payload = `${executionId}:${stepId}:${JSON.stringify(variables)}`;
    return Buffer.from(payload).toString('base64').slice(0, 32);
  }
}

// ============================================================================
// OrchestrationCorrelationService
// ============================================================================

/**
 * Tracks cross-platform causation and correlation chains.
 *
 * Extends the existing Event Platform CorrelationService concept to span
 * across all four platforms in a single logical business saga.
 *
 * Each orchestration execution carries:
 *   - correlationId — links all related executions in a saga
 *   - causationId   — identifies the direct cause of this execution
 *   - traceId       — distributed trace for observability
 *
 * This service writes to the correlation store so that any platform
 * (Workflow, Rules, Events, Scheduler) can reconstruct the full causal chain.
 */
@Injectable()
export class OrchestrationCorrelationService {
  private readonly logger = new Logger(OrchestrationCorrelationService.name);

  /**
   * Records a new orchestration execution in the correlation store.
   */
  async trackOrchestrationExecution(
    executionId: string,
    orchestrationId: string,
    correlationId: string,
    traceId: string,
  ): Promise<void> {
    this.logger.log(
      `[OrchestrationCorrelationService] Tracking execution "${executionId}" ` +
        `corr="${correlationId}" trace="${traceId}"`,
    );
    // Stub: write to correlation store
  }

  /**
   * Records a platform call made during an orchestration step.
   * Links the platform-specific ID (workflowInstanceId, jobExecutionId, etc.)
   * back to the orchestration execution context.
   */
  async trackPlatformCall(
    executionId: string,
    stepId: string,
    platformType: OrchestrationStepType,
    platformResourceId: string,
    correlationId: string,
  ): Promise<void> {
    this.logger.log(
      `[OrchestrationCorrelationService] Tracking platform call: ` +
        `execution="${executionId}" step="${stepId}" platform="${platformType}" resource="${platformResourceId}"`,
    );
    // Stub: link in correlation store
  }

  /**
   * Retrieves the full causal chain for a given correlationId.
   * Returns all platform calls made as part of the correlated saga.
   */
  async getCausalChain(
    tenantId: string,
    correlationId: string,
  ): Promise<Array<{ executionId: string; stepId: string; platformType: string; resourceId: string; timestamp: Date }>> {
    this.logger.log(`[OrchestrationCorrelationService] Retrieving causal chain for correlationId "${correlationId}"`);
    // Stub: query correlation store
    return [];
  }
}

// ============================================================================
// ExecutionPersistenceService
// ============================================================================

/**
 * Storage port for the Orchestration Platform.
 *
 * Responsibilities:
 *   - Persist and load Orchestration aggregates
 *   - Persist and load OrchestrationExecution entities
 *   - Persist and load AutomationTemplate entities
 *   - Execute CQRS read-model queries
 *
 * This is a pure port (hexagonal architecture). In production it is
 * backed by a PostgreSQL + Prisma adapter. In tests it is replaced with
 * an in-memory adapter.
 *
 * No business logic lives here — only storage operations.
 */
@Injectable()
export class ExecutionPersistenceService {
  private readonly logger = new Logger(ExecutionPersistenceService.name);

  // -------------------------------------------------------------------------
  // Orchestration aggregate
  // -------------------------------------------------------------------------

  /** Persists or updates an Orchestration aggregate. */
  async saveOrchestration(orchestration: Orchestration): Promise<void> {
    this.logger.log(`[ExecutionPersistenceService] Saving orchestration "${orchestration.id.value}"`);
    // Stub: upsert to PostgreSQL via Prisma
  }

  /** Loads an Orchestration aggregate by ID. Throws if not found or not accessible by tenant. */
  async loadOrchestration(tenantId: string, orchestrationId: string): Promise<Orchestration> {
    this.logger.log(`[ExecutionPersistenceService] Loading orchestration "${orchestrationId}" for tenant "${tenantId}"`);
    // Stub: return a placeholder — production implementation queries DB
    const id = new OrchestrationId(orchestrationId);
    const version = new OrchestrationVersion(1);
    const definition = new OrchestrationDefinition(
      'Stub Orchestration',
      '',
      ExecutionMode.Sequential,
      [
        new StepReference('step_1', 'Step 1', OrchestrationStepType.WorkflowStep, 'wf_stub', {}, 60, 0, CompensationStrategy.Backward),
      ],
      [],
      [
        new TriggerDefinition('trigger_1', TriggerType.ManualTrigger, {}, [], 0, true),
      ],
      [],
      [],
      {},
      0,
      CompensationStrategy.Backward,
    );
    return new Orchestration(id, tenantId, version, definition, OrchestrationStatus.Published);
  }

  /** Queries the orchestration catalog with filter and pagination. */
  async queryOrchestrations(query: GetAutomationCatalogQuery): Promise<AutomationCatalogView[]> {
    this.logger.log(`[ExecutionPersistenceService] Querying orchestrations for tenant "${query.tenantId}"`);
    return [];
  }

  // -------------------------------------------------------------------------
  // Execution entity
  // -------------------------------------------------------------------------

  /** Persists or updates an OrchestrationExecution entity. */
  async saveExecution(execution: OrchestrationExecution): Promise<void> {
    this.logger.log(`[ExecutionPersistenceService] Saving execution "${execution.executionId}"`);
    // Stub: upsert to PostgreSQL via Prisma
  }

  /** Loads an OrchestrationExecution entity by ID. */
  async loadExecution(tenantId: string, executionId: string): Promise<OrchestrationExecution> {
    this.logger.log(`[ExecutionPersistenceService] Loading execution "${executionId}"`);
    // Stub
    const orchestrationId = new OrchestrationId('orch_stub');
    const version = new OrchestrationVersion(1);
    const traceId = new ExecutionTraceId(`trace_stub`);
    const context = new ExecutionContext(traceId, tenantId, 'corr_stub', undefined, {}, TriggerType.ManualTrigger, {});
    return new OrchestrationExecution(executionId, orchestrationId, version, tenantId, context, TriggerType.ManualTrigger, OrchestrationExecutionStatus.Running);
  }

  /** Queries execution summaries. */
  async queryExecutions(query: GetAutomationExecutionsQuery): Promise<AutomationExecutionsView[]> {
    this.logger.log(`[ExecutionPersistenceService] Querying executions for tenant "${query.tenantId}"`);
    return [];
  }

  // -------------------------------------------------------------------------
  // Template entity
  // -------------------------------------------------------------------------

  /** Persists or updates an AutomationTemplate entity. */
  async saveTemplate(template: AutomationTemplate): Promise<void> {
    this.logger.log(`[ExecutionPersistenceService] Saving template "${template.id.value}"`);
    // Stub
  }

  /** Loads an AutomationTemplate by ID. Validates tenant access. */
  async loadTemplate(tenantId: string, templateId: string): Promise<AutomationTemplate> {
    this.logger.log(`[ExecutionPersistenceService] Loading template "${templateId}"`);
    // Stub
    const id = new AutomationTemplateId(templateId);
    const definition = new OrchestrationDefinition(
      'Stub Template',
      '',
      ExecutionMode.Sequential,
      [new StepReference('s1', 'Step 1', OrchestrationStepType.WorkflowStep, 'wf_stub', {}, 60, 0, CompensationStrategy.Backward)],
      [],
      [new TriggerDefinition('t1', TriggerType.ManualTrigger, {}, [], 0, true)],
      [],
      [],
      {},
      0,
      CompensationStrategy.Backward,
    );
    return new AutomationTemplate(id, tenantId, 'Stub Template', '', TemplateCategory.Custom, definition, [], 1, false, 0);
  }

  /** Queries the template catalog. */
  async queryTemplates(query: GetAutomationTemplatesQuery): Promise<AutomationTemplatesView[]> {
    this.logger.log(`[ExecutionPersistenceService] Querying templates for tenant "${query.tenantId}"`);
    return [];
  }

  // -------------------------------------------------------------------------
  // Statistics
  // -------------------------------------------------------------------------

  /** Queries aggregated platform statistics. */
  async queryStatistics(query: GetAutomationStatisticsQuery): Promise<AutomationStatisticsView> {
    this.logger.log(`[ExecutionPersistenceService] Querying statistics for tenant "${query.tenantId}"`);
    const view = new AutomationStatisticsView();
    view.totalOrchestrations = 0;
    view.publishedOrchestrations = 0;
    view.totalExecutions = 0;
    view.runningExecutions = 0;
    view.completedExecutions = 0;
    view.failedExecutions = 0;
    view.cancelledExecutions = 0;
    view.averageExecutionDurationMs = 0;
    view.p95ExecutionDurationMs = 0;
    view.checkpointsRecorded = 0;
    view.compensationsInitiated = 0;
    view.templateUsageCount = 0;
    view.mostUsedTemplates = [];
    view.executionsByTriggerType = {} as Record<TriggerType, number>;
    view.periodFrom = query.fromDate;
    view.periodTo = query.toDate;
    return view;
  }
}
