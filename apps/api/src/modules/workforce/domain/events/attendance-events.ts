import { DomainEvent } from '@saas/events';
import { EventMetadata, createEventMetadata } from '@saas/events';

export interface AttendanceCreatedPayload {
  attendanceId: string;
  staffId: string;
  shiftId: string;
}

export class AttendanceCreated extends DomainEvent<AttendanceCreatedPayload> {
  constructor(aggregateId: string, aggregateVersion: number, payload: AttendanceCreatedPayload, metadata: EventMetadata = createEventMetadata()) {
    super(crypto.randomUUID(), 'AttendanceCreated', aggregateId, 'AttendanceRecord', aggregateVersion, new Date(), payload, metadata);
  }
}

export interface EmployeeCheckedInPayload {
  attendanceId: string;
  checkInTime: Date;
  source: string;
}

export class EmployeeCheckedIn extends DomainEvent<EmployeeCheckedInPayload> {
  constructor(aggregateId: string, aggregateVersion: number, payload: EmployeeCheckedInPayload, metadata: EventMetadata = createEventMetadata()) {
    super(crypto.randomUUID(), 'EmployeeCheckedIn', aggregateId, 'AttendanceRecord', aggregateVersion, new Date(), payload, metadata);
  }
}

export class BreakStarted extends DomainEvent<{ attendanceId: string, breakId: string, startTime: Date }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { attendanceId: string, breakId: string, startTime: Date }, metadata: EventMetadata = createEventMetadata()) {
    super(crypto.randomUUID(), 'BreakStarted', aggregateId, 'AttendanceRecord', aggregateVersion, new Date(), payload, metadata);
  }
}

export class BreakEnded extends DomainEvent<{ attendanceId: string, breakId: string, endTime: Date }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { attendanceId: string, breakId: string, endTime: Date }, metadata: EventMetadata = createEventMetadata()) {
    super(crypto.randomUUID(), 'BreakEnded', aggregateId, 'AttendanceRecord', aggregateVersion, new Date(), payload, metadata);
  }
}

export class EmployeeCheckedOut extends DomainEvent<{ attendanceId: string, checkOutTime: Date, source: string }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { attendanceId: string, checkOutTime: Date, source: string }, metadata: EventMetadata = createEventMetadata()) {
    super(crypto.randomUUID(), 'EmployeeCheckedOut', aggregateId, 'AttendanceRecord', aggregateVersion, new Date(), payload, metadata);
  }
}

export class AttendanceCorrected extends DomainEvent<{ attendanceId: string, correctionId: string, reason: string }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { attendanceId: string, correctionId: string, reason: string }, metadata: EventMetadata = createEventMetadata()) {
    super(crypto.randomUUID(), 'AttendanceCorrected', aggregateId, 'AttendanceRecord', aggregateVersion, new Date(), payload, metadata);
  }
}

export class AttendanceCorrectionApproved extends DomainEvent<{ attendanceId: string, correctionId: string }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { attendanceId: string, correctionId: string }, metadata: EventMetadata = createEventMetadata()) {
    super(crypto.randomUUID(), 'AttendanceCorrectionApproved', aggregateId, 'AttendanceRecord', aggregateVersion, new Date(), payload, metadata);
  }
}

export class AttendanceCorrectionRejected extends DomainEvent<{ attendanceId: string, correctionId: string }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { attendanceId: string, correctionId: string }, metadata: EventMetadata = createEventMetadata()) {
    super(crypto.randomUUID(), 'AttendanceCorrectionRejected', aggregateId, 'AttendanceRecord', aggregateVersion, new Date(), payload, metadata);
  }
}
