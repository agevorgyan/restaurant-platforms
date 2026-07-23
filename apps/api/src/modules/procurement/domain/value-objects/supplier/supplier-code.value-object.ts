import { ValueObject } from '@saas/core';

export interface SupplierCodeProps {
  value: string;
}

export class SupplierCode extends ValueObject<SupplierCodeProps> {
  get value(): string {
    return this.props.value;
  }

  private constructor(props: SupplierCodeProps) {
    super(props);
  }

  public static create(value: string): SupplierCode {
    if (!value || value.trim() === '') {
      throw new Error('Supplier code cannot be empty');
    }
    return new SupplierCode({ value: value.trim().toUpperCase() });
  }
}
