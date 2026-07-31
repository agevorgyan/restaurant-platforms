/**
 * Enterprise AI Governance & Certification Platform - Domain Value Objects
 */

import { randomUUID } from 'crypto';
import { RiskLevel } from '../enums/governance.enums';
import { GovernanceDomainException } from '../exceptions/governance.exceptions';

export class GovernancePolicyId {
  private constructor(private readonly value: string) {}

  public static create(value: string): GovernancePolicyId {
    if (!value || typeof value !== 'string' || value.trim().length === 0) {
      throw new GovernanceDomainException('GovernancePolicyId cannot be empty');
    }
    return new GovernancePolicyId(value.trim());
  }

  public static generate(): GovernancePolicyId {
    return new GovernancePolicyId(randomUUID());
  }

  public getValue(): string {
    return this.value;
  }
}

export class RiskScore {
  constructor(
    public readonly score: number, // 0 - 100
    public readonly level: RiskLevel
  ) {}

  public static calculate(score: number): RiskScore {
    const clamped = Math.max(0, Math.min(100, score));
    let level = RiskLevel.LOW;
    if (clamped >= 80) level = RiskLevel.CRITICAL;
    else if (clamped >= 60) level = RiskLevel.HIGH;
    else if (clamped >= 30) level = RiskLevel.MEDIUM;

    return new RiskScore(clamped, level);
  }
}

export class SafetyClassification {
  constructor(
    public readonly containsPii: boolean,
    public readonly containsToxicContent: boolean,
    public readonly isSafe: boolean
  ) {}

  public static evaluate(text: string): SafetyClassification {
    const piiRegex = /\b\d{3}-\d{2}-\d{4}\b|\b\d{16}\b/g; // SSN or Credit Card
    const containsPii = piiRegex.test(text);

    return new SafetyClassification(containsPii, false, !containsPii);
  }
}

export class ComplianceResult {
  constructor(
    public readonly passed: boolean,
    public readonly violations: string[],
    public readonly checkedAt: Date = new Date()
  ) {}

  public static create(passed: boolean, violations: string[] = []): ComplianceResult {
    return new ComplianceResult(passed, violations, new Date());
  }
}

export class AuditRecord {
  constructor(
    public readonly auditId: string,
    public readonly tenantId: string,
    public readonly entityType: string,
    public readonly actionName: string,
    public readonly status: string,
    public readonly timestamp: Date = new Date()
  ) {}

  public static create(tenantId: string, entityType: string, actionName: string, status: string = 'SUCCESS'): AuditRecord {
    return new AuditRecord(randomUUID(), tenantId, entityType, actionName, status, new Date());
  }
}

export class PolicyViolation {
  constructor(
    public readonly violationId: string,
    public readonly policyName: string,
    public readonly reason: string,
    public readonly timestamp: Date = new Date()
  ) {}

  public static create(policyName: string, reason: string): PolicyViolation {
    return new PolicyViolation(randomUUID(), policyName, reason, new Date());
  }
}
