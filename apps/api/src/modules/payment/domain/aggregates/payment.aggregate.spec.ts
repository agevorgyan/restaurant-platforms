import { Payment, PaymentProps } from './payment.aggregate';
import { PaymentIntentReference } from '../value-objects/payment-intent-reference.value-object';
import { PaymentReference } from '../value-objects/payment-reference.value-object';
import { PaymentAmount } from '../value-objects/payment-amount.value-object';
import { PaymentStatusEnum } from '../value-objects/payment-status.value-object';
import { Authorization } from '../entities/authorization.entity';
import { AuthorizationReference } from '../value-objects/authorization-reference.value-object';
import { Capture } from '../entities/capture.entity';
import { CaptureReference } from '../value-objects/capture-reference.value-object';
import { Refund } from '../entities/refund.entity';
import { RefundReference } from '../value-objects/refund-reference.value-object';
import { Chargeback } from '../entities/chargeback.entity';

describe('Payment Aggregate', () => {
  const getValidProps = (): Omit<PaymentProps, 'status' | 'version' | 'captures' | 'refunds' | 'chargebacks' | 'settlementReferences' | 'createdAt' | 'updatedAt'> => {
    return {
      paymentIntentId: PaymentIntentReference.create('pi_123'),
      orderId: PaymentReference.create('order_123'),
      pricingSnapshotId: PaymentReference.create('ps_123'),
      orderQuotationId: PaymentReference.create('oq_123'),
      amount: new PaymentAmount(1500, 'USD')
    };
  };

  it('should create a valid Payment', () => {
    const payment = Payment.create(getValidProps());
    
    expect(payment.id).toBeDefined();
    expect(payment.status.value).toBe(PaymentStatusEnum.CREATED);
    expect(payment.version.value).toBe(1);
    expect(payment.domainEvents[0].constructor.name).toBe('PaymentCreatedEvent');
  });

  describe('Authorization', () => {
    it('should successfully authorize payment', () => {
      const payment = Payment.create(getValidProps());
      
      const auth = Authorization.create(
        AuthorizationReference.create('auth_123'),
        new PaymentAmount(1500, 'USD'),
        new Date(Date.now() + 100000)
      );
      
      payment.authorize(auth);
      
      expect(payment.status.value).toBe(PaymentStatusEnum.AUTHORIZED);
      expect(payment.authorization).toBeDefined();
    });

    it('should reject a second authorization if one is already active', () => {
      const payment = Payment.create(getValidProps());
      const auth = Authorization.create(
        AuthorizationReference.create('auth_123'),
        new PaymentAmount(1500, 'USD'),
        new Date(Date.now() + 100000)
      );
      payment.authorize(auth);
      
      expect(() => payment.authorize(auth)).toThrow('Payment already has an active authorization');
    });
  });

  describe('Capture', () => {
    it('should successfully partially and fully capture', () => {
      const payment = Payment.create(getValidProps());
      const auth = Authorization.create(
        AuthorizationReference.create('auth_123'),
        new PaymentAmount(1500, 'USD'),
        new Date(Date.now() + 100000)
      );
      payment.authorize(auth);

      // Partial
      const cap1 = Capture.create(CaptureReference.create('cap_1'), new PaymentAmount(500, 'USD'));
      payment.capture(cap1);
      expect(payment.status.value).toBe(PaymentStatusEnum.PARTIALLY_CAPTURED);

      // Full
      const cap2 = Capture.create(CaptureReference.create('cap_2'), new PaymentAmount(1000, 'USD'));
      payment.capture(cap2);
      expect(payment.status.value).toBe(PaymentStatusEnum.CAPTURED);
    });

    it('should reject capture exceeding authorization amount', () => {
      const payment = Payment.create(getValidProps());
      const auth = Authorization.create(
        AuthorizationReference.create('auth_123'),
        new PaymentAmount(1500, 'USD'),
        new Date(Date.now() + 100000)
      );
      payment.authorize(auth);

      const cap = Capture.create(CaptureReference.create('cap_1'), new PaymentAmount(1600, 'USD'));
      expect(() => payment.capture(cap)).toThrow('Total captured amount cannot exceed the authorized amount');
    });
  });

  describe('Refund', () => {
    it('should successfully partially and fully refund', () => {
      const payment = Payment.create(getValidProps());
      const auth = Authorization.create(
        AuthorizationReference.create('auth_123'),
        new PaymentAmount(1500, 'USD'),
        new Date(Date.now() + 100000)
      );
      payment.authorize(auth);
      
      const cap = Capture.create(CaptureReference.create('cap_1'), new PaymentAmount(1500, 'USD'));
      payment.capture(cap);

      // Partial refund
      const refund1 = Refund.create(RefundReference.create('ref_1'), new PaymentAmount(500, 'USD'), 'Customer request');
      payment.refund(refund1);
      expect(payment.status.value).toBe(PaymentStatusEnum.PARTIALLY_REFUNDED);

      // Full refund
      const refund2 = Refund.create(RefundReference.create('ref_2'), new PaymentAmount(1000, 'USD'), 'Customer request');
      payment.refund(refund2);
      expect(payment.status.value).toBe(PaymentStatusEnum.REFUNDED);
    });

    it('should reject refund exceeding captured amount', () => {
      const payment = Payment.create(getValidProps());
      const auth = Authorization.create(
        AuthorizationReference.create('auth_123'),
        new PaymentAmount(1500, 'USD'),
        new Date(Date.now() + 100000)
      );
      payment.authorize(auth);
      
      const cap = Capture.create(CaptureReference.create('cap_1'), new PaymentAmount(1500, 'USD'));
      payment.capture(cap);

      const overRefund = Refund.create(RefundReference.create('ref_1'), new PaymentAmount(2000, 'USD'), 'Customer request');
      expect(() => payment.refund(overRefund)).toThrow('Total refunded amount cannot exceed the total captured amount');
    });
  });

  describe('Chargeback', () => {
    it('should successfully record chargeback linked to capture', () => {
      const payment = Payment.create(getValidProps());
      const auth = Authorization.create(
        AuthorizationReference.create('auth_123'),
        new PaymentAmount(1500, 'USD'),
        new Date(Date.now() + 100000)
      );
      payment.authorize(auth);
      
      const captureRef = CaptureReference.create('cap_1');
      const cap = Capture.create(captureRef, new PaymentAmount(1500, 'USD'));
      payment.capture(cap);

      const chargeback = Chargeback.create(captureRef, new PaymentAmount(1500, 'USD'), 'Fraud');
      payment.addChargeback(chargeback);
      
      expect(payment.status.value).toBe(PaymentStatusEnum.CHARGEBACK);
    });

    it('should reject chargeback with invalid capture reference', () => {
      const payment = Payment.create(getValidProps());
      const auth = Authorization.create(
        AuthorizationReference.create('auth_123'),
        new PaymentAmount(1500, 'USD'),
        new Date(Date.now() + 100000)
      );
      payment.authorize(auth);
      
      const cap = Capture.create(CaptureReference.create('cap_1'), new PaymentAmount(1500, 'USD'));
      payment.capture(cap);

      const chargeback = Chargeback.create(CaptureReference.create('invalid_cap'), new PaymentAmount(1500, 'USD'), 'Fraud');
      expect(() => payment.addChargeback(chargeback)).toThrow('Chargeback must reference a valid capture');
    });
  });
});
