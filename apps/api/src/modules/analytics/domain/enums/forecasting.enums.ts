/**
 * Enterprise Forecasting & Predictive Analytics Platform - Domain Enums
 *
 * Defines core domain enumerations for forecast classifications, predictive model types,
 * forecast aggregate status states, and prediction result lifecycle states.
 */

export enum ForecastType {
  SALES = 'SALES',
  DEMAND = 'DEMAND',
  INVENTORY = 'INVENTORY',
  LABOR = 'LABOR',
  REVENUE = 'REVENUE',
  EXPENSE = 'EXPENSE',
  RESERVATION = 'RESERVATION',
  CUSTOM = 'CUSTOM',
}

export enum ModelType {
  MOVING_AVERAGE = 'MOVING_AVERAGE',
  EXPONENTIAL_SMOOTHING = 'EXPONENTIAL_SMOOTHING',
  LINEAR_REGRESSION = 'LINEAR_REGRESSION',
  SEASONAL = 'SEASONAL',
  TIME_SERIES = 'TIME_SERIES',
  AI_ASSISTED = 'AI_ASSISTED',
  HYBRID = 'HYBRID',
}

export enum ForecastStatus {
  DRAFT = 'DRAFT',
  TRAINING = 'TRAINING',
  READY = 'READY',
  PUBLISHED = 'PUBLISHED',
  DEPRECATED = 'DEPRECATED',
  ARCHIVED = 'ARCHIVED',
}

export enum PredictionStatus {
  PENDING = 'PENDING',
  GENERATED = 'GENERATED',
  VALIDATED = 'VALIDATED',
  REJECTED = 'REJECTED',
  EXPIRED = 'EXPIRED',
}
