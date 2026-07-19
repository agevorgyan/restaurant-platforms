import { Entity } from '@saas/core';

export type PromotionConditionType = 'MinOrderAmount' | 'MinQuantity' | 'CustomerSegment' | 'Branch' | 'Category' | 'Product';

export interface PromotionConditionProps {
  id: string;
  type: PromotionConditionType;
  value: string | number;
  operator?: 'Equals' | 'GreaterThan' | 'In' | 'Contains';
}

export class PromotionCondition extends Entity<PromotionConditionProps> {
  private constructor(props: PromotionConditionProps) {
    super(props.id, props);
  }

  public get id(): string { return this.props.id; }
  public get type(): PromotionConditionType { return this.props.type; }
  public get value(): string | number { return this.props.value; }
  public get operator(): string | undefined { return this.props.operator; }

  public static create(props: PromotionConditionProps): PromotionCondition {
    if (!props.id) {
      throw new Error('PromotionCondition id is required');
    }
    if (!props.type || props.value === undefined) {
      throw new Error('PromotionCondition requires a type and value');
    }
    return new PromotionCondition(props);
  }
}
