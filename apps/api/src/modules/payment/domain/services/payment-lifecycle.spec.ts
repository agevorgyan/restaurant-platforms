import { Payment, PaymentProps } from '../aggregates/payment.aggregate';
import { PaymentLifecycleManager } from './payment-lifecycle-manager.service';
import { PaymentIntentReference } from '../value-objects/payment-intent-reference.value-object';
import { PaymentReference } from '../value-objects/payment-reference.value-object';
import { PaymentAmount } from '../value-objects/payment-amount.value-object';
import { Authorization } from '../entities/authorization.entity';
import { AuthorizationReference } from '../value-objects/authorization-reference.value-object';
import { PaymentStatusEnum } from '../value-objects/payment-status.value-object';
import { IdempotencyRecord } from '../value-objects/idempotency-record.value-object';
import { Capture } from '../entities/capture.entity';
import { CaptureReference } from '../value-objects/capture-reference.value-object';

describe('Payment Lifecycle, Idempotency & Concurrency', () => {
  const lifecycleManager = new PaymentLifecycleManager();

  const getValidProps = (): Omit<PaymentProps, 'status' | 'version' | 'captures' | 'refunds' | 'chargebacks' | 'settlementReferences' | 'createdAt' | 'updatedAt'> => {
    return {
      paymentIntentId: PaymentIntentReference.create('pi_123'),
      orderId: PaymentReference.create('order_123'),
      pricingSnapshotId: PaymentReference.create('ps_123'),
      orderQuotationId: PaymentReference.create('oq_123'),
      amount: new PaymentAmount(1500, 'USD')
    };
  };

  describe('Lifecycle State Transitions', () => {
    it('should successfully transition from CREATED to AUTHORIZED to CAPTURED', () => {
      const payment = Payment.create(getValidProps());
      expect(payment.status.value).toBe(PaymentStatusEnum.CREATED);
      expect(payment.version.value).toBe(1);

      const auth = Authorization.create(
        AuthorizationReference.create('auth_1'),
        new PaymentAmount(1500, 'USD'),
        new Date(Date.now() + 100000)
      );

      // Transition to Pending Authorization
      const resultPending = lifecycleManager.processPendingAuthorization(payment, 1, 'idem_pending', null);
      expect(resultPending.payment.status.value).toBe(PaymentStatusEnum.PENDING_AUTHORIZATION);
      expect(resultPending.payment.version.value).toBe(2);

      // Transition to Authorized
      const resultAuth = lifecycleManager.processAuthorization(payment, auth, 2, 'idem_1', null);
      expect(resultAuth.payment.status.value).toBe(PaymentStatusEnum.AUTHORIZED);
      expect(resultAuth.payment.version.value).toBe(3);

      const cap = Capture.create(CaptureReference.create('cap_1'), new PaymentAmount(1500, 'USD'));

      // Transition to Captured
      const resultCap = lifecycleManager.processCapture(payment, cap, 3, 'idem_2', null);
      expect(resultCap.payment.status.value).toBe(PaymentStatusEnum.CAPTURED);
      expect(resultCap.payment.version.value).toBe(4);
    });

    it('should fail illegal transition: CREATED -> CAPTURED', () => {
      const payment = Payment.create(getValidProps());
      const cap = Capture.create(CaptureReference.create('cap_1'), new PaymentAmount(1500, 'USD'));

      expect(() => {
        lifecycleManager.processCapture(payment, cap, 1, 'idem_1', null);
      }).toThrow('Cannot capture without an active authorization'); 
    });
  });

  describe('Optimistic Concurrency', () => {
    it('should fail operation if expected version does not match aggregate version', () => {
      const payment = Payment.create(getValidProps());
      const auth = Authorization.create(
        AuthorizationReference.create('auth_1'),
        new PaymentAmount(1500, 'USD'),
        new Date(Date.now() + 100000)
      );

      lifecycleManager.processPendingAuthorization(payment, 1, 'idem_pending', null);

      expect(() => {
        // Expected version is 3, but payment is at version 2
        lifecycleManager.processAuthorization(payment, auth, 3, 'idem_1', null);
      }).toThrow('Concurrency exception: Expected version 3 but got 2');
    });
  });

  describe('Idempotency', () => {
    it('should return cached response and not increment version if idempotency record exists', () => {
      const payment = Payment.create(getValidProps());

      lifecycleManager.processPendingAuthorization(payment, 1, 'idem_pending', null);
      const versionAfterPending = payment.version.value;

      const auth = Authorization.create(
        AuthorizationReference.create('auth_1'),
        new PaymentAmount(1500, 'USD'),
        new Date(Date.now() + 100000)
      );

      // Simulate an existing record indicating this auth was already processed
      const existingRecord = IdempotencyRecord.create('idem_1', payment);

      const result = lifecycleManager.processAuthorization(payment, auth, versionAfterPending, 'idem_1', existingRecord);
      
      expect(result.isCached).toBe(true);
      expect(result.payment.version.value).toBe(versionAfterPending); // State wasn't changed
      expect(result.payment.status.value).toBe(PaymentStatusEnum.PENDING_AUTHORIZATION); // Auth wasn't applied
    });

    it('should apply operation and return new idempotency record if not cached', () => {
      const payment = Payment.create(getValidProps());
      
      lifecycleManager.processPendingAuthorization(payment, 1, 'idem_pending', null);
      
      const auth = Authorization.create(
        AuthorizationReference.create('auth_1'),
        new PaymentAmount(1500, 'USD'),
        new Date(Date.now() + 100000)
      );

      const result = lifecycleManager.processAuthorization(payment, auth, 2, 'idem_new', null);
      
      expect(result.isCached).toBe(false);
      expect(result.idempotencyRecord).toBeDefined();
      expect(result.idempotencyRecord?.key).toBe('idem_new');
      expect(result.payment.status.value).toBe(PaymentStatusEnum.AUTHORIZED);
    });
  });
});
