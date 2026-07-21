import { Entity } from '@saas/core';
import { ChargeMethod } from '../value-objects/charge-method.value-object';
import { ChargeType } from '../value-objects/charge-type.value-object';
import { ChargeAmount } from '../value-objects/charge-amount.value-object';
import { ChargeTarget } from './charge-target.entity';
import { ChargeCondition } from './charge-condition.entity';
import { ChargeSchedule } from './charge-schedule.entity';

export interface ChargeRuleProps {
  method: ChargeMethod;
  type: ChargeType;
  amount: ChargeAmount;
  targets: ChargeTarget[];
  conditions: ChargeCondition[];
  schedules: ChargeSchedule[];
}

export class ChargeRule extends Entity<ChargeRuleProps> {
  private constructor(id: string, props: ChargeRuleProps) {
    super(id, props);
  }

  public static create(id: string, props: ChargeRuleProps): ChargeRule {
    if (props.targets.length === 0) {
      throw new Error('ChargeRule must have at least one target');
    }
    if (props.conditions.length === 0) {
      throw new Error('ChargeRule must have at least one condition');
    }
    return new ChargeRule(id, props);
  }

  get method(): ChargeMethod {
    return this.props.method;
  }

  get type(): ChargeType {
    return this.props.type;
  }

  get amount(): ChargeAmount {
    return this.props.amount;
  }

  get targets(): ChargeTarget[] {
    return [...this.props.targets];
  }

  get conditions(): ChargeCondition[] {
    return [...this.props.conditions];
  }

  get schedules(): ChargeSchedule[] {
    return [...this.props.schedules];
  }
}
