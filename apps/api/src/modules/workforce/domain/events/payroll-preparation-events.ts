import { DomainEvent } from '@saas/events';
import { EventMetadata } from '@saas/events/src/metadata';

export class PayrollPreparationCreated extends DomainEvent<{ preparationId: string, startDate: Date, endDate: Date }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { preparationId: string, startDate: Date, endDate: Date }, metadata: EventMetadata = {}) {
    super(crypto.randomUUID(), 'PayrollPreparationCreated', aggregateId, 'PayrollPreparation', aggregateVersion, new Date(), payload, metadata);
  }
}

export class PayrollDataCollected extends DomainEvent<{ preparationId: string, summaryCount: number }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { preparationId: string, summaryCount: number }, metadata: EventMetadata = {}) {
    super(crypto.randomUUID(), 'PayrollDataCollected', aggregateId, 'PayrollPreparation', aggregateVersion, new Date(), payload, metadata);
  }
}

export class PayrollPreparationValidated extends DomainEvent<{ preparationId: string, isCompliant: boolean }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { preparationId: string, isCompliant: boolean }, metadata: EventMetadata = {}) {
    super(crypto.randomUUID(), 'PayrollPreparationValidated', aggregateId, 'PayrollPreparation', aggregateVersion, new Date(), payload, metadata);
  }
}

export class PayrollPreparationFinalized extends DomainEvent<{ preparationId: string, finalizedAt: Date, finalizedBy: string }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { preparationId: string, finalizedAt: Date, finalizedBy: string }, metadata: EventMetadata = {}) {
    super(crypto.randomUUID(), 'PayrollPreparationFinalized', aggregateId, 'PayrollPreparation', aggregateVersion, new Date(), payload, metadata);
  }
}

export class PayrollPreparationReopened extends DomainEvent<{ preparationId: string, reopenedAt: Date, reopenedBy: string, reason: string }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { preparationId: string, reopenedAt: Date, reopenedBy: string, reason: string }, metadata: EventMetadata = {}) {
    super(crypto.randomUUID(), 'PayrollPreparationReopened', aggregateId, 'PayrollPreparation', aggregateVersion, new Date(), payload, metadata);
  }
}

export class PayrollPreparationExported extends DomainEvent<{ preparationId: string, exportFormat: string, destinationSystem: string, exportedAt: Date }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { preparationId: string, exportFormat: string, destinationSystem: string, exportedAt: Date }, metadata: EventMetadata = {}) {
    super(crypto.randomUUID(), 'PayrollPreparationExported', aggregateId, 'PayrollPreparation', aggregateVersion, new Date(), payload, metadata);
  }
}
