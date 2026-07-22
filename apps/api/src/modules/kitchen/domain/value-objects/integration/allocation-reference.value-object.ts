import { ValueObject } from '@saas/core';
import { InventoryRequestReference } from './inventory-request-reference.value-object';
import { Quantity } from '../../../../inventory/domain/value-objects/quantity.value-object';

export interface AllocationItem {
  ingredientId: string;
  quantity: Quantity;
  batchId?: string;
}

export interface AllocationReferenceProps {
  reference: InventoryRequestReference;
  productionId: string;
  items: AllocationItem[];
  allocatedAt: Date;
}

export class AllocationReference extends ValueObject<AllocationReferenceProps> {
  get reference(): InventoryRequestReference {
    return this.props.reference;
  }

  get productionId(): string {
    return this.props.productionId;
  }

  get items(): AllocationItem[] {
    return [...this.props.items];
  }

  get allocatedAt(): Date {
    return this.props.allocatedAt;
  }

  private constructor(props: AllocationReferenceProps) {
    super(props);
  }

  public static create(
    reference: InventoryRequestReference,
    productionId: string,
    items: AllocationItem[]
  ): AllocationReference {
    if (!productionId || productionId.trim() === '') {
      throw new Error('Production ID cannot be empty');
    }
    if (!items || items.length === 0) {
      throw new Error('Allocation reference must contain items');
    }
    return new AllocationReference({
      reference,
      productionId: productionId.trim(),
      items: [...items],
      allocatedAt: new Date()
    });
  }
}
