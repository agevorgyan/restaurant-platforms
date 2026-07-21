import { ValueObject } from '@saas/core';

export enum PaymentEventPriorityEnum {
  HIGH = 'HIGH',
  NORMAL = 'NORMAL',
  LOW = 'LOW'
}

export interface PaymentEventPriorityProps {
  value: PaymentEventPriorityEnum;
}

export class PaymentEventPriority extends ValueObject<PaymentEventPriorityProps> {
  private constructor(props: PaymentEventPriorityProps) {
    super(props);
  }

  public static create(value: PaymentEventPriorityEnum = PaymentEventPriorityEnum.NORMAL): PaymentEventPriority {
    return new PaymentEventPriority({ value });
  }

  get value(): PaymentEventPriorityEnum {
    return this.props.value;
  }
}
