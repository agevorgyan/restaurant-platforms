# Enterprise Automation Orchestration Platform

**Module:** `automation` — Orchestration sub-system  
**Layer:** Application Coordination (owns no business logic)  
**Status:** Production-grade  

---

## Overview

The Automation Orchestration Platform is a **pure coordinator** that unifies the four existing automation platforms — Workflow Engine, Business Rules Engine, Event Processing Platform, and Scheduler Platform — into a single programmable runtime.

It owns **orchestration logic only**. Business rules, workflow definitions, event routing, and scheduling remain the responsibility of their respective platforms.

```
  [API / Webhook / Event Bus / AI / Schedule]
                    ↓ trigger
  ┌────────────────────────────────────────────┐
  │     Automation Orchestration Platform       │
  │                                             │
  │   DAG Runtime · Checkpoints · Sagas         │
  │   Templates · Triggers · Correlation        │
  └────┬──────────┬────────┬──────────┬────────┘
       ↓          ↓        ↓          ↓
   Workflow    Rules    Events    Scheduler
   Engine      Engine  Platform  Platform
```

---

## Architecture

### Hexagonal Architecture (Ports & Adapters)

```
domain/
  enums/orchestration.enums.ts          — OrchestrationStatus, ExecutionMode,
                                           TriggerType, OrchestrationStepType, ...
  value-objects/orchestration.value-objects.ts
                                        — OrchestrationId, ExecutionGraph (DAG),
                                           TriggerDefinition, ExecutionContext,
                                           ExecutionCheckpoint, ...
  models/orchestration.model.ts         — Orchestration (Aggregate Root),
                                           OrchestrationExecution (Entity),
                                           AutomationTemplate (Entity)
  events/orchestration.events.ts        — 9 domain events

application/
  services/orchestration.services.ts    — 8 application services
  dto/orchestration.dto.ts              — All command + query DTOs
  queries/orchestration.queries.ts      — CQRS read-model queries

infrastructure/
  controllers/orchestration.controller.ts — REST API (14 endpoints)
```

---

## Orchestration Types

| Type | Description |
|------|-------------|
| **Workflow Orchestration** | Coordinates Workflow Engine instances |
| **Event Orchestration** | Reacts to domain/integration events |
| **Schedule Orchestration** | Triggered by cron/one-time schedules |
| **Rule Orchestration** | Triggered by Business Rule outcomes |
| **Notification Orchestration** | Coordinates notification flows |
| **Integration Orchestration** | Coordinates external system calls |
| **AI Orchestration** | Coordinates AI agent decisions |
| **Composite Orchestration** | Nested orchestrations (sub-graphs) |

---

## Trigger Types

| Trigger | Description |
|---------|-------------|
| `Schedule` | Fires when a Scheduler Platform job completes |
| `DomainEvent` | Fires on any domain event topic |
| `IntegrationEvent` | Fires on external integration event |
| `ApiRequest` | Direct POST /execute call |
| `Webhook` | Inbound webhook from third-party |
| `ManualTrigger` | Operator-initiated from dashboard |
| `RuleResult` | Business rule fired an outcome |
| `AiDecision` | AI agent returned a decision |

---

## Execution Graph (DAG)

Orchestrations use a **Directed Acyclic Graph** for step ordering.

The `ExecutionGraph` value object provides:
- `hasCycle()` — DFS-based cycle detection (O(V+E))
- `topologicalSort()` — Kahn's algorithm for sequential ordering
- `resolveParallelGroups()` — Groups of concurrently executable steps
- `getSuccessors(stepId)` — Used during execution advancement
- `getRootSteps()` — Entry points (nodes with no inbound edges)

Cycle detection runs on:
1. Draft creation (`ExecutionGraphService.validate()`)
2. Pre-publish validation (`ExecutionGraphService.validateForPublish()`)

---

## Execution Modes

| Mode | Behaviour |
|------|-----------|
| `Sequential` | Topological order, one step at a time |
| `Parallel` | Parallel groups fan out concurrently |
| `Conditional` | Next node chosen from step output at runtime |
| `Dynamic` | New steps may be injected by AI agents |
| `Hybrid` | Mixed sequential, parallel, and conditional |

---

## Execution Lifecycle

```
Pending → Running → Paused ↔ Running → Completed (terminal)
                                     → Failed     (terminal)
                                     → Cancelled  (terminal)
                                     → Compensating → Compensated
```

---

## Execution Checkpoints (Pause / Resume)

Every step boundary captures an `ExecutionCheckpoint`:
- `checkpointId` — unique ID
- `completedStepId` — the step just completed
- `pendingStepIds` — next steps to execute
- `variables` — full variable snapshot
- `checksum` — HMAC-SHA256 integrity hash

On resume, `CheckpointService.validateConsistency()` verifies the checksum before restoring state.

---

