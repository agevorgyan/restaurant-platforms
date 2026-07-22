import { ValueObject } from '@saas/core';
import { Quantity } from './quantity.value-object';

export interface AvailabilitySnapshotProps {
  inventoryId: string;
  onHand: Quantity;
  reserved: Quantity;
  available: Quantity;
  incoming: Quantity;
  outgoing: Quantity;
  projectedAvailable: Quantity;
  calculatedAt: Date;
}

export class AvailabilitySnapshot extends ValueObject<AvailabilitySnapshotProps> {
  private constructor(props: AvailabilitySnapshotProps) {
    super(props);
  }

  public static create(props: AvailabilitySnapshotProps): AvailabilitySnapshot {
    return new AvailabilitySnapshot(props);
  }

  get inventoryId(): string {
    return this.props.inventoryId;
  }

  get onHand(): Quantity {
    return this.props.onHand;
  }

  get reserved(): Quantity {
    return this.props.reserved;
  }

  get available(): Quantity {
    return this.props.available;
  }

  get incoming(): Quantity {
    return this.props.incoming;
  }

  get outgoing(): Quantity {
    return this.props.outgoing;
  }

  get projectedAvailable(): Quantity {
    return this.props.projectedAvailable;
  }

  get calculatedAt(): Date {
    return this.props.calculatedAt;
  }
}
