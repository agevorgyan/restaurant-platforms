import { Supplier } from '../aggregates/supplier.aggregate';
import { SupplierName } from '../value-objects/supplier/supplier-name.value-object';
import { SupplierCode } from '../value-objects/supplier/supplier-code.value-object';
import { SupplierStatus } from '../enums/procurement.enums';
import { SupplierContact } from '../entities/supplier/supplier-contact.entity';
import { SupplierEmail } from '../value-objects/supplier/supplier-email.value-object';
import { SupplierAddress } from '../entities/supplier/supplier-address.entity';
import { SupplierPaymentTerms } from '../value-objects/supplier/supplier-payment-terms.value-object';

describe('Supplier Aggregate', () => {
  let supplier: Supplier;

  beforeEach(() => {
    supplier = Supplier.create(
      SupplierName.create('Acme Corp'),
      SupplierCode.create('ACME-001')
    );
  });

  it('should create an inactive supplier by default', () => {
    expect(supplier.name.value).toBe('Acme Corp');
    expect(supplier.code.value).toBe('ACME-001');
    expect(supplier.status).toBe(SupplierStatus.INACTIVE);
    expect(supplier.domainEvents.length).toBe(1);
    expect(supplier.domainEvents[0].constructor.name).toBe('SupplierCreatedEvent');
  });

  it('should not allow activation without required entities', () => {
    expect(() => supplier.activate()).toThrow(
      'Supplier must have a primary contact, primary address, and payment terms before activation'
    );
  });

  it('should activate when all consistency requirements are met', () => {
    // Add primary contact
    supplier.addContact(SupplierContact.create({
      firstName: 'John',
      lastName: 'Doe',
      role: 'Manager',
      email: SupplierEmail.create('john@acme.com'),
      isPrimary: true
    }));

    // Add primary address
    supplier.addAddress(SupplierAddress.create({
      street1: '123 Main St',
      city: 'Metropolis',
      stateProvince: 'NY',
      postalCode: '10001',
      countryCode: 'US',
      isPrimary: true
    }));

    // Add payment terms
    supplier.updatePaymentTerms(SupplierPaymentTerms.net30());

    supplier.activate();
    expect(supplier.status).toBe(SupplierStatus.ACTIVE);
  });

  it('should not allow updating code if active', () => {
    // Fulfill activation requirements
    supplier.addContact(SupplierContact.create({
      firstName: 'John', lastName: 'Doe', role: 'Manager', email: SupplierEmail.create('john@acme.com'), isPrimary: true
    }));
    supplier.addAddress(SupplierAddress.create({
      street1: '123 Main St', city: 'Metropolis', stateProvince: 'NY', postalCode: '10001', countryCode: 'US', isPrimary: true
    }));
    supplier.updatePaymentTerms(SupplierPaymentTerms.net30());
    supplier.activate();

    // Try to update code
    expect(() => supplier.updateCode(SupplierCode.create('ACME-002'))).toThrow(
      'Supplier code is immutable after activation'
    );
  });

  it('should allow updating code if inactive', () => {
    supplier.updateCode(SupplierCode.create('ACME-002'));
    expect(supplier.code.value).toBe('ACME-002');
  });
});
