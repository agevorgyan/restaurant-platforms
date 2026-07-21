import { IntegrationMetadataSpecification } from '../specifications/integration-metadata.specification';
import { IntegrationContractSpecification } from '../specifications/integration-contract.specification';
import { OrderIntegrationContext } from '../value-objects/order-integration-context.value-object';

export type PolicyResult = { isSuccess: true } | { isFailure: true; error: string };

export class OrderIntegrationPolicy {
  private readonly metadataSpec = new IntegrationMetadataSpecification();
  private readonly contractSpec = new IntegrationContractSpecification();

  public validate(context: OrderIntegrationContext, payload: any, requiredFields: string[]): PolicyResult {
    if (!this.metadataSpec.isSatisfiedBy(context)) {
      return { isFailure: true, error: 'Integration context metadata is invalid or missing required identifiers' };
    }

    if (!this.contractSpec.isSatisfiedBy(payload, requiredFields)) {
      return { isFailure: true, error: `Payload missing required fields: ${requiredFields.join(', ')}` };
    }

    return { isSuccess: true };
  }
}
