import { ValueObject } from '@saas/core';

export interface KitchenCorrelationIdProps {
  value: string;
}

export class KitchenCorrelationId extends ValueObject<KitchenCorrelationIdProps> {
  get value(): string {
    return this.props.value;
  }

  private constructor(props: KitchenCorrelationIdProps) {
    super(props);
  }

  public static create(value: string): KitchenCorrelationId {
    if (!value || value.trim() === '') {
      throw new Error('Correlation ID cannot be empty');
    }
    return new KitchenCorrelationId({ value: value.trim() });
  }

  public static generate(): KitchenCorrelationId {
    return new KitchenCorrelationId({ value: crypto.randomUUID() });
  }
}
