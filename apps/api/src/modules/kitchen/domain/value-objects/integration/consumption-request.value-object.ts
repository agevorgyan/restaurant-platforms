import { ValueObject } from '@saas/core';
import { Quantity } from '../../../../inventory/domain/value-objects/quantity.value-object';
import { InventoryRequestReference } from './inventory-request-reference.value-object';

export interface ConsumptionItem {
  ingredientId: string;
  quantity: Quantity;
}

export interface ConsumptionRequestProps {
  reference: InventoryRequestReference;
  productionId: string;
  items: ConsumptionItem[];
  requestedAt: Date;
}

export class ConsumptionRequest extends ValueObject<ConsumptionRequestProps> {
  get reference(): InventoryRequestReference {
    return this.props.reference;
  }

  get productionId(): string {
    return this.props.productionId;
  }

  get items(): ConsumptionItem[] {
    return [...this.props.items];
  }

  get requestedAt(): Date {
    return this.props.requestedAt;
  }

  private constructor(props: ConsumptionRequestProps) {
    super(props);
  }

  public static create(reference: InventoryRequestReference, productionId: string, items: ConsumptionItem[]): ConsumptionRequest {
    if (!productionId || productionId.trim() === '') {
      throw new Error('Production ID cannot be empty');
    }
    if (!items || items.length === 0) {
      throw new Error('Consumption request must contain items');
    }
    return new ConsumptionRequest({
      reference,
      productionId: productionId.trim(),
      items: [...items],
      requestedAt: new Date()
    });
  }
}
