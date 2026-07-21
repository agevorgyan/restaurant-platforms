import { ValueObject } from '@saas/core';

export interface CheckoutReferenceProps {
  orderQuotationId: string;
  pricingSnapshotId: string;
}

export class CheckoutReference extends ValueObject<CheckoutReferenceProps> {
  private constructor(props: CheckoutReferenceProps) {
    super(props);
  }

  public static create(props: CheckoutReferenceProps): CheckoutReference {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    
    if (!uuidRegex.test(props.orderQuotationId)) {
      throw new Error('CheckoutReference must have a valid orderQuotationId UUID');
    }
    
    if (!uuidRegex.test(props.pricingSnapshotId)) {
      throw new Error('CheckoutReference must have a valid pricingSnapshotId UUID');
    }

    return new CheckoutReference(props);
  }

  get orderQuotationId(): string {
    return this.props.orderQuotationId;
  }

  get pricingSnapshotId(): string {
    return this.props.pricingSnapshotId;
  }
}
