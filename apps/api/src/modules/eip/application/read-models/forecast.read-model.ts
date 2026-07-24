export interface ForecastDataPoint {
  timestamp: Date;
  projectedValue: number;
  upperBound: number;
  lowerBound: number;
}

export interface ForecastScenario {
  scenarioId: string;
  name: 'Baseline' | 'Optimistic' | 'Pessimistic' | 'Custom';
  dataPoints: ForecastDataPoint[];
}

export interface ForecastSeries {
  forecastId: string;
  type: string;
  period: string;
  horizon: number;
  strategy: string;
  scenarios: ForecastScenario[];
}

export interface ForecastSnapshot {
  forecastId: string;
  type: string;
  generatedAt: Date;
  status: string;
  version: number;
  confidenceScore: number;
  baselineSummaryValue: number;
}

export interface ForecastTrend {
  forecastId: string;
  type: string;
  projectedGrowthPercentage: number;
  trendDirection: 'UP' | 'DOWN' | 'FLAT';
}

export interface ForecastComparison {
  historicalSeriesId: string;
  forecastSeriesId: string;
  historicalData: { timestamp: Date; value: number }[];
  forecastData: ForecastDataPoint[];
}

export interface ForecastAccuracy {
  forecastId: string;
  measuredAt: Date;
  meanAbsoluteError: number;
  meanAbsolutePercentageError: number;
  rootMeanSquareError: number;
  accuracyScore: number;
}
