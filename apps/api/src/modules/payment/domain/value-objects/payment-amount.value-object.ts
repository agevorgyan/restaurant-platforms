export class PaymentAmount {
  constructor(
    public readonly value: number, // minor units
    public readonly currency: string
  ) {
    if (value <= 0) {
      throw new Error('Payment amount must be greater than zero');
    }
    if (!Number.isInteger(value)) {
      throw new Error('Payment amount must be an integer (minor units)');
    }
  }

  public matchesCurrency(currency: string): boolean {
    return this.currency === currency;
  }
}
