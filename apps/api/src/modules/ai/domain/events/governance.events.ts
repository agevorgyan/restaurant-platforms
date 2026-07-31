/**
 * Enterprise AI Governance & Certification Platform - Domain Events
 */

import { randomUUID } from 'crypto';
import { BaseDomainEvent } from './ai.events';
import { PolicyType, PolicyStatus, RiskLevel } from '../enums/governance.enums';

export class PolicyCreatedEvent implements BaseDomainEvent {
  public readonly eventId: string = randomUUID();
  public readonly eventName: string = 'PolicyCreated';

  constructor(
    public readonly aggregateId: string,
    public readonly tenantId: string,
    public readonly name: string,
    public readonly policyType: PolicyType,
    public readonly timestamp: Date = new Date()
  ) {}
}

export class PolicyActivatedEvent implements BaseDomainEvent {
  public readonly eventId: string = randomUUID();
  public readonly eventName: string = 'PolicyActivated';

  constructor(
    public readonly aggregateId: string,
    public readonly tenantId: string,
    public readonly policyType: PolicyType,
    public readonly timestamp: Date = new Date()
  ) {}
}

export class PolicyViolationDetectedEvent implements BaseDomainEvent {
  public readonly eventId: string = randomUUID();
  public readonly eventName: string = 'PolicyViolationDetected';

  constructor(
    public readonly aggregateId: string,
    public readonly tenantId: string,
    public readonly policyName: string,
    public readonly reason: string,
    public readonly riskLevel: RiskLevel,
    public readonly timestamp: Date = new Date()
  ) {}
}

export class BudgetExceededEvent implements BaseDomainEvent {
  public readonly eventId: string = randomUUID();
  public readonly eventName: string = 'BudgetExceeded';

  constructor(
    public readonly aggregateId: string,
    public readonly tenantId: string,
    public readonly currentCostUsd: number,
    public readonly limitUsd: number,
    public readonly timestamp: Date = new Date()
  ) {}
}

export class UnsafePromptDetectedEvent implements BaseDomainEvent {
  public readonly eventId: string = randomUUID();
  public readonly eventName: string = 'UnsafePromptDetected';

  constructor(
    public readonly aggregateId: string,
    public readonly tenantId: string,
    public readonly reason: string,
    public readonly timestamp: Date = new Date()
  ) {}
}

export class UnsafeToolInvocationDetectedEvent implements BaseDomainEvent {
  public readonly eventId: string = randomUUID();
  public readonly eventName: string = 'UnsafeToolInvocationDetected';

  constructor(
    public readonly aggregateId: string,
    public readonly tenantId: string,
    public readonly toolName: string,
    public readonly reason: string,
    public readonly timestamp: Date = new Date()
  ) {}
}

export class AgentBlockedEvent implements BaseDomainEvent {
  public readonly eventId: string = randomUUID();
  public readonly eventName: string = 'AgentBlocked';

  constructor(
    public readonly aggregateId: string,
    public readonly tenantId: string,
    public readonly agentId: string,
    public readonly reason: string,
    public readonly timestamp: Date = new Date()
  ) {}
}

export class CertificationCompletedEvent implements BaseDomainEvent {
  public readonly eventId: string = randomUUID();
  public readonly eventName: string = 'CertificationCompleted';

  constructor(
    public readonly aggregateId: string,
    public readonly tenantId: string,
    public readonly status: string,
    public readonly overallScore: number,
    public readonly timestamp: Date = new Date()
  ) {}
}

export type GovernanceDomainEvent =
  | PolicyCreatedEvent
  | PolicyActivatedEvent
  | PolicyViolationDetectedEvent
  | BudgetExceededEvent
  | UnsafePromptDetectedEvent
  | UnsafeToolInvocationDetectedEvent
  | AgentBlockedEvent
  | CertificationCompletedEvent;
