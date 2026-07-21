import { ValueObject } from '@saas/core';

export enum PricingEventPriorityEnum {
  LOW = 'LOW',
  NORMAL = 'NORMAL',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export interface PricingEventPriorityProps {
  value: PricingEventPriorityEnum;
}

export class PricingEventPriority extends ValueObject<PricingEventPriorityProps> {
  private constructor(props: PricingEventPriorityProps) {
    super(props);
  }

  public static create(value: PricingEventPriorityEnum): PricingEventPriority {
    if (!Object.values(PricingEventPriorityEnum).includes(value)) {
      throw new Error(`Invalid event priority: ${value}`);
    }
    return new PricingEventPriority({ value });
  }

  get value(): PricingEventPriorityEnum {
    return this.props.value;
  }
}
