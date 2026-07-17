export type QueuePriorityType = 'Low' | 'Normal' | 'High' | 'Rush';

export class QueuePriority {
  constructor(public readonly value: QueuePriorityType) {
    if (!this.isValid(value)) {
      throw new Error(`Invalid queue priority: ${value}`);
    }
  }

  private isValid(value: string): value is QueuePriorityType {
    return ['Low', 'Normal', 'High', 'Rush'].includes(value);
  }

  public getWeight(): number {
    const weights: Record<QueuePriorityType, number> = {
      Low: 1,
      Normal: 2,
      High: 3,
      Rush: 4
    };
    return weights[this.value];
  }
}
