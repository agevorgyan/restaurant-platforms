import { ValueObject } from '@saas/core';

interface IngredientVersionProps {
  value: number;
}

export class IngredientVersion extends ValueObject<IngredientVersionProps> {
  get value(): number {
    return this.props.value;
  }

  private constructor(props: IngredientVersionProps) {
    super(props);
  }

  public static create(version: number = 1): IngredientVersion {
    if (!Number.isInteger(version) || version < 1) {
      throw new Error('Ingredient version must be a positive integer');
    }
    return new IngredientVersion({ value: version });
  }

  public increment(): IngredientVersion {
    return new IngredientVersion({ value: this.props.value + 1 });
  }
}
