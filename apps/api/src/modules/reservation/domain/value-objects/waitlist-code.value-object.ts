import { ValueObject } from '@saas/core';

export interface WaitlistCodeProps { code: string; }
export class WaitlistCode extends ValueObject<WaitlistCodeProps> {
  get code(): string { return this.props.code; }
  private constructor(props: WaitlistCodeProps) { super(props); }
  public static create(code: string): WaitlistCode { return new WaitlistCode({ code }); }
}