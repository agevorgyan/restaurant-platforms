import { OrderContractValidator } from '../services/order-contract-validator.service';
import { OrderIntegrationPolicy } from '../policies/order-integration.policy';
import { OrderIntegrationContext } from '../value-objects/order-integration-context.value-object';
import { OrderCorrelationId } from '../value-objects/order-correlation-id.value-object';
import { OrderEventVersion } from '../value-objects/order-event-version.value-object';
import { OrderEventPriority } from '../value-objects/order-event-priority.value-object';

describe('OrderContractValidator', () => {
  let validator: OrderContractValidator;

  beforeEach(() => {
    validator = new OrderContractValidator(new OrderIntegrationPolicy());
  });

  it('should successfully validate an event with complete context and payload', () => {
    validator.registerSchema('KitchenPreparationRequested', ['orderId', 'restaurantId']);

    const context = OrderIntegrationContext.create({
      correlationId: OrderCorrelationId.create(),
      version: OrderEventVersion.create(1, 0),
      priority: OrderEventPriority.create()
    });

    const result = validator.validate({
      eventName: 'KitchenPreparationRequested',
      context,
      payload: { orderId: 'o-123', restaurantId: 'r-456' }
    });

    expect('isSuccess' in result).toBe(true);
  });

  it('should fail if payload is missing required fields', () => {
    validator.registerSchema('DeliveryRequested', ['orderId', 'address']);

    const context = OrderIntegrationContext.create({
      correlationId: OrderCorrelationId.create(),
      version: OrderEventVersion.create(1, 0),
      priority: OrderEventPriority.create()
    });

    const result = validator.validate({
      eventName: 'DeliveryRequested',
      context,
      payload: { orderId: 'o-123' } // Missing address
    });

    expect('isFailure' in result).toBe(true);
    if ('isFailure' in result) {
      expect(result.error).toMatch(/Payload missing required fields/);
    }
  });

  it('should prevent duplicate schema registrations', () => {
    validator.registerSchema('PaymentAuthorized', ['orderId']);
    expect(() => validator.registerSchema('PaymentAuthorized', ['transactionId'])).toThrow(/already registered/);
  });

  it('should fail if no schema is registered for an event', () => {
    const result = validator.validate({
      eventName: 'UnknownEvent',
      context: {} as any,
      payload: {}
    });

    expect('isFailure' in result).toBe(true);
    if ('isFailure' in result) {
      expect(result.error).toMatch(/No schema registered/);
    }
  });
});
