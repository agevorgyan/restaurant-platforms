import { PaymentEventRegistry } from '../services/payment-event-registry.service';
import { PaymentEventFactory } from '../services/payment-event-factory.service';
import { PaymentIntegrationMapper } from '../services/payment-integration-mapper.service';
import { PaymentContractValidator } from '../services/payment-contract-validator.service';
import { IntegrationPublishingPolicy } from '../policies/integration-publishing.policy';
import { PaymentIntegrationContext } from '../value-objects/payment-integration-context.value-object';
import { PaymentCorrelationId } from '../value-objects/payment-correlation-id.value-object';
import { PaymentCausationId } from '../value-objects/payment-causation-id.value-object';
import { PaymentEventVersion } from '../value-objects/payment-event-version.value-object';
import { PaymentEventPriority, PaymentEventPriorityEnum } from '../value-objects/payment-event-priority.value-object';
import { AuthorizationCompletedEvent } from '../../events/payment.events';
import { PaymentAmount } from '../../value-objects/payment-amount.value-object';
import { PaymentAuthorized } from '../contracts/order.contracts';

describe('Payment Integration & Anti-Corruption Layer', () => {
  let registry: PaymentEventRegistry;
  let factory: PaymentEventFactory;
  let publishingPolicy: IntegrationPublishingPolicy;
  let mapper: PaymentIntegrationMapper;
  let validator: PaymentContractValidator;

  beforeEach(() => {
    registry = new PaymentEventRegistry();
    factory = new PaymentEventFactory();
    publishingPolicy = new IntegrationPublishingPolicy();
    mapper = new PaymentIntegrationMapper(registry, factory, publishingPolicy);
    validator = new PaymentContractValidator();
  });

  describe('Event Registration and Fanout Mapping', () => {
    it('should map a single internal DomainEvent into multiple Integration Contracts (Fanout)', () => {
      registry.register('AuthorizationCompletedEvent', ['Order.PaymentAuthorized', 'Analytics.PaymentCompletedForAnalytics']);
      
      mapper.registerMapper('Order.PaymentAuthorized', (event: AuthorizationCompletedEvent): PaymentAuthorized => {
        return {
          paymentId: event.paymentId,
          authorizationId: event.authorizationId,
          orderId: 'order_123', // Typically enriched from an Application Service
          amount: event.amount.value,
          currency: event.amount.currency
        };
      });

      mapper.registerMapper('Analytics.PaymentCompletedForAnalytics', (event: AuthorizationCompletedEvent) => {
        return {
          paymentId: event.paymentId,
          orderId: 'order_123',
          amount: event.amount.value,
          currency: event.amount.currency,
          completedAt: event.dateTimeOccurred
        };
      });

      const amount = new PaymentAmount(1500, 'USD');
      const authEvent = new AuthorizationCompletedEvent('pay_1', 'auth_1', 'ref_1', amount);

      const contextFactory = () => PaymentIntegrationContext.create(
        PaymentCorrelationId.create('corr_1'),
        PaymentCausationId.create('cause_1'),
        PaymentEventVersion.create(1, 0),
        PaymentEventPriority.create(PaymentEventPriorityEnum.HIGH)
      );

      const integrationEvents = mapper.mapDomainEvent(authEvent, contextFactory);

      expect(integrationEvents.length).toBe(2);
      expect(integrationEvents[0].eventName).toBe('Order.PaymentAuthorized');
      expect(integrationEvents[0].payload.paymentId).toBe('pay_1');
      expect(integrationEvents[1].eventName).toBe('Analytics.PaymentCompletedForAnalytics');
    });

    it('should reject mapping duplicate mappers', () => {
      mapper.registerMapper('Order.PaymentAuthorized', () => ({}));
      expect(() => {
        mapper.registerMapper('Order.PaymentAuthorized', () => ({}));
      }).toThrow('Mapper for Order.PaymentAuthorized already registered');
    });
  });

  describe('Contract Validation', () => {
    it('should pass validation for correctly formed integration events', () => {
      const context = PaymentIntegrationContext.create(
        PaymentCorrelationId.create('corr_1'),
        PaymentCausationId.create('cause_1'),
        PaymentEventVersion.create(1, 0),
        PaymentEventPriority.create(PaymentEventPriorityEnum.HIGH)
      );

      const event = factory.create('Order.PaymentAuthorized', context, {
        paymentId: 'pay_1',
        authorizationId: 'auth_1',
        orderId: 'order_123',
        amount: 1500,
        currency: 'USD'
      });

      expect(() => validator.validate(event)).not.toThrow();
    });

    it('should fail validation if metadata is missing/malformed', () => {
      const event = factory.create('Order.PaymentAuthorized', null as any, {
        paymentId: 'pay_1'
      });

      expect(() => validator.validate(event)).toThrow('Invalid integration metadata for event: Order.PaymentAuthorized');
    });

    it('should fail validation if contract payload is malformed (e.g. missing required fields implicitly)', () => {
      const context = PaymentIntegrationContext.create(
        PaymentCorrelationId.create('corr_1'),
        PaymentCausationId.create('cause_1'),
        PaymentEventVersion.create(1, 0),
        PaymentEventPriority.create(PaymentEventPriorityEnum.HIGH)
      );

      // Simulating a malformed payload by passing undefined for a property
      const event = factory.create('Order.PaymentAuthorized', context, {
        paymentId: 'pay_1',
        authorizationId: undefined
      });

      expect(() => validator.validate(event)).toThrow('Invalid integration contract payload for event: Order.PaymentAuthorized');
    });

    it('should fail validation if version is unsupported', () => {
      const context = PaymentIntegrationContext.create(
        PaymentCorrelationId.create('corr_1'),
        PaymentCausationId.create('cause_1'),
        PaymentEventVersion.create(2, 0), // Version 2 is unsupported
        PaymentEventPriority.create(PaymentEventPriorityEnum.HIGH)
      );

      const event = factory.create('Order.PaymentAuthorized', context, {
        paymentId: 'pay_1'
      });

      expect(() => validator.validate(event)).toThrow('Unsupported integration contract version: v2.0');
    });
  });
});
