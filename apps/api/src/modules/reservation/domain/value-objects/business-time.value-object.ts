import { ValueObject } from '@saas/core';

export interface BusinessTimeProps { time: string; }
export class BusinessTime extends ValueObject<BusinessTimeProps> {
  get time(): string { return this.props.time; }
  private constructor(props: BusinessTimeProps) { super(props); }
  public static create(time: string): BusinessTime { return new BusinessTime({ time }); }
}