import { Entity } from '@saas/core';
import { VisibilityPeriod } from '../value-objects/visibility-period.value-object';

export interface MenuVisibilityRuleProps {
  id: string;
  period: VisibilityPeriod;
  isGloballyVisible: boolean;
}

export class MenuVisibilityRule extends Entity<MenuVisibilityRuleProps> {
  get id(): string { return this.props.id; }
  get period(): VisibilityPeriod { return this.props.period; }
  get isGloballyVisible(): boolean { return this.props.isGloballyVisible; }

  private constructor(props: any) { super(props.id, props); }
  public static create(props: MenuVisibilityRuleProps): MenuVisibilityRule {
    return new MenuVisibilityRule(props);
  }
}