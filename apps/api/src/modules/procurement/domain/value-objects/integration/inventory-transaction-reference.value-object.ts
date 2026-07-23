import { ValueObject } from '@saas/core';

export interface InventoryTransactionReferenceProps { value: string; }

export class InventoryTransactionReference extends ValueObject<InventoryTransactionReferenceProps> {
  get value(): string { return this.props.value; }
  private constructor(props: InventoryTransactionReferenceProps) { super(props); }
  public static create(value: string): InventoryTransactionReference {
    if (!value) throw new Error('InventoryTransactionReference cannot be empty');
    return new InventoryTransactionReference({ value });
  }
}