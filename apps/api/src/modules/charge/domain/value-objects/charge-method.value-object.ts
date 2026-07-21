import { ValueObject } from '@saas/core';

export enum ChargeMethodEnum {
  FIXED_AMOUNT = 'FIXED_AMOUNT',
  PERCENTAGE = 'PERCENTAGE',
  TIERED_AMOUNT = 'TIERED_AMOUNT',
  DISTANCE_BASED = 'DISTANCE_BASED',
  WEIGHT_BASED = 'WEIGHT_BASED',
  QUANTITY_BASED = 'QUANTITY_BASED',
  TIME_BASED = 'TIME_BASED',
}

export interface ChargeMethodProps {
  value: ChargeMethodEnum;
}

export class ChargeMethod extends ValueObject<ChargeMethodProps> {
  private constructor(props: ChargeMethodProps) {
    super(props);
  }

  public static create(value: ChargeMethodEnum): ChargeMethod {
    if (!Object.values(ChargeMethodEnum).includes(value)) {
      throw new Error(`Invalid charge method: ${value}`);
    }
    return new ChargeMethod({ value });
  }

  get value(): ChargeMethodEnum {
    return this.props.value;
  }
}
