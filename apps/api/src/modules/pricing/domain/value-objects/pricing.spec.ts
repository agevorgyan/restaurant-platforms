import { describe, it } from 'node:test';
import * as assert from 'node:assert';
import { Money } from './money.value-object';
import { PriceAdjustment } from './price-adjustment.value-object';
import { PricingEngine } from '../services/pricing-engine.service';
import { PricingContext } from './pricing-context.value-object';

describe('Pricing Domain', () => {
  describe('Money Value Object', () => {
    it('should throw if amount is not integer', () => {
      assert.throws(() => new Money(10.5, 'USD'), /Money amount must be an integer/);
    });

    it('should calculate percentages correctly using rounding', () => {
      const money = new Money(1000, 'USD'); // $10.00
      const result = money.percentage(15);
      assert.strictEqual(result.amount, 150); // $1.50
    });

    it('should throw on currency mismatch', () => {
      const m1 = new Money(100, 'USD');
      const m2 = new Money(100, 'EUR');
      assert.throws(() => m1.add(m2), /Currency mismatch/);
    });
  });

  describe('PriceAdjustment', () => {
    it('should throw if non-discount is negative', () => {
      assert.throws(() => new PriceAdjustment('Tip', new Money(-500, 'USD'), 'Tip'), /Tip cannot be negative/);
      assert.doesNotThrow(() => new PriceAdjustment('Promo', new Money(-500, 'USD'), 'Discount'));
    });
  });

  describe('PricingEngine Pipeline', () => {
    it('should calculate total pipeline deterministically', () => {
      const engine = new PricingEngine();
      
      const context = new PricingContext(
        'USD',
        [
          {
            id: 'item1',
            unitPrice: new Money(1000, 'USD'), // $10
            quantity: 2, // Subtotal $20
            modifiers: [
              {
                id: 'mod1',
                priceAdjustment: new Money(200, 'USD'), // $2
                quantity: 1 // 1 modifier * 2 items = $4. Subtotal now $24.
              }
            ]
          }
        ],
        [
          { id: 'p1', type: 'Percentage', value: 10 } // 10% off $24 = $2.40 discount. After discount = $21.60
        ],
        {
          calculationMode: 'Exclusive',
          rules: [{ name: 'VAT', percentage: 20 }] // 20% tax on $21.60 = $4.32 tax.
        },
        [], // no service charges
        new Money(500, 'USD'), // $5 delivery
        new Money(200, 'USD')  // $2 tip
      );

      const breakdown = engine.calculate(context);

      assert.strictEqual(breakdown.subtotal.amount, 2400); // 2000 + 400
      assert.strictEqual(breakdown.modifierTotal.amount, 400);
      assert.strictEqual(breakdown.discountTotal.amount, 240);
      assert.strictEqual(breakdown.deliveryFee.amount, 500);
      assert.strictEqual(breakdown.tipTotal.amount, 200);

      // Taxable amount: subtotal(2400) - discount(240) + delivery(500) = 2660.
      // Wait, is delivery fee taxable? In the pipeline: taxableAmount = subtotalAfterDiscount.add(serviceChargeTotal).add(deliveryFee)
      // 2160 + 500 = 2660. 20% of 2660 = 532.
      assert.strictEqual(breakdown.taxTotal.amount, 532);

      // Grand total = taxableAmount(2660) + tax(532) + tip(200) = 3392.
      assert.strictEqual(breakdown.grandTotal.amount, 3392);
    });

    it('should prevent discounts from reducing subtotal below zero', () => {
      const engine = new PricingEngine();
      
      const context = new PricingContext(
        'USD',
        [
          {
            id: 'item1',
            unitPrice: new Money(1000, 'USD'),
            quantity: 1,
            modifiers: []
          }
        ],
        [
          { id: 'p1', type: 'FixedAmount', value: 1500 } // $15 discount on $10 item
        ]
      );

      const breakdown = engine.calculate(context);

      assert.strictEqual(breakdown.subtotal.amount, 1000);
      assert.strictEqual(breakdown.discountTotal.amount, 1000); // Caps at subtotal
      assert.strictEqual(breakdown.grandTotal.amount, 0); // No negative total
    });
  });
});
