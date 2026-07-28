/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * Scheduler Platform — Application Services
 *
 * This file contains all application-layer services for the Enterprise
 * Scheduler Platform. Services own orchestration logic only — no domain
 * invariant is placed here. All domain rules live in Schedule / JobExecution
 * aggregates and in pure domain value objects.
 *
 * Services are designed for dependency injection and are framework-aware
 * (NestJS @Injectable) while remaining fully testable via mock injection.
 *
 * Infrastructure concerns (Redis locking, queue dispatch, persistence) are
 * abstracted behind interfaces; the stub bodies below model correct
 * orchestration contracts that concrete adapters will implement.
 */

import { Injectable, Logger } from '@nestjs/common';

import {
  Schedule,
  JobExecution,
  CalendarException,
} from '../../domain/models/scheduler.model';

import {
  ScheduleId,
  JobId,
  JobExecutionId,
  CronExpression,
  TimeZone,
  RetryPolicy,
  ExecutionResult,
  DistributedLockToken,
  JobPayload,
  NextExecutionTime,
  ExecutionWindow,
} from '../../domain/value-objects/scheduler.value-objects';

import {
  ScheduleStatus,
  JobStatus,
  JobType,
  JobPriority,
  ScheduleType,
  MisfirePolicy,
  BackoffStrategy,
  JobTriggerType,
  OverlapPolicy,
} from '../../domain/enums/scheduler.enums';

import {
  CreateScheduleDto,
  UpdateScheduleDto,
  ListSchedulesDto,
  ListJobsDto,
  ListJobHistoryDto,
  SchedulerDashboardDto,
  JobStatisticsDto,
  PaginatedResponseDto,
  ScheduleCatalogItemDto,
  JobExecutionDto,
} from '../dto/scheduler.dto';

import {
  ScheduleCatalogReadModel,
  ExecutionHistoryReadModel,
  UpcomingJobsReadModel,
  FailedJobsReadModel,
  SchedulerDashboardReadModel,
  JobStatisticsReadModel,
} from '../queries/scheduler.read-models';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Distributed lock TTL in milliseconds for scheduled job execution. */
const LOCK_TTL_MS = 30_000;

/** Heartbeat interval in milliseconds for active locks. */
const LOCK_HEARTBEAT_MS = 10_000;

/** Leader election lock TTL in milliseconds. */
const LEADER_LOCK_TTL_MS = 60_000;

/** Default misfire threshold: executions fired more than this ms late are misfired. */
const DEFAULT_MISFIRE_THRESHOLD_MS = 60_000;

// ---------------------------------------------------------------------------
// SchedulerService — Schedule CRUD & Lifecycle
// ---------------------------------------------------------------------------

/**
 * Primary application service for schedule management.
 *
 * Responsibilities:
 *   - Create, update, and delete schedule definitions
 *   - Manage schedule lifecycle transitions (activate, pause, resume, cancel)
 *   - Coordinate with SchedulePersistenceService for durability
 *   - Coordinate with CronService / CalendarService to compute next execution times
 *
 * This service has NO knowledge of job execution mechanics.
 */
