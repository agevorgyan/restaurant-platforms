export class WalletCurrency {
  constructor(public readonly value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('Currency cannot be empty');
    }
  }
}
