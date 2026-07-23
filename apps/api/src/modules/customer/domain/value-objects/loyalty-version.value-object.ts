import { ValueObject } from '@saas/core';

export interface LoyaltyVersionProps { version: number; }

export class LoyaltyVersion extends ValueObject<LoyaltyVersionProps> {
  get version(): number { return this.props.version; }
  private constructor(props: LoyaltyVersionProps) { super(props); }
  public static create(version: number): LoyaltyVersion {
    return new LoyaltyVersion({ version });
  }
}