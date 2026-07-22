import { ValueObject } from '@saas/core';

export enum IngredientStatusEnum {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  ARCHIVED = 'ARCHIVED',
  DISCONTINUED = 'DISCONTINUED'
}

export interface IngredientStatusProps {
  value: IngredientStatusEnum;
}

export class IngredientStatus extends ValueObject<IngredientStatusProps> {
  private constructor(props: IngredientStatusProps) {
    super(props);
  }

  public static create(value: IngredientStatusEnum = IngredientStatusEnum.DRAFT): IngredientStatus {
    if (!Object.values(IngredientStatusEnum).includes(value)) {
      throw new Error(`Invalid Ingredient Status: ${value}`);
    }
    return new IngredientStatus({ value });
  }

  get value(): IngredientStatusEnum {
    return this.props.value;
  }
}
