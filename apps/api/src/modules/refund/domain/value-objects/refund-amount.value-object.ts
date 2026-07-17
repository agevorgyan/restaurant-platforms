export class RefundAmount {
  constructor(
    public readonly value: number, // minor units
    public readonly currency: string
  ) {
    if (value <= 0) {
      throw new Error('Refund amount must be greater than zero');
    }
    if (!Number.isInteger(value)) {
      throw new Error('Refund amount must be an integer (minor units)');
    }
  }

  public isSameCurrency(other: string): boolean {
    return this.currency === other;
  }
}
