/**
 * Scheduler Platform — Domain Enums
 *
 * Defines all enumerated types used across the Enterprise Scheduler Platform.
 * No business logic. Pure type definitions.
 */

// ---------------------------------------------------------------------------
// Schedule lifecycle
// ---------------------------------------------------------------------------

/** Represents the current lifecycle state of a schedule definition. */
export enum ScheduleStatus {
  Draft = 'Draft',
  Active = 'Active',
  Paused = 'Paused',
  Completed = 'Completed',
  Cancelled = 'Cancelled',
  Expired = 'Expired',
}

// ---------------------------------------------------------------------------
// Job execution lifecycle
// ---------------------------------------------------------------------------

/** Represents the runtime status of a single job execution instance. */
export enum JobStatus {
  Queued = 'Queued',
  Running = 'Running',
  Succeeded = 'Succeeded',
  Failed = 'Failed',
  Retrying = 'Retrying',
  Cancelled = 'Cancelled',
  Skipped = 'Skipped',
}

// ---------------------------------------------------------------------------
// Schedule types
// ---------------------------------------------------------------------------

/**
 * Determines how the scheduler calculates the next execution time.
 *
 * - Cron: Standard cron expression (e.g. "0 9 * * MON-FRI")
 * - OneTime: Single future execution at an absolute timestamp
 * - Recurring: Fixed count of executions with a given interval
 * - Calendar: Executes on specific named calendar dates
 * - Delayed: Fires once after a configurable delay from activation
 * - FixedInterval: Fires at a steady interval regardless of execution duration
 * - FixedDelay: Fires at a fixed delay *after* the previous execution completes
 * - EventTriggeredDelay: Fires a fixed delay after a domain event is received
 */
export enum ScheduleType {
  Cron = 'Cron',
  OneTime = 'OneTime',
  Recurring = 'Recurring',
  Calendar = 'Calendar',
  Delayed = 'Delayed',
  FixedInterval = 'FixedInterval',
  FixedDelay = 'FixedDelay',
  EventTriggeredDelay = 'EventTriggeredDelay',
}

// ---------------------------------------------------------------------------
// Job types
// ---------------------------------------------------------------------------

/**
 * Describes the category of work this job performs.
 * The scheduler platform owns *no* business logic — it only routes the job
 * to the correct downstream handler based on this type.
 */
export enum JobType {
  Workflow = 'Workflow',
  RuleEvaluation = 'RuleEvaluation',
  Notification = 'Notification',
  Integration = 'Integration',
  Cleanup = 'Cleanup',
  AI = 'AI',
  Report = 'Report',
  Maintenance = 'Maintenance',
}

// ---------------------------------------------------------------------------
// Misfire policies
// ---------------------------------------------------------------------------

/**
 * Defines how the scheduler recovers missed executions after a downtime event.
 *
 * - FireOnce: Fire a single make-up execution immediately (default)
 * - Skip: Drop all missed executions silently
 * - FireAll: Fire one make-up execution per missed slot (use carefully)
 */
export enum MisfirePolicy {
  FireOnce = 'FireOnce',
  Skip = 'Skip',
  FireAll = 'FireAll',
}

// ---------------------------------------------------------------------------
// Backoff strategies for retry policies
// ---------------------------------------------------------------------------

/** Retry backoff computation strategy. */
export enum BackoffStrategy {
  Fixed = 'Fixed',
  Linear = 'Linear',
  Exponential = 'Exponential',
  ExponentialWithJitter = 'ExponentialWithJitter',
}

// ---------------------------------------------------------------------------
// Job priority
// ---------------------------------------------------------------------------

/** Priority levels used to order the execution queue. */
export enum JobPriority {
  Critical = 0,
  High = 1,
  Normal = 2,
  Low = 3,
  Background = 4,
}

// ---------------------------------------------------------------------------
// Trigger origin
// ---------------------------------------------------------------------------

/** Describes how the job execution was initiated. */
export enum TriggerType {
  Automatic = 'Automatic',
  Manual = 'Manual',
  EventDriven = 'EventDriven',
  Recovery = 'Recovery',
}

// ---------------------------------------------------------------------------
// Execution overlap policy
// ---------------------------------------------------------------------------

/**
 * Controls what happens when a new execution fires while a previous one is
 * still running for the same schedule.
 *
 * - Skip: Discard the new execution
 * - Queue: Enqueue the new execution to run after the current one completes
 * - Parallel: Allow concurrent executions (use with caution)
 * - Terminate: Kill the running execution and start the new one
 */
export enum OverlapPolicy {
  Skip = 'Skip',
  Queue = 'Queue',
  Parallel = 'Parallel',
  Terminate = 'Terminate',
}
