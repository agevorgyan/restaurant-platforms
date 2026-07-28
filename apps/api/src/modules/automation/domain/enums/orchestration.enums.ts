/**
 * Automation Orchestration Platform — Domain Enumerations
 *
 * Defines the finite state machines, classification types, and mode constants
 * used across the Orchestration aggregate, execution runtime, and trigger system.
 *
 * No framework dependencies. No I/O. Fully unit-testable.
 */

// ---------------------------------------------------------------------------
// OrchestrationStatus — Aggregate lifecycle state machine
// ---------------------------------------------------------------------------

/**
 * Represents the complete lifecycle of an Orchestration definition.
 *
 * Valid transitions:
 *   Draft       → Published  (via publish())
 *   Published   → Running    (via execute())
 *   Running     → Paused     (via pause())
 *   Running     → Completed  (terminal — all steps succeeded)
 *   Running     → Failed     (terminal — unrecoverable error)
 *   Running     → Cancelled  (via cancel())
 *   Running     → Compensating (saga rollback initiated)
 *   Paused      → Running    (via resume())
 *   Compensating → Cancelled (compensation complete)
 */
export enum OrchestrationStatus {
  Draft = 'Draft',
  Published = 'Published',
  Running = 'Running',
  Paused = 'Paused',
  Completed = 'Completed',
  Cancelled = 'Cancelled',
  Failed = 'Failed',
  Compensating = 'Compensating',
}

// ---------------------------------------------------------------------------
// ExecutionMode — How steps in the execution graph are advanced
// ---------------------------------------------------------------------------

/**
 * Controls the traversal strategy applied by the RuntimeService
 * when advancing through the ExecutionGraph DAG.
 *
 * Sequential  — Steps execute one after another in topological order.
 * Parallel    — Independent graph nodes execute concurrently (fan-out).
 * Conditional — The next node is chosen at runtime based on step output.
 * Dynamic     — New steps may be injected at runtime (AI-driven planning).
 * Hybrid      — Mixed: some branches parallel, some conditional.
 */
export enum ExecutionMode {
  Sequential = 'Sequential',
  Parallel = 'Parallel',
  Conditional = 'Conditional',
  Dynamic = 'Dynamic',
  Hybrid = 'Hybrid',
}

// ---------------------------------------------------------------------------
// TriggerType — What initiates an orchestration execution
// ---------------------------------------------------------------------------

/**
 * Classifies the origin of an execution trigger.
 *
 * Schedule         — A cron/one-time schedule fired (Scheduler Platform).
 * DomainEvent      — A domain event was published (Event Platform).
 * IntegrationEvent — An external system emitted an integration event.
 * ApiRequest       — Direct REST API call to /execute.
 * Webhook          — Inbound webhook from a third-party platform.
 * ManualTrigger    — Operator manually initiated (dashboard UI).
 * RuleResult       — A Business Rule fired and dispatched an action.
 * AiDecision       — An AI agent's decision triggered the orchestration.
 */
export enum TriggerType {
  Schedule = 'Schedule',
  DomainEvent = 'DomainEvent',
  IntegrationEvent = 'IntegrationEvent',
  ApiRequest = 'ApiRequest',
  Webhook = 'Webhook',
  ManualTrigger = 'ManualTrigger',
  RuleResult = 'RuleResult',
  AiDecision = 'AiDecision',
}

// ---------------------------------------------------------------------------
// OrchestrationStepType — Which platform a step delegates to
// ---------------------------------------------------------------------------

/**
 * Declares which downstream platform the RuntimeService should invoke
 * when executing a particular step in the DAG.
 *
 * WorkflowStep           — Delegates to the Workflow Engine.
 * RuleStep               — Delegates to the Business Rules Engine.
 * EventStep              — Delegates to the Event Processing Platform.
 * ScheduleStep           — Delegates to the Scheduler Platform.
 * NotificationStep       — Delegates to the Notification Platform.
 * IntegrationStep        — Delegates to an Integration adapter.
 * AiStep                 — Delegates to the AI Orchestration layer.
 * NestedOrchestrationStep— Launches a child Orchestration (recursive DAG).
 */
export enum OrchestrationStepType {
  WorkflowStep = 'WorkflowStep',
  RuleStep = 'RuleStep',
  EventStep = 'EventStep',
  ScheduleStep = 'ScheduleStep',
  NotificationStep = 'NotificationStep',
  IntegrationStep = 'IntegrationStep',
  AiStep = 'AiStep',
  NestedOrchestrationStep = 'NestedOrchestrationStep',
}

// ---------------------------------------------------------------------------
// OrchestrationExecutionStatus — Per-execution instance state
// ---------------------------------------------------------------------------

/**
 * Tracks the state of a single OrchestrationExecution.
 * Separate from OrchestrationStatus to allow multiple concurrent
 * executions of the same Published orchestration definition.
 */
export enum OrchestrationExecutionStatus {
  Pending = 'Pending',
  Running = 'Running',
  Paused = 'Paused',
  Completed = 'Completed',
  Failed = 'Failed',
  Cancelled = 'Cancelled',
  Compensating = 'Compensating',
  Compensated = 'Compensated',
  TimedOut = 'TimedOut',
}

// ---------------------------------------------------------------------------
// StepExecutionStatus — Status of a single step within an execution
// ---------------------------------------------------------------------------

/**
 * Granular status for each node traversal within the execution DAG.
 */
export enum StepExecutionStatus {
  Pending = 'Pending',
  Running = 'Running',
  Completed = 'Completed',
  Skipped = 'Skipped',
  Failed = 'Failed',
  Retrying = 'Retrying',
  Compensating = 'Compensating',
  Compensated = 'Compensated',
  WaitingForEvent = 'WaitingForEvent',
  WaitingForApproval = 'WaitingForApproval',
}

// ---------------------------------------------------------------------------
// CompensationStrategy — How saga rollback is applied
// ---------------------------------------------------------------------------

/**
 * Defines the rollback strategy for a step in the saga compensation flow.
 *
 * Backward  — Steps are compensated in reverse topological order (most common).
 * Forward   — Retries until success (for idempotent steps that cannot roll back).
 * Parallel  — All compensations execute concurrently.
 * Manual    — An operator must manually intervene.
 */
export enum CompensationStrategy {
  Backward = 'Backward',
  Forward = 'Forward',
  Parallel = 'Parallel',
  Manual = 'Manual',
}

// ---------------------------------------------------------------------------
// TemplateCategory — Classification for the automation template catalog
// ---------------------------------------------------------------------------

/**
 * Groups automation templates for discoverability in the catalog UI.
 */
export enum TemplateCategory {
  OrderManagement = 'OrderManagement',
  InventoryControl = 'InventoryControl',
  CustomerEngagement = 'CustomerEngagement',
  KitchenOperations = 'KitchenOperations',
  FinanceAndAccounting = 'FinanceAndAccounting',
  HumanResources = 'HumanResources',
  Marketing = 'Marketing',
  Compliance = 'Compliance',
  Reporting = 'Reporting',
  Custom = 'Custom',
}
