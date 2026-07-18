export type MembershipStatusValue = 'Draft' | 'Active' | 'Inactive' | 'Archived';

export class MembershipStatus {
  constructor(public readonly value: MembershipStatusValue) {
    const validStatuses = ['Draft', 'Active', 'Inactive', 'Archived'];
    if (!validStatuses.includes(value)) {
      throw new Error(`Invalid membership status: ${value}`);
    }
  }

  isArchived(): boolean {
    return this.value === 'Archived';
  }

  isActive(): boolean {
    return this.value === 'Active';
  }
}
