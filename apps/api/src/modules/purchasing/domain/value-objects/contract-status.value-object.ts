export type ContractStatusValue = 'Draft' | 'Active' | 'Expired' | 'Archived';

export class ContractStatus {
  constructor(public readonly value: ContractStatusValue) {
    const validStatuses = ['Draft', 'Active', 'Expired', 'Archived'];
    if (!validStatuses.includes(value)) {
      throw new Error(`Invalid contract status: ${value}`);
    }
  }

  isDraft(): boolean { return this.value === 'Draft'; }
  isActive(): boolean { return this.value === 'Active'; }
  isExpired(): boolean { return this.value === 'Expired'; }
  isArchived(): boolean { return this.value === 'Archived'; }
}
