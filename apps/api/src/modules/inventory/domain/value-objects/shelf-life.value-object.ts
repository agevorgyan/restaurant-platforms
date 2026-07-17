export class ShelfLife {
  constructor(public readonly days: number) {
    if (typeof days !== 'number' || days <= 0) {
      throw new Error('Shelf life must be greater than zero');
    }
  }
}
