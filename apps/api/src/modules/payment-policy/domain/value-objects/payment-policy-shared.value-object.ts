export class PaymentTimeoutPolicy {
  constructor(
    public readonly durationSeconds: number
  ) {
    if (durationSeconds <= 0) {
      throw new Error('Timeout duration must be greater than zero');
    }
  }
}

export class PaymentRetryPolicy {
  constructor(
    public readonly maxAttempts: number
  ) {
    if (maxAttempts < 0) {
      throw new Error('Retry attempts must be zero or greater');
    }
  }
}

export class CurrencyPolicy {
  constructor(
    public readonly supportedCurrencies: string[]
  ) {
    if (!supportedCurrencies || supportedCurrencies.length === 0) {
      throw new Error('At least one supported currency is required');
    }
  }
}

export type PolicyStatusEnum = 'Draft' | 'Active' | 'Inactive';

export class PolicyStatus {
  constructor(public readonly value: PolicyStatusEnum) {
    const valid = ['Draft', 'Active', 'Inactive'];
    if (!valid.includes(value)) {
      throw new Error(`Invalid Policy Status: ${value}`);
    }
  }

  public canBeApplied(): boolean {
    return this.value === 'Active';
  }
}
