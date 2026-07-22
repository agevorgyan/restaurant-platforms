import { ValueObject } from '@saas/core';
import { AllocationPlan } from './allocation-plan.value-object';
import { StockMovement } from '../entities/stock-movement.entity';

export interface AllocationResultProps {
  isSuccessful: boolean;
  isPartial: boolean;
  plan?: AllocationPlan;
  movementsGenerated: StockMovement[];
  errorMessage?: string;
}

export class AllocationResult extends ValueObject<AllocationResultProps> {
  private constructor(props: AllocationResultProps) {
    super(props);
  }

  public static success(plan: AllocationPlan, movementsGenerated: StockMovement[], isPartial: boolean = false): AllocationResult {
    return new AllocationResult({
      isSuccessful: true,
      isPartial,
      plan,
      movementsGenerated
    });
  }

  public static failure(errorMessage: string): AllocationResult {
    return new AllocationResult({
      isSuccessful: false,
      isPartial: false,
      movementsGenerated: [],
      errorMessage
    });
  }

  get isSuccessful(): boolean {
    return this.props.isSuccessful;
  }

  get isPartial(): boolean {
    return this.props.isPartial;
  }

  get plan(): AllocationPlan | undefined {
    return this.props.plan;
  }

  get movementsGenerated(): StockMovement[] {
    return [...this.props.movementsGenerated];
  }

  get errorMessage(): string | undefined {
    return this.props.errorMessage;
  }
}
