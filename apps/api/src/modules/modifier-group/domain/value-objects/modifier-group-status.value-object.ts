export type ModifierGroupStatusType = 'Draft' | 'Active' | 'Inactive' | 'Archived';

export class ModifierGroupStatus {
  constructor(public readonly value: ModifierGroupStatusType) {
    this.validate(value);
  }

  private validate(status: string): void {
    const valid = ['Draft', 'Active', 'Inactive', 'Archived'];
    if (!valid.includes(status)) {
      throw new Error(`Invalid Modifier Group Status: ${status}`);
    }
  }

  public isArchived(): boolean {
    return this.value === 'Archived';
  }
}
