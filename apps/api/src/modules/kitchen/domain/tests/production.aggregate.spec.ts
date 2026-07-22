import { Production } from '../aggregates/production.aggregate';
import { ProductionNumber } from '../value-objects/production-number.value-object';
import { RecipeReference } from '../value-objects/recipe-reference.value-object';
import { ProductionType } from '../enums/production-type.enum';
import { ProductionIngredient } from '../entities/production-ingredient.entity';
import { IngredientReference } from '../../../inventory/domain/value-objects/ingredient-reference.value-object';
import { PlannedQuantity } from '../value-objects/planned-quantity.value-object';
import { Quantity } from '../../../inventory/domain/value-objects/quantity.value-object';
import { UnitPrecision } from '../../../inventory/domain/value-objects/unit-precision.value-object';
import { ProductionDomainError } from '../errors/production.domain-error';

describe('Production Aggregate', () => {
  const createTestIngredient = (id: string, ingredientId: string) => {
    const ref = IngredientReference.create(ingredientId, 'CODE');
    const pq = PlannedQuantity.create(Quantity.create(10, UnitPrecision.create(2)));
    return ProductionIngredient.create(id, ref, pq);
  };

  const createTestProduction = () => {
    const num = ProductionNumber.create('PROD-100');
    const rr = RecipeReference.create('r-1', 'CODE', 'Name');
    return Production.create(
      'prod-1',
      num,
      rr,
      ProductionType.MANUFACTURING,
      [createTestIngredient('pi-1', 'ing-1')]
    );
  };

  it('should create valid production', () => {
    const production = createTestProduction();
    expect(production.status.isPlanned()).toBe(true);
    expect(production.ingredients).toHaveLength(1);
    expect(production.timeline).toHaveLength(1);
    expect(production.domainEvents[0].constructor.name).toBe('ProductionCreatedEvent');
  });

  it('should transition through lifecycle', () => {
    const production = createTestProduction();
    
    production.schedule('SYSTEM');
    expect(production.status.isScheduled()).toBe(true);
    
    production.startExecution('USER-1');
    expect(production.status.isInProgress()).toBe(true);
    
    production.pauseExecution('USER-1', 'Missing items');
    expect(production.status.isPaused()).toBe(true);
    
    production.startExecution('USER-1'); // resume
    expect(production.status.isInProgress()).toBe(true);

    production.completeExecution('USER-1');
    expect(production.status.isCompleted()).toBe(true);
  });

  it('should prevent invalid transitions', () => {
    const production = createTestProduction(); // PLANNED
    
    expect(() => production.startExecution('USER-1'))
      .toThrow(ProductionDomainError); // Must be SCHEDULED
      
    expect(() => production.completeExecution('USER-1'))
      .toThrow(ProductionDomainError); // Must be IN_PROGRESS
  });

  it('should allow cancellation', () => {
    const production = createTestProduction();
    production.schedule('SYSTEM');
    
    production.cancel('MANAGER', 'Not needed');
    expect(production.status.isCancelled()).toBe(true);
  });

  it('should prevent creation without ingredients', () => {
    const num = ProductionNumber.create('PROD-100');
    const rr = RecipeReference.create('r-1', 'CODE', 'Name');
    
    expect(() => Production.create('prod-1', num, rr, ProductionType.MANUFACTURING, []))
      .toThrow();
  });

  it('should prevent creation with duplicate ingredients', () => {
    const num = ProductionNumber.create('PROD-100');
    const rr = RecipeReference.create('r-1', 'CODE', 'Name');
    const ing1 = createTestIngredient('pi-1', 'ing-1');
    const ing2 = createTestIngredient('pi-2', 'ing-1');
    
    expect(() => Production.create('prod-1', num, rr, ProductionType.MANUFACTURING, [ing1, ing2]))
      .toThrow();
  });
});
