export type MovementTypeEnum = 
  | 'StockIn' 
  | 'StockOut' 
  | 'TransferIn' 
  | 'TransferOut' 
  | 'Consumption' 
  | 'Production' 
  | 'Waste' 
  | 'Return' 
  | 'Adjustment';

export class MovementType {
  constructor(public readonly value: MovementTypeEnum) {
    if (!this.isValid(value)) {
      throw new Error(`Invalid movement type: ${value}`);
    }
  }

  private isValid(value: string): value is MovementTypeEnum {
    const types = [
      'StockIn', 'StockOut', 'TransferIn', 'TransferOut', 
      'Consumption', 'Production', 'Waste', 'Return', 'Adjustment'
    ];
    return types.includes(value);
  }
}
