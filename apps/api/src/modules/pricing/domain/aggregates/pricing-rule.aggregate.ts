import { AggregateRoot } from '@saas/core';
import { PricingRuleId } from '../value-objects/pricing-rule-id.value-object';
import { PricingRuleCode } from '../value-objects/pricing-rule-code.value-object';
import { PricingRuleName } from '../value-objects/pricing-rule-name.value-object';
import { PricingRuleType } from '../value-objects/pricing-rule-type.value-object';
import { PricingRuleStatus, PricingRuleStatusEnum } from '../value-objects/pricing-rule-status.value-object';
import { PricingRuleScope } from '../value-objects/pricing-rule-scope.value-object';
import { PricingRuleTarget } from '../value-objects/pricing-rule-target.value-object';
import { PricingRuleVersion } from '../value-objects/pricing-rule-version.value-object';
import { EffectivePeriod } from '../value-objects/effective-period.value-object';
import { PricingCondition } from '../entities/pricing-condition.entity';
import { PricingAction } from '../entities/pricing-action.entity';
import { PricingConstraint } from '../entities/pricing-constraint.entity';
import { PricingPriority } from '../entities/pricing-priority.entity';
import {
  PricingRuleCreated,
  PricingRuleActivated,
  PricingRuleDeactivated,
  PricingRuleArchived,
  PricingRulePublished
} from '../events/pricing-rule-events';

export interface PricingRuleProps {
  id: PricingRuleId;
  code: PricingRuleCode;
  name: PricingRuleName;
  type: PricingRuleType;
  status: PricingRuleStatus;
  scope: PricingRuleScope;
  target: PricingRuleTarget;
  version: PricingRuleVersion;
  priority?: PricingPriority;
  effectivePeriod?: EffectivePeriod;
  conditions: PricingCondition[];
  actions: PricingAction[];
  constraints: PricingConstraint[];
}

export class PricingRule extends AggregateRoot<PricingRuleProps> {
  private constructor(props: PricingRuleProps) {
    super(props.id.value, props);
  }

  public static create(
    id: PricingRuleId,
    code: PricingRuleCode,
    name: PricingRuleName,
    type: PricingRuleType,
    scope: PricingRuleScope,
    target: PricingRuleTarget
  ): PricingRule {
    const rule = new PricingRule({
      id,
      code,
      name,
      type,
      status: PricingRuleStatus.initial(),
      scope,
      target,
      version: PricingRuleVersion.initial(),
      conditions: [],
      actions: [],
      constraints: [],
    });

    rule.addDomainEvent(new PricingRuleCreated(id, code));
    return rule;
  }

  get ruleId(): PricingRuleId { return this.props.id; }
  get code(): PricingRuleCode { return this.props.code; }
  get name(): PricingRuleName { return this.props.name; }
  get type(): PricingRuleType { return this.props.type; }
  get status(): PricingRuleStatus { return this.props.status; }
  get scope(): PricingRuleScope { return this.props.scope; }
  get target(): PricingRuleTarget { return this.props.target; }
  get version(): PricingRuleVersion { return this.props.version; }
  get priority(): PricingPriority | undefined { return this.props.priority; }
  get effectivePeriod(): EffectivePeriod | undefined { return this.props.effectivePeriod; }
  get conditions(): PricingCondition[] { return [...this.props.conditions]; }
  get actions(): PricingAction[] { return [...this.props.actions]; }
  get constraints(): PricingConstraint[] { return [...this.props.constraints]; }

  public setEffectivePeriod(period: EffectivePeriod): void {
    if (this.props.status.isArchived()) {
      throw new Error('Cannot modify an archived rule');
    }
    this.props.effectivePeriod = period;
  }

  public setPriority(priority: PricingPriority): void {
    if (this.props.status.isArchived()) {
      throw new Error('Cannot modify an archived rule');
    }
    this.props.priority = priority;
  }

  public addCondition(condition: PricingCondition): void {
    if (this.props.status.isArchived()) {
      throw new Error('Cannot modify an archived rule');
    }
    this.props.conditions.push(condition);
  }

  public addAction(action: PricingAction): void {
    if (this.props.status.isArchived()) {
      throw new Error('Cannot modify an archived rule');
    }
    if (this.props.actions.length > 0) {
      throw new Error('A pricing rule must contain exactly one action');
    }
    this.props.actions.push(action);
  }

  public addConstraint(constraint: PricingConstraint): void {
    if (this.props.status.isArchived()) {
      throw new Error('Cannot modify an archived rule');
    }
    this.props.constraints.push(constraint);
  }

  public publish(): void {
    if (this.props.status.isArchived()) {
      throw new Error('Cannot publish an archived rule');
    }
    if (this.props.conditions.length === 0) {
      throw new Error('Rule must contain at least one condition to be published');
    }
    if (this.props.actions.length !== 1) {
      throw new Error('Rule must contain exactly one action to be published');
    }

    this.props.version = this.props.version.increment();
    this.addDomainEvent(new PricingRulePublished(this.props.id, this.props.version.value));
  }

  public activate(): void {
    if (this.props.status.isActive()) {
      throw new Error('Rule is already active');
    }
    if (this.props.status.isArchived()) {
      throw new Error('Cannot activate an archived rule');
    }
    if (this.props.conditions.length === 0 || this.props.actions.length !== 1) {
      throw new Error('Rule must be valid (have conditions and one action) to activate');
    }

    this.props.status = PricingRuleStatus.create(PricingRuleStatusEnum.ACTIVE);
    this.addDomainEvent(new PricingRuleActivated(this.props.id));
  }

  public deactivate(): void {
    if (this.props.status.isArchived()) {
      throw new Error('Cannot deactivate an archived rule');
    }
    if (this.props.status.value === PricingRuleStatusEnum.INACTIVE) {
      throw new Error('Rule is already inactive');
    }
    this.props.status = PricingRuleStatus.create(PricingRuleStatusEnum.INACTIVE);
    this.addDomainEvent(new PricingRuleDeactivated(this.props.id));
  }

  public archive(): void {
    if (this.props.status.isArchived()) {
      return; // Already archived
    }
    this.props.status = PricingRuleStatus.create(PricingRuleStatusEnum.ARCHIVED);
    this.addDomainEvent(new PricingRuleArchived(this.props.id));
  }
}
