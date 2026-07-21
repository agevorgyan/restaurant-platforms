import { ValueObject } from '@saas/core';
import { CurrencyCode } from './currency-code.enum';
import { MonetaryPrecision } from './monetary-precision.value-object';

export interface CurrencyProps {
  code: CurrencyCode;
  precision: MonetaryPrecision;
}

export class Currency extends ValueObject<CurrencyProps> {
  private constructor(props: CurrencyProps) {
    super(props);
  }

  public static create(code: CurrencyCode, precision: number): Currency {
    if (!Object.values(CurrencyCode).includes(code)) {
      throw new Error(`Invalid currency code: ${code}`);
    }
    return new Currency({
      code,
      precision: MonetaryPrecision.create(precision),
    });
  }

  get code(): CurrencyCode {
    return this.props.code;
  }

  get precision(): MonetaryPrecision {
    return this.props.precision;
  }

  public equals(other: Currency): boolean {
    if (other === null || other === undefined) {
      return false;
    }
    return this.code === other.code;
  }
}
