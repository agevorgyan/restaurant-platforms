/**
 * Enterprise AI Agent Platform - Agent Aggregate Root
 *
 * Manages autonomous goal decomposition, step-by-step execution, human approval gates,
 * working/session memory references, execution checkpoints, and saga recovery.
 */

import { AgentType, AgentStatus, StepStatus } from '../enums/agent.enums';
import {
  AgentId,
  GoalId,
  ExecutionPlan,
  ExecutionStep,
  ReasoningTrace,
  ApprovalRequest,
  ExecutionCheckpoint,
  ExecutionResult,
} from '../value-objects/agent-vo';
import { BaseDomainEvent } from '../events/ai.events';
import {
  AgentCreatedEvent,
  GoalReceivedEvent,
  PlanGeneratedEvent,
  ExecutionStartedEvent,
  StepCompletedEvent,
  ApprovalRequestedEvent,
  ApprovalGrantedEvent,
  ExecutionRecoveredEvent,
  AgentCompletedEvent,
} from '../events/agent.events';
import { HumanApprovalRequiredException } from '../exceptions/agent.exceptions';

export interface AgentAggregateProps {
  id: AgentId;
  tenantId: string;
  name: string;
  agentType: AgentType;
  status: AgentStatus;
  currentGoalId?: GoalId;
  goalDescription?: string;
  executionPlan?: ExecutionPlan;
  reasoningTraces: ReasoningTrace[];
  pendingApproval?: ApprovalRequest;
  checkpoints: ExecutionCheckpoint[];
  currentStepIndex: number;
  workingMemory: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export class AgentAggregate {
  private domainEvents: BaseDomainEvent[] = [];

  private constructor(private props: AgentAggregateProps) {}

  public static create(params: {
    id?: AgentId;
    tenantId?: string;
    name: string;
    agentType?: AgentType;
  }): AgentAggregate {
    const id = params.id || AgentId.generate();
    const tenantId = params.tenantId || 'tenant-default';
    const agentType = params.agentType || AgentType.RESTAURANT_ASSISTANT;

    const now = new Date();
    const aggregate = new AgentAggregate({
      id,
      tenantId,
      name: params.name,
      agentType,
      status: AgentStatus.READY,
      reasoningTraces: [],
      checkpoints: [],
      currentStepIndex: 0,
      workingMemory: {},
      createdAt: now,
      updatedAt: now,
    });

    aggregate.addDomainEvent(
      new AgentCreatedEvent(id.getValue(), tenantId, params.name, agentType, now)
    );

    return aggregate;
  }

  // --- Getters ---
  public getId(): AgentId { return this.props.id; }
  public getTenantId(): string { return this.props.tenantId; }
  public getName(): string { return this.props.name; }
  public getAgentType(): AgentType { return this.props.agentType; }
  public getStatus(): AgentStatus { return this.props.status; }
  public getCurrentGoalId(): GoalId | undefined { return this.props.currentGoalId; }
  public getGoalDescription(): string | undefined { return this.props.goalDescription; }
  public getExecutionPlan(): ExecutionPlan | undefined { return this.props.executionPlan; }
  public getReasoningTraces(): ReasoningTrace[] { return [...this.props.reasoningTraces]; }
  public getPendingApproval(): ApprovalRequest | undefined { return this.props.pendingApproval; }
  public getCheckpoints(): ExecutionCheckpoint[] { return [...this.props.checkpoints]; }
  public getCurrentStepIndex(): number { return this.props.currentStepIndex; }
  public getWorkingMemory(): Record<string, unknown> { return { ...this.props.workingMemory }; }
  public getCreatedAt(): Date { return this.props.createdAt; }
  public getUpdatedAt(): Date { return this.props.updatedAt; }

  public getUncommittedEvents(): BaseDomainEvent[] { return [...this.domainEvents]; }
  public clearEvents(): void { this.domainEvents = []; }

  private addDomainEvent(event: BaseDomainEvent): void { this.domainEvents.push(event); }

  public assignGoal(goalDescription: string, plan: ExecutionPlan): GoalId {
    const goalId = GoalId.generate();
    const now = new Date();

    this.props.currentGoalId = goalId;
    this.props.goalDescription = goalDescription;
    this.props.executionPlan = plan;
    this.props.status = AgentStatus.READY;
    this.props.currentStepIndex = 0;
    this.props.updatedAt = now;

    this.addDomainEvent(
      new GoalReceivedEvent(this.getId().getValue(), this.getTenantId(), goalId.getValue(), goalDescription, now)
    );

    this.addDomainEvent(
      new PlanGeneratedEvent(this.getId().getValue(), this.getTenantId(), plan.steps.length, now)
    );

    return goalId;
  }

  public recordReasoning(thoughtProcess: string, rationale: string, confidence: number = 0.95): void {
    const trace = ReasoningTrace.create(thoughtProcess, rationale, confidence);
    this.props.reasoningTraces.push(trace);
    this.props.updatedAt = new Date();
  }

  public executeNextStep(): { step: ExecutionStep | null; completed: boolean } {
    if (!this.props.executionPlan) return { step: null, completed: true };

    const steps = this.props.executionPlan.steps;
    if (this.props.currentStepIndex >= steps.length) {
      this.markCompleted('All planned goal steps executed successfully.');
      return { step: null, completed: true };
    }

    const currentStep = steps[this.props.currentStepIndex];

    // Check Human Approval Gate
    if (currentStep.requiresApproval && (!this.props.pendingApproval || !this.props.pendingApproval.isApproved)) {
      const approvalReq = ApprovalRequest.create(currentStep.stepId, currentStep.actionName, 'HIGH');
      this.props.pendingApproval = approvalReq;
      this.props.status = AgentStatus.WAITING_APPROVAL;
      this.props.updatedAt = new Date();

      this.addDomainEvent(
        new ApprovalRequestedEvent(
          this.getId().getValue(),
          this.getTenantId(),
          approvalReq.requestId,
          currentStep.actionName,
          'HIGH',
          new Date()
        )
      );

      throw new HumanApprovalRequiredException(currentStep.stepId, currentStep.actionName, 'HIGH');
    }

    this.props.status = AgentStatus.RUNNING;
    currentStep.status = StepStatus.RUNNING;
    this.props.updatedAt = new Date();

    return { step: currentStep, completed: false };
  }

  public completeStep(stepId: string, outputResult: unknown): void {
    if (!this.props.executionPlan) return;

    const step = this.props.executionPlan.steps.find(s => s.stepId === stepId);
    if (step) {
      step.status = StepStatus.COMPLETED;
      step.result = outputResult;
    }

    this.props.workingMemory[`step_${this.props.currentStepIndex}`] = outputResult;
    this.props.currentStepIndex++;

    // Write Execution Checkpoint
    const checkpoint = ExecutionCheckpoint.create(this.props.currentStepIndex, this.props.workingMemory);
    this.props.checkpoints.push(checkpoint);
    this.props.updatedAt = new Date();

    this.addDomainEvent(
      new StepCompletedEvent(this.getId().getValue(), this.getTenantId(), stepId, step?.actionName || 'action', new Date())
    );
  }

  public grantApproval(approvedBy: string): void {
    if (!this.props.pendingApproval) return;

    this.props.pendingApproval.isApproved = true;
    this.props.pendingApproval.approvedBy = approvedBy;
    this.props.status = AgentStatus.READY;
    this.props.updatedAt = new Date();

    this.addDomainEvent(
      new ApprovalGrantedEvent(
        this.getId().getValue(),
        this.getTenantId(),
        this.props.pendingApproval.requestId,
        approvedBy,
        new Date()
      )
    );
  }

  public pause(): void {
    this.props.status = AgentStatus.PAUSED;
    this.props.updatedAt = new Date();
  }

  public resume(): void {
    const lastCheckpoint = this.props.checkpoints[this.props.checkpoints.length - 1];
    if (lastCheckpoint) {
      this.props.currentStepIndex = lastCheckpoint.completedStepIndex;
      this.props.workingMemory = { ...lastCheckpoint.serializedState };

      this.addDomainEvent(
        new ExecutionRecoveredEvent(this.getId().getValue(), this.getTenantId(), lastCheckpoint.checkpointId, new Date())
      );
    }
    this.props.status = AgentStatus.READY;
    this.props.updatedAt = new Date();
  }

  public markCompleted(summary: string): void {
    const now = new Date();
    this.props.status = AgentStatus.COMPLETED;
    this.props.updatedAt = now;

    this.addDomainEvent(
      new AgentCompletedEvent(this.getId().getValue(), this.getTenantId(), AgentStatus.COMPLETED, summary, now)
    );
  }
}
