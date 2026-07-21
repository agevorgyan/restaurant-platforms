import { Order } from './order.aggregate';
import { OrderNumber } from '../value-objects/order-number.value-object';
import { OrderType, OrderTypeEnum } from '../value-objects/order-type.value-object';
import { OrderStatusEnum } from '../value-objects/order-status.value-object';
import { OrderSource, OrderSourceEnum } from '../value-objects/order-source.value-object';
import { FulfillmentMethod, FulfillmentMethodEnum } from '../value-objects/fulfillment-method.value-object';
import { DeliveryAddress } from '../value-objects/delivery-address.value-object';
import { RestaurantReference } from '../value-objects/restaurant-reference.value-object';
import { BranchReference } from '../value-objects/branch-reference.value-object';
import { OrderNotes } from '../value-objects/order-notes.value-object';
import { OrderPriorityEnum } from '../value-objects/order-priority.value-object';
import { OrderCreatedEvent, OrderConfirmedEvent, OrderCancelledEvent, OrderDeliveryAddressUpdatedEvent } from '../events/order.events';

describe('Order Aggregate', () => {
  const restaurantId = RestaurantReference.create('123e4567-e89b-42d3-a456-426614174000');
  const branchId = BranchReference.create('223e4567-e89b-42d3-a456-426614174001');
  const orderNumber = OrderNumber.create('ORD-001');
  const orderType = OrderType.create(OrderTypeEnum.DELIVERY);
  const source = OrderSource.create(OrderSourceEnum.CUSTOMER_APP);
  const fulfillmentMethod = FulfillmentMethod.create(FulfillmentMethodEnum.DELIVERY);

  let order: Order;

  beforeEach(() => {
    order = Order.create({
      restaurantId,
      branchId,
      orderNumber,
      orderType,
      source,
      fulfillmentMethod
    });
    order.clearEvents(); // Clear creation event for clean tests
  });

  describe('Creation', () => {
    it('should create an order in DRAFT status with default NORMAL priority', () => {
      const newOrder = Order.create({
        restaurantId,
        branchId,
        orderNumber,
        orderType,
        source,
        fulfillmentMethod
      });

      expect(newOrder.status.value).toBe(OrderStatusEnum.DRAFT);
      expect(newOrder.priority.value).toBe(OrderPriorityEnum.NORMAL);
      expect(newOrder.createdAt.value).toBeInstanceOf(Date);
      
      const events = newOrder.domainEvents;
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(OrderCreatedEvent);
    });
  });

  describe('State Transitions', () => {
    it('should transition to CONFIRMED', () => {
      order.confirm();
      expect(order.status.value).toBe(OrderStatusEnum.CONFIRMED);
      
      const events = order.domainEvents;
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(OrderConfirmedEvent);
    });

    it('should transition to CANCELLED', () => {
      order.cancel('Customer request');
      expect(order.status.value).toBe(OrderStatusEnum.CANCELLED);
      
      const events = order.domainEvents;
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(OrderCancelledEvent);
      expect((events[0] as OrderCancelledEvent).reason).toBe('Customer request');
    });

    it('should not allow confirming a cancelled order', () => {
      order.cancel('Test');
      expect(() => order.confirm()).toThrow('Cannot confirm a cancelled order');
    });
  });

  describe('Updates', () => {
    it('should update delivery address', () => {
      const addr = DeliveryAddress.create({
        country: 'US', city: 'NY', region: 'NY', street: '123 Main', building: '1'
      });
      order.updateDeliveryAddress(addr);
      
      expect(order.deliveryAddress).toBe(addr);
      
      const events = order.domainEvents;
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(OrderDeliveryAddressUpdatedEvent);
    });

    it('should update notes', () => {
      const notes = OrderNotes.create({ customerNotes: 'Extra spicy' });
      order.updateNotes(notes);
      expect(order.notes?.customerNotes).toBe('Extra spicy');
    });

    it('should not update address if order is cancelled', () => {
      order.cancel('Test');
      const addr = DeliveryAddress.create({
        country: 'US', city: 'NY', region: 'NY', street: '123 Main', building: '1'
      });
      expect(() => order.updateDeliveryAddress(addr)).toThrow('Cannot update delivery address of a cancelled order');
    });
  });
});
