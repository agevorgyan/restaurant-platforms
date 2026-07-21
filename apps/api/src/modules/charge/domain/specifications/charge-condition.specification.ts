import { ChargeCondition, ChargeConditionType } from '../entities/charge-condition.entity';

export class ChargeConditionSpecification {
  public isSatisfiedBy(
    conditions: ChargeCondition[],
    context: Record<ChargeConditionType, any>
  ): boolean {
    return conditions.every(condition => {
      const targetValue = context[condition.type];
      if (targetValue === undefined || targetValue === null) {
        return false;
      }

      switch (condition.operator) {
        case 'EQUALS':
          return targetValue === condition.value;
        case 'GREATER_THAN':
          return targetValue > condition.value;
        case 'LESS_THAN':
          return targetValue < condition.value;
        case 'BETWEEN':
          return targetValue >= condition.value[0] && targetValue <= condition.value[1];
        case 'IN':
          return Array.isArray(condition.value) && condition.value.includes(targetValue);
        default:
          return false;
      }
    });
  }
}
