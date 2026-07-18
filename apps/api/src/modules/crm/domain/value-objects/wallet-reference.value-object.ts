export class WalletReference {
  constructor(public readonly value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('Transaction reference cannot be empty');
    }
  }
}
