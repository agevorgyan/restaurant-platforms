import { Identifier, DomainPrimitive } from '@saas/domain';
import { ValueObject } from '@saas/core';

// ENUMS

export enum PolicyDecisionEnum {
  ALLOW = 'ALLOW',
  WARN = 'WARN',
  REQUIRE_APPROVAL = 'REQUIRE_APPROVAL',
  DENY = 'DENY'
}

export class PolicyDecisionType extends DomainPrimitive<PolicyDecisionEnum> {
  private constructor(value: PolicyDecisionEnum) { super(value); }
  public static create(value: PolicyDecisionEnum): PolicyDecisionType { return new PolicyDecisionType(value); }
}

export enum RiskLevelEnum {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export class RiskLevel extends DomainPrimitive<RiskLevelEnum> {
  private constructor(value: RiskLevelEnum) { super(value); }
  public static create(value: RiskLevelEnum): RiskLevel { return new RiskLevel(value); }
}

// VALUE OBJECTS

export class PolicyId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): PolicyId { return new PolicyId(value); }
  public static generate(): PolicyId { return new PolicyId(crypto.randomUUID()); }
}

export class ViolationId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): ViolationId { return new ViolationId(value); }
  public static generate(): ViolationId { return new ViolationId(crypto.randomUUID()); }
}

export interface PolicyRuleProps {
  [key: string]: unknown;
  ruleType: string;
  parameters: Record<string, any>;
}

export class PolicyRule extends ValueObject<PolicyRuleProps> {
  private constructor(props: PolicyRuleProps) { super(props); }
  public static create(props: PolicyRuleProps): PolicyRule { return new PolicyRule(props); }
}

export interface PolicyDecisionProps {
  [key: string]: unknown;
  decision: PolicyDecisionEnum;
  reason: string;
  matchedRules: string[];
}

export class PolicyDecision extends ValueObject<PolicyDecisionProps> {
  private constructor(props: PolicyDecisionProps) { super(props); }
  public static create(props: PolicyDecisionProps): PolicyDecision { return new PolicyDecision(props); }
}

export class RiskScore extends DomainPrimitive<number> {
  private constructor(value: number) { super(value); }
  public static create(value: number): RiskScore { return new RiskScore(value); }
}

export interface SafetyCheckProps {
  [key: string]: unknown;
  checkType: string;
  passed: boolean;
  details: string;
}

export class SafetyCheck extends ValueObject<SafetyCheckProps> {
  private constructor(props: SafetyCheckProps) { super(props); }
  public static create(props: SafetyCheckProps): SafetyCheck { return new SafetyCheck(props); }
}

export interface ComplianceReportProps {
  [key: string]: unknown;
  reportId: string;
  standards: string[];
  status: string;
  generatedAt: Date;
}

export class ComplianceReport extends ValueObject<ComplianceReportProps> {
  private constructor(props: ComplianceReportProps) { super(props); }
  public static create(props: ComplianceReportProps): ComplianceReport { return new ComplianceReport(props); }
}

export interface AuditRecordProps {
  [key: string]: unknown;
  actionId: string;
  actorId: string;
  resourceId: string;
  actionType: string;
  context: Record<string, any>;
  timestamp: Date;
}

export class AuditRecord extends ValueObject<AuditRecordProps> {
  private constructor(props: AuditRecordProps) { super(props); }
  public static create(props: AuditRecordProps): AuditRecord { return new AuditRecord(props); }
}

export interface ApprovalDecisionProps {
  [key: string]: unknown;
  decision: 'APPROVED' | 'REJECTED';
  approverId: string;
  reason: string;
  timestamp: Date;
}

export class ApprovalDecision extends ValueObject<ApprovalDecisionProps> {
  private constructor(props: ApprovalDecisionProps) { super(props); }
  public static create(props: ApprovalDecisionProps): ApprovalDecision { return new ApprovalDecision(props); }
}

export interface GuardrailResultProps {
  [key: string]: unknown;
  passed: boolean;
  violations: string[];
  sanitizedOutput?: string;
}

export class GuardrailResult extends ValueObject<GuardrailResultProps> {
  private constructor(props: GuardrailResultProps) { super(props); }
  public static create(props: GuardrailResultProps): GuardrailResult { return new GuardrailResult(props); }
}
