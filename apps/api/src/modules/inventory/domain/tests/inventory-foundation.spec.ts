import { IngredientId } from '../value-objects/ingredient-id.value-object';
import { UnitPrecision } from '../value-objects/unit-precision.value-object';
import { Quantity } from '../value-objects/quantity.value-object';
import { SKU } from '../value-objects/sku.value-object';
import { Barcode } from '../value-objects/barcode.value-object';
import { ExpirationDate } from '../value-objects/expiration-date.value-object';
import { ShelfLife } from '../value-objects/shelf-life.value-object';

describe('Inventory Foundation Value Objects', () => {

  describe('Identifiers', () => {
    it('should create valid IngredientId', () => {
      const id = IngredientId.create();
      expect(id.value).toBeDefined();
    });

    it('should maintain immutability and equality for UUIDs', () => {
      const id1 = IngredientId.create('123e4567-e89b-12d3-a456-426614174000');
      const id2 = IngredientId.create('123e4567-e89b-12d3-a456-426614174000');
      expect(id1.equals(id2)).toBe(true);
    });
  });

  describe('Quantity and Precision', () => {
    it('should strictly enforce precision bounds', () => {
      expect(() => UnitPrecision.create(-1)).toThrow();
      expect(() => UnitPrecision.create(7)).toThrow();
      const p = UnitPrecision.create(3);
      expect(p.value).toBe(3);
    });

    it('should normalize quantities according to precision', () => {
      const p2 = UnitPrecision.create(2);
      const qty = Quantity.create(1.005, p2);
      expect(qty.value).toBe(1.01);
    });

    it('should support immutable arithmetic', () => {
      const p = UnitPrecision.create(2);
      const q1 = Quantity.create(10.5, p);
      const q2 = Quantity.create(5.25, p);

      const sum = q1.add(q2);
      expect(sum.value).toBe(15.75);
      expect(q1.value).toBe(10.5); // q1 is unchanged

      const diff = q1.subtract(q2);
      expect(diff.value).toBe(5.25);

      const mult = q2.multiply(2);
      expect(mult.value).toBe(10.5);
      
      const div = q1.divide(2);
      expect(div.value).toBe(5.25);
    });

    it('should prevent mixing different precisions', () => {
      const p1 = UnitPrecision.create(1);
      const p2 = UnitPrecision.create(2);
      const q1 = Quantity.create(10, p1);
      const q2 = Quantity.create(10, p2);

      expect(() => q1.add(q2)).toThrow('Cannot perform arithmetic operations on quantities with different precisions');
    });

    it('should perform comparisons', () => {
      const p = UnitPrecision.create(2);
      const q1 = Quantity.create(10, p);
      const q2 = Quantity.create(5, p);
      const q3 = Quantity.create(10, p);

      expect(q1.isGreaterThan(q2)).toBe(true);
      expect(q2.isLessThan(q1)).toBe(true);
      expect(q1.isGreaterThanOrEqual(q3)).toBe(true);
      expect(q1.isLessThanOrEqual(q3)).toBe(true);
      expect(q1.equals(q3)).toBe(true);
    });
  });

  describe('Codes and Strings', () => {
    it('should validate SKU formats', () => {
      expect(() => SKU.create('ab')).toThrow('SKU must be between 3 and 30 characters');
      expect(() => SKU.create('ABC@123')).toThrow('SKU can only contain uppercase letters, numbers, and hyphens');
      const sku = SKU.create('  abc-123  ');
      expect(sku.value).toBe('ABC-123');
    });

    it('should validate Barcode formats', () => {
      expect(() => Barcode.create('123')).toThrow('Barcode length is out of acceptable bounds');
      expect(() => Barcode.create('A-1234567')).toThrow('Barcode must be alphanumeric');
      const bc = Barcode.create('123456789012');
      expect(bc.value).toBe('123456789012');
    });
  });

  describe('Dates and Lifecycle', () => {
    it('should manage ExpirationDate properly', () => {
      const past = new Date('2020-01-01');
      const future = new Date('2050-01-01');

      const expPast = ExpirationDate.create(past);
      const expFuture = ExpirationDate.create(future);
      const expNull = ExpirationDate.create(null);

      expect(expPast.isExpired()).toBe(true);
      expect(expFuture.isExpired()).toBe(false);
      expect(expNull.isExpired()).toBe(false);
    });

    it('should calculate shelf life expiration', () => {
      const mfg = new Date('2024-01-01T00:00:00Z');
      const shelfLife = ShelfLife.create(10);
      const exp = shelfLife.calculateExpirationDate(mfg);
      expect(exp.toISOString()).toBe('2024-01-11T00:00:00.000Z');
    });
  });

});