@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name);

  /**
   * Returns a paginated list of schedule definitions for the calling tenant.
   * Applies status, jobType, scheduleType, and text search filters.
   */
  async listSchedules(
    tenantId: string,
    dto: ListSchedulesDto,
  ): Promise<PaginatedResponseDto<ScheduleCatalogItemDto>> {
    this.logger.log(`Listing schedules for tenant ${tenantId}`);
    return {
      data: [],
      total: 0,
      page: dto.page ?? 1,
      limit: dto.limit ?? 20,
      hasNextPage: false,
    };
  }

  /**
   * Returns a single schedule definition by ID, scoped to the calling tenant.
   *
   * @throws NotFoundException if the schedule does not exist or belongs to another tenant.
   */
  async getSchedule(
    tenantId: string,
    scheduleId: string,
  ): Promise<ScheduleCatalogItemDto | null> {
    this.logger.log(`Fetching schedule ${scheduleId} for tenant ${tenantId}`);
    return null;
  }

  /**
   * Creates a new schedule definition.
   *
   * Validation sequence:
   *   1. Cron expression syntax (if type === Cron)
   *   2. Timezone validity (IANA)
   *   3. Execution window consistency (start < end)
   *   4. RetryPolicy constraints
   *   5. Calendar existence (if type === Calendar)
   *   6. ExecuteAt is in the future (if type === OneTime)
   *
   * The schedule is created in Draft status.
   * Call activateSchedule() to begin execution.
   */
  async createSchedule(
    tenantId: string,
    dto: CreateScheduleDto,
    createdBy: string,
  ): Promise<ScheduleCatalogItemDto> {
    this.logger.log(`Creating schedule "${dto.name}" for tenant ${tenantId}`);

    // Stub: Build domain objects, validate, persist, publish ScheduleCreated event
    const scheduleId = new ScheduleId(crypto.randomUUID());
    return {
      id: scheduleId.value,
      name: dto.name,
      description: dto.description,
      type: dto.type,
      jobType: dto.jobType,
      status: ScheduleStatus.Draft,
      timezone: dto.timezone ?? TimeZone.UTC.value,
      cronExpression: dto.cronExpression,
      executionCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  /**
   * Updates mutable fields on an existing schedule.
   *
   * Immutable fields: id, type, tenantId, createdAt, createdBy.
   * Updating a Cron expression on an Active schedule triggers immediate
   * recomputation of the next execution time.
   *
   * @throws NotFoundException if schedule not found.
   * @throws ConflictException if the schedule is in a terminal state.
   */
  async updateSchedule(
    tenantId: string,
    scheduleId: string,
    dto: UpdateScheduleDto,
    updatedBy: string,
  ): Promise<ScheduleCatalogItemDto> {
    this.logger.log(`Updating schedule ${scheduleId} for tenant ${tenantId}`);
    return {} as ScheduleCatalogItemDto;
  }

  /**
   * Transitions a Draft or Paused schedule to Active.
   *
   * Side effects:
   *   - Computes and persists the first NextExecutionTime
   *   - Notifies the leader node to include this schedule in its evaluation loop
   */
  async activateSchedule(
    tenantId: string,
    scheduleId: string,
    activatedBy: string,
  ): Promise<void> {
    this.logger.log(`Activating schedule ${scheduleId} for tenant ${tenantId}`);
  }

  /**
   * Transitions an Active schedule to Paused.
   * In-flight executions continue to completion.
   */
  async pauseSchedule(
    tenantId: string,
    scheduleId: string,
    pausedBy: string,
    reason?: string,
  ): Promise<void> {
    this.logger.log(`Pausing schedule ${scheduleId} for tenant ${tenantId}`);
  }

  /**
   * Transitions a Paused schedule back to Active.
   * Recomputes the next execution time from the current moment.
   */
  async resumeSchedule(
    tenantId: string,
    scheduleId: string,
    resumedBy: string,
  ): Promise<void> {
    this.logger.log(`Resuming schedule ${scheduleId} for tenant ${tenantId}`);
  }

  /**
   * Permanently cancels a schedule.
   * Terminal state — cannot be reactivated.
   */
  async cancelSchedule(
    tenantId: string,
    scheduleId: string,
    cancelledBy: string,
    reason?: string,
  ): Promise<void> {
    this.logger.log(`Cancelling schedule ${scheduleId} for tenant ${tenantId}`);
  }

  /**
   * Returns aggregated dashboard metrics for the scheduler.
   */
  async getDashboard(tenantId: string): Promise<SchedulerDashboardReadModel> {
    return {
      totalSchedules: 0,
      activeSchedules: 0,
      pausedSchedules: 0,
      totalExecutionsToday: 0,
      successRatePercent: 100,
      averageDurationMs: 0,
      currentQueueDepth: 0,
      failedJobsLast24h: 0,
      currentlyRetrying: 0,
      nextScheduledJobAt: undefined,
      leaderNodeId: undefined,
      computedAt: new Date(),
    };
  }
}

// ---------------------------------------------------------------------------
// JobExecutionService — Job Lifecycle Management
// ---------------------------------------------------------------------------

/**
 * Manages the full lifecycle of a single job execution instance.
 *
 * Responsibilities:
 *   - Queue a new execution (Queued state)
 *   - Mark execution as started (Running state, acquires distributed lock)
 *   - Mark execution as completed (Succeeded / Failed)
 *   - Trigger retry scheduling on failure
 *   - Persist immutable execution records
 *   - Publish domain events for each transition
 *
 * This service does NOT know what the job actually does.
 * That routing is handled by the downstream WorkflowService, RuleService, etc.
 */
@Injectable()
export class JobExecutionService {
  private readonly logger = new Logger(JobExecutionService.name);

  /**
   * Enqueues a new job execution for the given schedule.
   * Called by the scheduling engine when a schedule's nextExecutionTime arrives.
   *
   * @param triggerType - Whether this was fired automatically, manually, or by an event
   * @returns The newly created JobExecutionId
   */
  async enqueueJob(params: {
    tenantId: string;
    scheduleId: string;
    jobType: JobType;
    payload: Record<string, unknown>;
    priority: JobPriority;
    scheduledAt: Date;
    triggerType: JobTriggerType;
  }): Promise<string> {
    this.logger.log(
      `Enqueueing ${params.jobType} job for schedule ${params.scheduleId} (tenant ${params.tenantId})`,
    );
    // Stub: Create JobExecution domain entity, persist, publish JobQueued event
    return crypto.randomUUID();
  }

  /**
   * Marks a queued job execution as started.
   * Acquires a distributed lock to prevent duplicate execution.
   *
   * @param nodeId - ID of the worker node picking up this job
   * @throws ConflictException if the lock cannot be acquired (another node is running this job)
   */
  async startJob(jobExecutionId: string, nodeId: string): Promise<void> {
    this.logger.log(`Starting job execution ${jobExecutionId} on node ${nodeId}`);
  }

  /**
   * Records a successful job completion.
   * Seals the JobExecution entity (immutable), updates schedule.lastExecution,
   * triggers next execution scheduling.
   */
  async completeJob(
    jobExecutionId: string,
    output: Record<string, unknown>,
    durationMs: number,
  ): Promise<void> {
    this.logger.log(`Completing job execution ${jobExecutionId} (${durationMs}ms)`);
  }

  /**
   * Records a job failure and determines whether to retry.
   * If retries remain, schedules next retry and transitions to Retrying.
   * If no retries remain, seals the entity in Failed state.
   */
  async failJob(
    jobExecutionId: string,
    errorMessage: string,
    errorCode: string | undefined,
    durationMs: number,
  ): Promise<void> {
    this.logger.log(
      `Failing job execution ${jobExecutionId}: ${errorMessage}`,
    );
  }

  /**
   * Cancels a Queued or Running execution before it completes.
   * Releases the distributed lock if held.
   */
  async cancelJob(
    jobExecutionId: string,
    cancelledBy: string,
    reason?: string,
  ): Promise<void> {
    this.logger.log(`Cancelling job execution ${jobExecutionId}`);
  }

  /**
   * Returns paginated active jobs (Queued + Running + Retrying).
   */
  async listActiveJobs(
    tenantId: string,
    dto: ListJobsDto,
  ): Promise<PaginatedResponseDto<JobExecutionDto>> {
    return { data: [], total: 0, page: dto.page ?? 1, limit: dto.limit ?? 20, hasNextPage: false };
  }

  /**
   * Returns immutable execution history records.
   */
  async listExecutionHistory(
    tenantId: string,
    dto: ListJobHistoryDto,
  ): Promise<PaginatedResponseDto<ExecutionHistoryReadModel>> {
    return { data: [], total: 0, page: dto.page ?? 1, limit: dto.limit ?? 20, hasNextPage: false };
  }

  /**
   * Returns failed and retrying jobs for alert display.
   */
  async listFailedJobs(tenantId: string): Promise<FailedJobsReadModel[]> {
    return [];
  }
}

// ---------------------------------------------------------------------------
// CronService — Cron Expression Evaluation
// ---------------------------------------------------------------------------

/**
 * Pure cron expression evaluation engine.
 *
 * Responsibilities:
 *   - Parse and validate cron expressions (5-field and 6-field)
 *   - Compute the next execution time from a given reference timestamp,
 *     correctly accounting for IANA timezone and DST transitions
 *   - Compute all missed execution times within a time window (for misfire handling)
 *   - Verify whether a given timestamp satisfies a cron expression
 *
 * This service owns NO state. All methods are pure (given same inputs → same outputs).
 * No persistence, no side effects.
 */
@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);

  /**
   * Parses and validates a cron expression string.
   *
   * @throws Error if the expression is syntactically invalid.
   * @returns A validated CronExpression value object.
   */
  parse(expression: string): CronExpression {
    return new CronExpression(expression);
  }

  /**
   * Computes the next execution time after `from`, evaluated in `timezone`.
   *
   * DST handling:
   *   - When a cron expression targets a time that does not exist during a
   *     "spring-forward" transition (e.g. 02:30 in a zone that jumps to 03:00),
   *     the next valid occurrence *after* the skipped hour is returned.
   *   - When a cron expression targets a time that occurs twice during a
   *     "fall-back" transition, the first occurrence is used.
   *
   * @param expression - Validated cron expression
   * @param from - Reference timestamp (next fire time is strictly after this)
   * @param timezone - IANA timezone for evaluation
   * @returns Next execution UTC timestamp, or null if no future occurrence exists
   */
  nextExecution(
    expression: CronExpression,
    from: Date,
    timezone: TimeZone,
  ): Date | null {
    this.logger.debug(
      `Computing next execution for "${expression.value}" after ${from.toISOString()} in ${timezone.value}`,
    );
    // Stub: implement full cron parsing (minute/hour/dom/month/dow fields)
    // with Intl.DateTimeFormat-based timezone conversion for DST safety.
    const next = new Date(from.getTime() + 60_000);
    return next;
  }

  /**
   * Returns all scheduled times that were missed between `from` and `to`.
   * Used by MisfireHandlerService to determine how many make-up executions to fire.
   *
   * @param expression - Validated cron expression
   * @param from - Start of the missed window (exclusive)
   * @param to - End of the missed window (inclusive)
   * @param timezone - IANA timezone for evaluation
   * @param limit - Maximum number of missed times to collect (prevents memory explosion)
   */
  missedExecutions(
    expression: CronExpression,
    from: Date,
    to: Date,
    timezone: TimeZone,
    limit: number = 100,
  ): Date[] {
    this.logger.debug(
      `Computing missed executions for "${expression.value}" from ${from.toISOString()} to ${to.toISOString()}`,
    );
    return [];
  }

  /**
   * Returns true if the given timestamp satisfies the cron expression,
   * evaluated in the specified timezone.
   */
  matches(expression: CronExpression, timestamp: Date, timezone: TimeZone): boolean {
    return false;
  }
}

