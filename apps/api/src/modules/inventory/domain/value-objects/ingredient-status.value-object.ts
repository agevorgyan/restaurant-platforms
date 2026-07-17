export type IngredientStatusType = 'Draft' | 'Active' | 'Inactive' | 'Archived';

export class IngredientStatus {
  constructor(public readonly value: IngredientStatusType) {
    if (!this.isValid(value)) {
      throw new Error(`Invalid ingredient status: ${value}`);
    }
  }

  private isValid(value: string): value is IngredientStatusType {
    return ['Draft', 'Active', 'Inactive', 'Archived'].includes(value);
  }

  public isActive(): boolean {
    return this.value === 'Active';
  }

  public isArchived(): boolean {
    return this.value === 'Archived';
  }
}
