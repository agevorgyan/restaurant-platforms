/**
 * Enterprise Data Transformation Platform - Domain Events
 */

import { randomUUID } from 'crypto';
import { BaseDomainEvent } from './connector.events';
import { TransformationType } from '../enums/transformation.enums';

export class TransformationCreatedEvent implements BaseDomainEvent {
  public readonly eventId: string = randomUUID();
  public readonly eventName: string = 'TransformationCreated';

  constructor(
    public readonly aggregateId: string,
    public readonly tenantId: string,
    public readonly name: string,
    public readonly type: TransformationType,
    public readonly version: string,
    public readonly timestamp: Date = new Date()
  ) {}
}

export class TransformationValidatedEvent implements BaseDomainEvent {
  public readonly eventId: string = randomUUID();
  public readonly eventName: string = 'TransformationValidated';

  constructor(
    public readonly aggregateId: string,
    public readonly tenantId: string,
    public readonly isValid: boolean,
    public readonly ruleCount: number,
    public readonly timestamp: Date = new Date()
  ) {}
}

export class TransformationPublishedEvent implements BaseDomainEvent {
  public readonly eventId: string = randomUUID();
  public readonly eventName: string = 'TransformationPublished';

  constructor(
    public readonly aggregateId: string,
    public readonly tenantId: string,
    public readonly version: string,
    public readonly timestamp: Date = new Date()
  ) {}
}

export class PayloadMappedEvent implements BaseDomainEvent {
  public readonly eventId: string = randomUUID();
  public readonly eventName: string = 'PayloadMapped';

  constructor(
    public readonly aggregateId: string,
    public readonly tenantId: string,
    public readonly fieldsCount: number,
    public readonly durationMs: number,
    public readonly timestamp: Date = new Date()
  ) {}
}

export class SchemaValidatedEvent implements BaseDomainEvent {
  public readonly eventId: string = randomUUID();
  public readonly eventName: string = 'SchemaValidated';

  constructor(
    public readonly aggregateId: string,
    public readonly tenantId: string,
    public readonly schemaName: string,
    public readonly isValid: boolean,
    public readonly timestamp: Date = new Date()
  ) {}
}

export class TransformationFailedEvent implements BaseDomainEvent {
  public readonly eventId: string = randomUUID();
  public readonly eventName: string = 'TransformationFailed';

  constructor(
    public readonly aggregateId: string,
    public readonly tenantId: string,
    public readonly errorDetails: string,
    public readonly timestamp: Date = new Date()
  ) {}
}

export class MappingVersionPublishedEvent implements BaseDomainEvent {
  public readonly eventId: string = randomUUID();
  public readonly eventName: string = 'MappingVersionPublished';

  constructor(
    public readonly aggregateId: string,
    public readonly tenantId: string,
    public readonly newVersion: string,
    public readonly previousVersion: string,
    public readonly timestamp: Date = new Date()
  ) {}
}

export type TransformationDomainEvent =
  | TransformationCreatedEvent
  | TransformationValidatedEvent
  | TransformationPublishedEvent
  | PayloadMappedEvent
  | SchemaValidatedEvent
  | TransformationFailedEvent
  | MappingVersionPublishedEvent;
