/**
 * Scheduler Platform — Data Transfer Objects
 *
 * All DTOs represent validated input shapes for the API layer.
 * They carry no domain logic. Validation is performed at the application
 * service boundary using class-validator conventions.
 */

import {
  BackoffStrategy,
  JobPriority,
  JobType,
  MisfirePolicy,
  OverlapPolicy,
  ScheduleType,
} from '../../domain/enums/scheduler.enums';

// ---------------------------------------------------------------------------
// Nested DTOs
// ---------------------------------------------------------------------------

/** Defines a daily execution window for a schedule. */
export class ExecutionWindowDto {
  /** Start of allowed execution window, 24-hour "HH:mm" format. */
  startTime!: string;

  /** End of allowed execution window, 24-hour "HH:mm" format. */
  endTime!: string;
}

/** Configures retry behaviour for failed job executions. */
export class RetryPolicyDto {
  /** Maximum retry attempts after the initial failure (0 = no retries). */
  maxAttempts!: number;

  /** Base delay in milliseconds before the first retry. */
  baseDelayMs!: number;

  /** Maximum delay cap in milliseconds (for exponential strategies). */
  maxDelayMs!: number;

  /** Backoff strategy for computing inter-retry delay. */
  backoffStrategy!: BackoffStrategy;

  /**
   * Optional whitelist of error codes that trigger a retry.
   * If empty, all errors are considered retryable up to maxAttempts.
   */
  retryableErrorCodes?: string[];
}

// ---------------------------------------------------------------------------
// Create Schedule DTO
// ---------------------------------------------------------------------------

/**
 * Request body for POST /automation/schedules.
 *
 * The `type` discriminant determines which scheduling fields are required.
 */
export class CreateScheduleDto {
  /** Human-readable name for this schedule. */
  name!: string;

  /** Optional description of what this schedule does. */
  description?: string;

  /** Determines how the next execution time is computed. */
  type!: ScheduleType;

  /** Type of work this schedule dispatches. */
  jobType!: JobType;

  /**
   * Cron expression. Required when type === ScheduleType.Cron.
   * Must be a valid 5-field (standard) or 6-field (with seconds) expression.
   */
  cronExpression?: string;

  /**
   * IANA timezone identifier. Required for all types that involve
   * time-of-day evaluation (Cron, Recurring, FixedInterval, FixedDelay,
   * Calendar). Defaults to "UTC" when not provided.
   */
  timezone?: string;

  /** Daily execution window restriction. Optional. */
  executionWindow?: ExecutionWindowDto;

  /**
   * Absolute UTC timestamp for one-time schedules.
   * Required when type === ScheduleType.OneTime.
   */
  executeAt?: string;

  /**
   * Interval in milliseconds.
   * Required for: Recurring, FixedInterval, FixedDelay (delayAfterCompletionMs).
   */
  intervalMs?: number;

  /**
   * Maximum number of allowed executions.
   * Required for: Recurring.
   */
  maxExecutions?: number;

  /**
   * Delay in milliseconds applied once from the schedule's activation time.
   * Required when type === ScheduleType.Delayed.
   */
  delayMs?: number;

  /**
   * Reference to a pre-configured calendar entity.
   * Required when type === ScheduleType.Calendar.
   */
  calendarId?: string;

  /**
   * Domain event name that triggers execution after a delay.
   * Required when type === ScheduleType.EventTriggeredDelay.
   */
  triggerEventName?: string;

  /**
   * Correlation key used to tie an incoming domain event to this schedule.
   * Optional for EventTriggeredDelay — used for tenant/entity scoping.
   */
  correlationKey?: string;

  /** Policy applied when a scheduled execution is detected as missed. */
  misfirePolicy?: MisfirePolicy;

  /** Policy applied when a new execution fires while one is still running. */
  overlapPolicy?: OverlapPolicy;

  /** Retry configuration. Falls back to platform default if omitted. */
  retryPolicy?: RetryPolicyDto;

  /**
   * Job-specific input payload.
   * Passed verbatim to the downstream job handler at execution time.
   */
  payload!: Record<string, unknown>;

  /** Execution priority. Defaults to Normal. */
  priority?: JobPriority;
}

