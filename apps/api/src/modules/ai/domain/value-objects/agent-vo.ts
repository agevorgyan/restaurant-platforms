/**
 * Enterprise AI Agent Platform - Domain Value Objects
 */

import { randomUUID } from 'crypto';
import { MemoryType, StepStatus } from '../enums/agent.enums';
import { AgentDomainException } from '../exceptions/agent.exceptions';

export class AgentId {
  private constructor(private readonly value: string) {}

  public static create(value: string): AgentId {
    if (!value || typeof value !== 'string' || value.trim().length === 0) {
      throw new AgentDomainException('AgentId cannot be empty');
    }
    return new AgentId(value.trim());
  }

  public static generate(): AgentId {
    return new AgentId(randomUUID());
  }

  public getValue(): string {
    return this.value;
  }
}

export class GoalId {
  private constructor(private readonly value: string) {}

  public static create(value: string): GoalId {
    if (!value || typeof value !== 'string' || value.trim().length === 0) {
      throw new AgentDomainException('GoalId cannot be empty');
    }
    return new GoalId(value.trim());
  }

  public static generate(): GoalId {
    return new GoalId(randomUUID());
  }

  public getValue(): string {
    return this.value;
  }
}

export class TaskId {
  private constructor(private readonly value: string) {}

  public static create(value: string): TaskId {
    if (!value || typeof value !== 'string' || value.trim().length === 0) {
      throw new AgentDomainException('TaskId cannot be empty');
    }
    return new TaskId(value.trim());
  }

  public static generate(): TaskId {
    return new TaskId(randomUUID());
  }

  public getValue(): string {
    return this.value;
  }
}

export class ReasoningTrace {
  constructor(
    public readonly thoughtProcess: string,
    public readonly rationale: string,
    public readonly confidenceScore: number = 0.95,
    public readonly timestamp: Date = new Date()
  ) {}

  public static create(thoughtProcess: string, rationale: string, confidence: number = 0.95): ReasoningTrace {
    return new ReasoningTrace(thoughtProcess, rationale, confidence, new Date());
  }
}

export class ExecutionStep {
  constructor(
    public readonly stepId: string,
    public readonly actionName: string,
    public readonly parameters: Record<string, unknown>,
    public readonly requiresApproval: boolean = false,
    public status: StepStatus = StepStatus.PENDING,
    public result?: unknown
  ) {}

  public static create(actionName: string, parameters: Record<string, unknown> = {}, requiresApproval: boolean = false): ExecutionStep {
    return new ExecutionStep(randomUUID(), actionName, parameters, requiresApproval, StepStatus.PENDING);
  }
}

export class ExecutionPlan {
  constructor(
    public readonly goalSummary: string,
    public readonly steps: ExecutionStep[],
    public readonly estimatedDurationMs: number = 5000
  ) {}

  public static create(goalSummary: string, steps: ExecutionStep[]): ExecutionPlan {
    return new ExecutionPlan(goalSummary, steps, steps.length * 1000);
  }
}

export class MemoryReference {
  constructor(
    public readonly memoryType: MemoryType,
    public readonly key: string,
    public readonly value: unknown
  ) {}

  public static create(memoryType: MemoryType, key: string, value: unknown): MemoryReference {
    return new MemoryReference(memoryType, key, value);
  }
}

export class ApprovalRequest {
  constructor(
    public readonly requestId: string,
    public readonly taskId: string,
    public readonly actionName: string,
    public readonly riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL',
    public readonly requestedBy: string,
    public isApproved: boolean = false,
    public approvedBy?: string
  ) {}

  public static create(taskId: string, actionName: string, riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'HIGH', requestedBy: string = 'agent-system'): ApprovalRequest {
    return new ApprovalRequest(randomUUID(), taskId, actionName, riskLevel, requestedBy);
  }
}

export class ExecutionCheckpoint {
  constructor(
    public readonly checkpointId: string,
    public readonly completedStepIndex: number,
    public readonly serializedState: Record<string, unknown>,
    public readonly timestamp: Date = new Date()
  ) {}

  public static create(completedStepIndex: number, state: Record<string, unknown>): ExecutionCheckpoint {
    return new ExecutionCheckpoint(randomUUID(), completedStepIndex, state, new Date());
  }
}

export class ExecutionResult {
  constructor(
    public readonly status: string,
    public readonly finalOutput: string,
    public readonly stepsExecutedCount: number,
    public readonly durationMs: number
  ) {}

  public static create(status: string, finalOutput: string, stepsCount: number, durationMs: number): ExecutionResult {
    return new ExecutionResult(status, finalOutput, stepsCount, durationMs);
  }
}
