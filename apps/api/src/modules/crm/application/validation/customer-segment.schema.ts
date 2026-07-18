import { CreateCustomerSegmentDto, SegmentRuleDto } from '../dto/customer-segment.dto';

export function validateSegmentRule(rule: SegmentRuleDto): string[] {
  const errors: string[] = [];
  if (!rule.field || rule.field.trim() === '') errors.push('Rule field is required');
  if (!rule.operator) errors.push('Rule operator is required');
  if (!rule.logicalOperator || !['AND', 'OR'].includes(rule.logicalOperator)) errors.push('Rule logicalOperator must be AND or OR');
  if (typeof rule.order !== 'number') errors.push('Rule order must be a number');
  return errors;
}

export function validateCreateCustomerSegment(dto: CreateCustomerSegmentDto): string[] {
  const errors: string[] = [];
  if (!dto.restaurantId) errors.push('restaurantId is required');
  if (!dto.name || dto.name.trim() === '') errors.push('name is required');
  if (!dto.segmentType) errors.push('segmentType is required');
  if (typeof dto.priority !== 'number') errors.push('priority must be a number');
  if (!dto.evaluationPolicy) errors.push('evaluationPolicy is required');
  
  if (!dto.rules || dto.rules.length === 0) {
    errors.push('Segment must contain at least one rule');
  } else {
    dto.rules.forEach((rule, idx) => {
      const ruleErrors = validateSegmentRule(rule);
      errors.push(...ruleErrors.map(e => `Rule[${idx}]: ${e}`));
    });

    const orders = dto.rules.map(r => r.order);
    if (new Set(orders).size !== orders.length) {
      errors.push('Rule order must be unique within the segment');
    }
  }

  return errors;
}
