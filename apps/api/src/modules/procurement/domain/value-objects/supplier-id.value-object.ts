import { ValueObject } from '@saas/core';

export interface SupplierIdProps {
  value: string;
}

export class SupplierId extends ValueObject<SupplierIdProps> {
  get value(): string {
    return this.props.value;
  }

  private constructor(props: SupplierIdProps) {
    super(props);
  }

  public static create(value: string): SupplierId {
    if (!value || value.trim() === '') {
      throw new Error('SupplierId cannot be empty');
    }
    return new SupplierId({ value: value.trim() });
  }

  public static generate(): SupplierId {
    return new SupplierId({ value: crypto.randomUUID() });
  }
}
