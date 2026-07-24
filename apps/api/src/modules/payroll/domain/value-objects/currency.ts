import { DomainPrimitive } from '@saas/domain';

export class Currency extends DomainPrimitive<string> {
  private constructor(value: string) { super(value); }
  
  public static create(value: string): Currency {
    if (!/^[A-Z]{3}$/.test(value)) {
      throw new Error('Currency must be a valid 3-letter ISO code.');
    }
    return new Currency(value);
  }
}
