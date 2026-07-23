import { ValueObject } from '@saas/core';

export interface MenuEventTypeProps { type: string; }

export class MenuEventType extends ValueObject<MenuEventTypeProps> {
  get type(): string { return this.props.type; }
  private constructor(props: MenuEventTypeProps) { super(props); }
  public static create(type: string): MenuEventType {
    if (!type) throw new Error('EventType required');
    return new MenuEventType({ type });
  }
}