import { AggregateRoot } from '@saas/core';
import { TaxPolicyId } from '../value-objects/tax-policy-id.value-object';
import { TaxCode } from '../value-objects/tax-code.value-object';
import { TaxName } from '../value-objects/tax-name.value-object';
import { TaxStatus, TaxStatusEnum } from '../value-objects/tax-status.value-object';
import { TaxPriority } from '../value-objects/tax-priority.value-object';
import { EffectivePeriod } from '../value-objects/effective-period.value-object';
import { TaxRule } from '../entities/tax-rule.entity';
import { TaxExemption } from '../entities/tax-exemption.entity';
import {
  TaxPolicyCreated,
  TaxPolicyActivated,
  TaxPolicyDeactivated,
  TaxPolicyArchived,
  TaxPolicyPublished,
  TaxRuleAdded,
  TaxRuleRemoved
} from '../events/tax-policy-events';

export interface TaxPolicyProps {
  id: TaxPolicyId;
  code: TaxCode;
  name: TaxName;
  status: TaxStatus;
  priority?: TaxPriority;
  effectivePeriod?: EffectivePeriod;
  rules: TaxRule[];
  exemptions: TaxExemption[];
  publishedVersion?: number;
}

export class TaxPolicy extends AggregateRoot<TaxPolicyProps> {
  private constructor(props: TaxPolicyProps) {
    super(props.id.value, props);
  }

  public static create(
    id: TaxPolicyId,
    code: TaxCode,
    name: TaxName
  ): TaxPolicy {
    const policy = new TaxPolicy({
      id,
      code,
      name,
      status: TaxStatus.initial(),
      rules: [],
      exemptions: [],
    });

    policy.addDomainEvent(new TaxPolicyCreated(id, code));
    return policy;
  }

  get policyId(): TaxPolicyId { return this.props.id; }
  get code(): TaxCode { return this.props.code; }
  get name(): TaxName { return this.props.name; }
  get status(): TaxStatus { return this.props.status; }
  get priority(): TaxPriority | undefined { return this.props.priority; }
  get effectivePeriod(): EffectivePeriod | undefined { return this.props.effectivePeriod; }
  get rules(): TaxRule[] { return [...this.props.rules]; }
  get exemptions(): TaxExemption[] { return [...this.props.exemptions]; }
  get publishedVersion(): number | undefined { return this.props.publishedVersion; }

  public setEffectivePeriod(period: EffectivePeriod): void {
    if (this.props.status.isArchived()) {
      throw new Error('Cannot modify an archived tax policy');
    }
    if (this.props.publishedVersion !== undefined) {
      throw new Error('Cannot modify effective period of a published policy');
    }
    this.props.effectivePeriod = period;
  }

  public setPriority(priority: TaxPriority): void {
    if (this.props.status.isArchived()) {
      throw new Error('Cannot modify an archived tax policy');
    }
    this.props.priority = priority;
  }

  public addRule(rule: TaxRule): void {
    if (this.props.status.isArchived()) {
      throw new Error('Cannot modify an archived tax policy');
    }
    if (this.props.publishedVersion !== undefined) {
      throw new Error('Cannot add rules to a published policy. Create a new version.');
    }
    this.props.rules.push(rule);
    this.addDomainEvent(new TaxRuleAdded(this.props.id, rule.id));
  }

  public removeRule(ruleId: string): void {
    if (this.props.status.isArchived()) {
      throw new Error('Cannot modify an archived tax policy');
    }
    if (this.props.publishedVersion !== undefined) {
      throw new Error('Cannot remove rules from a published policy.');
    }
    const index = this.props.rules.findIndex(r => r.id === ruleId);
    if (index === -1) {
      throw new Error('Tax rule not found');
    }
    this.props.rules.splice(index, 1);
    this.addDomainEvent(new TaxRuleRemoved(this.props.id, ruleId));
  }

  public addExemption(exemption: TaxExemption): void {
    if (this.props.status.isArchived()) {
      throw new Error('Cannot modify an archived tax policy');
    }
    if (this.props.publishedVersion !== undefined) {
      throw new Error('Cannot add exemptions to a published policy.');
    }
    this.props.exemptions.push(exemption);
  }

  public publish(): void {
    if (this.props.status.isArchived()) {
      throw new Error('Cannot publish an archived tax policy');
    }
    if (this.props.rules.length === 0) {
      throw new Error('Tax policy must contain at least one tax rule to be published');
    }

    this.props.publishedVersion = (this.props.publishedVersion || 0) + 1;
    this.addDomainEvent(new TaxPolicyPublished(this.props.id));
  }

  public activate(): void {
    if (this.props.status.isActive()) {
      throw new Error('Tax policy is already active');
    }
    if (this.props.status.isArchived()) {
      throw new Error('Cannot activate an archived tax policy');
    }
    if (this.props.rules.length === 0) {
      throw new Error('Tax policy must contain at least one tax rule to activate');
    }

    this.props.status = TaxStatus.create(TaxStatusEnum.ACTIVE);
    this.addDomainEvent(new TaxPolicyActivated(this.props.id));
  }

  public deactivate(): void {
    if (this.props.status.isArchived()) {
      throw new Error('Cannot deactivate an archived tax policy');
    }
    if (this.props.status.value === TaxStatusEnum.INACTIVE) {
      throw new Error('Tax policy is already inactive');
    }
    this.props.status = TaxStatus.create(TaxStatusEnum.INACTIVE);
    this.addDomainEvent(new TaxPolicyDeactivated(this.props.id));
  }

  public archive(): void {
    if (this.props.status.isArchived()) {
      return;
    }
    this.props.status = TaxStatus.create(TaxStatusEnum.ARCHIVED);
    this.addDomainEvent(new TaxPolicyArchived(this.props.id));
  }
}
