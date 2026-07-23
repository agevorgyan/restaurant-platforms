import { ValueObject } from '@saas/core';

export interface PurchaseOrderNumberProps { value: string; }

export class PurchaseOrderNumber extends ValueObject<PurchaseOrderNumberProps> {
  get value(): string { return this.props.value; }
  private constructor(props: PurchaseOrderNumberProps) { super(props); }
  public static create(value: string): PurchaseOrderNumber {
    if (!value || value.trim() === '') throw new Error('PurchaseOrderNumber cannot be empty');
    return new PurchaseOrderNumber({ value: value.trim() });
  }
}