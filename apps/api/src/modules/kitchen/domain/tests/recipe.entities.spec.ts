import { IngredientReference } from '../../../inventory/domain/value-objects/ingredient-reference.value-object';
import { Quantity } from '../../../inventory/domain/value-objects/quantity.value-object';
import { UnitOfMeasureEnum } from '../../../inventory/domain/value-objects/unit-of-measure.value-object';
import { RecipeIngredient } from '../entities/recipe-ingredient.entity';
import { RecipeStep } from '../entities/recipe-step.entity';
import { RecipeYield, YieldType } from '../entities/recipe-yield.entity';
import { RecipeInstruction } from '../entities/recipe-instruction.entity';
import { RecipeEquipment } from '../entities/recipe-equipment.entity';
import { RecipeVersionHistory } from '../entities/recipe-version-history.entity';
import { PreparationTime } from '../value-objects/preparation-time.value-object';
import { StationReference } from '../value-objects/station-reference.value-object';
import { RecipeYieldQuantity } from '../value-objects/recipe-yield-quantity.value-object';
import { PortionSize } from '../value-objects/portion-size.value-object';
import { RecipeVersion } from '../value-objects/recipe-version.value-object';
import { UnitPrecision } from '../../../inventory/domain/value-objects/unit-precision.value-object';

describe('Recipe Entities', () => {
  describe('RecipeIngredient', () => {
    it('should create valid ingredient', () => {
      const ref = IngredientReference.create('ext-123', 'SYSTEM');
      const qty = Quantity.create(5, UnitPrecision.create(2));
      const ing = RecipeIngredient.create('id', ref, qty, UnitOfMeasureEnum.GRAM, false, 10);
      
      expect(ing.quantity.value).toBe(5);
      expect(ing.wastePercentage).toBe(10);
    });

    it('should throw if quantity is 0 or less', () => {
      const ref = IngredientReference.create('ext-123', 'SYSTEM');
      const qty = Quantity.create(0, UnitPrecision.create(2));
      expect(() => RecipeIngredient.create('id', ref, qty, UnitOfMeasureEnum.GRAM))
        .toThrow('Ingredient quantity must be greater than zero');
    });

    it('should throw if waste percentage is invalid', () => {
      const ref = IngredientReference.create('ext-123', 'SYSTEM');
      const qty = Quantity.create(5, UnitPrecision.create(2));
      expect(() => RecipeIngredient.create('id', ref, qty, UnitOfMeasureEnum.GRAM, false, 150))
        .toThrow('Waste percentage must be between 0 and 100');
    });
  });

  describe('RecipeStep', () => {
    it('should create a valid step', () => {
      const pt = PreparationTime.create(15);
      const st = StationReference.create('st-1', 'Grill');
      const step = RecipeStep.create('id', 1, 'Prep', 'Cut onions', pt, st);

      expect(step.stepNumber).toBe(1);
      expect(step.title).toBe('Prep');
    });

    it('should update instruction', () => {
      const pt = PreparationTime.create(15);
      const step = RecipeStep.create('id', 1, 'Prep', 'Cut onions', pt);
      step.updateInstruction('Cut onions finely');
      expect(step.instruction).toBe('Cut onions finely');
    });

    it('should throw on negative step number', () => {
      const pt = PreparationTime.create(15);
      expect(() => RecipeStep.create('id', -1, 'Prep', 'Cut onions', pt))
        .toThrow('Step number must be greater than zero');
    });
  });

  describe('RecipeYield', () => {
    it('should create valid yield', () => {
      const yq = RecipeYieldQuantity.create(1);
      const ps = PortionSize.create(250, 'g');
      const y = RecipeYield.create('id', YieldType.SINGLE_PORTION, yq, ps);
      expect(y.yieldType).toBe(YieldType.SINGLE_PORTION);
    });

    it('should throw if single portion quantity is not 1', () => {
      const yq = RecipeYieldQuantity.create(5);
      const ps = PortionSize.create(250, 'g');
      expect(() => RecipeYield.create('id', YieldType.SINGLE_PORTION, yq, ps))
        .toThrow('Single portion yield must have a quantity of 1');
    });
  });

  describe('RecipeInstruction', () => {
    it('should throw on empty content', () => {
      expect(() => RecipeInstruction.create('id', '')).toThrow('Instruction content cannot be empty');
    });
  });

  describe('RecipeEquipment', () => {
    it('should throw on empty name', () => {
      expect(() => RecipeEquipment.create('id', '')).toThrow('Equipment name cannot be empty');
    });
  });

  describe('RecipeVersionHistory', () => {
    it('should create valid history entry', () => {
      const v = RecipeVersion.create(2);
      const h = RecipeVersionHistory.create('id', v, 'Changed salt amount', 'author-1');
      expect(h.version.version).toBe(2);
    });
  });
});
