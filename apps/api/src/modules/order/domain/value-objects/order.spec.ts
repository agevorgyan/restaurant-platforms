import { describe, it } from 'node:test';
import * as assert from 'node:assert';
import { OrderNumber } from './order-number.value-object';
import { OrderType } from './order-type.value-object';
import { OrderStatus } from './order-status.value-object';

describe('Order Domain Value Objects', () => {
  describe('OrderNumber', () => {
    it('should create a valid order number', () => {
      const num = new OrderNumber('ORD-123');
      assert.strictEqual(num.value, 'ORD-123');
    });

    it('should throw if order number is empty', () => {
      assert.throws(() => new OrderNumber(''), /Order number cannot be empty/);
      assert.throws(() => new OrderNumber('   '), /Order number cannot be empty/);
    });
  });

  describe('OrderType', () => {
    it('should create valid order types', () => {
      const type1 = new OrderType('DineIn');
      const type2 = new OrderType('Takeaway');
      
      assert.strictEqual(type1.value, 'DineIn');
      assert.strictEqual(type2.value, 'Takeaway');
    });

    it('should throw on invalid order type', () => {
      // @ts-expect-error Testing invalid cast
      assert.throws(() => new OrderType('DriveThru'), /Invalid Order Type/);
    });
  });

  describe('OrderStatus', () => {
    it('should create valid order statuses', () => {
      const status1 = new OrderStatus('Draft');
      const status2 = new OrderStatus('Confirmed');
      
      assert.strictEqual(status1.value, 'Draft');
      assert.strictEqual(status2.value, 'Confirmed');
    });

    it('should throw on invalid order status', () => {
      // @ts-expect-error Testing invalid cast
      assert.throws(() => new OrderStatus('Delivering'), /Invalid Order Status/);
    });

    it('should define edit capabilities correctly', () => {
      const draft = new OrderStatus('Draft');
      const pending = new OrderStatus('Pending');
      const confirmed = new OrderStatus('Confirmed');
      const cancelled = new OrderStatus('Cancelled');

      // Rule: Cancelled orders cannot be edited
      assert.strictEqual(cancelled.canBeEdited(), false);
      assert.strictEqual(draft.canBeEdited(), true);
      assert.strictEqual(pending.canBeEdited(), true);
      assert.strictEqual(confirmed.canBeEdited(), true); // Can still edit things like notes

      // Rule: Confirmed orders cannot change order type
      assert.strictEqual(confirmed.canChangeType(), false);
      assert.strictEqual(cancelled.canChangeType(), false);
      assert.strictEqual(draft.canChangeType(), true);
      assert.strictEqual(pending.canChangeType(), true);
    });
  });
});
