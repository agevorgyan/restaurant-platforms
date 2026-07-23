import { ValueObject } from '@saas/core';
import { TableReference } from './table-reference.value-object';

export interface SeatingPlanProps { tables: TableReference[]; totalCapacity: number; }
export class SeatingPlan extends ValueObject<SeatingPlanProps> {
  get tables(): ReadonlyArray<TableReference> { return this.props.tables; }
  get totalCapacity(): number { return this.props.totalCapacity; }
  private constructor(props: SeatingPlanProps) { super(props); }
  public static create(tables: TableReference[], totalCapacity: number): SeatingPlan { return new SeatingPlan({ tables, totalCapacity }); }
}