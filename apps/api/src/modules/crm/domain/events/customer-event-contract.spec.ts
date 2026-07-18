import { describe, it } from 'node:test';
import * as assert from 'node:assert';

import { CustomerEventVersion } from './value-objects/customer-event-version.value-object';
import { CustomerEventMetadata } from './value-objects/customer-event-metadata.value-object';
import { CustomerEventRegistry } from './core/customer-event-registry';
import { CustomerEventFactory } from './services/customer-event-factory';
import { CustomerEventValidator } from './services/customer-event-validator';
import { CustomerEventSerializer } from './services/customer-event-serializer';
import { CustomerEventCatalog } from './core/customer-event-catalog';

// Import all events to populate registry mock or test actuals
import { CustomerCreatedEvent } from './customer.events';
import { WalletCreditedEvent } from './customer-wallet.events';

describe('Customer Event Catalog & Contracts', () => {

  describe('Value Objects', () => {
    it('CustomerEventVersion should enforce Semantic Versioning', () => {
      assert.doesNotThrow(() => new CustomerEventVersion('1.0.0'));
      assert.doesNotThrow(() => new CustomerEventVersion('2.1.4-beta.1'));
      
      assert.throws(() => new CustomerEventVersion('1.0'), /Invalid semantic version/);
      assert.throws(() => new CustomerEventVersion('v1.0.0'), /Invalid semantic version/);
      assert.throws(() => new CustomerEventVersion('latest'), /Invalid semantic version/);
    });

    it('CustomerEventMetadata should enforce required fields', () => {
      const v = new CustomerEventVersion('1.0.0');
      assert.doesNotThrow(() => new CustomerEventMetadata('e1', 'T1', v, 'a1', 'agg', 'r1', new Date()));

      assert.throws(() => new CustomerEventMetadata('', 'T1', v, 'a1', 'agg', 'r1', new Date()), /eventId is required/);
    });
  });

  describe('Registry and Serialization Integration', () => {
    it('should register and retrieve event constructors', () => {
      CustomerEventRegistry.register(CustomerEventCatalog.CustomerCreated, CustomerCreatedEvent);
      CustomerEventRegistry.register(CustomerEventCatalog.WalletCredited, WalletCreditedEvent);

      const Ctor = CustomerEventRegistry.getConstructor('CustomerCreated');
      assert.strictEqual(Ctor, CustomerCreatedEvent);

      assert.throws(() => CustomerEventRegistry.getConstructor('UnknownEvent'), /not registered/);
      assert.throws(() => CustomerEventRegistry.register('CustomerCreated', CustomerCreatedEvent), /already registered/);
    });

    it('CustomerEventFactory should generate valid events', () => {
      const event = CustomerEventFactory.create(
        CustomerEventCatalog.CustomerCreated,
        'c1',
        'Customer',
        'r1',
        { customerId: 'c1', restaurantId: 'r1' },
        { initiatedBy: 'admin' }
      );

      assert.ok(event instanceof CustomerCreatedEvent);
      assert.strictEqual(event.metadata.eventType, 'CustomerCreated');
      assert.strictEqual(event.metadata.aggregateId, 'c1');
      assert.strictEqual(event.metadata.initiatedBy, 'admin');
      assert.strictEqual(event.payload.customerId, 'c1');
    });

    it('CustomerEventValidator should enforce metadata constraints', () => {
      const validEvent = CustomerEventFactory.create(
        CustomerEventCatalog.CustomerCreated,
        'c1',
        'Customer',
        'r1',
        { customerId: 'c1', restaurantId: 'r1' }
      );
      assert.doesNotThrow(() => CustomerEventValidator.validate(validEvent));

      const invalidEvent = { ...validEvent, metadata: undefined } as any;
      assert.throws(() => CustomerEventValidator.validate(invalidEvent), /Event must contain metadata/);
    });

    it('CustomerEventSerializer should securely stringify and parse events', () => {
      const original = CustomerEventFactory.create(
        CustomerEventCatalog.WalletCredited,
        'w1',
        'CustomerWallet',
        'r1',
        { walletId: 'w1', transactionId: 't1', amount: 500 }
      );

      const json = CustomerEventSerializer.serialize(original);
      assert.strictEqual(typeof json, 'string');
      
      const parsed: WalletCreditedEvent = CustomerEventSerializer.deserialize(json) as WalletCreditedEvent;
      assert.ok(parsed instanceof WalletCreditedEvent);
      assert.strictEqual(parsed.metadata.eventId, original.metadata.eventId);
      assert.strictEqual(parsed.payload.amount, 500);
    });
  });

  describe('Legacy Constructor Compatibility', () => {
    it('should seamlessly generate metadata when instantiated the old way', () => {
      // Legacy signature testing
      const event = new CustomerCreatedEvent('c123', 'r123');
      
      assert.ok(event.metadata);
      assert.strictEqual(event.metadata.aggregateId, 'c123');
      assert.strictEqual(event.metadata.restaurantId, 'r123');
      assert.strictEqual(event.payload.customerId, 'c123');
      assert.strictEqual(event.payload.restaurantId, 'r123');
    });
  });

});
