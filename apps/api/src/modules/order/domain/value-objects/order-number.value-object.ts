export class OrderNumber {
  constructor(public readonly value: string) {
    this.validate(value);
  }

  private validate(orderNumber: string): void {
    if (!orderNumber || orderNumber.trim() === '') {
      throw new Error('Order number cannot be empty');
    }
  }
}
