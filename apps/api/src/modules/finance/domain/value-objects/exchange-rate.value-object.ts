import { ValueObject } from '@saas/core';
import { Currency } from './currency.value-object';
import { Money } from './money.value-object';
import { RoundingPolicy } from './rounding-policy.enum';

export interface ExchangeRateProps {
  sourceCurrency: Currency;
  targetCurrency: Currency;
  rate: number;
  effectiveDate?: Date;
}

export class ExchangeRate extends ValueObject<ExchangeRateProps> {
  private constructor(props: ExchangeRateProps) {
    super(props);
  }

  public static create(
    sourceCurrency: Currency,
    targetCurrency: Currency,
    rate: number,
    effectiveDate?: Date
  ): ExchangeRate {
    if (sourceCurrency.equals(targetCurrency)) {
      throw new Error('Source and target currencies must differ');
    }
    if (!Number.isFinite(rate) || Number.isNaN(rate) || rate <= 0) {
      throw new Error('Exchange rate must be a positive finite number');
    }

    return new ExchangeRate({
      sourceCurrency,
      targetCurrency,
      rate,
      effectiveDate,
    });
  }

  get sourceCurrency(): Currency {
    return this.props.sourceCurrency;
  }

  get targetCurrency(): Currency {
    return this.props.targetCurrency;
  }

  get rate(): number {
    return this.props.rate;
  }

  get effectiveDate(): Date | undefined {
    return this.props.effectiveDate;
  }

  public inverse(): ExchangeRate {
    return ExchangeRate.create(
      this.targetCurrency,
      this.sourceCurrency,
      1 / this.rate,
      this.effectiveDate
    );
  }

  public convert(money: Money, roundingPolicy: RoundingPolicy = RoundingPolicy.HALF_EVEN): Money {
    if (!money.currency.equals(this.sourceCurrency)) {
      throw new Error(`Cannot convert money. Expected currency ${this.sourceCurrency.code}, got ${money.currency.code}`);
    }
    
    // The rate is how much target currency you get per 1 source currency.
    // e.g. 1 USD (source) = 0.9 EUR (target). rate = 0.9.
    // Wait, the minor unit conversion: 
    // USD amount (cents) * rate -> EUR amount (cents)? 
    // This is only true if precision is identical.
    // E.g. USD is 2 decimals, EUR is 2 decimals. 
    // 100 cents (1 USD) * 0.9 = 90 cents (0.9 EUR). Correct.
    // What if precision differs? E.g. source has 2 (USD), target has 0 (JPY).
    // 1 USD = 150 JPY. rate = 150.
    // 100 cents (1 USD). If we just multiply by 150, we get 15000 minor units.
    // But JPY has 0 precision, so 15000 minor units is 15000 JPY. But 1 USD = 150 JPY! 
    // We need to account for precision differences.
    // Target Amount = (Source minor units / 10^Source Precision) * Rate * 10^Target Precision
    // Target minor units = Source minor units * Rate * 10^(Target Precision - Source Precision)

    const precisionDifference = this.targetCurrency.precision.value - this.sourceCurrency.precision.value;
    const factor = Math.pow(10, precisionDifference);
    
    const convertedMinorUnits = money.amount.value * this.rate * factor;

    // We must pass the raw calculated number to Money's factory or let it round.
    // Actually, Money itself doesn't have a constructor that rounds a raw number, we'll build that logic.
    // Let's rely on Money to handle the rounding of a raw multiplier.
    // Or we can round it here.
    return Money.createFromRaw(convertedMinorUnits, this.targetCurrency, roundingPolicy);
  }
}
