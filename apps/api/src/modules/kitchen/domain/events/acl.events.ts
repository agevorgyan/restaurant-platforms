import { DomainEvent } from '@saas/core';
import { KitchenIntegrationContext } from '../value-objects/acl/kitchen-integration-context.value-object';

export class KitchenIntegrationStartedEvent implements DomainEvent {
  public readonly dateTimeOccurred: Date;

  constructor(public readonly context: KitchenIntegrationContext) {
    this.dateTimeOccurred = new Date();
  }

  public getAggregateId(): string {
    return this.context.correlationId.value;
  }
}

export class KitchenIntegrationCompletedEvent implements DomainEvent {
  public readonly dateTimeOccurred: Date;

  constructor(
    public readonly context: KitchenIntegrationContext,
    public readonly resultPayload?: any
  ) {
    this.dateTimeOccurred = new Date();
  }

  public getAggregateId(): string {
    return this.context.correlationId.value;
  }
}

export class KitchenIntegrationFailedEvent implements DomainEvent {
  public readonly dateTimeOccurred: Date;

  constructor(
    public readonly context: KitchenIntegrationContext,
    public readonly reason: string,
    public readonly errorDetails?: any
  ) {
    this.dateTimeOccurred = new Date();
  }

  public getAggregateId(): string {
    return this.context.correlationId.value;
  }
}
