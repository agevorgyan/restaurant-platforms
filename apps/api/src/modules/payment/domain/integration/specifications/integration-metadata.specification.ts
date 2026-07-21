import { PaymentIntegrationContext } from '../value-objects/payment-integration-context.value-object';

export class IntegrationMetadataSpecification {
  public isSatisfiedBy(context: PaymentIntegrationContext): boolean {
    if (!context) return false;
    if (!context.correlationId || !context.correlationId.value) return false;
    if (!context.causationId || !context.causationId.value) return false;
    if (!context.version) return false;
    if (!context.priority) return false;
    if (!context.timestamp || !(context.timestamp instanceof Date)) return false;

    return true;
  }
}
