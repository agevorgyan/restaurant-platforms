import { DomainEvent } from '@saas/events';
import { EventMetadata, createEventMetadata } from '@saas/events';

export interface AvailabilityCreatedPayload {
  availabilityId: string;
  staffId: string;
  status: string;
}

export class AvailabilityCreated extends DomainEvent<AvailabilityCreatedPayload> {
  constructor(aggregateId: string, aggregateVersion: number, payload: AvailabilityCreatedPayload, metadata: EventMetadata = createEventMetadata()) {
    super(crypto.randomUUID(), 'AvailabilityCreated', aggregateId, 'Availability', aggregateVersion, new Date(), payload, metadata);
  }
}

export interface TimeOffRequestedPayload {
  availabilityId: string;
  requestId: string;
  type: string;
  startDate: Date;
  endDate: Date;
}

export class TimeOffRequested extends DomainEvent<TimeOffRequestedPayload> {
  constructor(aggregateId: string, aggregateVersion: number, payload: TimeOffRequestedPayload, metadata: EventMetadata = createEventMetadata()) {
    super(crypto.randomUUID(), 'TimeOffRequested', aggregateId, 'Availability', aggregateVersion, new Date(), payload, metadata);
  }
}

export class TimeOffCancelled extends DomainEvent<{ availabilityId: string, requestId: string }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { availabilityId: string, requestId: string }, metadata: EventMetadata = createEventMetadata()) {
    super(crypto.randomUUID(), 'TimeOffCancelled', aggregateId, 'Availability', aggregateVersion, new Date(), payload, metadata);
  }
}

export class TimeOffApproved extends DomainEvent<{ availabilityId: string, requestId: string, approverId: string }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { availabilityId: string, requestId: string, approverId: string }, metadata: EventMetadata = createEventMetadata()) {
    super(crypto.randomUUID(), 'TimeOffApproved', aggregateId, 'Availability', aggregateVersion, new Date(), payload, metadata);
  }
}

export class TimeOffRejected extends DomainEvent<{ availabilityId: string, requestId: string, approverId: string }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { availabilityId: string, requestId: string, approverId: string }, metadata: EventMetadata = createEventMetadata()) {
    super(crypto.randomUUID(), 'TimeOffRejected', aggregateId, 'Availability', aggregateVersion, new Date(), payload, metadata);
  }
}

export class VacationRecorded extends DomainEvent<{ availabilityId: string, requestId: string, daysDeducted: number }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { availabilityId: string, requestId: string, daysDeducted: number }, metadata: EventMetadata = createEventMetadata()) {
    super(crypto.randomUUID(), 'VacationRecorded', aggregateId, 'Availability', aggregateVersion, new Date(), payload, metadata);
  }
}

export class SickLeaveRecorded extends DomainEvent<{ availabilityId: string, requestId: string }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { availabilityId: string, requestId: string }, metadata: EventMetadata = createEventMetadata()) {
    super(crypto.randomUUID(), 'SickLeaveRecorded', aggregateId, 'Availability', aggregateVersion, new Date(), payload, metadata);
  }
}

export class AvailabilityUpdated extends DomainEvent<{ availabilityId: string, status: string }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { availabilityId: string, status: string }, metadata: EventMetadata = createEventMetadata()) {
    super(crypto.randomUUID(), 'AvailabilityUpdated', aggregateId, 'Availability', aggregateVersion, new Date(), payload, metadata);
  }
}
