import { describe, it } from 'node:test';
import * as assert from 'node:assert';
import { RefundAmount } from './refund-amount.value-object';
import { RefundReason } from './refund-reason.value-object';
import { RefundStatus } from './refund-status.value-object';

describe('Refund Domain', () => {
  describe('RefundAmount', () => {
    it('should throw if amount is less than or equal to zero', () => {
      assert.throws(() => new RefundAmount(0, 'USD'), /amount must be greater than zero/);
      assert.throws(() => new RefundAmount(-100, 'USD'), /amount must be greater than zero/);
    });

    it('should throw if amount is not an integer', () => {
      assert.throws(() => new RefundAmount(100.5, 'USD'), /amount must be an integer/);
    });

    it('should compare currencies correctly', () => {
      const a1 = new RefundAmount(100, 'USD');
      assert.strictEqual(a1.isSameCurrency('USD'), true);
      assert.strictEqual(a1.isSameCurrency('EUR'), false);
    });
  });

  describe('RefundReason', () => {
    it('should validate allowed reasons', () => {
      assert.doesNotThrow(() => new RefundReason('CustomerRequest'));
      assert.doesNotThrow(() => new RefundReason('Fraud'));
      assert.throws(() => new RefundReason('UnknownReason' as any), /Invalid Refund Reason/);
    });
  });

  describe('RefundStatus', () => {
    it('should identify terminal states correctly', () => {
      assert.strictEqual(new RefundStatus('Completed').isTerminal(), true);
      assert.strictEqual(new RefundStatus('Rejected').isTerminal(), true);
      assert.strictEqual(new RefundStatus('Cancelled').isTerminal(), true);
      assert.strictEqual(new RefundStatus('Processing').isTerminal(), false);
    });

    it('should allow valid transitions', () => {
      const req = new RefundStatus('Requested');
      assert.strictEqual(req.canTransitionTo('Approved'), true);
      assert.strictEqual(req.canTransitionTo('Rejected'), true);
      assert.strictEqual(req.canTransitionTo('Processing'), false);

      const app = new RefundStatus('Approved');
      assert.strictEqual(app.canTransitionTo('Processing'), true);
      assert.strictEqual(app.canTransitionTo('Completed'), false);

      const pro = new RefundStatus('Processing');
      assert.strictEqual(pro.canTransitionTo('Completed'), true);
      assert.strictEqual(pro.canTransitionTo('Approved'), false);
    });

    it('should block all transitions from terminal states', () => {
      const com = new RefundStatus('Completed');
      assert.strictEqual(com.canTransitionTo('Processing'), false);
      assert.strictEqual(com.canTransitionTo('Cancelled'), false);
    });
  });
});
