import { Entity } from '@saas/core';

export interface ModifierTranslationProps {
  id: string;
  languageCode: string;
  displayName: string;
  description?: string;
}

export class ModifierTranslation extends Entity<ModifierTranslationProps> {
  get languageCode(): string { return this.props.languageCode; }
  get displayName(): string { return this.props.displayName; }

  private constructor(props: any) { super(props.id, props); }

  public static create(props: ModifierTranslationProps): ModifierTranslation {
    if (!props.languageCode || !props.displayName) {
      throw new Error('Language code and display name cannot be empty');
    }
    return new ModifierTranslation(props);
  }
}