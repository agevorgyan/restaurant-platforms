import { ValueObject } from '@saas/core';

interface IngredientDescriptionProps {
  value: string | null;
}

export class IngredientDescription extends ValueObject<IngredientDescriptionProps> {
  get value(): string | null {
    return this.props.value;
  }

  private constructor(props: IngredientDescriptionProps) {
    super(props);
  }

  public static create(description?: string | null): IngredientDescription {
    if (description !== null && description !== undefined) {
      if (description.length > 1000) {
        throw new Error('Ingredient description cannot exceed 1000 characters');
      }
      return new IngredientDescription({ value: description.trim() });
    }
    return new IngredientDescription({ value: null });
  }
}
