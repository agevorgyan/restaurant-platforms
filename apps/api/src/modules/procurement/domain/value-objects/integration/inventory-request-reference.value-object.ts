import { ValueObject } from '@saas/core';

export interface InventoryRequestReferenceProps { value: string; }

export class InventoryRequestReference extends ValueObject<InventoryRequestReferenceProps> {
  get value(): string { return this.props.value; }
  private constructor(props: InventoryRequestReferenceProps) { super(props); }
  public static create(value: string): InventoryRequestReference {
    if (!value) throw new Error('InventoryRequestReference cannot be empty');
    return new InventoryRequestReference({ value });
  }
}