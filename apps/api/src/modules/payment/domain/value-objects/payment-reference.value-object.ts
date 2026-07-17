export class PaymentReference {
  constructor(public readonly value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('Payment reference cannot be empty');
    }
  }
}
