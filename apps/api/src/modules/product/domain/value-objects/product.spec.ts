import { describe, it } from 'node:test';
import * as assert from 'node:assert';
import { ProductStatus } from './product-status.value-object';
import { ProductAvailability } from './product-availability.value-object';
import { ProductPrice } from './product-price.value-object';

describe('Product Domain Value Objects', () => {
  describe('ProductStatus', () => {
    it('should create valid statuses', () => {
      const active = new ProductStatus('Active');
      const archived = new ProductStatus('Archived');
      
      assert.strictEqual(active.value, 'Active');
      assert.strictEqual(archived.value, 'Archived');
      assert.strictEqual(archived.isArchived(), true);
      assert.strictEqual(active.isArchived(), false);
    });

    it('should throw on invalid status', () => {
      // @ts-expect-error Testing invalid cast
      assert.throws(() => new ProductStatus('InvalidStatus'));
    });
  });

  describe('ProductAvailability', () => {
    it('should create valid availability', () => {
      const available = new ProductAvailability('Available');
      const hidden = new ProductAvailability('Hidden');
      
      assert.strictEqual(available.value, 'Available');
      assert.strictEqual(hidden.value, 'Hidden');
    });

    it('should throw on invalid availability', () => {
      // @ts-expect-error Testing invalid cast
      assert.throws(() => new ProductAvailability('InvalidVis'));
    });
  });

  describe('ProductPrice', () => {
    it('should create a valid product price', () => {
      const price = new ProductPrice(10.99, 'USD', 12.99, 5.00);
      assert.strictEqual(price.price, 10.99);
      assert.strictEqual(price.currency, 'USD');
      assert.strictEqual(price.compareAtPrice, 12.99);
      assert.strictEqual(price.costPrice, 5.00);
    });

    it('should throw if price is negative', () => {
      assert.throws(() => new ProductPrice(-1, 'USD'), /Price cannot be negative/);
    });

    it('should throw if compareAtPrice is less than price', () => {
      assert.throws(() => new ProductPrice(10, 'USD', 9), /Compare-at price must be greater than or equal to price/);
    });

    it('should throw if costPrice is negative', () => {
      assert.throws(() => new ProductPrice(10, 'USD', undefined, -5), /Cost price cannot be negative/);
    });
  });
});
