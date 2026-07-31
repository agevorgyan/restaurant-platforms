/**
 * Enterprise AI Governance & Certification Platform - Governance Policy Aggregate Root
 *
 * Manages policy lifecycle (Model, Prompt, Agent, Tool, Knowledge, Cost, Compliance, Security),
 * policy enforcement, risk scoring, and violation detection.
 */

import { PolicyType, PolicyStatus, RiskLevel } from '../enums/governance.enums';
import { GovernancePolicyId, RiskScore, PolicyViolation } from '../value-objects/governance-vo';
import { BaseDomainEvent } from '../events/ai.events';
import {
  PolicyCreatedEvent,
  PolicyActivatedEvent,
  PolicyViolationDetectedEvent,
} from '../events/governance.events';

export interface GovernancePolicyProps {
  id: GovernancePolicyId;
  tenantId: string;
  name: string;
  description: string;
  policyType: PolicyType;
  status: PolicyStatus;
  riskLevel: RiskLevel;
  rulesConfig: Record<string, unknown>;
  violationsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export class GovernancePolicyAggregate {
  private domainEvents: BaseDomainEvent[] = [];

  private constructor(private props: GovernancePolicyProps) {}

  public static create(params: {
    id?: GovernancePolicyId;
    tenantId?: string;
    name: string;
    description: string;
    policyType?: PolicyType;
    riskLevel?: RiskLevel;
    rulesConfig?: Record<string, unknown>;
  }): GovernancePolicyAggregate {
    const id = params.id || GovernancePolicyId.generate();
    const tenantId = params.tenantId || 'tenant-default';
    const policyType = params.policyType || PolicyType.USAGE_POLICY;
    const riskLevel = params.riskLevel || RiskLevel.HIGH;

    const now = new Date();
    const aggregate = new GovernancePolicyAggregate({
      id,
      tenantId,
      name: params.name,
      description: params.description,
      policyType,
      status: PolicyStatus.DRAFT,
      riskLevel,
      rulesConfig: params.rulesConfig || {},
      violationsCount: 0,
      createdAt: now,
      updatedAt: now,
    });

    aggregate.addDomainEvent(
      new PolicyCreatedEvent(id.getValue(), tenantId, params.name, policyType, now)
    );

    return aggregate;
  }

  // --- Getters ---
  public getId(): GovernancePolicyId { return this.props.id; }
  public getTenantId(): string { return this.props.tenantId; }
  public getName(): string { return this.props.name; }
  public getDescription(): string { return this.props.description; }
  public getPolicyType(): PolicyType { return this.props.policyType; }
  public getStatus(): PolicyStatus { return this.props.status; }
  public getRiskLevel(): RiskLevel { return this.props.riskLevel; }
  public getViolationsCount(): number { return this.props.violationsCount; }
  public getCreatedAt(): Date { return this.props.createdAt; }
  public getUpdatedAt(): Date { return this.props.updatedAt; }

  public getUncommittedEvents(): BaseDomainEvent[] { return [...this.domainEvents]; }
  public clearEvents(): void { this.domainEvents = []; }

  private addDomainEvent(event: BaseDomainEvent): void { this.domainEvents.push(event); }

  public activate(): void {
    const now = new Date();
    this.props.status = PolicyStatus.ACTIVE;
    this.props.updatedAt = now;

    this.addDomainEvent(
      new PolicyActivatedEvent(this.getId().getValue(), this.getTenantId(), this.getPolicyType(), now)
    );
  }

  public recordViolation(reason: string): PolicyViolation {
    this.props.violationsCount++;
    this.props.updatedAt = new Date();

    const violation = PolicyViolation.create(this.getName(), reason);

    this.addDomainEvent(
      new PolicyViolationDetectedEvent(
        this.getId().getValue(),
        this.getTenantId(),
        this.getName(),
        reason,
        this.getRiskLevel(),
        new Date()
      )
    );

    return violation;
  }
}
