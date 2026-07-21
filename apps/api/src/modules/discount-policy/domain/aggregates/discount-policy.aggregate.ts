import { AggregateRoot } from '@saas/core';
import { DiscountPolicyId } from '../value-objects/discount-policy-id.value-object';
import { DiscountType } from '../value-objects/discount-type.value-object';
import { DiscountPriority } from '../value-objects/discount-priority.value-object';
import { DiscountScope } from '../value-objects/discount-scope.value-object';
import { DiscountLimit } from '../value-objects/discount-limit.value-object';
import { DiscountRule } from '../entities/discount-rule.entity';
import {
  DiscountPolicyCreated,
  DiscountPolicyActivated,
  DiscountPolicyDeactivated,
  DiscountRuleAdded,
  DiscountRuleRemoved,
} from '../events/discount-policy-events';

export enum DiscountPolicyStatus {
  DRAFT = 'Draft',
  ACTIVE = 'Active',
  ARCHIVED = 'Archived',
}

export interface DiscountPolicyProps {
  id: DiscountPolicyId;
  name: string;
  type: DiscountType;
  priority: DiscountPriority;
  scope: DiscountScope;
  isStackable: boolean;
  limit?: DiscountLimit;
  status: DiscountPolicyStatus;
  rules: DiscountRule[];
}

export class DiscountPolicy extends AggregateRoot<DiscountPolicyProps> {
  private constructor(props: DiscountPolicyProps) {
    super(props.id.value, props);
  }

  public static create(
    id: DiscountPolicyId,
    name: string,
    type: DiscountType,
    priority: DiscountPriority,
    scope: DiscountScope,
    isStackable: boolean = false,
    limit?: DiscountLimit
  ): DiscountPolicy {
    if (!name || name.trim().length === 0) {
      throw new Error('Discount policy name cannot be empty');
    }

    const policy = new DiscountPolicy({
      id,
      name,
      type,
      priority,
      scope,
      isStackable,
      limit,
      status: DiscountPolicyStatus.DRAFT,
      rules: [],
    });

    policy.addDomainEvent(new DiscountPolicyCreated(id.value, name, type.value));

    return policy;
  }

  get policyId(): DiscountPolicyId { return this.props.id; }
  get name(): string { return this.props.name; }
  get type(): DiscountType { return this.props.type; }
  get priority(): DiscountPriority { return this.props.priority; }
  get scope(): DiscountScope { return this.props.scope; }
  get isStackable(): boolean { return this.props.isStackable; }
  get limit(): DiscountLimit | undefined { return this.props.limit; }
  get status(): DiscountPolicyStatus { return this.props.status; }
  get rules(): DiscountRule[] { return [...this.props.rules]; }

  public activate(): void {
    if (this.props.status === DiscountPolicyStatus.ACTIVE) {
      throw new Error('Policy is already active');
    }
    if (this.props.status === DiscountPolicyStatus.ARCHIVED) {
      throw new Error('Cannot activate an archived policy');
    }
    if (this.props.rules.length === 0) {
      throw new Error('Cannot activate a policy without any rules');
    }

    this.props.status = DiscountPolicyStatus.ACTIVE;
    this.addDomainEvent(new DiscountPolicyActivated(this.id));
  }

  public deactivate(reason?: string): void {
    if (this.props.status === DiscountPolicyStatus.DRAFT) {
      throw new Error('Cannot deactivate a draft policy');
    }
    if (this.props.status === DiscountPolicyStatus.ARCHIVED) {
      throw new Error('Cannot deactivate an archived policy');
    }

    this.props.status = DiscountPolicyStatus.DRAFT;
    this.addDomainEvent(new DiscountPolicyDeactivated(this.id, reason));
  }

  public archive(): void {
    if (this.props.status === DiscountPolicyStatus.ARCHIVED) {
      return;
    }
    
    if (this.props.status === DiscountPolicyStatus.ACTIVE) {
      this.deactivate('Archiving policy');
    }

    this.props.status = DiscountPolicyStatus.ARCHIVED;
  }

  public addRule(rule: DiscountRule): void {
    if (this.props.status === DiscountPolicyStatus.ARCHIVED) {
      throw new Error('Cannot modify rules of an archived policy');
    }

    // Business rule: prevent duplicate rules
    if (this.props.rules.some(r => r.name === rule.name)) {
      throw new Error('A rule with the same name already exists in this policy');
    }

    this.props.rules.push(rule);
    this.addDomainEvent(new DiscountRuleAdded(this.id, rule.id));
  }

  public removeRule(ruleId: string): void {
    if (this.props.status === DiscountPolicyStatus.ARCHIVED) {
      throw new Error('Cannot modify rules of an archived policy');
    }

    const initialLength = this.props.rules.length;
    this.props.rules = this.props.rules.filter(r => r.id !== ruleId);
    
    if (this.props.rules.length < initialLength) {
      this.addDomainEvent(new DiscountRuleRemoved(this.id, ruleId));
    }
    
    // Auto-deactivate if active and rules fall to 0
    if (this.props.rules.length === 0 && this.props.status === DiscountPolicyStatus.ACTIVE) {
      this.deactivate('No rules remaining');
    }
  }

  public evaluate(context: any): { isApplicable: boolean, applicableRules: DiscountRule[] } {
    if (this.props.status !== DiscountPolicyStatus.ACTIVE) {
      return { isApplicable: false, applicableRules: [] };
    }

    const applicableRules = this.props.rules.filter(rule => rule.isSatisfiedBy(context));

    return {
      isApplicable: applicableRules.length > 0,
      applicableRules
    };
  }
}
