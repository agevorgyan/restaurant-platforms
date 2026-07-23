import { ModifierGroup } from '../aggregates/modifier-group.aggregate';
import { ModifierGroupStatus } from '../enums/modifier-group.enums';

export class ModifierLifecyclePolicy {
  public static canPublish(group: ModifierGroup): boolean {
    if (group.status !== ModifierGroupStatus.DRAFT) return false;
    if (group.translations.length === 0) return false;
    return true;
  }

  public static canActivate(group: ModifierGroup): boolean {
    return group.status === ModifierGroupStatus.PUBLISHED || group.status === ModifierGroupStatus.INACTIVE;
  }
}

export class SelectionPolicy {
  public static enforce(group: ModifierGroup): void {
    if (group.rule.isRequired && group.constraint.minSelection.value === 0) {
      throw new Error('Required groups must have MinimumSelection > 0');
    }
  }
}

export class ConstraintPolicy {
  public static validateMinMax(min: number, max: number): void {
    if (min < 0) throw new Error('MinimumSelection must be >= 0');
    if (max < min) throw new Error('MaximumSelection must be >= MinimumSelection');
  }
}

export class ModifierValidationPolicy {
  public static validateOptionName(name: string): void {
    if (!name) throw new Error('Option name is required');
  }
}