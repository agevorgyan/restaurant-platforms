/**
 * Enterprise Restaurant Operations Analytics Platform - Domain Events
 *
 * Domain events emitted during metric calculation, SLA threshold violations, occupancy updates, and turnover changes.
 */

import { MetricStatus, TimeWindow } from '../enums/ops-analytics.enums';

export interface MetricCalculatedEvent {
  eventName: 'MetricCalculated';
  metricName: string;
  value: number;
  timeWindow: TimeWindow;
  timestamp: Date;
}

export interface ThresholdExceededEvent {
  eventName: 'ThresholdExceeded';
  metricName: string;
  currentValue: number;
  thresholdLimit: number;
  status: MetricStatus;
  timestamp: Date;
}

export interface ServiceSLAViolatedEvent {
  eventName: 'ServiceSLAViolated';
  slaName: string;
  actualDurationMinutes: number;
  targetSlaMinutes: number;
  timestamp: Date;
}

export interface OccupancyChangedEvent {
  eventName: 'OccupancyChanged';
  occupancyPercentage: number;
  occupiedSeats: number;
  totalCapacitySeats: number;
  timestamp: Date;
}

export interface TurnoverUpdatedEvent {
  eventName: 'TurnoverUpdated';
  turnoverRate: number;
  timeWindow: TimeWindow;
  timestamp: Date;
}

export interface WaitTimeUpdatedEvent {
  eventName: 'WaitTimeUpdated';
  averageWaitTimeMinutes: number;
  timestamp: Date;
}

export type OpsAnalyticsDomainEvent =
  | MetricCalculatedEvent
  | ThresholdExceededEvent
  | ServiceSLAViolatedEvent
  | OccupancyChangedEvent
  | TurnoverUpdatedEvent
  | WaitTimeUpdatedEvent;
