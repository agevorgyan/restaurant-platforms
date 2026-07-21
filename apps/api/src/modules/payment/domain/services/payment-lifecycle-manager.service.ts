import { Payment } from '../aggregates/payment.aggregate';
import { PaymentTransitionManager } from './payment-transition-manager.service';
import { IdempotencyGuard } from './idempotency-guard.service';
import { PaymentConcurrencyGuard } from './payment-concurrency-guard.service';
import { IdempotencyRecord } from '../value-objects/idempotency-record.value-object';
import { Authorization } from '../entities/authorization.entity';
import { Capture } from '../entities/capture.entity';
import { Refund } from '../entities/refund.entity';
import { Chargeback } from '../entities/chargeback.entity';
import { PaymentFailureReason } from '../value-objects/payment-failure-reason.value-object';

export class PaymentLifecycleManager {
  private readonly transitionManager = new PaymentTransitionManager();
  private readonly idempotencyGuard = new IdempotencyGuard();
  private readonly concurrencyGuard = new PaymentConcurrencyGuard();

  public processPendingAuthorization(
    payment: Payment,
    expectedVersion: number,
    idempotencyKey: string,
    existingIdempotencyRecord: IdempotencyRecord | null
  ): { payment: Payment, idempotencyRecord?: IdempotencyRecord, isCached: boolean } {
    const result = this.idempotencyGuard.protect(idempotencyKey, existingIdempotencyRecord, () => {
      this.concurrencyGuard.validate(payment, expectedVersion);
      this.transitionManager.applyPendingAuthorization(payment);
      return payment;
    });
    return { payment: result.response, idempotencyRecord: result.newRecord, isCached: result.isCached };
  }

  public processAuthorization(
    payment: Payment, 
    authorization: Authorization, 
    expectedVersion: number,
    idempotencyKey: string,
    existingIdempotencyRecord: IdempotencyRecord | null
  ): { payment: Payment, idempotencyRecord?: IdempotencyRecord, isCached: boolean } {
    const result = this.idempotencyGuard.protect(idempotencyKey, existingIdempotencyRecord, () => {
      this.concurrencyGuard.validate(payment, expectedVersion);
      this.transitionManager.applyAuthorization(payment, authorization);
      return payment;
    });
    return { payment: result.response, idempotencyRecord: result.newRecord, isCached: result.isCached };
  }

  public processCapture(
    payment: Payment, 
    capture: Capture, 
    expectedVersion: number,
    idempotencyKey: string,
    existingIdempotencyRecord: IdempotencyRecord | null
  ): { payment: Payment, idempotencyRecord?: IdempotencyRecord, isCached: boolean } {
    const result = this.idempotencyGuard.protect(idempotencyKey, existingIdempotencyRecord, () => {
      this.concurrencyGuard.validate(payment, expectedVersion);
      this.transitionManager.applyCapture(payment, capture);
      return payment;
    });
    return { payment: result.response, idempotencyRecord: result.newRecord, isCached: result.isCached };
  }

  public processRefund(
    payment: Payment, 
    refund: Refund, 
    expectedVersion: number,
    idempotencyKey: string,
    existingIdempotencyRecord: IdempotencyRecord | null
  ): { payment: Payment, idempotencyRecord?: IdempotencyRecord, isCached: boolean } {
    const result = this.idempotencyGuard.protect(idempotencyKey, existingIdempotencyRecord, () => {
      this.concurrencyGuard.validate(payment, expectedVersion);
      this.transitionManager.applyRefund(payment, refund);
      return payment;
    });
    return { payment: result.response, idempotencyRecord: result.newRecord, isCached: result.isCached };
  }

  public processChargeback(
    payment: Payment, 
    chargeback: Chargeback, 
    expectedVersion: number,
    idempotencyKey: string,
    existingIdempotencyRecord: IdempotencyRecord | null
  ): { payment: Payment, idempotencyRecord?: IdempotencyRecord, isCached: boolean } {
    const result = this.idempotencyGuard.protect(idempotencyKey, existingIdempotencyRecord, () => {
      this.concurrencyGuard.validate(payment, expectedVersion);
      this.transitionManager.applyChargeback(payment, chargeback);
      return payment;
    });
    return { payment: result.response, idempotencyRecord: result.newRecord, isCached: result.isCached };
  }

  public processFailure(
    payment: Payment, 
    reason: PaymentFailureReason, 
    expectedVersion: number,
    idempotencyKey: string,
    existingIdempotencyRecord: IdempotencyRecord | null
  ): { payment: Payment, idempotencyRecord?: IdempotencyRecord, isCached: boolean } {
    const result = this.idempotencyGuard.protect(idempotencyKey, existingIdempotencyRecord, () => {
      this.concurrencyGuard.validate(payment, expectedVersion);
      this.transitionManager.applyFailure(payment, reason);
      return payment;
    });
    return { payment: result.response, idempotencyRecord: result.newRecord, isCached: result.isCached };
  }

  public processCancellation(
    payment: Payment, 
    reason: string, 
    expectedVersion: number,
    idempotencyKey: string,
    existingIdempotencyRecord: IdempotencyRecord | null
  ): { payment: Payment, idempotencyRecord?: IdempotencyRecord, isCached: boolean } {
    const result = this.idempotencyGuard.protect(idempotencyKey, existingIdempotencyRecord, () => {
      this.concurrencyGuard.validate(payment, expectedVersion);
      this.transitionManager.applyCancellation(payment, reason);
      return payment;
    });
    return { payment: result.response, idempotencyRecord: result.newRecord, isCached: result.isCached };
  }
}
