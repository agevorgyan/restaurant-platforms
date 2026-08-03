import { DomainEvent } from '@saas/events';
import { EventMetadata, createEventMetadata } from '@saas/events';

export interface StaffMemberCreatedPayload {
  staffId: string;
  firstName: string;
  lastName: string;
  email: string;
}

export class StaffMemberCreated extends DomainEvent<StaffMemberCreatedPayload> {
  constructor(
    aggregateId: string,
    aggregateVersion: number,
    payload: StaffMemberCreatedPayload,
    metadata: EventMetadata = createEventMetadata()
  ) {
    super(
      crypto.randomUUID(),
      'StaffMemberCreated',
      aggregateId,
      'StaffMember',
      aggregateVersion,
      new Date(),
      payload,
      metadata
    );
  }
}

export interface StaffMemberUpdatedPayload {
  staffId: string;
  [key: string]: unknown;
}

export class StaffMemberUpdated extends DomainEvent<StaffMemberUpdatedPayload> {
  constructor(
    aggregateId: string,
    aggregateVersion: number,
    payload: StaffMemberUpdatedPayload,
    metadata: EventMetadata = createEventMetadata()
  ) {
    super(
      crypto.randomUUID(),
      'StaffMemberUpdated',
      aggregateId,
      'StaffMember',
      aggregateVersion,
      new Date(),
      payload,
      metadata
    );
  }
}

export class StaffActivated extends DomainEvent<{ staffId: string }> {
  constructor(
    aggregateId: string,
    aggregateVersion: number,
    payload: { staffId: string },
    metadata: EventMetadata = createEventMetadata()
  ) {
    super(
      crypto.randomUUID(),
      'StaffActivated',
      aggregateId,
      'StaffMember',
      aggregateVersion,
      new Date(),
      payload,
      metadata
    );
  }
}

export class StaffDeactivated extends DomainEvent<{ staffId: string }> {
  constructor(
    aggregateId: string,
    aggregateVersion: number,
    payload: { staffId: string },
    metadata: EventMetadata = createEventMetadata()
  ) {
    super(
      crypto.randomUUID(),
      'StaffDeactivated',
      aggregateId,
      'StaffMember',
      aggregateVersion,
      new Date(),
      payload,
      metadata
    );
  }
}
