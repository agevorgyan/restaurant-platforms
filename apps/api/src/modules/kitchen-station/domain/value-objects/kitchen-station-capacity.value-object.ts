export class KitchenStationCapacity {
  constructor(public readonly value: number) {
    if (!Number.isInteger(value)) {
      throw new Error('Capacity must be an integer');
    }
    if (value <= 0) {
      throw new Error('Capacity must be greater than zero');
    }
  }
}
