import { ValueObject } from '@saas/core';

export enum CheckoutChannelEnum {
  ONLINE = 'Online',
  IN_STORE = 'InStore'
}

export interface CheckoutChannelProps {
  value: CheckoutChannelEnum;
}

export class CheckoutChannel extends ValueObject<CheckoutChannelProps> {
  private constructor(props: CheckoutChannelProps) {
    super(props);
  }

  public static create(value: CheckoutChannelEnum): CheckoutChannel {
    if (!Object.values(CheckoutChannelEnum).includes(value)) {
      throw new Error(`Invalid CheckoutChannel: ${value}`);
    }
    return new CheckoutChannel({ value });
  }

  get value(): CheckoutChannelEnum {
    return this.props.value;
  }
}
