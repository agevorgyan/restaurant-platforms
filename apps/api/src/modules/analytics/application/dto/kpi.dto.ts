/**
 * Enterprise KPI Platform - Application DTOs
 */

import { KpiType, TargetType, KpiStatus, ThresholdStatus } from '../../domain/enums/kpi.enums';

export interface CreateKpiDto {
  name: string;
  description: string;
  kpiType?: KpiType;
  formula: string;
  targetValue: number;
  targetType?: TargetType;
  excellentMin?: number;
  goodMin?: number;
  warningMin?: number;
  weight?: number;
  department?: string;
}

export interface UpdateKpiDto {
  name?: string;
  description?: string;
  formula?: string;
  targetValue?: number;
  status?: KpiStatus;
}

export interface CalculateKpiDto {
  variables: Record<string, number>;
}

export interface KpiResponseDto {
  id: string;
  tenantId: string;
  name: string;
  description: string;
  kpiType: KpiType;
  formula: string;
  targetValue: number;
  status: KpiStatus;
  department: string;
  weight: number;
  lastCalculatedValue?: number;
  thresholdStatus?: ThresholdStatus;
  percentageToTarget?: number;
  snapshotsCount: number;
  createdAt: Date;
  updatedAt: Date;
}
