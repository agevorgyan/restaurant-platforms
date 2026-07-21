import { AggregateRoot } from '@saas/core';
import { PaymentId } from '../value-objects/payment-id.value-object';
import { PaymentIntentReference } from '../value-objects/payment-intent-reference.value-object';
import { PaymentReference } from '../value-objects/payment-reference.value-object';
import { PaymentStatus, PaymentStatusEnum } from '../value-objects/payment-status.value-object';
import { PaymentVersion } from '../value-objects/payment-version.value-object';
import { PaymentAmount } from '../value-objects/payment-amount.value-object';
import { PaymentFailureReason } from '../value-objects/payment-failure-reason.value-object';

import { Authorization } from '../entities/authorization.entity';
import { Capture } from '../entities/capture.entity';
import { Refund } from '../entities/refund.entity';
import { Chargeback } from '../entities/chargeback.entity';
import { SettlementReference } from '../entities/settlement-reference.entity';

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
} from '../events/payment.events';

export interface PaymentProps {
  paymentIntentId: PaymentIntentReference;
  orderId: PaymentReference; // Reusing reference structure for order
  pricingSnapshotId: PaymentReference;
  orderQuotationId: PaymentReference;
  
  amount: PaymentAmount;
  status: PaymentStatus;
  version: PaymentVersion;
  
  authorization?: Authorization;
  captures: Capture[];
  refunds: Refund[];
  chargebacks: Chargeback[];
  settlementReferences: SettlementReference[];

  createdAt: Date;
  updatedAt: Date;
}

export class Payment extends AggregateRoot<PaymentProps> {
  private constructor(props: PaymentProps, id?: string) {
    super(id || PaymentId.create().value, props);
  }

  public static create(
    props: Omit<PaymentProps, 'status' | 'version' | 'captures' | 'refunds' | 'chargebacks' | 'settlementReferences' | 'createdAt' | 'updatedAt'>
  ): Payment {
    const now = new Date();

    const payment = new Payment({
      ...props,
      status: PaymentStatus.create(PaymentStatusEnum.CREATED),
      version: PaymentVersion.create(),
      captures: [],
      refunds: [],
      chargebacks: [],
      settlementReferences: [],
      createdAt: now,
      updatedAt: now
    });

    payment.addDomainEvent(
      new PaymentCreatedEvent(
        payment.id,
        payment.props.paymentIntentId.value,
        payment.props.orderId.value,
        payment.props.amount
      )
    );

    return payment;
  }

  public markPendingAuthorization(): void {
    const oldStatus = this.props.status.value;
    this.props.status = PaymentStatus.create(PaymentStatusEnum.PENDING_AUTHORIZATION);
    
    if (oldStatus !== this.props.status.value) {
      this.addDomainEvent(new PaymentStatusChangedEvent(this.id, oldStatus, this.props.status.value));
    }

    this.incrementVersion();
  }

  public authorize(authorization: Authorization): void {
    if (this.props.authorization && !this.props.authorization.isExpired() && !this.props.authorization.isVoided) {
      throw new Error('Payment already has an active authorization');
    }

    if (this.props.status.value === PaymentStatusEnum.CANCELLED || this.props.status.value === PaymentStatusEnum.FAILED) {
      throw new Error('Cannot authorize a cancelled or failed payment');
    }

    const oldStatus = this.props.status.value;
    this.props.authorization = authorization;
    this.props.status = PaymentStatus.create(PaymentStatusEnum.AUTHORIZED);
    this.incrementVersion();

    this.addDomainEvent(
      new PaymentStatusChangedEvent(this.id, oldStatus, PaymentStatusEnum.AUTHORIZED)
    );

    this.addDomainEvent(
      new AuthorizationCompletedEvent(
        this.id,
        authorization.id,
        authorization.reference.value,
        authorization.amount
      )
    );
  }

  public capture(capture: Capture): void {
    if (!this.props.authorization) {
      throw new Error('Payment must be authorized before capturing');
    }

    if (this.props.authorization.isExpired() || this.props.authorization.isVoided) {
      throw new Error('Cannot capture against an expired or voided authorization');
    }

    const totalCaptured = this.getTotalCapturedAmount();
    const newTotalCaptured = totalCaptured + capture.amount.value;

    if (newTotalCaptured > this.props.authorization.amount.value) {
      throw new Error('Total captured amount cannot exceed the authorized amount');
    }

    this.props.captures.push(capture);
    const oldStatus = this.props.status.value;
    
    if (newTotalCaptured === this.props.authorization.amount.value) {
      this.props.status = PaymentStatus.create(PaymentStatusEnum.CAPTURED);
      this.addDomainEvent(new PaymentCompletedEvent(this.id));
    } else {
      this.props.status = PaymentStatus.create(PaymentStatusEnum.PARTIALLY_CAPTURED);
    }
    
    if (oldStatus !== this.props.status.value) {
      this.addDomainEvent(new PaymentStatusChangedEvent(this.id, oldStatus, this.props.status.value));
    }

    this.incrementVersion();

    this.addDomainEvent(
      new CaptureCompletedEvent(
        this.id,
        capture.id,
        capture.reference.value,
        capture.amount
      )
    );
  }

