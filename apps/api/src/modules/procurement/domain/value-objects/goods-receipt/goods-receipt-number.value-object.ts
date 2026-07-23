import { ValueObject } from '@saas/core';

export interface GoodsReceiptNumberProps { value: string; }

export class GoodsReceiptNumber extends ValueObject<GoodsReceiptNumberProps> {
  get value(): string { return this.props.value; }
  private constructor(props: GoodsReceiptNumberProps) { super(props); }
  public static create(value: string): GoodsReceiptNumber {
    if (!value || value.trim() === '') throw new Error('GoodsReceiptNumber cannot be empty');
    return new GoodsReceiptNumber({ value: value.trim() });
  }
}