export type ProductStatusType = 'Draft' | 'Active' | 'Inactive' | 'Archived';

export class ProductStatus {
  constructor(public readonly value: ProductStatusType) {
    this.validate(value);
  }

  private validate(status: string): void {
    const valid = ['Draft', 'Active', 'Inactive', 'Archived'];
    if (!valid.includes(status)) {
      throw new Error(`Invalid Product Status: ${status}`);
    }
  }

  public isArchived(): boolean {
    return this.value === 'Archived';
  }
}
