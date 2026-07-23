import { DomainEvent } from '@saas/core';

export interface EventPublisher {
  publish(event: DomainEvent): void;
  publishAll(events: DomainEvent[]): void;
}
