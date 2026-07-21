import { OrderQuotation } from './order-quotation.aggregate';
import { OrderQuotationId } from '../value-objects/order-quotation-id.value-object';
import { QuotationNumber } from '../value-objects/quotation-number.value-object';
import { QuotationMetadata } from '../entities/quotation-metadata.entity';
import { QuotationSource, QuotationSourceEnum } from '../value-objects/quotation-source.value-object';
import { QuotationStatusEnum } from '../value-objects/quotation-status.value-object';
import { QuotationLineItem } from '../entities/quotation-line-item.entity';
import { Money } from '../../../finance/domain/value-objects/money.value-object';
import { CurrencyCode } from '../../../finance/domain/value-objects/currency-code.enum';
import { Currency } from '../../../finance/domain/value-objects/currency.value-object';
import { PricingSnapshot } from '../value-objects/pricing-snapshot.value-object';
import { PricingResult } from '../value-objects/pricing-result.value-object';
import { CalculationTrace } from '../value-objects/calculation-trace.value-object';
import { QuotationExpiration } from '../value-objects/quotation-expiration.value-object';

describe('OrderQuotation Aggregate', () => {
  let id: OrderQuotationId;
  let number: QuotationNumber;
  let metadata: QuotationMetadata;
  let quotation: OrderQuotation;
  let usd: Currency;

  beforeEach(() => {
    usd = Currency.create(CurrencyCode.USD, 2);
    id = OrderQuotationId.create('qtn-1');
    number = QuotationNumber.create('QTN-2026-TEST123');
    metadata = QuotationMetadata.create('meta-1', {
      source: QuotationSource.create(QuotationSourceEnum.WEB),
      restaurantId: 'rest-1',
      orderChannel: 'WEB',
      deliveryMethod: 'DELIVERY'
    });
    quotation = OrderQuotation.create(id, number, metadata);
  });

  describe('Initialization', () => {
    it('should initialize in DRAFT status', () => {
      expect(quotation.status.value).toBe(QuotationStatusEnum.DRAFT);
      expect(quotation.version.value).toBe(1);
    });
  });

  describe('Line Items', () => {
    it('should add line items in DRAFT state', () => {
      const item = QuotationLineItem.create('item-1', {
        productId: 'prod-1',
        quantity: 1,
        basePrice: Money.create(1000, usd),
        totalBasePrice: Money.create(1000, usd)
      });
      quotation.addLineItem(item);
      expect(quotation.lineItems.length).toBe(1);
    });

    it('should reject duplicate line items', () => {
      const item = QuotationLineItem.create('item-1', {
        productId: 'prod-1',
        quantity: 1,
        basePrice: Money.create(1000, usd),
        totalBasePrice: Money.create(1000, usd)
      });
      quotation.addLineItem(item);
      expect(() => quotation.addLineItem(item)).toThrow('Duplicate line items are not allowed');
    });
  });

  describe('State Transitions', () => {
    let mockSnapshot: PricingSnapshot;
    let mockResult: PricingResult;
    let mockTrace: CalculationTrace;

    beforeEach(() => {
      const item = QuotationLineItem.create('item-1', {
        productId: 'prod-1',
        quantity: 1,
        basePrice: Money.create(1000, usd),
        totalBasePrice: Money.create(1000, usd)
      });
      quotation.addLineItem(item);

      mockSnapshot = PricingSnapshot.create({ total: 1000 }, 1);
      mockResult = PricingResult.create({
        baseTotal: Money.create(1000, usd),
        ruleAdjustmentsTotal: Money.create(0, usd),
        marketingDiscountsTotal: Money.create(0, usd),
        taxTotal: Money.create(100, usd),
        chargeTotal: Money.create(0, usd),
        grandTotal: Money.create(1100, usd)
      });
      mockTrace = CalculationTrace.initial().complete();
    });

    it('should calculate and transition to CALCULATED', () => {
      quotation.attachPricingSnapshot(mockSnapshot, mockResult, mockTrace);
      expect(quotation.status.value).toBe(QuotationStatusEnum.CALCULATED);
      expect(quotation.pricingSnapshot).toBeDefined();
      expect(quotation.pricingFingerprint).toBeDefined();
    });

    it('should publish and transition to PUBLISHED', () => {
      quotation.attachPricingSnapshot(mockSnapshot, mockResult, mockTrace);
      const expiration = QuotationExpiration.create(15);
      quotation.publish(expiration);
      expect(quotation.status.value).toBe(QuotationStatusEnum.PUBLISHED);
      expect(quotation.expiration).toBeDefined();
    });

    it('should accept a published quotation', () => {
      quotation.attachPricingSnapshot(mockSnapshot, mockResult, mockTrace);
      quotation.publish(QuotationExpiration.create(15));
      quotation.accept();
      expect(quotation.status.value).toBe(QuotationStatusEnum.ACCEPTED);
    });

    it('should supersede a draft quotation', () => {
      const newQtnId = OrderQuotationId.create('qtn-2');
      quotation.supersede(newQtnId);
      expect(quotation.status.value).toBe(QuotationStatusEnum.SUPERSEDED);
    });
  });
});
