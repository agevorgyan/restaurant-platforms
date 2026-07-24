import { 
  ForecastSnapshot, 
  ForecastSeries, 
  ForecastAccuracy, 
  ForecastTrend 
} from '../read-models';
import { 
  PredictionPipeline, 
  MovingAverageStrategy, 
  ExponentialSmoothingStrategy, 
  LinearRegressionStrategy 
} from './forecast-strategies.service';

export class ForecastScenarioService {
  public generateScenarios(baselineData: any[]) {
    // Generate Optimistic (baseline * 1.15) and Pessimistic (baseline * 0.85) scenarios
    return [
      {
        scenarioId: crypto.randomUUID(),
        name: 'Baseline' as const,
        dataPoints: baselineData
      },
      {
        scenarioId: crypto.randomUUID(),
        name: 'Optimistic' as const,
        dataPoints: baselineData.map(d => ({ ...d, projectedValue: d.projectedValue * 1.15 }))
      },
      {
        scenarioId: crypto.randomUUID(),
        name: 'Pessimistic' as const,
        dataPoints: baselineData.map(d => ({ ...d, projectedValue: d.projectedValue * 0.85 }))
      }
    ];
  }
}

export class ForecastCalculationService {
  constructor(private readonly scenarioService: ForecastScenarioService) {}

  public async calculateSeries(type: string, horizon: number, strategyType: string): Promise<ForecastSeries> {
    // In a real application, fetch historical data based on 'type'
    const mockHistorical = [100, 115, 110, 125, 130, 145];
    
    let strategy;
    switch (strategyType) {
      case 'LINEAR_REGRESSION': strategy = new LinearRegressionStrategy(); break;
      case 'EXPONENTIAL_SMOOTHING': strategy = new ExponentialSmoothingStrategy(); break;
      case 'MOVING_AVERAGE':
      default: strategy = new MovingAverageStrategy(); break;
    }

    const pipeline = new PredictionPipeline(strategy);
    const baselineData = pipeline.execute(mockHistorical, horizon, new Date());
    const scenarios = this.scenarioService.generateScenarios(baselineData);

    return {
      forecastId: crypto.randomUUID(),
      type,
      period: 'MONTHLY',
      horizon,
      strategy: strategyType,
      scenarios
    };
  }
}

export class ForecastAccuracyService {
  public evaluateAccuracy(forecastSeriesId: string): ForecastAccuracy {
    return {
      forecastId: forecastSeriesId,
      measuredAt: new Date(),
      meanAbsoluteError: 4.5,
      meanAbsolutePercentageError: 0.05,
      rootMeanSquareError: 6.2,
      accuracyScore: 95
    };
  }
}

export class ForecastEngine {
  constructor(
    private readonly calculationService: ForecastCalculationService,
    private readonly accuracyService: ForecastAccuracyService
  ) {}

  public async generateForecast(type: string, horizon: number, strategy: string = 'MOVING_AVERAGE'): Promise<ForecastSnapshot> {
    const series = await this.calculationService.calculateSeries(type, horizon, strategy);
    const baselineData = series.scenarios.find(s => s.name === 'Baseline')?.dataPoints || [];
    const baselineSummary = baselineData.reduce((acc, curr) => acc + curr.projectedValue, 0) / (baselineData.length || 1);

    return {
      forecastId: series.forecastId,
      type,
      generatedAt: new Date(),
      status: 'READY',
      version: 1,
      confidenceScore: 88,
      baselineSummaryValue: baselineSummary
    };
  }
}
