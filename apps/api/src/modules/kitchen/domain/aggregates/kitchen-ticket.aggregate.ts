import { AggregateRoot } from '@saas/core';
import { KitchenTicketNumber } from '../value-objects/kitchen-ticket-number.value-object';
import { KitchenTicketStatus } from '../value-objects/kitchen-ticket-status.value-object';
import { KitchenTicketStatus as KitchenTicketStatusEnum } from '../enums/kitchen-ticket-status.enum';
import { KitchenTicketPriority } from '../value-objects/kitchen-ticket-priority.value-object';
import { ProductionPriority } from '../enums/production-priority.enum';
import { KitchenEstimatedPreparationTime } from '../value-objects/kitchen-estimated-preparation-time.value-object';
import { KitchenStartedAt } from '../value-objects/kitchen-started-at.value-object';
import { KitchenCompletedAt } from '../value-objects/kitchen-completed-at.value-object';
import { KitchenVersion } from '../value-objects/kitchen-version.value-object';

import { KitchenTicketItem } from '../entities/kitchen-ticket-item.entity';
import { KitchenStationAssignment } from '../entities/kitchen-station-assignment.entity';
import { KitchenTimeline } from '../entities/kitchen-timeline.entity';
import { KitchenNote } from '../entities/kitchen-note.entity';
import { KitchenPriorityOverride } from '../entities/kitchen-priority-override.entity';

import { KitchenTicketDomainError } from '../errors/kitchen-ticket.domain-error';
import { KitchenTicketValidationPolicy, KitchenWorkflowPolicy, KitchenPriorityPolicy } from '../policies/kitchen-ticket.policy';
import { KitchenTicketLifecycleSpecification, KitchenTicketItemSpecification } from '../specifications/kitchen-ticket.specification';

import {
  KitchenTicketCreatedEvent,
  KitchenTicketQueuedEvent,
  KitchenPreparationStartedEvent,
  KitchenTicketReadyEvent,
  KitchenTicketServedEvent,
  KitchenTicketCancelledEvent,
  KitchenPriorityChangedEvent
} from '../events/kitchen-ticket.events';

export interface KitchenTicketProps {
  id: string;
  orderId: string;
  ticketNumber: KitchenTicketNumber;
  status: KitchenTicketStatus;
  priority: KitchenTicketPriority;
  estimatedPreparationTime?: KitchenEstimatedPreparationTime;
  startedAt?: KitchenStartedAt;
  completedAt?: KitchenCompletedAt;
  version: KitchenVersion;
  items: KitchenTicketItem[];
  assignments: KitchenStationAssignment[];
  timeline: KitchenTimeline[];
  notes: KitchenNote[];
  priorityOverrides: KitchenPriorityOverride[];
  createdAt: Date;
  updatedAt: Date;
}

export class KitchenTicket extends AggregateRoot<KitchenTicketProps> {
  get id(): string {
    return this._id;
  }

  get orderId(): string {
    return this.props.orderId;
  }

  get ticketNumber(): KitchenTicketNumber {
    return this.props.ticketNumber;
  }

  get status(): KitchenTicketStatus {
    return this.props.status;
  }

  get priority(): KitchenTicketPriority {
    return this.props.priority;
  }

  get items(): KitchenTicketItem[] {
    return [...this.props.items];
  }

  get timeline(): KitchenTimeline[] {
    return [...this.props.timeline];
  }

  get assignments(): KitchenStationAssignment[] {
    return [...this.props.assignments];
  }

  private constructor(id: string, props: KitchenTicketProps) {
    super(id, props);
  }

  public static create(
    id: string,
    orderId: string,
    ticketNumber: KitchenTicketNumber,
    items: KitchenTicketItem[],
    priority: ProductionPriority = ProductionPriority.NORMAL
  ): KitchenTicket {
    if (!orderId || orderId.trim() === '') {
      throw new KitchenTicketDomainError('Order ID cannot be empty');
    }

    KitchenTicketValidationPolicy.validate(items);

    const ticket = new KitchenTicket(id, {
      id,
      orderId,
      ticketNumber,
      status: KitchenTicketStatus.create(KitchenTicketStatusEnum.PENDING),
      priority: KitchenTicketPriority.create(priority),
      version: KitchenVersion.create(1),
      items: [...items],
      assignments: [],
      timeline: [],
      notes: [],
      priorityOverrides: [],
      createdAt: new Date(),
      updatedAt: new Date()
    });

    ticket.recordTimelineEvent(KitchenTicketStatusEnum.PENDING, 'SYSTEM', 'Ticket Created');
    ticket.addDomainEvent(new KitchenTicketCreatedEvent(ticket.id, ticket.orderId, ticket.ticketNumber.value));

    return ticket;
  }

