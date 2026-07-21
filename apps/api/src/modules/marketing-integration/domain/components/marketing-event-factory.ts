import { DomainEvent } from '@saas/core';
import { MarketingEventMetadata } from './marketing-event-metadata';
import { MarketingEventRegistry } from './marketing-event-registry';
import { EventSource, EventSourceEnum } from '../value-objects/event-source.value-object';
import { EventPriority, EventPriorityEnum } from '../value-objects/event-priority.value-object';
import { randomUUID } from 'crypto';

export interface IntegrationEvent<T extends DomainEvent> {
  metadata: MarketingEventMetadata;
  payload: T;
}

export class MarketingEventFactory {
  public static createIntegrationEvent<T extends DomainEvent>(
    domainEvent: T,
    source: EventSourceEnum,
    priority: EventPriorityEnum = EventPriorityEnum.NORMAL,
    correlationId?: string,
    causationId?: string,
    version: number = 1
  ): IntegrationEvent<T> {
    const eventName = domainEvent.constructor.name;
    
    if (!MarketingEventRegistry.isRegistered(eventName, version)) {
      throw new Error(`DomainEvent ${eventName} v${version} is not registered in the Marketing Event Registry`);
    }

    const metadata = MarketingEventMetadata.create(
      randomUUID(),
      version,
      EventSource.create(source),
      EventPriority.create(priority),
      correlationId,
      causationId
    );

    return {
      metadata,
      payload: domainEvent
    };
  }
}
