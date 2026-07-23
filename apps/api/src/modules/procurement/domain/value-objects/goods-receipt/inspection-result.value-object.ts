import { ValueObject } from '@saas/core';

export enum InspectionOutcome {
  PASSED = 'PASSED',
  FAILED = 'FAILED',
  CONDITIONAL = 'CONDITIONAL'
}

export interface InspectionResultProps {
  outcome: InspectionOutcome;
  notes?: string;
  inspectedAt: Date;
}

export class InspectionResult extends ValueObject<InspectionResultProps> {
  get outcome(): InspectionOutcome { return this.props.outcome; }
  get notes(): string | undefined { return this.props.notes; }
  get inspectedAt(): Date { return this.props.inspectedAt; }
  
  private constructor(props: InspectionResultProps) { super(props); }
  
  public static create(outcome: InspectionOutcome, notes?: string): InspectionResult {
    return new InspectionResult({ outcome, notes, inspectedAt: new Date() });
  }
}