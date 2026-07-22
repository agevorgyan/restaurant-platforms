import { ValueObject } from '@saas/core';
import { KitchenCorrelationId } from './kitchen-correlation-id.value-object';
import { KitchenCausationId } from './kitchen-causation-id.value-object';
import { KitchenEventVersion } from './kitchen-event-version.value-object';
import { KitchenEventPriority } from './kitchen-event-priority.value-object';

export interface KitchenIntegrationContextProps {
  correlationId: KitchenCorrelationId;
  causationId?: KitchenCausationId;
  version: KitchenEventVersion;
  priority: KitchenEventPriority;
  eventName: string;
  payload: any;
  timestamp: Date;
}

export class KitchenIntegrationContext extends ValueObject<KitchenIntegrationContextProps> {
  get correlationId(): KitchenCorrelationId {
    return this.props.correlationId;
  }

  get causationId(): KitchenCausationId | undefined {
    return this.props.causationId;
  }

  get version(): KitchenEventVersion {
    return this.props.version;
  }

  get priority(): KitchenEventPriority {
    return this.props.priority;
  }

  get eventName(): string {
    return this.props.eventName;
  }

  get payload(): any {
    return this.props.payload;
  }

  get timestamp(): Date {
    return this.props.timestamp;
  }

  private constructor(props: KitchenIntegrationContextProps) {
    super(props);
  }

  public static create(
    correlationId: KitchenCorrelationId,
    version: KitchenEventVersion,
    eventName: string,
    payload: any,
    priority: KitchenEventPriority = KitchenEventPriority.default(),
    causationId?: KitchenCausationId
  ): KitchenIntegrationContext {
    if (!eventName || eventName.trim() === '') {
      throw new Error('Event name must be specified');
    }
    if (payload === undefined || payload === null) {
      throw new Error('Payload cannot be null or undefined');
    }

    return new KitchenIntegrationContext({
      correlationId,
      causationId,
      version,
      priority,
      eventName: eventName.trim(),
      payload,
      timestamp: new Date()
    });
  }
}
