import { ValueObject } from '@saas/core';

export interface MenuIntegrationContextProps {
  source: string;
  target: string;
}

export class MenuIntegrationContext extends ValueObject<MenuIntegrationContextProps> {
  get source(): string { return this.props.source; }
  get target(): string { return this.props.target; }
  private constructor(props: MenuIntegrationContextProps) { super(props); }
  public static create(source: string, target: string): MenuIntegrationContext {
    return new MenuIntegrationContext({ source, target });
  }
}