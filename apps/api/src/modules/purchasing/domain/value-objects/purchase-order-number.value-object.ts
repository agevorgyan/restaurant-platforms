export class PurchaseOrderNumber {
  constructor(public readonly value: string) {
    if (!value || value.trim() === '') {
      throw new Error('Purchase order number cannot be empty');
    }
  }
}
