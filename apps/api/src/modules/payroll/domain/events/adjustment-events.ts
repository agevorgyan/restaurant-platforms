import { DomainEvent } from '@saas/events';
import { EventMetadata, createEventMetadata } from '@saas/events';

export class PayrollAdjustmentCreated extends DomainEvent<{ adjustmentId: string, employeeReference: string }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { adjustmentId: string, employeeReference: string }, metadata: EventMetadata = createEventMetadata()) {
    super(crypto.randomUUID(), 'PayrollAdjustmentCreated', aggregateId, 'PayrollAdjustment', aggregateVersion, new Date(), payload, metadata);
  }
}

export class PayrollAdjustmentUpdated extends DomainEvent<{ adjustmentId: string }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { adjustmentId: string }, metadata: EventMetadata = createEventMetadata()) {
    super(crypto.randomUUID(), 'PayrollAdjustmentUpdated', aggregateId, 'PayrollAdjustment', aggregateVersion, new Date(), payload, metadata);
  }
}

export class PayrollAdjustmentApproved extends DomainEvent<{ adjustmentId: string, approvedBy: string }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { adjustmentId: string, approvedBy: string }, metadata: EventMetadata = createEventMetadata()) {
    super(crypto.randomUUID(), 'PayrollAdjustmentApproved', aggregateId, 'PayrollAdjustment', aggregateVersion, new Date(), payload, metadata);
  }
}

export class PayrollAdjustmentRejected extends DomainEvent<{ adjustmentId: string, rejectedBy: string, reason: string }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { adjustmentId: string, rejectedBy: string, reason: string }, metadata: EventMetadata = createEventMetadata()) {
    super(crypto.randomUUID(), 'PayrollAdjustmentRejected', aggregateId, 'PayrollAdjustment', aggregateVersion, new Date(), payload, metadata);
  }
}

export class PayrollAdjustmentCancelled extends DomainEvent<{ adjustmentId: string, cancelledBy: string }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { adjustmentId: string, cancelledBy: string }, metadata: EventMetadata = createEventMetadata()) {
    super(crypto.randomUUID(), 'PayrollAdjustmentCancelled', aggregateId, 'PayrollAdjustment', aggregateVersion, new Date(), payload, metadata);
  }
}

export class PayrollAdjustmentApplied extends DomainEvent<{ adjustmentId: string }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { adjustmentId: string }, metadata: EventMetadata = createEventMetadata()) {
    super(crypto.randomUUID(), 'PayrollAdjustmentApplied', aggregateId, 'PayrollAdjustment', aggregateVersion, new Date(), payload, metadata);
  }
}

export class PayrollAdjustmentArchived extends DomainEvent<{ adjustmentId: string }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { adjustmentId: string }, metadata: EventMetadata = createEventMetadata()) {
    super(crypto.randomUUID(), 'PayrollAdjustmentArchived', aggregateId, 'PayrollAdjustment', aggregateVersion, new Date(), payload, metadata);
  }
}
