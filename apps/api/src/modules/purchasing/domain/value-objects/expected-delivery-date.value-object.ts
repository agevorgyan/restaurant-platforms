export class ExpectedDeliveryDate {
  constructor(public readonly value: Date) {
    if (!(value instanceof Date) || isNaN(value.getTime())) {
      throw new Error('Invalid expected delivery date');
    }
  }
}
