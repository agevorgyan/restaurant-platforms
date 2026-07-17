import { describe, it } from 'node:test';
import * as assert from 'node:assert';
import { KitchenStationStatus } from './kitchen-station-status.value-object';
import { KitchenStationCapacity } from './kitchen-station-capacity.value-object';
import { KitchenStationType } from './kitchen-station-type.value-object';

describe('Kitchen Station Domain', () => {
  describe('KitchenStationStatus', () => {
    it('should create valid statuses', () => {
      assert.doesNotThrow(() => new KitchenStationStatus('Active'));
      assert.doesNotThrow(() => new KitchenStationStatus('Inactive'));
      assert.doesNotThrow(() => new KitchenStationStatus('Maintenance'));
    });

    it('should throw on invalid status', () => {
      assert.throws(() => new KitchenStationStatus('Invalid' as any), /Invalid station status/);
    });

    it('should correctly determine if it can receive tickets', () => {
      assert.strictEqual(new KitchenStationStatus('Active').canReceiveTickets(), true);
      assert.strictEqual(new KitchenStationStatus('Inactive').canReceiveTickets(), false);
      assert.strictEqual(new KitchenStationStatus('Maintenance').canReceiveTickets(), false);
    });

    it('should correctly determine routing participation', () => {
      assert.strictEqual(new KitchenStationStatus('Active').participatesInRouting(), true);
      assert.strictEqual(new KitchenStationStatus('Maintenance').participatesInRouting(), false);
    });
  });

  describe('KitchenStationCapacity', () => {
    it('should create valid capacity', () => {
      assert.doesNotThrow(() => new KitchenStationCapacity(5));
      assert.doesNotThrow(() => new KitchenStationCapacity(100));
    });

    it('should throw if capacity is zero or negative', () => {
      assert.throws(() => new KitchenStationCapacity(0), /Capacity must be greater than zero/);
      assert.throws(() => new KitchenStationCapacity(-5), /Capacity must be greater than zero/);
    });

    it('should throw if capacity is not an integer', () => {
      assert.throws(() => new KitchenStationCapacity(5.5), /Capacity must be an integer/);
    });
  });

  describe('KitchenStationType', () => {
    it('should create valid station types', () => {
      assert.doesNotThrow(() => new KitchenStationType('Grill'));
      assert.doesNotThrow(() => new KitchenStationType('Pizza'));
      assert.doesNotThrow(() => new KitchenStationType('Custom'));
    });

    it('should throw on invalid station type', () => {
      assert.throws(() => new KitchenStationType('Invalid' as any), /Invalid station type/);
    });
  });
});
