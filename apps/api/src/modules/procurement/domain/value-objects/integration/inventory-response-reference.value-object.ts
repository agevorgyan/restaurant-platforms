import { ValueObject } from '@saas/core';

export interface InventoryResponseReferenceProps { value: string; }

export class InventoryResponseReference extends ValueObject<InventoryResponseReferenceProps> {
  get value(): string { return this.props.value; }
  private constructor(props: InventoryResponseReferenceProps) { super(props); }
  public static create(value: string): InventoryResponseReference {
    if (!value) throw new Error('InventoryResponseReference cannot be empty');
    return new InventoryResponseReference({ value });
  }
}