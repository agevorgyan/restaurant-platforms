import { ValueObject } from '@saas/core';

export enum PricingRuleStatusEnum {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  ARCHIVED = 'ARCHIVED',
}

export interface PricingRuleStatusProps {
  value: PricingRuleStatusEnum;
}

export class PricingRuleStatus extends ValueObject<PricingRuleStatusProps> {
  private constructor(props: PricingRuleStatusProps) {
    super(props);
  }

  public static create(value: PricingRuleStatusEnum): PricingRuleStatus {
    if (!Object.values(PricingRuleStatusEnum).includes(value)) {
      throw new Error(`Invalid pricing rule status: ${value}`);
    }
    return new PricingRuleStatus({ value });
  }

  public static initial(): PricingRuleStatus {
    return new PricingRuleStatus({ value: PricingRuleStatusEnum.DRAFT });
  }

  get value(): PricingRuleStatusEnum {
    return this.props.value;
  }

  public isActive(): boolean {
    return this.props.value === PricingRuleStatusEnum.ACTIVE;
  }

  public isArchived(): boolean {
    return this.props.value === PricingRuleStatusEnum.ARCHIVED;
  }
}
