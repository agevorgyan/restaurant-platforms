export interface InventoryIntegrationEventPayload<T = any> {
  metadata: {
    eventId: string;
    correlationId: string;
    causationId?: string;
    timestamp: string;
    version: string;
    priority: string;
    source: string;
    eventName: string;
  };
  data: T;
}
