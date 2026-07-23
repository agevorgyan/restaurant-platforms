import { ValueObject } from '@saas/core';

export interface InventoryEventVersionProps { version: number; }

export class InventoryEventVersion extends ValueObject<InventoryEventVersionProps> {
  get version(): number { return this.props.version; }
  private constructor(props: InventoryEventVersionProps) { super(props); }
  public static create(version: number): InventoryEventVersion {
    if (version < 1) throw new Error('Event version must be >= 1');
    return new InventoryEventVersion({ version });
  }
}