import { PaymentIntent, PaymentIntentProps } from './payment-intent.aggregate';
import { PaymentIntentReference } from '../value-objects/payment-intent-reference.value-object';
import { PaymentIntentOrigin, PaymentIntentOriginEnum } from '../value-objects/payment-intent-origin.value-object';
import { PaymentAmount } from '../value-objects/payment-amount.value-object';
import { PaymentIntentExpiration } from '../entities/payment-intent-expiration.entity';
import { PaymentIntentExpirationTime } from '../value-objects/payment-intent-expiration-time.value-object';
import { PaymentIntentStatusEnum } from '../value-objects/payment-intent-status.value-object';

describe('PaymentIntent Aggregate', () => {
  const getValidProps = (): Omit<PaymentIntentProps, 'status' | 'version' | 'createdAt' | 'updatedAt'> => {
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 15);

    return {
      orderId: PaymentIntentReference.create('order_123'),
      checkoutSessionId: PaymentIntentReference.create('cs_456'),
      orderQuotationId: PaymentIntentReference.create('oq_789'),
      pricingSnapshotId: PaymentIntentReference.create('ps_101'),
      amount: new PaymentAmount(1500, 'USD'),
      origin: PaymentIntentOrigin.create(PaymentIntentOriginEnum.WEB),
      expiration: PaymentIntentExpiration.create({
        expiresAt: PaymentIntentExpirationTime.create(expiresAt)
      })
    };
  };

  it('should successfully create a valid PaymentIntent', () => {
    const props = getValidProps();
    const intent = PaymentIntent.create(props);

    expect(intent.id).toBeDefined();
    expect(intent.status.value).toBe(PaymentIntentStatusEnum.CREATED);
    expect(intent.version.value).toBe(1);
    expect(intent.domainEvents.length).toBe(1);
    expect(intent.domainEvents[0].constructor.name).toBe('PaymentIntentCreatedEvent');
  });

  it('should reject creation if references overlap/duplicate', () => {
    const props = getValidProps();
    // Intentionally make two references exactly the same string to trigger the set size validation
    props.orderQuotationId = PaymentIntentReference.create('order_123');
    
    expect(() => PaymentIntent.create(props)).toThrow('References must be unique and distinct');
  });

  it('should progress through valid lifecycle transitions', () => {
    const intent = PaymentIntent.create(getValidProps());
    intent.clearEvents();

    // Activate
    intent.activate();
    expect(intent.status.value).toBe(PaymentIntentStatusEnum.ACTIVE);
    expect(intent.version.value).toBe(2);
    expect(intent.domainEvents[0].constructor.name).toBe('PaymentIntentActivatedEvent');
    intent.clearEvents();

    // Await Auth
    intent.awaitAuthorization();
    expect(intent.status.value).toBe(PaymentIntentStatusEnum.AWAITING_AUTHORIZATION);
    expect(intent.version.value).toBe(3);

    // Authorize
    intent.authorize('txn_123');
    expect(intent.status.value).toBe(PaymentIntentStatusEnum.AUTHORIZED);
    expect(intent.domainEvents[0].constructor.name).toBe('PaymentIntentAuthorizedEvent');
  });

  it('should block invalid lifecycle transitions', () => {
    const intent = PaymentIntent.create(getValidProps());
    expect(() => intent.authorize('txn_123')).toThrow('Cannot authorize from status Created');
  });

  it('should successfully expire non-terminal intents', () => {
    const intent = PaymentIntent.create(getValidProps());
    intent.expire();
    expect(intent.status.value).toBe(PaymentIntentStatusEnum.EXPIRED);
  });

  it('should ignore expiration if already terminal', () => {
    const intent = PaymentIntent.create(getValidProps());
    intent.activate();
    intent.awaitAuthorization();
    intent.authorize('txn_123'); // Now AUTHORIZED (terminal for this aggregate's lifecycle)
    
    const version = intent.version.value;
    intent.expire();
    
    expect(intent.status.value).toBe(PaymentIntentStatusEnum.AUTHORIZED);
    expect(intent.version.value).toBe(version); // Version did not increment
  });

  it('should correctly evaluate expiration based on time', () => {
    const past = new Date();
    past.setMinutes(past.getMinutes() - 15);
    
    const props = getValidProps();
    props.expiration = PaymentIntentExpiration.create({
      expiresAt: PaymentIntentExpirationTime.create(past)
    });
    
    const intent = PaymentIntent.create(props);
    expect(intent.isExpired()).toBe(true);
  });
});
