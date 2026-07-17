import { IngredientCode } from '../value-objects/ingredient-code.value-object';
import { IngredientCategory } from '../value-objects/ingredient-category.value-object';
import { UnitOfMeasure } from '../value-objects/unit-of-measure.value-object';
import { IngredientStatus } from '../value-objects/ingredient-status.value-object';
import { StorageCondition } from '../value-objects/storage-condition.value-object';
import { ShelfLife } from '../value-objects/shelf-life.value-object';
import { AllergenInformation } from '../value-objects/allergen-information.value-object';

export interface IIngredient {
  id: string;
  restaurantId: string;
  ingredientCode: IngredientCode;
  name: string;
  description?: string;
  category: IngredientCategory;
  unitOfMeasure: UnitOfMeasure;
  status: IngredientStatus;
  defaultStorageCondition: StorageCondition;
  defaultShelfLife: ShelfLife;
  allergenInformation: AllergenInformation;
  barcode?: string;
  createdAt: Date;
  updatedAt: Date;
}
