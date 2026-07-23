import { CustomerEligibility } from '../value-objects/customer-eligibility.value-object';

export class CustomerEligibilityResolver {
  public resolve(externalData: any): CustomerEligibility {
    // Resolves external customer data into local CustomerEligibility value object
    if (externalData?.isSuspended) {
      return CustomerEligibility.create(false, 'Customer is suspended');
    }
    return CustomerEligibility.create(true);
  }
}