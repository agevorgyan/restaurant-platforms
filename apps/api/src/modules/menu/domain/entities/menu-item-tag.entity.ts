import { Entity } from '@saas/core';

export interface MenuItemTagProps {
  id: string;
  tagName: string;
}

export class MenuItemTag extends Entity<MenuItemTagProps> {
  get tagName(): string { return this.props.tagName; }

  private constructor(props: MenuItemTagProps) { super(props.id, props); }

  public static create(props: MenuItemTagProps): MenuItemTag {
    if (!props.tagName) throw new Error('Tag name cannot be empty');
    return new MenuItemTag(props);
  }
}