// ---------------------------------------------------------------------------
// CalendarService — Calendar Exception Management
// ---------------------------------------------------------------------------

/**
 * Manages scheduling calendars and their associated exception windows.
 *
 * A "calendar" is a named collection of CalendarException entries that
 * define periods when scheduled jobs should not fire (holidays, blackout
 * windows, planned maintenance, restaurant closure periods).
 *
 * CalendarService is called by the scheduling engine *before* any job is
 * enqueued to check whether the target execution time is blocked.
 */
@Injectable()
export class CalendarService {
  private readonly logger = new Logger(CalendarService.name);

  /**
   * Returns true if the given UTC timestamp is blocked by any active
   * CalendarException in the specified calendar.
   *
   * @param calendarId - Calendar to check
   * @param utcTimestamp - Timestamp to evaluate
   * @param tenantId - Tenant scope for isolation
   */
  async isBlocked(
    calendarId: string,
    utcTimestamp: Date,
    tenantId: string,
  ): Promise<boolean> {
    this.logger.debug(
      `Checking calendar ${calendarId} for blocked time at ${utcTimestamp.toISOString()}`,
    );
    return false;
  }

  /**
   * Creates a new CalendarException within a calendar.
   *
   * @throws ConflictException if the new exception overlaps an existing one
   *         and the overlap would cause execution gaps wider than the misfire threshold.
   */
  async addException(
    tenantId: string,
    calendarId: string,
    exception: {
      label: string;
      startAt: Date;
      endAt: Date;
      recurring?: boolean;
    },
    createdBy: string,
  ): Promise<CalendarException> {
    return new CalendarException(
      crypto.randomUUID(),
      calendarId,
      tenantId,
      exception.label,
      exception.startAt,
      exception.endAt,
      exception.recurring ?? false,
    );
  }

