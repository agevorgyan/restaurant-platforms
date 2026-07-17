export class QueuePosition {
  constructor(public readonly position: number) {
    if (!Number.isInteger(position) || position < 0) {
      throw new Error('Queue position must be a non-negative integer');
    }
  }
}
