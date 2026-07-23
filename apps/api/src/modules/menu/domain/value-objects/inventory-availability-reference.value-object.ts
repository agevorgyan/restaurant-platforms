import { ValueObject } from '@saas/core';

export interface InventoryAvailabilityReferenceProps { status: string; }

export class InventoryAvailabilityReference extends ValueObject<InventoryAvailabilityReferenceProps> {
  get status(): string { return this.props.status; }
  private constructor(props: InventoryAvailabilityReferenceProps) { super(props); }
  public static create(status: string): InventoryAvailabilityReference {
    if (!status) throw new Error('Inventory availability status is required');
    return new InventoryAvailabilityReference({ status });
  }
}