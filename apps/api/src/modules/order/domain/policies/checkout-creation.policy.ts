import { CheckoutConsistencySpecification } from '../specifications/checkout-consistency.specification';
import { CheckoutQuotationSpecification } from '../specifications/checkout-quotation.specification';
import { CheckoutSessionProps } from '../aggregates/checkout-session.aggregate';

export type PolicyResult = { isSuccess: true } | { isFailure: true; error: string };

export class CheckoutCreationPolicy {
  private readonly consistencySpec = new CheckoutConsistencySpecification();
  private readonly quotationSpec = new CheckoutQuotationSpecification();

  public canCreate(props: Omit<CheckoutSessionProps, 'status' | 'token' | 'version' | 'expiration'>): PolicyResult {
    // For creation, we mock a partial check
    if (!props.reference.orderQuotationId) {
      return { isFailure: true, error: 'Checkout creation requires a valid quotation reference' };
    }

    if (!props.reference.pricingSnapshotId) {
      return { isFailure: true, error: 'Checkout creation requires a valid pricing snapshot reference' };
    }

    return { isSuccess: true };
  }
}
