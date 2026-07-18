export class LoyaltyPoints {
  constructor(public readonly value: number) {
    if (!Number.isInteger(value)) {
      throw new Error('Loyalty points must be an integer');
    }
    if (value <= 0) {
      throw new Error('Loyalty points must be greater than zero');
    }
  }
}
