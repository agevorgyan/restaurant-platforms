import { PricingEventOrderingSpecification } from './pricing-event-ordering.specification';
import { IntegrationEventPayload } from '../services/pricing-event.mapper';

describe('PricingEventOrderingSpecification', () => {
  let spec: PricingEventOrderingSpecification;

  beforeEach(() => {
    spec = new PricingEventOrderingSpecification();
  });

  it('should return true when there is no last processed event', () => {
    const event = { metadata: { timestamp: new Date().toISOString() } } as IntegrationEventPayload;
    expect(spec.isSatisfiedBy(event, null)).toBe(true);
  });

  it('should return true when new event is strictly after last event', () => {
    const lastEvent = { metadata: { timestamp: '2026-07-21T10:00:00Z' } } as IntegrationEventPayload;
    const newEvent = { metadata: { timestamp: '2026-07-21T10:05:00Z' } } as IntegrationEventPayload;
    
    expect(spec.isSatisfiedBy(newEvent, lastEvent)).toBe(true);
  });

  it('should return false when new event is before the last event', () => {
    const lastEvent = { metadata: { timestamp: '2026-07-21T10:05:00Z' } } as IntegrationEventPayload;
    const newEvent = { metadata: { timestamp: '2026-07-21T10:00:00Z' } } as IntegrationEventPayload;
    
    expect(spec.isSatisfiedBy(newEvent, lastEvent)).toBe(false);
  });

  it('should return true when timestamps are identical', () => {
    const lastEvent = { metadata: { timestamp: '2026-07-21T10:00:00Z' } } as IntegrationEventPayload;
    const newEvent = { metadata: { timestamp: '2026-07-21T10:00:00Z' } } as IntegrationEventPayload;
    
    expect(spec.isSatisfiedBy(newEvent, lastEvent)).toBe(true);
  });
});
