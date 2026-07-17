import { describe, it } from 'node:test';
import * as assert from 'node:assert';
import { OrderItemModifier } from './order-item-modifier.value-object';
import { OrderItemPrice } from './order-item-price.value-object';
import { OrderItemStatus } from './order-item-status.value-object';

describe('Order Item Domain Value Objects', () => {
  describe('OrderItemModifier', () => {
    it('should create a valid modifier', () => {
      const mod = new OrderItemModifier('g1', 'opt1', 'Extra Cheese', 2, 1.50);
      assert.strictEqual(mod.quantity, 2);
      assert.strictEqual(mod.priceAdjustment, 1.50);
    });

    it('should throw if quantity is not greater than zero', () => {
      assert.throws(() => new OrderItemModifier('g1', 'opt1', 'Extra Cheese', 0, 1.50), /Modifier quantity must be greater than zero/);
    });
  });

  describe('OrderItemPrice', () => {
    it('should calculate base price without modifiers correctly', () => {
      const price = new OrderItemPrice(10.00, 2);
      assert.strictEqual(price.totalPrice, 20.00);
    });

    it('should calculate total price correctly with modifiers scaled by item quantity', () => {
      const mod1 = new OrderItemModifier('g1', 'opt1', 'Extra Cheese', 1, 1.50);
      const mod2 = new OrderItemModifier('g2', 'opt2', 'Bacon', 2, 2.00); // 2 units of bacon ($4)
      
      // Total formula: (unitPrice * quantity) + (sum(mod.priceAdjustment * mod.quantity) * quantity)
      // Unit price = 10, Quantity = 3
      // Base: 10 * 3 = 30
      // Modifiers: (1.50 * 1 + 2.00 * 2) = 5.50
      // Modifiers total for 3 items: 5.50 * 3 = 16.50
      // Grand total: 30 + 16.50 = 46.50
      const price = new OrderItemPrice(10.00, 3, [mod1, mod2]);
      assert.strictEqual(price.totalPrice, 46.50);
    });

    it('should throw if unit price is negative', () => {
      assert.throws(() => new OrderItemPrice(-5.00, 1), /Unit price cannot be negative/);
    });

    it('should throw if quantity is zero or negative', () => {
      assert.throws(() => new OrderItemPrice(10.00, 0), /Quantity must be greater than zero/);
    });
  });

  describe('OrderItemStatus', () => {
    it('should determine edit capabilities', () => {
      const pending = new OrderItemStatus('Pending');
      const confirmed = new OrderItemStatus('Confirmed');
      const cancelled = new OrderItemStatus('Cancelled');

      assert.strictEqual(pending.canBeEdited(), true);
      assert.strictEqual(confirmed.canBeEdited(), true);
      assert.strictEqual(cancelled.canBeEdited(), false);
    });

    it('should determine modifier immutability', () => {
      const pending = new OrderItemStatus('Pending');
      const confirmed = new OrderItemStatus('Confirmed');
      const preparing = new OrderItemStatus('Preparing');

      assert.strictEqual(pending.areModifiersImmutable(), false);
      assert.strictEqual(confirmed.areModifiersImmutable(), true);
      assert.strictEqual(preparing.areModifiersImmutable(), true);
    });
  });
});
