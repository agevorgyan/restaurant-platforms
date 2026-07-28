/**
 * Scheduler Platform — Domain Aggregates & Entities
 *
 * This file defines:
 *   - Schedule      (Aggregate Root)
 *   - JobExecution  (Entity — immutable after completion)
 *   - CalendarException (Entity — exclusion window)
 *
 * Business invariants are enforced here.
 * No framework dependencies. No I/O. Fully unit-testable.
 */

import {
  ScheduleId,
  JobId,
  JobExecutionId,
  ScheduleDefinition,
  RetryPolicy,
  ExecutionResult,
  NextExecutionTime,
  LastExecutionTime,
  JobPayload,
} from '../value-objects/scheduler.value-objects';

import {
  ScheduleStatus,
  JobStatus,
  JobType,
  JobTriggerType,
} from '../enums/scheduler.enums';

// ---------------------------------------------------------------------------
// Schedule (Aggregate Root)
// ---------------------------------------------------------------------------

/**
 * The Schedule aggregate root owns the entire lifecycle of a scheduled task.
 *
 * Responsibilities:
 *   - Enforce valid status transitions (Draft → Active → Paused → Active → Cancelled / Expired)
 *   - Hold the schedule definition (cron, one-time, recurring, etc.)
 *   - Track execution metadata (last executed, next planned, execution count)
 *   - Collect uncommitted domain events for transactional publishing
 *
 * The aggregate knows *nothing* about job execution mechanics.
 * CronService, CalendarService, etc. are pure services injected at the
 * application layer.
 */
export class Schedule {
  /** Domain events raised by this aggregate, not yet published. */
  private readonly _events: Array<object> = [];

  /** Running count of successful executions. */
  private _executionCount: number = 0;

  constructor(
    public readonly id: ScheduleId,
    public readonly tenantId: string,
    public readonly name: string,
    public readonly description: string,
    public readonly jobType: JobType,
    public readonly definition: ScheduleDefinition,
    public readonly retryPolicy: RetryPolicy,
    public readonly payload: JobPayload,
    public status: ScheduleStatus = ScheduleStatus.Draft,
    public nextExecution: NextExecutionTime | null = null,
    public lastExecution: LastExecutionTime | null = null,
    public readonly createdAt: Date = new Date(),
    public readonly createdBy: string = 'system',
    public updatedAt: Date = new Date(),
  ) {}

  // -------------------------------------------------------------------------
  // State machine transitions
  // -------------------------------------------------------------------------

  /**
   * Activates a Draft or Paused schedule.
   *
   * @throws if the schedule is not in a state that allows activation.
   */
  public activate(activatedBy: string): void {
    if (
      this.status !== ScheduleStatus.Draft &&
      this.status !== ScheduleStatus.Paused
    ) {
      throw new Error(
        `Cannot activate schedule "${this.id.value}" in status "${this.status}". ` +
          `Only Draft or Paused schedules can be activated.`,
      );
    }
    this.status = ScheduleStatus.Active;
    this.updatedAt = new Date();
    this.recordEvent({ type: 'ScheduleActivated', scheduleId: this.id.value, activatedBy });
  }

  /**
   * Pauses an Active schedule.
   * In-flight job executions continue to completion.
   *
   * @throws if the schedule is not Active.
   */
  public pause(pausedBy: string, reason?: string): void {
    if (this.status !== ScheduleStatus.Active) {
      throw new Error(
        `Cannot pause schedule "${this.id.value}" in status "${this.status}". ` +
          `Only Active schedules can be paused.`,
      );
    }
    this.status = ScheduleStatus.Paused;
    this.updatedAt = new Date();
    this.recordEvent({ type: 'SchedulePaused', scheduleId: this.id.value, pausedBy, reason });
  }

  /**
   * Resumes a Paused schedule.
   *
   * @throws if the schedule is not Paused.
   */
  public resume(resumedBy: string): void {
    if (this.status !== ScheduleStatus.Paused) {
      throw new Error(
        `Cannot resume schedule "${this.id.value}" in status "${this.status}". ` +
          `Only Paused schedules can be resumed.`,
      );
    }
    this.status = ScheduleStatus.Active;
    this.updatedAt = new Date();
    this.recordEvent({ type: 'ScheduleResumed', scheduleId: this.id.value, resumedBy });
  }

