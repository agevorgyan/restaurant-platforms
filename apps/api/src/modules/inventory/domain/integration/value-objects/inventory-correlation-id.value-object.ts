import { ValueObject } from '@saas/core';

export interface InventoryCorrelationIdProps {
  value: string;
}

export class InventoryCorrelationId extends ValueObject<InventoryCorrelationIdProps> {
  get value(): string {
    return this.props.value;
  }

  private constructor(props: InventoryCorrelationIdProps) {
    super(props);
  }

  public static create(value?: string): InventoryCorrelationId {
    if (value && value.trim() === '') {
      throw new Error('Correlation ID cannot be an empty string');
    }
    
    return new InventoryCorrelationId({
      value: value || crypto.randomUUID(),
    });
  }
}
