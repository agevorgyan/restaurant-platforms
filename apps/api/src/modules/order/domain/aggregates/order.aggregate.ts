import { AggregateRoot } from '@saas/core';

import { OrderNumber } from '../value-objects/order-number.value-object';
import { OrderType } from '../value-objects/order-type.value-object';
import { OrderStatus, OrderStatusEnum } from '../value-objects/order-status.value-object';
import { OrderSource } from '../value-objects/order-source.value-object';
import { FulfillmentMethod } from '../value-objects/fulfillment-method.value-object';
import { OrderPriority, OrderPriorityEnum } from '../value-objects/order-priority.value-object';
import { DeliveryAddress } from '../value-objects/delivery-address.value-object';
import { TableReference } from '../value-objects/table-reference.value-object';
import { CustomerReference } from '../value-objects/customer-reference.value-object';
import { RestaurantReference } from '../value-objects/restaurant-reference.value-object';
import { BranchReference } from '../value-objects/branch-reference.value-object';
import { OrderNotes } from '../value-objects/order-notes.value-object';
import { OrderTimestamp } from '../value-objects/order-timestamp.value-object';
import {
  OrderCreatedEvent,
  OrderConfirmedEvent,
  OrderCancelledEvent,
  OrderDeliveryAddressUpdatedEvent,
} from '../events/order.events';

export interface OrderProps {
  orderNumber: OrderNumber;
  restaurantId: RestaurantReference;
  branchId: BranchReference;
  customerId?: CustomerReference;
  tableId?: TableReference;
  orderType: OrderType;
  status: OrderStatus;
  source: OrderSource;
  fulfillmentMethod: FulfillmentMethod;
  priority: OrderPriority;
  deliveryAddress?: DeliveryAddress;
  notes?: OrderNotes;
  cartId?: string; // Kept as string for backward compatibility until Cart domain is built
  createdAt: OrderTimestamp;
  updatedAt: OrderTimestamp;
}

export class Order extends AggregateRoot<OrderProps> {
  private constructor(props: OrderProps, id?: string) {
    super(id || crypto.randomUUID(), props);
  }

  public static create(props: Omit<OrderProps, 'status' | 'createdAt' | 'updatedAt' | 'priority'> & { priority?: OrderPriority }): Order {
    const defaultPriority = props.priority ?? OrderPriority.create(OrderPriorityEnum.NORMAL);
    const now = OrderTimestamp.now();
    
    const order = new Order({
      ...props,
      status: OrderStatus.create(OrderStatusEnum.DRAFT),
      priority: defaultPriority,
      createdAt: now,
      updatedAt: now,
    });

    order.addDomainEvent(
      new OrderCreatedEvent(
        order.id,
        order.props.restaurantId.value,
        order.props.branchId.value
      )
    );

    return order;
  }

  public confirm(): void {
    if (!this.props.status.canBeEdited()) {
      throw new Error('Cannot confirm a cancelled order');
    }
    if (this.props.status.value === OrderStatusEnum.CONFIRMED) {
      return;
    }

    this.props.status = OrderStatus.create(OrderStatusEnum.CONFIRMED);
    this.updateTimestamp();

    this.addDomainEvent(
      new OrderConfirmedEvent(this.id, this.props.restaurantId.value)
    );
  }

  public cancel(reason: string): void {
    if (this.props.status.value === OrderStatusEnum.CANCELLED) {
      return;
    }

    this.props.status = OrderStatus.create(OrderStatusEnum.CANCELLED);
    this.updateTimestamp();

    this.addDomainEvent(
      new OrderCancelledEvent(this.id, this.props.restaurantId.value, reason)
    );
  }

  public updateDeliveryAddress(address: DeliveryAddress): void {
    if (!this.props.status.canBeEdited()) {
      throw new Error('Cannot update delivery address of a cancelled order');
    }

    this.props.deliveryAddress = address;
    this.updateTimestamp();

    this.addDomainEvent(
      new OrderDeliveryAddressUpdatedEvent(this.id, this.props.restaurantId.value)
    );
  }

  public updateNotes(notes: OrderNotes): void {
    if (!this.props.status.canBeEdited()) {
      throw new Error('Cannot update notes of a cancelled order');
    }

    this.props.notes = notes;
    this.updateTimestamp();
  }

  private updateTimestamp(): void {
    this.props.updatedAt = OrderTimestamp.now();
  }

  // Getters for encapsulation
  get orderNumber(): OrderNumber { return this.props.orderNumber; }
  get restaurantId(): RestaurantReference { return this.props.restaurantId; }
  get branchId(): BranchReference { return this.props.branchId; }
  get customerId(): CustomerReference | undefined { return this.props.customerId; }
  get tableId(): TableReference | undefined { return this.props.tableId; }
  get orderType(): OrderType { return this.props.orderType; }
  get status(): OrderStatus { return this.props.status; }
  get source(): OrderSource { return this.props.source; }
  get fulfillmentMethod(): FulfillmentMethod { return this.props.fulfillmentMethod; }
  get priority(): OrderPriority { return this.props.priority; }
  get deliveryAddress(): DeliveryAddress | undefined { return this.props.deliveryAddress; }
  get notes(): OrderNotes | undefined { return this.props.notes; }
  get cartId(): string | undefined { return this.props.cartId; }
  get createdAt(): OrderTimestamp { return this.props.createdAt; }
  get updatedAt(): OrderTimestamp { return this.props.updatedAt; }

  // Expose legacy DTO representation for backward compatibility with `order.service.ts`
  public toDTO() {
    return {
      id: this.id,
      restaurantId: this.props.restaurantId.value,
      branchId: this.props.branchId.value,
      orderNumber: this.props.orderNumber,
      orderType: this.props.orderType,
      status: this.props.status,
      customerId: this.props.customerId?.value,
      tableId: this.props.tableId?.tableNumber, // Approximate fallback
      cartId: this.props.cartId,
      notes: this.props.notes?.customerNotes, // Approximate fallback
      createdAt: this.props.createdAt.value,
      updatedAt: this.props.updatedAt.value,
    };
  }
}
