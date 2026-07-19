import { AggregateRoot } from '@saas/core';
import { PromotionId } from '../value-objects/promotion-id.value-object';
import { PromotionName } from '../value-objects/promotion-name.value-object';
import { PromotionType } from '../value-objects/promotion-type.value-object';
import { PromotionStatus } from '../value-objects/promotion-status.value-object';
import { PromotionPriority } from '../value-objects/promotion-priority.value-object';
import { PromotionPeriod } from '../value-objects/promotion-period.value-object';
import { PromotionLimit } from '../value-objects/promotion-limit.value-object';
import { PromotionRule } from '../entities/promotion-rule.entity';
import { PromotionReward } from '../entities/promotion-reward.entity';
import {
  PromotionCreated,
  PromotionActivated,
  PromotionDeactivated,
  PromotionExpired,
  PromotionRuleAdded,
  PromotionRuleRemoved
} from '../events/promotion-events';

export interface PromotionProps {
  id: PromotionId;
  name: PromotionName;
  type: PromotionType;
  status: PromotionStatus;
  priority: PromotionPriority;
  period: PromotionPeriod;
  limit?: PromotionLimit;
  rules: PromotionRule[];
  rewards: PromotionReward[];
}

export class Promotion extends AggregateRoot<PromotionProps> {
  private constructor(props: PromotionProps) {
    super(props.id.value, props);
  }

  public get promotionId(): PromotionId { return this.props.id; }
  public get name(): PromotionName { return this.props.name; }
  public get type(): PromotionType { return this.props.type; }
  public get status(): PromotionStatus { return this.props.status; }
  public get priority(): PromotionPriority { return this.props.priority; }
  public get period(): PromotionPeriod { return this.props.period; }
  public get limit(): PromotionLimit | undefined { return this.props.limit; }
  public get rules(): PromotionRule[] { return [...this.props.rules]; }
  public get rewards(): PromotionReward[] { return [...this.props.rewards]; }

  public static create(
    id: PromotionId,
    name: PromotionName,
    type: PromotionType,
    period: PromotionPeriod,
    priority: PromotionPriority = PromotionPriority.create(0),
    limit?: PromotionLimit
  ): Promotion {
    const promotion = new Promotion({
      id,
      name,
      type,
      status: PromotionStatus.create('Draft'),
      priority,
      period,
      limit,
      rules: [],
      rewards: []
    });

    promotion.addDomainEvent(new PromotionCreated(id.value, name.value, type.value));
    return promotion;
  }

  public activate(): void {
    if (this.status.value !== 'Draft' && this.status.value !== 'Paused') {
      throw new Error('Promotion can only be activated from Draft or Paused status');
    }

    if (this.props.rules.length === 0) {
      throw new Error('Promotion cannot be activated without at least one rule');
    }

    if (!this.period.isActive()) {
      throw new Error('Promotion cannot be activated outside its valid period');
    }

    this.props.status = PromotionStatus.create('Active');
    this.addDomainEvent(new PromotionActivated(this.id));
  }

  public pause(): void {
    if (this.status.value !== 'Active') {
      throw new Error('Only active promotions can be paused');
    }
    this.props.status = PromotionStatus.create('Paused');
    this.addDomainEvent(new PromotionDeactivated(this.id));
  }

  public expire(): void {
    if (this.status.value === 'Expired') return;
    this.props.status = PromotionStatus.create('Expired');
    this.addDomainEvent(new PromotionExpired(this.id));
  }

  public addRule(rule: PromotionRule): void {
    this.ensureNotExpired();
    this.props.rules.push(rule);
    this.addDomainEvent(new PromotionRuleAdded(this.id, rule.id, 'StandardRule'));
  }

  public removeRule(ruleId: string): void {
    this.ensureNotExpired();
    this.props.rules = this.props.rules.filter(r => r.id !== ruleId);
    this.addDomainEvent(new PromotionRuleRemoved(this.id, ruleId));
  }

  public addReward(reward: PromotionReward): void {
    this.ensureNotExpired();
    this.props.rewards.push(reward);
  }

  private ensureNotExpired(): void {
    if (this.status.value === 'Expired') {
      throw new Error('Cannot modify an expired promotion');
    }
  }

  public canBeApplied(): boolean {
    if (this.status.value !== 'Active') return false;
    if (!this.period.isActive()) return false;
    if (this.limit && !this.limit.canBeUsed()) return false;
    return true;
  }

  public recordUsage(): void {
    if (!this.canBeApplied()) {
      throw new Error('Promotion cannot be applied');
    }
    if (this.limit) {
      this.props.limit = this.limit.increment();
    }
  }
}
