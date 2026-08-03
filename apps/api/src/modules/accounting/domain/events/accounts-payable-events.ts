import { DomainEvent } from '@saas/events';
import { EventMetadata, createEventMetadata } from '@saas/events';

export class PayableCreated extends DomainEvent<{ payableId: string, supplierReference: string, originalAmount: number }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { payableId: string, supplierReference: string, originalAmount: number }, metadata: EventMetadata = createEventMetadata()) {
    super(crypto.randomUUID(), 'PayableCreated', aggregateId, 'AccountsPayable', aggregateVersion, new Date(), payload, metadata);
  }
}

export class SupplierInvoiceRegistered extends DomainEvent<{ payableId: string, vendorInvoiceNumber: string }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { payableId: string, vendorInvoiceNumber: string }, metadata: EventMetadata = createEventMetadata()) {
    super(crypto.randomUUID(), 'SupplierInvoiceRegistered', aggregateId, 'AccountsPayable', aggregateVersion, new Date(), payload, metadata);
  }
}

export class PayableApproved extends DomainEvent<{ payableId: string, approverId: string }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { payableId: string, approverId: string }, metadata: EventMetadata = createEventMetadata()) {
    super(crypto.randomUUID(), 'PayableApproved', aggregateId, 'AccountsPayable', aggregateVersion, new Date(), payload, metadata);
  }
}

export class PayablePaymentAllocated extends DomainEvent<{ payableId: string, paymentReference: string, amount: number, outstandingBalance: number }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { payableId: string, paymentReference: string, amount: number, outstandingBalance: number }, metadata: EventMetadata = createEventMetadata()) {
    super(crypto.randomUUID(), 'PayablePaymentAllocated', aggregateId, 'AccountsPayable', aggregateVersion, new Date(), payload, metadata);
  }
}

export class PayablePartialPaymentRecorded extends DomainEvent<{ payableId: string, amount: number }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { payableId: string, amount: number }, metadata: EventMetadata = createEventMetadata()) {
    super(crypto.randomUUID(), 'PayablePartialPaymentRecorded', aggregateId, 'AccountsPayable', aggregateVersion, new Date(), payload, metadata);
  }
}

export class CreditNoteApplied extends DomainEvent<{ payableId: string, creditNoteReference: string, amount: number }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { payableId: string, creditNoteReference: string, amount: number }, metadata: EventMetadata = createEventMetadata()) {
    super(crypto.randomUUID(), 'CreditNoteApplied', aggregateId, 'AccountsPayable', aggregateVersion, new Date(), payload, metadata);
  }
}

export class PayableClosed extends DomainEvent<{ payableId: string }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { payableId: string }, metadata: EventMetadata = createEventMetadata()) {
    super(crypto.randomUUID(), 'PayableClosed', aggregateId, 'AccountsPayable', aggregateVersion, new Date(), payload, metadata);
  }
}

export class PayableWrittenOff extends DomainEvent<{ payableId: string, amount: number, approverId: string }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { payableId: string, amount: number, approverId: string }, metadata: EventMetadata = createEventMetadata()) {
    super(crypto.randomUUID(), 'PayableWrittenOff', aggregateId, 'AccountsPayable', aggregateVersion, new Date(), payload, metadata);
  }
}

export class PayableReopened extends DomainEvent<{ payableId: string, reason: string }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { payableId: string, reason: string }, metadata: EventMetadata = createEventMetadata()) {
    super(crypto.randomUUID(), 'PayableReopened', aggregateId, 'AccountsPayable', aggregateVersion, new Date(), payload, metadata);
  }
}
