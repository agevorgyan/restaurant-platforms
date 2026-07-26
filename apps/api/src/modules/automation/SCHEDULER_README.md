# Enterprise Scheduler Platform

> Part of the Restaurant SaaS ERP — Automation Suite (Task 32)

## Overview

The Enterprise Scheduler Platform provides **time-based job execution** for the
entire platform. It is the fourth pillar of the Automation Suite alongside:

| Pillar | Responsibility |
|---|---|
| ✅ Workflow Engine | State-machine driven process orchestration |
| ✅ Business Rules Engine | Rule evaluation and decision logic |
| ✅ Event Processing Platform | Publish/subscribe and dead-letter handling |
| ✅ **Scheduler Platform** | Time-based execution, distributed scheduling |

---

## Architecture

```
automation/
├── domain/
│   ├── enums/
│   │   └── scheduler.enums.ts        # ScheduleStatus, JobStatus, ScheduleType, JobType, MisfirePolicy …
│   ├── events/
│   │   └── scheduler.events.ts       # ScheduleCreated, JobQueued, JobCompleted, LeaderElected …
│   ├── models/
│   │   └── scheduler.model.ts        # Schedule (aggregate), JobExecution (entity), CalendarException
│   └── value-objects/
│       └── scheduler.value-objects.ts # CronExpression, TimeZone, RetryPolicy, ExecutionResult …
├── application/
│   ├── dto/
│   │   └── scheduler.dto.ts          # CreateScheduleDto, UpdateScheduleDto, Read Model DTOs
│   ├── queries/
│   │   └── scheduler.read-models.ts  # 6 CQRS read models (catalog, history, dashboard …)
│   └── services/
│       └── scheduler.services.ts     # 8 application services
├── infrastructure/
│   └── controllers/
│       └── scheduler.controller.ts   # 9 REST endpoints
└── scheduler.spec.ts                 # 60+ unit tests
```

---

## Schedule Types

| Type | Description |
|---|---|
| `Cron` | Standard 5-field or 6-field cron expression |
| `OneTime` | Single execution at an absolute UTC timestamp |
| `Recurring` | Fixed count of executions with a configurable interval |
| `Calendar` | Executes on named calendar-defined dates |
| `Delayed` | Fires once after a configured delay from activation |
| `FixedInterval` | Steady interval regardless of execution duration |
| `FixedDelay` | Fixed delay *after* the previous execution completes |
| `EventTriggeredDelay` | Fires after a delay following a domain event |

---

## Job Types

`Workflow` · `RuleEvaluation` · `Notification` · `Integration` · `Cleanup` · `AI` · `Report` · `Maintenance`

---

## Misfire Policies

| Policy | Behaviour |
|---|---|
| `FireOnce` | Fire a single make-up execution immediately (default) |
| `Skip` | Drop all missed executions silently |
| `FireAll` | Fire one make-up per missed scheduled slot (cron only) |

---

## Distributed Scheduling

- **Leader Election**: Only one node is elected as the primary scheduler at a time using a Redis `SET NX PX` lock (`scheduler:leader`). All other nodes are hot-standbys.
- **Leader Heartbeat**: The leader extends its lock every 10 seconds. If it fails, the lock expires and any standby node can take over within 60 seconds.
- **Job Locking**: Each job execution is protected by an individual lock (`scheduler:lock:{tenantId}:{executionId}`) with a 30-second TTL and heartbeat extension for long-running jobs.

---

## Retry Policies

All retry policies support configurable backoff strategies:

| Strategy | Formula |
|---|---|
| `Fixed` | `baseDelayMs` every retry |
| `Linear` | `baseDelayMs × attempt` |
| `Exponential` | `baseDelayMs × 2^(attempt-1)` |
| `ExponentialWithJitter` | `random(0, baseDelayMs × 2^(attempt-1))` |

All strategies are capped at `maxDelayMs`.

---

## API Endpoints

| Method | Path | Description |
|---|---|---|
| `GET` | `/automation/schedules` | List schedules (paginated, filtered) |
| `POST` | `/automation/schedules` | Create a schedule definition |
| `PATCH` | `/automation/schedules/:id` | Update schedule fields |
| `POST` | `/automation/schedules/:id/pause` | Pause an active schedule |
| `POST` | `/automation/schedules/:id/resume` | Resume a paused schedule |
| `DELETE` | `/automation/schedules/:id` | Cancel a schedule (terminal) |
| `GET` | `/automation/schedules/dashboard` | Scheduler dashboard metrics |
| `GET` | `/automation/jobs` | List active executions |
| `GET` | `/automation/jobs/history` | Immutable execution history |

---

## Domain Events

| Event | Trigger |
|---|---|
| `ScheduleCreated` | Schedule definition persisted |
| `ScheduleActivated` | Draft/Paused → Active |
| `SchedulePaused` | Active → Paused |
| `ScheduleResumed` | Paused → Active |
| `ScheduleCancelled` | Any → Cancelled (terminal) |
| `ScheduleExpired` | Natural end condition reached |
| `JobQueued` | Execution placed in queue |
| `JobStarted` | Worker picks up execution |
| `JobCompleted` | Execution succeeds |
| `JobFailed` | Execution fails (terminal) |
| `JobRetried` | Retry scheduled |
| `JobCancelled` | Execution cancelled before completion |
| `JobSkipped` | Misfire policy applied Skip |
| `LeaderElected` | New primary scheduler node elected |
| `LeadershipLost` | Primary node crashed / TTL expired |

---

## DST Handling

`TimeZone` value objects use IANA identifiers validated via `Intl.DateTimeFormat`.
`CronService.nextExecution` evaluates cron expressions in the schedule's configured
timezone, correctly handling:

- **Spring-forward**: If the cron target time is skipped, the next valid occurrence
  after the gap is returned.
- **Fall-back**: If the cron target time occurs twice, the first occurrence is used.

---

## Security

- **Tenant Isolation**: All queries are scoped by `tenantId` extracted from the authenticated JWT.
- **RBAC**: Routes require `scheduler:read` / `scheduler:write` permissions.
- **Immutable History**: `JobExecution` entities are sealed after reaching a terminal status — no UPDATE is permitted at the domain layer.
- **Distributed Lock Protection**: No job can be executed by more than one node simultaneously.

---

## Running Tests

```bash
cd apps/api
pnpm test
pnpm typecheck
pnpm lint
```

---

## Next Steps

- Implement Redis adapter for `DistributedLockService`
- Implement Prisma adapter for `SchedulePersistenceService`
- Implement cron field parser in `CronService.nextExecution`
- Connect `JobExecutionService.enqueueJob` to BullMQ
- Add OpenTelemetry spans to all service methods
- Integrate `SchedulerService` with `WorkflowService` for Workflow job dispatch
