import { ValueObject } from '@saas/core';

export interface TableReferenceProps {
  diningRoom?: string;
  tableNumber: string;
  seatNumber?: string;
}

export class TableReference extends ValueObject<TableReferenceProps> {
  private constructor(props: TableReferenceProps) {
    super(props);
  }

  public static create(props: TableReferenceProps): TableReference {
    if (!props.tableNumber || props.tableNumber.trim() === '') {
      throw new Error('Table number must be provided');
    }

    return new TableReference({
      diningRoom: props.diningRoom?.trim(),
      tableNumber: props.tableNumber.trim(),
      seatNumber: props.seatNumber?.trim()
    });
  }

  get diningRoom(): string | undefined { return this.props.diningRoom; }
  get tableNumber(): string { return this.props.tableNumber; }
  get seatNumber(): string | undefined { return this.props.seatNumber; }
}
