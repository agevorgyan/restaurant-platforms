export type InventoryStatusType = 'Active' | 'Inactive' | 'Archived';

export class InventoryStatus {
  constructor(public readonly value: InventoryStatusType) {
    if (!this.isValid(value)) {
      throw new Error(`Invalid inventory status: ${value}`);
    }
  }

  private isValid(value: string): value is InventoryStatusType {
    return ['Active', 'Inactive', 'Archived'].includes(value);
  }

  public isActive(): boolean {
    return this.value === 'Active';
  }

  public isArchived(): boolean {
    return this.value === 'Archived';
  }
}
