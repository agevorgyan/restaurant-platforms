import { PricingEventRegistry } from './pricing-event-registry';

class MockPricingEvent {
  constructor(public id: string) {}
}

describe('PricingEventRegistry', () => {
  beforeEach(() => {
    PricingEventRegistry.clear();
  });

  it('should register an event', () => {
    PricingEventRegistry.register('MockPricingEvent', MockPricingEvent);
    expect(PricingEventRegistry.isRegistered('MockPricingEvent')).toBe(true);
    expect(PricingEventRegistry.getConstructor('MockPricingEvent')).toBe(MockPricingEvent);
  });

  it('should throw when registering a duplicate event', () => {
    PricingEventRegistry.register('MockPricingEvent', MockPricingEvent);
    expect(() => {
      PricingEventRegistry.register('MockPricingEvent', MockPricingEvent);
    }).toThrow('Event MockPricingEvent is already registered.');
  });

  it('should clear all registered events', () => {
    PricingEventRegistry.register('MockPricingEvent', MockPricingEvent);
    PricingEventRegistry.clear();
    expect(PricingEventRegistry.isRegistered('MockPricingEvent')).toBe(false);
  });
});
