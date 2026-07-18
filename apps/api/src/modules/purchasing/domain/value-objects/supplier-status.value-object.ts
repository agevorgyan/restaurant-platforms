export type SupplierStatusValue = 'Draft' | 'Active' | 'Inactive' | 'Archived';

export class SupplierStatus {
  constructor(public readonly value: SupplierStatusValue) {
    if (!['Draft', 'Active', 'Inactive', 'Archived'].includes(value)) {
      throw new Error(`Invalid supplier status: ${value}`);
    }
  }

  isDraft(): boolean {
    return this.value === 'Draft';
  }

  isActive(): boolean {
    return this.value === 'Active';
  }

  isInactive(): boolean {
    return this.value === 'Inactive';
  }

  isArchived(): boolean {
    return this.value === 'Archived';
  }
}