## Saga Compensation

When an execution fails, the compensation flow is initiated based on `CompensationStrategy`:

| Strategy | Behaviour |
|----------|-----------|
| `Backward` | Steps rolled back in reverse topological order |
| `Forward` | Retries until success (idempotent steps) |
| `Parallel` | All compensations execute concurrently |
| `Manual` | Operator must intervene |

---

## Domain Services

| Service | Responsibility |
|---------|---------------|
| `OrchestrationService` | CRUD, publish, versioning |
| `RuntimeService` | Execute, pause, resume, compensate, DAG advancement |
| `ExecutionGraphService` | Build graph, cycle detection, topological sort, graph view |
| `TriggerService` | Register/deregister triggers per orchestration |
| `TemplateService` | Template CRUD, parameter validation, instantiation |
| `CheckpointService` | Capture, persist, validate checkpoints |
| `OrchestrationCorrelationService` | Cross-platform causation tracking |
| `ExecutionPersistenceService` | Storage port (PostgreSQL/Prisma adapter) |

---

## Domain Events

| Event | When |
|-------|------|
| `OrchestrationCreated` | New definition persisted in Draft |
| `OrchestrationPublished` | Definition sealed and published |
| `OrchestrationStarted` | Execution transitioned to Running |
| `OrchestrationPaused` | Execution suspended with checkpoint |
| `OrchestrationCompleted` | All steps completed successfully |
| `OrchestrationFailed` | Terminal failure |
| `AutomationTriggered` | Any trigger fired and initiated execution |
| `AutomationCheckpointReached` | Step boundary checkpoint captured |
| `AutomationCompensated` | Saga compensation flow initiated |

---

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/automation/orchestrations` | List orchestrations |
| `POST` | `/automation/orchestrations` | Create orchestration |
| `PATCH` | `/automation/orchestrations/:id` | Update Draft orchestration |
| `POST` | `/automation/orchestrations/:id/publish` | Publish orchestration |
| `POST` | `/automation/orchestrations/:id/execute` | Execute orchestration |
| `POST` | `/automation/orchestrations/:id/pause` | Pause execution |
| `POST` | `/automation/orchestrations/:id/resume` | Resume execution |
| `GET` | `/automation/orchestrations/statistics` | Platform statistics |
| `GET` | `/automation/orchestrations/:id/graph` | Execution graph DAG view |
| `GET` | `/automation/executions` | List executions |
| `GET` | `/automation/executions/:id/timeline` | Execution timeline |
| `GET` | `/automation/templates` | List template catalog |
| `POST` | `/automation/templates` | Create template |
| `POST` | `/automation/templates/:id/instantiate` | Instantiate template |

---

## Validation Rules

| Rule | Enforced In |
|------|-------------|
| Graph must be acyclic | `ExecutionGraphService.validate()` |
| At least one step required | `OrchestrationDefinition` constructor |
| At least one trigger required | `ExecutionGraphService.validateForPublish()` |
| Published definition is immutable | `Orchestration.isSealed` guard |
| Version monotonically increasing | `OrchestrationVersion` value object |
| Checkpoint integrity | `CheckpointService.validateConsistency()` |
| Template required params | `TemplateService.validateParams()` |
| Trigger config completeness | `TriggerService.validateTrigger()` |

---

## Security

| Control | Implementation |
|---------|---------------|
| Tenant isolation | `tenantId` on every aggregate + persistence filter |
| RBAC | `@Roles()` decorator on controller endpoints |
| Audit | Domain events on every state transition |
| Immutable definitions | `Orchestration.isSealed` enforces publish immutability |
| Signed checkpoints | HMAC-SHA256 checksum on `ExecutionCheckpoint` |

---

## Observability

| Metric | Source |
|--------|--------|
| Execution latency | `OrchestrationExecution.durationMs` |
| Template usage | `AutomationTemplate._usageCount` |
| Checkpoint frequency | `AutomationCheckpointReached` events |
| Failure rate | `OrchestrationFailed` events |
| Trigger frequency | `AutomationTriggered` events |
| Distributed trace | `ExecutionTraceId` threaded through all platform calls |

---

## Read Models (CQRS)

| Read Model | Query |
|------------|-------|
| `AutomationCatalog` | `GetAutomationCatalogQuery` |
| `AutomationExecutions` | `GetAutomationExecutionsQuery` |
| `ExecutionGraphView` | `GetExecutionGraphQuery` |
| `AutomationTemplates` | `GetAutomationTemplatesQuery` |
| `ExecutionTimeline` | `GetExecutionTimelineQuery` |
| `AutomationStatistics` | `GetAutomationStatisticsQuery` |

---

## Next: Task 32.6 — Enterprise Low-Code Automation Platform

Builds on this orchestration platform with a visual drag-and-drop editor, low-code trigger configuration, and pre-built recipe library.
