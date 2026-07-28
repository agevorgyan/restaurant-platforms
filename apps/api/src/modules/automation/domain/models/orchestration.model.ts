/**
 * Automation Orchestration Platform — Domain Aggregates & Entities
 *
 * Defines:
 *   - Orchestration      (Aggregate Root) — owns the definition lifecycle
 *   - OrchestrationExecution (Entity)    — one runtime run of an orchestration
 *   - AutomationTemplate (Entity)        — reusable orchestration blueprint
 *
 * Business invariants enforced here.
 * No framework dependencies. No I/O. Fully unit-testable.
 */

import {
  OrchestrationId,
  OrchestrationVersion,
  OrchestrationDefinition,
  AutomationTemplateId,
  ExecutionContext,
  ExecutionCheckpoint,
} from '../value-objects/orchestration.value-objects';

import {
  OrchestrationStatus,
  OrchestrationExecutionStatus,
  StepExecutionStatus,
  TriggerType,
  TemplateCategory,
} from '../enums/orchestration.enums';

// ---------------------------------------------------------------------------
// Orchestration (Aggregate Root)
// ---------------------------------------------------------------------------

/**
 * The Orchestration aggregate root manages the complete definition lifecycle.
 *
 * Key invariants:
 *   1. A definition can only be executed when Published.
 *   2. Once Published, the definition is sealed (immutable).
 *   3. To modify a published orchestration, a new version must be cloned.
 *   4. Domain events are collected and published transactionally.
 */
export class Orchestration {
  /** Domain events raised by this aggregate, not yet published. */
  private readonly _events: Array<object> = [];

  /** Whether the definition has been sealed after publication. */
  private _sealed: boolean = false;

  constructor(
    public readonly id: OrchestrationId,
    public readonly tenantId: string,
    public readonly version: OrchestrationVersion,
    public readonly definition: OrchestrationDefinition,
    public status: OrchestrationStatus = OrchestrationStatus.Draft,
    public readonly createdAt: Date = new Date(),
    public readonly createdBy: string = 'system',
    public updatedAt: Date = new Date(),
  ) {}

  // -------------------------------------------------------------------------
  // State machine transitions
  // -------------------------------------------------------------------------

  /**
   * Publishes a Draft orchestration, making it immutable and executable.
   *
   * The caller (OrchestrationService) must validate the DAG (cycle detection)
   * before invoking this method.
   *
   * @throws if not in Draft status.
   */
  public publish(publishedBy: string): void {
    if (this.status !== OrchestrationStatus.Draft) {
      throw new Error(
        `Cannot publish Orchestration "${this.id.value}" — current status is "${this.status}". ` +
          `Only Draft orchestrations can be published.`,
      );
    }
    this.status = OrchestrationStatus.Published;
    this._sealed = true;
    this.updatedAt = new Date();
    this.recordEvent({
      type: 'OrchestrationPublished',
      orchestrationId: this.id.value,
      version: this.version.value,
      tenantId: this.tenantId,
      publishedBy,
    });
  }

  /**
   * Cancels a Draft or Published orchestration.
   * Running executions are not affected — they must be cancelled independently.
   *
   * @throws if already in a terminal state.
   */
  public cancel(cancelledBy: string, reason?: string): void {
    const terminal: OrchestrationStatus[] = [
      OrchestrationStatus.Completed,
      OrchestrationStatus.Cancelled,
      OrchestrationStatus.Failed,
    ];
    if (terminal.includes(this.status)) {
      throw new Error(
        `Cannot cancel Orchestration "${this.id.value}" — already in terminal state "${this.status}".`,
      );
    }
    this.status = OrchestrationStatus.Cancelled;
    this.updatedAt = new Date();
    this.recordEvent({
      type: 'OrchestrationCancelled',
      orchestrationId: this.id.value,
      tenantId: this.tenantId,
      cancelledBy,
      reason,
    });
  }

  // -------------------------------------------------------------------------
  // Guards
  // -------------------------------------------------------------------------

  /** Returns true if the definition has been sealed after publication. */
  public get isSealed(): boolean {
    return this._sealed;
  }

  /** Returns true if this orchestration can accept new execution requests. */
  public get isExecutable(): boolean {
    return this.status === OrchestrationStatus.Published;
  }

  // -------------------------------------------------------------------------
  // Domain event helpers
  // -------------------------------------------------------------------------

  private recordEvent(event: object): void {
    this._events.push(event);
  }

  /** Returns and clears uncommitted domain events. */
  public pullEvents(): ReadonlyArray<object> {
    const events = [...this._events];
    this._events.length = 0;
    return events;
  }
}

