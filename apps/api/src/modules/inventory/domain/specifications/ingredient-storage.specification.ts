import { IngredientStorageRule } from '../entities/ingredient-storage-rule.entity';

export class IngredientStorageSpecification {
  public static isSatisfiedBy(rules: IngredientStorageRule[], newRule: IngredientStorageRule): boolean {
    // Prevent duplicate storage rule types (e.g. two TEMPERATURE rules)
    const duplicateType = rules.some(r => r.ruleType === newRule.ruleType);
    if (duplicateType) {
      throw new Error(`A storage rule of type ${newRule.ruleType} already exists`);
    }
    return true;
  }
}
