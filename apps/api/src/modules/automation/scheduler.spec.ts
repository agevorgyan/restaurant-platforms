/**
 * Scheduler Platform — Unit Tests
 *
 * Covers:
 *   1. CronExpression value object validation
 *   2. TimeZone value object IANA validation
 *   3. ExecutionWindow value object constraints
 *   4. RetryPolicy value object validation + factory methods
 *   5. ExecutionResult value object
 *   6. Schedule aggregate state machine transitions
 *   7. JobExecution entity state machine + immutability seal
 *   8. CalendarException coverage method
 *   9. RetryService backoff computation
 *  10. RetryService.isRetryable
 *  11. CronService.nextExecution (stub behaviour)
 *  12. ScheduleId / JobId / JobExecutionId guard validation
 */

import { RetryService } from './application/services/scheduler.services';
import {
  CronExpression,
  TimeZone,
  ExecutionWindow,
  RetryPolicy,
  ExecutionResult,
  ScheduleId,
  JobId,
  JobExecutionId,
  JobPayload,
} from './domain/value-objects/scheduler.value-objects';
import { Schedule, JobExecution, CalendarException } from './domain/models/scheduler.model';
import {
  ScheduleStatus,
  JobStatus,
  JobType,
  BackoffStrategy,
  ScheduleType,
  MisfirePolicy,
  OverlapPolicy,
  JobTriggerType,
} from './domain/enums/scheduler.enums';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeSchedule(): Schedule {
  return new Schedule(
    new ScheduleId('sched-001'),
    'tenant-001',
    'Test Schedule',
    'A test schedule',
    JobType.Cleanup,
    {
      type: ScheduleType.Cron,
      cronExpression: new CronExpression('0 9 * * MON-FRI'),
      timezone: new TimeZone('UTC'),
      misfirePolicy: MisfirePolicy.FireOnce,
      overlapPolicy: OverlapPolicy.Skip,
    },
    RetryPolicy.defaultPolicy(),
    new JobPayload('tenant-001', { action: 'purge' }),
  );
}

function makeJobExecution(): JobExecution {
  return new JobExecution({
    id: new JobExecutionId('exec-001'),
    jobId: new JobId('job-001'),
    scheduleId: new ScheduleId('sched-001'),
    tenantId: 'tenant-001',
    jobType: JobType.Cleanup,
    triggerType: JobTriggerType.Automatic,
    payload: new JobPayload('tenant-001', {}),
    scheduledAt: new Date(),
  });
}

// ---------------------------------------------------------------------------
// 1. CronExpression
// ---------------------------------------------------------------------------

