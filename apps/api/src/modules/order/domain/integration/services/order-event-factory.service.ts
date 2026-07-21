import { OrderIntegrationContext } from '../value-objects/order-integration-context.value-object';

export interface IntegrationEvent<T = any> {
  eventName: string;
  context: OrderIntegrationContext;
  payload: T;
}

export class OrderEventFactory {
  public create<T>(eventName: string, context: OrderIntegrationContext, payload: T): IntegrationEvent<T> {
    return {
      eventName,
      context,
      payload
    };
  }
}
