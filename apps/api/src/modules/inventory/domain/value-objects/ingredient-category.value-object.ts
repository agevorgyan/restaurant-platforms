export type IngredientCategoryType = 
  | 'Meat' | 'Poultry' | 'Fish' | 'Seafood' | 'Vegetable' 
  | 'Fruit' | 'Dairy' | 'Cheese' | 'Egg' | 'Grain' 
  | 'Flour' | 'Rice' | 'Pasta' | 'Spice' | 'Herb' 
  | 'Oil' | 'Sauce' | 'Beverage' | 'Frozen' | 'Bakery' 
  | 'Dessert' | 'Packaging' | 'Cleaning' | 'Disposable' | 'Other';

export class IngredientCategory {
  constructor(public readonly value: IngredientCategoryType) {
    if (!this.isValid(value)) {
      throw new Error(`Invalid ingredient category: ${value}`);
    }
  }

  private isValid(value: string): value is IngredientCategoryType {
    const categories = [
      'Meat', 'Poultry', 'Fish', 'Seafood', 'Vegetable', 
      'Fruit', 'Dairy', 'Cheese', 'Egg', 'Grain', 
      'Flour', 'Rice', 'Pasta', 'Spice', 'Herb', 
      'Oil', 'Sauce', 'Beverage', 'Frozen', 'Bakery', 
      'Dessert', 'Packaging', 'Cleaning', 'Disposable', 'Other'
    ];
    return categories.includes(value);
  }
}
