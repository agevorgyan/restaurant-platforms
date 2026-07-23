import { CustomerOrderRequest } from '../value-objects/customer-order-request.value-object';
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
}