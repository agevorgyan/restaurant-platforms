export type CategoryStatusType = 'Active' | 'Inactive' | 'Archived';

export class CategoryStatus {
  constructor(public readonly value: CategoryStatusType) {
    this.validate(value);
  }

  private validate(status: string): void {
    const valid = ['Active', 'Inactive', 'Archived'];
    if (!valid.includes(status)) {
      throw new Error(`Invalid Category Status: ${status}`);
    }
  }

  public isArchived(): boolean {
    return this.value === 'Archived';
  }
}
