/**
 * Automation Orchestration Platform — Domain Value Objects
 *
 * All value objects are immutable. Equality is structural, not referential.
 * No framework dependencies. No I/O. Fully unit-testable.
 *
 * Implements the DAG (Directed Acyclic Graph) ExecutionGraph with cycle
 * detection, topological sort, and parallel group discovery.
 */

import {
  OrchestrationStepType,
  TriggerType,
  ExecutionMode,
  CompensationStrategy,
} from '../enums/orchestration.enums';

// ---------------------------------------------------------------------------
// Identity Value Objects
// ---------------------------------------------------------------------------

/**
 * Strongly typed identifier for an Orchestration aggregate.
 * Format: orch_{uuid}
 */
export class OrchestrationId {
  constructor(public readonly value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('OrchestrationId must not be empty.');
    }
  }

  public equals(other: OrchestrationId): boolean {
    return this.value === other.value;
  }

  public toString(): string {
    return this.value;
  }
}

/**
 * Monotonically increasing version identifier for an orchestration definition.
 * Versions are immutable after publication — a new version must be created
 * for any mutation to a published orchestration.
 */
export class OrchestrationVersion {
  constructor(public readonly value: number) {
    if (!Number.isInteger(value) || value < 1) {
      throw new Error('OrchestrationVersion must be a positive integer.');
    }
  }

  /** Returns the next version. */
  public increment(): OrchestrationVersion {
    return new OrchestrationVersion(this.value + 1);
  }

  public equals(other: OrchestrationVersion): boolean {
    return this.value === other.value;
  }

  public toString(): string {
    return `v${this.value}`;
  }
}

/**
 * Strongly typed identifier for an AutomationTemplate entity.
 * Format: tmpl_{uuid}
 */
export class AutomationTemplateId {
  constructor(public readonly value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('AutomationTemplateId must not be empty.');
    }
  }

  public equals(other: AutomationTemplateId): boolean {
    return this.value === other.value;
  }

  public toString(): string {
    return this.value;
  }
}

/**
 * Distributed trace identifier that threads through all platform calls
 * made within a single orchestration execution.
 * Compatible with OpenTelemetry W3C trace context.
 */
export class ExecutionTraceId {
  constructor(public readonly value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('ExecutionTraceId must not be empty.');
    }
  }

  public equals(other: ExecutionTraceId): boolean {
    return this.value === other.value;
  }

  public toString(): string {
    return this.value;
  }
}

// ---------------------------------------------------------------------------
// StepReference — Describes a single node in the execution DAG
// ---------------------------------------------------------------------------

/**
 * An immutable descriptor for one step node in the execution graph.
 *
 * platformTarget — identifies the specific target within the platform
 *                  (e.g. workflowId for WorkflowStep, ruleId for RuleStep).
 * config         — step-level override parameters (timeout, retries, etc.).
 * compensationAction — what to invoke during saga rollback for this step.
 */
export class StepReference {
  constructor(
    /** Unique identifier of this step within the orchestration definition. */
    public readonly stepId: string,
    /** Human-readable label for this step. */
    public readonly label: string,
    /** Which platform this step delegates to. */
    public readonly stepType: OrchestrationStepType,
    /** The resource identifier within the target platform. */
    public readonly platformTarget: string,
    /** Step-level configuration overrides. */
    public readonly config: Readonly<Record<string, unknown>>,
    /** Timeout in seconds for this step (0 = no timeout). */
    public readonly timeoutSeconds: number,
    /** Maximum retry attempts on transient failure. */
    public readonly maxRetries: number,
    /** Compensation action config for saga rollback. */
    public readonly compensationStrategy: CompensationStrategy,
    /** Optional condition expression (evaluated at runtime for conditional branches). */
    public readonly conditionExpression?: string,
  ) {
    if (!stepId || stepId.trim().length === 0) {
      throw new Error('StepReference.stepId must not be empty.');
    }
    if (!platformTarget || platformTarget.trim().length === 0) {
      throw new Error('StepReference.platformTarget must not be empty.');
    }
    if (timeoutSeconds < 0) {
      throw new Error('StepReference.timeoutSeconds must be non-negative.');
    }
    if (maxRetries < 0) {
      throw new Error('StepReference.maxRetries must be non-negative.');
    }
  }
}

// ---------------------------------------------------------------------------
// TriggerDefinition — Describes what fires an orchestration
// ---------------------------------------------------------------------------

