export type SegmentRuleOperatorValue = 
  | 'Equals' 
  | 'NotEquals' 
  | 'GreaterThan' 
  | 'GreaterThanOrEqual' 
  | 'LessThan' 
  | 'LessThanOrEqual' 
  | 'Contains' 
  | 'StartsWith' 
  | 'EndsWith' 
  | 'In' 
  | 'NotIn' 
  | 'Between';

export class SegmentRuleOperator {
  constructor(public readonly value: SegmentRuleOperatorValue) {
    const validOperators = [
      'Equals', 'NotEquals', 'GreaterThan', 'GreaterThanOrEqual',
      'LessThan', 'LessThanOrEqual', 'Contains', 'StartsWith',
      'EndsWith', 'In', 'NotIn', 'Between'
    ];
    if (!validOperators.includes(value)) {
      throw new Error(`Invalid rule operator: ${value}`);
    }
  }
}