  /**
   * Permanently cancels the schedule.
   * This is a terminal state — no further transitions are permitted.
   *
   * @throws if the schedule is already in a terminal state.
   */
  public cancel(cancelledBy: string, reason?: string): void {
    const terminal: ScheduleStatus[] = [
      ScheduleStatus.Cancelled,
      ScheduleStatus.Expired,
      ScheduleStatus.Completed,
    ];
    if (terminal.includes(this.status)) {
      throw new Error(
        `Cannot cancel schedule "${this.id.value}" — already in terminal state "${this.status}".`,
      );
    }
    this.status = ScheduleStatus.Cancelled;
    this.updatedAt = new Date();
    this.recordEvent({ type: 'ScheduleCancelled', scheduleId: this.id.value, cancelledBy, reason });
  }

  /**
   * Marks the schedule as expired (e.g. maxExecutions reached, end date passed).
   * Terminal state.
   */
  public expire(): void {
    this.status = ScheduleStatus.Expired;
    this.updatedAt = new Date();
    this.recordEvent({ type: 'ScheduleExpired', scheduleId: this.id.value });
  }

  /**
   * Marks the schedule as completed (e.g. one-time job successfully executed).
   * Terminal state.
   */
  public complete(): void {
    this.status = ScheduleStatus.Completed;
    this.updatedAt = new Date();
    this.recordEvent({ type: 'ScheduleCompleted', scheduleId: this.id.value });
  }

  // -------------------------------------------------------------------------
  // Execution tracking
  // -------------------------------------------------------------------------

  /**
   * Records a successful execution against this schedule.
   * Updates lastExecution, increments executionCount.
   */
  public recordExecution(executedAt: Date): void {
    this.lastExecution = new LastExecutionTime(executedAt);
    this._executionCount++;
    this.updatedAt = new Date();
  }

  /**
   * Updates the pre-computed next execution time.
   * Called by the scheduling engine after each execution or activation.
   */
  public setNextExecution(nextAt: Date | null): void {
    this.nextExecution = nextAt !== null ? new NextExecutionTime(nextAt) : null;
    this.updatedAt = new Date();
  }

  /** Returns true if this schedule is eligible to fire now. */
  public isEligibleToFire(): boolean {
    return (
      this.status === ScheduleStatus.Active &&
      this.nextExecution !== null &&
      this.nextExecution.isInPast()
    );
  }

  // -------------------------------------------------------------------------
  // Domain event helpers
  // -------------------------------------------------------------------------

  private recordEvent(event: object): void {
    this._events.push(event);
  }

  /** Returns and clears the uncommitted domain events. */
  public pullEvents(): ReadonlyArray<object> {
    const events = [...this._events];
    this._events.length = 0;
    return events;
  }

  get executionCount(): number {
    return this._executionCount;
  }
}

// ---------------------------------------------------------------------------
// JobExecution (Entity — immutable after completion)
// ---------------------------------------------------------------------------

/**
 * Represents a single execution instance of a scheduled job.
 *
 * Invariant: once a terminal status (Succeeded, Failed, Cancelled, Skipped)
 * is reached, the entity is sealed — no further mutations are permitted.
 * This enforces immutable execution history at the domain level.
 */
export class JobExecution {
  public readonly id: JobExecutionId;
  public readonly jobId: JobId;
  public readonly scheduleId: ScheduleId;
  public readonly tenantId: string;
  public readonly jobType: JobType;
  public readonly triggerType: JobTriggerType;
  public readonly payload: JobPayload;
  public readonly scheduledAt: Date;
  public readonly queuedAt: Date;

  private _status: JobStatus = JobStatus.Queued;
  private _startedAt?: Date;
  private _completedAt?: Date;
  private _nodeId?: string;
  private _attemptNumber: number = 1;
  private _result?: ExecutionResult;
  private _nextRetryAt?: Date;
  private _sealed: boolean = false;

  constructor(params: {
    id: JobExecutionId;
    jobId: JobId;
    scheduleId: ScheduleId;
    tenantId: string;
    jobType: JobType;
    triggerType: JobTriggerType;
    payload: JobPayload;
    scheduledAt: Date;
  }) {
    this.id = params.id;
    this.jobId = params.jobId;
    this.scheduleId = params.scheduleId;
    this.tenantId = params.tenantId;
    this.jobType = params.jobType;
    this.triggerType = params.triggerType;
    this.payload = params.payload;
    this.scheduledAt = params.scheduledAt;
    this.queuedAt = new Date();
  }

  // -------------------------------------------------------------------------
  // Status transitions
  // -------------------------------------------------------------------------

  /** Transitions the execution to Running state. */
  public markStarted(nodeId: string): void {
    this.assertNotSealed('markStarted');
    if (this._status !== JobStatus.Queued && this._status !== JobStatus.Retrying) {
      throw new Error(
        `Cannot start JobExecution "${this.id.value}" in status "${this._status}".`,
      );
    }
    this._status = JobStatus.Running;
    this._startedAt = new Date();
    this._nodeId = nodeId;
  }

