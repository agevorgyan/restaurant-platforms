export class IngredientQuantity {
  constructor(public readonly value: number) {
    if (typeof value !== 'number' || value <= 0) {
      throw new Error('Ingredient quantity must be greater than zero');
    }
  }
}
