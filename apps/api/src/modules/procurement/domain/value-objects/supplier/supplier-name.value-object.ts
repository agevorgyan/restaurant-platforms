import { ValueObject } from '@saas/core';

export interface SupplierNameProps {
  value: string;
}

export class SupplierName extends ValueObject<SupplierNameProps> {
  get value(): string {
    return this.props.value;
  }

  private constructor(props: SupplierNameProps) {
    super(props);
  }

  public static create(value: string): SupplierName {
    if (!value || value.trim() === '') {
      throw new Error('Supplier legal name cannot be empty');
    }
    return new SupplierName({ value: value.trim() });
  }
}
