import { PaymentEventVersion } from '../value-objects/payment-event-version.value-object';

export class IntegrationCompatibilitySpecification {
  private readonly SUPPORTED_MAJOR_VERSIONS = [1];

  public isSatisfiedBy(version: PaymentEventVersion): boolean {
    return this.SUPPORTED_MAJOR_VERSIONS.includes(version.major);
  }
}
