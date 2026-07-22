import { ValueObject } from '@saas/core';

export interface IngredientIdProps {
  value: string;
}

export class IngredientId extends ValueObject<IngredientIdProps> {
  private constructor(props: IngredientIdProps) {
    super(props);
  }

  public static create(value?: string): IngredientId {
    return new IngredientId({ value: value || crypto.randomUUID() });
  }

  get value(): string {
    return this.props.value;
  }
}
