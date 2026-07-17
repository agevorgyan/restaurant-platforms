export type AdjustmentTypeEnum = 
  | 'Increase' 
  | 'Decrease' 
  | 'Correction' 
  | 'WriteOff' 
  | 'Damage' 
  | 'Expiration' 
  | 'Loss';

export class AdjustmentType {
  constructor(public readonly value: AdjustmentTypeEnum) {
    if (!this.isValid(value)) {
      throw new Error(`Invalid adjustment type: ${value}`);
    }
  }

  private isValid(value: string): value is AdjustmentTypeEnum {
    const types = ['Increase', 'Decrease', 'Correction', 'WriteOff', 'Damage', 'Expiration', 'Loss'];
    return types.includes(value);
  }
}