  public refund(refund: Refund): void {
    const totalCaptured = this.getTotalCapturedAmount();
    const totalRefunded = this.getTotalRefundedAmount();
    const newTotalRefunded = totalRefunded + refund.amount.value;

    if (newTotalRefunded > totalCaptured) {
      throw new Error('Total refunded amount cannot exceed the total captured amount');
    }

    this.props.refunds.push(refund);
    const oldStatus = this.props.status.value;

    if (newTotalRefunded === totalCaptured) {
      this.props.status = PaymentStatus.create(PaymentStatusEnum.REFUNDED);
    } else {
      this.props.status = PaymentStatus.create(PaymentStatusEnum.PARTIALLY_REFUNDED);
    }

    if (oldStatus !== this.props.status.value) {
      this.addDomainEvent(new PaymentStatusChangedEvent(this.id, oldStatus, this.props.status.value));
    }

    this.incrementVersion();

    this.addDomainEvent(
      new RefundCompletedEvent(
        this.id,
        refund.id,
        refund.reference.value,
        refund.amount,
        refund.reason
      )
    );
  }

  public addChargeback(chargeback: Chargeback): void {
    const captureExists = this.props.captures.some(
      (c) => c.reference.value === chargeback.captureReference.value
    );

    if (!captureExists) {
      throw new Error('Chargeback must reference a valid capture');
    }

    this.props.chargebacks.push(chargeback);
    const oldStatus = this.props.status.value;
    this.props.status = PaymentStatus.create(PaymentStatusEnum.CHARGEBACK);
    
    if (oldStatus !== this.props.status.value) {
      this.addDomainEvent(new PaymentStatusChangedEvent(this.id, oldStatus, this.props.status.value));
    }

    this.incrementVersion();

    this.addDomainEvent(
      new ChargebackRegisteredEvent(
        this.id,
        chargeback.id,
        chargeback.captureReference.value,
        chargeback.amount,
        chargeback.reason
      )
    );
  }

  public fail(reason: PaymentFailureReason): void {
    const oldStatus = this.props.status.value;
    this.props.status = PaymentStatus.create(PaymentStatusEnum.FAILED);
    
    if (oldStatus !== this.props.status.value) {
      this.addDomainEvent(new PaymentStatusChangedEvent(this.id, oldStatus, this.props.status.value));
    }

    this.incrementVersion();

    this.addDomainEvent(new PaymentFailedEvent(this.id, reason));
  }

  public cancel(reason: string): void {
    if (this.props.captures.length > 0) {
      throw new Error('Cannot cancel a payment that has captures. Issue a refund instead.');
    }

    const oldStatus = this.props.status.value;
    this.props.status = PaymentStatus.create(PaymentStatusEnum.CANCELLED);
    
    if (oldStatus !== this.props.status.value) {
      this.addDomainEvent(new PaymentStatusChangedEvent(this.id, oldStatus, this.props.status.value));
    }

    this.incrementVersion();

    this.addDomainEvent(new PaymentCancelledEvent(this.id, reason));
  }

  public void(reason: string): void {
    if (!this.props.authorization) {
      throw new Error('Cannot void a payment without an authorization');
    }

    if (this.props.captures.length > 0) {
      throw new Error('Cannot void a payment that has captures');
    }

    this.props.authorization.void();

    const oldStatus = this.props.status.value;
    this.props.status = PaymentStatus.create(PaymentStatusEnum.VOIDED);
    
    if (oldStatus !== this.props.status.value) {
      this.addDomainEvent(new PaymentStatusChangedEvent(this.id, oldStatus, this.props.status.value));
    }

    this.incrementVersion();

    this.addDomainEvent(new PaymentVoidedEvent(this.id, reason));
  }

  public getTotalCapturedAmount(): number {
    return this.props.captures.reduce((sum, capture) => sum + capture.amount.value, 0);
  }

  public getTotalRefundedAmount(): number {
    return this.props.refunds.reduce((sum, refund) => sum + refund.amount.value, 0);
  }

  private incrementVersion(): void {
    this.props.version = this.props.version.increment();
    this.props.updatedAt = new Date();
  }

  // Getters
  get paymentIntentId(): PaymentIntentReference { return this.props.paymentIntentId; }
  get orderId(): PaymentReference { return this.props.orderId; }
  get pricingSnapshotId(): PaymentReference { return this.props.pricingSnapshotId; }
  get orderQuotationId(): PaymentReference { return this.props.orderQuotationId; }
  get amount(): PaymentAmount { return this.props.amount; }
  get status(): PaymentStatus { return this.props.status; }
  get version(): PaymentVersion { return this.props.version; }
  get authorization(): Authorization | undefined { return this.props.authorization; }
  get captures(): Capture[] { return [...this.props.captures]; }
  get refunds(): Refund[] { return [...this.props.refunds]; }
  get chargebacks(): Chargeback[] { return [...this.props.chargebacks]; }
  get settlementReferences(): SettlementReference[] { return [...this.props.settlementReferences]; }
}
