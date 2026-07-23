import { SupplierName } from '../value-objects/supplier/supplier-name.value-object';
import { SupplierEmail } from '../value-objects/supplier/supplier-email.value-object';
import { SupplierPhone } from '../value-objects/supplier/supplier-phone.value-object';
import { SupplierTaxNumber } from '../value-objects/supplier/supplier-tax-number.value-object';

describe('Supplier Value Objects', () => {
  describe('SupplierName', () => {
    it('should create valid name', () => {
      const name = SupplierName.create('Acme Corp');
      expect(name.value).toBe('Acme Corp');
    });

    it('should fail on empty name', () => {
      expect(() => SupplierName.create('')).toThrow('Supplier legal name cannot be empty');
      expect(() => SupplierName.create('   ')).toThrow('Supplier legal name cannot be empty');
    });
  });

  describe('SupplierEmail', () => {
    it('should create valid email', () => {
      const email = SupplierEmail.create('contact@acme.com');
      expect(email.value).toBe('contact@acme.com');
    });

    it('should normalize email to lowercase', () => {
      const email = SupplierEmail.create('Contact@ACME.com');
      expect(email.value).toBe('contact@acme.com');
    });

    it('should fail on invalid email', () => {
      expect(() => SupplierEmail.create('not-an-email')).toThrow('Invalid email format');
    });
  });

  describe('SupplierPhone', () => {
    it('should create valid phone', () => {
      const phone = SupplierPhone.create('+1 (555) 123-4567');
      expect(phone.value).toBe('+1 (555) 123-4567');
    });

    it('should fail on invalid phone characters', () => {
      expect(() => SupplierPhone.create('phone-number')).toThrow('Invalid phone format');
    });
  });

  describe('SupplierTaxNumber', () => {
    it('should create valid tax number', () => {
      const tax = SupplierTaxNumber.create('US-123456');
      expect(tax.value).toBe('US-123456');
    });

    it('should fail on invalid characters', () => {
      expect(() => SupplierTaxNumber.create('US_123456!')).toThrow('Invalid tax identifier format');
    });
  });
});