// ---------------------------------------------------------------------------
// StepExecutionRecord — Tracks the execution state of one DAG node
// ---------------------------------------------------------------------------

/**
 * Immutable record of how a single step executed within an orchestration run.
 * Sealed once a terminal status is reached.
 */
export class StepExecutionRecord {
  private _status: StepExecutionStatus;
  private _startedAt?: Date;
  private _completedAt?: Date;
  private _output?: Readonly<Record<string, unknown>>;
  private _error?: string;
  private _attemptCount: number;
  private _sealed: boolean;

  constructor(
    public readonly stepId: string,
    public readonly stepLabel: string,
    initialStatus: StepExecutionStatus = StepExecutionStatus.Pending,
  ) {
    this._status = initialStatus;
    this._attemptCount = 0;
    this._sealed = false;
  }

  public markRunning(): void {
    this.assertNotSealed('markRunning');
    this._status = StepExecutionStatus.Running;
    this._startedAt = new Date();
    this._attemptCount++;
  }

  public markCompleted(output: Record<string, unknown>): void {
    this.assertNotSealed('markCompleted');
    this._status = StepExecutionStatus.Completed;
    this._output = Object.freeze(output);
    this._completedAt = new Date();
    this._sealed = true;
  }

  public markFailed(error: string): void {
    this.assertNotSealed('markFailed');
    this._status = StepExecutionStatus.Failed;
    this._error = error;
    this._completedAt = new Date();
    this._sealed = true;
  }

  public markSkipped(): void {
    this.assertNotSealed('markSkipped');
    this._status = StepExecutionStatus.Skipped;
    this._completedAt = new Date();
    this._sealed = true;
  }

  public markRetrying(): void {
    this.assertNotSealed('markRetrying');
    this._status = StepExecutionStatus.Retrying;
  }

  public markCompensated(): void {
    this._status = StepExecutionStatus.Compensated;
    this._sealed = true;
  }

  private assertNotSealed(operation: string): void {
    if (this._sealed) {
      throw new Error(
        `StepExecutionRecord "${this.stepId}" is sealed. ` +
          `Operation "${operation}" is not permitted after terminal state.`,
      );
    }
  }

  get status(): StepExecutionStatus { return this._status; }
  get startedAt(): Date | undefined { return this._startedAt; }
  get completedAt(): Date | undefined { return this._completedAt; }
  get output(): Readonly<Record<string, unknown>> | undefined { return this._output; }
  get error(): string | undefined { return this._error; }
  get attemptCount(): number { return this._attemptCount; }
  get isTerminal(): boolean {
    return [
      StepExecutionStatus.Completed,
      StepExecutionStatus.Failed,
      StepExecutionStatus.Skipped,
      StepExecutionStatus.Compensated,
    ].includes(this._status);
  }
}

// ---------------------------------------------------------------------------
// OrchestrationExecution (Entity)
// ---------------------------------------------------------------------------

/**
 * Represents a single runtime execution of a Published orchestration.
 *
 * Multiple executions can be active concurrently for the same orchestration.
 *
 * Key responsibilities:
 *   - Track which DAG steps have been completed.
 *   - Manage the step execution record map.
 *   - Store execution checkpoints for pause/resume.
 *   - Enforce status transitions and immutability on terminal states.
 */
export class OrchestrationExecution {
  /** Domain events raised by this entity. */
  private readonly _events: Array<object> = [];

  /** Ordered map of step execution records keyed by stepId. */
  private readonly _stepRecords: Map<string, StepExecutionRecord> = new Map();

  /** Append-only list of execution checkpoints. */
  private readonly _checkpoints: ExecutionCheckpoint[] = [];

  /** Wall-clock timestamp when execution started. */
  private _startedAt?: Date;

  /** Wall-clock timestamp when execution reached a terminal state. */
  private _completedAt?: Date;

  /** Accumulated duration in milliseconds (updated on each checkpoint). */
  private _durationMs: number = 0;

  /** Human-readable failure reason, set on terminal failure. */
  private _failureReason?: string;

  constructor(
    public readonly executionId: string,
    public readonly orchestrationId: OrchestrationId,
    public readonly orchestrationVersion: OrchestrationVersion,
    public readonly tenantId: string,
    public readonly context: ExecutionContext,
    public readonly triggerType: TriggerType,
    public status: OrchestrationExecutionStatus = OrchestrationExecutionStatus.Pending,
    public readonly createdAt: Date = new Date(),
  ) {}

  // -------------------------------------------------------------------------
  // Lifecycle transitions
  // -------------------------------------------------------------------------

