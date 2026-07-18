export class SupplierCreditReference {
  constructor(public readonly value: string) {
    if (!value || value.trim() === '') {
      throw new Error('Supplier credit reference cannot be empty');
    }
  }
}
