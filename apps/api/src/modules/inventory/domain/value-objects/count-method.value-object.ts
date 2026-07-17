export type CountMethodType = 'Full' | 'Cycle' | 'Spot';

export class CountMethod {
  constructor(public readonly value: CountMethodType) {
    if (!this.isValid(value)) {
      throw new Error(`Invalid count method: ${value}`);
    }
  }

  private isValid(value: string): value is CountMethodType {
    return ['Full', 'Cycle', 'Spot'].includes(value);
  }
}
