/**
 * Scheduler Platform — Domain Value Objects
 *
 * All value objects are immutable. Equality is determined by structural
 * comparison of their constituent parts, not identity.
 */

import {
  BackoffStrategy,
  JobPriority,
  MisfirePolicy,
  OverlapPolicy,
  ScheduleType,
} from '../enums/scheduler.enums';

// ---------------------------------------------------------------------------
// Identity value objects
// ---------------------------------------------------------------------------

/** Strongly typed identifier for a Schedule aggregate. */
export class ScheduleId {
  constructor(public readonly value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('ScheduleId must not be empty.');
    }
  }

  public equals(other: ScheduleId): boolean {
    return this.value === other.value;
  }

  public toString(): string {
    return this.value;
  }
}

/** Strongly typed identifier for a logical Job definition. */
export class JobId {
  constructor(public readonly value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('JobId must not be empty.');
    }
  }

  public equals(other: JobId): boolean {
    return this.value === other.value;
  }

  public toString(): string {
    return this.value;
  }
}

/** Strongly typed identifier for a single Job execution instance. */
export class JobExecutionId {
  constructor(public readonly value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('JobExecutionId must not be empty.');
    }
  }

  public equals(other: JobExecutionId): boolean {
    return this.value === other.value;
  }

  public toString(): string {
    return this.value;
  }
}

// ---------------------------------------------------------------------------
// CronExpression
// ---------------------------------------------------------------------------

/**
 * Validated cron expression value object.
 *
 * Accepts standard 5-field cron expressions (minute hour day-of-month month
 * day-of-week) and the extended 6-field form with a leading seconds field.
 *
 * Validation is structural — it does not resolve the next execution time here.
 * That responsibility belongs to CronService.
 */
export class CronExpression {
  /** Supported field count: 5 (standard) or 6 (with seconds). */
  private static readonly VALID_FIELD_COUNTS = new Set([5, 6]);

  constructor(public readonly value: string) {
    CronExpression.validate(value);
  }

  private static validate(expression: string): void {
    if (!expression || expression.trim().length === 0) {
      throw new Error('CronExpression must not be empty.');
    }
    const fields = expression.trim().split(/\s+/);
    if (!CronExpression.VALID_FIELD_COUNTS.has(fields.length)) {
      throw new Error(
        `CronExpression must have 5 or 6 space-separated fields. ` +
          `Received "${expression}" with ${fields.length} field(s).`,
      );
    }
  }

  /** Returns true if both cron expressions represent the same schedule. */
  public equals(other: CronExpression): boolean {
    return this.value.trim() === other.value.trim();
  }

  public toString(): string {
    return this.value;
  }
}

// ---------------------------------------------------------------------------
// TimeZone
// ---------------------------------------------------------------------------

/**
 * IANA timezone identifier value object.
 *
 * Validates that the provided string is a recognised IANA timezone using the
 * Intl API available in all modern Node.js runtimes. Required for correct
 * daylight saving time (DST) handling during cron evaluation.
 */
export class TimeZone {
  /** UTC constant for convenience. */
  static readonly UTC = new TimeZone('UTC');

  constructor(public readonly value: string) {
    TimeZone.validate(value);
  }

  private static validate(tz: string): void {
    if (!tz || tz.trim().length === 0) {
      throw new Error('TimeZone value must not be empty.');
    }
    try {
      // Intl.DateTimeFormat throws on invalid timezone strings.
      Intl.DateTimeFormat(undefined, { timeZone: tz });
    } catch {
      throw new Error(
        `TimeZone "${tz}" is not a valid IANA timezone identifier.`,
      );
    }
  }

  public equals(other: TimeZone): boolean {
    return this.value === other.value;
  }

  public toString(): string {
    return this.value;
  }
}

// ---------------------------------------------------------------------------
// ExecutionWindow
// ---------------------------------------------------------------------------

/**
 * Defines a daily time window within which executions are permitted.
 *
 * Times are expressed as "HH:mm" strings in 24-hour format.
 * Used in conjunction with timezone to enforce business-hours scheduling.
 *
 * @example
 *   new ExecutionWindow('08:00', '18:00') // 8 AM – 6 PM
 */
export class ExecutionWindow {
  private static readonly TIME_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/;

  constructor(
    public readonly startTime: string,
    public readonly endTime: string,
  ) {
    ExecutionWindow.validateTime(startTime, 'startTime');
    ExecutionWindow.validateTime(endTime, 'endTime');
    if (startTime >= endTime) {
      throw new Error(
        `ExecutionWindow startTime "${startTime}" must be before endTime "${endTime}".`,
      );
    }
  }

