import { ValueObject } from '@saas/core';

export interface StreetProps { name: string; }

export class Street extends ValueObject<StreetProps> {
  get name(): string { return this.props.name; }
  private constructor(props: StreetProps) { super(props); }
  public static create(name: string): Street {
    return new Street({ name });
  }
}