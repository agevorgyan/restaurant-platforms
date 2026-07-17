export type StorageConditionType = 'Ambient' | 'Refrigerated' | 'Frozen';

export class StorageCondition {
  constructor(public readonly value: StorageConditionType) {
    if (!this.isValid(value)) {
      throw new Error(`Invalid storage condition: ${value}`);
    }
  }

  private isValid(value: string): value is StorageConditionType {
    return ['Ambient', 'Refrigerated', 'Frozen'].includes(value);
  }
}
