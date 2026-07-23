import { Entity } from '@saas/core';
import { MinimumSelection } from '../value-objects/minimum-selection.value-object';
import { MaximumSelection } from '../value-objects/maximum-selection.value-object';

export interface ModifierConstraintProps {
  id: string;
  minSelection: MinimumSelection;
  maxSelection: MaximumSelection;
}

export class ModifierConstraint extends Entity<ModifierConstraintProps> {
  get minSelection(): MinimumSelection { return this.props.minSelection; }
  get maxSelection(): MaximumSelection { return this.props.maxSelection; }

  private constructor(props: any) { super(props.id, props); }

  public static create(props: ModifierConstraintProps): ModifierConstraint {
    if (props.maxSelection.value < props.minSelection.value) {
      throw new Error('MaximumSelection must be >= MinimumSelection');
    }
    return new ModifierConstraint(props);
  }
}