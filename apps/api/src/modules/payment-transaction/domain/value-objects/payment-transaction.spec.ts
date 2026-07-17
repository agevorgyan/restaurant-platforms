import { describe, it } from 'node:test';
import * as assert from 'node:assert';
import { TransactionAmount } from './transaction-amount.value-object';
import {
  TransactionReference,
  IdempotencyKey,
  TransactionType,
  TransactionStatus,
  FailureReason
} from './transaction-strings.value-object';

describe('Payment Transaction Domain', () => {
  describe('TransactionAmount', () => {
    it('should throw if amount is less than or equal to zero', () => {
      assert.throws(() => new TransactionAmount(0, 'USD'), /amount must be greater than zero/);
      assert.throws(() => new TransactionAmount(-500, 'USD'), /amount must be greater than zero/);
    });

    it('should throw if amount is not an integer', () => {
      assert.throws(() => new TransactionAmount(100.5, 'USD'), /amount must be an integer/);
    });

    it('should compare currencies correctly', () => {
      const a1 = new TransactionAmount(100, 'USD');
      const a2 = new TransactionAmount(200, 'USD');
      const a3 = new TransactionAmount(100, 'EUR');
      
      assert.strictEqual(a1.isSameCurrency(a2), true);
      assert.strictEqual(a1.isSameCurrency(a3), false);
    });
  });

  describe('Transaction Strings Value Objects', () => {
    it('should reject empty strings for Reference and Idempotency', () => {
      assert.throws(() => new TransactionReference(' '), /cannot be empty/);
      assert.throws(() => new IdempotencyKey(''), /cannot be empty/);
    });

    it('should validate TransactionType Enum strictly', () => {
      assert.doesNotThrow(() => new TransactionType('PartialCapture'));
      assert.throws(() => new TransactionType('Unknown' as any), /Invalid Transaction Type/);
    });

    it('should validate TransactionStatus Enum strictly', () => {
      assert.doesNotThrow(() => new TransactionStatus('Pending'));
      assert.throws(() => new TransactionStatus('Finished' as any), /Invalid Transaction Status/);
    });

    it('should validate FailureReason bounds', () => {
      assert.doesNotThrow(() => new FailureReason('insufficient_funds', 'Not enough funds'));
      assert.throws(() => new FailureReason('', 'Not enough funds'), /must contain a code and message/);
    });
  });
});
