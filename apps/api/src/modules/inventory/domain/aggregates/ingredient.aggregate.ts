import { AggregateRoot } from '@saas/core';
import { IngredientSupplier } from '../entities/ingredient-supplier.entity';
import { IngredientNutrition } from '../entities/ingredient-nutrition.entity';
import { IngredientAllergen } from '../entities/ingredient-allergen.entity';
import { IngredientStorageRule } from '../entities/ingredient-storage-rule.entity';
import { IngredientName } from '../value-objects/ingredient-name.value-object';
import { IngredientDescription } from '../value-objects/ingredient-description.value-object';
import { IngredientType } from '../value-objects/ingredient-type.value-object';
import { IngredientCategory } from '../value-objects/ingredient-category.value-object';
import { IngredientStatus, IngredientStatusEnum } from '../value-objects/ingredient-status.value-object';
import { IngredientVersion } from '../value-objects/ingredient-version.value-object';
import { IngredientReference } from '../value-objects/ingredient-reference.value-object';
import { UnitOfMeasure } from '../value-objects/unit-of-measure.value-object';
import { ShelfLife } from '../value-objects/shelf-life.value-object';
import { StorageLocation } from '../value-objects/storage-location.value-object';
import { ReorderLevel } from '../value-objects/reorder-level.value-object';
import { SafetyStock } from '../value-objects/safety-stock.value-object';
import { MinimumStock } from '../value-objects/minimum-stock.value-object';
import { MaximumStock } from '../value-objects/maximum-stock.value-object';
import { SKU } from '../value-objects/sku.value-object';
import { IngredientCode } from '../value-objects/ingredient-code.value-object';
import { IngredientCreatedEvent, IngredientUpdatedEvent, IngredientActivatedEvent, IngredientArchivedEvent, IngredientDiscontinuedEvent } from '../events/ingredient.events';
import { IngredientSupplierSpecification } from '../specifications/ingredient-supplier.specification';
import { IngredientStorageSpecification } from '../specifications/ingredient-storage.specification';
import { IngredientValidationPolicy } from '../policies/ingredient-validation.policy';

export interface IngredientProps {
  id: string;
  restaurantId: string;
  ingredientCode: IngredientCode;
  sku: SKU;
  name: IngredientName;
  description: IngredientDescription;
  type: IngredientType;
  category: IngredientCategory;
  status: IngredientStatus;
  version: IngredientVersion;
  unitOfMeasure?: UnitOfMeasure;
  shelfLife?: ShelfLife;
  storageLocation?: StorageLocation;
  reorderLevel?: ReorderLevel;
  safetyStock?: SafetyStock;
  minimumStock?: MinimumStock;
  maximumStock?: MaximumStock;
  externalReference?: IngredientReference;
  
  suppliers: IngredientSupplier[];
  nutrition?: IngredientNutrition;
  allergens: IngredientAllergen[];
  storageRules: IngredientStorageRule[];
  
  createdAt: Date;
  updatedAt: Date;
}

export class Ingredient extends AggregateRoot<IngredientProps> {
  get id(): string {
    return this._id;
  }
  
  get restaurantId(): string {
    return this.props.restaurantId;
  }

  get ingredientCode(): IngredientCode {
    return this.props.ingredientCode;
  }

  get sku(): SKU {
    return this.props.sku;
  }

  get name(): IngredientName {
    return this.props.name;
  }

  get description(): IngredientDescription {
    return this.props.description;
  }

  get type(): IngredientType {
    return this.props.type;
  }

  get category(): IngredientCategory {
    return this.props.category;
  }

  get status(): IngredientStatus {
    return this.props.status;
  }

  get version(): IngredientVersion {
    return this.props.version;
  }

  get unitOfMeasure(): UnitOfMeasure | undefined {
    return this.props.unitOfMeasure;
  }

  get shelfLife(): ShelfLife | undefined {
    return this.props.shelfLife;
  }

  get storageLocation(): StorageLocation | undefined {
    return this.props.storageLocation;
  }

  get reorderLevel(): ReorderLevel | undefined {
    return this.props.reorderLevel;
  }

  get safetyStock(): SafetyStock | undefined {
    return this.props.safetyStock;
  }

  get minimumStock(): MinimumStock | undefined {
    return this.props.minimumStock;
  }

