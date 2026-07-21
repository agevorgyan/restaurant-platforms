import { ValueObject } from '@saas/core';

export enum ChargeTypeEnum {
  DELIVERY_FEE = 'DELIVERY_FEE',
  SERVICE_CHARGE = 'SERVICE_CHARGE',
  PACKAGING_FEE = 'PACKAGING_FEE',
  SMALL_ORDER_FEE = 'SMALL_ORDER_FEE',
  CONVENIENCE_FEE = 'CONVENIENCE_FEE',
  SURGE_CHARGE = 'SURGE_CHARGE',
  PLATFORM_FEE = 'PLATFORM_FEE',
  RESTAURANT_FEE = 'RESTAURANT_FEE',
  BRANCH_FEE = 'BRANCH_FEE',
  CUSTOM = 'CUSTOM',
}

export interface ChargeTypeProps {
  value: ChargeTypeEnum;
}

export class ChargeType extends ValueObject<ChargeTypeProps> {
  private constructor(props: ChargeTypeProps) {
    super(props);
  }

  public static create(value: ChargeTypeEnum): ChargeType {
    if (!Object.values(ChargeTypeEnum).includes(value)) {
      throw new Error(`Invalid charge type: ${value}`);
    }
    return new ChargeType({ value });
  }

  get value(): ChargeTypeEnum {
    return this.props.value;
  }
}
