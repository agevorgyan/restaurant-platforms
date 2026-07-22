import { ProductionIngredient } from '../entities/production-ingredient.entity';
import { ProductionOutput } from '../entities/production-output.entity';
import { ProductionStepExecution } from '../entities/production-step-execution.entity';
import { ProductionQualityCheck } from '../entities/production-quality-check.entity';
import { ProductionTimeline } from '../entities/production-timeline.entity';
import { IngredientReference } from '../../../inventory/domain/value-objects/ingredient-reference.value-object';
import { PlannedQuantity } from '../value-objects/planned-quantity.value-object';
import { ProducedQuantity } from '../value-objects/produced-quantity.value-object';
import { Quantity } from '../../../inventory/domain/value-objects/quantity.value-object';
import { UnitPrecision } from '../../../inventory/domain/value-objects/unit-precision.value-object';
import { FinishedProductReference } from '../value-objects/finished-product-reference.value-object';
import { ProductionStatus } from '../enums/production-status.enum';
import { ProductionQualityStatus } from '../enums/production-quality-status.enum';

describe('Production Entities', () => {
  describe('ProductionIngredient', () => {
    it('should create and consume', () => {
      const ref = IngredientReference.create('ing-1', 'CODE');
      const pq = PlannedQuantity.create(Quantity.create(10, UnitPrecision.create(2)));
      const entity = ProductionIngredient.create('id', ref, pq);

      expect(entity.consumedQuantity.value).toBe(0);
      entity.consume(Quantity.create(5, UnitPrecision.create(2)));
      expect(entity.consumedQuantity.value).toBe(5);
    });

    it('should throw on negative waste', () => {
      const ref = IngredientReference.create('ing-1', 'CODE');
      const pq = PlannedQuantity.create(Quantity.create(10, UnitPrecision.create(2)));
      const entity = ProductionIngredient.create('id', ref, pq);

      expect(() => entity.recordWaste(Quantity.create(-1, UnitPrecision.create(2)))).toThrow();
    });
  });

  describe('ProductionOutput', () => {
    it('should create and update quality', () => {
      const ref = FinishedProductReference.create('fp-1');
      const pq = ProducedQuantity.create(Quantity.create(5, UnitPrecision.create(0)));
      const entity = ProductionOutput.create('id', ref, pq);

      expect(entity.qualityStatus).toBe(ProductionQualityStatus.PENDING_INSPECTION);
      entity.updateQualityStatus(ProductionQualityStatus.APPROVED);
      expect(entity.qualityStatus).toBe(ProductionQualityStatus.APPROVED);
    });
  });

  describe('ProductionStepExecution', () => {
    it('should track execution', () => {
      const entity = ProductionStepExecution.create('id', 'step-1');
      expect(entity.status).toBe(ProductionStatus.PLANNED);

      entity.start('USER-1');
      expect(entity.status).toBe(ProductionStatus.IN_PROGRESS);
      expect(entity.startedAt).toBeDefined();

      entity.complete('Done');
      expect(entity.status).toBe(ProductionStatus.COMPLETED);
      expect(entity.completedAt).toBeDefined();
    });
  });

  describe('ProductionQualityCheck', () => {
    it('should create check', () => {
      const entity = ProductionQualityCheck.create('id', ProductionQualityStatus.APPROVED, 'INSPECTOR-1');
      expect(entity.status).toBe(ProductionQualityStatus.APPROVED);
      expect(entity.inspectorId).toBe('INSPECTOR-1');
    });
  });

  describe('ProductionTimeline', () => {
    it('should create timeline event', () => {
      const entity = ProductionTimeline.create('id', ProductionStatus.SCHEDULED, 'SYSTEM', 'Scheduled');
      expect(entity.status).toBe(ProductionStatus.SCHEDULED);
    });
  });
});
