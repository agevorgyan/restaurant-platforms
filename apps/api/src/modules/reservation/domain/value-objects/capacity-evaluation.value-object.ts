import { ValueObject } from '@saas/core';

export interface CapacityEvaluationProps { isSufficient: boolean; deficit: number; }
export class CapacityEvaluation extends ValueObject<CapacityEvaluationProps> {
  get isSufficient(): boolean { return this.props.isSufficient; }
  get deficit(): number { return this.props.deficit; }
  private constructor(props: CapacityEvaluationProps) { super(props); }
  public static create(isSufficient: boolean, deficit: number): CapacityEvaluation { return new CapacityEvaluation({ isSufficient, deficit }); }
}