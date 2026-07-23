import { ValueObject } from '@saas/core';

export interface PurchaseOrderReferenceProps { value: string; }

export class PurchaseOrderReference extends ValueObject<PurchaseOrderReferenceProps> {
  get value(): string { return this.props.value; }
  private constructor(props: PurchaseOrderReferenceProps) { super(props); }
  public static create(value: string): PurchaseOrderReference {
    if (!value || value.trim() === '') throw new Error('PurchaseOrderReference cannot be empty');
    return new PurchaseOrderReference({ value: value.trim() });
  }
}