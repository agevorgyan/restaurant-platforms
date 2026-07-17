export class RecipeYield {
  constructor(public readonly amount: number, public readonly unit: string) {
    if (typeof amount !== 'number' || amount <= 0) {
      throw new Error('Recipe yield amount must be greater than zero');
    }
    if (!unit || unit.trim() === '') {
      throw new Error('Recipe yield unit must be specified');
    }
  }
}
