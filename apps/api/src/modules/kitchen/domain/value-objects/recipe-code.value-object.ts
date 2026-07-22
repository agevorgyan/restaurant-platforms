import { ValueObject } from '@saas/core';

export interface RecipeCodeProps {
  value: string;
}

export class RecipeCode extends ValueObject<RecipeCodeProps> {
  get value(): string {
    return this.props.value;
  }

  private constructor(props: RecipeCodeProps) {
    super(props);
  }

  public static create(value: string): RecipeCode {
    if (!value || value.trim().length === 0) {
      throw new Error('Recipe code cannot be empty');
    }
    const sanitized = value.trim().toUpperCase();
    if (!/^[A-Z0-9-_]+$/.test(sanitized)) {
      throw new Error('Recipe code must contain only uppercase alphanumeric characters, dashes, or underscores');
    }
    return new RecipeCode({ value: sanitized });
  }
}
