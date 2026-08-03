import { DomainEvent } from '@saas/events';
import { EventMetadata, createEventMetadata } from '@saas/events';

export class CompensationPackageCreated extends DomainEvent<{ packageId: string, employeeReference: string }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { packageId: string, employeeReference: string }, metadata: EventMetadata = createEventMetadata()) {
    super(crypto.randomUUID(), 'CompensationPackageCreated', aggregateId, 'CompensationPackage', aggregateVersion, new Date(), payload, metadata);
  }
}

export class CompensationActivated extends DomainEvent<{ packageId: string }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { packageId: string }, metadata: EventMetadata = createEventMetadata()) {
    super(crypto.randomUUID(), 'CompensationActivated', aggregateId, 'CompensationPackage', aggregateVersion, new Date(), payload, metadata);
  }
}

export class CompensationDeactivated extends DomainEvent<{ packageId: string }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { packageId: string }, metadata: EventMetadata = createEventMetadata()) {
    super(crypto.randomUUID(), 'CompensationDeactivated', aggregateId, 'CompensationPackage', aggregateVersion, new Date(), payload, metadata);
  }
}

export class SalaryChanged extends DomainEvent<{ packageId: string, oldAmount: number, newAmount: number }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { packageId: string, oldAmount: number, newAmount: number }, metadata: EventMetadata = createEventMetadata()) {
    super(crypto.randomUUID(), 'SalaryChanged', aggregateId, 'CompensationPackage', aggregateVersion, new Date(), payload, metadata);
  }
}

export class AllowanceAdded extends DomainEvent<{ packageId: string, allowanceId: string }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { packageId: string, allowanceId: string }, metadata: EventMetadata = createEventMetadata()) {
    super(crypto.randomUUID(), 'AllowanceAdded', aggregateId, 'CompensationPackage', aggregateVersion, new Date(), payload, metadata);
  }
}

export class AllowanceRemoved extends DomainEvent<{ packageId: string, allowanceId: string }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { packageId: string, allowanceId: string }, metadata: EventMetadata = createEventMetadata()) {
    super(crypto.randomUUID(), 'AllowanceRemoved', aggregateId, 'CompensationPackage', aggregateVersion, new Date(), payload, metadata);
  }
}

export class BonusPolicyChanged extends DomainEvent<{ packageId: string, policyType: string }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { packageId: string, policyType: string }, metadata: EventMetadata = createEventMetadata()) {
    super(crypto.randomUUID(), 'BonusPolicyChanged', aggregateId, 'CompensationPackage', aggregateVersion, new Date(), payload, metadata);
  }
}

export class HourlyRateChanged extends DomainEvent<{ packageId: string, newRate: number }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { packageId: string, newRate: number }, metadata: EventMetadata = createEventMetadata()) {
    super(crypto.randomUUID(), 'HourlyRateChanged', aggregateId, 'CompensationPackage', aggregateVersion, new Date(), payload, metadata);
  }
}

export class CompensationArchived extends DomainEvent<{ packageId: string }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { packageId: string }, metadata: EventMetadata = createEventMetadata()) {
    super(crypto.randomUUID(), 'CompensationArchived', aggregateId, 'CompensationPackage', aggregateVersion, new Date(), payload, metadata);
  }
}
