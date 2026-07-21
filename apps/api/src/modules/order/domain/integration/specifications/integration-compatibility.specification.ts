import { OrderEventVersion } from '../value-objects/order-event-version.value-object';

export class IntegrationCompatibilitySpecification {
  public isSatisfiedBy(producerVersion: OrderEventVersion, consumerSupportedVersion: OrderEventVersion): boolean {
    // A consumer must be able to support the producer's major version.
    return producerVersion.isCompatibleWith(consumerSupportedVersion);
  }
}
