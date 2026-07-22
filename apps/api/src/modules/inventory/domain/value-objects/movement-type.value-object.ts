import { ValueObject } from '@saas/core';

export enum MovementTypeEnum {
  RECEIVE = 'RECEIVE',
  CONSUME = 'CONSUME',
  RESERVE = 'RESERVE',
  RELEASE_RESERVATION = 'RELEASE_RESERVATION',
  TRANSFER_IN = 'TRANSFER_IN',
  TRANSFER_OUT = 'TRANSFER_OUT',
  WASTE = 'WASTE',
  ADJUSTMENT = 'ADJUSTMENT',
  RETURN = 'RETURN',
  EXPIRATION = 'EXPIRATION',
  CYCLE_COUNT_CORRECTION = 'CYCLE_COUNT_CORRECTION',
  PRODUCTION_CONSUMPTION = 'PRODUCTION_CONSUMPTION',
  PRODUCTION_OUTPUT = 'PRODUCTION_OUTPUT',
}

export interface MovementTypeProps {
  value: MovementTypeEnum;
}

export class MovementType extends ValueObject<MovementTypeProps> {
  private constructor(props: MovementTypeProps) {
    super(props);
  }

  public static create(value: MovementTypeEnum): MovementType {
    return new MovementType({ value });
  }

  get value(): MovementTypeEnum {
    return this.props.value;
  }
}
