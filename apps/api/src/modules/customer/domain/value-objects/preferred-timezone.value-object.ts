import { ValueObject } from '@saas/core';

export interface PreferredTimezoneProps { zone: string; }

export class PreferredTimezone extends ValueObject<PreferredTimezoneProps> {
  get zone(): string { return this.props.zone; }
  private constructor(props: PreferredTimezoneProps) { super(props); }
  public static create(zone: string): PreferredTimezone {
    return new PreferredTimezone({ zone });
  }
}