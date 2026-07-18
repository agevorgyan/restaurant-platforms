export class SupplierCode {
  constructor(public readonly value: string) {
    if (!value || value.trim() === '') {
      throw new Error('Supplier code cannot be empty');
    }
  }
}