  get maximumStock(): MaximumStock | undefined {
    return this.props.maximumStock;
  }

  get externalReference(): IngredientReference | undefined {
    return this.props.externalReference;
  }

  get suppliers(): IngredientSupplier[] {
    return [...this.props.suppliers];
  }

  get nutrition(): IngredientNutrition | undefined {
    return this.props.nutrition;
  }

  get allergens(): IngredientAllergen[] {
    return [...this.props.allergens];
  }

  get storageRules(): IngredientStorageRule[] {
    return [...this.props.storageRules];
  }

  public setStatus(status: IngredientStatus): void {
    this.props.status = status;
    this.incrementVersion();
  }

  public activate(): void {
    const oldStatus = this.props.status;
    this.props.status = IngredientStatus.create(IngredientStatusEnum.ACTIVE);
    
    try {
      IngredientValidationPolicy.validate(this);
    } catch (e) {
      this.props.status = oldStatus;
      throw e;
    }
    
    this.incrementVersion();
    
    this.addDomainEvent(
      new IngredientActivatedEvent(this.id, this.restaurantId)
    );
  }

  public archive(): void {
    this.setStatus(IngredientStatus.create(IngredientStatusEnum.ARCHIVED));
    this.addDomainEvent(
      new IngredientArchivedEvent(this.id, this.restaurantId)
    );
  }

  public discontinue(): void {
    this.setStatus(IngredientStatus.create(IngredientStatusEnum.DISCONTINUED));
    this.addDomainEvent(
      new IngredientDiscontinuedEvent(this.id, this.restaurantId)
    );
  }

  public updateDetails(
    name: IngredientName, 
    description: IngredientDescription,
    category: IngredientCategory,
    unitOfMeasure?: UnitOfMeasure,
    shelfLife?: ShelfLife
  ): void {
    this.props.name = name;
    this.props.description = description;
    this.props.category = category;
    
    if (unitOfMeasure) this.props.unitOfMeasure = unitOfMeasure;
    if (shelfLife) this.props.shelfLife = shelfLife;
    
    this.incrementVersion();
  }

  public addSupplier(supplier: IngredientSupplier): void {
    IngredientSupplierSpecification.isSatisfiedBy(this.props.suppliers, supplier);
    this.props.suppliers.push(supplier);
    this.incrementVersion();
  }

  public removeSupplier(supplierId: string): void {
    this.props.suppliers = this.props.suppliers.filter(s => s.supplierId !== supplierId);
    this.incrementVersion();
  }

  public setNutrition(nutrition: IngredientNutrition): void {
    this.props.nutrition = nutrition;
    this.incrementVersion();
  }

  public addAllergen(allergen: IngredientAllergen): void {
    const exists = this.props.allergens.some(a => a.allergenName === allergen.allergenName);
    if (exists) {
      throw new Error(`Allergen ${allergen.allergenName} already exists for this ingredient`);
    }
    this.props.allergens.push(allergen);
    this.incrementVersion();
  }

  public removeAllergen(allergenName: string): void {
    this.props.allergens = this.props.allergens.filter(a => a.allergenName !== allergenName);
    this.incrementVersion();
  }

  public addStorageRule(rule: IngredientStorageRule): void {
    IngredientStorageSpecification.isSatisfiedBy(this.props.storageRules, rule);
    this.props.storageRules.push(rule);
    this.incrementVersion();
  }

  private incrementVersion(): void {
    this.props.version = this.props.version.increment();
    this.props.updatedAt = new Date();
    this.addDomainEvent(
      new IngredientUpdatedEvent(this.id, this.restaurantId, this.version.value)
    );
  }

  public static create(props: Omit<IngredientProps, 'status' | 'version' | 'createdAt' | 'updatedAt' | 'suppliers' | 'allergens' | 'storageRules'>): Ingredient {
    const ingredient = new Ingredient(props.id, {
      ...props,
      status: IngredientStatus.create(IngredientStatusEnum.DRAFT),
      version: IngredientVersion.create(1),
      suppliers: [],
      allergens: [],
      storageRules: [],
      createdAt: new Date(),
      updatedAt: new Date()
    });

    ingredient.addDomainEvent(
      new IngredientCreatedEvent(ingredient.id, ingredient.restaurantId, ingredient.ingredientCode.value, ingredient.sku.value)
    );

    return ingredient;
  }
}
