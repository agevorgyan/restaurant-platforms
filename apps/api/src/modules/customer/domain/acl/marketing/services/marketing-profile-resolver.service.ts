import { CustomerReference } from '../../../value-objects/customer-reference.value-object';
import { MarketingProfileReference } from '../value-objects/marketing-profile-reference.value-object';

export class MarketingProfileResolver {
  public resolveByCustomer(customerRef: CustomerReference): MarketingProfileReference {
    return MarketingProfileReference.create(`mkt-${customerRef.customerId}`);
  }
}