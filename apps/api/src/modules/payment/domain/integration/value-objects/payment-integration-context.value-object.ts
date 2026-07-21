import { ValueObject } from '@saas/core';
import { PaymentCorrelationId } from './payment-correlation-id.value-object';
import { PaymentCausationId } from './payment-causation-id.value-object';
import { PaymentEventVersion } from './payment-event-version.value-object';
import { PaymentEventPriority } from './payment-event-priority.value-object';

export interface PaymentIntegrationContextProps {
  correlationId: PaymentCorrelationId;
  causationId: PaymentCausationId;
  version: PaymentEventVersion;
  priority: PaymentEventPriority;
  timestamp: Date;
}

export class PaymentIntegrationContext extends ValueObject<PaymentIntegrationContextProps> {
  private constructor(props: PaymentIntegrationContextProps) {
    super(props);
  }

  public static create(
    correlationId: PaymentCorrelationId,
    causationId: PaymentCausationId,
    version: PaymentEventVersion,
    priority: PaymentEventPriority,
    timestamp: Date = new Date()
  ): PaymentIntegrationContext {
    return new PaymentIntegrationContext({
      correlationId,
      causationId,
      version,
      priority,
      timestamp
    });
  }

  get correlationId(): PaymentCorrelationId {
    return this.props.correlationId;
  }

  get causationId(): PaymentCausationId {
    return this.props.causationId;
  }

  get version(): PaymentEventVersion {
    return this.props.version;
  }

  get priority(): PaymentEventPriority {
    return this.props.priority;
  }

  get timestamp(): Date {
    return this.props.timestamp;
  }
}
