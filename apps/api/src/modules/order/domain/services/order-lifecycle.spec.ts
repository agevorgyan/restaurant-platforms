import { OrderStateTransitionManager } from './order-state-transition-manager.service';
import { Order } from '../aggregates/order.aggregate';
import { OrderStatus, OrderStatusEnum } from '../value-objects/order-status.value-object';
import { OrderType, OrderTypeEnum } from '../value-objects/order-type.value-object';
import { OrderSource, OrderSourceEnum } from '../value-objects/order-source.value-object';
import { FulfillmentMethod, FulfillmentMethodEnum } from '../value-objects/fulfillment-method.value-object';
import { RestaurantReference } from '../value-objects/restaurant-reference.value-object';
import { BranchReference } from '../value-objects/branch-reference.value-object';
import { OrderNumber } from '../value-objects/order-number.value-object';
import {
  OrderStatusChangedEvent,
  OrderConfirmedEvent
} from '../events/order.events';

describe('Order Lifecycle Domain Services', () => {
  let transitionManager: OrderStateTransitionManager;
  let order: Order;

  beforeEach(() => {
    transitionManager = new OrderStateTransitionManager();
    order = Order.create({
      restaurantId: RestaurantReference.create('123e4567-e89b-42d3-a456-426614174000'),
      branchId: BranchReference.create('223e4567-e89b-42d3-a456-426614174001'),
      orderNumber: OrderNumber.create('ORD-001'),
      orderType: OrderType.create(OrderTypeEnum.DELIVERY),
      source: OrderSource.create(OrderSourceEnum.CUSTOMER_APP),
      fulfillmentMethod: FulfillmentMethod.create(FulfillmentMethodEnum.DELIVERY)
    });
    order.clearEvents();
  });

  describe('Valid Transitions', () => {
    it('should transition Draft -> Pending', () => {
      const result = transitionManager.transitionOrder(order, OrderStatusEnum.PENDING);
      expect('isSuccess' in result).toBe(true);
      expect(order.status.value).toBe(OrderStatusEnum.PENDING);
      
      const events = order.domainEvents;
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(OrderStatusChangedEvent);
    });

    it('should transition Pending -> Confirmed and emit specific event', () => {
      transitionManager.transitionOrder(order, OrderStatusEnum.PENDING);
      order.clearEvents();

      const result = transitionManager.transitionOrder(order, OrderStatusEnum.CONFIRMED);
      expect('isSuccess' in result).toBe(true);
      expect(order.status.value).toBe(OrderStatusEnum.CONFIRMED);
      
      const events = order.domainEvents;
      expect(events).toHaveLength(2); // OrderStatusChangedEvent + OrderConfirmedEvent
      expect(events[0]).toBeInstanceOf(OrderStatusChangedEvent);
      expect(events[1]).toBeInstanceOf(OrderConfirmedEvent);
    });

    it('should transition Confirmed -> Preparing -> Ready -> OutForDelivery -> Delivered -> Completed', () => {
      transitionManager.transitionOrder(order, OrderStatusEnum.PENDING);
      transitionManager.transitionOrder(order, OrderStatusEnum.CONFIRMED);
      
      let res = transitionManager.transitionOrder(order, OrderStatusEnum.PREPARING);
      expect('isSuccess' in res).toBe(true);

      res = transitionManager.transitionOrder(order, OrderStatusEnum.READY);
      expect('isSuccess' in res).toBe(true);

      res = transitionManager.transitionOrder(order, OrderStatusEnum.OUT_FOR_DELIVERY);
      expect('isSuccess' in res).toBe(true);

      res = transitionManager.transitionOrder(order, OrderStatusEnum.DELIVERED);
      expect('isSuccess' in res).toBe(true);

      res = transitionManager.transitionOrder(order, OrderStatusEnum.COMPLETED);
      expect('isSuccess' in res).toBe(true);
    });
  });

  describe('Invalid Transitions', () => {
    it('should reject Completed -> Preparing', () => {
      order.changeStatus(OrderStatus.create(OrderStatusEnum.COMPLETED));
      
      const result = transitionManager.transitionOrder(order, OrderStatusEnum.PREPARING);
      expect('isFailure' in result).toBe(true);
      if ('isFailure' in result) {
        expect(result.error).toMatch(/Illegal state transition/);
      }
    });

    it('should reject Delivered -> Pending', () => {
      order.changeStatus(OrderStatus.create(OrderStatusEnum.DELIVERED));
      const result = transitionManager.transitionOrder(order, OrderStatusEnum.PENDING);
      expect('isFailure' in result).toBe(true);
    });

    it('should reject Preparing -> Draft', () => {
      order.changeStatus(OrderStatus.create(OrderStatusEnum.PREPARING));
      const result = transitionManager.transitionOrder(order, OrderStatusEnum.DRAFT);
      expect('isFailure' in result).toBe(true);
    });

    it('should reject Order in Preparing state directly going to Completed', () => {
      order.changeStatus(OrderStatus.create(OrderStatusEnum.PREPARING));
      const result = transitionManager.transitionOrder(order, OrderStatusEnum.COMPLETED);
      expect('isFailure' in result).toBe(true);
      if ('isFailure' in result) {
        expect(result.error).toMatch(/cannot be completed directly/);
      }
    });
  });

  describe('Terminal States and Cancellations', () => {
    it('should allow cancellation from Draft', () => {
      const result = transitionManager.transitionOrder(order, OrderStatusEnum.CANCELLED, 'Test');
      expect('isSuccess' in result).toBe(true);
      expect(order.status.value).toBe(OrderStatusEnum.CANCELLED);
    });

    it('should allow cancellation from Pending', () => {
      transitionManager.transitionOrder(order, OrderStatusEnum.PENDING);
      const result = transitionManager.transitionOrder(order, OrderStatusEnum.CANCELLED, 'Test');
      expect('isSuccess' in result).toBe(true);
    });

    it('should reject cancellation from Delivered', () => {
      order.changeStatus(OrderStatus.create(OrderStatusEnum.DELIVERED));
      const result = transitionManager.transitionOrder(order, OrderStatusEnum.CANCELLED, 'Test');
      expect('isFailure' in result).toBe(true);
      if ('isFailure' in result) {
        expect(result.error).toMatch(/cannot be cancelled/);
      }
    });

    it('should be idempotent for duplicate transitions', () => {
      transitionManager.transitionOrder(order, OrderStatusEnum.PENDING);
      order.clearEvents();

      const result = transitionManager.transitionOrder(order, OrderStatusEnum.PENDING);
      expect('isSuccess' in result).toBe(true);
      expect(order.domainEvents).toHaveLength(0);
    });
  });
});
