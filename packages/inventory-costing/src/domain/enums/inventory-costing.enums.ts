/**
 * Enterprise Inventory Valuation & Costing Platform - Domain Enums
 *
 * Defines core domain enumerations for valuation methods and cost layer statuses.
 */

export enum ValuationMethod {
  FIFO = 'FIFO',
  WEIGHTED_AVERAGE = 'WEIGHTED_AVERAGE',
  STANDARD_COST = 'STANDARD_COST',
  MOVING_AVERAGE = 'MOVING_AVERAGE',
}

export enum CostStatus {
  PENDING = 'PENDING',
  CALCULATED = 'CALCULATED',
  ADJUSTED = 'ADJUSTED',
  ARCHIVED = 'ARCHIVED',
}
