import { ForecastDataPoint } from '../read-models';

export interface IPredictionStrategy {
  calculate(historicalData: number[], horizon: number): number[];
  getStrategyName(): string;
}

export class MovingAverageStrategy implements IPredictionStrategy {
  constructor(private readonly windowSize: number = 3) {}

  public calculate(historicalData: number[], horizon: number): number[] {
    const results: number[] = [];
    const data = [...historicalData];

    for (let i = 0; i < horizon; i++) {
      const window = data.slice(-this.windowSize);
      const average = window.length > 0 ? window.reduce((a, b) => a + b, 0) / window.length : 0;
      results.push(average);
      data.push(average); // feed prediction back for subsequent horizons
    }
    return results;
  }

  public getStrategyName(): string {
    return 'MOVING_AVERAGE';
  }
}

export class ExponentialSmoothingStrategy implements IPredictionStrategy {
  constructor(private readonly alpha: number = 0.3) {}

  public calculate(historicalData: number[], horizon: number): number[] {
    const results: number[] = [];
    if (historicalData.length === 0) return Array(horizon).fill(0);

    let smoothed = historicalData[0];
    for (let i = 1; i < historicalData.length; i++) {
      smoothed = this.alpha * historicalData[i] + (1 - this.alpha) * smoothed;
    }

    // Simple exponential smoothing forecasts flat lines for future periods
    for (let i = 0; i < horizon; i++) {
      results.push(smoothed);
    }
    return results;
  }

  public getStrategyName(): string {
    return 'EXPONENTIAL_SMOOTHING';
  }
}

export class LinearRegressionStrategy implements IPredictionStrategy {
  public calculate(historicalData: number[], horizon: number): number[] {
    const n = historicalData.length;
    if (n === 0) return Array(horizon).fill(0);

    let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
    for (let i = 0; i < n; i++) {
      sumX += i;
      sumY += historicalData[i];
      sumXY += i * historicalData[i];
      sumXX += i * i;
    }

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX) || 0;
    const intercept = (sumY - slope * sumX) / n || 0;

    const results: number[] = [];
    for (let i = 0; i < horizon; i++) {
      results.push(intercept + slope * (n + i));
    }
    return results;
  }

  public getStrategyName(): string {
    return 'LINEAR_REGRESSION';
  }
}

export class PredictionPipeline {
  constructor(private readonly strategy: IPredictionStrategy) {}

  public execute(historicalData: number[], horizon: number, startDate: Date): ForecastDataPoint[] {
    const predictions = this.strategy.calculate(historicalData, horizon);
    
    return predictions.map((val, idx) => {
      const timestamp = new Date(startDate);
      timestamp.setMonth(timestamp.getMonth() + idx + 1); // Mocking monthly increments

      // Simplified variance mapping for bounds
      const variance = val * 0.1; // 10% variance bound
      return {
        timestamp,
        projectedValue: val,
        upperBound: val + variance,
        lowerBound: val - variance
      };
    });
  }
}
