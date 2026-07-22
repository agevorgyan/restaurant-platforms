import { ValueObject } from '@saas/core';

export interface RecipeIdProps {
  value: string;
}

export class RecipeId extends ValueObject<RecipeIdProps> {
  get value(): string {
    return this.props.value;
  }

  private constructor(props: RecipeIdProps) {
    super(props);
  }

  public static create(value?: string): RecipeId {
    return new RecipeId({
      value: value || crypto.randomUUID(),
    });
  }
}
