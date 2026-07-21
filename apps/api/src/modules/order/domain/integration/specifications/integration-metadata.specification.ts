import { OrderIntegrationContext } from '../value-objects/order-integration-context.value-object';

export class IntegrationMetadataSpecification {
  public isSatisfiedBy(context: OrderIntegrationContext): boolean {
    if (!context) {
      return false;
    }
    
    if (!context.eventId) {
      return false;
    }

    if (!context.correlationId || !context.correlationId.value) {
      return false;
    }

    if (!context.version) {
      return false;
    }

    return true;
  }
}
