export class DeliverySettings {
  constructor(
    public readonly deliveryRadius: number,
    public readonly estimatedDeliveryTime: number,
    public readonly minimumOrderAmount: number,
    public readonly deliveryFee: number,
  ) {
    this.validatePositiveNumeric(deliveryRadius, 'deliveryRadius');
    this.validatePositiveNumeric(estimatedDeliveryTime, 'estimatedDeliveryTime');
    this.validatePositiveNumeric(minimumOrderAmount, 'minimumOrderAmount');
    this.validatePositiveNumeric(deliveryFee, 'deliveryFee');
  }

  private validatePositiveNumeric(value: number, field: string): void {
    if (value < 0) {
      throw new Error(`${field} must be a positive numeric value`);
    }
  }
}
