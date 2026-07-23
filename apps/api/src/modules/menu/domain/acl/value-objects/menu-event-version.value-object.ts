import { ValueObject } from '@saas/core';

export interface MenuEventVersionProps { version: string; }

export class MenuEventVersion extends ValueObject<MenuEventVersionProps> {
  get version(): string { return this.props.version; }
  private constructor(props: MenuEventVersionProps) { super(props); }
  public static create(version: string = '1.0.0'): MenuEventVersion {
    return new MenuEventVersion({ version });
  }
}