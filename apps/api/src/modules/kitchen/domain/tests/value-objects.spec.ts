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

import { ProductionNumber } from '../value-objects/production-number.value-object';
import { ProductionReference } from '../value-objects/production-reference.value-object';
import { ProductionStatus } from '../value-objects/production-status.value-object';
import { ProductionStatus as ProductionStatusEnum } from '../enums/production-status.enum';
import { ProductionType } from '../value-objects/production-type.value-object';
import { ProductionType as ProductionTypeEnum } from '../enums/production-type.enum';
import { PlannedQuantity } from '../value-objects/planned-quantity.value-object';
import { Quantity } from '../../../inventory/domain/value-objects/quantity.value-object';
import { UnitPrecision } from '../../../inventory/domain/value-objects/unit-precision.value-object';

import { WorkflowRequest } from '../value-objects/workflow-request.value-object';
import { WorkflowResult } from '../value-objects/workflow-result.value-object';
import { AssignmentPlan } from '../value-objects/assignment-plan.value-object';
import { QueueSnapshot } from '../value-objects/queue-snapshot.value-object';
import { EstimatedCompletionTime } from '../value-objects/estimated-completion-time.value-object';

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

  describe('ProductionNumber', () => {
    it('should create valid number', () => {
      expect(ProductionNumber.create('PROD-100').value).toBe('PROD-100');
    });
    it('should throw on empty', () => {
      expect(() => ProductionNumber.create('')).toThrow();
    });
  });

  describe('ProductionReference', () => {
    it('should create valid reference', () => {
      expect(ProductionReference.create('prod-1').productionId).toBe('prod-1');
    });
  });

  describe('ProductionStatus', () => {
    it('should handle transitions correctly', () => {
      const status = ProductionStatus.create(ProductionStatusEnum.PLANNED);
      expect(status.canTransitionTo(ProductionStatusEnum.SCHEDULED)).toBe(true);
      expect(status.canTransitionTo(ProductionStatusEnum.COMPLETED)).toBe(false);
    });
  });

  describe('ProductionType', () => {
    it('should create valid type', () => {
      expect(ProductionType.create(ProductionTypeEnum.MANUFACTURING).value).toBe(ProductionTypeEnum.MANUFACTURING);
    });
  });

  describe('PlannedQuantity', () => {
    it('should create valid planned quantity', () => {
      const qty = Quantity.create(10, UnitPrecision.create(2));
      expect(PlannedQuantity.create(qty).quantity.value).toBe(10);
    });
    it('should throw on negative quantity', () => {
      expect(() => Quantity.create(-5, UnitPrecision.create(2))).toThrow();
    });
  });

  describe('WorkflowRequest', () => {
    it('should create valid request', () => {
      const request = WorkflowRequest.create('SYSTEM', 'ticket-1');
      expect(request.kitchenTicketId).toBe('ticket-1');
      expect(request.triggeredBy).toBe('SYSTEM');
    });
    it('should throw if no IDs provided', () => {
      expect(() => WorkflowRequest.create('SYSTEM')).toThrow();
    });
  });

  describe('WorkflowResult', () => {
    it('should create success result', () => {
      const result = WorkflowResult.success('Done');
      expect(result.success).toBe(true);
      expect(result.message).toBe('Done');
    });
    it('should create failure result', () => {
      const result = WorkflowResult.failure('Error', ['msg']);
      expect(result.success).toBe(false);
      expect(result.errors).toContain('msg');
    });
  });

  describe('AssignmentPlan', () => {
    it('should create valid plan', () => {
      const plan = AssignmentPlan.create([{ itemId: 'i-1', stationId: 's-1' }]);
      expect(plan.mappings).toHaveLength(1);
    });
    it('should throw on empty mappings', () => {
      expect(() => AssignmentPlan.create([])).toThrow();
    });
  });

  describe('QueueSnapshot', () => {
    it('should create valid snapshot', () => {
      const snapshot = QueueSnapshot.create('s-1', [{ id: 'i-1', priorityValue: 1, enteredAt: new Date() }]);
      expect(snapshot.getDepth()).toBe(1);
    });
  });

  describe('EstimatedCompletionTime', () => {
    it('should create valid estimated time from now', () => {
      const time = EstimatedCompletionTime.fromNow(10);
      expect(time.estimatedAt).toBeInstanceOf(Date);
    });
    it('should throw on negative minutes', () => {
      expect(() => EstimatedCompletionTime.fromNow(-5)).toThrow();
    });
  });
});
