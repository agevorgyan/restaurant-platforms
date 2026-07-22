import { ValueObject } from '@saas/core';

export interface IngredientCodeProps {
  value: string;
}

export class IngredientCode extends ValueObject<IngredientCodeProps> {
  private constructor(props: IngredientCodeProps) {
    super(props);
  }

  public static create(value: string): IngredientCode {
    if (!value || value.trim().length === 0) {
      throw new Error('Ingredient code cannot be empty');
    }
    const cleanValue = value.trim().toUpperCase();
    if (cleanValue.length > 50) {
      throw new Error('Ingredient code must be 50 characters or less');
    }
    return new IngredientCode({ value: cleanValue });
  }

  get value(): string {
    return this.props.value;
  }
}
