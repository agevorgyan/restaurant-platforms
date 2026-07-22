import { KitchenId } from '../value-objects/kitchen-id.value-object';
import { StationReference } from '../value-objects/station-reference.value-object';
import { KitchenVersion } from '../value-objects/kitchen-version.value-object';

import { RecipeName } from '../value-objects/recipe-name.value-object';
import { RecipeCode } from '../value-objects/recipe-code.value-object';

import { KitchenTicketNumber } from '../value-objects/kitchen-ticket-number.value-object';
import { KitchenTicketReference } from '../value-objects/kitchen-ticket-reference.value-object';
import { KitchenTicketStatus } from '../value-objects/kitchen-ticket-status.value-object';
import { KitchenTicketStatus as KitchenTicketStatusEnum } from '../enums/kitchen-ticket-status.enum';
import { KitchenEstimatedPreparationTime } from '../value-objects/kitchen-estimated-preparation-time.value-object';

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

  describe('RecipeName', () => {
    it('should create valid name', () => {
      expect(RecipeName.create('Pasta').value).toBe('Pasta');
    });
    it('should throw on empty name', () => {
      expect(() => RecipeName.create('')).toThrow();
    });
  });

  describe('RecipeCode', () => {
    it('should create valid code', () => {
      expect(RecipeCode.create('PASTA-01').value).toBe('PASTA-01');
    });
    it('should format code to uppercase', () => {
      expect(RecipeCode.create('pasta-01').value).toBe('PASTA-01');
    });
    it('should throw on invalid characters', () => {
      expect(() => RecipeCode.create('PASTA!@#')).toThrow();
    });
  });

  describe('KitchenTicketNumber', () => {
    it('should create valid number', () => {
      expect(KitchenTicketNumber.create('TKT-100').value).toBe('TKT-100');
    });
    it('should throw on empty', () => {
      expect(() => KitchenTicketNumber.create('')).toThrow();
    });
  });

  describe('KitchenTicketReference', () => {
    it('should create valid reference', () => {
      expect(KitchenTicketReference.create('tkt-1').ticketId).toBe('tkt-1');
    });
  });

  describe('KitchenTicketStatus', () => {
    it('should handle transitions correctly', () => {
      const status = KitchenTicketStatus.create(KitchenTicketStatusEnum.PENDING);
      expect(status.canTransitionTo(KitchenTicketStatusEnum.QUEUED)).toBe(true);
      expect(status.canTransitionTo(KitchenTicketStatusEnum.READY)).toBe(false);
    });
  });

  describe('KitchenEstimatedPreparationTime', () => {
    it('should create valid time', () => {
      expect(KitchenEstimatedPreparationTime.create(15).minutes).toBe(15);
    });
    it('should throw on negative time', () => {
      expect(() => KitchenEstimatedPreparationTime.create(-5)).toThrow();
    });
  });
});
