import { Entity } from '@saas/core';
import { SelectionMode } from '../enums/modifier-group.enums';

export interface SelectionRuleProps {
  id: string;
  mode: SelectionMode;
  isRequired: boolean;
}

export class SelectionRule extends Entity<SelectionRuleProps> {
  get mode(): SelectionMode { return this.props.mode; }
  get isRequired(): boolean { return this.props.isRequired; }

  private constructor(props: any) { super(props.id, props); }

  public static create(props: SelectionRuleProps): SelectionRule {
    return new SelectionRule(props);
  }
}