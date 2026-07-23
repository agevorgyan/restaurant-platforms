import { ValueObject } from '@saas/core';

export interface WarehouseReferenceProps { warehouseId: string; }

export class WarehouseReference extends ValueObject<WarehouseReferenceProps> {
  get warehouseId(): string { return this.props.warehouseId; }
  private constructor(props: WarehouseReferenceProps) { super(props); }
  public static create(warehouseId: string): WarehouseReference {
    if (!warehouseId) throw new Error('WarehouseReference cannot be empty');
    return new WarehouseReference({ warehouseId });
  }
}