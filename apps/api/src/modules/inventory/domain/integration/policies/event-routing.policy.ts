import { InventoryIntegrationEventPayload } from '../components/inventory-integration-event';
import { InventoryEventPriority, InventoryEventPriorityLevel } from '../value-objects/inventory-event-priority.value-object';

export class EventRoutingPolicy {
  /**
   * Evaluates if an event requires immediate synchronous processing or can be backgrounded
   * based on its priority level.
   */
  public static requiresImmediateProcessing(event: InventoryIntegrationEventPayload): boolean {
    const priority = InventoryEventPriority.create(event.metadata.priority as any);
    
    // CRITICAL and HIGH priorities bypass standard async queues where applicable
    return (
      priority.level === InventoryEventPriorityLevel.CRITICAL ||
      priority.level === InventoryEventPriorityLevel.HIGH
    );
  }

  public static canBeDroppedIfOverloaded(event: InventoryIntegrationEventPayload): boolean {
    const priority = InventoryEventPriority.create(event.metadata.priority as any);
    
    // LOW priority events like some analytics or soft notifications can be dropped in critical overload
    return priority.level === InventoryEventPriorityLevel.LOW;
  }
}
