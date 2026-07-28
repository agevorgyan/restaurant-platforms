/**
 * Scheduler Platform — Domain Events
 *
 * All events are immutable records of something that happened in the past.
 * They carry only the data needed for downstream consumers to react.
 * No methods, no business logic.
 */

import { ScheduleId, JobId, JobExecutionId, ExecutionResult } from '../value-objects/scheduler.value-objects';
import { ScheduleStatus, JobTriggerType, MisfirePolicy } from '../enums/scheduler.enums';

// ---------------------------------------------------------------------------
// Schedule lifecycle events
// ---------------------------------------------------------------------------

/**
 * Raised when a new schedule definition has been persisted in Draft state.
 * Downstream: audit log, tenant notification.
 */
export class ScheduleCreated {
  public readonly occurredAt: Date = new Date();

  constructor(
    public readonly scheduleId: ScheduleId,
    public readonly tenantId: string,
    public readonly name: string,
    public readonly createdBy: string,
  ) {}
}

/**
 * Raised when a Draft or Paused schedule transitions to Active.
 * Downstream: leader node picks up the schedule for execution planning.
 */
export class ScheduleActivated {
  public readonly occurredAt: Date = new Date();

  constructor(
    public readonly scheduleId: ScheduleId,
    public readonly tenantId: string,
    public readonly activatedBy: string,
  ) {}
}

/**
 * Raised when an Active schedule is paused by an operator.
 * In-flight executions continue to completion; new ones are suppressed.
 */
export class SchedulePaused {
  public readonly occurredAt: Date = new Date();

  constructor(
    public readonly scheduleId: ScheduleId,
    public readonly tenantId: string,
    public readonly pausedBy: string,
    public readonly reason?: string,
  ) {}
}

/**
 * Raised when a Paused schedule resumes normal execution.
 * Downstream: leader re-evaluates the schedule's next execution time.
 */
export class ScheduleResumed {
  public readonly occurredAt: Date = new Date();

  constructor(
    public readonly scheduleId: ScheduleId,
    public readonly tenantId: string,
    public readonly resumedBy: string,
  ) {}
}

/**
 * Raised when a schedule is permanently cancelled.
 * No further executions will occur. State is terminal.
 */
export class ScheduleCancelled {
  public readonly occurredAt: Date = new Date();

  constructor(
    public readonly scheduleId: ScheduleId,
    public readonly tenantId: string,
    public readonly cancelledBy: string,
    public readonly reason?: string,
  ) {}
}

/**
 * Raised when a schedule has naturally reached its end condition
 * (e.g. maxExecutions reached, OneTime job fired, end date elapsed).
 */
export class ScheduleExpired {
  public readonly occurredAt: Date = new Date();

  constructor(
    public readonly scheduleId: ScheduleId,
    public readonly tenantId: string,
    public readonly finalStatus: ScheduleStatus,
  ) {}
}

/**
 * Raised when a schedule's definition (cron, window, retry policy, etc.) is updated.
 * Downstream: leader must recompute the next execution time.
 */
export class ScheduleUpdated {
  public readonly occurredAt: Date = new Date();

  constructor(
    public readonly scheduleId: ScheduleId,
    public readonly tenantId: string,
    public readonly updatedBy: string,
    public readonly changedFields: ReadonlyArray<string>,
  ) {}
}

// ---------------------------------------------------------------------------
// Job execution events
// ---------------------------------------------------------------------------

/**
 * Raised when a new job execution has been placed on the execution queue.
 * Downstream: metrics (queue depth), real-time dashboard.
 */
export class JobQueued {
  public readonly occurredAt: Date = new Date();

  constructor(
    public readonly jobId: JobId,
    public readonly jobExecutionId: JobExecutionId,
    public readonly scheduleId: ScheduleId,
    public readonly tenantId: string,
    public readonly triggerType: JobTriggerType,
    public readonly scheduledAt: Date,
  ) {}
}

/**
 * Raised when a worker node picks up the job and begins execution.
 * Downstream: distributed lock acquired, status = Running.
 */
export class JobStarted {
  public readonly occurredAt: Date = new Date();

  constructor(
    public readonly jobExecutionId: JobExecutionId,
    public readonly scheduleId: ScheduleId,
    public readonly tenantId: string,
    public readonly nodeId: string,
    public readonly startedAt: Date,
  ) {}
}

/**
 * Raised when a job execution finishes successfully.
 * Downstream: update last execution time, schedule next.
 */
export class JobCompleted {
  public readonly occurredAt: Date = new Date();

  constructor(
    public readonly jobExecutionId: JobExecutionId,
    public readonly scheduleId: ScheduleId,
    public readonly tenantId: string,
    public readonly result: ExecutionResult,
  ) {}
}

/**
 * Raised when a job execution fails terminally (no retries remaining).
 * Downstream: alert, dead-letter queue, operator notification.
 */
export class JobFailed {
  public readonly occurredAt: Date = new Date();

  constructor(
    public readonly jobExecutionId: JobExecutionId,
    public readonly scheduleId: ScheduleId,
    public readonly tenantId: string,
    public readonly result: ExecutionResult,
    public readonly finalAttempt: number,
  ) {}
}

/**
 * Raised when a failed execution is scheduled for retry.
 * Downstream: metrics (retry depth), scheduling next attempt.
 */
export class JobRetried {
  public readonly occurredAt: Date = new Date();

  constructor(
    public readonly jobExecutionId: JobExecutionId,
    public readonly scheduleId: ScheduleId,
    public readonly tenantId: string,
    public readonly attemptNumber: number,
    public readonly nextRetryAt: Date,
    public readonly lastErrorMessage: string,
  ) {}
}

/**
 * Raised when a job is cancelled before execution starts.
 * Downstream: release any reserved resources.
 */
export class JobCancelled {
  public readonly occurredAt: Date = new Date();

  constructor(
    public readonly jobExecutionId: JobExecutionId,
    public readonly scheduleId: ScheduleId,
    public readonly tenantId: string,
    public readonly cancelledBy: string,
    public readonly reason?: string,
  ) {}
}

/**
 * Raised when a misfire is detected and the overlap/misfire policy
 * decides to skip the missed execution.
 */
export class JobSkipped {
  public readonly occurredAt: Date = new Date();

  constructor(
    public readonly scheduleId: ScheduleId,
    public readonly tenantId: string,
    public readonly scheduledAt: Date,
    public readonly appliedPolicy: MisfirePolicy,
    public readonly reason: string,
  ) {}
}

// ---------------------------------------------------------------------------
// Distributed lock events
// ---------------------------------------------------------------------------

/**
 * Raised when the leader election selects a new primary scheduler node.
 * Downstream: all standby nodes acknowledge the new leader.
 */
export class LeaderElected {
  public readonly occurredAt: Date = new Date();

  constructor(
    public readonly nodeId: string,
    public readonly electedAt: Date,
    public readonly lockTtlMs: number,
  ) {}
}

/**
 * Raised when the primary scheduler node loses its leadership (crash / TTL
 * expiry). Triggers re-election on all standby nodes.
 */
export class LeadershipLost {
  public readonly occurredAt: Date = new Date();

  constructor(
    public readonly previousNodeId: string,
    public readonly detectedAt: Date,
  ) {}
}
