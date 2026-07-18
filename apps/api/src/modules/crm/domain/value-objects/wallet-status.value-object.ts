export type WalletStatusValue = 'Active' | 'Frozen' | 'Closed' | 'Archived';

export class WalletStatus {
  constructor(public readonly value: WalletStatusValue) {
    const validStatuses = ['Active', 'Frozen', 'Closed', 'Archived'];
    if (!validStatuses.includes(value)) {
      throw new Error(`Invalid wallet status: ${value}`);
    }
  }

  isReadOnly(): boolean {
    return this.value === 'Closed' || this.value === 'Archived';
  }
}
