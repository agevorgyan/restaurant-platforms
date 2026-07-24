import { DomainEvent } from '@saas/events';
import { EventMetadata } from '@saas/events/src/metadata';

export interface ShiftCreatedPayload {
  shiftId: string;
  shiftCode: string;
  shiftName: string;
  startTime: Date;
  endTime: Date;
  maximumCapacity: number;
}

export class ShiftCreated extends DomainEvent<ShiftCreatedPayload> {
  constructor(aggregateId: string, aggregateVersion: number, payload: ShiftCreatedPayload, metadata: EventMetadata = {}) {
    super(crypto.randomUUID(), 'ShiftCreated', aggregateId, 'Shift', aggregateVersion, new Date(), payload, metadata);
  }
}

export interface EmployeeAssignedToShiftPayload {
  shiftId: string;
  staffId: string;
}

export class EmployeeAssignedToShift extends DomainEvent<EmployeeAssignedToShiftPayload> {
  constructor(aggregateId: string, aggregateVersion: number, payload: EmployeeAssignedToShiftPayload, metadata: EventMetadata = {}) {
    super(crypto.randomUUID(), 'EmployeeAssignedToShift', aggregateId, 'Shift', aggregateVersion, new Date(), payload, metadata);
  }
}

export interface EmployeeRemovedFromShiftPayload {
  shiftId: string;
  staffId: string;
}

export class EmployeeRemovedFromShift extends DomainEvent<EmployeeRemovedFromShiftPayload> {
  constructor(aggregateId: string, aggregateVersion: number, payload: EmployeeRemovedFromShiftPayload, metadata: EventMetadata = {}) {
    super(crypto.randomUUID(), 'EmployeeRemovedFromShift', aggregateId, 'Shift', aggregateVersion, new Date(), payload, metadata);
  }
}

export class ShiftStarted extends DomainEvent<{ shiftId: string }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { shiftId: string }, metadata: EventMetadata = {}) {
    super(crypto.randomUUID(), 'ShiftStarted', aggregateId, 'Shift', aggregateVersion, new Date(), payload, metadata);
  }
}

export class ShiftCompleted extends DomainEvent<{ shiftId: string }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { shiftId: string }, metadata: EventMetadata = {}) {
    super(crypto.randomUUID(), 'ShiftCompleted', aggregateId, 'Shift', aggregateVersion, new Date(), payload, metadata);
  }
}

export class ShiftCancelled extends DomainEvent<{ shiftId: string; reason?: string }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { shiftId: string; reason?: string }, metadata: EventMetadata = {}) {
    super(crypto.randomUUID(), 'ShiftCancelled', aggregateId, 'Shift', aggregateVersion, new Date(), payload, metadata);
  }
}
