/**
 * Enterprise KPI Platform - CQRS Read Models
 */

import { KpiType, KpiStatus, ThresholdStatus } from '../../domain/enums/kpi.enums';

export interface KpiCatalogEntry {
  id: string;
  name: string;
  kpiType: KpiType;
  department: string;
  status: KpiStatus;
  targetValue: number;
  lastCalculatedValue?: number;
  thresholdStatus?: ThresholdStatus;
}

export interface KpiCatalogReadModel {
  totalKpis: number;
  kpis: KpiCatalogEntry[];
}

export interface ScorecardDepartmentSummary {
  department: string;
  weightedScore: number;
  thresholdStatus: ThresholdStatus;
  kpisCount: number;
}

export interface KpiScorecardsReadModel {
  overallScorecardIndex: number;
  departments: ScorecardDepartmentSummary[];
}

export interface KpiSnapshotItem {
  snapshotId: string;
  kpiId: string;
  calculatedValue: number;
  status: ThresholdStatus;
  percentageToTarget: number;
  calculatedAt: Date;
}

export interface KpiSnapshotsReadModel {
  totalSnapshots: number;
  snapshots: KpiSnapshotItem[];
}

export interface ThresholdHistoryEntry {
  kpiId: string;
  kpiName: string;
  previousStatus: ThresholdStatus;
  newStatus: ThresholdStatus;
  timestamp: Date;
}

export interface ThresholdHistoryReadModel {
  totalCrossings: number;
  history: ThresholdHistoryEntry[];
}

export interface TargetProgressItem {
  kpiId: string;
  kpiName: string;
  targetValue: number;
  currentValue: number;
  percentageToTarget: number;
  isTargetMet: boolean;
}

export interface TargetProgressReadModel {
  targetsMetCount: number;
  totalTargetsCount: number;
  progress: TargetProgressItem[];
}

export interface KpiStatisticsReadModel {
  totalKpis: number;
  byStatus: Record<KpiStatus, number>;
  byType: Record<KpiType, number>;
  byThreshold: Record<ThresholdStatus, number>;
}
