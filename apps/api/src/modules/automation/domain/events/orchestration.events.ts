/**
 * Automation Orchestration Platform — Domain Events
 *
 * All events are immutable records of something that already happened.
 * They carry the minimum data needed for downstream consumers to react.
 * No methods. No business logic.
 *
 * Event naming convention: Past tense noun phrases.
 */

import {
  OrchestrationId,
  OrchestrationVersion,
  AutomationTemplateId,
  ExecutionTraceId,
} from '../value-objects/orchestration.value-objects';

import { TriggerType, OrchestrationExecutionStatus } from '../enums/orchestration.enums';

// ---------------------------------------------------------------------------
// Orchestration Definition Lifecycle Events
// ---------------------------------------------------------------------------

/**
 * Raised when a new orchestration definition is persisted in Draft state.
 *
 * Downstream consumers:
 *   - Audit log
 *   - Tenant notification (optional)
 */
export class OrchestrationCreated {
  public readonly occurredAt: Date = new Date();

  constructor(
    public readonly orchestrationId: OrchestrationId,
    public readonly version: OrchestrationVersion,
    public readonly tenantId: string,
    public readonly name: string,
    public readonly createdBy: string,
  ) {}
}

/**
 * Raised when a Draft orchestration is published.
 * The definition is now immutable and executable.
 *
 * Downstream consumers:
 *   - Trigger registration (TriggerService subscribes to activate triggers)
 *   - Audit log
 */
export class OrchestrationPublished {
  public readonly occurredAt: Date = new Date();

  constructor(
    public readonly orchestrationId: OrchestrationId,
    public readonly version: OrchestrationVersion,
    public readonly tenantId: string,
    public readonly publishedBy: string,
    public readonly stepCount: number,
    public readonly triggerCount: number,
  ) {}
}

// ---------------------------------------------------------------------------
// Execution Lifecycle Events
// ---------------------------------------------------------------------------

/**
 * Raised when an execution is triggered and transitions from Pending to Running.
 *
 * Downstream consumers:
 *   - Real-time execution dashboard
 *   - Distributed tracing (trace start)
 *   - Audit log
 */
export class OrchestrationStarted {
  public readonly occurredAt: Date = new Date();

  constructor(
    public readonly executionId: string,
    public readonly orchestrationId: OrchestrationId,
    public readonly version: OrchestrationVersion,
    public readonly tenantId: string,
    public readonly traceId: ExecutionTraceId,
    public readonly triggerType: TriggerType,
    public readonly correlationId: string,
  ) {}
}

/**
 * Raised when a running execution is paused by an operator or by the system.
 *
 * Downstream consumers:
 *   - Dashboard alert
 *   - Audit log
 */
export class OrchestrationPaused {
  public readonly occurredAt: Date = new Date();

  constructor(
    public readonly executionId: string,
    public readonly orchestrationId: OrchestrationId,
    public readonly tenantId: string,
    public readonly pausedBy: string,
    /** The latest checkpoint ID that makes this pause resumable. */
    public readonly checkpointId: string,
    public readonly reason?: string,
  ) {}
}

/**
 * Raised when a paused execution resumes from its last checkpoint.
 *
 * Downstream consumers:
 *   - Dashboard update
 *   - Audit log
 */
export class OrchestrationResumed {
  public readonly occurredAt: Date = new Date();

  constructor(
    public readonly executionId: string,
    public readonly orchestrationId: OrchestrationId,
    public readonly tenantId: string,
    public readonly resumedBy: string,
    public readonly fromCheckpointId: string,
  ) {}
}

/**
 * Raised when an execution completes all steps successfully.
 * Terminal event.
 *
 * Downstream consumers:
 *   - Analytics aggregation
 *   - SLA monitoring
 *   - Audit log
 */
export class OrchestrationCompleted {
  public readonly occurredAt: Date = new Date();

