import { DomainEvent } from '@saas/events';
import { EventMetadata } from '@saas/events/src/metadata';

export class PayrollCreated extends DomainEvent<{ payrollId: string, periodStartDate: Date, periodEndDate: Date }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { payrollId: string, periodStartDate: Date, periodEndDate: Date }, metadata: EventMetadata = {}) {
    super(crypto.randomUUID(), 'PayrollCreated', aggregateId, 'PayrollRun', aggregateVersion, new Date(), payload, metadata);
  }
}

export class PayrollCalculated extends DomainEvent<{ payrollId: string, totalGross: number, totalNet: number }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { payrollId: string, totalGross: number, totalNet: number }, metadata: EventMetadata = {}) {
    super(crypto.randomUUID(), 'PayrollCalculated', aggregateId, 'PayrollRun', aggregateVersion, new Date(), payload, metadata);
  }
}

export class PayrollApproved extends DomainEvent<{ payrollId: string, approvedBy: string }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { payrollId: string, approvedBy: string }, metadata: EventMetadata = {}) {
    super(crypto.randomUUID(), 'PayrollApproved', aggregateId, 'PayrollRun', aggregateVersion, new Date(), payload, metadata);
  }
}

export class PayrollFinalized extends DomainEvent<{ payrollId: string, finalizedBy: string }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { payrollId: string, finalizedBy: string }, metadata: EventMetadata = {}) {
    super(crypto.randomUUID(), 'PayrollFinalized', aggregateId, 'PayrollRun', aggregateVersion, new Date(), payload, metadata);
  }
}

export class PayrollExported extends DomainEvent<{ payrollId: string, exportFormat: string, destination: string }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { payrollId: string, exportFormat: string, destination: string }, metadata: EventMetadata = {}) {
    super(crypto.randomUUID(), 'PayrollExported', aggregateId, 'PayrollRun', aggregateVersion, new Date(), payload, metadata);
  }
}

export class BonusAdded extends DomainEvent<{ payrollId: string, bonusId: string, amount: number }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { payrollId: string, bonusId: string, amount: number }, metadata: EventMetadata = {}) {
    super(crypto.randomUUID(), 'BonusAdded', aggregateId, 'PayrollRun', aggregateVersion, new Date(), payload, metadata);
  }
}

export class DeductionAdded extends DomainEvent<{ payrollId: string, deductionId: string, amount: number }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { payrollId: string, deductionId: string, amount: number }, metadata: EventMetadata = {}) {
    super(crypto.randomUUID(), 'DeductionAdded', aggregateId, 'PayrollRun', aggregateVersion, new Date(), payload, metadata);
  }
}

export class TaxCalculated extends DomainEvent<{ payrollId: string, totalTaxAmount: number }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { payrollId: string, totalTaxAmount: number }, metadata: EventMetadata = {}) {
    super(crypto.randomUUID(), 'TaxCalculated', aggregateId, 'PayrollRun', aggregateVersion, new Date(), payload, metadata);
  }
}
