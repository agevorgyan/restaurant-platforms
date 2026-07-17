export class DeliveryFee {
  constructor(public readonly value: number) {
    this.validate();
  }

  private validate(): void {
    if (this.value < 0) {
      throw new Error('Delivery fee must be zero or greater');
    }
  }
}
