import { Entity } from '@saas/core';

export interface MenuLayoutProps {
  id: string;
  theme: string;
  columns: number;
}

export class MenuLayout extends Entity<MenuLayoutProps> {
  get id(): string { return this.props.id; }
  get theme(): string { return this.props.theme; }
  get columns(): number { return this.props.columns; }

  private constructor(props: any) { super(props.id, props); }
  public static create(props: MenuLayoutProps): MenuLayout {
    return new MenuLayout(props);
  }
}