/**
 * Enterprise Forecasting & Predictive Analytics Platform - Domain Exceptions
 *
 * Strongly-typed domain exceptions thrown by forecasting aggregates, value objects, and domain services
 * when invariant violations occur.
 */

export class InvalidForecastModelException extends Error {
  constructor(message: string) {
    super(`[InvalidForecastModelException] ${message}`);
    this.name = 'InvalidForecastModelException';
  }
}

export class InvalidPredictionWindowException extends Error {
  constructor(message: string) {
    super(`[InvalidPredictionWindowException] ${message}`);
    this.name = 'InvalidPredictionWindowException';
  }
}

export class ImmutablePredictionHistoryException extends Error {
  constructor(predictionId: string) {
    super(`[ImmutablePredictionHistoryException] Prediction record '${predictionId}' is immutable and cannot be overwritten.`);
    this.name = 'ImmutablePredictionHistoryException';
  }
}

export class ForecastNotFoundException extends Error {
  constructor(id: string) {
    super(`[ForecastNotFoundException] Forecast definition with ID '${id}' was not found.`);
    this.name = 'ForecastNotFoundException';
  }
}

export class UnauthorizedForecastAccessException extends Error {
  constructor(tenantId: string, forecastId: string) {
    super(`[UnauthorizedForecastAccessException] Tenant '${tenantId}' does not have access to forecast '${forecastId}'.`);
    this.name = 'UnauthorizedForecastAccessException';
  }
}
