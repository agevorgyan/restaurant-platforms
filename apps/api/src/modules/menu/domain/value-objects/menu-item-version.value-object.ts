import { ValueObject } from '@saas/core';

export interface MenuItemVersionProps { version: number; }

export class MenuItemVersion extends ValueObject<MenuItemVersionProps> {
  get version(): number { return this.props.version; }
  private constructor(props: MenuItemVersionProps) { super(props); }
  public static create(version: number = 1): MenuItemVersion {
    if (version < 1) throw new Error('MenuItemVersion must be >= 1');
    return new MenuItemVersion({ version });
  }
}