/**
 * Immutable descriptor for an orchestration trigger.
 *
 * Each orchestration can have 1..N triggers. Any trigger that fires
 * will initiate a new execution.
 *
 * filters   — key/value predicates applied to the triggering payload;
 *             if all filters pass, the execution is initiated.
 * debounceMs — minimum milliseconds between successive trigger firings
 *              (0 = no debounce).
 */
export class TriggerDefinition {
  constructor(
    /** Unique identifier for this trigger within the orchestration. */
    public readonly triggerId: string,
    /** What kind of signal initiates this trigger. */
    public readonly triggerType: TriggerType,
    /**
     * Type-specific configuration:
     *   Schedule   → { scheduleId: string }
     *   DomainEvent → { eventType: string, topic: string }
     *   Webhook    → { path: string, secret: string }
     *   RuleResult → { ruleId: string, outcomeCode: string }
     *   AiDecision → { agentId: string, decisionKey: string }
     */
    public readonly config: Readonly<Record<string, unknown>>,
    /** Key/value filters applied to the trigger payload. */
    public readonly filters: ReadonlyArray<Readonly<{ key: string; operator: string; value: unknown }>>,
    /** Minimum milliseconds between invocations (0 = none). */
    public readonly debounceMs: number,
    /** Whether this trigger is currently active. */
    public readonly isEnabled: boolean,
  ) {
    if (!triggerId || triggerId.trim().length === 0) {
      throw new Error('TriggerDefinition.triggerId must not be empty.');
    }
    if (debounceMs < 0) {
      throw new Error('TriggerDefinition.debounceMs must be non-negative.');
    }
  }
}

// ---------------------------------------------------------------------------
// OrchestrationDefinition — The immutable blueprint of an orchestration
// ---------------------------------------------------------------------------

/**
 * Captures the complete, immutable specification of an orchestration.
 * Once published, this definition is sealed — mutations require a new version.
 *
 * The steps list is unordered; execution order is determined by the DAG
 * (ExecutionGraph) derived from the edges list.
 */
export class OrchestrationDefinition {
  constructor(
    /** Human-readable name. */
    public readonly name: string,
    /** Human-readable description. */
    public readonly description: string,
    /** How the execution graph is traversed. */
    public readonly executionMode: ExecutionMode,
    /** All step nodes in this orchestration. */
    public readonly steps: ReadonlyArray<StepReference>,
    /**
     * Directed edges between steps: { from: stepId, to: stepId }.
     * Combined with steps, these define the complete DAG.
     */
    public readonly edges: ReadonlyArray<Readonly<{ from: string; to: string }>>,
    /** Triggers that can initiate this orchestration. */
    public readonly triggers: ReadonlyArray<TriggerDefinition>,
    /** Declared input parameters. */
    public readonly parameters: ReadonlyArray<AutomationParameter>,
    /** Declared variables scoped to the execution context. */
    public readonly variables: ReadonlyArray<AutomationVariable>,
    /** Free-form metadata (tags, owner, SLA, etc.). */
    public readonly metadata: Readonly<Record<string, unknown>>,
    /** Global execution timeout in seconds (0 = no global timeout). */
    public readonly globalTimeoutSeconds: number,
    /** Saga compensation strategy applied if execution fails. */
    public readonly compensationStrategy: CompensationStrategy,
  ) {
    if (!name || name.trim().length === 0) {
      throw new Error('OrchestrationDefinition.name must not be empty.');
    }
    if (steps.length === 0) {
      throw new Error('OrchestrationDefinition must contain at least one step.');
    }
    if (globalTimeoutSeconds < 0) {
      throw new Error('OrchestrationDefinition.globalTimeoutSeconds must be non-negative.');
    }
  }
}

// ---------------------------------------------------------------------------
// ExecutionGraph — DAG implementation for step ordering
// ---------------------------------------------------------------------------

/**
 * Directed Acyclic Graph representation of orchestration steps.
 *
 * Responsibilities:
 *   - Build adjacency lists from StepReference + edge definitions
 *   - Detect cycles (DFS-based) — published orchestrations MUST be acyclic
 *   - Produce topological sort for sequential execution ordering
 *   - Identify parallel groups (nodes with no dependency between them)
 *   - Resolve conditional branches at runtime
 *
 * This is a pure value object: no side effects, no I/O.
 */
export class ExecutionGraph {
  /** Outbound adjacency list: stepId → set of successor stepIds. */
  private readonly adjacency: Map<string, Set<string>>;
  /** Inbound adjacency list: stepId → set of predecessor stepIds. */
  private readonly inbound: Map<string, Set<string>>;
  /** All step nodes indexed by stepId. */
  private readonly nodes: Map<string, StepReference>;

