export class IngredientCode {
  constructor(public readonly value: string) {
    if (!value || value.trim() === '') {
      throw new Error('Ingredient code must not be empty');
    }
  }
}
