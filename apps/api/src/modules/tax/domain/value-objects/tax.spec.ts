import { describe, it } from 'node:test';
import * as assert from 'node:assert';
import { TaxRule } from './tax-rule.value-object';
import { ServiceCharge } from './service-charge.value-object';
import { DeliveryFee } from './delivery-fee.value-object';
import { TipPolicy } from './tip-policy.value-object';

describe('Tax Domain Value Objects', () => {
  describe('TaxRule', () => {
    it('should validate tax percentage bounds', () => {
      // Valid
      assert.doesNotThrow(() => new TaxRule('VAT', 'VAT', 20));
      assert.doesNotThrow(() => new TaxRule('Sales Tax', 'SalesTax', 0));
      // Invalid
      assert.throws(() => new TaxRule('Invalid High', 'VAT', 150), /Tax percentages must be between 0 and 100/);
      assert.throws(() => new TaxRule('Invalid Low', 'VAT', -5), /Tax percentages must be between 0 and 100/);
    });

    it('should validate tax type', () => {
      // @ts-expect-error Testing invalid cast
      assert.throws(() => new TaxRule('Test', 'InvalidType', 10), /Invalid Tax Type/);
    });
  });

  describe('ServiceCharge', () => {
    it('should validate fixed service charge bounds', () => {
      assert.doesNotThrow(() => new ServiceCharge('Cover', 'Fixed', 10));
      assert.throws(() => new ServiceCharge('Cover', 'Fixed', -5), /Fixed service charges must be zero or greater/);
    });

    it('should validate percentage service charge bounds', () => {
      assert.doesNotThrow(() => new ServiceCharge('Gratuity', 'Percentage', 15));
      assert.throws(() => new ServiceCharge('Gratuity', 'Percentage', 150), /Service charge percentages must be between 0 and 100/);
      assert.throws(() => new ServiceCharge('Gratuity', 'Percentage', -5), /Service charge percentages must be between 0 and 100/);
    });
  });

  describe('DeliveryFee', () => {
    it('should validate delivery fee bounds', () => {
      assert.doesNotThrow(() => new DeliveryFee(0));
      assert.doesNotThrow(() => new DeliveryFee(5));
      assert.throws(() => new DeliveryFee(-2), /Delivery fee must be zero or greater/);
    });
  });

  describe('TipPolicy', () => {
    it('should validate tip percentages', () => {
      assert.doesNotThrow(() => new TipPolicy(true, [10, 15, 20]));
      assert.doesNotThrow(() => new TipPolicy(false)); // empty array is valid

      assert.throws(() => new TipPolicy(true, [10, 150]), /Suggested tip percentages must be between 0 and 100/);
      assert.throws(() => new TipPolicy(true, [-5, 10]), /Suggested tip percentages must be between 0 and 100/);
    });
  });
});
