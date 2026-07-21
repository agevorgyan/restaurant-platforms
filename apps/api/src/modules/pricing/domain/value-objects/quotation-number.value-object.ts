import { ValueObject } from '@saas/core';

export interface QuotationNumberProps {
  value: string;
}

export class QuotationNumber extends ValueObject<QuotationNumberProps> {
  private constructor(props: QuotationNumberProps) {
    super(props);
  }

  public static create(value: string): QuotationNumber {
    if (!value || value.trim().length === 0) {
      throw new Error('QuotationNumber cannot be empty');
    }
    // Pattern example: QTN-2026-XYZ123
    const pattern = /^QTN-\d{4}-[A-Z0-9]+$/;
    if (!pattern.test(value)) {
      throw new Error('QuotationNumber format is invalid');
    }
    return new QuotationNumber({ value });
  }

  get value(): string {
    return this.props.value;
  }
}
