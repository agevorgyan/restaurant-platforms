export type RecipeStatusType = 'Draft' | 'Active' | 'Inactive' | 'Archived';

export class RecipeStatus {
  constructor(public readonly value: RecipeStatusType) {
    if (!this.isValid(value)) {
      throw new Error(`Invalid recipe status: ${value}`);
    }
  }

  private isValid(value: string): value is RecipeStatusType {
    return ['Draft', 'Active', 'Inactive', 'Archived'].includes(value);
  }

  public isActive(): boolean {
    return this.value === 'Active';
  }

  public isArchived(): boolean {
    return this.value === 'Archived';
  }
}
