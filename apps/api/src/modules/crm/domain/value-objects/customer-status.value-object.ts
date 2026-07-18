export type CustomerStatusValue = 'Draft' | 'Active' | 'Inactive' | 'Archived';

export class CustomerStatus {
  constructor(public readonly value: CustomerStatusValue) {
    const validStatuses = ['Draft', 'Active', 'Inactive', 'Archived'];
    if (!validStatuses.includes(value)) {
      throw new Error(`Invalid customer status: ${value}`);
    }
  }

  isDraft(): boolean {
    return this.value === 'Draft';
  }

  isActive(): boolean {
    return this.value === 'Active';
  }

  isArchived(): boolean {
    return this.value === 'Archived';
  }
}
