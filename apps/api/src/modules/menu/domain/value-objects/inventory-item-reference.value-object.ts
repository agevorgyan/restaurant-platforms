import { ValueObject } from '@saas/core';

export interface InventoryItemReferenceProps { inventoryItemId: string; }

export class InventoryItemReference extends ValueObject<InventoryItemReferenceProps> {
  get inventoryItemId(): string { return this.props.inventoryItemId; }
  private constructor(props: InventoryItemReferenceProps) { super(props); }
  public static create(inventoryItemId: string): InventoryItemReference {
    if (!inventoryItemId) throw new Error('InventoryItemReference cannot be empty');
    return new InventoryItemReference({ inventoryItemId });
  }
}