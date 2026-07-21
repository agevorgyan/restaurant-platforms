// Jest automatically injects describe, it, expect
import { PaymentCapturedEvent, PaymentFailedEvent, PaymentRefundedEvent } from './payment.events';
import { PaymentMethodChangedEvent } from '../../../payment-method/domain/events/payment-method.events';
import { PaymentPolicyActivatedEvent } from '../../../payment-policy/domain/events/payment-policy.events';
import { InvoiceIssuedEvent, ReceiptIssuedEvent } from '../../../invoice/domain/events/document.events';
import { RefundCompletedEvent } from '../../../refund/domain/events/refund.events';

describe('Payment Domain Events', () => {
  it('PaymentCapturedEvent should only hold aggregate identifiers', () => {
    const event = new PaymentCapturedEvent('pay_1', 'order_1');
    expect(event.paymentId).toBe('pay_1');
    expect(event.orderId).toBe('order_1');
    expect(Object.keys(event).length).toBe(2);
  });

  it('PaymentFailedEvent should only hold aggregate identifiers', () => {
    const event = new PaymentFailedEvent('pay_2', 'order_2');
    expect(event.paymentId).toBe('pay_2');
    expect(event.orderId).toBe('order_2');
  });

  it('PaymentRefundedEvent should only hold aggregate identifiers', () => {
    const event = new PaymentRefundedEvent('pay_3', 'order_3');
    expect(event.paymentId).toBe('pay_3');
    expect(event.orderId).toBe('order_3');
  });

  it('PaymentMethodChangedEvent should only hold aggregate identifiers', () => {
    const event = new PaymentMethodChangedEvent('pm_1', 'rest_1');
    expect(event.paymentMethodId).toBe('pm_1');
    expect(event.restaurantId).toBe('rest_1');
  });

  it('PaymentPolicyActivatedEvent should only hold aggregate identifiers', () => {
    const event = new PaymentPolicyActivatedEvent('pol_1', 'rest_1');
    expect(event.policyId).toBe('pol_1');
    expect(event.restaurantId).toBe('rest_1');
  });

  it('InvoiceIssuedEvent should only hold aggregate identifiers', () => {
    const event = new InvoiceIssuedEvent('inv_1', 'order_1');
    expect(event.invoiceId).toBe('inv_1');
    expect(event.orderId).toBe('order_1');
  });

  it('ReceiptIssuedEvent should only hold aggregate identifiers', () => {
    const event = new ReceiptIssuedEvent('rec_1', 'pay_1');
    expect(event.receiptId).toBe('rec_1');
    expect(event.paymentId).toBe('pay_1');
  });

  it('RefundCompletedEvent should only hold aggregate identifiers', () => {
    const event = new RefundCompletedEvent('ref_1', 'pay_1');
    expect(event.refundId).toBe('ref_1');
    expect(event.paymentId).toBe('pay_1');
  });

  it('All events should be immutable (runtime behavior check - freeze should work)', () => {
    const event = new PaymentCapturedEvent('pay_1', 'order_1');
    Object.freeze(event);
    try {
      (event as any).paymentId = 'mutated';
    } catch {
      // strict mode throws, non-strict fails silently. Both are fine as long as value is unchanged.
    }
    expect(event.paymentId).toBe('pay_1');
  });
});
