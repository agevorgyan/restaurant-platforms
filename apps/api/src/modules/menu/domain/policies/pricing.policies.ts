import { PricingRequest } from '../value-objects/pricing-request.value-object';

export class PricingIntegrationPolicy {
  public static validateRequest(request: PricingRequest): void {
    if (!request.branchReference) throw new Error('Branch reference is required for pricing integration');
  }
}

export class PricingFallbackPolicy {
  public static getFallbackCurrency(): string {
    return 'USD';
  }
}

export class CurrencyPolicy {
  public static isSupported(currencyCode: string): boolean {
    return currencyCode.length === 3;
  }
}

export class DisplayedPricePolicy {
  public static format(amount: number, currencyCode: string): string {
    return `${amount.toFixed(2)} ${currencyCode}`;
  }
}

export class PricingValidationPolicy {
  public static ensureEffectivePeriod(from: Date, until?: Date): void {
    if (until && from > until) {
      throw new Error('Effective from date cannot be after effective until date');
    }
  }
}