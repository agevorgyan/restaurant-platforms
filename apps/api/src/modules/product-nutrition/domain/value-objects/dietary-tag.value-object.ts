export type DietaryTagType = 
  | 'Vegetarian'
  | 'Vegan'
  | 'GlutenFree'
  | 'LactoseFree'
  | 'Halal'
  | 'Kosher'
  | 'Organic'
  | 'Spicy'
  | 'LowCarb'
  | 'HighProtein'
  | 'SugarFree';

export class DietaryTag {
  constructor(public readonly value: DietaryTagType) {
    this.validate(value);
  }

  private validate(tag: string): void {
    const valid = [
      'Vegetarian',
      'Vegan',
      'GlutenFree',
      'LactoseFree',
      'Halal',
      'Kosher',
      'Organic',
      'Spicy',
      'LowCarb',
      'HighProtein',
      'SugarFree'
    ];
    
    if (!valid.includes(tag)) {
      throw new Error(`Invalid dietary tag: ${tag}`);
    }
  }
}
