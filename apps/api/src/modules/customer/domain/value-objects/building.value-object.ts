import { ValueObject } from '@saas/core';

export interface BuildingProps { number: string; }

export class Building extends ValueObject<BuildingProps> {
  get number(): string { return this.props.number; }
  private constructor(props: BuildingProps) { super(props); }
  public static create(number: string): Building {
    return new Building({ number });
  }
}