import { AggregateRoot } from '@saas/core';
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
    super(id.value, props);
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
}