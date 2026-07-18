export interface SegmentRuleDto {
  field: string;
  operator: string;
  value: any;
  logicalOperator: 'AND' | 'OR';
  order: number;
}

export interface CreateCustomerSegmentDto {
  restaurantId: string;
  name: string;
  description?: string;
  segmentType: string;
  priority: number;
  evaluationPolicy: string;
  rules: SegmentRuleDto[];
}

export interface UpdateCustomerSegmentDto {
  name?: string;
  description?: string;
  priority?: number;
  evaluationPolicy?: string;
}
