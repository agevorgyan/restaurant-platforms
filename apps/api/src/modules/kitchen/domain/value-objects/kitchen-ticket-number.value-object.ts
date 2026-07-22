import { ValueObject } from '@saas/core';

export interface KitchenTicketNumberProps {
  value: string;
}

export class KitchenTicketNumber extends ValueObject<KitchenTicketNumberProps> {
  get value(): string {
    return this.props.value;
  }

  private constructor(props: KitchenTicketNumberProps) {
    super(props);
  }

  public static create(value: string): KitchenTicketNumber {
    if (!value || value.trim().length === 0) {
      throw new Error('Kitchen ticket number cannot be empty');
    }
    return new KitchenTicketNumber({ value: value.trim() });
  }
}
