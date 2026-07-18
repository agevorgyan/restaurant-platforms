export class LoyaltyBalance {
  constructor(public readonly value: number) {
    if (value < 0) {
      throw new Error('Loyalty balance cannot be negative');
    }
    if (!Number.isInteger(value)) {
      throw new Error('Loyalty balance must be an integer');
    }
  }

  add(points: number): LoyaltyBalance {
    return new LoyaltyBalance(this.value + points);
  }

  subtract(points: number): LoyaltyBalance {
    if (this.value < points) {
      throw new Error('Insufficient balance');
    }
    return new LoyaltyBalance(this.value - points);
  }
}
