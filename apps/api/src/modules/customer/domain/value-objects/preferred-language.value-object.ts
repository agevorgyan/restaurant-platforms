import { ValueObject } from '@saas/core';

export interface PreferredLanguageProps { code: string; }

export class PreferredLanguage extends ValueObject<PreferredLanguageProps> {
  get code(): string { return this.props.code; }
  private constructor(props: PreferredLanguageProps) { super(props); }
  public static create(code: string): PreferredLanguage {
    return new PreferredLanguage({ code });
  }
}