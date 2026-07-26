/**
 * Scheduler Platform — Read Models (CQRS Query Side)
 *
 * Read models are optimised projections for specific UI views and dashboards.
 * They are constructed from the event store / query store and are never
 * modified by write-side aggregates directly.
 *
 * Each read model class represents a concrete query output shape.
 */

import { JobType, ScheduleType } from '../../domain/enums/scheduler.enums';

// ---------------------------------------------------------------------------
// Schedule Catalog Read Model
// ---------------------------------------------------------------------------

/**
 * Represents a single schedule entry in the schedule catalog.
 * Used by GET /automation/schedules.
 */
export class ScheduleCatalogReadModel {
  id!: string;
  name!: string;
  description?: string;
  type!: ScheduleType;
  jobType!: JobType;
  status!: string;
  timezone?: string;
  cronExpression?: string;
  nextExecutionAt?: Date;
  lastExecutionAt?: Date;
  executionCount!: number;
  successRate!: number;
  createdAt!: Date;
  updatedAt!: Date;
  createdBy!: string;
}

// ---------------------------------------------------------------------------
// Execution History Read Model
// ---------------------------------------------------------------------------

/**
 * Immutable execution record — one row per job execution.
 * Used by GET /automation/jobs/history.
 * Records are append-only; no update operations are permitted.
 */
export class ExecutionHistoryReadModel {
  executionId!: string;
  jobId!: string;
  scheduleId!: string;
  scheduleName!: string;
  jobType!: JobType;
  status!: string;
  triggerType!: string;
  scheduledAt!: Date;
  queuedAt!: Date;
  startedAt?: Date;
  completedAt?: Date;
  durationMs?: number;
  attemptNumber!: number;
  nodeId?: string;
  errorMessage?: string;
  errorCode?: string;
}

// ---------------------------------------------------------------------------
// Upcoming Jobs Read Model
// ---------------------------------------------------------------------------

/**
 * Projects the next N scheduled executions across all active schedules.
 * Used by the Scheduler Dashboard to show the upcoming execution queue.
 */
export class UpcomingJobsReadModel {
  scheduleId!: string;
  scheduleName!: string;
  jobType!: JobType;
  scheduleType!: ScheduleType;
  nextExecutionAt!: Date;
  timezone?: string;
  cronExpression?: string;
  priority!: number;
}

// ---------------------------------------------------------------------------
// Failed Jobs Read Model
// ---------------------------------------------------------------------------

/**
 * Surfaces currently-failed and currently-retrying executions.
 * Used by the Scheduler Dashboard alert panel.
 */
export class FailedJobsReadModel {
  executionId!: string;
  scheduleId!: string;
  scheduleName!: string;
  jobType!: JobType;
  status!: string;
  attemptNumber!: number;
  maxAttempts!: number;
  lastFailedAt!: Date;
  nextRetryAt?: Date;
  errorMessage!: string;
  errorCode?: string;
  nodeId?: string;
}

// ---------------------------------------------------------------------------
// Scheduler Dashboard Read Model
// ---------------------------------------------------------------------------

/**
 * Aggregated metrics projection for the main Scheduler Dashboard widget.
 * Refreshed on a short TTL (e.g. every 30 seconds).
 */
export class SchedulerDashboardReadModel {
  /** Total number of schedule definitions across all statuses. */
  totalSchedules!: number;

  /** Number of schedules currently in Active status. */
  activeSchedules!: number;

  /** Number of schedules currently in Paused status. */
  pausedSchedules!: number;

  /** Total executions dispatched in the current calendar day (UTC). */
  totalExecutionsToday!: number;

  /** Percentage of executions that completed with Succeeded status (last 24h). */
  successRatePercent!: number;

  /** Mean execution duration across all job types (last 24h), in milliseconds. */
  averageDurationMs!: number;

  /** Number of job executions currently in Queued or Running state. */
  currentQueueDepth!: number;

  /** Number of job executions that permanently failed in the last 24 hours. */
  failedJobsLast24h!: number;

  /** Number of job executions currently in Retrying state. */
  currentlyRetrying!: number;

  /** Timestamp of the next scheduled execution across all active schedules. */
  nextScheduledJobAt?: Date;

  /** Node ID of the current distributed scheduling leader. */
  leaderNodeId?: string;

  /** ISO 8601 timestamp of when this read model was computed. */
  computedAt!: Date;
}

// ---------------------------------------------------------------------------
// Job Statistics Read Model
// ---------------------------------------------------------------------------

/**
 * Detailed statistical breakdown for a specific schedule or job type.
 * Supports P50/P95/P99 latency reporting and retry depth analysis.
 */
export class JobStatisticsReadModel {
  /** Scoped to this schedule, if provided. Null = platform-wide. */
  scheduleId?: string;

  /** Scoped to this job type, if provided. Null = all job types. */
  jobType?: JobType;

  /** Time period label for this snapshot (e.g. "last_24h", "last_7d"). */
  period!: string;

  /** Start of the measurement window (inclusive). */
  periodStart!: Date;

  /** End of the measurement window (exclusive). */
  periodEnd!: Date;

  totalExecutions!: number;
  succeeded!: number;
  failed!: number;
  skipped!: number;
  retried!: number;
  cancelled!: number;

  /** Success rate as a percentage (0–100). */
  successRatePercent!: number;

  /** Mean execution duration in milliseconds. */
  averageDurationMs!: number;

  /** Median (50th percentile) execution duration in milliseconds. */
  p50DurationMs!: number;

  /** 95th percentile execution duration in milliseconds. */
  p95DurationMs!: number;

  /** 99th percentile execution duration in milliseconds. */
  p99DurationMs!: number;

  /** Average number of retry attempts per failed execution. */
  averageRetryCount!: number;

  /** Maximum queue wait time observed (scheduledAt → startedAt) in ms. */
  maxQueueWaitMs!: number;

  /** Average queue wait time in milliseconds. */
  averageQueueWaitMs!: number;
}
