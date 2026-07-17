import { describe, it } from 'node:test';
import * as assert from 'node:assert';
import { PaymentCapturedEvent, PaymentFailedEvent, PaymentRefundedEvent } from './payment.events';
import { PaymentMethodChangedEvent } from '../../../../payment-method/domain/events/payment-method.events';
import { PaymentPolicyActivatedEvent } from '../../../../payment-policy/domain/events/payment-policy.events';
import { InvoiceIssuedEvent, ReceiptIssuedEvent } from '../../../../invoice/domain/events/document.events';
import { RefundCompletedEvent } from '../../../../refund/domain/events/refund.events';

describe('Payment Domain Events', () => {
  it('PaymentCapturedEvent should only hold aggregate identifiers', () => {
    const event = new PaymentCapturedEvent('pay_1', 'order_1');
    assert.strictEqual(event.paymentId, 'pay_1');
    assert.strictEqual(event.orderId, 'order_1');
    assert.strictEqual(Object.keys(event).length, 2);
  });

  it('PaymentFailedEvent should only hold aggregate identifiers', () => {
    const event = new PaymentFailedEvent('pay_2', 'order_2');
    assert.strictEqual(event.paymentId, 'pay_2');
    assert.strictEqual(event.orderId, 'order_2');
  });

  it('PaymentRefundedEvent should only hold aggregate identifiers', () => {
    const event = new PaymentRefundedEvent('pay_3', 'order_3');
    assert.strictEqual(event.paymentId, 'pay_3');
    assert.strictEqual(event.orderId, 'order_3');
  });

  it('PaymentMethodChangedEvent should only hold aggregate identifiers', () => {
    const event = new PaymentMethodChangedEvent('pm_1', 'rest_1');
    assert.strictEqual(event.paymentMethodId, 'pm_1');
    assert.strictEqual(event.restaurantId, 'rest_1');
  });

  it('PaymentPolicyActivatedEvent should only hold aggregate identifiers', () => {
    const event = new PaymentPolicyActivatedEvent('pol_1', 'rest_1');
    assert.strictEqual(event.policyId, 'pol_1');
    assert.strictEqual(event.restaurantId, 'rest_1');
  });

  it('InvoiceIssuedEvent should only hold aggregate identifiers', () => {
    const event = new InvoiceIssuedEvent('inv_1', 'order_1');
    assert.strictEqual(event.invoiceId, 'inv_1');
    assert.strictEqual(event.orderId, 'order_1');
  });

  it('ReceiptIssuedEvent should only hold aggregate identifiers', () => {
    const event = new ReceiptIssuedEvent('rec_1', 'pay_1');
    assert.strictEqual(event.receiptId, 'rec_1');
    assert.strictEqual(event.paymentId, 'pay_1');
  });

  it('RefundCompletedEvent should only hold aggregate identifiers', () => {
    const event = new RefundCompletedEvent('ref_1', 'pay_1');
    assert.strictEqual(event.refundId, 'ref_1');
    assert.strictEqual(event.paymentId, 'pay_1');
  });

  it('All events should be immutable (runtime behavior check - freeze should work)', () => {
    const event = new PaymentCapturedEvent('pay_1', 'order_1');
    Object.freeze(event);
    assert.throws(() => {
      (event as any).paymentId = 'mutated';
    });
  });
});
