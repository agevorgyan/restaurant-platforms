import { describe, it } from 'node:test';
import * as assert from 'node:assert';
import { RecipeVersion } from './value-objects/recipe-version.value-object';
import { RecipeYield } from './value-objects/recipe-yield.value-object';
import { PortionSize } from './value-objects/portion-size.value-object';
import { IngredientQuantity } from './value-objects/ingredient-quantity.value-object';
import { WasteFactor } from './value-objects/waste-factor.value-object';
import { PreparationLoss } from './value-objects/preparation-loss.value-object';
import { RecipeStatus } from './value-objects/recipe-status.value-object';
import { validateCreateRecipe, validateUpdateRecipe } from '../application/validation/recipe.schema';
import { RecipeDomainService } from './services/recipe.domain.service';
import { IRecipeRepository } from './repositories/recipe.repository.interface';
import { IRecipe } from './entities/recipe.interface';

describe('Recipe Domain', () => {
  describe('Value Objects', () => {
    it('RecipeVersion should validate and auto-increment', () => {
      const v1 = new RecipeVersion(1, 0);
      assert.strictEqual(v1.toString(), '1.0');
      
      const v2 = v1.incrementMinor();
      assert.strictEqual(v2.toString(), '1.1');
      
      const v3 = v2.incrementMajor();
      assert.strictEqual(v3.toString(), '2.0');

      assert.throws(() => new RecipeVersion(0, 0), /Major version must be greater than zero/);
      assert.throws(() => new RecipeVersion(1, -1), /Minor version must be zero or positive/);
    });

    it('RecipeYield should validate amount and unit', () => {
      assert.doesNotThrow(() => new RecipeYield(10, 'Portions'));
      assert.throws(() => new RecipeYield(0, 'Portions'), /Recipe yield amount must be greater than zero/);
      assert.throws(() => new RecipeYield(10, ''), /Recipe yield unit must be specified/);
    });

    it('PortionSize should validate value and unit', () => {
      assert.doesNotThrow(() => new PortionSize(250, 'Gram'));
      assert.throws(() => new PortionSize(-5, 'Gram'), /Portion size must be greater than zero/);
      assert.throws(() => new PortionSize(250, '  '), /Portion unit must be specified/);
    });

    it('IngredientQuantity should be greater than zero', () => {
      assert.doesNotThrow(() => new IngredientQuantity(1.5));
      assert.throws(() => new IngredientQuantity(0), /Ingredient quantity must be greater than zero/);
    });

    it('WasteFactor should be a valid percentage', () => {
      assert.doesNotThrow(() => new WasteFactor(15));
      assert.doesNotThrow(() => new WasteFactor(0));
      assert.throws(() => new WasteFactor(-1), /Waste factor must be between 0 and 100 percent/);
      assert.throws(() => new WasteFactor(101), /Waste factor must be between 0 and 100 percent/);
    });

    it('PreparationLoss should be a valid percentage', () => {
      assert.doesNotThrow(() => new PreparationLoss(10));
      assert.throws(() => new PreparationLoss(105), /Preparation loss must be between 0 and 100 percent/);
    });

    it('RecipeStatus should validate statuses', () => {
      assert.doesNotThrow(() => new RecipeStatus('Draft'));
      assert.doesNotThrow(() => new RecipeStatus('Active'));
      assert.throws(() => new RecipeStatus('Deleted' as any), /Invalid recipe status/);
    });
  });

  describe('Validation', () => {
    it('should validate CreateRecipeDto', () => {
      const errors = validateCreateRecipe({
        restaurantId: '',
        menuItemId: '',
        name: '   ',
        yieldAmount: 0,
        yieldUnit: '',
        portionSizeValue: 0,
        portionSizeUnit: '',
        ingredients: []
      });
      assert.strictEqual(errors.includes('restaurantId is required'), true);
      assert.strictEqual(errors.includes('menuItemId is required'), true);
      assert.strictEqual(errors.includes('Recipe name must not be empty'), true);
      assert.strictEqual(errors.includes('Yield amount must be greater than zero'), true);
      assert.strictEqual(errors.includes('Portion size value must be greater than zero'), true);
      assert.strictEqual(errors.includes('Recipe must contain at least one ingredient'), true);
    });

    it('should prevent duplicate ingredients in DTO', () => {
      const errors = validateCreateRecipe({
        restaurantId: 'r1',
        menuItemId: 'm1',
        name: 'Burger',
        yieldAmount: 1,
        yieldUnit: 'Portion',
        portionSizeValue: 300,
        portionSizeUnit: 'Gram',
        ingredients: [
          { ingredientId: 'ing1', quantity: 1, unitOfMeasure: 'Piece', wasteFactor: 0, optional: false, substituteIngredientIds: [] },
          { ingredientId: 'ing1', quantity: 2, unitOfMeasure: 'Piece', wasteFactor: 0, optional: false, substituteIngredientIds: [] }
        ]
      });
      assert.strictEqual(errors.includes('Duplicate ingredients are not allowed within the same recipe'), true);
    });
    
    it('should validate UpdateRecipeDto', () => {
      const errors = validateUpdateRecipe({
        name: '  ',
        ingredients: [{ ingredientId: '', quantity: 0, unitOfMeasure: '', wasteFactor: -1, optional: false, substituteIngredientIds: null as any }]
      });
      assert.strictEqual(errors.includes('Recipe name must not be empty'), true);
      assert.strictEqual(errors.includes('Ingredient [0]: ingredientId is required'), true);
      assert.strictEqual(errors.includes('Ingredient [0]: quantity must be greater than zero'), true);
      assert.strictEqual(errors.includes('Ingredient [0]: wasteFactor must be between 0 and 100'), true);
    });
  });

  describe('Domain Service', () => {
    let mockRecipe: IRecipe;
    let findActiveResult: IRecipe | null = null;

    const mockRepo: IRecipeRepository = {
      findById: async () => mockRecipe,
      findActiveByMenuItemId: async () => findActiveResult,
      save: async (rec) => { mockRecipe = rec; }
    };

    it('should create recipe in Draft state at version 1.0', async () => {
      const service = new RecipeDomainService(mockRepo);
      const recipe = await service.createRecipe('rec1', {
        restaurantId: 'r1',
        menuItemId: 'm1',
        name: 'Burger Recipe',
        yieldAmount: 1,
        yieldUnit: 'Portion',
        portionSizeValue: 300,
        portionSizeUnit: 'Gram',
        ingredients: [
          { ingredientId: 'ing1', quantity: 1, unitOfMeasure: 'Piece', wasteFactor: 0, optional: false, substituteIngredientIds: [] }
        ]
      });

      assert.strictEqual(recipe.id, 'rec1');
      assert.strictEqual(recipe.version.toString(), '1.0');
      assert.strictEqual(recipe.status.value, 'Draft');
    });

    it('should increment minor version on update', async () => {
      const service = new RecipeDomainService(mockRepo);
      const updated = await service.updateRecipe('rec1', { name: 'Updated Burger Recipe' });
      assert.strictEqual(updated.version.toString(), '1.1');
      assert.strictEqual(updated.name, 'Updated Burger Recipe');
    });

    it('should allow only one active recipe per menu item', async () => {
      const service = new RecipeDomainService(mockRepo);
      
      // Simulate another active recipe exists for this menu item
      findActiveResult = { id: 'rec2', menuItemId: 'm1' } as any;

      try {
        await service.activateRecipe('rec1');
        assert.fail('Should throw ConflictException');
      } catch (e: any) {
        assert.strictEqual(e.message, 'Menu item m1 already has an active recipe');
      }

      // If no other active recipe exists, it should activate
      findActiveResult = null;
      await service.activateRecipe('rec1');
      assert.strictEqual(mockRecipe.status.isActive(), true);
    });

    it('should only allow Active recipes for production', async () => {
      const service = new RecipeDomainService(mockRepo);
      assert.doesNotThrow(async () => await service.useForProduction('rec1'));

      await service.archiveRecipe('rec1');
      try {
        await service.useForProduction('rec1');
        assert.fail('Should throw');
      } catch (e: any) {
        assert.strictEqual(e.message, 'Only Active recipes may be used for production');
      }
    });

    it('should prevent updates to archived recipes', async () => {
      const service = new RecipeDomainService(mockRepo);
      try {
        await service.updateRecipe('rec1', { name: 'New' });
        assert.fail('Should throw');
      } catch (e: any) {
        assert.strictEqual(e.message, 'Archived recipes are read-only');
      }
    });
  });
});
