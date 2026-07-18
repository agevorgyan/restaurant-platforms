import { SegmentRuleOperator } from '../value-objects/segment-rule-operator.value-object';

export interface ISegmentRule {
  id: string;
  field: string;
  operator: SegmentRuleOperator;
  value: any;
  logicalOperator: 'AND' | 'OR';
  order: number;
}