  constructor(
    steps: ReadonlyArray<StepReference>,
    edges: ReadonlyArray<Readonly<{ from: string; to: string }>>,
  ) {
    this.nodes = new Map(steps.map((s) => [s.stepId, s]));
    this.adjacency = new Map(steps.map((s) => [s.stepId, new Set<string>()]));
    this.inbound = new Map(steps.map((s) => [s.stepId, new Set<string>()]));

    for (const edge of edges) {
      if (!this.nodes.has(edge.from)) {
        throw new Error(`ExecutionGraph: edge source "${edge.from}" does not reference a known step.`);
      }
      if (!this.nodes.has(edge.to)) {
        throw new Error(`ExecutionGraph: edge target "${edge.to}" does not reference a known step.`);
      }
      this.adjacency.get(edge.from)!.add(edge.to);
      this.inbound.get(edge.to)!.add(edge.from);
    }
  }

  /**
   * Returns true if the graph contains at least one cycle.
   * Uses iterative DFS with a three-color marking scheme.
   */
  public hasCycle(): boolean {
    const WHITE = 0, GRAY = 1, BLACK = 2;
    const color = new Map<string, number>(
      [...this.nodes.keys()].map((id) => [id, WHITE]),
    );

    const dfs = (nodeId: string): boolean => {
      color.set(nodeId, GRAY);
      for (const neighbor of this.adjacency.get(nodeId) ?? []) {
        const c = color.get(neighbor) ?? WHITE;
        if (c === GRAY) return true;
        if (c === WHITE && dfs(neighbor)) return true;
      }
      color.set(nodeId, BLACK);
      return false;
    };

    for (const nodeId of this.nodes.keys()) {
      if ((color.get(nodeId) ?? WHITE) === WHITE && dfs(nodeId)) return true;
    }
    return false;
  }

  /**
   * Returns a topological ordering of step IDs using Kahn's algorithm.
   * Throws if the graph contains a cycle (call hasCycle() first or
   * rely on the validation guard in ExecutionGraphService).
   */
  public topologicalSort(): string[] {
    const inDegree = new Map<string, number>(
      [...this.nodes.keys()].map((id) => [id, this.inbound.get(id)!.size]),
    );

    const queue: string[] = [...inDegree.entries()]
      .filter(([, deg]) => deg === 0)
      .map(([id]) => id);

    const result: string[] = [];

    while (queue.length > 0) {
      const current = queue.shift()!;
      result.push(current);
      for (const successor of this.adjacency.get(current) ?? []) {
        const newDegree = (inDegree.get(successor) ?? 0) - 1;
        inDegree.set(successor, newDegree);
        if (newDegree === 0) queue.push(successor);
      }
    }

    if (result.length !== this.nodes.size) {
      throw new Error('ExecutionGraph.topologicalSort: cycle detected — DAG invariant violated.');
    }

    return result;
  }

  /**
   * Identifies groups of steps that can execute concurrently.
   * Each inner array is a set of step IDs with no dependency between them
   * and whose predecessors have all been resolved.
   *
   * This is the execution schedule used by the RuntimeService in Parallel mode.
   */
  public resolveParallelGroups(): string[][] {
    const inDegree = new Map<string, number>(
      [...this.nodes.keys()].map((id) => [id, this.inbound.get(id)!.size]),
    );

    const groups: string[][] = [];
    const remaining = new Set(this.nodes.keys());

    while (remaining.size > 0) {
      const ready = [...remaining].filter((id) => (inDegree.get(id) ?? 0) === 0);
      if (ready.length === 0) {
        throw new Error('ExecutionGraph.resolveParallelGroups: cycle detected.');
      }
      groups.push(ready);
      for (const id of ready) {
        remaining.delete(id);
        for (const successor of this.adjacency.get(id) ?? []) {
          inDegree.set(successor, (inDegree.get(successor) ?? 0) - 1);
        }
      }
    }

    return groups;
  }

  /**
   * Returns the successors of a given step.
   * Used during execution to determine which steps to activate next.
   */
  public getSuccessors(stepId: string): string[] {
    return [...(this.adjacency.get(stepId) ?? [])];
  }

  /**
   * Returns the entry points of the DAG (nodes with no inbound edges).
   */
  public getRootSteps(): string[] {
    return [...this.nodes.keys()].filter((id) => this.inbound.get(id)!.size === 0);
  }

  /**
   * Returns the node count in the graph.
   */
  public get size(): number {
    return this.nodes.size;
  }

  /**
   * Retrieves a step reference by ID.
   */
  public getStep(stepId: string): StepReference | undefined {
    return this.nodes.get(stepId);
  }
}