  /** Seals the execution with a successful result. */
  public markSucceeded(result: ExecutionResult): void {
    this.assertNotSealed('markSucceeded');
    if (this._status !== JobStatus.Running) {
      throw new Error(
        `Cannot mark JobExecution "${this.id.value}" as succeeded — not in Running state.`,
      );
    }
    this._status = JobStatus.Succeeded;
    this._result = result;
    this._completedAt = new Date();
    this._sealed = true;
  }

  /** Records a failure. If retries remain, transitions to Retrying. */
  public markFailed(result: ExecutionResult, nextRetryAt?: Date): void {
    this.assertNotSealed('markFailed');
    if (this._status !== JobStatus.Running) {
      throw new Error(
        `Cannot mark JobExecution "${this.id.value}" as failed — not in Running state.`,
      );
    }
    if (nextRetryAt) {
      this._status = JobStatus.Retrying;
      this._nextRetryAt = nextRetryAt;
      this._attemptNumber++;
    } else {
      this._status = JobStatus.Failed;
      this._completedAt = new Date();
      this._sealed = true;
    }
    this._result = result;
  }

  /** Cancels a Queued or Running execution before completion. */
  public markCancelled(): void {
    this.assertNotSealed('markCancelled');
    const cancellable: JobStatus[] = [JobStatus.Queued, JobStatus.Running, JobStatus.Retrying];
    if (!cancellable.includes(this._status)) {
      throw new Error(
        `Cannot cancel JobExecution "${this.id.value}" in status "${this._status}".`,
      );
    }
    this._status = JobStatus.Cancelled;
    this._completedAt = new Date();
    this._sealed = true;
  }

  /** Marks the execution as skipped by a misfire policy. */
  public markSkipped(): void {
    this.assertNotSealed('markSkipped');
    if (this._status !== JobStatus.Queued) {
      throw new Error(
        `Cannot skip JobExecution "${this.id.value}" — only Queued executions can be skipped.`,
      );
    }
    this._status = JobStatus.Skipped;
    this._completedAt = new Date();
    this._sealed = true;
  }

  // -------------------------------------------------------------------------
  // Read accessors
  // -------------------------------------------------------------------------

  get status(): JobStatus {
    return this._status;
  }

  get startedAt(): Date | undefined {
    return this._startedAt;
  }

  get completedAt(): Date | undefined {
    return this._completedAt;
  }

  get nodeId(): string | undefined {
    return this._nodeId;
  }

  get attemptNumber(): number {
    return this._attemptNumber;
  }

  get result(): ExecutionResult | undefined {
    return this._result;
  }

  get nextRetryAt(): Date | undefined {
    return this._nextRetryAt;
  }

  get isTerminal(): boolean {
    const terminalStatuses: JobStatus[] = [
      JobStatus.Succeeded,
      JobStatus.Failed,
      JobStatus.Cancelled,
      JobStatus.Skipped,
    ];
    return terminalStatuses.includes(this._status);
  }

  // -------------------------------------------------------------------------
  // Private helpers
  // -------------------------------------------------------------------------

  private assertNotSealed(operation: string): void {
    if (this._sealed) {
      throw new Error(
        `JobExecution "${this.id.value}" is sealed (immutable). ` +
          `Operation "${operation}" is not permitted after a terminal state has been reached.`,
      );
    }
  }
}

// ---------------------------------------------------------------------------
// CalendarException (Entity)
// ---------------------------------------------------------------------------

/**
 * Represents a named exclusion period in a scheduling calendar.
 *
 * When a scheduled execution falls within an active CalendarException,
 * the CalendarService suppresses that execution (the misfire policy then
 * determines whether a make-up execution occurs after the window).
 *
 * Examples: public holidays, planned maintenance windows,
 * restaurant closure periods, peak blackout periods.
 */
export class CalendarException {
  constructor(
    public readonly id: string,
    public readonly calendarId: string,
    public readonly tenantId: string,
    public readonly label: string,
    public readonly startAt: Date,
    public readonly endAt: Date,
    public readonly recurring: boolean = false,
    public readonly createdAt: Date = new Date(),
  ) {
    if (startAt >= endAt) {
      throw new Error(
        `CalendarException "${label}" startAt must be before endAt.`,
      );
    }
  }

  /**
   * Returns true if the given UTC timestamp falls within this exception window.
   */
  public covers(utcDate: Date): boolean {
    return utcDate >= this.startAt && utcDate <= this.endAt;
  }
}