// ---------------------------------------------------------------------------
// Update Schedule DTO
// ---------------------------------------------------------------------------

/**
 * Request body for PATCH /automation/schedules/:id.
 *
 * All fields are optional. Only provided fields are updated.
 * Type cannot be changed after creation (immutable discriminant).
 */
export class UpdateScheduleDto {
  name?: string;
  description?: string;
  cronExpression?: string;
  timezone?: string;
  executionWindow?: ExecutionWindowDto;
  executeAt?: string;
  intervalMs?: number;
  maxExecutions?: number;
  delayMs?: number;
  calendarId?: string;
  misfirePolicy?: MisfirePolicy;
  overlapPolicy?: OverlapPolicy;
  retryPolicy?: RetryPolicyDto;
  payload?: Record<string, unknown>;
  priority?: JobPriority;
}

// ---------------------------------------------------------------------------
// Query DTOs (Read Model Filters)
// ---------------------------------------------------------------------------

/** Query parameters for GET /automation/schedules. */
export class ListSchedulesDto {
  /** Filter by schedule status. */
  status?: string;

  /** Filter by job type. */
  jobType?: JobType;

  /** Filter by schedule type. */
  scheduleType?: ScheduleType;

  /** Full-text search on name and description. */
  search?: string;

  /** Page number (1-indexed). Defaults to 1. */
  page?: number;

  /** Page size. Defaults to 20. Max 100. */
  limit?: number;
}

/** Query parameters for GET /automation/jobs. */
export class ListJobsDto {
  /** Filter by specific schedule ID. */
  scheduleId?: string;

  /** Filter by job status. */
  status?: string;

  /** Filter by job type. */
  jobType?: JobType;

  /** ISO 8601 timestamp — return jobs queued after this time. */
  from?: string;

  /** ISO 8601 timestamp — return jobs queued before this time. */
  to?: string;

  page?: number;
  limit?: number;
}

/** Query parameters for GET /automation/jobs/history. */
export class ListJobHistoryDto {
  scheduleId?: string;
  jobType?: JobType;
  status?: string;

  /** ISO 8601 range. */
  from?: string;
  to?: string;

  /** Include only failed executions. Shorthand for status=Failed. */
  failedOnly?: boolean;

  page?: number;
  limit?: number;
}

// ---------------------------------------------------------------------------
// Response DTOs (Read Models / Projections)
// ---------------------------------------------------------------------------

/** Paginated list wrapper. */
export class PaginatedResponseDto<T> {
  data!: T[];
  total!: number;
  page!: number;
  limit!: number;
  hasNextPage!: boolean;
}

/** Read model for a schedule entry in the catalog. */
export class ScheduleCatalogItemDto {
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
  createdAt!: Date;
  updatedAt!: Date;
}

/** Read model for a single job execution record. */
export class JobExecutionDto {
  id!: string;
  jobId!: string;
  scheduleId!: string;
  scheduleType!: ScheduleType;
  jobType!: JobType;
  status!: string;
  priority!: JobPriority;
  triggerType!: string;
  scheduledAt!: Date;
  queuedAt!: Date;
  startedAt?: Date;
  completedAt?: Date;
  nodeId?: string;
  attemptNumber!: number;
  durationMs?: number;
  errorMessage?: string;
  errorCode?: string;
}

/** Aggregated metrics for the scheduler dashboard. */
export class SchedulerDashboardDto {
  totalSchedules!: number;
  activeSchedules!: number;
  pausedSchedules!: number;
  totalExecutionsToday!: number;
  successRatePercent!: number;
  averageDurationMs!: number;
  currentQueueDepth!: number;
  failedJobsLast24h!: number;
  nextScheduledJobAt?: Date;
  leaderNodeId?: string;
}

/** Statistical breakdown for a specific schedule or job type. */
export class JobStatisticsDto {
  scheduleId?: string;
  jobType?: JobType;
  totalExecutions!: number;
  succeeded!: number;
  failed!: number;
  skipped!: number;
  retried!: number;
  successRatePercent!: number;
  averageDurationMs!: number;
  p50DurationMs!: number;
  p95DurationMs!: number;
  p99DurationMs!: number;
  averageRetryCount!: number;
  period!: string;
}
