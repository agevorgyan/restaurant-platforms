import { describe, it } from 'node:test';
import * as assert from 'node:assert';
import { DocumentNumber } from './document-number.value-object';
import { DocumentStatus } from './document-status.value-object';
import { CustomerSnapshot } from './customer-snapshot.value-object';
import { TaxSummary } from './tax-summary.value-object';

describe('Invoice & Receipt Domain', () => {
  describe('DocumentNumber', () => {
    it('should throw if empty', () => {
      assert.throws(() => new DocumentNumber(''), /cannot be empty/);
      assert.throws(() => new DocumentNumber('   '), /cannot be empty/);
      assert.doesNotThrow(() => new DocumentNumber('INV-001'));
    });
  });

  describe('DocumentStatus', () => {
    it('should identify terminal states natively', () => {
      assert.strictEqual(new DocumentStatus('Cancelled').isTerminal(), true);
      assert.strictEqual(new DocumentStatus('Voided').isTerminal(), true);
      assert.strictEqual(new DocumentStatus('Issued').isTerminal(), false);
    });

    it('should allow valid transitions', () => {
      const issued = new DocumentStatus('Issued');
      assert.strictEqual(issued.canTransitionTo('Cancelled'), true);
      assert.strictEqual(issued.canTransitionTo('Voided'), true);
      
      const cancelled = new DocumentStatus('Cancelled');
      assert.strictEqual(cancelled.canTransitionTo('Issued'), false);
    });

    it('should strictly reject invalid inputs', () => {
      assert.throws(() => new DocumentStatus('Unknown' as any), /Invalid Document Status/);
    });
  });

  describe('CustomerSnapshot', () => {
    it('should validate presence of name and ID', () => {
      assert.doesNotThrow(() => new CustomerSnapshot('1', 'John Doe'));
      assert.throws(() => new CustomerSnapshot('', 'John Doe'), /Customer ID is required/);
      assert.throws(() => new CustomerSnapshot('1', ''), /Customer name is required/);
    });
  });

  describe('TaxSummary', () => {
    it('should calculate breakdown accurately', () => {
      const breakdown = [
        { taxName: 'VAT', taxRate: 20, taxableAmount: 1000, taxAmount: 200 },
        { taxName: 'Sales Tax', taxRate: 5, taxableAmount: 1000, taxAmount: 50 }
      ];

      assert.doesNotThrow(() => new TaxSummary(breakdown, 250));
    });

    it('should reject inaccurate calculation mapping mathematically', () => {
      const breakdown = [
        { taxName: 'VAT', taxRate: 20, taxableAmount: 1000, taxAmount: 200 }
      ];

      assert.throws(() => new TaxSummary(breakdown, 500), /Total tax amount does not match/);
    });
  });
});
