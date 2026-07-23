import { Entity } from '@saas/core';
import { SupplierRating } from '../../value-objects/supplier/supplier-rating.value-object';

export interface SupplierPerformanceRecordProps {
  periodStartDate: Date;
  periodEndDate: Date;
  onTimeDeliveryRate: number; // percentage 0-100
  qualityDefectRate: number; // percentage 0-100
  overallRating: SupplierRating;
  comments?: string;
}

export class SupplierPerformanceRecord extends Entity<SupplierPerformanceRecordProps> {
  get periodStartDate(): Date { return this.props.periodStartDate; }
  get periodEndDate(): Date { return this.props.periodEndDate; }
  get onTimeDeliveryRate(): number { return this.props.onTimeDeliveryRate; }
  get qualityDefectRate(): number { return this.props.qualityDefectRate; }
  get overallRating(): SupplierRating { return this.props.overallRating; }
  get comments(): string | undefined { return this.props.comments; }

  private constructor(props: SupplierPerformanceRecordProps, id?: string) {
    super(id || crypto.randomUUID(), props);
  }

  public static create(props: SupplierPerformanceRecordProps, id?: string): SupplierPerformanceRecord {
    if (props.periodEndDate < props.periodStartDate) {
      throw new Error('periodEndDate must be after periodStartDate');
    }
    if (props.onTimeDeliveryRate < 0 || props.onTimeDeliveryRate > 100) {
      throw new Error('onTimeDeliveryRate must be between 0 and 100');
    }
    if (props.qualityDefectRate < 0 || props.qualityDefectRate > 100) {
      throw new Error('qualityDefectRate must be between 0 and 100');
    }

    return new SupplierPerformanceRecord(props, id);
  }
}
