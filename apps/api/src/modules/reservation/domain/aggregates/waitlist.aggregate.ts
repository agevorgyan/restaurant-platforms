import { AggregateRoot } from '@saas/core';

import { WaitlistCode } from '../value-objects/waitlist-code.value-object';
import { WaitlistVersion } from '../value-objects/waitlist-version.value-object';
import { BranchReference } from '../value-objects/branch-reference.value-object';
import { WaitlistEntry } from '../entities/waitlist-entry.entity';
import { PartySize } from '../value-objects/party-size.value-object';
import { QueuePriority } from '../value-objects/queue-priority.value-object';
import { QueuePosition } from '../value-objects/queue-position.value-object';
import { CustomerReference } from '../value-objects/customer-reference.value-object';
import { PromotionAttempt } from '../entities/promotion-attempt.entity';
import { PromotionDeadline } from '../value-objects/promotion-deadline.value-object';
import { AcceptanceStatus } from '../value-objects/acceptance-status.value-object';
import { ReservationReference } from '../value-objects/reservation-reference.value-object';
import { QueuePolicy, ExpirationPolicy } from '../policies/waitlist.policies';
import { QueueOrderingSpecification } from '../specifications/waitlist.specifications';
import { ReservationDomainError } from '../exceptions/reservation.exceptions';
import {
  WaitlistCreatedEvent,
  WaitlistEntryAddedEvent,
  QueuePositionChangedEvent,
  PromotionStartedEvent,
  PromotionSucceededEvent,
  PromotionExpiredEvent,
  PromotionRejectedEvent,
  WaitlistEntryCancelledEvent,
  WaitlistCompletedEvent
} from '../events/waitlist.events';

export interface WaitlistProps {
  code: WaitlistCode;
  version: WaitlistVersion;
  branchRef: BranchReference;
  date: Date;
  entries: WaitlistEntry[];
  isCompleted: boolean;
}

export class Waitlist extends AggregateRoot<WaitlistProps> {
  get code(): WaitlistCode { return this.props.code; }
  get version(): WaitlistVersion { return this.props.version; }
  get branchRef(): BranchReference { return this.props.branchRef; }
  get date(): Date { return this.props.date; }
  get entries(): ReadonlyArray<WaitlistEntry> { return this.props.entries; }
  get isCompleted(): boolean { return this.props.isCompleted; }

  private constructor(id: string, props: WaitlistProps) { super(id, props); }

  public static create(code: string, branchId: string, date: Date, id?: string): Waitlist {
    const aggregate = new Waitlist(id || crypto.randomUUID(), {
      code: WaitlistCode.create(code),
      version: WaitlistVersion.create(1),
      branchRef: BranchReference.create(branchId),
      date,
      entries: [],
      isCompleted: false
    });
    aggregate.addDomainEvent(new WaitlistCreatedEvent(aggregate.id, branchId));
    return aggregate;
  }

  public addEntry(partySize: number, priority: number, customerId?: string): string {
    if (this.props.isCompleted) throw new ReservationDomainError('Waitlist is completed');

    QueuePolicy.enforceUniqueCustomer(this.props.entries, customerId);

    const position = this.props.entries.length + 1;
    const entry = WaitlistEntry.create({
      partySize: PartySize.create(partySize),
      priority: QueuePriority.create(priority),
      position: QueuePosition.create(position),
      customerRef: customerId ? CustomerReference.create(customerId) : undefined
    });

    this.props.entries.push(entry);
    this.addDomainEvent(new WaitlistEntryAddedEvent(this.id, entry.id));
    this.reorderQueue();

    return entry.id;
  }

  public promote(entryId: string, deadline: Date): void {
    if (this.props.isCompleted) throw new ReservationDomainError('Waitlist is completed');
    
    ExpirationPolicy.enforceDeadlineIsInFuture(deadline);

    const entry = this.getEntry(entryId);
    const attempt = PromotionAttempt.create({
      startedAt: new Date(),
      deadline: PromotionDeadline.create(deadline),
      status: AcceptanceStatus.create('PENDING')
    });
    
    entry.promote(attempt);
    this.addDomainEvent(new PromotionStartedEvent(this.id, entryId));
  }

  public acceptPromotion(entryId: string, reservationId: string): void {
    const entry = this.getEntry(entryId);
    QueuePolicy.enforceUniqueReservation(this.props.entries, reservationId);
    
    entry.accept(ReservationReference.create(reservationId));
    this.addDomainEvent(new PromotionSucceededEvent(this.id, entryId));
    this.reorderQueue();
  }

  public expirePromotion(entryId: string): void {
    const entry = this.getEntry(entryId);
    entry.expire();
    this.addDomainEvent(new PromotionExpiredEvent(this.id, entryId));
    this.reorderQueue();
  }

  public rejectPromotion(entryId: string): void {
    const entry = this.getEntry(entryId);
    entry.reject();
    this.addDomainEvent(new PromotionRejectedEvent(this.id, entryId));
    this.reorderQueue();
  }

  public cancelEntry(entryId: string): void {
    const entry = this.getEntry(entryId);
    entry.cancel();
    this.addDomainEvent(new WaitlistEntryCancelledEvent(this.id, entryId));
    this.reorderQueue();
  }

  public complete(): void {
    this.props.isCompleted = true;
    this.addDomainEvent(new WaitlistCompletedEvent(this.id));
  }

  private reorderQueue(): void {
    // Only reorder entries that are still waiting or eligible
    const activeEntries = this.props.entries.filter(e => e.status.status === 'WAITING' || e.status.status === 'ELIGIBLE');
    const sorted = QueueOrderingSpecification.sortEntries(activeEntries);
    
    sorted.forEach((entry, index) => {
      const newPos = index + 1;
      if (entry.position.position !== newPos) {
        entry.setPosition(newPos);
        this.addDomainEvent(new QueuePositionChangedEvent(this.id, entry.id, newPos));
      }
    });
  }

  private getEntry(entryId: string): WaitlistEntry {
    const entry = this.props.entries.find(e => e.id === entryId);
    if (!entry) throw new ReservationDomainError('Entry not found');
    return entry;
  }
}