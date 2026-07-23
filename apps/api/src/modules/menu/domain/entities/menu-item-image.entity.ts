import { Entity } from '@saas/core';

export interface MenuItemImageProps {
  id: string;
  url: string;
  isPrimary: boolean;
}

export class MenuItemImage extends Entity<MenuItemImageProps> {
  get url(): string { return this.props.url; }
  get isPrimary(): boolean { return this.props.isPrimary; }

  private constructor(props: MenuItemImageProps) { super(props.id, props); }

  public static create(props: MenuItemImageProps): MenuItemImage {
    if (!props.url) throw new Error('Image URL cannot be empty');
    return new MenuItemImage(props);
  }
}