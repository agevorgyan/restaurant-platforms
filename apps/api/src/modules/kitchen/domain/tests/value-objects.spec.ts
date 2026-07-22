import { KitchenId } from '../value-objects/kitchen-id.value-object';
import { StationReference } from '../value-objects/station-reference.value-object';
import { KitchenVersion } from '../value-objects/kitchen-version.value-object';

describe('Kitchen Value Objects', () => {
  describe('KitchenId', () => {
    it('should create with auto-generated id if not provided', () => {
      const id = KitchenId.create();
      expect(id.value).toBeDefined();
    });

    it('should create with provided id', () => {
      const id = KitchenId.create('kitchen-123');
      expect(id.value).toBe('kitchen-123');
    });
  });

  describe('StationReference', () => {
    it('should throw if name is empty', () => {
      expect(() => StationReference.create('st-1', '')).toThrow('Station name cannot be empty');
    });

    it('should create valid reference', () => {
      const ref = StationReference.create('st-1', 'Grill Station');
      expect(ref.stationId).toBe('st-1');
      expect(ref.name).toBe('Grill Station');
    });
  });

  describe('KitchenVersion', () => {
    it('should start at version 1 by default', () => {
      const v = KitchenVersion.create();
      expect(v.version).toBe(1);
    });

    it('should increment version', () => {
      const v = KitchenVersion.create();
      const nextV = v.increment();
      expect(nextV.version).toBe(2);
    });
  });
});
