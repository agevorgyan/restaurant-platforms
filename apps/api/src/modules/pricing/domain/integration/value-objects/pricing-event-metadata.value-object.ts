import { ValueObject } from '@saas/core';
import { PricingEventId } from './pricing-event-id.value-object';
import { PricingCorrelationId } from './pricing-correlation-id.value-object';
import { PricingCausationId } from './pricing-causation-id.value-object';
import { PricingEventSource } from './pricing-event-source.value-object';
import { PricingEventVersion } from './pricing-event-version.value-object';
import { PricingEventPriority } from './pricing-event-priority.value-object';

export interface PricingEventMetadataProps {
  eventId: PricingEventId;
  correlationId: PricingCorrelationId;
  causationId?: PricingCausationId;
  source: PricingEventSource;
  version: PricingEventVersion;
  priority: PricingEventPriority;
  timestamp: Date;
}

export class PricingEventMetadata extends ValueObject<PricingEventMetadataProps> {
  private constructor(props: PricingEventMetadataProps) {
    super(props);
  }

  public static create(props: PricingEventMetadataProps): PricingEventMetadata {
    if (!props.eventId || !props.correlationId || !props.source) {
      throw new Error('Event Metadata is missing required fields');
    }
    return new PricingEventMetadata(props);
  }

  get eventId(): PricingEventId { return this.props.eventId; }
  get correlationId(): PricingCorrelationId { return this.props.correlationId; }
  get causationId(): PricingCausationId | undefined { return this.props.causationId; }
  get source(): PricingEventSource { return this.props.source; }
  get version(): PricingEventVersion { return this.props.version; }
  get priority(): PricingEventPriority { return this.props.priority; }
  get timestamp(): Date { return this.props.timestamp; }
}