// ---------------------------------------------------------------------------
// ExecutionContext — Runtime context for a single execution
// ---------------------------------------------------------------------------

/**
 * Carries all runtime state for one orchestration execution.
 * Immutable after construction — mutations produce new instances.
 *
 * Threaded through every downstream platform call to preserve
 * the distributed trace and correlation chain.
 */
export class ExecutionContext {
  constructor(
    /** Links this execution to its distributed trace. */
    public readonly traceId: ExecutionTraceId,
    /** Owning tenant. */
    public readonly tenantId: string,
    /** Logical identifier linking related executions (e.g. order saga). */
    public readonly correlationId: string,
    /** The event/request that caused this execution (optional). */
    public readonly causationId: string | undefined,
    /** Runtime variable snapshot. */
    public readonly variables: Readonly<Record<string, unknown>>,
    /** Trigger type that initiated this execution. */
    public readonly triggerType: TriggerType,
    /** Free-form metadata forwarded to all downstream platform calls. */
    public readonly metadata: Readonly<Record<string, unknown>>,
  ) {}

  /**
   * Produces a new context with updated variables (immutable update).
   */
  public withVariables(updates: Record<string, unknown>): ExecutionContext {
    return new ExecutionContext(
      this.traceId,
      this.tenantId,
      this.correlationId,
      this.causationId,
      { ...this.variables, ...updates },
      this.triggerType,
      this.metadata,
    );
  }
}

// ---------------------------------------------------------------------------
// ExecutionCheckpoint — Resumable execution snapshot
// ---------------------------------------------------------------------------

/**
 * Captures the full execution state at a specific DAG node boundary.
 * Persisted by CheckpointService to enable pause/resume without state loss.
 *
 * Checkpoints are append-only — once written, they are never mutated.
 *
 * checksum — SHA-256 hex of (executionId + stepId + JSON(variables)).
 *            Verified by CheckpointService.validateConsistency() on resume.
 */
export class ExecutionCheckpoint {
  /** Immutable timestamp at which the checkpoint was captured. */
  public readonly capturedAt: Date;

  constructor(
    public readonly checkpointId: string,
    public readonly executionId: string,
    /** The step that just completed when this checkpoint was captured. */
    public readonly completedStepId: string,
    /** Steps that are ready to execute next. */
    public readonly pendingStepIds: ReadonlyArray<string>,
    /** Variable state at checkpoint time. */
    public readonly variables: Readonly<Record<string, unknown>>,
    /** Integrity hash (HMAC-SHA256). */
    public readonly checksum: string,
    capturedAt?: Date,
  ) {
    this.capturedAt = capturedAt ?? new Date();
    if (!checkpointId || checkpointId.trim().length === 0) {
      throw new Error('ExecutionCheckpoint.checkpointId must not be empty.');
    }
    if (!executionId || executionId.trim().length === 0) {
      throw new Error('ExecutionCheckpoint.executionId must not be empty.');
    }
  }
}

// ---------------------------------------------------------------------------
// AutomationVariable — Runtime-scoped variables
// ---------------------------------------------------------------------------

/**
 * A typed variable accessible during orchestration execution.
 *
 * Scope controls lifetime:
 *   execution — available for the duration of this execution only.
 *   global    — persisted across executions of the same orchestration.
 *   template  — injected at instantiation time from a template parameter.
 */
export class AutomationVariable {
  constructor(
    public readonly key: string,
    public readonly type: 'string' | 'number' | 'boolean' | 'object' | 'array',
    public readonly value: unknown,
    public readonly scope: 'execution' | 'global' | 'template',
  ) {
    if (!key || key.trim().length === 0) {
      throw new Error('AutomationVariable.key must not be empty.');
    }
  }
}

// ---------------------------------------------------------------------------
// AutomationParameter — Declared input parameters for a definition
// ---------------------------------------------------------------------------

/**
 * Declares an input parameter that must (or may) be supplied when executing
 * or instantiating from a template.
 *
 * validation — JSON Schema string applied to the supplied value.
 */
export class AutomationParameter {
  constructor(
    public readonly key: string,
    public readonly type: 'string' | 'number' | 'boolean' | 'object' | 'array',
    public readonly required: boolean,
    public readonly defaultValue: unknown | undefined,
    public readonly description: string,
    /** JSON Schema fragment for value validation. */
    public readonly validation: string | undefined,
  ) {
    if (!key || key.trim().length === 0) {
      throw new Error('AutomationParameter.key must not be empty.');
    }
  }
}
