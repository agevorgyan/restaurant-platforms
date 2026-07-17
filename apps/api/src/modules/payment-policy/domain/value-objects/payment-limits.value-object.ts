export class PaymentLimits {
  constructor(
    public readonly minAmount: number, // minor units
    public readonly maxAmount: number  // minor units
  ) {
    if (minAmount <= 0) {
      throw new Error('Minimum payment amount must be greater than zero');
    }
    if (maxAmount < minAmount) {
      throw new Error('Maximum payment amount must be greater than or equal to the minimum amount');
    }
  }
}
