export type MembershipRoleType = 
  | 'Owner'
  | 'Admin'
  | 'Manager'
  | 'Cashier'
  | 'Kitchen'
  | 'Waiter'
  | 'Delivery'
  | 'Accountant'
  | 'Custom';

export class MembershipRole {
  constructor(public readonly value: MembershipRoleType) {
    this.validateRole(value);
  }

  private validateRole(role: string): void {
    const validRoles = ['Owner', 'Admin', 'Manager', 'Cashier', 'Kitchen', 'Waiter', 'Delivery', 'Accountant', 'Custom'];
    if (!validRoles.includes(role)) {
      throw new Error(`Invalid Membership Role: ${role}`);
    }
  }

  public isOwner(): boolean {
    return this.value === 'Owner';
  }
}
