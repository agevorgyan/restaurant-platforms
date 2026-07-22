import { ValueObject } from '@saas/core';

export interface RecipeYieldQuantityProps {
  value: number;
}

export class RecipeYieldQuantity extends ValueObject<RecipeYieldQuantityProps> {
  get value(): number {
    return this.props.value;
  }

  private constructor(props: RecipeYieldQuantityProps) {
    super(props);
  }

  public static create(value: number): RecipeYieldQuantity {
    if (value <= 0) {
      throw new Error('Recipe yield quantity must be greater than zero');
    }
    return new RecipeYieldQuantity({ value });
  }
}
