import { ValueObject } from '@saas/core';

export interface KitchenCausationIdProps {
  value: string;
}

export class KitchenCausationId extends ValueObject<KitchenCausationIdProps> {
  get value(): string {
    return this.props.value;
  }

  private constructor(props: KitchenCausationIdProps) {
    super(props);
  }

  public static create(value: string): KitchenCausationId {
    if (!value || value.trim() === '') {
      throw new Error('Causation ID cannot be empty');
    }
    return new KitchenCausationId({ value: value.trim() });
  }
}
