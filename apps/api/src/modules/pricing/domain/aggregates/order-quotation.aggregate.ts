import { AggregateRoot } from '@saas/core';
import { OrderQuotationId } from '../value-objects/order-quotation-id.value-object';
import { QuotationNumber } from '../value-objects/quotation-number.value-object';
import { QuotationStatus, QuotationStatusEnum } from '../value-objects/quotation-status.value-object';
import { QuotationVersion } from '../value-objects/quotation-version.value-object';
import { QuotationExpiration } from '../value-objects/quotation-expiration.value-object';
import { PricingFingerprint } from '../value-objects/pricing-fingerprint.value-object';
import { QuotationMetadata } from '../entities/quotation-metadata.entity';
import { QuotationLineItem } from '../entities/quotation-line-item.entity';
import { QuotationAdjustment } from '../entities/quotation-adjustment.entity';
import { QuotationTax } from '../entities/quotation-tax.entity';
import { QuotationCharge } from '../entities/quotation-charge.entity';
import { QuotationDiscount } from '../entities/quotation-discount.entity';
import { PricingSnapshot } from '../value-objects/pricing-snapshot.value-object';
import { PricingResult } from '../value-objects/pricing-result.value-object';
import { CalculationTrace } from '../value-objects/calculation-trace.value-object';
import {
  OrderQuotationCreated,
  OrderQuotationCalculated,
  OrderQuotationPublished,
  OrderQuotationAccepted,
  OrderQuotationRejected,
  OrderQuotationExpired,
  OrderQuotationSuperseded
} from '../events/order-quotation-events';
import { QuotationConsistencySpecification } from '../specifications/quotation-consistency.specification';

export interface OrderQuotationProps {
  id: OrderQuotationId;
  quotationNumber: QuotationNumber;
  status: QuotationStatus;
  version: QuotationVersion;
  metadata: QuotationMetadata;
  pricingSnapshot?: PricingSnapshot;
  pricingFingerprint?: PricingFingerprint;
  expiration?: QuotationExpiration;
  lineItems: QuotationLineItem[];
  adjustments: QuotationAdjustment[];
  taxes: QuotationTax[];
  charges: QuotationCharge[];
  discounts: QuotationDiscount[];
  totals?: PricingResult;
  calculationTrace?: CalculationTrace;
}

export class OrderQuotation extends AggregateRoot<OrderQuotationProps> {
  private constructor(props: OrderQuotationProps) {
    super(props.id.value, props);
  }

  public static create(
    id: OrderQuotationId,
    quotationNumber: QuotationNumber,
    metadata: QuotationMetadata
  ): OrderQuotation {
    const quotation = new OrderQuotation({
      id,
      quotationNumber,
      metadata,
      status: QuotationStatus.initial(),
      version: QuotationVersion.initial(),
      lineItems: [],
      adjustments: [],
      taxes: [],
      charges: [],
      discounts: []
    });

    quotation.addDomainEvent(new OrderQuotationCreated(id, quotationNumber));
    return quotation;
  }

  get quotationId(): OrderQuotationId { return this.props.id; }
  get quotationNumber(): QuotationNumber { return this.props.quotationNumber; }
  get status(): QuotationStatus { return this.props.status; }
  get version(): QuotationVersion { return this.props.version; }
  get metadata(): QuotationMetadata { return this.props.metadata; }
  get pricingSnapshot(): PricingSnapshot | undefined { return this.props.pricingSnapshot; }
  get pricingFingerprint(): PricingFingerprint | undefined { return this.props.pricingFingerprint; }
  get expiration(): QuotationExpiration | undefined { return this.props.expiration; }
  get lineItems(): QuotationLineItem[] { return [...this.props.lineItems]; }
  get totals(): PricingResult | undefined { return this.props.totals; }

  public addLineItem(item: QuotationLineItem): void {
    if (this.props.status.value !== QuotationStatusEnum.DRAFT) {
      throw new Error('Cannot add line items to a non-draft quotation');
    }
    if (this.props.lineItems.some(i => i.id === item.id)) {
      throw new Error('Duplicate line items are not allowed');
    }
    this.props.lineItems.push(item);
  }

  public attachPricingSnapshot(
    snapshot: PricingSnapshot,
    totals: PricingResult,
    trace: CalculationTrace
  ): void {
    if (this.props.status.value !== QuotationStatusEnum.DRAFT) {
      throw new Error('Can only attach pricing to a draft quotation');
    }

    this.props.pricingSnapshot = snapshot;
    this.props.pricingFingerprint = PricingFingerprint.create(snapshot.hash);
    this.props.totals = totals;
    this.props.calculationTrace = trace;
    
    // In a real flow, you'd map the PricingSession entities (AppliedTax, AppliedCharge) 
    // to Quotation entities here. We are bypassing the mapping step for brevity.

    this.props.status = QuotationStatus.create(QuotationStatusEnum.CALCULATED);
    
    const consistencySpec = new QuotationConsistencySpecification();
    if (!consistencySpec.isSatisfiedBy(this)) {
      throw new Error('Quotation fails consistency specification after calculation');
    }

    this.addDomainEvent(new OrderQuotationCalculated(this.props.id));
  }

  public publish(expiration: QuotationExpiration): void {
    if (this.props.status.value !== QuotationStatusEnum.CALCULATED) {
      throw new Error('Only calculated quotations can be published');
    }

    if (!this.props.pricingSnapshot || !this.props.pricingFingerprint) {
      throw new Error('Quotation is missing required data for publication');
    }

    this.props.expiration = expiration;
    this.props.status = QuotationStatus.create(QuotationStatusEnum.PUBLISHED);
    
    this.addDomainEvent(new OrderQuotationPublished(this.props.id));
  }

  public accept(): void {
    if (this.props.status.value !== QuotationStatusEnum.PUBLISHED) {
      throw new Error('Only published quotations can be accepted');
    }
    
    if (this.props.expiration && this.props.expiration.isExpired(new Date())) {
      throw new Error('Cannot accept an expired quotation');
    }

    this.props.status = QuotationStatus.create(QuotationStatusEnum.ACCEPTED);
    this.addDomainEvent(new OrderQuotationAccepted(this.props.id));
  }

  public reject(): void {
    if (this.props.status.value !== QuotationStatusEnum.PUBLISHED) {
      throw new Error('Only published quotations can be rejected');
    }

    this.props.status = QuotationStatus.create(QuotationStatusEnum.REJECTED);
    this.addDomainEvent(new OrderQuotationRejected(this.props.id));
  }

  public expire(): void {
    if (this.props.status.value !== QuotationStatusEnum.PUBLISHED) {
      throw new Error('Only published quotations can expire');
    }

    this.props.status = QuotationStatus.create(QuotationStatusEnum.EXPIRED);
    this.addDomainEvent(new OrderQuotationExpired(this.props.id));
  }

  public supersede(newQuotationId: OrderQuotationId): void {
    if (
      this.props.status.value === QuotationStatusEnum.ACCEPTED ||
      this.props.status.value === QuotationStatusEnum.REJECTED
    ) {
      throw new Error('Cannot supersede an accepted or rejected quotation');
    }

    this.props.status = QuotationStatus.create(QuotationStatusEnum.SUPERSEDED);
    this.addDomainEvent(new OrderQuotationSuperseded(this.props.id, newQuotationId));
  }
}