  constructor(
    public readonly executionId: string,
    public readonly orchestrationId: OrchestrationId,
    public readonly version: OrchestrationVersion,
    public readonly tenantId: string,
    public readonly durationMs: number,
    public readonly completedStepCount: number,
    public readonly traceId: ExecutionTraceId,
  ) {}
}

/**
 * Raised when an execution fails terminally.
 * Terminal event.
 *
 * Downstream consumers:
 *   - Alert manager
 *   - Dead-letter queue
 *   - Audit log
 *   - Compensation saga trigger
 */
export class OrchestrationFailed {
  public readonly occurredAt: Date = new Date();

  constructor(
    public readonly executionId: string,
    public readonly orchestrationId: OrchestrationId,
    public readonly version: OrchestrationVersion,
    public readonly tenantId: string,
    public readonly failedStepId: string,
    public readonly reason: string,
    public readonly durationMs: number,
    public readonly traceId: ExecutionTraceId,
  ) {}
}

// ---------------------------------------------------------------------------
// Trigger Events
// ---------------------------------------------------------------------------

/**
 * Raised when any trigger fires and initiates a new execution.
 * This is the universal trigger acknowledgement event.
 *
 * Downstream consumers:
 *   - Audit log
 *   - Analytics (trigger frequency metrics)
 *   - Rate limiter
 */
export class AutomationTriggered {
  public readonly occurredAt: Date = new Date();

  constructor(
    public readonly executionId: string,
    public readonly orchestrationId: OrchestrationId,
    public readonly tenantId: string,
    public readonly triggerType: TriggerType,
    public readonly triggerId: string,
    /** Raw payload that arrived with the trigger. */
    public readonly triggerPayload: Readonly<Record<string, unknown>>,
    public readonly correlationId: string,
  ) {}
}

// ---------------------------------------------------------------------------
// Checkpoint Events
// ---------------------------------------------------------------------------

/**
 * Raised each time an execution checkpoint is captured.
 *
 * Downstream consumers:
 *   - Checkpoint persistence (CheckpointService)
 *   - Monitoring (checkpoint frequency, checkpoint size metrics)
 */
export class AutomationCheckpointReached {
  public readonly occurredAt: Date = new Date();

  constructor(
    public readonly executionId: string,
    public readonly orchestrationId: OrchestrationId,
    public readonly tenantId: string,
    public readonly checkpointId: string,
    public readonly completedStepId: string,
    public readonly pendingStepCount: number,
    public readonly traceId: ExecutionTraceId,
  ) {}
}

// ---------------------------------------------------------------------------
// Compensation Events
// ---------------------------------------------------------------------------

/**
 * Raised when the saga compensation flow is initiated for a failed execution.
 *
 * Downstream consumers:
 *   - RuntimeService (starts compensating each step in reverse order)
 *   - Audit log
 *   - Alert manager
 */
export class AutomationCompensated {
  public readonly occurredAt: Date = new Date();

  constructor(
    public readonly executionId: string,
    public readonly orchestrationId: OrchestrationId,
    public readonly tenantId: string,
    public readonly compensatedStepCount: number,
    public readonly finalStatus: OrchestrationExecutionStatus,
    public readonly traceId: ExecutionTraceId,
  ) {}
}

// ---------------------------------------------------------------------------
// Template Events
// ---------------------------------------------------------------------------

/**
 * Raised when a new automation template is registered in the catalog.
 */
export class AutomationTemplateCreated {
  public readonly occurredAt: Date = new Date();

  constructor(
    public readonly templateId: AutomationTemplateId,
    public readonly tenantId: string | null,
    public readonly name: string,
    public readonly createdBy: string,
  ) {}
}

/**
 * Raised when an automation template is instantiated into a new orchestration.
 */
export class AutomationTemplateInstantiated {
  public readonly occurredAt: Date = new Date();

  constructor(
    public readonly templateId: AutomationTemplateId,
    public readonly orchestrationId: OrchestrationId,
    public readonly tenantId: string,
    public readonly instantiatedBy: string,
  ) {}
}