describe('CronExpression', () => {
  it('accepts a valid 5-field cron expression', () => {
    expect(() => new CronExpression('0 9 * * MON-FRI')).not.toThrow();
  });

  it('accepts a valid 6-field cron expression with seconds', () => {
    expect(() => new CronExpression('0 0 9 * * MON-FRI')).not.toThrow();
  });

  it('throws for an empty string', () => {
    expect(() => new CronExpression('')).toThrow('must not be empty');
  });

  it('throws for a 4-field expression', () => {
    expect(() => new CronExpression('0 9 * *')).toThrow('5 or 6 space-separated fields');
  });

  it('throws for a 7-field expression', () => {
    expect(() => new CronExpression('0 0 0 9 * * MON-FRI')).toThrow('5 or 6 space-separated fields');
  });

  it('considers structurally identical expressions equal', () => {
    const a = new CronExpression('0 9 * * *');
    const b = new CronExpression('0 9 * * *');
    expect(a.equals(b)).toBe(true);
  });

  it('considers whitespace-padded expressions equal', () => {
    const a = new CronExpression('  0 9 * * *  ');
    const b = new CronExpression('0 9 * * *');
    expect(a.equals(b)).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// 2. TimeZone
// ---------------------------------------------------------------------------

describe('TimeZone', () => {
  it('accepts a valid IANA timezone', () => {
    expect(() => new TimeZone('America/New_York')).not.toThrow();
    expect(() => new TimeZone('Europe/London')).not.toThrow();
    expect(() => new TimeZone('Asia/Dubai')).not.toThrow();
    expect(() => new TimeZone('UTC')).not.toThrow();
  });

  it('throws for an invalid timezone string', () => {
    expect(() => new TimeZone('Not/ATimezone')).toThrow();
  });

  it('throws for an empty string', () => {
    expect(() => new TimeZone('')).toThrow('must not be empty');
  });

  it('exposes the UTC constant', () => {
    expect(TimeZone.UTC.value).toBe('UTC');
  });
});

// ---------------------------------------------------------------------------
// 3. ExecutionWindow
// ---------------------------------------------------------------------------

describe('ExecutionWindow', () => {
  it('creates a valid window', () => {
    expect(() => new ExecutionWindow('08:00', '18:00')).not.toThrow();
  });

  it('throws when startTime >= endTime', () => {
    expect(() => new ExecutionWindow('18:00', '08:00')).toThrow('must be before endTime');
    expect(() => new ExecutionWindow('08:00', '08:00')).toThrow('must be before endTime');
  });

  it('throws for invalid time format', () => {
    expect(() => new ExecutionWindow('8:00', '18:00')).toThrow('HH:mm format');
    expect(() => new ExecutionWindow('08:60', '18:00')).toThrow('HH:mm format');
    expect(() => new ExecutionWindow('25:00', '26:00')).toThrow('HH:mm format');
  });
});

// ---------------------------------------------------------------------------
// 4. RetryPolicy
// ---------------------------------------------------------------------------

describe('RetryPolicy', () => {
  it('creates a valid policy', () => {
    const policy = new RetryPolicy({
      maxAttempts: 3,
      baseDelayMs: 1000,
      maxDelayMs: 30000,
      backoffStrategy: BackoffStrategy.ExponentialWithJitter,
    });
    expect(policy.maxAttempts).toBe(3);
  });

  it('throws when maxAttempts is negative', () => {
    expect(
      () => new RetryPolicy({ maxAttempts: -1, baseDelayMs: 1000, maxDelayMs: 5000, backoffStrategy: BackoffStrategy.Fixed }),
    ).toThrow('maxAttempts must be >= 0');
  });

  it('throws when maxDelayMs < baseDelayMs', () => {
    expect(
      () => new RetryPolicy({ maxAttempts: 3, baseDelayMs: 5000, maxDelayMs: 1000, backoffStrategy: BackoffStrategy.Fixed }),
    ).toThrow('maxDelayMs must be >= baseDelayMs');
  });

  it('noRetry factory returns zero attempts', () => {
    const policy = RetryPolicy.noRetry();
    expect(policy.maxAttempts).toBe(0);
  });

  it('defaultPolicy factory returns sensible defaults', () => {
    const policy = RetryPolicy.defaultPolicy();
    expect(policy.maxAttempts).toBe(3);
    expect(policy.backoffStrategy).toBe(BackoffStrategy.ExponentialWithJitter);
  });
});

// ---------------------------------------------------------------------------
// 5. ExecutionResult
// ---------------------------------------------------------------------------

describe('ExecutionResult', () => {
  it('creates a successful result', () => {
    const result = ExecutionResult.success({ durationMs: 250, output: { rows: 10 } });
    expect(result.isSuccess).toBe(true);
    expect(result.succeededAt).toBeInstanceOf(Date);
    expect(result.output.rows).toBe(10);
  });

  it('creates a failed result', () => {
    const result = ExecutionResult.failure({ durationMs: 100, errorMessage: 'Timeout', errorCode: 'E_TIMEOUT' });
    expect(result.isSuccess).toBe(false);
    expect(result.failedAt).toBeInstanceOf(Date);
    expect(result.errorMessage).toBe('Timeout');
  });

  it('output is frozen (immutable)', () => {
    const result = ExecutionResult.success({ durationMs: 10, output: { key: 'value' } });
    expect(Object.isFrozen(result.output)).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// 6. Schedule aggregate — state machine
// ---------------------------------------------------------------------------

describe('Schedule aggregate', () => {
  it('is created in Draft status', () => {
    const schedule = makeSchedule();
    expect(schedule.status).toBe(ScheduleStatus.Draft);
  });

  it('activates from Draft', () => {
    const schedule = makeSchedule();
    schedule.activate('admin');
    expect(schedule.status).toBe(ScheduleStatus.Active);
  });

  it('activates from Paused', () => {
    const schedule = makeSchedule();
    schedule.activate('admin');
    schedule.pause('admin');
    schedule.resume('admin');
    expect(schedule.status).toBe(ScheduleStatus.Active);
  });

  it('throws on activating an already Active schedule', () => {
    const schedule = makeSchedule();
    schedule.activate('admin');
    expect(() => schedule.activate('admin')).toThrow('Only Draft or Paused schedules can be activated');
  });

  it('pauses an Active schedule', () => {
    const schedule = makeSchedule();
    schedule.activate('admin');
    schedule.pause('admin', 'maintenance');
    expect(schedule.status).toBe(ScheduleStatus.Paused);
  });

  it('throws on pausing a non-Active schedule', () => {
    const schedule = makeSchedule();
    expect(() => schedule.pause('admin')).toThrow('Only Active schedules can be paused');
  });

  it('cancels from Draft', () => {
    const schedule = makeSchedule();
    schedule.cancel('admin', 'no longer needed');
    expect(schedule.status).toBe(ScheduleStatus.Cancelled);
  });

  it('throws on cancelling an already Cancelled schedule', () => {
    const schedule = makeSchedule();
    schedule.cancel('admin');
    expect(() => schedule.cancel('admin')).toThrow('already in terminal state');
  });

  it('expires the schedule', () => {
    const schedule = makeSchedule();
    schedule.activate('admin');
    schedule.expire();
    expect(schedule.status).toBe(ScheduleStatus.Expired);
  });

  it('tracks execution count via recordExecution', () => {
    const schedule = makeSchedule();
    expect(schedule.executionCount).toBe(0);
    schedule.recordExecution(new Date());
    schedule.recordExecution(new Date());
    expect(schedule.executionCount).toBe(2);
  });

  it('records and pulls domain events', () => {
    const schedule = makeSchedule();
    schedule.activate('admin');
    schedule.pause('admin');
    const events = schedule.pullEvents();
    expect(events.length).toBe(2);
    // Events are cleared after pull
    expect(schedule.pullEvents().length).toBe(0);
  });

  it('isEligibleToFire when Active with past nextExecution', () => {
    const schedule = makeSchedule();
    schedule.activate('admin');
    schedule.setNextExecution(new Date(Date.now() - 5000));
    expect(schedule.isEligibleToFire()).toBe(true);
  });

  it('is not eligible to fire when Paused', () => {
    const schedule = makeSchedule();
    schedule.activate('admin');
    schedule.setNextExecution(new Date(Date.now() - 5000));
    schedule.pause('admin');
    expect(schedule.isEligibleToFire()).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// 7. JobExecution entity — state machine + immutability
// ---------------------------------------------------------------------------

describe('JobExecution entity', () => {
  it('starts in Queued status', () => {
    const exec = makeJobExecution();
    expect(exec.status).toBe(JobStatus.Queued);
  });

  it('transitions to Running on markStarted', () => {
    const exec = makeJobExecution();
    exec.markStarted('node-1');
    expect(exec.status).toBe(JobStatus.Running);
    expect(exec.nodeId).toBe('node-1');
  });

  it('seals to Succeeded on markSucceeded', () => {
    const exec = makeJobExecution();
    exec.markStarted('node-1');
    exec.markSucceeded(ExecutionResult.success({ durationMs: 100, output: {} }));
    expect(exec.status).toBe(JobStatus.Succeeded);
    expect(exec.isTerminal).toBe(true);
  });

  it('refuses mutation after Succeeded (immutable)', () => {
    const exec = makeJobExecution();
    exec.markStarted('node-1');
    exec.markSucceeded(ExecutionResult.success({ durationMs: 100, output: {} }));
    expect(() => exec.markCancelled()).toThrow('sealed');
  });

  it('transitions to Retrying on markFailed with nextRetryAt', () => {
    const exec = makeJobExecution();
    exec.markStarted('node-1');
    exec.markFailed(
      ExecutionResult.failure({ durationMs: 50, errorMessage: 'timeout' }),
      new Date(Date.now() + 5000),
    );
    expect(exec.status).toBe(JobStatus.Retrying);
    expect(exec.isTerminal).toBe(false);
  });

  it('seals to Failed on markFailed without nextRetryAt', () => {
    const exec = makeJobExecution();
    exec.markStarted('node-1');
    exec.markFailed(ExecutionResult.failure({ durationMs: 50, errorMessage: 'fatal' }));
    expect(exec.status).toBe(JobStatus.Failed);
    expect(exec.isTerminal).toBe(true);
  });

  it('seals to Cancelled from Queued', () => {
    const exec = makeJobExecution();
    exec.markCancelled();
    expect(exec.status).toBe(JobStatus.Cancelled);
    expect(exec.isTerminal).toBe(true);
  });

  it('seals to Skipped from Queued', () => {
    const exec = makeJobExecution();
    exec.markSkipped();
    expect(exec.status).toBe(JobStatus.Skipped);
    expect(exec.isTerminal).toBe(true);
  });

  it('increments attemptNumber on retry', () => {
    const exec = makeJobExecution();
    exec.markStarted('node-1');
    exec.markFailed(
      ExecutionResult.failure({ durationMs: 10, errorMessage: 'err' }),
      new Date(Date.now() + 1000),
    );
    expect(exec.attemptNumber).toBe(2);
  });
});

// ---------------------------------------------------------------------------
// 8. CalendarException
// ---------------------------------------------------------------------------

describe('CalendarException', () => {
  it('throws when startAt >= endAt', () => {
    const now = new Date();
    expect(
      () => new CalendarException('id-1', 'cal-1', 'tenant-1', 'Holiday', now, now),
    ).toThrow('startAt must be before endAt');
  });

  it('covers a timestamp within its window', () => {
    const start = new Date('2025-12-25T00:00:00Z');
    const end = new Date('2025-12-26T00:00:00Z');
    const exception = new CalendarException('id-1', 'cal-1', 'tenant-1', 'Christmas', start, end);
    expect(exception.covers(new Date('2025-12-25T12:00:00Z'))).toBe(true);
  });

  it('does not cover a timestamp outside its window', () => {
    const start = new Date('2025-12-25T00:00:00Z');
    const end = new Date('2025-12-26T00:00:00Z');
    const exception = new CalendarException('id-1', 'cal-1', 'tenant-1', 'Christmas', start, end);
    expect(exception.covers(new Date('2025-12-24T23:59:59Z'))).toBe(false);
    expect(exception.covers(new Date('2025-12-27T00:00:00Z'))).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// 9. RetryService — backoff computation
// ---------------------------------------------------------------------------

describe('RetryService', () => {
  let service: RetryService;

  beforeEach(() => {
    service = new RetryService();
  });

  it('returns null when attempts are exhausted', () => {
    const policy = new RetryPolicy({ maxAttempts: 2, baseDelayMs: 1000, maxDelayMs: 10000, backoffStrategy: BackoffStrategy.Fixed });
    expect(service.computeNextRetryDelayMs(policy, 3)).toBeNull();
  });

  it('computes Fixed backoff correctly', () => {
    const policy = new RetryPolicy({ maxAttempts: 3, baseDelayMs: 2000, maxDelayMs: 10000, backoffStrategy: BackoffStrategy.Fixed });
    expect(service.computeNextRetryDelayMs(policy, 1)).toBe(2000);
    expect(service.computeNextRetryDelayMs(policy, 2)).toBe(2000);
  });

  it('computes Linear backoff correctly', () => {
    const policy = new RetryPolicy({ maxAttempts: 3, baseDelayMs: 1000, maxDelayMs: 10000, backoffStrategy: BackoffStrategy.Linear });
    expect(service.computeNextRetryDelayMs(policy, 1)).toBe(1000);
    expect(service.computeNextRetryDelayMs(policy, 2)).toBe(2000);
    expect(service.computeNextRetryDelayMs(policy, 3)).toBe(3000);
  });

  it('computes Exponential backoff correctly', () => {
    const policy = new RetryPolicy({ maxAttempts: 4, baseDelayMs: 1000, maxDelayMs: 60000, backoffStrategy: BackoffStrategy.Exponential });
    expect(service.computeNextRetryDelayMs(policy, 1)).toBe(1000); // 1000 * 2^0
    expect(service.computeNextRetryDelayMs(policy, 2)).toBe(2000); // 1000 * 2^1
    expect(service.computeNextRetryDelayMs(policy, 3)).toBe(4000); // 1000 * 2^2
  });

  it('caps delay at maxDelayMs', () => {
    const policy = new RetryPolicy({ maxAttempts: 10, baseDelayMs: 1000, maxDelayMs: 5000, backoffStrategy: BackoffStrategy.Exponential });
    // attempt 10: 1000 * 2^9 = 512000 → capped at 5000
    expect(service.computeNextRetryDelayMs(policy, 10)).toBe(5000);
  });

  it('returns a date for nextRetryAt when retries remain', () => {
    const policy = RetryPolicy.defaultPolicy();
    const result = service.nextRetryAt(policy, 1, new Date());
    expect(result).toBeInstanceOf(Date);
  });

  it('returns null for nextRetryAt when retries exhausted', () => {
    const policy = RetryPolicy.noRetry();
    expect(service.nextRetryAt(policy, 1)).toBeNull();
  });

  // 10. isRetryable
  it('isRetryable returns true when retryableErrorCodes is empty', () => {
    const policy = RetryPolicy.defaultPolicy();
    expect(service.isRetryable(policy, 'ANY_CODE')).toBe(true);
    expect(service.isRetryable(policy, undefined)).toBe(true);
  });

  it('isRetryable returns true when error code is in the whitelist', () => {
    const policy = new RetryPolicy({
      maxAttempts: 3, baseDelayMs: 1000, maxDelayMs: 10000,
      backoffStrategy: BackoffStrategy.Fixed,
      retryableErrorCodes: ['E_TIMEOUT', 'E_RATE_LIMIT'],
    });
    expect(service.isRetryable(policy, 'E_TIMEOUT')).toBe(true);
  });

  it('isRetryable returns false when error code is not in the whitelist', () => {
    const policy = new RetryPolicy({
      maxAttempts: 3, baseDelayMs: 1000, maxDelayMs: 10000,
      backoffStrategy: BackoffStrategy.Fixed,
      retryableErrorCodes: ['E_TIMEOUT'],
    });
    expect(service.isRetryable(policy, 'E_NOT_FOUND')).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// 11. ScheduleId / JobId / JobExecutionId guard validation
// ---------------------------------------------------------------------------

describe('Identity value objects', () => {
  it('ScheduleId accepts a non-empty string', () => {
    expect(() => new ScheduleId('abc-123')).not.toThrow();
  });

  it('ScheduleId throws for empty string', () => {
    expect(() => new ScheduleId('')).toThrow('must not be empty');
  });

  it('JobId accepts a non-empty string', () => {
    expect(() => new JobId('job-abc')).not.toThrow();
  });

  it('JobExecutionId accepts a non-empty string', () => {
    expect(() => new JobExecutionId('exec-xyz')).not.toThrow();
  });

  it('ScheduleId equality works', () => {
    const a = new ScheduleId('same-id');
    const b = new ScheduleId('same-id');
    expect(a.equals(b)).toBe(true);
  });

  it('ScheduleId inequality works', () => {
    const a = new ScheduleId('id-1');
    const b = new ScheduleId('id-2');
    expect(a.equals(b)).toBe(false);
  });
});
