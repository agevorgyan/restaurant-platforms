import { ValueObject } from '@saas/core';

export interface TableAllocationReferenceProps { allocationId: string; }
export class TableAllocationReference extends ValueObject<TableAllocationReferenceProps> {
  get allocationId(): string { return this.props.allocationId; }
  private constructor(props: TableAllocationReferenceProps) { super(props); }
  public static create(allocationId: string): TableAllocationReference { return new TableAllocationReference({ allocationId }); }
}