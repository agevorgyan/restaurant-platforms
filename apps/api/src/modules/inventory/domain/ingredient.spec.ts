import { describe, it } from 'node:test';
import * as assert from 'node:assert';
import { IngredientCode } from './value-objects/ingredient-code.value-object';
import { IngredientCategory } from './value-objects/ingredient-category.value-object';
import { UnitOfMeasure } from './value-objects/unit-of-measure.value-object';
import { StorageCondition } from './value-objects/storage-condition.value-object';
import { ShelfLife } from './value-objects/shelf-life.value-object';
import { AllergenInformation } from './value-objects/allergen-information.value-object';
import { IngredientStatus } from './value-objects/ingredient-status.value-object';
import { validateCreateIngredient, validateUpdateIngredient } from '../application/validation/ingredient.schema';
import { IngredientDomainService } from './services/ingredient.domain.service';
import { IIngredientRepository } from './repositories/ingredient.repository.interface';
import { IIngredient } from './entities/ingredient.interface';

describe('Ingredient Domain', () => {
  describe('Value Objects', () => {
    it('IngredientCode should not be empty', () => {
      assert.doesNotThrow(() => new IngredientCode('ING01'));
      assert.throws(() => new IngredientCode(''), /Ingredient code must not be empty/);
    });

    it('IngredientCategory should validate categories', () => {
      assert.doesNotThrow(() => new IngredientCategory('Meat'));
      assert.doesNotThrow(() => new IngredientCategory('Vegetable'));
      assert.throws(() => new IngredientCategory('Invalid' as any), /Invalid ingredient category/);
    });

    it('UnitOfMeasure should validate units', () => {
      assert.doesNotThrow(() => new UnitOfMeasure('Kilogram'));
      assert.doesNotThrow(() => new UnitOfMeasure('Liter'));
      assert.throws(() => new UnitOfMeasure('Gallon' as any), /Invalid unit of measure/);
    });

    it('StorageCondition should validate conditions', () => {
      assert.doesNotThrow(() => new StorageCondition('Frozen'));
      assert.throws(() => new StorageCondition('Hot' as any), /Invalid storage condition/);
    });

    it('ShelfLife should be greater than zero', () => {
      assert.doesNotThrow(() => new ShelfLife(30));
      assert.throws(() => new ShelfLife(0), /Shelf life must be greater than zero/);
      assert.throws(() => new ShelfLife(-5), /Shelf life must be greater than zero/);
    });

    it('AllergenInformation should handle arrays', () => {
      const allergens = new AllergenInformation(['Dairy', 'Nut']);
      assert.strictEqual(allergens.hasAllergen('Dairy'), true);
      assert.strictEqual(allergens.hasAllergen('Fish'), false);
      assert.throws(() => new AllergenInformation('Dairy' as any), /Allergens must be an array of strings/);
    });

    it('IngredientStatus should validate statuses', () => {
      assert.doesNotThrow(() => new IngredientStatus('Draft'));
      assert.doesNotThrow(() => new IngredientStatus('Active'));
      assert.throws(() => new IngredientStatus('Deleted' as any), /Invalid ingredient status/);
    });
  });

  describe('Validation', () => {
    it('should validate CreateIngredientDto', () => {
      const errors = validateCreateIngredient({
        restaurantId: '',
        ingredientCode: '',
        name: '   ',
        category: '',
        unitOfMeasure: '',
        defaultStorageCondition: '',
        defaultShelfLife: 0
      });
      assert.strictEqual(errors.includes('restaurantId is required'), true);
      assert.strictEqual(errors.includes('Ingredient code must not be empty'), true);
      assert.strictEqual(errors.includes('Ingredient name must not be empty'), true);
      assert.strictEqual(errors.includes('category is required'), true);
      assert.strictEqual(errors.includes('unitOfMeasure is required'), true);
      assert.strictEqual(errors.includes('defaultStorageCondition is required'), true);
      assert.strictEqual(errors.includes('Shelf life must be greater than zero'), true);
    });

    it('should validate UpdateIngredientDto', () => {
      const errors = validateUpdateIngredient({ name: '   ', defaultShelfLife: -1, allergens: 'Nut' as any });
      assert.strictEqual(errors.includes('Ingredient name must not be empty'), true);
      assert.strictEqual(errors.includes('Shelf life must be greater than zero'), true);
      assert.strictEqual(errors.includes('Allergens must be an array of strings'), true);
    });
  });

  describe('Domain Service', () => {
    let mockIngredient: IIngredient;
    let findByBarcodeResult: IIngredient | null = null;
    let findByCodeResult: IIngredient | null = null;
    
    const mockRepo: IIngredientRepository = {
      findById: async () => mockIngredient,
      findByCodeAndRestaurantId: async () => findByCodeResult,
      findByBarcode: async () => findByBarcodeResult,
      save: async (ing) => { mockIngredient = ing; }
    };

    it('should create ingredient in Draft state', async () => {
      findByCodeResult = null;
      findByBarcodeResult = null;
      const service = new IngredientDomainService(mockRepo);
      const ingredient = await service.createIngredient('ing1', {
        restaurantId: 'r1',
        ingredientCode: 'C01',
        name: 'Chicken Breast',
        category: 'Poultry',
        unitOfMeasure: 'Kilogram',
        defaultStorageCondition: 'Refrigerated',
        defaultShelfLife: 7
      });

      assert.strictEqual(ingredient.id, 'ing1');
      assert.strictEqual(ingredient.status.value, 'Draft');
      assert.strictEqual(ingredient.status.isActive(), false);
    });

    it('should prevent duplicate codes on creation', async () => {
      findByCodeResult = mockIngredient; // simulate existing
      const service = new IngredientDomainService(mockRepo);
      try {
        await service.createIngredient('ing2', {
          restaurantId: 'r1',
          ingredientCode: 'C01',
          name: 'Chicken Leg',
          category: 'Poultry',
          unitOfMeasure: 'Kilogram',
          defaultStorageCondition: 'Refrigerated',
          defaultShelfLife: 7
        });
        assert.fail('Should throw ConflictException');
      } catch (e: any) {
        assert.strictEqual(e.message, "Ingredient code 'C01' already exists in this restaurant");
      }
    });

    it('should allow using in recipes only when active', async () => {
      findByCodeResult = null;
      const service = new IngredientDomainService(mockRepo);
      mockIngredient.status = new IngredientStatus('Draft'); // Ensure draft

      try {
        await service.useInRecipe('ing1');
        assert.fail('Should throw ConflictException');
      } catch (e: any) {
        assert.strictEqual(e.message, 'Only Active ingredients can be used in recipes');
      }

      await service.activateIngredient('ing1');
      assert.doesNotThrow(async () => await service.useInRecipe('ing1'));
    });

    it('should prevent updates to archived ingredients', async () => {
      const service = new IngredientDomainService(mockRepo);
      await service.archiveIngredient('ing1');

      try {
        await service.updateIngredient('ing1', { name: 'New Name' });
        assert.fail('Should throw ConflictException');
      } catch (e: any) {
        assert.strictEqual(e.message, 'Archived ingredients are read-only');
      }
    });
  });
});
