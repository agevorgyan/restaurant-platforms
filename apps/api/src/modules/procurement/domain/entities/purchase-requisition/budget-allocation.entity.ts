import { Entity } from '@saas/core';
import { BudgetReference } from '../../value-objects/purchase-requisition/budget-reference.value-object';
import { MoneyReference } from '../../value-objects/money-reference.value-object';

export interface BudgetAllocationProps {
  budget: BudgetReference;
  allocatedAmount: MoneyReference;
  isConfirmed: boolean;
}

export class BudgetAllocation extends Entity<BudgetAllocationProps> {
  get budget(): BudgetReference { return this.props.budget; }
  get allocatedAmount(): MoneyReference { return this.props.allocatedAmount; }
  get isConfirmed(): boolean { return this.props.isConfirmed; }

  private constructor(id: string, props: BudgetAllocationProps) {
    super(id, props);
  }

  public static create(props: Omit<BudgetAllocationProps, 'isConfirmed'>, id?: string): BudgetAllocation {
    return new BudgetAllocation(id || crypto.randomUUID(), {
      ...props,
      isConfirmed: false
    });
  }

  public confirmAllocation(): void {
    this.props.isConfirmed = true;
  }

  public revokeAllocation(): void {
    this.props.isConfirmed = false;
  }
}
