export class InvoiceNumber {
  constructor(public readonly value: string) {
    if (!value || value.trim() === '') {
      throw new Error('Invoice number cannot be empty');
    }
  }
}
