import { ValueObject } from '@saas/core';

interface IngredientNameProps {
  value: string;
}

export class IngredientName extends ValueObject<IngredientNameProps> {
  get value(): string {
    return this.props.value;
  }

  private constructor(props: IngredientNameProps) {
    super(props);
  }

  public static create(name: string): IngredientName {
    if (!name || name.trim().length === 0) {
      throw new Error('Ingredient name cannot be empty');
    }
    
    if (name.length > 100) {
      throw new Error('Ingredient name cannot exceed 100 characters');
    }

    return new IngredientName({ value: name.trim() });
  }
}
