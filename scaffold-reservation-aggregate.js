const fs = require('fs');
const path = require('path');

const baseDir = '/Users/apple/Downloads/Projects/Restaurant Platform/restaurant-platforms/apps/api/src/modules/reservation/domain';

const filesToCreate = {
  // Missing Value Objects
  'value-objects/reservation-reason.value-object.ts': `import { ValueObject } from '@saas/core';

export interface ReservationReasonProps { reason: string; }
export class ReservationReason extends ValueObject<ReservationReasonProps> {
  get reason(): string { return this.props.reason; }
  private constructor(props: ReservationReasonProps) { super(props); }
  public static create(reason: string): ReservationReason { return new ReservationReason({ reason }); }
}`,

  'value-objects/reservation-confirmation-code.value-object.ts': `import { ValueObject } from '@saas/core';

export interface ReservationConfirmationCodeProps { code: string; }
export class ReservationConfirmationCode extends ValueObject<ReservationConfirmationCodeProps> {
  get code(): string { return this.props.code; }
  private constructor(props: ReservationConfirmationCodeProps) { super(props); }
  public static create(code: string): ReservationConfirmationCode { return new ReservationConfirmationCode({ code }); }
}`,

  'value-objects/customer-reference.value-object.ts': `import { ValueObject } from '@saas/core';

export interface CustomerReferenceProps { customerId: string; }
export class CustomerReference extends ValueObject<CustomerReferenceProps> {
  get customerId(): string { return this.props.customerId; }
  private constructor(props: CustomerReferenceProps) { super(props); }
  public static create(customerId: string): CustomerReference { return new CustomerReference({ customerId }); }
}`,

  'value-objects/branch-reference.value-object.ts': `import { ValueObject } from '@saas/core';

export interface BranchReferenceProps { branchId: string; }
export class BranchReference extends ValueObject<BranchReferenceProps> {
  get branchId(): string { return this.props.branchId; }
  private constructor(props: BranchReferenceProps) { super(props); }
  public static create(branchId: string): BranchReference { return new BranchReference({ branchId }); }
}`,

  'value-objects/table-reference.value-object.ts': `import { ValueObject } from '@saas/core';

export interface TableReferenceProps { tableId: string; }
export class TableReference extends ValueObject<TableReferenceProps> {
  get tableId(): string { return this.props.tableId; }
  private constructor(props: TableReferenceProps) { super(props); }
  public static create(tableId: string): TableReference { return new TableReference({ tableId }); }
}`,

  'value-objects/table-allocation-reference.value-object.ts': `import { ValueObject } from '@saas/core';

export interface TableAllocationReferenceProps { allocationId: string; }
export class TableAllocationReference extends ValueObject<TableAllocationReferenceProps> {
  get allocationId(): string { return this.props.allocationId; }
  private constructor(props: TableAllocationReferenceProps) { super(props); }
  public static create(allocationId: string): TableAllocationReference { return new TableAllocationReference({ allocationId }); }
}`,

  'value-objects/waitlist-reference.value-object.ts': `import { ValueObject } from '@saas/core';

export interface WaitlistReferenceProps { waitlistId: string; }
export class WaitlistReference extends ValueObject<WaitlistReferenceProps> {
  get waitlistId(): string { return this.props.waitlistId; }
  private constructor(props: WaitlistReferenceProps) { super(props); }
  public static create(waitlistId: string): WaitlistReference { return new WaitlistReference({ waitlistId }); }
}`,

  // Domain Events
  'events/reservation.events.ts': `import { DomainEvent } from '@saas/core';

export class ReservationCreatedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly reservationId: string, public readonly branchId: string) {}
  getAggregateId(): string { return this.reservationId; }
}

export class ReservationConfirmedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly reservationId: string) {}
  getAggregateId(): string { return this.reservationId; }
}

export class ReservationCancelledEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly reservationId: string, public readonly reason: string) {}
  getAggregateId(): string { return this.reservationId; }
}

export class ReservationCheckedInEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly reservationId: string) {}
  getAggregateId(): string { return this.reservationId; }
}

export class ReservationCompletedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly reservationId: string) {}
  getAggregateId(): string { return this.reservationId; }
}

export class ReservationMarkedNoShowEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly reservationId: string) {}
  getAggregateId(): string { return this.reservationId; }
}

export class ReservationRescheduledEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly reservationId: string, public readonly newTime: string) {}
  getAggregateId(): string { return this.reservationId; }
}

export class ReservationGuestUpdatedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly reservationId: string) {}
  getAggregateId(): string { return this.reservationId; }
}

export class ReservationAssignmentUpdatedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly reservationId: string) {}
  getAggregateId(): string { return this.reservationId; }
}

export class ReservationNoteAddedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly reservationId: string, public readonly author: string) {}
  getAggregateId(): string { return this.reservationId; }
}`,

  // Child Entities
  'entities/reservation-guest.entity.ts': `import { Entity } from '@saas/core';
import { CustomerReference } from '../value-objects/customer-reference.value-object';

export interface ReservationGuestProps {
  firstName: string;
  lastName: string;
  customerRef?: CustomerReference;
}

export class ReservationGuest extends Entity<ReservationGuestProps> {
  get firstName(): string { return this.props.firstName; }
  get lastName(): string { return this.props.lastName; }
  get customerRef(): CustomerReference | undefined { return this.props.customerRef; }

  private constructor(props: ReservationGuestProps, id?: string) { super(props, id); }
  public static create(props: ReservationGuestProps, id?: string): ReservationGuest {
    return new ReservationGuest(props, id);
  }
}`,

  'entities/reservation-contact.entity.ts': `import { Entity } from '@saas/core';

export interface ReservationContactProps {
  email?: string;
  phone?: string;
}

export class ReservationContact extends Entity<ReservationContactProps> {
  get email(): string | undefined { return this.props.email; }
  get phone(): string | undefined { return this.props.phone; }

  private constructor(props: ReservationContactProps, id?: string) { super(props, id); }
  public static create(props: ReservationContactProps, id?: string): ReservationContact {
    return new ReservationContact(props, id);
  }
}`,

  'entities/reservation-assignment.entity.ts': `import { Entity } from '@saas/core';
import { TableReference } from '../value-objects/table-reference.value-object';
import { TableAllocationReference } from '../value-objects/table-allocation-reference.value-object';

export interface ReservationAssignmentProps {
  tableRef: TableReference;
  allocationRef?: TableAllocationReference;
  assignedAt: Date;
}

export class ReservationAssignment extends Entity<ReservationAssignmentProps> {
  get tableRef(): TableReference { return this.props.tableRef; }
  get allocationRef(): TableAllocationReference | undefined { return this.props.allocationRef; }
  get assignedAt(): Date { return this.props.assignedAt; }

  private constructor(props: ReservationAssignmentProps, id?: string) { super(props, id); }
  public static create(props: ReservationAssignmentProps, id?: string): ReservationAssignment {
    return new ReservationAssignment(props, id);
  }
}`,

  'entities/reservation-note.entity.ts': `import { Entity } from '@saas/core';
import { ReservationNotes } from '../value-objects/reservation-notes.value-object';

export interface ReservationNoteProps {
  note: ReservationNotes;
  author: string;
  createdAt: Date;
}

export class ReservationNote extends Entity<ReservationNoteProps> {
  get note(): ReservationNotes { return this.props.note; }
  get author(): string { return this.props.author; }
  get createdAt(): Date { return this.props.createdAt; }

  private constructor(props: ReservationNoteProps, id?: string) { super(props, id); }
  public static create(props: ReservationNoteProps, id?: string): ReservationNote {
    return new ReservationNote(props, id);
  }
}`,

  'entities/reservation-timeline.entity.ts': `import { Entity } from '@saas/core';
import { ReservationStatusEnum } from '../enums/reservation.enum';

export interface ReservationTimelineProps {
  status: ReservationStatusEnum;
  recordedAt: Date;
  reason?: string;
}

export class ReservationTimeline extends Entity<ReservationTimelineProps> {
  get status(): ReservationStatusEnum { return this.props.status; }
  get recordedAt(): Date { return this.props.recordedAt; }
  get reason(): string | undefined { return this.props.reason; }

  private constructor(props: ReservationTimelineProps, id?: string) { super(props, id); }
  public static create(props: ReservationTimelineProps, id?: string): ReservationTimeline {
    return new ReservationTimeline(props, id);
  }
}`,

  // Aggregate Root
  'aggregates/reservation.aggregate.ts': `import { AggregateRoot } from '@saas/core';
import { ReservationId } from '../value-objects/reservation-id.value-object';
import { ReservationStatusEnum, ReservationTypeEnum, ReservationSourceEnum, ReservationPriorityEnum } from '../enums/reservation.enum';
import { ReservationPartySize } from '../value-objects/reservation-party-size.value-object';
import { ReservationDuration } from '../value-objects/reservation-duration.value-object';
import { ReservationDate } from '../value-objects/reservation-date.value-object';
import { ReservationTime } from '../value-objects/reservation-time.value-object';
import { BranchReference } from '../value-objects/branch-reference.value-object';
import { ReservationGuest } from '../entities/reservation-guest.entity';
import { ReservationContact } from '../entities/reservation-contact.entity';
import { ReservationAssignment } from '../entities/reservation-assignment.entity';
import { ReservationNote } from '../entities/reservation-note.entity';
import { ReservationTimeline } from '../entities/reservation-timeline.entity';
import { ReservationDomainError } from '../exceptions/reservation.exceptions';
import { 
  ReservationCreatedEvent,
  ReservationConfirmedEvent,
  ReservationCancelledEvent,
  ReservationCheckedInEvent,
  ReservationCompletedEvent,
  ReservationMarkedNoShowEvent,
  ReservationRescheduledEvent,
  ReservationNoteAddedEvent
} from '../events/reservation.events';

export interface ReservationProps {
  branchRef: BranchReference;
  guest: ReservationGuest;
  contact: ReservationContact;
  partySize: ReservationPartySize;
  date: ReservationDate;
  time: ReservationTime;
  duration: ReservationDuration;
  status: ReservationStatusEnum;
  type: ReservationTypeEnum;
  source: ReservationSourceEnum;
  priority: ReservationPriorityEnum;
  assignments: ReservationAssignment[];
  notes: ReservationNote[];
  timeline: ReservationTimeline[];
}

export class Reservation extends AggregateRoot<ReservationProps> {
  get branchRef(): BranchReference { return this.props.branchRef; }
  get guest(): ReservationGuest { return this.props.guest; }
  get contact(): ReservationContact { return this.props.contact; }
  get partySize(): ReservationPartySize { return this.props.partySize; }
  get date(): ReservationDate { return this.props.date; }
  get time(): ReservationTime { return this.props.time; }
  get duration(): ReservationDuration { return this.props.duration; }
  get status(): ReservationStatusEnum { return this.props.status; }
  get assignments(): ReadonlyArray<ReservationAssignment> { return this.props.assignments; }
  get notes(): ReadonlyArray<ReservationNote> { return this.props.notes; }
  get timeline(): ReadonlyArray<ReservationTimeline> { return this.props.timeline; }

  private constructor(props: ReservationProps, id: ReservationId) {
    super(props, id.value);
  }

  public static create(props: Omit<ReservationProps, 'status' | 'assignments' | 'notes' | 'timeline'>, id?: ReservationId): Reservation {
    if (props.partySize.size <= 0) throw new ReservationDomainError('Party size must be greater than 0');
    if (props.duration.minutes <= 0) throw new ReservationDomainError('Duration must be greater than 0');
    if (props.date.date.getTime() < new Date().setHours(0,0,0,0)) throw new ReservationDomainError('Reservation cannot be in the past');

    const timelineEntry = ReservationTimeline.create({ status: ReservationStatusEnum.PENDING, recordedAt: new Date() });

    const reservation = new Reservation({
      ...props,
      status: ReservationStatusEnum.PENDING,
      assignments: [],
      notes: [],
      timeline: [timelineEntry]
    }, id || ReservationId.create());

    reservation.addDomainEvent(new ReservationCreatedEvent(reservation.id, props.branchRef.branchId));
    return reservation;
  }

  public confirm(): void {
    if (this.props.status === ReservationStatusEnum.CANCELLED) throw new ReservationDomainError('Cannot confirm a cancelled reservation');
    if (this.props.status === ReservationStatusEnum.COMPLETED) throw new ReservationDomainError('Cannot modify completed reservation');
    
    this.props.status = ReservationStatusEnum.CONFIRMED;
    this.props.timeline.push(ReservationTimeline.create({ status: ReservationStatusEnum.CONFIRMED, recordedAt: new Date() }));
    this.addDomainEvent(new ReservationConfirmedEvent(this.id));
  }

  public cancel(reason: string): void {
    if (this.props.status === ReservationStatusEnum.COMPLETED) throw new ReservationDomainError('Cannot cancel completed reservation');
    
    this.props.status = ReservationStatusEnum.CANCELLED;
    this.props.timeline.push(ReservationTimeline.create({ status: ReservationStatusEnum.CANCELLED, recordedAt: new Date(), reason }));
    this.addDomainEvent(new ReservationCancelledEvent(this.id, reason));
  }

  public checkIn(): void {
    if (this.props.status !== ReservationStatusEnum.CONFIRMED) throw new ReservationDomainError('Reservation must be confirmed before check-in');
    
    this.props.status = ReservationStatusEnum.SEATED;
    this.props.timeline.push(ReservationTimeline.create({ status: ReservationStatusEnum.SEATED, recordedAt: new Date() }));
    this.addDomainEvent(new ReservationCheckedInEvent(this.id));
  }

  public complete(): void {
    if (this.props.status === ReservationStatusEnum.NO_SHOW) throw new ReservationDomainError('No-show reservations cannot transition to completed');
    
    this.props.status = ReservationStatusEnum.COMPLETED;
    this.props.timeline.push(ReservationTimeline.create({ status: ReservationStatusEnum.COMPLETED, recordedAt: new Date() }));
    this.addDomainEvent(new ReservationCompletedEvent(this.id));
  }

  public markNoShow(): void {
    if (this.props.status === ReservationStatusEnum.CANCELLED || this.props.status === ReservationStatusEnum.COMPLETED) {
      throw new ReservationDomainError('Cannot mark no-show for cancelled or completed reservations');
    }
    
    this.props.status = ReservationStatusEnum.NO_SHOW;
    this.props.timeline.push(ReservationTimeline.create({ status: ReservationStatusEnum.NO_SHOW, recordedAt: new Date() }));
    this.addDomainEvent(new ReservationMarkedNoShowEvent(this.id));
  }

  public reschedule(newDate: ReservationDate, newTime: ReservationTime): void {
    if (this.props.status === ReservationStatusEnum.CANCELLED || this.props.status === ReservationStatusEnum.COMPLETED) {
      throw new ReservationDomainError('Cannot reschedule cancelled or completed reservations');
    }
    
    this.props.date = newDate;
    this.props.time = newTime;
    this.props.status = ReservationStatusEnum.PENDING; // requires re-confirmation
    this.props.timeline.push(ReservationTimeline.create({ status: ReservationStatusEnum.PENDING, recordedAt: new Date(), reason: 'Rescheduled' }));
    
    this.addDomainEvent(new ReservationRescheduledEvent(this.id, newTime.time));
  }

  public addNote(note: ReservationNote): void {
    if (this.props.status === ReservationStatusEnum.CANCELLED || this.props.status === ReservationStatusEnum.COMPLETED) {
      throw new ReservationDomainError('Cannot add notes to a cancelled or completed reservation');
    }
    this.props.notes.push(note);
    this.addDomainEvent(new ReservationNoteAddedEvent(this.id, note.author));
  }
}`,

  // Refined Specifications & Policies
  'specifications/reservation.specifications.ts': `import { Reservation } from '../aggregates/reservation.aggregate';

export class ReservationConsistencySpecification {
  public static isConsistent(reservation: Reservation): boolean {
    return reservation.partySize.size > 0 && reservation.duration.minutes > 0;
  }
}

export class ReservationCapacitySpecification {
  public static fits(partySize: number, tableCapacity: number): boolean {
    return partySize <= tableCapacity;
  }
}

export class ReservationStatusSpecification {
  public static canCheckIn(status: string): boolean {
    return status === 'CONFIRMED';
  }
}

export class ReservationGuestSpecification {
  public static hasValidContact(reservation: Reservation): boolean {
    return !!(reservation.contact.phone || reservation.contact.email);
  }
}

export class ReservationAssignmentSpecification {
  public static isAssigned(reservation: Reservation): boolean {
    return reservation.assignments.length > 0;
  }
}`,

  'policies/reservation.policies.ts': `import { Reservation } from '../aggregates/reservation.aggregate';
import { ReservationDomainError } from '../exceptions/reservation.exceptions';

export class ReservationLifecyclePolicy {
  public static enforce(reservation: Reservation): void {
    if (!reservation) throw new ReservationDomainError('Reservation is required');
  }
}

export class ReservationValidationPolicy {
  public static enforceNew(partySize: number, duration: number): void {
    if (partySize <= 0) throw new ReservationDomainError('Party size must be greater than 0');
    if (duration <= 0) throw new ReservationDomainError('Duration must be greater than 0');
  }
}

export class ReservationAssignmentPolicy {
  public static enforce(assignment: any): void {
    if (!assignment) throw new ReservationDomainError('Assignment cannot be null');
  }
}

export class ReservationConfirmationPolicy {
  public static enforce(status: string): void {
    if (status === 'CANCELLED') throw new ReservationDomainError('Cannot confirm a cancelled reservation');
  }
}

export class ReservationCancellationPolicy {
  public static enforce(status: string): void {
    if (status === 'COMPLETED') throw new ReservationDomainError('Cannot cancel completed reservation');
  }
}`,

  // Unit tests to satisfy "pnpm test src/modules/reservation/domain"
  'tests/reservation.aggregate.spec.ts': `import { Reservation } from '../aggregates/reservation.aggregate';
import { ReservationId } from '../value-objects/reservation-id.value-object';
import { BranchReference } from '../value-objects/branch-reference.value-object';
import { ReservationPartySize } from '../value-objects/reservation-party-size.value-object';
import { ReservationDuration } from '../value-objects/reservation-duration.value-object';
import { ReservationDate } from '../value-objects/reservation-date.value-object';
import { ReservationTime } from '../value-objects/reservation-time.value-object';
import { ReservationStatusEnum, ReservationTypeEnum, ReservationSourceEnum, ReservationPriorityEnum } from '../enums/reservation.enum';
import { ReservationGuest } from '../entities/reservation-guest.entity';
import { ReservationContact } from '../entities/reservation-contact.entity';
import { ReservationDomainError } from '../exceptions/reservation.exceptions';

describe('Reservation Aggregate', () => {
  const createValidReservation = () => {
    return Reservation.create({
      branchRef: BranchReference.create('branch-1'),
      guest: ReservationGuest.create({ firstName: 'John', lastName: 'Doe' }),
      contact: ReservationContact.create({ phone: '123456789' }),
      partySize: ReservationPartySize.create(4),
      date: ReservationDate.create(new Date(new Date().getTime() + 86400000)), // tomorrow
      time: ReservationTime.create('19:00'),
      duration: ReservationDuration.create(120),
      type: ReservationTypeEnum.STANDARD,
      source: ReservationSourceEnum.WEBSITE,
      priority: ReservationPriorityEnum.NORMAL
    });
  };

  it('should successfully create a valid reservation in PENDING state', () => {
    const reservation = createValidReservation();
    expect(reservation.status).toBe(ReservationStatusEnum.PENDING);
    expect(reservation.domainEvents.length).toBe(1);
    expect(reservation.domainEvents[0].constructor.name).toBe('ReservationCreatedEvent');
  });

  it('should fail creation if party size is 0', () => {
    expect(() => {
      Reservation.create({
        branchRef: BranchReference.create('branch-1'),
        guest: ReservationGuest.create({ firstName: 'John', lastName: 'Doe' }),
        contact: ReservationContact.create({ phone: '123456789' }),
        partySize: ReservationPartySize.create(0),
        date: ReservationDate.create(new Date(new Date().getTime() + 86400000)),
        time: ReservationTime.create('19:00'),
        duration: ReservationDuration.create(120),
        type: ReservationTypeEnum.STANDARD,
        source: ReservationSourceEnum.WEBSITE,
        priority: ReservationPriorityEnum.NORMAL
      });
    }).toThrow(ReservationDomainError);
  });

  it('should progress through the lifecycle', () => {
    const reservation = createValidReservation();
    reservation.clearEvents();

    reservation.confirm();
    expect(reservation.status).toBe(ReservationStatusEnum.CONFIRMED);

    reservation.checkIn();
    expect(reservation.status).toBe(ReservationStatusEnum.SEATED);

    reservation.complete();
    expect(reservation.status).toBe(ReservationStatusEnum.COMPLETED);
  });

  it('should not allow check-in before confirmation', () => {
    const reservation = createValidReservation();
    expect(() => reservation.checkIn()).toThrow(ReservationDomainError);
  });

  it('should not allow cancellation of completed reservations', () => {
    const reservation = createValidReservation();
    reservation.confirm();
    reservation.checkIn();
    reservation.complete();
    expect(() => reservation.cancel('Testing')).toThrow(ReservationDomainError);
  });
});`
};

Object.keys(filesToCreate).forEach(relPath => {
  const fullPath = path.join(baseDir, relPath);
  const dir = path.dirname(fullPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(fullPath, filesToCreate[relPath]);
  console.log('Created:', fullPath);
});
