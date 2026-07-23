import { Entity } from '@saas/core';
import { CustomerReference } from '../value-objects/customer-reference.value-object';
import { ReservationReference } from '../value-objects/reservation-reference.value-object';
import { PartySize } from '../value-objects/party-size.value-object';
import { QueuePriority } from '../value-objects/queue-priority.value-object';
import { QueuePosition } from '../value-objects/queue-position.value-object';
import { WaitlistStatus } from '../value-objects/waitlist-status.value-object';
import { PromotionAttempt } from './promotion-attempt.entity';
import { WaitlistTimeline } from './waitlist-timeline.entity';
import { WaitlistNotification } from './waitlist-notification.entity';
import { PromotionPolicy, AcceptancePolicy } from '../policies/waitlist.policies';
import { ReservationDomainError } from '../exceptions/reservation.exceptions';

export interface WaitlistEntryProps {
  customerRef?: CustomerReference;
  reservationRef?: ReservationReference; // Populated if successfully promoted and converted to reservation
  partySize: PartySize;
  priority: QueuePriority;
  position: QueuePosition;
  status: WaitlistStatus;
  createdAt: Date;
  promotionAttempt?: PromotionAttempt;
  notifications: WaitlistNotification[];
  timeline: WaitlistTimeline[];
}

export class WaitlistEntry extends Entity<WaitlistEntryProps> {
  get customerRef(): CustomerReference | undefined { return this.props.customerRef; }
  get reservationRef(): ReservationReference | undefined { return this.props.reservationRef; }
  get partySize(): PartySize { return this.props.partySize; }
  get priority(): QueuePriority { return this.props.priority; }
  get position(): QueuePosition { return this.props.position; }
  get status(): WaitlistStatus { return this.props.status; }
  get createdAt(): Date { return this.props.createdAt; }
  get promotionAttempt(): PromotionAttempt | undefined { return this.props.promotionAttempt; }
  get notifications(): ReadonlyArray<WaitlistNotification> { return this.props.notifications; }
  get timeline(): ReadonlyArray<WaitlistTimeline> { return this.props.timeline; }

  private constructor(id: string, props: WaitlistEntryProps) { super(id, props); }
  
  public static create(props: Omit<WaitlistEntryProps, 'status' | 'notifications' | 'timeline' | 'promotionAttempt' | 'createdAt'>, id?: string): WaitlistEntry {
    if (props.partySize.size <= 0) throw new ReservationDomainError('PartySize must be > 0');
    if (props.position.position <= 0) throw new ReservationDomainError('QueuePosition must be > 0');

    const timeline = [WaitlistTimeline.create({ status: 'WAITING', recordedAt: new Date() })];
    
    return new WaitlistEntry(id || crypto.randomUUID(), {
      ...props,
      status: WaitlistStatus.create('WAITING'),
      createdAt: new Date(),
      notifications: [],
      timeline
    });
  }

  public setPosition(pos: number): void {
    if (pos <= 0) throw new ReservationDomainError('QueuePosition must be > 0');
    this.props.position = QueuePosition.create(pos);
  }

  public promote(attempt: PromotionAttempt): void {
    PromotionPolicy.enforceValidTransition(this.props.status.status);
    this.props.status = WaitlistStatus.create('PROMOTED');
    this.props.promotionAttempt = attempt;
    this.props.timeline.push(WaitlistTimeline.create({ status: 'PROMOTED', recordedAt: new Date() }));
  }

  public accept(reservationRef: ReservationReference): void {
    if (this.props.status.status !== 'PROMOTED') throw new ReservationDomainError('Only promoted entries can be accepted');
    this.props.status = WaitlistStatus.create('ACCEPTED');
    this.props.reservationRef = reservationRef;
    if (this.props.promotionAttempt) this.props.promotionAttempt.markAccepted();
    this.props.timeline.push(WaitlistTimeline.create({ status: 'ACCEPTED', recordedAt: new Date() }));
  }

  public expire(): void {
    if (this.props.status.status !== 'PROMOTED') throw new ReservationDomainError('Only promoted entries can expire');
    this.props.status = WaitlistStatus.create('EXPIRED');
    if (this.props.promotionAttempt) this.props.promotionAttempt.markExpired();
    this.props.timeline.push(WaitlistTimeline.create({ status: 'EXPIRED', recordedAt: new Date() }));
  }

  public reject(): void {
    if (this.props.status.status !== 'PROMOTED') throw new ReservationDomainError('Only promoted entries can be rejected');
    // Rejecting sends them back to WAITING or removes them depending on business rules. We'll set to CANCELLED.
    this.props.status = WaitlistStatus.create('CANCELLED');
    if (this.props.promotionAttempt) this.props.promotionAttempt.markRejected();
    this.props.timeline.push(WaitlistTimeline.create({ status: 'CANCELLED', recordedAt: new Date(), reason: 'Customer rejected promotion' }));
  }

  public cancel(): void {
    AcceptancePolicy.enforceValidTransition(this.props.status.status);
    this.props.status = WaitlistStatus.create('CANCELLED');
    this.props.timeline.push(WaitlistTimeline.create({ status: 'CANCELLED', recordedAt: new Date(), reason: 'Manually cancelled' }));
  }
}