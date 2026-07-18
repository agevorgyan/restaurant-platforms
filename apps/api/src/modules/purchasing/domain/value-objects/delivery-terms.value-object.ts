export class DeliveryTerms {
  constructor(public readonly value: string) {
    if (!value || value.trim() === '') {
      throw new Error('Delivery terms cannot be empty');
    }
  }
}
