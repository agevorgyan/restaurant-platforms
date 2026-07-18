export class WalletBalance {
  constructor(public readonly value: number) {
    if (typeof value !== 'number' || isNaN(value)) {
      throw new Error('Balance must be a valid number');
    }
    if (value < 0) {
      throw new Error('Balance cannot become negative');
    }
  }

  add(amount: number): WalletBalance {
    if (amount <= 0) throw new Error('Amount must be greater than zero');
    return new WalletBalance(this.value + amount);
  }

  subtract(amount: number): WalletBalance {
    if (amount <= 0) throw new Error('Amount must be greater than zero');
    return new WalletBalance(this.value - amount);
  }
}
