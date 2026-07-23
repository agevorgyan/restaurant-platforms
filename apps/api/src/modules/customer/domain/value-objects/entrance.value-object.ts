import { ValueObject } from '@saas/core';

export interface EntranceProps { info: string; }

export class Entrance extends ValueObject<EntranceProps> {
  get info(): string { return this.props.info; }
  private constructor(props: EntranceProps) { super(props); }
  public static create(info: string): Entrance {
    return new Entrance({ info });
  }
}