import { IntegrationEvent } from './marketing-event-factory';
import { DomainEvent } from '@saas/core';

export class MarketingEventMapper {
  /**
   * Maps a generic IntegrationEvent into a serialized object suitable for cross-context transport
   * maintaining absolute immutability.
   */
  public static mapToTransport<T extends DomainEvent>(integrationEvent: IntegrationEvent<T>): Record<string, any> {
    return {
      eventId: integrationEvent.metadata.eventId.value,
      eventName: integrationEvent.payload.constructor.name,
      version: integrationEvent.metadata.version.value,
      source: integrationEvent.metadata.source.value,
      priority: integrationEvent.metadata.priority.value,
      timestamp: integrationEvent.metadata.timestamp.toISOString(),
      correlationId: integrationEvent.metadata.correlationId?.value || null,
      causationId: integrationEvent.metadata.causationId?.value || null,
      payload: this.serializePayload(integrationEvent.payload)
    };
  }

  private static serializePayload(payload: any): Record<string, any> {
    // Basic structural clone to ensure immutability during mapping
    return JSON.parse(JSON.stringify(payload));
  }
}