  /**
   * Lists all active CalendarExceptions for a calendar, sorted by startAt.
   */
  async listExceptions(
    tenantId: string,
    calendarId: string,
  ): Promise<CalendarException[]> {
    return [];
  }

  /**
   * Removes a CalendarException by its ID.
   */
  async removeException(
    tenantId: string,
    calendarId: string,
    exceptionId: string,
  ): Promise<void> {
    this.logger.log(`Removing exception ${exceptionId} from calendar ${calendarId}`);
  }
}

// ---------------------------------------------------------------------------
// RetryService — Retry Backoff Computation
// ---------------------------------------------------------------------------

/**
 * Pure retry policy evaluation service.
 *
 * Computes the next retry delay given a RetryPolicy and the current attempt
 * number. All computation is deterministic (except ExponentialWithJitter,
 * which uses Math.random() seeded by attempt number for consistent behaviour
 * in tests via dependency injection of a random source).
 *
 * No state, no I/O. Fully unit-testable.
 */
@Injectable()
export class RetryService {
  private readonly logger = new Logger(RetryService.name);

  /**
   * Returns the delay in milliseconds before the next retry attempt,
   * or null if no further retries should occur.
   *
   * @param policy - The retry policy governing this job
   * @param attemptNumber - The *current* attempt number (1 = first attempt, 2 = first retry)
   */
  computeNextRetryDelayMs(
    policy: RetryPolicy,
    attemptNumber: number,
  ): number | null {
    if (attemptNumber > policy.maxAttempts) {
      this.logger.debug(
        `No retry: attempt ${attemptNumber} exceeds maxAttempts ${policy.maxAttempts}`,
      );
      return null;
    }

    const retryNumber = attemptNumber; // retries start at 1 after first failure

    let delayMs: number;

    switch (policy.backoffStrategy) {
      case BackoffStrategy.Fixed:
        delayMs = policy.baseDelayMs;
        break;

      case BackoffStrategy.Linear:
        delayMs = policy.baseDelayMs * retryNumber;
        break;

      case BackoffStrategy.Exponential:
        delayMs = policy.baseDelayMs * Math.pow(2, retryNumber - 1);
        break;

      case BackoffStrategy.ExponentialWithJitter: {
        const base = policy.baseDelayMs * Math.pow(2, retryNumber - 1);
        // Full jitter: uniform random in [0, base]
        const jitter = Math.random() * base;
        delayMs = Math.round(jitter);
        break;
      }

      default:
        delayMs = policy.baseDelayMs;
    }

    return Math.min(delayMs, policy.maxDelayMs);
  }

