export type DisplayStatusType = 'Active' | 'Inactive' | 'Maintenance';

export class DisplayStatus {
  constructor(public readonly value: DisplayStatusType) {
    if (!this.isValid(value)) {
      throw new Error(`Invalid display status: ${value}`);
    }
  }

  private isValid(value: string): value is DisplayStatusType {
    return ['Active', 'Inactive', 'Maintenance'].includes(value);
  }

  public isActive(): boolean {
    return this.value === 'Active';
  }
}
