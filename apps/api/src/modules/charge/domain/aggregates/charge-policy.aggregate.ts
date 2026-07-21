import { AggregateRoot } from '@saas/core';
import { ChargePolicyId } from '../value-objects/charge-policy-id.value-object';
import { ChargeCode } from '../value-objects/charge-code.value-object';
import { ChargeName } from '../value-objects/charge-name.value-object';
import { ChargeStatus, ChargeStatusEnum } from '../value-objects/charge-status.value-object';
import { ChargePriority } from '../value-objects/charge-priority.value-object';
import { EffectivePeriod } from '../value-objects/effective-period.value-object';
import { ChargeRule } from '../entities/charge-rule.entity';
import {
  ChargePolicyCreated,
  ChargePolicyActivated,
  ChargePolicyDeactivated,
  ChargePolicyArchived,
  ChargePolicyPublished,
  ChargeRuleAdded,
  ChargeRuleRemoved
} from '../events/charge-policy-events';

export interface ChargePolicyProps {
  id: ChargePolicyId;
  code: ChargeCode;
  name: ChargeName;
  status: ChargeStatus;
  priority?: ChargePriority;
  effectivePeriod?: EffectivePeriod;
  rules: ChargeRule[];
  publishedVersion?: number;
}

export class ChargePolicy extends AggregateRoot<ChargePolicyProps> {
  private constructor(props: ChargePolicyProps) {
    super(props.id.value, props);
  }

  public static create(
    id: ChargePolicyId,
    code: ChargeCode,
    name: ChargeName
  ): ChargePolicy {
    const policy = new ChargePolicy({
      id,
      code,
      name,
      status: ChargeStatus.initial(),
      rules: [],
    });

    policy.addDomainEvent(new ChargePolicyCreated(id, code));
    return policy;
  }

  get policyId(): ChargePolicyId { return this.props.id; }
  get code(): ChargeCode { return this.props.code; }
  get name(): ChargeName { return this.props.name; }
  get status(): ChargeStatus { return this.props.status; }
  get priority(): ChargePriority | undefined { return this.props.priority; }
  get effectivePeriod(): EffectivePeriod | undefined { return this.props.effectivePeriod; }
  get rules(): ChargeRule[] { return [...this.props.rules]; }
  get publishedVersion(): number | undefined { return this.props.publishedVersion; }

  public setEffectivePeriod(period: EffectivePeriod): void {
    if (this.props.status.isArchived()) {
      throw new Error('Cannot modify an archived charge policy');
    }
    if (this.props.publishedVersion !== undefined) {
      throw new Error('Cannot modify effective period of a published policy');
    }
    this.props.effectivePeriod = period;
  }

  public setPriority(priority: ChargePriority): void {
    if (this.props.status.isArchived()) {
      throw new Error('Cannot modify an archived charge policy');
    }
    this.props.priority = priority;
  }

  public addRule(rule: ChargeRule): void {
    if (this.props.status.isArchived()) {
      throw new Error('Cannot modify an archived charge policy');
    }
    if (this.props.publishedVersion !== undefined) {
      throw new Error('Cannot add rules to a published policy. Create a new version.');
    }
    this.props.rules.push(rule);
    this.addDomainEvent(new ChargeRuleAdded(this.props.id, rule.id));
  }

  public removeRule(ruleId: string): void {
    if (this.props.status.isArchived()) {
      throw new Error('Cannot modify an archived charge policy');
    }
    if (this.props.publishedVersion !== undefined) {
      throw new Error('Cannot remove rules from a published policy.');
    }
    const index = this.props.rules.findIndex(r => r.id === ruleId);
    if (index === -1) {
      throw new Error('Charge rule not found');
    }
    this.props.rules.splice(index, 1);
    this.addDomainEvent(new ChargeRuleRemoved(this.props.id, ruleId));
  }

  public publish(): void {
    if (this.props.status.isArchived()) {
      throw new Error('Cannot publish an archived charge policy');
    }
    if (this.props.rules.length === 0) {
      throw new Error('Charge policy must contain at least one charge rule to be published');
    }

    this.props.publishedVersion = (this.props.publishedVersion || 0) + 1;
    this.addDomainEvent(new ChargePolicyPublished(this.props.id, this.props.publishedVersion));
  }

  public activate(): void {
    if (this.props.status.isActive()) {
      throw new Error('Charge policy is already active');
    }
    if (this.props.status.isArchived()) {
      throw new Error('Cannot activate an archived charge policy');
    }
    if (this.props.rules.length === 0) {
      throw new Error('Charge policy must contain at least one charge rule to activate');
    }

    this.props.status = ChargeStatus.create(ChargeStatusEnum.ACTIVE);
    this.addDomainEvent(new ChargePolicyActivated(this.props.id));
  }

  public deactivate(): void {
    if (this.props.status.isArchived()) {
      throw new Error('Cannot deactivate an archived charge policy');
    }
    if (this.props.status.value === ChargeStatusEnum.INACTIVE) {
      throw new Error('Charge policy is already inactive');
    }
    this.props.status = ChargeStatus.create(ChargeStatusEnum.INACTIVE);
    this.addDomainEvent(new ChargePolicyDeactivated(this.props.id));
  }

  public archive(): void {
    if (this.props.status.isArchived()) {
      return;
    }
    this.props.status = ChargeStatus.create(ChargeStatusEnum.ARCHIVED);
    this.addDomainEvent(new ChargePolicyArchived(this.props.id));
  }
}
