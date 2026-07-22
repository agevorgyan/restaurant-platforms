import { InventoryIntegrationEventPayload } from './inventory-integration-event';
import { IntegrationContractSpecification } from '../specifications/integration-contract.specification';
import { CorrelationSpecification } from '../specifications/correlation.specification';

export class InventoryContractValidator {
  public static validate(payload: any): InventoryIntegrationEventPayload {
    if (!IntegrationContractSpecification.isSatisfiedBy(payload)) {
      throw new Error('Payload does not satisfy the base integration contract schema');
    }

    if (!CorrelationSpecification.isSatisfiedBy(payload)) {
      throw new Error('Payload is missing strictly required correlation identifiers');
    }

    // We can confidently return it as the payload type now
    return payload as InventoryIntegrationEventPayload;
  }
}
