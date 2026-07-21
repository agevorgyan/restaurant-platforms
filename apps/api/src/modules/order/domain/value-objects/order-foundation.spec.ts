import { OrderId } from './order-id.value-object';
import { OrderNumber } from './order-number.value-object';
import { OrderStatus, OrderStatusEnum } from './order-status.value-object';
import { OrderType, OrderTypeEnum } from './order-type.value-object';
import { OrderSource, OrderSourceEnum } from './order-source.value-object';
import { FulfillmentMethod, FulfillmentMethodEnum } from './fulfillment-method.value-object';
import { OrderPriority, OrderPriorityEnum } from './order-priority.value-object';
import { DeliveryAddress } from './delivery-address.value-object';
import { TableReference } from './table-reference.value-object';
import { CustomerReference } from './customer-reference.value-object';
import { OrderNotes } from './order-notes.value-object';
import { OrderTimestamp } from './order-timestamp.value-object';

describe('Order Foundation Value Objects', () => {
  describe('OrderId', () => {
    it('should create valid order id', () => {
      const id = OrderId.create('123e4567-e89b-12d3-a456-426614174000');
      expect(id.value).toBe('123e4567-e89b-12d3-a456-426614174000');
    });

    it('should throw on invalid uuid', () => {
      expect(() => OrderId.create('invalid')).toThrow('OrderId must be a valid UUID');
    });
  });

  describe('OrderNumber', () => {
    it('should create valid order number', () => {
      const num = OrderNumber.create('ORD-1234');
      expect(num.value).toBe('ORD-1234');
    });

    it('should throw on empty', () => {
      expect(() => OrderNumber.create('')).toThrow('OrderNumber cannot be empty');
    });
  });

  describe('Enums (Status, Type, Source, Fulfillment, Priority)', () => {
    it('should create valid enums', () => {
      expect(OrderStatus.create(OrderStatusEnum.DRAFT).value).toBe('Draft');
      expect(OrderType.create(OrderTypeEnum.DELIVERY).value).toBe('Delivery');
      expect(OrderSource.create(OrderSourceEnum.CUSTOMER_APP).value).toBe('Customer App');
      expect(FulfillmentMethod.create(FulfillmentMethodEnum.PICKUP).value).toBe('Pickup');
      expect(OrderPriority.create(OrderPriorityEnum.HIGH).value).toBe('High');
    });

    it('should throw on invalid enums', () => {
      expect(() => OrderStatus.create('Invalid' as any)).toThrow('Unsupported order status');
    });
  });

  describe('DeliveryAddress', () => {
    it('should create valid address', () => {
      const addr = DeliveryAddress.create({
        country: 'US',
        city: 'NY',
        region: 'NY',
        street: 'Broadway',
        building: '123'
      });
      expect(addr.city).toBe('NY');
    });

    it('should throw on missing mandatory fields', () => {
      expect(() => DeliveryAddress.create({ city: 'NY' } as any)).toThrow('Delivery address is missing mandatory fields');
    });

    it('should throw on invalid coordinates', () => {
      expect(() => DeliveryAddress.create({
        country: 'US', city: 'NY', region: 'NY', street: 'B', building: '1', latitude: 100
      })).toThrow('Invalid latitude coordinate');
    });
  });

  describe('TableReference', () => {
    it('should create valid reference', () => {
      const ref = TableReference.create({ tableNumber: '12A', seatNumber: '4' });
      expect(ref.tableNumber).toBe('12A');
      expect(ref.seatNumber).toBe('4');
    });

    it('should throw if table number is empty', () => {
      expect(() => TableReference.create({ tableNumber: '' })).toThrow('Table number must be provided');
    });
  });

  describe('CustomerReference', () => {
    it('should create valid reference', () => {
      const ref = CustomerReference.create('123e4567-e89b-12d3-a456-426614174000');
      expect(ref.value).toBe('123e4567-e89b-12d3-a456-426614174000');
    });
  });

  describe('OrderNotes', () => {
    it('should create and sanitize notes', () => {
      const notes = OrderNotes.create({ customerNotes: '<script>alert()</script>No onions' });
      expect(notes.customerNotes).toBe('scriptalert()/scriptNo onions');
    });

    it('should throw if notes exceed limit', () => {
      const longNote = 'a'.repeat(501);
      expect(() => OrderNotes.create({ customerNotes: longNote })).toThrow('Customer notes cannot exceed 500 characters');
    });
  });

  describe('OrderTimestamp', () => {
    it('should create valid timestamp', () => {
      const now = new Date();
      const ts = OrderTimestamp.create(now);
      expect(ts.value).toBe(now);
    });

    it('should throw on invalid date', () => {
      expect(() => OrderTimestamp.create(new Date('invalid'))).toThrow('OrderTimestamp must be a valid Date object');
    });
  });
});
