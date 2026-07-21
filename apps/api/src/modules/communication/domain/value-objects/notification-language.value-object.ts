import { ValueObject } from '@saas/core';

export interface NotificationLanguageProps {
  code: string; // ISO 639-1 (e.g. "en", "es", "fr")
}

export class NotificationLanguage extends ValueObject<NotificationLanguageProps> {
  private constructor(props: NotificationLanguageProps) {
    super(props);
  }

  public static create(code: string): NotificationLanguage {
    if (!code || code.trim().length !== 2) {
      throw new Error('Language code must be a valid 2-letter ISO 639-1 code');
    }
    return new NotificationLanguage({ code: code.toLowerCase() });
  }

  get code(): string {
    return this.props.code;
  }
}
