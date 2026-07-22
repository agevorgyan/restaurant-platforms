import { ValueObject } from '@saas/core';

export interface InventorySnapshotProps {
  inventoryId: string;
  onHandQuantity: number;
  reservedQuantity: number;
  availableQuantity: number;
  timestamp: Date;
  version: number;
}

export class InventorySnapshot extends ValueObject<InventorySnapshotProps> {
  get inventoryId(): string {
    return this.props.inventoryId;
  }

  get onHandQuantity(): number {
    return this.props.onHandQuantity;
  }

  get reservedQuantity(): number {
    return this.props.reservedQuantity;
  }

  get availableQuantity(): number {
    return this.props.availableQuantity;
  }

  get timestamp(): Date {
    return this.props.timestamp;
  }

  get version(): number {
    return this.props.version;
  }

  private constructor(props: InventorySnapshotProps) {
    super(props);
  }

  public static create(props: InventorySnapshotProps): InventorySnapshot {
    if (props.onHandQuantity < 0) throw new Error('On-hand quantity cannot be negative in snapshot');
    if (props.reservedQuantity < 0) throw new Error('Reserved quantity cannot be negative in snapshot');
    if (props.availableQuantity < 0) throw new Error('Available quantity cannot be negative in snapshot');
    
    return new InventorySnapshot(props);
  }
}
