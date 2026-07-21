import { ValueObject } from '@saas/core';

export interface QuotationVersionProps {
  value: number;
}

export class QuotationVersion extends ValueObject<QuotationVersionProps> {
  private constructor(props: QuotationVersionProps) {
    super(props);
  }

  public static initial(): QuotationVersion {
    return new QuotationVersion({ value: 1 });
  }

  public next(): QuotationVersion {
    return new QuotationVersion({ value: this.props.value + 1 });
  }

  get value(): number {
    return this.props.value;
  }
}
