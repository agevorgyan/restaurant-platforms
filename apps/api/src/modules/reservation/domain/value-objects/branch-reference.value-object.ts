import { ValueObject } from '@saas/core';

export interface BranchReferenceProps { branchId: string; }
export class BranchReference extends ValueObject<BranchReferenceProps> {
  get branchId(): string { return this.props.branchId; }
  private constructor(props: BranchReferenceProps) { super(props); }
  public static create(branchId: string): BranchReference { return new BranchReference({ branchId }); }
}