  public queue(triggeredBy: string): void {
    this.transitionTo(KitchenTicketStatusEnum.QUEUED, triggeredBy);
    this.addDomainEvent(new KitchenTicketQueuedEvent(this.id));
  }

  public startPreparation(triggeredBy: string): void {
    if (!KitchenWorkflowPolicy.canStartPreparation(this.status.value)) {
      throw new KitchenTicketDomainError(`Cannot start preparation from status: ${this.status.value}`);
    }

    this.transitionTo(KitchenTicketStatusEnum.IN_PREPARATION, triggeredBy);
    this.props.startedAt = KitchenStartedAt.create(new Date());
    this.addDomainEvent(new KitchenPreparationStartedEvent(this.id));
  }

  public markReady(triggeredBy: string): void {
    if (!KitchenWorkflowPolicy.canMarkReady(this.status.value)) {
      throw new KitchenTicketDomainError(`Cannot mark ready from status: ${this.status.value}`);
    }

    this.transitionTo(KitchenTicketStatusEnum.READY, triggeredBy);
    this.props.completedAt = KitchenCompletedAt.create(new Date());
    this.addDomainEvent(new KitchenTicketReadyEvent(this.id));
  }

  public serve(triggeredBy: string): void {
    this.transitionTo(KitchenTicketStatusEnum.SERVED, triggeredBy);
    this.addDomainEvent(new KitchenTicketServedEvent(this.id));
  }

  public cancel(triggeredBy: string, reason: string): void {
    if (!reason || reason.trim() === '') {
      throw new KitchenTicketDomainError('Cancellation requires a reason');
    }

    this.transitionTo(KitchenTicketStatusEnum.CANCELLED, triggeredBy, reason);
    this.addDomainEvent(new KitchenTicketCancelledEvent(this.id, reason));
  }

  public changePriority(newPriority: ProductionPriority, authorId: string, reason: string): void {
    if (!KitchenPriorityPolicy.canChangePriority(this.status.value)) {
      throw new KitchenTicketDomainError('Cannot change priority for a ready or terminal ticket');
    }

    if (!KitchenPriorityPolicy.isValidTransition(this.priority.value, newPriority)) {
      throw new KitchenTicketDomainError('New priority must be different from current priority');
    }

    const override = KitchenPriorityOverride.create(
      this.generateId(),
      this.priority.value,
      newPriority,
      reason,
      authorId
    );

    this.props.priorityOverrides.push(override);
    this.props.priority = KitchenTicketPriority.create(newPriority);
    this.incrementVersion();

    this.addDomainEvent(new KitchenPriorityChangedEvent(this.id, override.previousPriority, override.newPriority));
  }

  public addItem(item: KitchenTicketItem): void {
    if (this.status.value !== KitchenTicketStatusEnum.PENDING) {
      throw new KitchenTicketDomainError('Cannot add items to a non-pending ticket');
    }

    if (!KitchenTicketItemSpecification.isSatisfiedBy(this.props.items, item)) {
      throw new KitchenTicketDomainError('Duplicate order item reference in ticket');
    }

    this.props.items.push(item);
    this.incrementVersion();
  }

  private transitionTo(newStatus: KitchenTicketStatusEnum, triggeredBy: string, reason?: string): void {
    if (!KitchenTicketLifecycleSpecification.canTransition(this.status.value, newStatus)) {
      throw new KitchenTicketDomainError(`Invalid transition from ${this.status.value} to ${newStatus}`);
    }

    this.props.status = KitchenTicketStatus.create(newStatus);
    this.recordTimelineEvent(newStatus, triggeredBy, reason);
    this.incrementVersion();
  }

  private recordTimelineEvent(status: KitchenTicketStatusEnum, triggeredBy: string, reason?: string): void {
    const timelineEvent = KitchenTimeline.create(
      this.generateId(),
      status,
      triggeredBy,
      reason
    );
    this.props.timeline.push(timelineEvent);
  }

  private incrementVersion(): void {
    this.props.version = this.props.version.increment();
    this.props.updatedAt = new Date();
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 9);
  }
}