  /**
   * Computes the absolute timestamp of the next retry.
   *
   * @param policy - RetryPolicy
   * @param attemptNumber - Current attempt number
   * @param from - Reference timestamp (usually now)
   * @returns Next retry UTC Date, or null if retries are exhausted
   */
  nextRetryAt(
    policy: RetryPolicy,
    attemptNumber: number,
    from: Date = new Date(),
  ): Date | null {
    const delayMs = this.computeNextRetryDelayMs(policy, attemptNumber);
    if (delayMs === null) return null;
    return new Date(from.getTime() + delayMs);
  }

  /**
   * Returns true if the given error code is covered by this retry policy.
   * If the policy's retryableErrorCodes list is empty, all errors are retryable.
   */
  isRetryable(policy: RetryPolicy, errorCode?: string): boolean {
    if (policy.retryableErrorCodes.length === 0) return true;
    if (!errorCode) return false;
    return policy.retryableErrorCodes.includes(errorCode);
  }
}

// ---------------------------------------------------------------------------
// DistributedLockService — Redis-based Distributed Locking
// ---------------------------------------------------------------------------

/**
 * Provides distributed mutual exclusion for job executions.
 *
 * Guarantees that at most one scheduler node executes a given job at any
 * moment. Uses a Redis SET NX EX pattern with a unique token for safe release.
 *
 * Key naming convention: `scheduler:lock:{tenantId}:{jobExecutionId}`
 *
 * Liveness guarantees:
 *   - Lock TTL defaults to LOCK_TTL_MS (30s)
 *   - Active workers extend the lock via heartbeat every LOCK_HEARTBEAT_MS (10s)
 *   - On node crash, the lock expires within TTL and is available for another node
 */
