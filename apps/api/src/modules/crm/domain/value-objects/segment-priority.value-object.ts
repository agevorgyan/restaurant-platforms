export class SegmentPriority {
  constructor(public readonly value: number) {
    if (!Number.isInteger(value)) {
      throw new Error('Segment priority must be an integer');
    }
    if (value < 0) {
      throw new Error('Segment priority cannot be negative');
    }
  }
}
