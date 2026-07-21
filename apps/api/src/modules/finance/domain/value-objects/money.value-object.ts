import { ValueObject } from '@saas/core';
import { Currency } from './currency.value-object';
import { MonetaryAmount } from './monetary-amount.value-object';
import { Percentage } from './percentage.value-object';
import { RoundingPolicy } from './rounding-policy.enum';

export interface MoneyProps {
  amount: MonetaryAmount;
  currency: Currency;
}

export class Money extends ValueObject<MoneyProps> {
  private constructor(props: MoneyProps) {
    super(props);
  }

  public static create(minorUnits: number, currency: Currency): Money {
    return new Money({
      amount: MonetaryAmount.create(minorUnits),
      currency,
    });
  }

  /**
   * Creates Money by taking a potentially fractional raw value and applying a rounding policy.
   * Useful when converting currencies or applying percentage calculations.
   */
  public static createFromRaw(rawValue: number, currency: Currency, policy: RoundingPolicy): Money {
    let finalValue: number;

    switch (policy) {
      case RoundingPolicy.HALF_UP:
        finalValue = Math.round(rawValue);
        break;
      case RoundingPolicy.HALF_DOWN:
        finalValue = rawValue > 0 ? Math.ceil(rawValue - 0.5) : Math.floor(rawValue + 0.5);
        break;
      case RoundingPolicy.HALF_EVEN: {
        // Banker's rounding
        const floored = Math.floor(rawValue);
        const fraction = rawValue - floored;
        if (fraction < 0.5) {
          finalValue = floored;
        } else if (fraction > 0.5) {
          finalValue = floored + 1;
        } else {
          finalValue = floored % 2 === 0 ? floored : floored + 1;
        }
        break;
      }
      case RoundingPolicy.FLOOR:
        finalValue = Math.floor(rawValue);
        break;
      case RoundingPolicy.CEILING:
        finalValue = Math.ceil(rawValue);
        break;
      default:
        throw new Error('Unsupported rounding policy');
    }

    // Safety check - handles JS negative zero issue
    if (Object.is(finalValue, -0)) {
      finalValue = 0;
    }

    return Money.create(finalValue, currency);
  }

  public static zero(currency: Currency): Money {
    return Money.create(0, currency);
  }

  get amount(): MonetaryAmount {
    return this.props.amount;
  }

  get currency(): Currency {
    return this.props.currency;
  }

  private assertSameCurrency(other: Money): void {
    if (!this.currency.equals(other.currency)) {
      throw new Error(`Currency mismatch: ${this.currency.code} vs ${other.currency.code}`);
    }
  }

  public add(other: Money): Money {
    this.assertSameCurrency(other);
    return Money.create(this.amount.value + other.amount.value, this.currency);
  }

  public subtract(other: Money): Money {
    this.assertSameCurrency(other);
    return Money.create(this.amount.value - other.amount.value, this.currency);
  }

  public multiply(multiplier: number, policy: RoundingPolicy = RoundingPolicy.HALF_EVEN): Money {
    return Money.createFromRaw(this.amount.value * multiplier, this.currency, policy);
  }

  public divide(divisor: number, policy: RoundingPolicy = RoundingPolicy.HALF_EVEN): Money {
    if (divisor === 0) {
      throw new Error('Cannot divide by zero');
    }
    return Money.createFromRaw(this.amount.value / divisor, this.currency, policy);
  }

  public percentage(pct: Percentage, policy: RoundingPolicy = RoundingPolicy.HALF_EVEN): Money {
    return Money.createFromRaw(this.amount.value * pct.value, this.currency, policy);
  }

  public negate(): Money {
    return Money.create(-this.amount.value, this.currency);
  }

  public absolute(): Money {
    return Money.create(Math.abs(this.amount.value), this.currency);
  }

  public isZero(): boolean {
    return this.amount.value === 0;
  }

  public isPositive(): boolean {
    return this.amount.value > 0;
  }

  public isNegative(): boolean {
    return this.amount.value < 0;
  }

  public compareTo(other: Money): number {
    this.assertSameCurrency(other);
    if (this.amount.value < other.amount.value) return -1;
    if (this.amount.value > other.amount.value) return 1;
    return 0;
  }

  public min(other: Money): Money {
    return this.compareTo(other) <= 0 ? this : other;
  }

  public max(other: Money): Money {
    return this.compareTo(other) >= 0 ? this : other;
  }

  public equals(other: Money): boolean {
    if (other === null || other === undefined) return false;
    return this.currency.equals(other.currency) && this.amount.value === other.amount.value;
  }

  /**
   * Allocates the money according to a list of ratios, preserving every cent.
   * Uses Fowler's Allocation algorithm.
   */
  public allocate(ratios: number[]): Money[] {
    if (ratios.length === 0) {
      throw new Error('Allocation requires at least one ratio');
    }
    
    let total = 0;
    for (const r of ratios) {
      if (r < 0) throw new Error('Ratios cannot be negative');
      total += r;
    }

    if (total === 0) {
      throw new Error('Sum of ratios must be greater than zero');
    }

    let remainder = this.amount.value;
    const results = new Array<number>(ratios.length);

    for (let i = 0; i < results.length; i++) {
      results[i] = Math.floor((this.amount.value * ratios[i]) / total);
      remainder -= results[i];
    }

    for (let i = 0; i < remainder; i++) {
      results[i]++;
    }

    return results.map(v => Money.create(v, this.currency));
  }
}
