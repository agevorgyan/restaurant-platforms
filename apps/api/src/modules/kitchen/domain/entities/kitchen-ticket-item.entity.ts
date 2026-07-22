import { Entity } from '@saas/core';
import { OrderItemReference } from '../value-objects/order-item-reference.value-object';
import { RecipeReference } from '../value-objects/recipe-reference.value-object';
import { Quantity } from '../../../inventory/domain/value-objects/quantity.value-object';
import { StationReference } from '../value-objects/station-reference.value-object';
import { KitchenTicketStatus } from '../value-objects/kitchen-ticket-status.value-object';
import { PreparationTime } from '../value-objects/preparation-time.value-object';

export interface KitchenTicketItemProps {
  id: string;
  orderItemReference: OrderItemReference;
  recipeReference: RecipeReference;
  quantity: Quantity;
  stationReference?: StationReference;
  itemStatus: KitchenTicketStatus;
  preparationNotes?: string;
  estimatedDuration: PreparationTime;
  createdAt: Date;
  updatedAt: Date;
}

export class KitchenTicketItem extends Entity<KitchenTicketItemProps> {
  get id(): string {
    return this._id;
  }

  get orderItemReference(): OrderItemReference {
    return this.props.orderItemReference;
  }

  get recipeReference(): RecipeReference {
    return this.props.recipeReference;
  }

  get quantity(): Quantity {
    return this.props.quantity;
  }

  get stationReference(): StationReference | undefined {
    return this.props.stationReference;
  }

  get itemStatus(): KitchenTicketStatus {
    return this.props.itemStatus;
  }

  get preparationNotes(): string | undefined {
    return this.props.preparationNotes;
  }

  get estimatedDuration(): PreparationTime {
    return this.props.estimatedDuration;
  }

  private constructor(id: string, props: KitchenTicketItemProps) {
    super(id, props);
  }

  public static create(
    id: string,
    orderItemReference: OrderItemReference,
    recipeReference: RecipeReference,
    quantity: Quantity,
    itemStatus: KitchenTicketStatus,
    estimatedDuration: PreparationTime,
    stationReference?: StationReference,
    preparationNotes?: string
  ): KitchenTicketItem {
    if (quantity.value <= 0) {
      throw new Error('Quantity must be greater than zero');
    }

    return new KitchenTicketItem(id, {
      id,
      orderItemReference,
      recipeReference,
      quantity,
      stationReference,
      itemStatus,
      preparationNotes,
      estimatedDuration,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }

  public assignToStation(station: StationReference): void {
    this.props.stationReference = station;
    this.props.updatedAt = new Date();
  }

  public updateStatus(newStatus: KitchenTicketStatus): void {
    this.props.itemStatus = newStatus;
    this.props.updatedAt = new Date();
  }
}
