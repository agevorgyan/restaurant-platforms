import { ValueObject } from '@saas/core';

export interface SupplierTaxNumberProps {
  value: string;
}

export class SupplierTaxNumber extends ValueObject<SupplierTaxNumberProps> {
  get value(): string {
    return this.props.value;
  }

  private constructor(props: SupplierTaxNumberProps) {
    super(props);
  }

  public static create(value: string): SupplierTaxNumber {
    if (!value || value.trim() === '') {
      throw new Error('Tax number cannot be empty');
    }
    const alphanumericRegex = /^[a-zA-Z0-9-]+$/;
    if (!alphanumericRegex.test(value)) {
      throw new Error('Invalid tax identifier format');
    }
    return new SupplierTaxNumber({ value: value.trim() });
  }
}
