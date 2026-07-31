/**
 * Enterprise AI Agent Platform - Domain Events
 */

import { randomUUID } from 'crypto';
import { BaseDomainEvent } from './ai.events';
import { AgentType, AgentStatus } from '../enums/agent.enums';

export class AgentCreatedEvent implements BaseDomainEvent {
  public readonly eventId: string = randomUUID();
  public readonly eventName: string = 'AgentCreated';

  constructor(
    public readonly aggregateId: string,
    public readonly tenantId: string,
    public readonly name: string,
    public readonly agentType: AgentType,
    public readonly timestamp: Date = new Date()
  ) {}
}

export class GoalReceivedEvent implements BaseDomainEvent {
  public readonly eventId: string = randomUUID();
  public readonly eventName: string = 'GoalReceived';

  constructor(
    public readonly aggregateId: string,
    public readonly tenantId: string,
    public readonly goalId: string,
    public readonly goalDescription: string,
    public readonly timestamp: Date = new Date()
  ) {}
}

export class PlanGeneratedEvent implements BaseDomainEvent {
  public readonly eventId: string = randomUUID();
  public readonly eventName: string = 'PlanGenerated';

  constructor(
    public readonly aggregateId: string,
    public readonly tenantId: string,
    public readonly stepsCount: number,
    public readonly timestamp: Date = new Date()
  ) {}
}

export class ExecutionStartedEvent implements BaseDomainEvent {
  public readonly eventId: string = randomUUID();
  public readonly eventName: string = 'ExecutionStarted';

  constructor(
    public readonly aggregateId: string,
    public readonly tenantId: string,
    public readonly goalId: string,
    public readonly timestamp: Date = new Date()
  ) {}
}

export class StepCompletedEvent implements BaseDomainEvent {
  public readonly eventId: string = randomUUID();
  public readonly eventName: string = 'StepCompleted';

  constructor(
    public readonly aggregateId: string,
    public readonly tenantId: string,
    public readonly stepId: string,
    public readonly actionName: string,
    public readonly timestamp: Date = new Date()
  ) {}
}

export class ApprovalRequestedEvent implements BaseDomainEvent {
  public readonly eventId: string = randomUUID();
  public readonly eventName: string = 'ApprovalRequested';

  constructor(
    public readonly aggregateId: string,
    public readonly tenantId: string,
    public readonly requestId: string,
    public readonly actionName: string,
    public readonly riskLevel: string,
    public readonly timestamp: Date = new Date()
  ) {}
}

export class ApprovalGrantedEvent implements BaseDomainEvent {
  public readonly eventId: string = randomUUID();
  public readonly eventName: string = 'ApprovalGranted';

  constructor(
    public readonly aggregateId: string,
    public readonly tenantId: string,
    public readonly requestId: string,
    public readonly approvedBy: string,
    public readonly timestamp: Date = new Date()
  ) {}
}

export class ExecutionRecoveredEvent implements BaseDomainEvent {
  public readonly eventId: string = randomUUID();
  public readonly eventName: string = 'ExecutionRecovered';

  constructor(
    public readonly aggregateId: string,
    public readonly tenantId: string,
    public readonly checkpointId: string,
    public readonly timestamp: Date = new Date()
  ) {}
}

export class AgentCompletedEvent implements BaseDomainEvent {
  public readonly eventId: string = randomUUID();
  public readonly eventName: string = 'AgentCompleted';

  constructor(
    public readonly aggregateId: string,
    public readonly tenantId: string,
    public readonly finalStatus: AgentStatus,
    public readonly outputSummary: string,
    public readonly timestamp: Date = new Date()
  ) {}
}

export type AgentDomainEvent =
  | AgentCreatedEvent
  | GoalReceivedEvent
  | PlanGeneratedEvent
  | ExecutionStartedEvent
  | StepCompletedEvent
  | ApprovalRequestedEvent
  | ApprovalGrantedEvent
  | ExecutionRecoveredEvent
  | AgentCompletedEvent;
