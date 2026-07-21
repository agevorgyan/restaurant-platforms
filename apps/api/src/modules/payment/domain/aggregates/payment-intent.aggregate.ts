import { AggregateRoot } from '@saas/core';
import { PaymentIntentId } from '../value-objects/payment-intent-id.value-object';
import { PaymentIntentReference } from '../value-objects/payment-intent-reference.value-object';
import { PaymentIntentStatus, PaymentIntentStatusEnum } from '../value-objects/payment-intent-status.value-object';
import { PaymentIntentVersion } from '../value-objects/payment-intent-version.value-object';
import { PaymentIntentOrigin } from '../value-objects/payment-intent-origin.value-object';
import { PaymentAmount } from '../value-objects/payment-amount.value-object';
import { PaymentIntentParticipant } from '../entities/payment-intent-participant.entity';
import { PaymentIntentMetadata } from '../entities/payment-intent-metadata.entity';
import { PaymentIntentExpiration } from '../entities/payment-intent-expiration.entity';
import {
  PaymentIntentCreatedEvent,
  PaymentIntentActivatedEvent,
  PaymentIntentAuthorizedEvent,
  PaymentIntentExpiredEvent,
  PaymentIntentCancelledEvent,
  PaymentIntentFailedEvent
} from '../events/payment-intent.events';

export interface PaymentIntentProps {
  orderId: PaymentIntentReference;
  checkoutSessionId: PaymentIntentReference;
  orderQuotationId: PaymentIntentReference;
  pricingSnapshotId: PaymentIntentReference;
  amount: PaymentAmount;
  status: PaymentIntentStatus;
  version: PaymentIntentVersion;
  origin: PaymentIntentOrigin;
  participant?: PaymentIntentParticipant;
  metadata?: PaymentIntentMetadata;
  expiration: PaymentIntentExpiration;
  createdAt: Date;
  updatedAt: Date;
}

export class PaymentIntent extends AggregateRoot<PaymentIntentProps> {
  private constructor(props: PaymentIntentProps, id?: string) {
    super(id || PaymentIntentId.create().value, props);
  }

  public static create(
    props: Omit<PaymentIntentProps, 'status' | 'version' | 'createdAt' | 'updatedAt'>
  ): PaymentIntent {
    const now = new Date();
    
    // Validate uniqueness of references in basic way
    const refs = [
      props.orderId.value,
      props.checkoutSessionId.value,
      props.orderQuotationId.value,
      props.pricingSnapshotId.value
    ];
    if (new Set(refs).size !== refs.length) {
      throw new Error('References must be unique and distinct');
    }

    const intent = new PaymentIntent({
      ...props,
      status: PaymentIntentStatus.create(PaymentIntentStatusEnum.CREATED),
      version: PaymentIntentVersion.create(),
      createdAt: now,
      updatedAt: now
    });

    intent.addDomainEvent(
      new PaymentIntentCreatedEvent(
        intent.id,
        intent.props.orderId.value,
        intent.props.checkoutSessionId.value
      )
    );

    return intent;
  }

  public activate(): void {
    if (this.props.status.value !== PaymentIntentStatusEnum.CREATED) {
      throw new Error(`Cannot activate from status ${this.props.status.value}`);
    }
    
    this.props.status = PaymentIntentStatus.create(PaymentIntentStatusEnum.ACTIVE);
    this.incrementVersion();

    this.addDomainEvent(new PaymentIntentActivatedEvent(this.id));
  }

  public awaitAuthorization(): void {
    if (this.props.status.value !== PaymentIntentStatusEnum.ACTIVE) {
      throw new Error(`Cannot await authorization from status ${this.props.status.value}`);
    }

    this.props.status = PaymentIntentStatus.create(PaymentIntentStatusEnum.AWAITING_AUTHORIZATION);
    this.incrementVersion();
  }

  public authorize(transactionId: string): void {
    if (this.props.status.value !== PaymentIntentStatusEnum.AWAITING_AUTHORIZATION) {
      throw new Error(`Cannot authorize from status ${this.props.status.value}`);
    }

    this.props.status = PaymentIntentStatus.create(PaymentIntentStatusEnum.AUTHORIZED);
    this.incrementVersion();

    this.addDomainEvent(new PaymentIntentAuthorizedEvent(this.id, transactionId));
  }

  public expire(): void {
    if (
      this.props.status.value === PaymentIntentStatusEnum.EXPIRED ||
      this.props.status.value === PaymentIntentStatusEnum.AUTHORIZED ||
      this.props.status.value === PaymentIntentStatusEnum.CANCELLED
    ) {
      return;
    }

    this.props.status = PaymentIntentStatus.create(PaymentIntentStatusEnum.EXPIRED);
    this.incrementVersion();

    this.addDomainEvent(new PaymentIntentExpiredEvent(this.id));
  }

  public cancel(reason: string): void {
    if (
      this.props.status.value === PaymentIntentStatusEnum.CANCELLED ||
      this.props.status.value === PaymentIntentStatusEnum.EXPIRED ||
      this.props.status.value === PaymentIntentStatusEnum.AUTHORIZED
    ) {
      return; // Terminal or immutable states
    }

    this.props.status = PaymentIntentStatus.create(PaymentIntentStatusEnum.CANCELLED);
    this.incrementVersion();

    this.addDomainEvent(new PaymentIntentCancelledEvent(this.id, reason));
  }

  public fail(reason: string): void {
    this.props.status = PaymentIntentStatus.create(PaymentIntentStatusEnum.FAILED);
    this.incrementVersion();

    this.addDomainEvent(new PaymentIntentFailedEvent(this.id, reason));
  }

  public isExpired(now: Date = new Date()): boolean {
    return this.props.expiration.isExpired(now);
  }

  private incrementVersion(): void {
    this.props.version = this.props.version.increment();
    this.props.updatedAt = new Date();
  }

  // Getters
  get orderId(): PaymentIntentReference { return this.props.orderId; }
  get checkoutSessionId(): PaymentIntentReference { return this.props.checkoutSessionId; }
  get orderQuotationId(): PaymentIntentReference { return this.props.orderQuotationId; }
  get pricingSnapshotId(): PaymentIntentReference { return this.props.pricingSnapshotId; }
  get amount(): PaymentAmount { return this.props.amount; }
  get status(): PaymentIntentStatus { return this.props.status; }
  get version(): PaymentIntentVersion { return this.props.version; }
  get origin(): PaymentIntentOrigin { return this.props.origin; }
  get participant(): PaymentIntentParticipant | undefined { return this.props.participant; }
  get metadata(): PaymentIntentMetadata | undefined { return this.props.metadata; }
  get expiration(): PaymentIntentExpiration { return this.props.expiration; }
}
