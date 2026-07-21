import { PaymentIntegrationContext } from '../value-objects/payment-integration-context.value-object';

export interface PaymentIntegrationEvent<T = any> {
  eventName: string;
  context: PaymentIntegrationContext;
  payload: T;
}

export class PaymentEventFactory {
  public create<T>(
    eventName: string,
    context: PaymentIntegrationContext,
    payload: T
  ): PaymentIntegrationEvent<T> {
    return {
      eventName,
      context,
      payload
    };
  }
}