  private static validateTime(time: string, field: string): void {
    if (!ExecutionWindow.TIME_PATTERN.test(time)) {
      throw new Error(
        `ExecutionWindow ${field} "${time}" must match HH:mm format.`,
      );
    }
  }

  /**
   * Returns true if the given UTC date falls within this window,
   * evaluated in the provided IANA timezone.
   */
  public contains(utcDate: Date, timezone: TimeZone): boolean {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone.value,
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
    const parts = formatter.formatToParts(utcDate);
    const hour = parts.find((p) => p.type === 'hour')?.value ?? '00';
    const minute = parts.find((p) => p.type === 'minute')?.value ?? '00';
    const localTime = `${hour}:${minute}`;
    return localTime >= this.startTime && localTime < this.endTime;
  }
}

// ---------------------------------------------------------------------------
// Execution timestamps
// ---------------------------------------------------------------------------

/** Records the precise timestamp of the next planned execution. */
export class NextExecutionTime {
  constructor(public readonly value: Date) {
    if (!(value instanceof Date) || isNaN(value.getTime())) {
      throw new Error('NextExecutionTime must be a valid Date.');
    }
  }

  public isInPast(): boolean {
    return this.value < new Date();
  }

  public equals(other: NextExecutionTime): boolean {
    return this.value.getTime() === other.value.getTime();
  }
}

/** Records the precise timestamp of the most recent completed execution. */
export class LastExecutionTime {
  constructor(public readonly value: Date) {
    if (!(value instanceof Date) || isNaN(value.getTime())) {
      throw new Error('LastExecutionTime must be a valid Date.');
    }
  }

  public equals(other: LastExecutionTime): boolean {
    return this.value.getTime() === other.value.getTime();
  }
}

// ---------------------------------------------------------------------------
// ScheduleDefinition
// ---------------------------------------------------------------------------

/**
 * Union-discriminated schedule configuration.
 *
 * Each schedule type carries exactly the configuration fields it needs.
 * Type narrowing on `type` gives full intellisense for downstream consumers.
 */
export type ScheduleDefinition =
  | CronScheduleDefinition
  | OneTimeScheduleDefinition
  | RecurringScheduleDefinition
  | CalendarScheduleDefinition
  | DelayedScheduleDefinition
  | FixedIntervalScheduleDefinition
  | FixedDelayScheduleDefinition
  | EventTriggeredDelayDefinition;

export interface CronScheduleDefinition {
  readonly type: ScheduleType.Cron;
  readonly cronExpression: CronExpression;
  readonly timezone: TimeZone;
  readonly executionWindow?: ExecutionWindow;
  readonly misfirePolicy: MisfirePolicy;
  readonly overlapPolicy: OverlapPolicy;
}

export interface OneTimeScheduleDefinition {
  readonly type: ScheduleType.OneTime;
  readonly executeAt: Date;
  readonly timezone: TimeZone;
}

export interface RecurringScheduleDefinition {
  readonly type: ScheduleType.Recurring;
  readonly intervalMs: number;
  readonly maxExecutions: number;
  readonly timezone: TimeZone;
  readonly overlapPolicy: OverlapPolicy;
}

export interface CalendarScheduleDefinition {
  readonly type: ScheduleType.Calendar;
  readonly calendarId: string;
  readonly timezone: TimeZone;
  readonly executionWindow?: ExecutionWindow;
  readonly misfirePolicy: MisfirePolicy;
}

export interface DelayedScheduleDefinition {
  readonly type: ScheduleType.Delayed;
  readonly delayMs: number;
}

export interface FixedIntervalScheduleDefinition {
  readonly type: ScheduleType.FixedInterval;
  readonly intervalMs: number;
  readonly timezone: TimeZone;
  readonly overlapPolicy: OverlapPolicy;
}

export interface FixedDelayScheduleDefinition {
  readonly type: ScheduleType.FixedDelay;
  readonly delayAfterCompletionMs: number;
  readonly timezone: TimeZone;
}

export interface EventTriggeredDelayDefinition {
  readonly type: ScheduleType.EventTriggeredDelay;
  readonly triggerEventName: string;
  readonly delayMs: number;
  readonly correlationKey?: string;
}

// ---------------------------------------------------------------------------
// RetryPolicy
// ---------------------------------------------------------------------------

/**
 * Encapsulates retry behaviour for failed job executions.
 *
 * Backoff is computed by RetryService — this value object stores only the
 * policy parameters.
 */
export class RetryPolicy {
  /** Maximum number of retry attempts (not counting the initial attempt). */
  public readonly maxAttempts: number;

  /** Base delay in milliseconds for the first retry. */
  public readonly baseDelayMs: number;

  /** Maximum delay cap in milliseconds for exponential strategies. */
  public readonly maxDelayMs: number;

