import { Customer } from '../aggregates/customer.aggregate';
import { CustomerId } from '../value-objects/customer-id.value-object';
import { CustomerCode } from '../value-objects/customer-code.value-object';
import { CustomerStatusVo } from '../value-objects/customer-status.value-object';
import { CustomerVersion } from '../value-objects/customer-version.value-object';
import { CustomerType, CustomerStatus } from '../enums/customer.enums';
import { CustomerProfile } from '../entities/customer-profile.entity';
import { CustomerName } from '../value-objects/customer-name.value-object';
import { CustomerContact } from '../entities/customer-contact.entity';
import { CustomerConsent } from '../entities/customer-consent.entity';
import { MarketingConsent } from '../value-objects/marketing-consent.value-object';
import { PrivacyConsent } from '../value-objects/privacy-consent.value-object';

describe('Customer Aggregate', () => {
  const createValidProps = () => ({
    customerId: CustomerId.create('c1'),
    customerCode: CustomerCode.create('CODE1'),
    status: CustomerStatusVo.create(CustomerStatus.DRAFT),
    type: CustomerType.REGISTERED,
    version: CustomerVersion.create(1),
    profile: CustomerProfile.create('p1', { name: CustomerName.create('John', 'Doe') }),
    contact: CustomerContact.create('co1', { isVerified: true }),
    consent: CustomerConsent.create('cs1', {
      marketingConsent: MarketingConsent.create(false),
      privacyConsent: PrivacyConsent.create(true)
    }),
    identifiers: []
  });

  it('should create customer and emit CustomerCreatedEvent', () => {
    const customer = Customer.create(createValidProps());
    expect(customer.id).toBe('c1');
    expect(customer.domainEvents.length).toBe(1);
    expect(customer.domainEvents[0].constructor.name).toBe('CustomerCreatedEvent');
  });

  it('should activate successfully if verified and consent granted', () => {
    const customer = Customer.create(createValidProps());
    customer.activate();
    expect(customer.status.status).toBe(CustomerStatus.ACTIVE);
  });

  it('should prevent guest from being activated', () => {
    const props = createValidProps();
    props.type = CustomerType.GUEST;
    const customer = Customer.create(props);
    expect(() => customer.activate()).toThrow(/Guest customers cannot be activated/);
  });

  it('should prevent activation if not verified', () => {
    const props = createValidProps();
    props.contact = CustomerContact.create('co1', { isVerified: false });
    const customer = Customer.create(props);
    expect(() => customer.activate()).toThrow(/At least one verified contact method required/);
  });

  it('should prevent activation if privacy consent not granted', () => {
    const props = createValidProps();
    props.consent = CustomerConsent.create('cs1', {
      marketingConsent: MarketingConsent.create(false),
      privacyConsent: PrivacyConsent.create(false)
    });
    const customer = Customer.create(props);
    expect(() => customer.activate()).toThrow(/Privacy consent required/);
  });
});