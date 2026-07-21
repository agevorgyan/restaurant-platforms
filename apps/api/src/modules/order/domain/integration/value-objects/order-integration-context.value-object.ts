import { ValueObject } from '@saas/core';
import { OrderCorrelationId } from './order-correlation-id.value-object';
import { OrderCausationId } from './order-causation-id.value-object';
import { OrderEventVersion } from './order-event-version.value-object';
import { OrderEventPriority } from './order-event-priority.value-object';

export interface OrderIntegrationContextProps {
  eventId: string;
  correlationId: OrderCorrelationId;
  causationId?: OrderCausationId;
  timestamp: Date;
  version: OrderEventVersion;
  priority: OrderEventPriority;
}

export class OrderIntegrationContext extends ValueObject<OrderIntegrationContextProps> {
  private constructor(props: OrderIntegrationContextProps) {
    super(props);
  }

  public static create(
    props: Omit<OrderIntegrationContextProps, 'eventId' | 'timestamp'> & { eventId?: string, timestamp?: Date }
  ): OrderIntegrationContext {
    const eventId = props.eventId || crypto.randomUUID();
    
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(eventId)) {
      throw new Error('OrderIntegrationContext eventId must be a valid UUID');
    }

    return new OrderIntegrationContext({
      ...props,
      eventId,
      timestamp: props.timestamp || new Date()
    });
  }

  get eventId(): string { return this.props.eventId; }
  get correlationId(): OrderCorrelationId { return this.props.correlationId; }
  get causationId(): OrderCausationId | undefined { return this.props.causationId; }
  get timestamp(): Date { return this.props.timestamp; }
  get version(): OrderEventVersion { return this.props.version; }
  get priority(): OrderEventPriority { return this.props.priority; }
}
