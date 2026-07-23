import { MenuContractValidator } from '../acl/services/menu-contract.validator';
import { MenuEventFactory } from '../acl/services/menu-event.factory';
import { MenuIdempotencyManager } from '../acl/services/menu-idempotency.manager';
import { PoisonMessageHandler } from '../acl/services/poison-message.handler';

describe('Menu ACL', () => {
  it('should generate valid outbound metadata', () => {
    const meta = MenuEventFactory.createOutboundMetadata();
    expect(meta.correlationId).toBeDefined();
    expect(meta.producer).toBe('MENU');
    expect(meta.schemaVersion).toBe('1.0.0');
  });

  it('should validate valid inbound contracts', () => {
    const validator = new MenuContractValidator();
    const payload = {
      data: { price: 100 },
      metadata: {
        correlationId: '123',
        timestamp: new Date().toISOString(),
        producer: 'PRICING',
        eventVersion: '1.0.0'
      }
    };
    expect(() => validator.validateInbound(payload, '1.0.0')).not.toThrow();
  });

  it('should reject invalid metadata', () => {
    const validator = new MenuContractValidator();
    const payload = {
      data: { price: 100 },
      metadata: {
        // Missing correlationId
        timestamp: new Date().toISOString(),
        producer: 'PRICING',
        eventVersion: '1.0.0'
      }
    };
    expect(() => validator.validateInbound(payload, '1.0.0')).toThrow(/CorrelationId required/);
  });

  it('should detect duplicate events', () => {
    const manager = new MenuIdempotencyManager();
    const isProcessed = manager.isProcessed('event-1', () => true);
    expect(isProcessed).toBe(true);
  });

  it('should handle poison messages', () => {
    const handler = new PoisonMessageHandler();
    const event = handler.handle({ corrupt: true }, 'corr-1');
    expect(event.correlationId).toBe('corr-1');
    expect(event.payloadPreview).toContain('corrupt');
  });
});