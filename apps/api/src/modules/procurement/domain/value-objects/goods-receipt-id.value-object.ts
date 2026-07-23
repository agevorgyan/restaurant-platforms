import { ValueObject } from '@saas/core';

export interface GoodsReceiptIdProps {
  value: string;
}

export class GoodsReceiptId extends ValueObject<GoodsReceiptIdProps> {
  get value(): string {
    return this.props.value;
  }

  private constructor(props: GoodsReceiptIdProps) {
    super(props);
  }

  public static create(value: string): GoodsReceiptId {
    if (!value || value.trim() === '') {
      throw new Error('GoodsReceiptId cannot be empty');
    }
    return new GoodsReceiptId({ value: value.trim() });
  }

  public static generate(): GoodsReceiptId {
    return new GoodsReceiptId({ value: crypto.randomUUID() });
  }
}
