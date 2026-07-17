import { describe, it } from 'node:test';
import * as assert from 'node:assert';
import { CartTotals } from './cart-totals.value-object';
import { CartExpiration } from './cart-expiration.value-object';
import { CartStatus } from './cart-status.value-object';

describe('Cart Domain Value Objects', () => {
  describe('CartTotals', () => {
    it('should calculate grand total natively as sum of cart items', () => {
      const lineTotals = [10.50, 20.00, 5.25];
      const totals = new CartTotals(lineTotals);
      
      assert.strictEqual(totals.itemsTotal, 35.75);
      assert.strictEqual(totals.grandTotal, 35.75);
    });

    it('should handle empty items array gracefully', () => {
      const totals = new CartTotals([]);
      assert.strictEqual(totals.itemsTotal, 0);
      assert.strictEqual(totals.grandTotal, 0);
    });
  });

  describe('CartExpiration', () => {
    it('should determine if cart is not expired', () => {
      const futureDate = new Date();
      futureDate.setMinutes(futureDate.getMinutes() + 30);
      const expiration = new CartExpiration(futureDate);
      
      assert.strictEqual(expiration.isExpired(), false);
    });

    it('should determine if cart is expired natively', () => {
      const pastDate = new Date();
      pastDate.setMinutes(pastDate.getMinutes() - 30);
      const expiration = new CartExpiration(pastDate);
      
      assert.strictEqual(expiration.isExpired(), true);
    });

    it('should throw if no date is provided', () => {
      assert.throws(() => new CartExpiration(null as any), /Expiration date is required/);
    });
  });

  describe('CartStatus', () => {
    it('should enforce validity bounds strictly', () => {
      const active = new CartStatus('Active');
      assert.strictEqual(active.value, 'Active');
      
      assert.throws(() => new CartStatus('Pending' as any), /Invalid Cart Status: Pending/);
    });

    it('should enforce read-only conditions natively', () => {
      const active = new CartStatus('Active');
      const checkedOut = new CartStatus('CheckedOut');
      const expired = new CartStatus('Expired');
      const abandoned = new CartStatus('Abandoned');

      assert.strictEqual(active.isReadOnly(), false);
      assert.strictEqual(checkedOut.isReadOnly(), true);
      assert.strictEqual(expired.isReadOnly(), true);
      assert.strictEqual(abandoned.isReadOnly(), true);
    });

    it('should restrict checkout mathematically', () => {
      const active = new CartStatus('Active');
      const abandoned = new CartStatus('Abandoned');

      assert.strictEqual(active.canCheckout(), true);
      assert.strictEqual(abandoned.canCheckout(), false);
    });
  });
});
