import { CustomerOrderGateway } from '../services/customer-order-gateway.service';
import { CustomerOrderResolver } from '../services/customer-order-resolver.service';
import { OrderReferenceValidator } from '../services/order-reference-validator.service';
import { CustomerOrderMapper } from '../services/customer-order-mapper.service';
import { CustomerOrderPolicyEngine } from '../services/customer-order-policy-engine.service';
import { CustomerOrderRequest } from '../value-objects/customer-order-request.value-object';
import { CustomerOrderContext } from '../value-objects/customer-order-context.value-object';
import { CustomerOrderCorrelationId } from '../value-objects/customer-order-correlation-id.value-object';
import { CustomerReference } from '../../../value-objects/customer-reference.value-object';
import { OrderReference } from '../../../value-objects/order-reference.value-object';

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
});