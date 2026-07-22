import { IngredientCode } from '../value-objects/ingredient-code.value-object';
import { SKU } from '../value-objects/sku.value-object';
import { IIngredientRepository } from '../repositories/ingredient.repository.interface';

export class IngredientCreationPolicy {
  constructor(private readonly repository: IIngredientRepository) {}

  public async checkUniqueness(ingredientCode: IngredientCode, sku: SKU, restaurantId: string): Promise<void> {
    const existingByCode = await this.repository.findByCode(ingredientCode.value, restaurantId);
    if (existingByCode) {
      throw new Error(`Ingredient with code ${ingredientCode.value} already exists`);
    }

    const existingBySku = await this.repository.findBySku(sku.value, restaurantId);
    if (existingBySku) {
      throw new Error(`Ingredient with SKU ${sku.value} already exists`);
    }
  }
}
