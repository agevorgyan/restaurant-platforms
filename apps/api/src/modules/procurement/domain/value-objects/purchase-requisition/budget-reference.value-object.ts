import { ValueObject } from '@saas/core';

export interface BudgetReferenceProps {
  budgetId: string;
  budgetName?: string;
}

export class BudgetReference extends ValueObject<BudgetReferenceProps> {
  get budgetId(): string {
    return this.props.budgetId;
  }

  get budgetName(): string | undefined {
    return this.props.budgetName;
  }

  private constructor(props: BudgetReferenceProps) {
    super(props);
  }

  public static create(budgetId: string, budgetName?: string): BudgetReference {
    if (!budgetId || budgetId.trim() === '') {
      throw new Error('Budget ID is required');
    }
    return new BudgetReference({ budgetId: budgetId.trim(), budgetName });
  }
}
