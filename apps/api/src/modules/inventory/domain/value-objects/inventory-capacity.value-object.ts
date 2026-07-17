export class InventoryCapacity {
  constructor(public readonly value: number) {
    if (typeof value !== 'number' || value <= 0) {
      throw new Error('Capacity must be greater than zero');
    }
  }
}
