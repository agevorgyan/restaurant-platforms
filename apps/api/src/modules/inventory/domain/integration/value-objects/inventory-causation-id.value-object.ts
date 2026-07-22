import { ValueObject } from '@saas/core';

export interface InventoryCausationIdProps {
  value: string;
}

export class InventoryCausationId extends ValueObject<InventoryCausationIdProps> {
  get value(): string {
    return this.props.value;
  }

  private constructor(props: InventoryCausationIdProps) {
    super(props);
  }

  public static create(value?: string): InventoryCausationId {
    if (value && value.trim() === '') {
      throw new Error('Causation ID cannot be an empty string');
    }

    return new InventoryCausationId({
      value: value || crypto.randomUUID(),
    });
  }
}