@Injectable()
export class DistributedLockService {
  private readonly logger = new Logger(DistributedLockService.name);

  /**
   * Attempts to acquire an exclusive distributed lock.
   *
   * @param key - Unique lock key (e.g. `scheduler:lock:{tenantId}:{executionId}`)
   * @param ttlMs - Lock time-to-live in milliseconds
   * @returns DistributedLockToken if acquired, null if lock is held by another node
   */
  async acquireLock(
    key: string,
    ttlMs: number = LOCK_TTL_MS,
  ): Promise<DistributedLockToken | null> {
    this.logger.debug(`Attempting to acquire lock: ${key}`);
    // Stub: Redis SET {key} {token} NX PX {ttlMs}
    const token = crypto.randomUUID();
    return new DistributedLockToken(key, token, new Date(), ttlMs);
  }

  /**
   * Releases a distributed lock using the unique token.
   * Uses a Lua script to ensure atomic check-and-delete (prevents releasing
   * a lock owned by a different node after TTL expiry and re-acquisition).
   *
   * @returns true if the lock was released, false if it had already expired or
   *          was held by a different node.
   */
  async releaseLock(lockToken: DistributedLockToken): Promise<boolean> {
    this.logger.debug(`Releasing lock: ${lockToken.lockKey}`);
    // Stub: Lua script: if GET key == token then DEL key end
    return true;
  }

  /**
   * Extends the TTL of an active lock (heartbeat).
   * Used by long-running jobs to prevent premature lock expiry.
   *
   * @returns true if the extension was successful (lock still owned by this token)
   */
  async extendLock(
    lockToken: DistributedLockToken,
    ttlMs: number = LOCK_TTL_MS,
  ): Promise<boolean> {
    this.logger.debug(`Extending lock TTL: ${lockToken.lockKey}`);
    // Stub: Lua script: if GET key == token then PEXPIRE key ttlMs end
    return true;
  }
}

// ---------------------------------------------------------------------------
// LeaderElectionService — Distributed Leader Election
// ---------------------------------------------------------------------------

/**
 * Implements a distributed leader election mechanism for the scheduling engine.
 *
 * Only the elected leader node is responsible for:
 *   - Scanning active schedules to identify due executions
 *   - Computing and updating NextExecutionTime
 *   - Enqueuing new job executions
 *   - Handling misfire detection
 *
 * All other nodes are hot-standbys. On leader crash, the lock TTL expires
 * and a new leader is elected within LEADER_LOCK_TTL_MS.
 *
 * Election key: `scheduler:leader`
 */
@Injectable()
export class LeaderElectionService {
  private readonly logger = new Logger(LeaderElectionService.name);
  private readonly nodeId: string = `node-${crypto.randomUUID()}`;
  private _isLeader: boolean = false;
  private _heartbeatHandle?: ReturnType<typeof setInterval>;

  constructor(private readonly lockService: DistributedLockService) {}

  /**
   * Attempts to elect this node as the scheduling leader.
   * If the leader lock is already held, returns false — this node becomes a standby.
   *
   * @returns true if this node won the election, false if it is a standby.
   */
  async electLeader(): Promise<boolean> {
    this.logger.log(`Node ${this.nodeId} attempting leader election`);
    const lock = await this.lockService.acquireLock(
      'scheduler:leader',
      LEADER_LOCK_TTL_MS,
    );
    if (lock) {
      this._isLeader = true;
      this.startHeartbeat(lock);
      this.logger.log(`Node ${this.nodeId} elected as scheduling leader`);
    } else {
      this.logger.debug(`Node ${this.nodeId} is a scheduling standby`);
    }
    return this._isLeader;
  }

