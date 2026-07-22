import { ValueObject } from '@saas/core';

export enum UnitOfMeasureEnum {
  // Weight
  GRAM = 'GRAM',
  KILOGRAM = 'KILOGRAM',
  // Volume
  MILLILITER = 'MILLILITER',
  LITER = 'LITER',
  // Count
  PIECE = 'PIECE',
  PACK = 'PACK',
  BOX = 'BOX',
  // Area
  SQUARE_METER = 'SQUARE_METER',
  // Length
  METER = 'METER'
}

export interface UnitOfMeasureProps {
  value: UnitOfMeasureEnum;
}

export class UnitOfMeasure extends ValueObject<UnitOfMeasureProps> {
  private constructor(props: UnitOfMeasureProps) {
    super(props);
  }

  public static create(value: UnitOfMeasureEnum): UnitOfMeasure {
    if (!Object.values(UnitOfMeasureEnum).includes(value)) {
      throw new Error(`Invalid Unit of Measure: ${value}`);
    }
    return new UnitOfMeasure({ value });
  }

  get value(): UnitOfMeasureEnum {
    return this.props.value;
  }
}
