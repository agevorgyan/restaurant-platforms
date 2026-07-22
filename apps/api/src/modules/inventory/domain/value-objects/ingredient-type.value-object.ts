import { ValueObject } from '@saas/core';

export const IngredientTypeEnum = {
  RAW_MATERIAL: 'RAW_MATERIAL',
  SEMI_FINISHED: 'SEMI_FINISHED',
  FINISHED_PRODUCT: 'FINISHED_PRODUCT',
  PACKAGING: 'PACKAGING',
  BEVERAGE: 'BEVERAGE',
  SPICE: 'SPICE',
  CONSUMABLE: 'CONSUMABLE'
} as const;

export type IngredientTypeEnum = typeof IngredientTypeEnum[keyof typeof IngredientTypeEnum];

interface IngredientTypeProps {
  value: IngredientTypeEnum;
}

export class IngredientType extends ValueObject<IngredientTypeProps> {
  get value(): IngredientTypeEnum {
    return this.props.value;
  }

  private constructor(props: IngredientTypeProps) {
    super(props);
  }

  public static create(type: IngredientTypeEnum): IngredientType {
    if (!Object.values(IngredientTypeEnum).includes(type)) {
      throw new Error(`Invalid ingredient type: ${type}`);
    }
    return new IngredientType({ value: type });
  }
}