  /** Backoff strategy used to compute delay between retries. */
  public readonly backoffStrategy: BackoffStrategy;

  /** Whether to retry on any error, or only on specific error codes. */
  public readonly retryableErrorCodes: ReadonlyArray<string>;

  constructor(params: {
    maxAttempts: number;
    baseDelayMs: number;
    maxDelayMs: number;
    backoffStrategy: BackoffStrategy;
    retryableErrorCodes?: string[];
  }) {
    if (params.maxAttempts < 0) {
      throw new Error('RetryPolicy maxAttempts must be >= 0.');
    }
    if (params.baseDelayMs < 0) {
      throw new Error('RetryPolicy baseDelayMs must be >= 0.');
    }
    if (params.maxDelayMs < params.baseDelayMs) {
      throw new Error(
        'RetryPolicy maxDelayMs must be >= baseDelayMs.',
      );
    }
    this.maxAttempts = params.maxAttempts;
    this.baseDelayMs = params.baseDelayMs;
    this.maxDelayMs = params.maxDelayMs;
    this.backoffStrategy = params.backoffStrategy;
    this.retryableErrorCodes = Object.freeze(
      params.retryableErrorCodes ?? [],
    );
  }

  /** Convenience factory for a no-retry policy. */
  static noRetry(): RetryPolicy {
    return new RetryPolicy({
      maxAttempts: 0,
      baseDelayMs: 0,
      maxDelayMs: 0,
      backoffStrategy: BackoffStrategy.Fixed,
    });
  }

  /** Convenience factory for a standard exponential-backoff-with-jitter policy. */
  static defaultPolicy(): RetryPolicy {
    return new RetryPolicy({
      maxAttempts: 3,
      baseDelayMs: 1_000,
      maxDelayMs: 60_000,
      backoffStrategy: BackoffStrategy.ExponentialWithJitter,
    });
  }
}

// ---------------------------------------------------------------------------
// ExecutionResult
// ---------------------------------------------------------------------------

/**
 * Immutable record of a job execution outcome.
 *
 * Written once when the execution completes (success or failure).
 * Never mutated after creation — enforces immutable execution history.
 */
export class ExecutionResult {
  public readonly succeededAt?: Date;
  public readonly failedAt?: Date;
  public readonly durationMs: number;
  public readonly output: Readonly<Record<string, unknown>>;
  public readonly errorMessage?: string;
  public readonly errorCode?: string;

  private constructor(params: {
    durationMs: number;
    output: Record<string, unknown>;
    succeededAt?: Date;
    failedAt?: Date;
    errorMessage?: string;
    errorCode?: string;
  }) {
    this.durationMs = params.durationMs;
    this.output = Object.freeze({ ...params.output });
    this.succeededAt = params.succeededAt;
    this.failedAt = params.failedAt;
    this.errorMessage = params.errorMessage;
    this.errorCode = params.errorCode;
  }

  public get isSuccess(): boolean {
    return this.succeededAt !== undefined;
  }

  /** Factory: create a successful execution result. */
  static success(params: {
    durationMs: number;
    output: Record<string, unknown>;
  }): ExecutionResult {
    return new ExecutionResult({
      ...params,
      succeededAt: new Date(),
    });
  }

  /** Factory: create a failed execution result. */
  static failure(params: {
    durationMs: number;
    errorMessage: string;
    errorCode?: string;
    output?: Record<string, unknown>;
  }): ExecutionResult {
    return new ExecutionResult({
      durationMs: params.durationMs,
      output: params.output ?? {},
      failedAt: new Date(),
      errorMessage: params.errorMessage,
      errorCode: params.errorCode,
    });
  }
}

// ---------------------------------------------------------------------------
// DistributedLock
// ---------------------------------------------------------------------------

/** Represents an acquired distributed lock token. */
export class DistributedLockToken {
  constructor(
    public readonly lockKey: string,
    public readonly token: string,
    public readonly acquiredAt: Date,
    public readonly ttlMs: number,
  ) {}

  /** Returns true if the lock has expired based on wall-clock time. */
  public isExpired(): boolean {
    return Date.now() > this.acquiredAt.getTime() + this.ttlMs;
  }
}

// ---------------------------------------------------------------------------
// JobPayload
// ---------------------------------------------------------------------------

/**
 * Typed container for the input data passed to a job execution.
 * Carries tenant context alongside the job-specific payload.
 */
export class JobPayload {
  constructor(
    public readonly tenantId: string,
    public readonly data: Readonly<Record<string, unknown>>,
    public readonly priority: JobPriority = JobPriority.Normal,
    public readonly correlationId?: string,
  ) {
    if (!tenantId || tenantId.trim().length === 0) {
      throw new Error('JobPayload tenantId must not be empty.');
    }
  }
}
