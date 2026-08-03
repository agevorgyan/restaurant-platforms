import { DomainEvent } from '@saas/events';
import { EventMetadata, createEventMetadata } from '@saas/events';

export interface ScheduleCreatedPayload {
  scheduleId: string;
  scheduleCode: string;
  scheduleName: string;
  startDate: Date;
  endDate: Date;
}

export class ScheduleCreated extends DomainEvent<ScheduleCreatedPayload> {
  constructor(aggregateId: string, aggregateVersion: number, payload: ScheduleCreatedPayload, metadata: EventMetadata = createEventMetadata()) {
    super(crypto.randomUUID(), 'ScheduleCreated', aggregateId, 'Schedule', aggregateVersion, new Date(), payload, metadata);
  }
}

export interface ShiftAddedToSchedulePayload {
  scheduleId: string;
  shiftId: string;
}

export class ShiftAddedToSchedule extends DomainEvent<ShiftAddedToSchedulePayload> {
  constructor(aggregateId: string, aggregateVersion: number, payload: ShiftAddedToSchedulePayload, metadata: EventMetadata = createEventMetadata()) {
    super(crypto.randomUUID(), 'ShiftAddedToSchedule', aggregateId, 'Schedule', aggregateVersion, new Date(), payload, metadata);
  }
}

export interface ShiftRemovedFromSchedulePayload {
  scheduleId: string;
  shiftId: string;
}

export class ShiftRemovedFromSchedule extends DomainEvent<ShiftRemovedFromSchedulePayload> {
  constructor(aggregateId: string, aggregateVersion: number, payload: ShiftRemovedFromSchedulePayload, metadata: EventMetadata = createEventMetadata()) {
    super(crypto.randomUUID(), 'ShiftRemovedFromSchedule', aggregateId, 'Schedule', aggregateVersion, new Date(), payload, metadata);
  }
}

export class SchedulePublished extends DomainEvent<{ scheduleId: string }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { scheduleId: string }, metadata: EventMetadata = createEventMetadata()) {
    super(crypto.randomUUID(), 'SchedulePublished', aggregateId, 'Schedule', aggregateVersion, new Date(), payload, metadata);
  }
}

export class ScheduleLocked extends DomainEvent<{ scheduleId: string }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { scheduleId: string }, metadata: EventMetadata = createEventMetadata()) {
    super(crypto.randomUUID(), 'ScheduleLocked', aggregateId, 'Schedule', aggregateVersion, new Date(), payload, metadata);
  }
}

export class ScheduleUnlocked extends DomainEvent<{ scheduleId: string }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { scheduleId: string }, metadata: EventMetadata = createEventMetadata()) {
    super(crypto.randomUUID(), 'ScheduleUnlocked', aggregateId, 'Schedule', aggregateVersion, new Date(), payload, metadata);
  }
}

export class ScheduleArchived extends DomainEvent<{ scheduleId: string }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { scheduleId: string }, metadata: EventMetadata = createEventMetadata()) {
    super(crypto.randomUUID(), 'ScheduleArchived', aggregateId, 'Schedule', aggregateVersion, new Date(), payload, metadata);
  }
}
