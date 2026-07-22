import { Entity } from '@saas/core';

export interface InventoryLocationProps {
  id: string;
  inventoryId: string;
  aisle?: string;
  rack?: string;
  shelf?: string;
  bin?: string;
}

export class InventoryLocationEntity extends Entity<InventoryLocationProps> {
  get id(): string {
    return this._id;
  }

  get inventoryId(): string {
    return this.props.inventoryId;
  }

  get aisle(): string | undefined {
    return this.props.aisle;
  }

  get rack(): string | undefined {
    return this.props.rack;
  }

  get shelf(): string | undefined {
    return this.props.shelf;
  }

  get bin(): string | undefined {
    return this.props.bin;
  }

  public static create(props: InventoryLocationProps): InventoryLocationEntity {
    return new InventoryLocationEntity(props.id, props);
  }
}
