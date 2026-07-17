export type KitchenPriorityModeType = 'FIFO' | 'Priority' | 'Hybrid';

export class KitchenPriorityMode {
  constructor(public readonly value: KitchenPriorityModeType) {
    if (!this.isValid(value)) {
      throw new Error(`Invalid priority mode: ${value}`);
    }
  }

  private isValid(value: string): value is KitchenPriorityModeType {
    return ['FIFO', 'Priority', 'Hybrid'].includes(value);
  }
}
