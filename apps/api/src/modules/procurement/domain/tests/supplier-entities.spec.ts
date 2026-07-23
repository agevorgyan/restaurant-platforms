import { SupplierContact } from '../entities/supplier/supplier-contact.entity';
import { SupplierEmail } from '../value-objects/supplier/supplier-email.value-object';
import { SupplierPhone } from '../value-objects/supplier/supplier-phone.value-object';
import { SupplierAddress } from '../entities/supplier/supplier-address.entity';

describe('Supplier Entities', () => {
  describe('SupplierContact', () => {
    it('should create valid contact', () => {
      const email = SupplierEmail.create('john@acme.com');
      const phone = SupplierPhone.create('+15551234');
      const contact = SupplierContact.create({
        firstName: 'John',
        lastName: 'Doe',
        role: 'Manager',
        email,
        phone,
        isPrimary: true
      });

      expect(contact.firstName).toBe('John');
      expect(contact.isPrimary).toBe(true);
    });

    it('should allow toggling primary status', () => {
      const email = SupplierEmail.create('john@acme.com');
      const contact = SupplierContact.create({
        firstName: 'John',
        lastName: 'Doe',
        role: 'Manager',
        email,
        isPrimary: false
      });

      expect(contact.isPrimary).toBe(false);
      contact.setPrimary(true);
      expect(contact.isPrimary).toBe(true);
    });
  });

  describe('SupplierAddress', () => {
    it('should create valid address', () => {
      const address = SupplierAddress.create({
        street1: '123 Main St',
        city: 'Metropolis',
        stateProvince: 'NY',
        postalCode: '10001',
        countryCode: 'US',
        isPrimary: true
      });

      expect(address.countryCode).toBe('US');
    });

    it('should fail if country code is not 2 chars', () => {
      expect(() => {
        SupplierAddress.create({
          street1: '123 Main St',
          city: 'Metropolis',
          stateProvince: 'NY',
          postalCode: '10001',
          countryCode: 'USA',
          isPrimary: true
        });
      }).toThrow('Valid 2-letter countryCode is required');
    });
  });
});
