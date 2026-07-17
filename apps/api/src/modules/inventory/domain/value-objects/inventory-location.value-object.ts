export class InventoryLocation {
  constructor(public readonly description: string) {
    if (!description || description.trim() === '') {
      throw new Error('Inventory location description must not be empty');
    }
  }
}
