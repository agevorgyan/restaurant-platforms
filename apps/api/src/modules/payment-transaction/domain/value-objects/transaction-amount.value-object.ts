export class TransactionAmount {
  constructor(
    public readonly value: number, // minor units
    public readonly currency: string
  ) {
    if (value <= 0) {
      throw new Error('Transaction amount must be greater than zero');
    }
    if (!Number.isInteger(value)) {
      throw new Error('Transaction amount must be an integer (minor units)');
    }
  }

  public isSameCurrency(other: TransactionAmount): boolean {
    return this.currency === other.currency;
  }
}
