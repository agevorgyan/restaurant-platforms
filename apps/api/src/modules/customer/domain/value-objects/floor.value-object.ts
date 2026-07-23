import { ValueObject } from '@saas/core';

export interface FloorProps { level: string; }

export class Floor extends ValueObject<FloorProps> {
  get level(): string { return this.props.level; }
  private constructor(props: FloorProps) { super(props); }
  public static create(level: string): Floor {
    return new Floor({ level });
  }
}