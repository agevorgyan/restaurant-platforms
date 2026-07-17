export class Money {
  constructor(
    public readonly amount: number, // minor units (e.g., cents)
    public readonly currency: string
  ) {
    if (!Number.isInteger(amount)) {
      throw new Error('Money amount must be an integer (minor units)');
    }
  }

  public add(other: Money): Money {
    this.assertSameCurrency(other);
    return new Money(this.amount + other.amount, this.currency);
  }

  public subtract(other: Money): Money {
    this.assertSameCurrency(other);
    return new Money(this.amount - other.amount, this.currency);
  }

  public multiply(multiplier: number): Money {
    return new Money(Math.round(this.amount * multiplier), this.currency);
  }

  public percentage(percent: number): Money {
    if (percent < 0) {
      throw new Error('Percentage cannot be negative');
    }
    return new Money(Math.round(this.amount * (percent / 100)), this.currency);
  }

  public isNegative(): boolean {
    return this.amount < 0;
  }

  public isZero(): boolean {
    return this.amount === 0;
  }

  public greaterThan(other: Money): boolean {
    this.assertSameCurrency(other);
    return this.amount > other.amount;
  }

  public lessThan(other: Money): boolean {
    this.assertSameCurrency(other);
    return this.amount < other.amount;
  }

  private assertSameCurrency(other: Money): void {
    if (this.currency !== other.currency) {
      throw new Error(`Currency mismatch: ${this.currency} vs ${other.currency}`);
    }
  }

  public static zero(currency: string): Money {
    return new Money(0, currency);
  }
}
