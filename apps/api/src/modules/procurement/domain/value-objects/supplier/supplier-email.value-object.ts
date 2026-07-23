import { ValueObject } from '@saas/core';

export interface SupplierEmailProps {
  value: string;
}

export class SupplierEmail extends ValueObject<SupplierEmailProps> {
  get value(): string {
    return this.props.value;
  }

  private constructor(props: SupplierEmailProps) {
    super(props);
  }

  public static create(value: string): SupplierEmail {
    if (!value || value.trim() === '') {
      throw new Error('Email cannot be empty');
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      throw new Error('Invalid email format');
    }
    return new SupplierEmail({ value: value.trim().toLowerCase() });
  }
}
