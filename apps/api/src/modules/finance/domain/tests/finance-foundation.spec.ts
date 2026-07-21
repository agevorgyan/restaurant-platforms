import { Currency } from '../value-objects/currency.value-object';
import { CurrencyCode } from '../value-objects/currency-code.enum';
import { Money } from '../value-objects/money.value-object';
import { Percentage } from '../value-objects/percentage.value-object';
import { ExchangeRate } from '../value-objects/exchange-rate.value-object';
import { PriceBreakdown } from '../value-objects/price-breakdown.value-object';
import { RoundingPolicy } from '../value-objects/rounding-policy.enum';

describe('Financial Foundation', () => {
  let usd: Currency;
  let eur: Currency;
  let jpy: Currency;

  beforeEach(() => {
    usd = Currency.create(CurrencyCode.USD, 2);
    eur = Currency.create(CurrencyCode.EUR, 2);
    // Pretend JPY has 0 precision for testing exchange rates with different precision
    // We'll use AMD since JPY is not in CurrencyCode enum
    jpy = Currency.create(CurrencyCode.AMD, 0); 
  });

  describe('Currency', () => {
    it('should create valid currency', () => {
      expect(usd.code).toBe(CurrencyCode.USD);
      expect(usd.precision.value).toBe(2);
    });

    it('should throw on invalid precision', () => {
      expect(() => Currency.create(CurrencyCode.USD, -1)).toThrow('Monetary precision cannot be negative');
      expect(() => Currency.create(CurrencyCode.USD, 1.5)).toThrow('Monetary precision must be an integer');
    });

    it('should correctly compare equality', () => {
      const usd2 = Currency.create(CurrencyCode.USD, 2);
      expect(usd.equals(usd2)).toBe(true);
      expect(usd.equals(eur)).toBe(false);
    });
  });

  describe('Money', () => {
    it('should perform arithmetic correctly', () => {
      const m1 = Money.create(100, usd); // $1.00
      const m2 = Money.create(50, usd);  // $0.50

      expect(m1.add(m2).amount.value).toBe(150);
      expect(m1.subtract(m2).amount.value).toBe(50);
    });

    it('should strictly throw on currency mismatch', () => {
      const m1 = Money.create(100, usd);
      const m2 = Money.create(50, eur);

      expect(() => m1.add(m2)).toThrow('Currency mismatch: USD vs EUR');
      expect(() => m1.subtract(m2)).toThrow('Currency mismatch: USD vs EUR');
      expect(() => m1.compareTo(m2)).toThrow('Currency mismatch: USD vs EUR');
    });

    it('should allocate ratios properly preserving every cent', () => {
      const m1 = Money.create(100, usd); // $1.00
      
      // 100 split 3 ways: 33, 33, 34
      const allocated = m1.allocate([1, 1, 1]);
      expect(allocated[0].amount.value).toBe(34); // remainder given to first items
      expect(allocated[1].amount.value).toBe(33);
      expect(allocated[2].amount.value).toBe(33);
    });

    it('should compute percentages with rounding', () => {
      const m1 = Money.create(105, usd); // $1.05
      const pct = Percentage.create(15); // 15%

      // 105 * 0.15 = 15.75 -> Banker's rounding (HALF_EVEN) of 15.75 is 16
      const result = m1.percentage(pct, RoundingPolicy.HALF_EVEN);
      expect(result.amount.value).toBe(16);
    });
  });

  describe('Percentage', () => {
    it('should validate correctly', () => {
      const pct = Percentage.create(15);
      expect(pct.value).toBe(0.15);
      
      expect(() => Percentage.create(-10)).toThrow('Percentage cannot be negative');
      expect(() => Percentage.create(150)).toThrow('Percentage cannot exceed 100 unless explicitly allowed');
      
      const pctOver = Percentage.create(150, true);
      expect(pctOver.value).toBe(1.5);
    });
  });

  describe('ExchangeRate', () => {
    it('should convert correctly accounting for precision differences', () => {
      // 1 USD = 400 AMD
      const rate = ExchangeRate.create(usd, jpy, 400); 
      const m1 = Money.create(100, usd); // $1.00 (minor units 100)

      // Expected: 1 USD * 400 = 400 AMD. 
      // Precision difference: AMD (0) - USD (2) = -2
      // target minor units = 100 * 400 * 10^-2 = 40000 * 0.01 = 400 minor units
      const result = rate.convert(m1);
      
      expect(result.currency.code).toBe(CurrencyCode.AMD);
      expect(result.amount.value).toBe(400);
    });

    it('should generate inverse rate', () => {
      const rate = ExchangeRate.create(usd, eur, 0.9);
      const inverse = rate.inverse();

      expect(inverse.sourceCurrency.code).toBe(CurrencyCode.EUR);
      expect(inverse.targetCurrency.code).toBe(CurrencyCode.USD);
      expect(inverse.rate).toBeCloseTo(1 / 0.9, 5);
    });
  });

  describe('PriceBreakdown', () => {
    it('should successfully create if math aligns', () => {
      const base = Money.create(100, usd);
      const disc = Money.create(10, usd);
      const tax = Money.create(5, usd);
      const fee = Money.create(2, usd);
      const final = Money.create(97, usd); // 100 - 10 + 5 + 2 = 97

      const breakdown = PriceBreakdown.create({
        baseAmount: base,
        discounts: disc,
        taxes: tax,
        fees: fee,
        finalTotal: final
      });

      expect(breakdown).toBeDefined();
    });

    it('should throw if currencies differ', () => {
      expect(() => PriceBreakdown.create({
        baseAmount: Money.create(100, usd),
        discounts: Money.create(10, eur),
        taxes: Money.create(5, usd),
        fees: Money.create(2, usd),
        finalTotal: Money.create(97, usd)
      })).toThrow('All components of a PriceBreakdown must use the same currency');
    });

    it('should throw if final math does not add up', () => {
      expect(() => PriceBreakdown.create({
        baseAmount: Money.create(100, usd),
        discounts: Money.create(10, usd),
        taxes: Money.create(5, usd),
        fees: Money.create(2, usd),
        finalTotal: Money.create(100, usd) // WRONG, should be 97
      })).toThrow('PriceBreakdown components do not compute to the final total');
    });
  });
});