  /**
   * Transitions the execution to Running state and records the start time.
   *
   * @throws if the execution is not in Pending status.
   */
  public start(): void {
    if (this.status !== OrchestrationExecutionStatus.Pending) {
      throw new Error(
        `Cannot start OrchestrationExecution "${this.executionId}" — status is "${this.status}".`,
      );
    }
    this.status = OrchestrationExecutionStatus.Running;
    this._startedAt = new Date();
    this.recordEvent({
      type: 'OrchestrationStarted',
      executionId: this.executionId,
      orchestrationId: this.orchestrationId.value,
      tenantId: this.tenantId,
      startedAt: this._startedAt,
      triggerType: this.triggerType,
    });
  }

  /**
   * Pauses a running execution. Requires an active checkpoint to be present.
   *
   * @throws if the execution is not Running or has no checkpoints.
   */
  public pause(): void {
    if (this.status !== OrchestrationExecutionStatus.Running) {
      throw new Error(
        `Cannot pause OrchestrationExecution "${this.executionId}" — status is "${this.status}".`,
      );
    }
    if (this._checkpoints.length === 0) {
      throw new Error(
        `Cannot pause OrchestrationExecution "${this.executionId}" — no checkpoints recorded.`,
      );
    }
    this.status = OrchestrationExecutionStatus.Paused;
    this.recordEvent({
      type: 'OrchestrationPaused',
      executionId: this.executionId,
      orchestrationId: this.orchestrationId.value,
      tenantId: this.tenantId,
    });
  }

  /**
   * Resumes a Paused execution from the latest checkpoint.
   *
   * @throws if the execution is not Paused.
   */
  public resume(): void {
    if (this.status !== OrchestrationExecutionStatus.Paused) {
      throw new Error(
        `Cannot resume OrchestrationExecution "${this.executionId}" — status is "${this.status}".`,
      );
    }
    this.status = OrchestrationExecutionStatus.Running;
    this.recordEvent({
      type: 'OrchestrationResumed',
      executionId: this.executionId,
      orchestrationId: this.orchestrationId.value,
      tenantId: this.tenantId,
    });
  }

  /**
   * Marks the execution as successfully completed.
   * Terminal state — no further transitions permitted.
   */
  public complete(): void {
    this.status = OrchestrationExecutionStatus.Completed;
    this._completedAt = new Date();
    this._durationMs = this._startedAt
      ? this._completedAt.getTime() - this._startedAt.getTime()
      : 0;
    this.recordEvent({
      type: 'OrchestrationCompleted',
      executionId: this.executionId,
      orchestrationId: this.orchestrationId.value,
      tenantId: this.tenantId,
      durationMs: this._durationMs,
    });
  }

  /**
   * Marks the execution as failed.
   * Terminal state.
   */
  public fail(reason: string): void {
    this.status = OrchestrationExecutionStatus.Failed;
    this._failureReason = reason;
    this._completedAt = new Date();
    this._durationMs = this._startedAt
      ? this._completedAt.getTime() - this._startedAt.getTime()
      : 0;
    this.recordEvent({
      type: 'OrchestrationFailed',
      executionId: this.executionId,
      orchestrationId: this.orchestrationId.value,
      tenantId: this.tenantId,
      reason,
      durationMs: this._durationMs,
    });
  }

  /**
   * Initiates saga compensation.
   * Transitions Running or Failed execution to Compensating state.
   */
  public compensate(): void {
    const compensatable: OrchestrationExecutionStatus[] = [
      OrchestrationExecutionStatus.Failed,
      OrchestrationExecutionStatus.Running,
    ];
    if (!compensatable.includes(this.status)) {
      throw new Error(
        `Cannot compensate OrchestrationExecution "${this.executionId}" — status is "${this.status}".`,
      );
    }
    this.status = OrchestrationExecutionStatus.Compensating;
    this.recordEvent({
      type: 'AutomationCompensated',
      executionId: this.executionId,
      orchestrationId: this.orchestrationId.value,
      tenantId: this.tenantId,
    });
  }

  /**
   * Cancels the execution (operator-initiated).
   *
   * @throws if already in a terminal state.
   */
  public cancel(): void {
    const terminal: OrchestrationExecutionStatus[] = [
      OrchestrationExecutionStatus.Completed,
      OrchestrationExecutionStatus.Cancelled,
      OrchestrationExecutionStatus.Compensated,
    ];
    if (terminal.includes(this.status)) {
      throw new Error(
        `Cannot cancel OrchestrationExecution "${this.executionId}" — already in terminal state.`,
      );
    }
    this.status = OrchestrationExecutionStatus.Cancelled;
    this._completedAt = new Date();
    this.recordEvent({
      type: 'OrchestrationCancelled',
      executionId: this.executionId,
      orchestrationId: this.orchestrationId.value,
      tenantId: this.tenantId,
    });
  }

