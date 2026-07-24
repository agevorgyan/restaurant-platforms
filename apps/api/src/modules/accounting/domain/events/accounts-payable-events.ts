import { DomainEvent } from '@saas/events';
import { EventMetadata } from '@saas/events/src/metadata';

export class PayableCreated extends DomainEvent<{ payableId: string, supplierReference: string, originalAmount: number }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { payableId: string, supplierReference: string, originalAmount: number }, metadata: EventMetadata = {}) {
    super(crypto.randomUUID(), 'PayableCreated', aggregateId, 'AccountsPayable', aggregateVersion, new Date(), payload, metadata);
  }
}

export class SupplierInvoiceRegistered extends DomainEvent<{ payableId: string, vendorInvoiceNumber: string }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { payableId: string, vendorInvoiceNumber: string }, metadata: EventMetadata = {}) {
    super(crypto.randomUUID(), 'SupplierInvoiceRegistered', aggregateId, 'AccountsPayable', aggregateVersion, new Date(), payload, metadata);
  }
}

export class PayableApproved extends DomainEvent<{ payableId: string, approverId: string }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { payableId: string, approverId: string }, metadata: EventMetadata = {}) {
    super(crypto.randomUUID(), 'PayableApproved', aggregateId, 'AccountsPayable', aggregateVersion, new Date(), payload, metadata);
  }
}

export class PaymentAllocated extends DomainEvent<{ payableId: string, paymentReference: string, amount: number, outstandingBalance: number }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { payableId: string, paymentReference: string, amount: number, outstandingBalance: number }, metadata: EventMetadata = {}) {
    super(crypto.randomUUID(), 'PaymentAllocated', aggregateId, 'AccountsPayable', aggregateVersion, new Date(), payload, metadata);
  }
}

export class PartialPaymentRecorded extends DomainEvent<{ payableId: string, amount: number }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { payableId: string, amount: number }, metadata: EventMetadata = {}) {
    super(crypto.randomUUID(), 'PartialPaymentRecorded', aggregateId, 'AccountsPayable', aggregateVersion, new Date(), payload, metadata);
  }
}

export class CreditNoteApplied extends DomainEvent<{ payableId: string, creditNoteReference: string, amount: number }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { payableId: string, creditNoteReference: string, amount: number }, metadata: EventMetadata = {}) {
    super(crypto.randomUUID(), 'CreditNoteApplied', aggregateId, 'AccountsPayable', aggregateVersion, new Date(), payload, metadata);
  }
}

export class PayableClosed extends DomainEvent<{ payableId: string }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { payableId: string }, metadata: EventMetadata = {}) {
    super(crypto.randomUUID(), 'PayableClosed', aggregateId, 'AccountsPayable', aggregateVersion, new Date(), payload, metadata);
  }
}

export class PayableWrittenOff extends DomainEvent<{ payableId: string, amount: number, approverId: string }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { payableId: string, amount: number, approverId: string }, metadata: EventMetadata = {}) {
    super(crypto.randomUUID(), 'PayableWrittenOff', aggregateId, 'AccountsPayable', aggregateVersion, new Date(), payload, metadata);
  }
}

export class PayableReopened extends DomainEvent<{ payableId: string, reason: string }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { payableId: string, reason: string }, metadata: EventMetadata = {}) {
    super(crypto.randomUUID(), 'PayableReopened', aggregateId, 'AccountsPayable', aggregateVersion, new Date(), payload, metadata);
  }
}
