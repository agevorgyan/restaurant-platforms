export type MembershipStatusType = 'Pending' | 'Active' | 'Suspended' | 'Removed';

export class MembershipStatus {
  constructor(public readonly value: MembershipStatusType) {
    this.validateStatus(value);
  }

  private validateStatus(status: string): void {
    const validStatuses = ['Pending', 'Active', 'Suspended', 'Removed'];
    if (!validStatuses.includes(status)) {
      throw new Error(`Invalid Membership Status: ${status}`);
    }
  }

  public canTransitionTo(newStatus: MembershipStatusType): boolean {
    if (this.value === 'Removed') return false; // Terminal state
    if (this.value === 'Pending' && newStatus === 'Suspended') return false; // Pending cannot directly go to suspended
    if (this.value === newStatus) return false;
    return true;
  }
}
