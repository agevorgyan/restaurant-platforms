import { ValueObject } from '@saas/core';

export interface DistrictProps { name: string; }

export class District extends ValueObject<DistrictProps> {
  get name(): string { return this.props.name; }
  private constructor(props: DistrictProps) { super(props); }
  public static create(name: string): District {
    return new District({ name });
  }
}