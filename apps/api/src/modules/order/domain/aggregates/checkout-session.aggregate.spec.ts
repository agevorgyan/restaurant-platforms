import { CheckoutSession } from './checkout-session.aggregate';
import { CheckoutReference } from '../value-objects/checkout-reference.value-object';
import { CheckoutOrigin, CheckoutOriginEnum } from '../value-objects/checkout-origin.value-object';
import { CheckoutChannel, CheckoutChannelEnum } from '../value-objects/checkout-channel.value-object';
import { CheckoutStatusEnum } from '../value-objects/checkout-status.value-object';
import { CheckoutParticipant } from '../entities/checkout-participant.entity';
import { CheckoutContact } from '../entities/checkout-contact.entity';
import { CheckoutExpiration } from '../entities/checkout-expiration.entity';
import { CheckoutExpirationTime } from '../value-objects/checkout-expiration-time.value-object';
import {
  CheckoutSessionCreatedEvent,
  CheckoutActivatedEvent,
  CheckoutCancelledEvent
} from '../events/checkout-session.events';

describe('CheckoutSession Aggregate', () => {
  const mockOrderQuotationId = '11111111-1111-4111-8111-111111111111';
  const mockPricingSnapshotId = '22222222-2222-4222-8222-222222222222';

  let session: CheckoutSession;

  beforeEach(() => {
    session = CheckoutSession.create({
      reference: CheckoutReference.create({
        orderQuotationId: mockOrderQuotationId,
        pricingSnapshotId: mockPricingSnapshotId
      }),
      origin: CheckoutOrigin.create(CheckoutOriginEnum.CUSTOMER_APP),
      channel: CheckoutChannel.create(CheckoutChannelEnum.ONLINE)
    });
  });

  describe('Creation', () => {
    it('should create a valid checkout session in CREATED state', () => {
      expect(session.status.value).toBe(CheckoutStatusEnum.CREATED);
      expect(session.reference.orderQuotationId).toBe(mockOrderQuotationId);
      expect(session.reference.pricingSnapshotId).toBe(mockPricingSnapshotId);
      expect(session.version.value).toBe(1);
      expect(session.token).toBeDefined();
      expect(session.expiration).toBeDefined();

      const events = session.domainEvents;
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(CheckoutSessionCreatedEvent);
    });

    it('should use provided expiration if given', () => {
      const expiration = CheckoutExpiration.withDefaultTimeout(30); // 30 mins
      const customSession = CheckoutSession.create({
        reference: CheckoutReference.create({
          orderQuotationId: mockOrderQuotationId,
          pricingSnapshotId: mockPricingSnapshotId
        }),
        origin: CheckoutOrigin.create(CheckoutOriginEnum.CUSTOMER_APP),
        channel: CheckoutChannel.create(CheckoutChannelEnum.ONLINE),
        expiration
      });

      expect(customSession.expiration).toBe(expiration);
    });
  });

  describe('Transitions and State', () => {
    let participant: CheckoutParticipant;
    let contact: CheckoutContact;

    beforeEach(() => {
      session.clearEvents();
      participant = CheckoutParticipant.create({ guestToken: 'guest-123' });
      contact = CheckoutContact.create({ email: 'test@example.com' });
    });

    it('should activate successfully', () => {
      session.activate(participant, contact);

      expect(session.status.value).toBe(CheckoutStatusEnum.ACTIVE);
      expect(session.participant?.guestToken).toBe('guest-123');
      expect(session.contact?.email).toBe('test@example.com');
      expect(session.version.value).toBe(2);

      const events = session.domainEvents;
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(CheckoutActivatedEvent);
    });

    it('should transition through standard payment flow', () => {
      session.activate(participant, contact);
      session.awaitPayment();
      expect(session.status.value).toBe(CheckoutStatusEnum.AWAITING_PAYMENT);
      
      session.authorizePayment();
      expect(session.status.value).toBe(CheckoutStatusEnum.PAYMENT_AUTHORIZED);
      
      session.complete('new-order-id');
      expect(session.status.value).toBe(CheckoutStatusEnum.COMPLETED);
      expect(session.targetOrderId).toBe('new-order-id');
    });

    it('should allow cancellation', () => {
      session.cancel('User requested');
      expect(session.status.value).toBe(CheckoutStatusEnum.CANCELLED);
      
      const events = session.domainEvents;
      expect(events[0]).toBeInstanceOf(CheckoutCancelledEvent);
      expect((events[0] as CheckoutCancelledEvent).reason).toBe('User requested');
    });

    it('should reject modifications when expired', () => {
      // Create an already expired session by hacking the time
      const pastTime = new Date(Date.now() - 1000 * 60 * 20); // 20 mins ago
      const exp = CheckoutExpiration.create({
        createdAt: CheckoutExpirationTime.create(new Date(pastTime.getTime() - 1000)),
        expiresAt: CheckoutExpirationTime.create(pastTime)
      });
      
      const expiredSession = CheckoutSession.create({
        reference: CheckoutReference.create({
          orderQuotationId: mockOrderQuotationId,
          pricingSnapshotId: mockPricingSnapshotId
        }),
        origin: CheckoutOrigin.create(CheckoutOriginEnum.CUSTOMER_APP),
        channel: CheckoutChannel.create(CheckoutChannelEnum.ONLINE),
        expiration: exp
      });

      expect(() => expiredSession.activate(participant, contact)).toThrow('Cannot modify an expired checkout session');
    });

    it('should reject modifications in terminal states', () => {
      session.cancel('Test');
      expect(() => session.activate(participant, contact)).toThrow('Cannot modify a checkout session in terminal state: Cancelled');
    });
  });

  describe('Metadata', () => {
    it('should allow updating metadata', () => {
      session.updateMetadata('tipAmount', 500);
      expect(session.metadata?.get('tipAmount')).toBe(500);
      expect(session.version.value).toBe(2); // Initial is 1, update makes it 2
    });

    it('should reject updating metadata if terminal', () => {
      session.cancel('Test');
      expect(() => session.updateMetadata('key', 'value')).toThrow();
    });
  });
});
