import { IntegrationContext } from '../value-objects/integration-context.value-object';
import { CustomerContractRegistry } from './customer-contract-registry.service';
import { ContractCompatibilityPolicy } from '../policies/core-acl.policies';

export class CustomerContractValidator {
  constructor(private readonly registry: CustomerContractRegistry) {}

  public validate(context: IntegrationContext): void {
    const isSupported = this.registry.isSupported(context.metadata.sourceContext);
    ContractCompatibilityPolicy.evaluate(isSupported);
  }
}