export type UnitOfMeasureType = 
  | 'Piece' | 'Gram' | 'Kilogram' | 'Milliliter' 
  | 'Liter' | 'Ounce' | 'Pound' | 'Bottle' 
  | 'Can' | 'Pack' | 'Box' | 'Bag' | 'Tray';

export class UnitOfMeasure {
  constructor(public readonly value: UnitOfMeasureType) {
    if (!this.isValid(value)) {
      throw new Error(`Invalid unit of measure: ${value}`);
    }
  }

  private isValid(value: string): value is UnitOfMeasureType {
    const units = [
      'Piece', 'Gram', 'Kilogram', 'Milliliter', 
      'Liter', 'Ounce', 'Pound', 'Bottle', 
      'Can', 'Pack', 'Box', 'Bag', 'Tray'
    ];
    return units.includes(value);
  }
}
