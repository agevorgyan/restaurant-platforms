const fs = require('fs');
const path = require('path');

const domainDir = '/Users/apple/Downloads/Projects/Restaurant Platform/restaurant-platforms/apps/api/src/modules/menu/domain';

const filesToCreate = {
  // Value Objects
  'value-objects/pricing-evaluation-id.value-object.ts': `import { ValueObject } from '@saas/core';

export interface PricingEvaluationIdProps { value: string; }

export class PricingEvaluationId extends ValueObject<PricingEvaluationIdProps> {
  get value(): string { return this.props.value; }
  private constructor(props: PricingEvaluationIdProps) { super(props); }
  public static create(value?: string): PricingEvaluationId {
    return new PricingEvaluationId({ value: value || crypto.randomUUID() });
  }
}`,

  'value-objects/pricing-correlation-id.value-object.ts': `import { ValueObject } from '@saas/core';

export interface PricingCorrelationIdProps { value: string; }

export class PricingCorrelationId extends ValueObject<PricingCorrelationIdProps> {
  get value(): string { return this.props.value; }
  private constructor(props: PricingCorrelationIdProps) { super(props); }
  public static create(value?: string): PricingCorrelationId {
    return new PricingCorrelationId({ value: value || crypto.randomUUID() });
  }
}`,

  'value-objects/currency-reference.value-object.ts': `import { ValueObject } from '@saas/core';

export interface CurrencyReferenceProps { code: string; }

export class CurrencyReference extends ValueObject<CurrencyReferenceProps> {
  get code(): string { return this.props.code; }
  private constructor(props: CurrencyReferenceProps) { super(props); }
  public static create(code: string): CurrencyReference {
    if (!code) throw new Error('Currency code is required');
    return new CurrencyReference({ code: code.toUpperCase() });
  }
}`,

  'value-objects/effective-price.value-object.ts': `import { ValueObject } from '@saas/core';

export interface EffectivePriceProps { amount: number; }

export class EffectivePrice extends ValueObject<EffectivePriceProps> {
  get amount(): number { return this.props.amount; }
  private constructor(props: EffectivePriceProps) { super(props); }
  public static create(amount: number): EffectivePrice {
    if (amount < 0) throw new Error('Effective price cannot be negative');
    return new EffectivePrice({ amount });
  }
}`,

  'value-objects/displayed-price.value-object.ts': `import { ValueObject } from '@saas/core';

export interface DisplayedPriceProps { formattedValue: string; }

export class DisplayedPrice extends ValueObject<DisplayedPriceProps> {
  get formattedValue(): string { return this.props.formattedValue; }
  private constructor(props: DisplayedPriceProps) { super(props); }
  public static create(formattedValue: string): DisplayedPrice {
    if (!formattedValue) throw new Error('Displayed price cannot be empty');
    return new DisplayedPrice({ formattedValue });
  }
}`,

  'value-objects/pricing-context.value-object.ts': `import { ValueObject } from '@saas/core';

export interface PricingContextProps {
  channelId: string;
  branchId: string;
}

export class PricingContext extends ValueObject<PricingContextProps> {
  get channelId(): string { return this.props.channelId; }
  get branchId(): string { return this.props.branchId; }
  private constructor(props: PricingContextProps) { super(props); }
  public static create(props: PricingContextProps): PricingContext {
    return new PricingContext(props);
  }
}`,

  'value-objects/pricing-request.value-object.ts': `import { ValueObject } from '@saas/core';
import { PriceReference } from './price-reference.value-object';
import { CurrencyReference } from './currency-reference.value-object';
import { MenuItemReference } from './menu-item-reference.value-object';
import { ModifierGroupReference } from './modifier-group-reference.value-object';

export interface PricingRequestProps {
  menuItemRef?: MenuItemReference;
  modifierGroupRef?: ModifierGroupReference;
  priceRef: PriceReference;
  branchReference: string;
  salesChannel: string;
  currency: CurrencyReference;
  customerSegmentReference?: string;
  evaluationDateTime: Date;
}

export class PricingRequest extends ValueObject<PricingRequestProps> {
  get priceRef(): PriceReference { return this.props.priceRef; }
  get branchReference(): string { return this.props.branchReference; }
  get salesChannel(): string { return this.props.salesChannel; }
  get currency(): CurrencyReference { return this.props.currency; }
  get evaluationDateTime(): Date { return this.props.evaluationDateTime; }

  private constructor(props: PricingRequestProps) { super(props); }
  public static create(props: PricingRequestProps): PricingRequest {
    if (!props.priceRef) throw new Error('Price reference is required');
    return new PricingRequest(props);
  }
}`,

  'value-objects/pricing-response.value-object.ts': `import { ValueObject } from '@saas/core';
import { DisplayedPrice } from './displayed-price.value-object';
import { CurrencyReference } from './currency-reference.value-object';

export interface PricingResponseProps {
  displayedPrice: DisplayedPrice;
  currency: CurrencyReference;
  taxIncluded: boolean;
  priceStatus: string;
  effectiveFrom: Date;
  effectiveUntil?: Date;
}

export class PricingResponse extends ValueObject<PricingResponseProps> {
  get displayedPrice(): DisplayedPrice { return this.props.displayedPrice; }
  get currency(): CurrencyReference { return this.props.currency; }
  get taxIncluded(): boolean { return this.props.taxIncluded; }
  get priceStatus(): string { return this.props.priceStatus; }
  get effectiveFrom(): Date { return this.props.effectiveFrom; }

  private constructor(props: PricingResponseProps) { super(props); }
  public static create(props: PricingResponseProps): PricingResponse {
    return new PricingResponse(props);
  }
}`,

  // Specifications
  'specifications/pricing.specifications.ts': `import { PricingRequest } from '../value-objects/pricing-request.value-object';
import { PricingResponse } from '../value-objects/pricing-response.value-object';

export class PricingReferenceSpecification {
  public static isSatisfiedBy(request: PricingRequest): boolean {
    return !!request.priceRef;
  }
}

export class PricingAvailabilitySpecification {
  public static isSatisfiedBy(response: PricingResponse): boolean {
    return response.priceStatus === 'AVAILABLE';
  }
}

export class CurrencySpecification {
  public static isSatisfiedBy(request: PricingRequest): boolean {
    return !!request.currency && request.currency.code.length === 3;
  }
}

export class DisplayedPriceSpecification {
  public static isSatisfiedBy(response: PricingResponse): boolean {
    return !!response.displayedPrice && response.displayedPrice.formattedValue.length > 0;
  }
}

export class PricingContractSpecification {
  public static isSatisfiedBy(request: PricingRequest): boolean {
    return !!request.branchReference && !!request.salesChannel;
  }
}`,

  // Policies
  'policies/pricing.policies.ts': `import { PricingRequest } from '../value-objects/pricing-request.value-object';

export class PricingIntegrationPolicy {
  public static validateRequest(request: PricingRequest): void {
    if (!request.branchReference) throw new Error('Branch reference is required for pricing integration');
  }
}

export class PricingFallbackPolicy {
  public static getFallbackCurrency(): string {
    return 'USD';
  }
}

export class CurrencyPolicy {
  public static isSupported(currencyCode: string): boolean {
    return currencyCode.length === 3;
  }
}

export class DisplayedPricePolicy {
  public static format(amount: number, currencyCode: string): string {
    return \`\${amount.toFixed(2)} \${currencyCode}\`;
  }
}

export class PricingValidationPolicy {
  public static ensureEffectivePeriod(from: Date, until?: Date): void {
    if (until && from > until) {
      throw new Error('Effective from date cannot be after effective until date');
    }
  }
}`,

  // Contracts
  'contracts/pricing.contracts.ts': `export interface PriceUpdatedContract {
  priceReference: string;
  amount: number;
  currency: string;
  effectiveDate: string;
}

export interface PriceActivatedContract {
  priceReference: string;
}

export interface PriceArchivedContract {
  priceReference: string;
}

export interface PriceListChangedContract {
  priceListId: string;
}

export interface CurrencyUpdatedContract {
  currencyCode: string;
  exchangeRate: number;
}

export interface PricingRequestedContract {
  correlationId: string;
  priceReference: string;
  branchReference: string;
}

export interface DisplayedPriceRequestedContract {
  priceReference: string;
  currency: string;
}

export interface PricingValidationRequestedContract {
  priceReference: string;
}`,

  // Events
  'events/pricing.events.ts': `import { DomainEvent } from '@saas/core';

export class PricingRequestedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly correlationId: string, public readonly priceReference: string) {}
  getAggregateId(): string { return this.priceReference; }
}

export class PricingResolvedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly correlationId: string, public readonly displayedPrice: string) {}
  getAggregateId(): string { return this.correlationId; }
}

export class PricingUnavailableEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly correlationId: string, public readonly reason: string) {}
  getAggregateId(): string { return this.correlationId; }
}

export class PricingValidationFailedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly priceReference: string, public readonly reason: string) {}
  getAggregateId(): string { return this.priceReference; }
}

export class DisplayedPriceUpdatedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly priceReference: string, public readonly newDisplayedPrice: string) {}
  getAggregateId(): string { return this.priceReference; }
}`,

  // Services
  'services/pricing/price-reference.validator.ts': `import { PricingRequest } from '../../value-objects/pricing-request.value-object';
import { PricingReferenceSpecification } from '../../specifications/pricing.specifications';

export class PriceReferenceValidator {
  public static validate(request: PricingRequest): void {
    if (!PricingReferenceSpecification.isSatisfiedBy(request)) {
      throw new Error('Invalid PriceReference');
    }
  }
}`,

  'services/pricing/pricing-result.mapper.ts': `import { PricingResponse } from '../../value-objects/pricing-response.value-object';
import { DisplayedPrice } from '../../value-objects/displayed-price.value-object';
import { CurrencyReference } from '../../value-objects/currency-reference.value-object';

export class PricingResultMapper {
  public static mapToResponse(rawResult: any): PricingResponse {
    // Maps a raw external DTO to the Menu PricingResponse Domain Value Object
    return PricingResponse.create({
      displayedPrice: DisplayedPrice.create(rawResult.formattedAmount || '0.00'),
      currency: CurrencyReference.create(rawResult.currency || 'USD'),
      taxIncluded: !!rawResult.taxIncluded,
      priceStatus: rawResult.status || 'AVAILABLE',
      effectiveFrom: new Date(rawResult.effectiveFrom || Date.now())
    });
  }
}`,

  'services/pricing/menu-pricing-policy.engine.ts': `import { PricingRequest } from '../../value-objects/pricing-request.value-object';
import { PricingIntegrationPolicy, CurrencyPolicy } from '../../policies/pricing.policies';
import { PricingContractSpecification } from '../../specifications/pricing.specifications';

export class MenuPricingPolicyEngine {
  public static validate(request: PricingRequest): void {
    PricingIntegrationPolicy.validateRequest(request);
    
    if (!CurrencyPolicy.isSupported(request.currency.code)) {
      throw new Error('Unsupported Currency');
    }

    if (!PricingContractSpecification.isSatisfiedBy(request)) {
      throw new Error('Pricing Contract Specification failed');
    }
  }
}`,

  'services/pricing/menu-pricing.resolver.ts': `import { PricingRequest } from '../../value-objects/pricing-request.value-object';
import { PricingResponse } from '../../value-objects/pricing-response.value-object';
import { PriceReferenceValidator } from './price-reference.validator';
import { MenuPricingPolicyEngine } from './menu-pricing-policy.engine';
import { PricingResultMapper } from './pricing-result.mapper';

export class MenuPricingResolver {
  public resolve(request: PricingRequest, externalFetchFn: (req: PricingRequest) => any): PricingResponse {
    // 1. Validate
    PriceReferenceValidator.validate(request);
    MenuPricingPolicyEngine.validate(request);

    // 2. Fetch (injected dependency simulating Gateway call)
    const rawData = externalFetchFn(request);

    // 3. Map
    return PricingResultMapper.mapToResponse(rawData);
  }
}`,

  'services/pricing/menu-pricing.gateway.ts': `import { PricingRequest } from '../../value-objects/pricing-request.value-object';
import { PricingResponse } from '../../value-objects/pricing-response.value-object';
import { MenuPricingResolver } from './menu-pricing.resolver';
import { PricingRequestedEvent, PricingResolvedEvent, PricingUnavailableEvent } from '../../events/pricing.events';
import { PricingCorrelationId } from '../../value-objects/pricing-correlation-id.value-object';

export class MenuPricingGateway {
  private resolver: MenuPricingResolver;

  constructor() {
    this.resolver = new MenuPricingResolver();
  }

  public fetchPricing(request: PricingRequest, fetchProvider: (req: PricingRequest) => any): { response: PricingResponse | null, events: any[] } {
    const correlationId = PricingCorrelationId.create().value;
    const events: any[] = [];
    events.push(new PricingRequestedEvent(correlationId, request.priceRef.value));

    try {
      const response = this.resolver.resolve(request, fetchProvider);
      events.push(new PricingResolvedEvent(correlationId, response.displayedPrice.formattedValue));
      return { response, events };
    } catch (e: any) {
      events.push(new PricingUnavailableEvent(correlationId, e.message));
      return { response: null, events };
    }
  }
}`,

  // Tests
  'tests/menu-pricing-integration.spec.ts': `import { MenuPricingGateway } from '../services/pricing/menu-pricing.gateway';
import { PricingRequest } from '../value-objects/pricing-request.value-object';
import { PriceReference } from '../value-objects/price-reference.value-object';
import { CurrencyReference } from '../value-objects/currency-reference.value-object';

describe('MenuPricingIntegration', () => {
  it('should fetch pricing successfully via gateway', () => {
    const gateway = new MenuPricingGateway();
    
    const request = PricingRequest.create({
      priceRef: PriceReference.create('price-123'),
      branchReference: 'branch-1',
      salesChannel: 'POS',
      currency: CurrencyReference.create('USD'),
      evaluationDateTime: new Date()
    });

    const mockFetch = (req: PricingRequest) => ({
      formattedAmount: '15.99 USD',
      currency: req.currency.code,
      taxIncluded: true,
      status: 'AVAILABLE'
    });

    const { response, events } = gateway.fetchPricing(request, mockFetch);

    expect(response).toBeDefined();
    expect(response?.displayedPrice.formattedValue).toBe('15.99 USD');
    expect(events.length).toBe(2);
    expect(events[1].constructor.name).toBe('PricingResolvedEvent');
  });

  it('should validate supported currency', () => {
    expect(() => CurrencyReference.create('')).toThrow();
  });
});`
};

Object.keys(filesToCreate).forEach(relPath => {
  const fullPath = path.join(domainDir, relPath);
  const dir = path.dirname(fullPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(fullPath, filesToCreate[relPath]);
  console.log('Created:', fullPath);
});
