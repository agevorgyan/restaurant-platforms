import { ValueObject } from '@saas/core';

export interface RecipeDescriptionProps {
  value: string;
}

export class RecipeDescription extends ValueObject<RecipeDescriptionProps> {
  get value(): string {
    return this.props.value;
  }

  private constructor(props: RecipeDescriptionProps) {
    super(props);
  }

  public static create(value: string): RecipeDescription {
    if (value && value.length > 2000) {
      throw new Error('Recipe description cannot exceed 2000 characters');
    }
    return new RecipeDescription({ value: value ? value.trim() : '' });
  }
}
