export type ModifierOptionStatusType = 'Draft' | 'Active' | 'Inactive' | 'Archived';

export class ModifierOptionStatus {
  constructor(public readonly value: ModifierOptionStatusType) {
    this.validate(value);
  }

  private validate(status: string): void {
    const valid = ['Draft', 'Active', 'Inactive', 'Archived'];
    if (!valid.includes(status)) {
      throw new Error(`Invalid Modifier Option Status: ${status}`);
    }
  }

  public isArchived(): boolean {
    return this.value === 'Archived';
  }
}
