import { IntegrationCompatibilitySpecification } from '../specifications/integration-compatibility.specification';
import { OrderEventVersion } from '../value-objects/order-event-version.value-object';

export type CompatibilityResult = { isSuccess: true } | { isFailure: true; error: string };

export class IntegrationCompatibilityPolicy {
  private readonly compatibilitySpec = new IntegrationCompatibilitySpecification();

  public evaluate(producerVersion: OrderEventVersion, supportedVersion: OrderEventVersion): CompatibilityResult {
    if (!this.compatibilitySpec.isSatisfiedBy(producerVersion, supportedVersion)) {
      return { 
        isFailure: true, 
        error: `Incompatible integration contract versions: Producer ${producerVersion.toString()}, Consumer ${supportedVersion.toString()}` 
      };
    }
    return { isSuccess: true };
  }
}
