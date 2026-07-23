import { ValueObject } from '@saas/core';

export interface SupplierPhoneProps {
  value: string;
}

export class SupplierPhone extends ValueObject<SupplierPhoneProps> {
  get value(): string {
    return this.props.value;
  }

  private constructor(props: SupplierPhoneProps) {
    super(props);
  }

  public static create(value: string): SupplierPhone {
    if (!value || value.trim() === '') {
      throw new Error('Phone cannot be empty');
    }
    // simple phone regex
    const phoneRegex = /^\+?[0-9\s-()]+$/;
    if (!phoneRegex.test(value)) {
      throw new Error('Invalid phone format');
    }
    return new SupplierPhone({ value: value.trim() });
  }
}
