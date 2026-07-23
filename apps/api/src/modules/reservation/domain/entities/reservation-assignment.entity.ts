import { Entity } from '@saas/core';
import { TableReference } from '../value-objects/table-reference.value-object';
import { TableAllocationReference } from '../value-objects/table-allocation-reference.value-object';

export interface ReservationAssignmentProps {
  tableRef: TableReference;
  allocationRef?: TableAllocationReference;
  assignedAt: Date;
}

export class ReservationAssignment extends Entity<ReservationAssignmentProps> {
  get tableRef(): TableReference { return this.props.tableRef; }
  get allocationRef(): TableAllocationReference | undefined { return this.props.allocationRef; }
  get assignedAt(): Date { return this.props.assignedAt; }

  private constructor(id: string, props: ReservationAssignmentProps) { super(id, props); }
  public static create(props: ReservationAssignmentProps, id?: string): ReservationAssignment {
    return new ReservationAssignment(id || crypto.randomUUID(), props);
  }
}