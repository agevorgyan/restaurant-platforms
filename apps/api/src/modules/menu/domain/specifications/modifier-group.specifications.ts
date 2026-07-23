import { ModifierGroup } from '../aggregates/modifier-group.aggregate';

export class ModifierGroupConsistencySpecification {
  public static isSatisfiedBy(group: ModifierGroup): boolean {
    const optionNames = group.options.map(o => o.name.value);
    if (new Set(optionNames).size !== optionNames.length) return false;

    if (group.translations.length === 0) return false;
    
    return true;
  }
}

export class ModifierSelectionSpecification {
  public static isSatisfiedBy(group: ModifierGroup): boolean {
    if (group.rule.isRequired && group.constraint.minSelection.value < 1) {
      return false; // Required groups must allow at least one selection
    }
    return true;
  }
}

export class ModifierConstraintSpecification {
  public static isSatisfiedBy(group: ModifierGroup): boolean {
    return group.constraint.maxSelection.value >= group.constraint.minSelection.value;
  }
}

export class ModifierTranslationSpecification {
  public static isSatisfiedBy(group: ModifierGroup): boolean {
    return group.translations.length > 0;
  }
}

export class ModifierReferenceSpecification {
  public static isSatisfiedBy(/* group: ModifierGroup */): boolean {
    return true;
  }
}