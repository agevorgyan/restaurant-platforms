import { ValueObject } from '@saas/core';

export interface MenuVersionProps { version: number; }

export class MenuVersion extends ValueObject<MenuVersionProps> {
  get version(): number { return this.props.version; }
  private constructor(props: MenuVersionProps) { super(props); }
  public static create(version: number = 1): MenuVersion {
    if (version < 1) throw new Error('MenuVersion must be >= 1');
    return new MenuVersion({ version });
  }
  public increment(): MenuVersion {
    return new MenuVersion({ version: this.props.version + 1 });
  }
}