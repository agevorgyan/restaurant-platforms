export class SupplierPaymentTerms {
  constructor(public readonly value: string) {
    if (!value || value.trim() === '') {
      throw new Error('Payment terms cannot be empty');
    }
  }
}
