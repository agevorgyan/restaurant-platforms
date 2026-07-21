import { PricingSession } from './pricing-session.aggregate';
import { PricingSessionId } from '../value-objects/pricing-session-id.value-object';
import { PricingContext } from '../value-objects/pricing-context.value-object';
import { PricingLineItem } from '../entities/pricing-line-item.entity';
import { Money } from '../../../finance/domain/value-objects/money.value-object';
import { CurrencyCode } from '../../../finance/domain/value-objects/currency-code.enum';
import { Currency } from '../../../finance/domain/value-objects/currency.value-object';

describe('PricingSession Aggregate', () => {
  let sessionId: PricingSessionId;
  let context: PricingContext;
  let session: PricingSession;
  let usd: Currency;

  beforeEach(() => {
    usd = Currency.create(CurrencyCode.USD, 2);
    sessionId = PricingSessionId.create('session-1');
    context = PricingContext.create({
      restaurantId: 'rest-1',
      currencyCode: CurrencyCode.USD,
      orderChannel: 'WEB',
      deliveryMethod: 'DELIVERY',
      calculationDate: new Date()
    });
    session = PricingSession.create(sessionId, context);
  });

  describe('Invariants', () => {
    it('should be created in uncalculated state with version 1', () => {
      expect(session.isClosed).toBe(false);
      expect(session.version.value).toBe(1);
      expect(session.result).toBeUndefined();
    });

    it('should allow adding line items', () => {
      const lineItem = PricingLineItem.create('item-1', {
        productId: 'prod-1',
        quantity: 2,
        basePrice: Money.create(1000, usd),
        totalBasePrice: Money.create(2000, usd)
      });
      session.addLineItem(lineItem);
      expect(session.lineItems.length).toBe(1);
    });

    it('should prevent duplicate line items', () => {
      const lineItem = PricingLineItem.create('item-1', {
        productId: 'prod-1',
        quantity: 2,
        basePrice: Money.create(1000, usd),
        totalBasePrice: Money.create(2000, usd)
      });
      session.addLineItem(lineItem);
      expect(() => session.addLineItem(lineItem)).toThrow('Duplicate line items are not allowed');
    });
  });

  describe('Recalculation', () => {
    it('should increment version and clear previous state on recalculate', () => {
      session.recalculate();
      expect(session.version.value).toBe(2);
      expect(session.result).toBeUndefined();
      expect(session.snapshot).toBeUndefined();
    });
  });
});
