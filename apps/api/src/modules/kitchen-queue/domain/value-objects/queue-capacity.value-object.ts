export class QueueCapacity {
  constructor(public readonly limit: number) {
    if (!Number.isInteger(limit) || limit <= 0) {
      throw new Error('Queue capacity must be an integer greater than zero');
    }
  }

  public isExceeded(currentCount: number): boolean {
    return currentCount >= this.limit;
  }
}
