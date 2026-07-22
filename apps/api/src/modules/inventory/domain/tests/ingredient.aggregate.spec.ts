import { Ingredient } from '../aggregates/ingredient.aggregate';
import { IngredientName } from '../value-objects/ingredient-name.value-object';
import { IngredientDescription } from '../value-objects/ingredient-description.value-object';
import { IngredientType, IngredientTypeEnum } from '../value-objects/ingredient-type.value-object';
import { IngredientCategory, IngredientCategoryType } from '../value-objects/ingredient-category.value-object';
import { SKU } from '../value-objects/sku.value-object';
import { IngredientCode } from '../value-objects/ingredient-code.value-object';
import { UnitOfMeasure, UnitOfMeasureEnum } from '../value-objects/unit-of-measure.value-object';
import { IngredientStatusEnum } from '../value-objects/ingredient-status.value-object';
import { IngredientSupplier } from '../entities/ingredient-supplier.entity';
import { IngredientAllergen, AllergenSeverityEnum } from '../entities/ingredient-allergen.entity';
import { IngredientStorageRule, StorageRuleTypeEnum } from '../entities/ingredient-storage-rule.entity';
import { IngredientLifecyclePolicy } from '../policies/ingredient-lifecycle.policy';
import { IngredientCreatedEvent, IngredientUpdatedEvent, IngredientActivatedEvent, IngredientArchivedEvent } from '../events/ingredient.events';

describe('Ingredient Aggregate', () => {
  const defaultProps = {
    id: 'ing_123',
    restaurantId: 'rest_456',
    ingredientCode: IngredientCode.create('ING-01'),
    sku: SKU.create('SKU-12345'),
    name: IngredientName.create('Flour'),
    description: IngredientDescription.create('All-purpose flour'),
    type: IngredientType.create(IngredientTypeEnum.RAW_MATERIAL),
    category: new IngredientCategory('Flour' as IngredientCategoryType),
  };

  it('should create an ingredient in DRAFT state', () => {
    const ingredient = Ingredient.create(defaultProps);

    expect(ingredient.id).toBe('ing_123');
    expect(ingredient.status.value).toBe(IngredientStatusEnum.DRAFT);
    expect(ingredient.version.value).toBe(1);
    
    const events = ingredient.domainEvents;
    expect(events.length).toBe(1);
    expect(events[0]).toBeInstanceOf(IngredientCreatedEvent);
  });

  it('should update details and increment version', () => {
    const ingredient = Ingredient.create(defaultProps);
    ingredient.clearEvents();

    ingredient.updateDetails(
      IngredientName.create('Whole Wheat Flour'),
      IngredientDescription.create('Healthy flour'),
      new IngredientCategory('Flour' as IngredientCategoryType)
    );

    expect(ingredient.name.value).toBe('Whole Wheat Flour');
    expect(ingredient.version.value).toBe(2);
    
    const events = ingredient.domainEvents;
    expect(events.length).toBe(1);
    expect(events[0]).toBeInstanceOf(IngredientUpdatedEvent);
  });

  describe('Suppliers', () => {
    it('should add a supplier', () => {
      const ingredient = Ingredient.create(defaultProps);
      const supplier = IngredientSupplier.create({
        id: 'sup_1',
        ingredientId: ingredient.id,
        supplierId: 'vendor_1',
        isPreferred: true
      });

      ingredient.addSupplier(supplier);
      expect(ingredient.suppliers.length).toBe(1);
      expect(ingredient.version.value).toBe(2);
    });

    it('should reject duplicate supplier', () => {
      const ingredient = Ingredient.create(defaultProps);
      const supplier1 = IngredientSupplier.create({
        id: 'sup_1',
        ingredientId: ingredient.id,
        supplierId: 'vendor_1',
        isPreferred: false
      });
      const supplier2 = IngredientSupplier.create({
        id: 'sup_2',
        ingredientId: ingredient.id,
        supplierId: 'vendor_1',
        isPreferred: false
      });

      ingredient.addSupplier(supplier1);
      expect(() => ingredient.addSupplier(supplier2)).toThrow(/already exists/);
    });
  });

  describe('Allergens', () => {
    it('should add an allergen', () => {
      const ingredient = Ingredient.create(defaultProps);
      const allergen = IngredientAllergen.create({
        id: 'all_1',
        ingredientId: ingredient.id,
        allergenName: 'Gluten',
        severity: AllergenSeverityEnum.HIGH,
        containsTraces: false
      });

      ingredient.addAllergen(allergen);
      expect(ingredient.allergens.length).toBe(1);
    });
  });

  describe('Storage Rules', () => {
    it('should reject conflicting storage rules', () => {
      const ingredient = Ingredient.create(defaultProps);
      const rule1 = IngredientStorageRule.create({
        id: 'rule_1',
        ingredientId: ingredient.id,
        ruleType: StorageRuleTypeEnum.TEMPERATURE,
        instruction: 'Keep refrigerated'
      });
      const rule2 = IngredientStorageRule.create({
        id: 'rule_2',
        ingredientId: ingredient.id,
        ruleType: StorageRuleTypeEnum.TEMPERATURE,
        instruction: 'Keep frozen'
      });

      ingredient.addStorageRule(rule1);
      expect(() => ingredient.addStorageRule(rule2)).toThrow(/already exists/);
    });
  });

  describe('Lifecycle Policy', () => {
    it('should enforce activation invariants', () => {
      const ingredient = Ingredient.create(defaultProps);
      
      // Attempt activation without unit of measure -> should fail validation policy
      expect(() => IngredientLifecyclePolicy.activate(ingredient)).toThrow(/unit of measure/);

      // Add UoM
      ingredient.updateDetails(
        ingredient.name,
        ingredient.description,
        ingredient.category,
        UnitOfMeasure.create(UnitOfMeasureEnum.KILOGRAM)
      );

      // Attempt activation without supplier -> should fail consistency specification
      expect(() => IngredientLifecyclePolicy.activate(ingredient)).toThrow(/at least one supplier/);

      // Add supplier
      ingredient.addSupplier(IngredientSupplier.create({
        id: 'sup_1',
        ingredientId: ingredient.id,
        supplierId: 'vendor_1',
        isPreferred: true
      }));

      // Now activation should succeed
      IngredientLifecyclePolicy.activate(ingredient);
      
      expect(ingredient.status.value).toBe(IngredientStatusEnum.ACTIVE);
      const activeEvent = ingredient.domainEvents.find(e => e instanceof IngredientActivatedEvent);
      expect(activeEvent).toBeDefined();
    });

    it('should archive and discontinue', () => {
      const ingredient = Ingredient.create(defaultProps);
      
      IngredientLifecyclePolicy.archive(ingredient);
      expect(ingredient.status.value).toBe(IngredientStatusEnum.ARCHIVED);
      const archiveEvent = ingredient.domainEvents.find(e => e instanceof IngredientArchivedEvent);
      expect(archiveEvent).toBeDefined();

      IngredientLifecyclePolicy.discontinue(ingredient);
      expect(ingredient.status.value).toBe(IngredientStatusEnum.DISCONTINUED);
    });
  });
});
