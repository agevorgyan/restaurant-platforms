import { ExternalCustomerReference } from '../value-objects/external-customer-reference.value-object';
import { CustomerReference } from '../../../value-objects/customer-reference.value-object';

export class CustomerReferenceResolver {
  public resolve(externalRef: ExternalCustomerReference): CustomerReference {
    // Simulated DB/Cache lookup mapping external ID to internal aggregate ID
    return CustomerReference.create(`internal-${externalRef.externalId}`);
  }
}