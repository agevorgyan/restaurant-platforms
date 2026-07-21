import { ValueObject } from '@saas/core';
import { CurrencyCode } from '../../../finance/domain/value-objects/currency-code.enum';

export interface PricingContextProps {
  restaurantId: string;
  branchId?: string;
  customerId?: string;
  loyaltyTier?: string;
  currencyCode: CurrencyCode;
  orderChannel: string;
  deliveryMethod: string;
  calculationDate: Date;
}

export class PricingContext extends ValueObject<PricingContextProps> {
  private constructor(props: PricingContextProps) {
    super(props);
  }

  public static create(props: PricingContextProps): PricingContext {
    if (!props.restaurantId) {
      throw new Error('Restaurant ID is required in pricing context');
    }
    if (!props.currencyCode) {
      throw new Error('Currency Code is required in pricing context');
    }
    return new PricingContext(props);
  }

  get restaurantId(): string { return this.props.restaurantId; }
  get branchId(): string | undefined { return this.props.branchId; }
  get customerId(): string | undefined { return this.props.customerId; }
  get loyaltyTier(): string | undefined { return this.props.loyaltyTier; }
  get currencyCode(): CurrencyCode { return this.props.currencyCode; }
  get orderChannel(): string { return this.props.orderChannel; }
  get deliveryMethod(): string { return this.props.deliveryMethod; }
  get calculationDate(): Date { return this.props.calculationDate; }
}
