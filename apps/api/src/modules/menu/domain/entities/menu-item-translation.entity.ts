import { Entity } from '@saas/core';

export interface MenuItemTranslationProps {
  id: string;
  languageCode: string;
  displayName: string;
  description?: string;
}

export class MenuItemTranslation extends Entity<MenuItemTranslationProps> {
  get languageCode(): string { return this.props.languageCode; }
  get displayName(): string { return this.props.displayName; }

  private constructor(props: MenuItemTranslationProps) { super(props.id, props); }

  public static create(props: MenuItemTranslationProps): MenuItemTranslation {
    if (!props.languageCode || !props.displayName) {
      throw new Error('Language code and display name cannot be empty');
    }
    return new MenuItemTranslation(props);
  }
}