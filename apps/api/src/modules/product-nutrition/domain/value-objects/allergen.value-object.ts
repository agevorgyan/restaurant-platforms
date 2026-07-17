export type AllergenType = 
  | 'Cereals containing gluten'
  | 'Crustaceans'
  | 'Eggs'
  | 'Fish'
  | 'Peanuts'
  | 'Soybeans'
  | 'Milk'
  | 'Tree nuts'
  | 'Celery'
  | 'Mustard'
  | 'Sesame'
  | 'Sulphites'
  | 'Lupin'
  | 'Molluscs';

export class Allergen {
  constructor(public readonly value: AllergenType) {
    this.validate(value);
  }

  private validate(allergen: string): void {
    const valid = [
      'Cereals containing gluten',
      'Crustaceans',
      'Eggs',
      'Fish',
      'Peanuts',
      'Soybeans',
      'Milk',
      'Tree nuts',
      'Celery',
      'Mustard',
      'Sesame',
      'Sulphites',
      'Lupin',
      'Molluscs'
    ];
    
    if (!valid.includes(allergen)) {
      throw new Error(`Invalid allergen: ${allergen}`);
    }
  }
}
