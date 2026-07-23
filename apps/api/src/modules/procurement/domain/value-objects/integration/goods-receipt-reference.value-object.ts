import { ValueObject } from '@saas/core';

export interface GoodsReceiptReferenceProps { value: string; }

export class GoodsReceiptReference extends ValueObject<GoodsReceiptReferenceProps> {
  get value(): string { return this.props.value; }
  private constructor(props: GoodsReceiptReferenceProps) { super(props); }
  public static create(value: string): GoodsReceiptReference {
    if (!value) throw new Error('GoodsReceiptReference cannot be empty');
    return new GoodsReceiptReference({ value });
  }
}