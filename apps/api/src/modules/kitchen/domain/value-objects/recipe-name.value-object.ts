import { ValueObject } from '@saas/core';

export interface RecipeNameProps {
  value: string;
}

export class RecipeName extends ValueObject<RecipeNameProps> {
  get value(): string {
    return this.props.value;
  }

  private constructor(props: RecipeNameProps) {
    super(props);
  }

  public static create(value: string): RecipeName {
    if (!value || value.trim().length === 0) {
      throw new Error('Recipe name cannot be empty');
    }
    if (value.length > 255) {
      throw new Error('Recipe name cannot exceed 255 characters');
    }
    return new RecipeName({ value: value.trim() });
  }
}
