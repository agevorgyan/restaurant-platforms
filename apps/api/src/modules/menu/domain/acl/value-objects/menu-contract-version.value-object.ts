import { ValueObject } from '@saas/core';

export interface MenuContractVersionProps { version: string; }

export class MenuContractVersion extends ValueObject<MenuContractVersionProps> {
  get version(): string { return this.props.version; }
  private constructor(props: MenuContractVersionProps) { super(props); }
  public static create(version: string = '1.0.0'): MenuContractVersion {
    return new MenuContractVersion({ version });
  }
}