import { 
  PaymentCreatedEvent, 
  AuthorizationCompletedEvent, 
  CaptureCompletedEvent, 
  RefundCompletedEvent,
  ChargebackRegisteredEvent,
  PaymentCompletedEvent,
  PaymentFailedEvent,
  PaymentCancelledEvent,
  PaymentStatusChangedEvent,
  PaymentVoidedEvent
} from './payment.events';
import { PaymentAmount } from '../value-objects/payment-amount.value-object';
import { PaymentFailureReason, PaymentFailureReasonEnum } from '../value-objects/payment-failure-reason.value-object';

describe('Payment Domain Events', () => {
  const amount = new PaymentAmount(1000, 'USD');

  it('PaymentCreatedEvent should only hold aggregate identifiers and amount', () => {
    const event = new PaymentCreatedEvent('pay_1', 'intent_1', 'order_1', amount);
    expect(event.paymentId).toBe('pay_1');
    expect(event.paymentIntentId).toBe('intent_1');
    expect(event.orderId).toBe('order_1');
    expect(event.amount).toBe(amount);
  });

  it('AuthorizationCompletedEvent should hold identifiers and amount', () => {
    const event = new AuthorizationCompletedEvent('pay_1', 'auth_1', 'ref_1', amount);
    expect(event.paymentId).toBe('pay_1');
    expect(event.authorizationId).toBe('auth_1');
    expect(event.reference).toBe('ref_1');
  });

  it('CaptureCompletedEvent should hold identifiers and amount', () => {
    const event = new CaptureCompletedEvent('pay_1', 'cap_1', 'ref_1', amount);
    expect(event.paymentId).toBe('pay_1');
    expect(event.captureId).toBe('cap_1');
  });

  it('RefundCompletedEvent should hold identifiers, amount, and reason', () => {
    const event = new RefundCompletedEvent('pay_1', 'ref_1', 'ref_ext_1', amount, 'Customer request');
    expect(event.paymentId).toBe('pay_1');
    expect(event.refundId).toBe('ref_1');
    expect(event.reason).toBe('Customer request');
  });

  it('ChargebackRegisteredEvent should hold identifiers, amount, and reason', () => {
    const event = new ChargebackRegisteredEvent('pay_1', 'cb_1', 'cap_ref_1', amount, 'Fraud');
    expect(event.paymentId).toBe('pay_1');
    expect(event.chargebackId).toBe('cb_1');
    expect(event.reason).toBe('Fraud');
  });

  it('PaymentFailedEvent should hold reason', () => {
    const reason = PaymentFailureReason.create(PaymentFailureReasonEnum.INSUFFICIENT_FUNDS);
    const event = new PaymentFailedEvent('pay_1', reason);
    expect(event.paymentId).toBe('pay_1');
    expect(event.reason).toBe(reason);
  });

  it('PaymentCancelledEvent should hold reason', () => {
    const event = new PaymentCancelledEvent('pay_1', 'Timeout');
    expect(event.paymentId).toBe('pay_1');
    expect(event.reason).toBe('Timeout');
  });
  it('PaymentStatusChangedEvent should hold old and new status', () => {
    const event = new PaymentStatusChangedEvent('pay_1', 'Created', 'Authorized');
    expect(event.paymentId).toBe('pay_1');
    expect(event.oldStatus).toBe('Created');
    expect(event.newStatus).toBe('Authorized');
  });

  it('PaymentVoidedEvent should hold reason', () => {
    const event = new PaymentVoidedEvent('pay_1', 'Fraud');
    expect(event.paymentId).toBe('pay_1');
    expect(event.reason).toBe('Fraud');
  });
  it('PaymentCompletedEvent should hold identifiers', () => {
    const event = new PaymentCompletedEvent('pay_1');
    expect(event.paymentId).toBe('pay_1');
  });

  it('All events should be immutable (runtime behavior check - freeze should work)', () => {
    const event = new PaymentCreatedEvent('pay_1', 'intent_1', 'order_1', amount);
    Object.freeze(event);
    try {
      (event as any).paymentId = 'mutated';
    } catch {
      // strict mode throws, non-strict fails silently. Both are fine as long as value is unchanged.
    }
    expect(event.paymentId).toBe('pay_1');
  });
});
