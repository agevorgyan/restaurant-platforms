import { Entity } from '@saas/core';
import { InspectionResult } from '../../value-objects/goods-receipt/inspection-result.value-object';

export interface QualityInspectionProps {
  inspectorId: string;
  result: InspectionResult;
  comments?: string;
}

export class QualityInspection extends Entity<QualityInspectionProps> {
  get inspectorId(): string { return this.props.inspectorId; }
  get result(): InspectionResult { return this.props.result; }
  get comments(): string | undefined { return this.props.comments; }

  private constructor(id: string, props: QualityInspectionProps) { super(id, props); }

  public static create(props: QualityInspectionProps, id?: string): QualityInspection {
    return new QualityInspection(id || crypto.randomUUID(), props);
  }
}