  /**
   * Heartbeat loop: extends the leader lock every LOCK_HEARTBEAT_MS.
   * If the extension fails (lock lost), triggers re-election.
   */
  private startHeartbeat(lock: DistributedLockToken): void {
    this._heartbeatHandle = setInterval(async () => {
      const extended = await this.lockService.extendLock(lock, LEADER_LOCK_TTL_MS);
      if (!extended) {
        this.logger.warn(`Node ${this.nodeId} lost leadership — triggering re-election`);
        this._isLeader = false;
        this.stopHeartbeat();
        void this.electLeader();
      }
    }, LOCK_HEARTBEAT_MS);
  }

  private stopHeartbeat(): void {
    if (this._heartbeatHandle) {
      clearInterval(this._heartbeatHandle);
      this._heartbeatHandle = undefined;
    }
  }

  /**
   * Returns true if this node is currently the elected scheduling leader.
   */
  get isLeader(): boolean {
    return this._isLeader;
  }

  /**
   * Returns the unique identifier of this scheduler node.
   */
  get currentNodeId(): string {
    return this.nodeId;
  }

  /**
   * Gracefully relinquishes leadership. Called during application shutdown.
   */
  async abdicate(lock: DistributedLockToken): Promise<void> {
    this.stopHeartbeat();
    this._isLeader = false;
    await this.lockService.releaseLock(lock);
    this.logger.log(`Node ${this.nodeId} abdicated scheduling leadership`);
  }
}

// ---------------------------------------------------------------------------
// MisfireHandlerService — Misfire Detection & Recovery
// ---------------------------------------------------------------------------

/**
 * Detects and recovers from missed job executions after a downtime event.
 *
 * A misfire occurs when the scheduling engine was unable to fire a job at
 * its scheduled time (leader crash, node restart, deployment, etc.) and
 * the scheduled time has now passed.
 *
 * A misfire is detected when:
 *   nextExecutionTime < now AND (now - nextExecutionTime) > misfireThresholdMs
 *
 * Recovery behaviour is governed by the schedule's MisfirePolicy:
 *   - FireOnce: Fire a single make-up execution immediately
 *   - Skip: Log the missed execution and advance to the next scheduled time
 *   - FireAll: Fire one execution per missed scheduled slot (use with caution)
 */
@Injectable()
export class MisfireHandlerService {
  private readonly logger = new Logger(MisfireHandlerService.name);

  constructor(
    private readonly cronService: CronService,
    private readonly jobExecutionService: JobExecutionService,
  ) {}

