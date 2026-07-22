import { Recipe } from '../aggregates/recipe.aggregate';
import { RecipeName } from '../value-objects/recipe-name.value-object';
import { RecipeDescription } from '../value-objects/recipe-description.value-object';
import { RecipeCode } from '../value-objects/recipe-code.value-object';
import { RecipeIngredient } from '../entities/recipe-ingredient.entity';
import { RecipeStep } from '../entities/recipe-step.entity';
import { IngredientReference } from '../../../inventory/domain/value-objects/ingredient-reference.value-object';
import { Quantity } from '../../../inventory/domain/value-objects/quantity.value-object';
import { UnitPrecision } from '../../../inventory/domain/value-objects/unit-precision.value-object';
import { UnitOfMeasureEnum } from '../../../inventory/domain/value-objects/unit-of-measure.value-object';
import { PreparationTime } from '../value-objects/preparation-time.value-object';
import { RecipeDomainError } from '../errors/recipe.domain-error';

describe('Recipe Aggregate', () => {
  const createTestRecipe = () => {
    const code = RecipeCode.create('TEST-123');
    const name = RecipeName.create('Test Recipe');
    const desc = RecipeDescription.create('A recipe for testing');
    return Recipe.create('r-1', 'rest-1', code, name, desc);
  };

  const createTestIngredient = (id: string, extId: string) => {
    const ref = IngredientReference.create(extId, 'SYSTEM');
    const qty = Quantity.create(5, UnitPrecision.create(2));
    return RecipeIngredient.create(id, ref, qty, UnitOfMeasureEnum.GRAM);
  };

  const createTestStep = (id: string, num: number) => {
    const pt = PreparationTime.create(15);
    return RecipeStep.create(id, num, 'Step Title', 'Instruction', pt);
  };

  it('should create a valid recipe', () => {
    const recipe = createTestRecipe();
    expect(recipe.id).toBe('r-1');
    expect(recipe.status.isDraft()).toBe(true);
    expect(recipe.version.version).toBe(1);
    
    const events = recipe.domainEvents;
    expect(events).toHaveLength(1);
    expect(events[0].constructor.name).toBe('RecipeCreatedEvent');
  });

  it('should add ingredient correctly', () => {
    const recipe = createTestRecipe();
    const ing = createTestIngredient('i-1', 'ext-1');
    
    recipe.addIngredient(ing);
    
    expect(recipe.ingredients).toHaveLength(1);
  });

  it('should prevent duplicate ingredients', () => {
    const recipe = createTestRecipe();
    const ing1 = createTestIngredient('i-1', 'ext-1');
    const ing2 = createTestIngredient('i-2', 'ext-1'); // Same external ID
    
    recipe.addIngredient(ing1);
    
    expect(() => recipe.addIngredient(ing2))
      .toThrow(RecipeDomainError);
  });

  it('should add steps correctly', () => {
    const recipe = createTestRecipe();
    const step1 = createTestStep('s-1', 1);
    const step2 = createTestStep('s-2', 2);
    
    recipe.addStep(step1);
    recipe.addStep(step2);
    
    expect(recipe.steps).toHaveLength(2);
  });

  it('should prevent duplicate step numbers', () => {
    const recipe = createTestRecipe();
    const step1 = createTestStep('s-1', 1);
    const step2 = createTestStep('s-2', 1); // Same step number
    
    recipe.addStep(step1);
    
    expect(() => recipe.addStep(step2))
      .toThrow(RecipeDomainError);
  });

  it('should sort steps by step number', () => {
    const recipe = createTestRecipe();
    const step2 = createTestStep('s-2', 2);
    const step1 = createTestStep('s-1', 1);
    
    // Add out of order
    recipe.addStep(step2);
    recipe.addStep(step1);
    
    expect(recipe.steps[0].stepNumber).toBe(1);
    expect(recipe.steps[1].stepNumber).toBe(2);
  });

  it('should allow activation if valid', () => {
    const recipe = createTestRecipe();
    recipe.addIngredient(createTestIngredient('i-1', 'ext-1'));
    recipe.addStep(createTestStep('s-1', 1));
    
    recipe.activate();
    
    expect(recipe.status.isActive()).toBe(true);
  });

  it('should prevent activation if missing ingredients', () => {
    const recipe = createTestRecipe();
    recipe.addStep(createTestStep('s-1', 1)); // Missing ingredient
    
    expect(() => recipe.activate()).toThrow();
  });

  it('should prevent activation if missing steps', () => {
    const recipe = createTestRecipe();
    recipe.addIngredient(createTestIngredient('i-1', 'ext-1')); // Missing steps
    
    expect(() => recipe.activate()).toThrow();
  });

  it('should allow archiving', () => {
    const recipe = createTestRecipe();
    recipe.archive();
    expect(recipe.status.isArchived()).toBe(true);
  });
});
