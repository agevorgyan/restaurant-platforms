export class AllergenInformation {
  constructor(public readonly allergens: string[]) {
    if (!Array.isArray(allergens)) {
      throw new Error('Allergens must be an array of strings');
    }
  }

  public hasAllergen(allergen: string): boolean {
    return this.allergens.includes(allergen);
  }
}
