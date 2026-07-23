export interface PriceUpdatedContract {
  priceReference: string;
  amount: number;
  currency: string;
  effectiveDate: string;
}

export interface PriceActivatedContract {
  priceReference: string;
}

export interface PriceArchivedContract {
  priceReference: string;
}

export interface PriceListChangedContract {
  priceListId: string;
}

export interface CurrencyUpdatedContract {
  currencyCode: string;
  exchangeRate: number;
}

export interface PricingRequestedContract {
  correlationId: string;
  priceReference: string;
  branchReference: string;
}

export interface DisplayedPriceRequestedContract {
  priceReference: string;
  currency: string;
}

export interface PricingValidationRequestedContract {
  priceReference: string;
}