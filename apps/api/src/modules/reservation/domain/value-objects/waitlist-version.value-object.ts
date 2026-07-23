import { ValueObject } from '@saas/core';

export interface WaitlistVersionProps { version: number; }
export class WaitlistVersion extends ValueObject<WaitlistVersionProps> {
  get version(): number { return this.props.version; }
  private constructor(props: WaitlistVersionProps) { super(props); }
  public static create(version: number): WaitlistVersion { return new WaitlistVersion({ version }); }
}