  // -------------------------------------------------------------------------
  // Step record management
  // -------------------------------------------------------------------------

  /** Registers a step record for tracking. Called before step execution begins. */
  public registerStep(stepId: string, stepLabel: string): void {
    if (!this._stepRecords.has(stepId)) {
      this._stepRecords.set(stepId, new StepExecutionRecord(stepId, stepLabel));
    }
  }

  /** Returns the execution record for a step, or undefined if not registered. */
  public getStepRecord(stepId: string): StepExecutionRecord | undefined {
    return this._stepRecords.get(stepId);
  }

  /** Returns all registered step records (read-only). */
  public getAllStepRecords(): ReadonlyArray<StepExecutionRecord> {
    return [...this._stepRecords.values()];
  }

  // -------------------------------------------------------------------------
  // Checkpoint management
  // -------------------------------------------------------------------------

  /**
   * Appends an execution checkpoint.
   * Checkpoints are immutable and append-only.
   * Raises an AutomationCheckpointReached domain event.
   */
  public recordCheckpoint(checkpoint: ExecutionCheckpoint): void {
    this._checkpoints.push(checkpoint);
    this.recordEvent({
      type: 'AutomationCheckpointReached',
      executionId: this.executionId,
      orchestrationId: this.orchestrationId.value,
      tenantId: this.tenantId,
      checkpointId: checkpoint.checkpointId,
      completedStepId: checkpoint.completedStepId,
    });
  }

  /** Returns the most recent checkpoint, or undefined if none. */
  public getLatestCheckpoint(): ExecutionCheckpoint | undefined {
    return this._checkpoints.at(-1);
  }

  /** Returns all checkpoints (append-only, read-only). */
  public getAllCheckpoints(): ReadonlyArray<ExecutionCheckpoint> {
    return [...this._checkpoints];
  }

  // -------------------------------------------------------------------------
  // Accessors
  // -------------------------------------------------------------------------

  get startedAt(): Date | undefined { return this._startedAt; }
  get completedAt(): Date | undefined { return this._completedAt; }
  get durationMs(): number { return this._durationMs; }
  get failureReason(): string | undefined { return this._failureReason; }
  get isTerminal(): boolean {
    return [
      OrchestrationExecutionStatus.Completed,
      OrchestrationExecutionStatus.Failed,
      OrchestrationExecutionStatus.Cancelled,
      OrchestrationExecutionStatus.Compensated,
      OrchestrationExecutionStatus.TimedOut,
    ].includes(this.status);
  }

  // -------------------------------------------------------------------------
  // Domain event helpers
  // -------------------------------------------------------------------------

  private recordEvent(event: object): void {
    this._events.push(event);
  }

  /** Returns and clears uncommitted domain events. */
  public pullEvents(): ReadonlyArray<object> {
    const events = [...this._events];
    this._events.length = 0;
    return events;
  }
}

// ---------------------------------------------------------------------------
// AutomationTemplate (Entity)
// ---------------------------------------------------------------------------

/**
 * A reusable orchestration blueprint stored in the automation template catalog.
 *
 * Templates allow operators to define parametric orchestration patterns
 * (e.g. "End-of-Day Report", "Low-Stock Reorder") and instantiate them
 * with restaurant-specific values.
 *
 * A template is NOT itself an orchestration — it is a factory specification.
 * TemplateService.instantiate() produces a new Orchestration from a template.
 */
export class AutomationTemplate {
  constructor(
    public readonly id: AutomationTemplateId,
    public readonly tenantId: string | null, // null = global template
    public readonly name: string,
    public readonly description: string,
    public readonly category: TemplateCategory,
    /** The orchestration definition this template produces when instantiated. */
    public readonly definitionBlueprint: OrchestrationDefinition,
    /** Declared parameters that consumers must supply on instantiation. */
    public readonly requiredParameters: ReadonlyArray<string>,
    public readonly version: number,
    public readonly isPublic: boolean,
    /** Number of times this template has been instantiated. */
    private _usageCount: number,
    public readonly createdAt: Date = new Date(),
    public updatedAt: Date = new Date(),
  ) {
    if (!name || name.trim().length === 0) {
      throw new Error('AutomationTemplate.name must not be empty.');
    }
  }

  /**
   * Increments the usage counter when the template is instantiated.
   * Called by TemplateService.instantiate().
   */
  public recordUsage(): void {
    this._usageCount++;
    this.updatedAt = new Date();
  }

  get usageCount(): number {
    return this._usageCount;
  }
}
