import { ValueObject } from '@saas/core';
import { TableReference } from './table-reference.value-object';
import { TableAllocationReference } from './table-allocation-reference.value-object';
import { AssignmentReason } from './assignment-reason.value-object';

export interface AssignmentDecisionProps {
  approved: boolean;
  rejected: boolean;
  suggestedTableReferences: TableReference[];
  suggestedAllocationReference?: TableAllocationReference;
  assignedCapacity: number;
  reasons: AssignmentReason[];
}

export class AssignmentDecision extends ValueObject<AssignmentDecisionProps> {
  get approved(): boolean { return this.props.approved; }
  get rejected(): boolean { return this.props.rejected; }
  get suggestedTableReferences(): ReadonlyArray<TableReference> { return this.props.suggestedTableReferences; }
  get suggestedAllocationReference(): TableAllocationReference | undefined { return this.props.suggestedAllocationReference; }
  get assignedCapacity(): number { return this.props.assignedCapacity; }
  get reasons(): ReadonlyArray<AssignmentReason> { return this.props.reasons; }

  private constructor(props: AssignmentDecisionProps) { super(props); }
  public static create(props: AssignmentDecisionProps): AssignmentDecision { return new AssignmentDecision(props); }
}