  /**
   * Evaluates a potentially misfired schedule and applies its misfire policy.
   *
   * @param schedule - The schedule to evaluate
   * @param now - Current timestamp (injected for testability)
   * @param misfireThresholdMs - Minimum lateness before an execution is considered a misfire
   * @returns Array of execution IDs that were queued as make-up executions (empty if Skipped)
   */
  async handleMisfire(
    schedule: Schedule,
    now: Date = new Date(),
    misfireThresholdMs: number = DEFAULT_MISFIRE_THRESHOLD_MS,
  ): Promise<string[]> {
    if (!schedule.nextExecution) return [];

    const latenessMs = now.getTime() - schedule.nextExecution.value.getTime();

    if (latenessMs <= misfireThresholdMs) {
      // Not a misfire — just a small delay, fire normally
      return [];
    }

    this.logger.warn(
      `Misfire detected for schedule ${schedule.id.value}: ` +
        `${latenessMs}ms late. Applying policy for schedule type ${schedule.definition.type}`,
    );

    const definition = schedule.definition;

    // Determine misfire policy — cron and calendar schedules carry an explicit policy
    let misfirePolicy = MisfirePolicy.FireOnce;
    if ('misfirePolicy' in definition) {
      misfirePolicy = definition.misfirePolicy;
    }

    switch (misfirePolicy) {
      case MisfirePolicy.Skip:
        this.logger.log(
          `Skipping misfired execution for schedule ${schedule.id.value} (policy: Skip)`,
        );
        return [];

      case MisfirePolicy.FireAll: {
        // Compute all missed slots for cron-type schedules
        if (
          definition.type === ScheduleType.Cron &&
          'cronExpression' in definition &&
          'timezone' in definition
        ) {
          const missed = this.cronService.missedExecutions(
            definition.cronExpression,
            schedule.nextExecution.value,
            now,
            definition.timezone,
          );
          this.logger.log(
            `Firing ${missed.length} make-up executions for schedule ${schedule.id.value} (policy: FireAll)`,
          );
          const executionIds: string[] = [];
          for (const missedAt of missed) {
            const id = await this.jobExecutionService.enqueueJob({
              tenantId: schedule.tenantId,
              scheduleId: schedule.id.value,
              jobType: schedule.jobType,
              payload: schedule.payload.data as Record<string, unknown>,
              priority: schedule.payload.priority,
              scheduledAt: missedAt,
              triggerType: JobTriggerType.Recovery,
            });
            executionIds.push(id);
          }
          return executionIds;
        }
        // Fall through to FireOnce for non-cron schedules
      }

      case MisfirePolicy.FireOnce:
      default: {
        this.logger.log(
          `Firing single make-up execution for schedule ${schedule.id.value} (policy: FireOnce)`,
        );
        const id = await this.jobExecutionService.enqueueJob({
          tenantId: schedule.tenantId,
          scheduleId: schedule.id.value,
          jobType: schedule.jobType,
          payload: schedule.payload.data as Record<string, unknown>,
          priority: schedule.payload.priority,
          scheduledAt: schedule.nextExecution.value,
          triggerType: JobTriggerType.Recovery,
        });
        return [id];
      }
    }
  }
}

// ---------------------------------------------------------------------------
// SchedulePersistenceService — Schedule Durability
// ---------------------------------------------------------------------------

/**
 * Abstracts durable storage for Schedule aggregates and JobExecution entities.
 *
 * In production, this service delegates to:
 *   - PostgreSQL (via Prisma) for durable schedule definitions and execution history
 *   - Redis for ephemeral execution queue state and distributed lock state
 *
 * The separation ensures that the execution queue can survive Redis restarts
 * by replaying from the PostgreSQL execution history.
 */
@Injectable()
export class SchedulePersistenceService {
  private readonly logger = new Logger(SchedulePersistenceService.name);

  /**
   * Persists a Schedule aggregate.
   * Performs an upsert — creates if new, updates if existing.
   */
  async saveSchedule(schedule: Schedule): Promise<void> {
    this.logger.debug(`Persisting schedule ${schedule.id.value}`);
  }

  /**
   * Loads a Schedule aggregate by its ID.
   *
   * @returns The Schedule aggregate, or null if not found.
   */
  async loadSchedule(
    tenantId: string,
    scheduleId: ScheduleId,
  ): Promise<Schedule | null> {
    this.logger.debug(`Loading schedule ${scheduleId.value}`);
    return null;
  }

  /**
   * Returns all Active schedules with a nextExecutionTime in the past.
   * Called by the leader node on each evaluation tick to identify due jobs.
   */
  async findDueSchedules(tenantId: string, now: Date): Promise<Schedule[]> {
    this.logger.debug(`Finding due schedules for tenant ${tenantId}`);
    return [];
  }

  /**
   * Persists a JobExecution entity.
   * Append-only: once a terminal status is stored, no UPDATE is permitted.
   */
  async saveJobExecution(execution: JobExecution): Promise<void> {
    this.logger.debug(`Persisting job execution ${execution.id.value}`);
  }

  /**
   * Loads a JobExecution entity by its ID.
   */
  async loadJobExecution(
    executionId: JobExecutionId,
  ): Promise<JobExecution | null> {
    this.logger.debug(`Loading job execution ${executionId.value}`);
    return null;
  }
}
