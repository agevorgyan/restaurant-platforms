import { DomainEvent } from '@saas/events';
import { EventMetadata } from '@saas/events/src/metadata';

export interface AttendanceRecordedPayload {
  attendanceId: string;
  staffId: string;
  shiftId: string;
  checkInTime: Date;
}

export class AttendanceRecorded extends DomainEvent<AttendanceRecordedPayload> {
  constructor(
    aggregateId: string,
    aggregateVersion: number,
    payload: AttendanceRecordedPayload,
    metadata: EventMetadata = {}
  ) {
    super(crypto.randomUUID(), 'AttendanceRecorded', aggregateId, 'AttendanceRecord', aggregateVersion, new Date(), payload, metadata);
  }
}

export interface AttendanceCorrectedPayload {
  attendanceId: string;
  reason: string;
  correctedCheckInTime?: Date;
  correctedCheckOutTime?: Date;
}

export class AttendanceCorrected extends DomainEvent<AttendanceCorrectedPayload> {
  constructor(
    aggregateId: string,
    aggregateVersion: number,
    payload: AttendanceCorrectedPayload,
    metadata: EventMetadata = {}
  ) {
    super(crypto.randomUUID(), 'AttendanceCorrected', aggregateId, 'AttendanceRecord', aggregateVersion, new Date(), payload, metadata);
  }
}
