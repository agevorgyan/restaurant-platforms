import { ValueObject } from '@saas/core';

export interface RegionProps { name: string; }

export class Region extends ValueObject<RegionProps> {
  get name(): string { return this.props.name; }
  private constructor(props: RegionProps) { super(props); }
  public static create(name: string): Region {
    return new Region({ name });
  }
}