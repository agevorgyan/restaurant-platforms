import { InventoryRequestReference } from '../value-objects/integration/inventory-request-reference.value-object';
import { InventoryResponseReference } from '../value-objects/integration/inventory-response-reference.value-object';
import { ConsumptionRequest } from '../value-objects/integration/consumption-request.value-object';
import { ReservationRequestReference } from '../value-objects/integration/reservation-request-reference.value-object';
import { AllocationReference } from '../value-objects/integration/allocation-reference.value-object';
import { Quantity } from '../../../inventory/domain/value-objects/quantity.value-object';
import { UnitPrecision } from '../../../inventory/domain/value-objects/unit-precision.value-object';

describe('Kitchen Inventory Integration Value Objects', () => {
  const createQty = (val: number) => Quantity.create(val, UnitPrecision.create(2));

  describe('InventoryRequestReference', () => {
    it('should create valid reference', () => {
      const ref = InventoryRequestReference.create('corr-1');
      expect(ref.correlationId).toBe('corr-1');
      expect(ref.sourceContext).toBe('KITCHEN');
    });

    it('should throw on empty correlation id', () => {
      expect(() => InventoryRequestReference.create('')).toThrow();
    });
  });

  describe('InventoryResponseReference', () => {
    it('should create valid success response', () => {
      const ref = InventoryResponseReference.create('corr-1', true, 'OK');
      expect(ref.correlationId).toBe('corr-1');
      expect(ref.success).toBe(true);
      expect(ref.message).toBe('OK');
    });

    it('should create valid failure response', () => {
      const ref = InventoryResponseReference.create('corr-1', false, 'Failed');
      expect(ref.correlationId).toBe('corr-1');
      expect(ref.success).toBe(false);
      expect(ref.message).toBe('Failed');
    });
  });

  describe('ConsumptionRequest', () => {
    it('should create valid consumption request', () => {
      const ref = InventoryRequestReference.create('corr-1');
      const req = ConsumptionRequest.create(ref, 'prod-1', [
        { ingredientId: 'ing-1', quantity: createQty(5) }
      ]);
      expect(req.productionId).toBe('prod-1');
      expect(req.items).toHaveLength(1);
    });

    it('should throw if items empty', () => {
      const ref = InventoryRequestReference.create('corr-1');
      expect(() => ConsumptionRequest.create(ref, 'prod-1', [])).toThrow();
    });
  });

  describe('ReservationRequestReference', () => {
    it('should create valid reservation', () => {
      const ref = InventoryRequestReference.create('corr-1');
      const req = ReservationRequestReference.create(ref, [
        { ingredientId: 'ing-1', quantity: createQty(5) }
      ], 'order-1');
      expect(req.orderId).toBe('order-1');
    });

    it('should throw if neither order nor production specified', () => {
      const ref = InventoryRequestReference.create('corr-1');
      expect(() => ReservationRequestReference.create(ref, [
        { ingredientId: 'ing-1', quantity: createQty(5) }
      ])).toThrow();
    });
  });

  describe('AllocationReference', () => {
    it('should create valid allocation', () => {
      const ref = InventoryRequestReference.create('corr-1');
      const req = AllocationReference.create(ref, 'prod-1', [
        { ingredientId: 'ing-1', quantity: createQty(5) }
      ]);
      expect(req.productionId).toBe('prod-1');
    });
  });
});
