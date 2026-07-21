import { ValueObject } from '@saas/core';
import { PricingStageEnum } from './pricing-stage.value-object';

export interface TraceStep {
  stage: PricingStageEnum;
  description: string;
  appliedRuleIds: string[];
  skippedRuleIds: string[];
  timestamp: Date;
}

export interface CalculationTraceProps {
  steps: TraceStep[];
  startedAt: Date;
  completedAt?: Date;
}

export class CalculationTrace extends ValueObject<CalculationTraceProps> {
  private constructor(props: CalculationTraceProps) {
    super(props);
  }

  public static initial(): CalculationTrace {
    return new CalculationTrace({
      steps: [],
      startedAt: new Date(),
    });
  }

  public addStep(step: TraceStep): CalculationTrace {
    return new CalculationTrace({
      steps: [...this.props.steps, step],
      startedAt: this.props.startedAt,
      completedAt: this.props.completedAt,
    });
  }

  public complete(): CalculationTrace {
    return new CalculationTrace({
      steps: [...this.props.steps],
      startedAt: this.props.startedAt,
      completedAt: new Date(),
    });
  }

  get steps(): TraceStep[] { return [...this.props.steps]; }
  get startedAt(): Date { return this.props.startedAt; }
  get completedAt(): Date | undefined { return this.props.completedAt; }
}
