import { ValueObject } from '@saas/core';
import { InventoryCorrelationId } from './inventory-correlation-id.value-object';
import { InventoryCausationId } from './inventory-causation-id.value-object';
import { InventoryEventPriority } from './inventory-event-priority.value-object';
import { InventoryEventVersion } from './inventory-event-version.value-object';

export interface InventoryIntegrationContextProps {
  correlationId: InventoryCorrelationId;
  causationId: InventoryCausationId;
  priority: InventoryEventPriority;
  version: InventoryEventVersion;
  source: string;
  timestamp: Date;
}

export class InventoryIntegrationContext extends ValueObject<InventoryIntegrationContextProps> {
  get correlationId(): InventoryCorrelationId {
    return this.props.correlationId;
  }

  get causationId(): InventoryCausationId {
    return this.props.causationId;
  }

  get priority(): InventoryEventPriority {
    return this.props.priority;
  }

  get version(): InventoryEventVersion {
    return this.props.version;
  }

  get source(): string {
    return this.props.source;
  }

  get timestamp(): Date {
    return this.props.timestamp;
  }

  private constructor(props: InventoryIntegrationContextProps) {
    super(props);
  }

  public static create(props: {
    correlationId?: string;
    causationId?: string;
    priority?: string;
    version?: string;
    source: string;
    timestamp?: Date;
  }): InventoryIntegrationContext {
    if (!props.source || props.source.trim() === '') {
      throw new Error('Integration source must be defined');
    }

    return new InventoryIntegrationContext({
      correlationId: InventoryCorrelationId.create(props.correlationId),
      causationId: InventoryCausationId.create(props.causationId),
      priority: InventoryEventPriority.create(props.priority as any),
      version: props.version ? InventoryEventVersion.fromString(props.version) : InventoryEventVersion.create(1, 0),
      source: props.source,
      timestamp: props.timestamp || new Date(),
    });
  }
}
