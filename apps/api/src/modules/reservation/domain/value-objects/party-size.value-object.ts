import { ValueObject } from '@saas/core';

export interface PartySizeProps { size: number; }
export class PartySize extends ValueObject<PartySizeProps> {
  get size(): number { return this.props.size; }
  private constructor(props: PartySizeProps) { super(props); }
  public static create(size: number): PartySize { return new PartySize({ size }); }
}