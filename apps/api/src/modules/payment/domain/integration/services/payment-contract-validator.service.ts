import { PaymentIntegrationEvent } from './payment-event-factory.service';
import { IntegrationContractSpecification } from '../specifications/integration-contract.specification';
import { IntegrationMetadataSpecification } from '../specifications/integration-metadata.specification';
import { IntegrationCompatibilitySpecification } from '../specifications/integration-compatibility.specification';

export class PaymentContractValidator {
  private readonly contractSpec = new IntegrationContractSpecification();
  private readonly metadataSpec = new IntegrationMetadataSpecification();
  private readonly compatibilitySpec = new IntegrationCompatibilitySpecification();

  public validate<T>(event: PaymentIntegrationEvent<T>): void {
    if (!this.metadataSpec.isSatisfiedBy(event.context)) {
      throw new Error(`Invalid integration metadata for event: ${event.eventName}`);
    }

    if (!this.contractSpec.isSatisfiedBy(event.payload)) {
      throw new Error(`Invalid integration contract payload for event: ${event.eventName}`);
    }

    if (!this.compatibilitySpec.isSatisfiedBy(event.context.version)) {
      throw new Error(`Unsupported integration contract version: ${event.context.version.toString()}`);
    }
  }
}
