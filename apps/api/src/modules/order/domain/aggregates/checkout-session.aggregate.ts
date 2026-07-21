import { AggregateRoot } from '@saas/core';
import { CheckoutStatus, CheckoutStatusEnum } from '../value-objects/checkout-status.value-object';
import { CheckoutToken } from '../value-objects/checkout-token.value-object';
import { CheckoutReference } from '../value-objects/checkout-reference.value-object';
import { CheckoutOrigin } from '../value-objects/checkout-origin.value-object';
import { CheckoutChannel } from '../value-objects/checkout-channel.value-object';
import { CheckoutVersion } from '../value-objects/checkout-version.value-object';
import { CheckoutParticipant } from '../entities/checkout-participant.entity';
import { CheckoutContact } from '../entities/checkout-contact.entity';
import { CheckoutExpiration } from '../entities/checkout-expiration.entity';
import { CheckoutMetadata } from '../entities/checkout-metadata.entity';
import {
  CheckoutSessionCreatedEvent,
  CheckoutActivatedEvent,
  CheckoutAwaitingPaymentEvent,
  CheckoutPaymentAuthorizedEvent,
  CheckoutExpiredEvent,
  CheckoutCancelledEvent,
  CheckoutCompletedEvent
} from '../events/checkout-session.events';

export interface CheckoutSessionProps {
  status: CheckoutStatus;
  token: CheckoutToken;
  reference: CheckoutReference;
  origin: CheckoutOrigin;
  channel: CheckoutChannel;
  version: CheckoutVersion;
  participant?: CheckoutParticipant;
  contact?: CheckoutContact;
  expiration: CheckoutExpiration;
  metadata?: CheckoutMetadata;
  targetOrderId?: string;
}

export class CheckoutSession extends AggregateRoot<CheckoutSessionProps> {
  private constructor(props: CheckoutSessionProps, id?: string) {
    super(id || crypto.randomUUID(), props);
  }

  public static create(
    props: Omit<CheckoutSessionProps, 'status' | 'token' | 'version' | 'expiration'> & {
      expiration?: CheckoutExpiration;
    },
    id?: string
  ): CheckoutSession {
    const session = new CheckoutSession({
      ...props,
      status: CheckoutStatus.create(CheckoutStatusEnum.CREATED),
      token: CheckoutToken.create(),
      version: CheckoutVersion.create(1),
      expiration: props.expiration ?? CheckoutExpiration.withDefaultTimeout(15)
    }, id);


    session.addDomainEvent(
      new CheckoutSessionCreatedEvent(
        session.id,
        session.reference.orderQuotationId,
        session.reference.pricingSnapshotId
      )
    );

    return session;
  }

  // Setters/Transitions
  public activate(participant: CheckoutParticipant, contact: CheckoutContact): void {
    this.ensureNotTerminal();
    
    this.props.participant = participant;
    this.props.contact = contact;
    this.props.status = CheckoutStatus.create(CheckoutStatusEnum.ACTIVE);
    this.incrementVersion();


    this.addDomainEvent(new CheckoutActivatedEvent(this.id));
  }

  public awaitPayment(): void {
    this.ensureNotTerminal();
    this.props.status = CheckoutStatus.create(CheckoutStatusEnum.AWAITING_PAYMENT);
    this.incrementVersion();


    this.addDomainEvent(new CheckoutAwaitingPaymentEvent(this.id));
  }

  public authorizePayment(): void {
    this.ensureNotTerminal();
    this.props.status = CheckoutStatus.create(CheckoutStatusEnum.PAYMENT_AUTHORIZED);
    this.incrementVersion();


    this.addDomainEvent(new CheckoutPaymentAuthorizedEvent(this.id));
  }

  public complete(orderId: string): void {
    this.ensureNotTerminal();
    this.props.status = CheckoutStatus.create(CheckoutStatusEnum.COMPLETED);
    this.props.targetOrderId = orderId;
    this.incrementVersion();


    this.addDomainEvent(new CheckoutCompletedEvent(this.id, orderId));
  }

  public cancel(reason: string): void {
    this.ensureNotTerminal();
    this.props.status = CheckoutStatus.create(CheckoutStatusEnum.CANCELLED);
    this.incrementVersion();


    this.addDomainEvent(new CheckoutCancelledEvent(this.id, reason));
  }

  public expire(): void {
    if (this.status.isTerminal()) return;
    
    this.props.status = CheckoutStatus.create(CheckoutStatusEnum.EXPIRED);
    this.incrementVersion();

    this.addDomainEvent(new CheckoutExpiredEvent(this.id));
  }

  public updateMetadata(key: string, value: any): void {
    this.ensureNotTerminal();
    if (!this.props.metadata) {
      this.props.metadata = CheckoutMetadata.create();
    }
    this.props.metadata.update(key, value);
    this.incrementVersion();
  }

  public isExpired(referenceDate: Date = new Date()): boolean {
    return this.props.expiration.isExpired(referenceDate);
  }

  private ensureNotTerminal(): void {
    if (this.props.status.isTerminal()) {
      throw new Error(`Cannot modify a checkout session in terminal state: ${this.props.status.value}`);
    }
    if (this.isExpired()) {
      throw new Error('Cannot modify an expired checkout session');
    }
  }

  private incrementVersion(): void {
    this.props.version = this.props.version.increment();
  }

  // Getters
  get status(): CheckoutStatus { return this.props.status; }
  get token(): CheckoutToken { return this.props.token; }
  get reference(): CheckoutReference { return this.props.reference; }
  get origin(): CheckoutOrigin { return this.props.origin; }
  get channel(): CheckoutChannel { return this.props.channel; }
  get version(): CheckoutVersion { return this.props.version; }
  get participant(): CheckoutParticipant | undefined { return this.props.participant; }
  get contact(): CheckoutContact | undefined { return this.props.contact; }
  get expiration(): CheckoutExpiration { return this.props.expiration; }
  get metadata(): CheckoutMetadata | undefined { return this.props.metadata; }
  get targetOrderId(): string | undefined { return this.props.targetOrderId; }
}
