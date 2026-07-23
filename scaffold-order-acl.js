const fs = require('fs');
const path = require('path');

const moduleDir = '/Users/apple/Downloads/Projects/Restaurant Platform/restaurant-platforms/apps/api/src/modules/customer/domain';

// Check if OrderReference exists, if not I'll just create it in the acl/order directory to keep acl separated or reuse the one in value-objects.
// Let's create an acl/order folder for all order integration to follow clean architecture.
const aclDir = path.join(moduleDir, 'acl', 'order');

const filesToCreate = {
  // Value Objects
  'value-objects/customer-order-correlation-id.value-object.ts': `import { ValueObject } from '@saas/core';

export interface CustomerOrderCorrelationIdProps { value: string; }

export class CustomerOrderCorrelationId extends ValueObject<CustomerOrderCorrelationIdProps> {
  get value(): string { return this.props.value; }
  private constructor(props: CustomerOrderCorrelationIdProps) { super(props); }
  public static create(value?: string): CustomerOrderCorrelationId {
    return new CustomerOrderCorrelationId({ value: value || crypto.randomUUID() });
  }
}`,

  'value-objects/order-activity-reference.value-object.ts': `import { ValueObject } from '@saas/core';

export interface OrderActivityReferenceProps { activityId: string; }

export class OrderActivityReference extends ValueObject<OrderActivityReferenceProps> {
  get activityId(): string { return this.props.activityId; }
  private constructor(props: OrderActivityReferenceProps) { super(props); }
  public static create(activityId: string): OrderActivityReference {
    return new OrderActivityReference({ activityId });
  }
}`,

  'value-objects/customer-order-statistics.value-object.ts': `import { ValueObject } from '@saas/core';

export interface CustomerOrderStatisticsProps {
  lifetimeSpend: number;
  orderCount: number;
  averageOrderValue: number;
  lastOrderDate?: Date;
  customerSegmentHint?: string;
}

export class CustomerOrderStatistics extends ValueObject<CustomerOrderStatisticsProps> {
  get lifetimeSpend(): number { return this.props.lifetimeSpend; }
  get orderCount(): number { return this.props.orderCount; }
  get averageOrderValue(): number { return this.props.averageOrderValue; }
  get lastOrderDate(): Date | undefined { return this.props.lastOrderDate; }
  get customerSegmentHint(): string | undefined { return this.props.customerSegmentHint; }

  private constructor(props: CustomerOrderStatisticsProps) { super(props); }
  public static create(props: CustomerOrderStatisticsProps): CustomerOrderStatistics {
    return new CustomerOrderStatistics(props);
  }
}`,

  'value-objects/customer-order-summary.value-object.ts': `import { ValueObject } from '@saas/core';

export interface CustomerOrderSummaryProps {
  orderRef: string;
  totalAmount: number;
  status: string;
  completedAt?: Date;
}

export class CustomerOrderSummary extends ValueObject<CustomerOrderSummaryProps> {
  get orderRef(): string { return this.props.orderRef; }
  get totalAmount(): number { return this.props.totalAmount; }
  get status(): string { return this.props.status; }
  get completedAt(): Date | undefined { return this.props.completedAt; }

  private constructor(props: CustomerOrderSummaryProps) { super(props); }
  public static create(props: CustomerOrderSummaryProps): CustomerOrderSummary {
    return new CustomerOrderSummary(props);
  }
}`,

  'value-objects/customer-order-context.value-object.ts': `import { ValueObject } from '@saas/core';
import { CustomerReference } from '../../value-objects/customer-reference.value-object';
import { OrderReference } from '../../value-objects/order-reference.value-object';
import { BranchReference } from '../../value-objects/branch-reference.value-object';
import { CustomerOrderCorrelationId } from './customer-order-correlation-id.value-object';

export interface CustomerOrderContextProps {
  correlationId: CustomerOrderCorrelationId;
  customerRef: CustomerReference;
  orderRef: OrderReference;
  branchRef?: BranchReference;
  salesChannel?: string;
  businessDateTime: Date;
}

export class CustomerOrderContext extends ValueObject<CustomerOrderContextProps> {
  get correlationId(): CustomerOrderCorrelationId { return this.props.correlationId; }
  get customerRef(): CustomerReference { return this.props.customerRef; }
  get orderRef(): OrderReference { return this.props.orderRef; }
  get branchRef(): BranchReference | undefined { return this.props.branchRef; }
  get salesChannel(): string | undefined { return this.props.salesChannel; }
  get businessDateTime(): Date { return this.props.businessDateTime; }

  private constructor(props: CustomerOrderContextProps) { super(props); }
  public static create(props: CustomerOrderContextProps): CustomerOrderContext {
    return new CustomerOrderContext(props);
  }
}`,

  'value-objects/customer-order-request.value-object.ts': `import { ValueObject } from '@saas/core';
import { CustomerOrderContext } from './customer-order-context.value-object';

export interface CustomerOrderRequestProps {
  context: CustomerOrderContext;
  action: string;
}

export class CustomerOrderRequest extends ValueObject<CustomerOrderRequestProps> {
  get context(): CustomerOrderContext { return this.props.context; }
  get action(): string { return this.props.action; }

  private constructor(props: CustomerOrderRequestProps) { super(props); }
  public static create(props: CustomerOrderRequestProps): CustomerOrderRequest {
    return new CustomerOrderRequest(props);
  }
}`,

  'value-objects/customer-order-response.value-object.ts': `import { ValueObject } from '@saas/core';
import { CustomerOrderSummary } from './customer-order-summary.value-object';
import { CustomerOrderStatistics } from './customer-order-statistics.value-object';
import { CustomerOrderCorrelationId } from './customer-order-correlation-id.value-object';

export interface CustomerOrderResponseProps {
  correlationId: CustomerOrderCorrelationId;
  success: boolean;
  summary?: CustomerOrderSummary;
  statistics?: CustomerOrderStatistics;
  errorReason?: string;
}

export class CustomerOrderResponse extends ValueObject<CustomerOrderResponseProps> {
  get correlationId(): CustomerOrderCorrelationId { return this.props.correlationId; }
  get success(): boolean { return this.props.success; }
  get summary(): CustomerOrderSummary | undefined { return this.props.summary; }
  get statistics(): CustomerOrderStatistics | undefined { return this.props.statistics; }
  get errorReason(): string | undefined { return this.props.errorReason; }

  private constructor(props: CustomerOrderResponseProps) { super(props); }
  public static create(props: CustomerOrderResponseProps): CustomerOrderResponse {
    return new CustomerOrderResponse(props);
  }
}`,

  // Specifications
  'specifications/order-acl.specifications.ts': `export class OrderReferenceSpecification {
  public static isValid(ref: any): boolean {
    return !!ref;
  }
}

export class CustomerOrderSpecification {
  public static isValidContext(context: any): boolean {
    return !!context.customerRef && !!context.orderRef;
  }
}

export class OrderStatisticsSpecification {
  public static isConsistent(stats: any): boolean {
    if (stats.orderCount < 0 || stats.lifetimeSpend < 0) return false;
    return true;
  }
}

export class OrderContractSpecification {
  public static isValidVersion(contract: any): boolean {
    return contract.version === '1.0';
  }
}

export class CustomerEligibilitySpecification {
  public static isEligible(stats: any): boolean {
    return stats.orderCount > 0;
  }
}`,

  // Policies
  'policies/order-acl.policies.ts': `export class CustomerOrderIntegrationPolicy {
  public static enforce(request: any): void {
    if (!request) throw new Error('Request cannot be null');
  }
}

export class CustomerOrderValidationPolicy {
  public static validate(context: any): void {
    if (!context.customerRef || !context.orderRef) {
      throw new Error('Customer and Order references are mandatory');
    }
  }
}

export class OrderStatisticsPolicy {
  public static enforce(stats: any): void {
    if (stats.lifetimeSpend < 0) throw new Error('Spend cannot be negative');
  }
}

export class CustomerEligibilityPolicy {
  public static evaluate(stats: any): boolean {
    return stats.lifetimeSpend > 0;
  }
}

export class OrderHistoryPolicy {
  public static enforce(history: any): void {
    void history;
  }
}`,

  // Integration Contracts - Inbound
  'contracts/inbound/order.contracts.ts': `export interface OrderCreatedContract {
  version: '1.0';
  orderId: string;
  customerId: string;
  totalAmount: number;
  createdAt: Date;
}

export interface OrderCompletedContract {
  version: '1.0';
  orderId: string;
  customerId: string;
  totalAmount: number;
  completedAt: Date;
}

export interface OrderCancelledContract {
  version: '1.0';
  orderId: string;
  customerId: string;
  reason: string;
  cancelledAt: Date;
}

export interface OrderRefundedContract {
  version: '1.0';
  orderId: string;
  customerId: string;
  refundAmount: number;
  refundedAt: Date;
}

export interface CustomerAssignedToOrderContract {
  version: '1.0';
  orderId: string;
  customerId: string;
  assignedAt: Date;
}`,

  // Integration Contracts - Outbound
  'contracts/outbound/customer-order.contracts.ts': `export interface CustomerOrderSummaryRequestedContract {
  version: '1.0';
  customerId: string;
  orderId: string;
  requestedAt: Date;
}

export interface CustomerOrderStatisticsRequestedContract {
  version: '1.0';
  customerId: string;
  requestedAt: Date;
}

export interface CustomerEligibilityRequestedContract {
  version: '1.0';
  customerId: string;
  requestedAt: Date;
}`,

  // Domain Events
  'events/order-acl.events.ts': `import { DomainEvent } from '@saas/core';

export class CustomerOrderIntegrationStartedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly correlationId: string, public readonly customerId: string) {}
  getAggregateId(): string { return this.customerId; }
}

export class CustomerOrderIntegrationCompletedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly correlationId: string, public readonly customerId: string) {}
  getAggregateId(): string { return this.customerId; }
}

export class CustomerOrderIntegrationFailedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly correlationId: string, public readonly customerId: string, public readonly reason: string) {}
  getAggregateId(): string { return this.customerId; }
}

export class CustomerStatisticsUpdatedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly customerId: string, public readonly orderCount: number) {}
  getAggregateId(): string { return this.customerId; }
}

export class CustomerEligibilityEvaluatedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly customerId: string, public readonly isEligible: boolean) {}
  getAggregateId(): string { return this.customerId; }
}`,

  // Services
  'services/customer-order-resolver.service.ts': `import { CustomerOrderContext } from '../value-objects/customer-order-context.value-object';

export class CustomerOrderResolver {
  public resolveTargetEndpoint(context: CustomerOrderContext): string {
    void context;
    return 'order-service.internal';
  }
}`,

  'services/order-reference-validator.service.ts': `import { OrderReference } from '../../value-objects/order-reference.value-object';

export class OrderReferenceValidator {
  public validate(ref: OrderReference): boolean {
    return !!ref && !!ref.orderId;
  }
}`,

  'services/customer-order-mapper.service.ts': `import { CustomerOrderSummary } from '../value-objects/customer-order-summary.value-object';
import { CustomerOrderStatistics } from '../value-objects/customer-order-statistics.value-object';

export class CustomerOrderMapper {
  public mapToSummary(data: any): CustomerOrderSummary {
    return CustomerOrderSummary.create({
      orderRef: data.orderId,
      totalAmount: data.amount || 0,
      status: data.status || 'UNKNOWN'
    });
  }

  public mapToStatistics(data: any): CustomerOrderStatistics {
    return CustomerOrderStatistics.create({
      lifetimeSpend: data.lifetimeSpend || 0,
      orderCount: data.orderCount || 0,
      averageOrderValue: data.averageOrderValue || 0,
      lastOrderDate: data.lastOrderDate,
      customerSegmentHint: data.segment
    });
  }
}`,

  'services/customer-order-policy-engine.service.ts': `import { CustomerOrderContext } from '../value-objects/customer-order-context.value-object';
import { CustomerOrderValidationPolicy } from '../policies/order-acl.policies';

export class CustomerOrderPolicyEngine {
  public evaluatePreConditions(context: CustomerOrderContext): void {
    CustomerOrderValidationPolicy.validate(context);
  }
}`,

  'services/customer-order-gateway.service.ts': `import { CustomerOrderRequest } from '../value-objects/customer-order-request.value-object';
import { CustomerOrderResponse } from '../value-objects/customer-order-response.value-object';
import { CustomerOrderResolver } from './customer-order-resolver.service';
import { OrderReferenceValidator } from './order-reference-validator.service';
import { CustomerOrderMapper } from './customer-order-mapper.service';
import { CustomerOrderPolicyEngine } from './customer-order-policy-engine.service';
import { 
  CustomerOrderIntegrationStartedEvent, 
  CustomerOrderIntegrationCompletedEvent 
} from '../events/order-acl.events';

export interface EventPublisher {
  publish(event: any): void;
}

export class CustomerOrderGateway {
  constructor(
    private readonly resolver: CustomerOrderResolver,
    private readonly validator: OrderReferenceValidator,
    private readonly mapper: CustomerOrderMapper,
    private readonly policyEngine: CustomerOrderPolicyEngine,
    private readonly eventPublisher: EventPublisher
  ) {}

  public process(request: CustomerOrderRequest): CustomerOrderResponse {
    const { context } = request;
    
    this.eventPublisher.publish(
      new CustomerOrderIntegrationStartedEvent(context.correlationId.value, context.customerRef.customerId)
    );

    this.policyEngine.evaluatePreConditions(context);
    
    if (!this.validator.validate(context.orderRef)) {
      return CustomerOrderResponse.create({
        correlationId: context.correlationId,
        success: false,
        errorReason: 'Invalid Order Reference'
      });
    }

    // Resolve where to send/fetch (simulated)
    const endpoint = this.resolver.resolveTargetEndpoint(context);
    void endpoint;

    // Simulate mapping from external order context
    const summary = this.mapper.mapToSummary({ orderId: context.orderRef.orderId, amount: 50, status: 'COMPLETED' });

    const response = CustomerOrderResponse.create({
      correlationId: context.correlationId,
      success: true,
      summary
    });

    this.eventPublisher.publish(
      new CustomerOrderIntegrationCompletedEvent(context.correlationId.value, context.customerRef.customerId)
    );

    return response;
  }
}`,

  // Tests
  'tests/customer-order-acl.spec.ts': `import { CustomerOrderGateway } from '../services/customer-order-gateway.service';
import { CustomerOrderResolver } from '../services/customer-order-resolver.service';
import { OrderReferenceValidator } from '../services/order-reference-validator.service';
import { CustomerOrderMapper } from '../services/customer-order-mapper.service';
import { CustomerOrderPolicyEngine } from '../services/customer-order-policy-engine.service';
import { CustomerOrderRequest } from '../value-objects/customer-order-request.value-object';
import { CustomerOrderContext } from '../value-objects/customer-order-context.value-object';
import { CustomerOrderCorrelationId } from '../value-objects/customer-order-correlation-id.value-object';
import { CustomerReference } from '../../value-objects/customer-reference.value-object';
import { OrderReference } from '../../value-objects/order-reference.value-object';

describe('CustomerOrderGateway ACL', () => {
  let gateway: CustomerOrderGateway;
  let mockEventPublisher: any;

  beforeEach(() => {
    mockEventPublisher = { publish: jest.fn() };
    gateway = new CustomerOrderGateway(
      new CustomerOrderResolver(),
      new OrderReferenceValidator(),
      new CustomerOrderMapper(),
      new CustomerOrderPolicyEngine(),
      mockEventPublisher
    );
  });

  it('should process a valid customer order integration request', () => {
    const context = CustomerOrderContext.create({
      correlationId: CustomerOrderCorrelationId.create(),
      customerRef: CustomerReference.create('c1'),
      orderRef: OrderReference.create('o1'),
      businessDateTime: new Date()
    });

    const request = CustomerOrderRequest.create({
      context,
      action: 'FETCH_SUMMARY'
    });

    const response = gateway.process(request);

    expect(response.success).toBe(true);
    expect(response.summary?.orderRef).toBe('o1');
    expect(mockEventPublisher.publish).toHaveBeenCalledTimes(2); // Started & Completed
  });

  it('should throw error if pre-conditions fail', () => {
    const context = CustomerOrderContext.create({
      correlationId: CustomerOrderCorrelationId.create(),
      customerRef: null as any,
      orderRef: OrderReference.create('o1'),
      businessDateTime: new Date()
    });

    const request = CustomerOrderRequest.create({
      context,
      action: 'FETCH_SUMMARY'
    });

    expect(() => gateway.process(request)).toThrow();
  });
});`
};

Object.keys(filesToCreate).forEach(relPath => {
  const fullPath = path.join(aclDir, relPath);
  const dir = path.dirname(fullPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(fullPath, filesToCreate[relPath]);
  console.log('Created:', fullPath);
});
