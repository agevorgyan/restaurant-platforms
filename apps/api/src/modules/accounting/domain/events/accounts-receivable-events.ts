import { DomainEvent } from '@saas/events';
import { EventMetadata, createEventMetadata } from '@saas/events';

export class ReceivableCreated extends DomainEvent<{ receivableId: string, customerReference: string, originalAmount: number }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { receivableId: string, customerReference: string, originalAmount: number }, metadata: EventMetadata = createEventMetadata()) {
    super(crypto.randomUUID(), 'ReceivableCreated', aggregateId, 'AccountsReceivable', aggregateVersion, new Date(), payload, metadata);
  }
}

export class InvoiceIssued extends DomainEvent<{ receivableId: string, invoiceReference: string }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { receivableId: string, invoiceReference: string }, metadata: EventMetadata = createEventMetadata()) {
    super(crypto.randomUUID(), 'InvoiceIssued', aggregateId, 'AccountsReceivable', aggregateVersion, new Date(), payload, metadata);
  }
}

export class PaymentAllocated extends DomainEvent<{ receivableId: string, paymentReference: string, amount: number, outstandingBalance: number }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { receivableId: string, paymentReference: string, amount: number, outstandingBalance: number }, metadata: EventMetadata = createEventMetadata()) {
    super(crypto.randomUUID(), 'PaymentAllocated', aggregateId, 'AccountsReceivable', aggregateVersion, new Date(), payload, metadata);
  }
}

export class PartialPaymentRecorded extends DomainEvent<{ receivableId: string, amount: number }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { receivableId: string, amount: number }, metadata: EventMetadata = createEventMetadata()) {
    super(crypto.randomUUID(), 'PartialPaymentRecorded', aggregateId, 'AccountsReceivable', aggregateVersion, new Date(), payload, metadata);
  }
}

export class ReceivableClosed extends DomainEvent<{ receivableId: string }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { receivableId: string }, metadata: EventMetadata = createEventMetadata()) {
    super(crypto.randomUUID(), 'ReceivableClosed', aggregateId, 'AccountsReceivable', aggregateVersion, new Date(), payload, metadata);
  }
}

export class ReceivableWrittenOff extends DomainEvent<{ receivableId: string, amount: number, approverId: string }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { receivableId: string, amount: number, approverId: string }, metadata: EventMetadata = createEventMetadata()) {
    super(crypto.randomUUID(), 'ReceivableWrittenOff', aggregateId, 'AccountsReceivable', aggregateVersion, new Date(), payload, metadata);
  }
}

export class ReceivableReopened extends DomainEvent<{ receivableId: string, reason: string }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { receivableId: string, reason: string }, metadata: EventMetadata = createEventMetadata()) {
    super(crypto.randomUUID(), 'ReceivableReopened', aggregateId, 'AccountsReceivable', aggregateVersion, new Date(), payload, metadata);
  }
}
