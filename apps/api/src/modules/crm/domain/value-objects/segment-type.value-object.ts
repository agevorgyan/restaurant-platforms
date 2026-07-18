export type SegmentTypeValue = 'Static' | 'Dynamic';

export class SegmentType {
  constructor(public readonly value: SegmentTypeValue) {
    const validTypes = ['Static', 'Dynamic'];
    if (!validTypes.includes(value)) {
      throw new Error(`Invalid segment type: ${value}`);
    }
  }
}
