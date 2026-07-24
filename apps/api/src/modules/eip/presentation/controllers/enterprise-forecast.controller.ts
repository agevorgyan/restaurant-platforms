import { Controller, Get, Post, Param, Query, Body } from '@nestjs/common';
import { 
  ForecastSnapshot, 
  ForecastSeries, 
  ForecastAccuracy,
  ForecastScenario
} from '../../application/read-models';
import { ForecastEngine, ForecastAccuracyService, ForecastCalculationService } from '../../application/services';

@Controller('enterprise/forecast')
export class EnterpriseForecastController {
  constructor(
    private readonly forecastEngine: ForecastEngine,
    private readonly accuracyService: ForecastAccuracyService,
    private readonly calculationService: ForecastCalculationService
  ) {}

  @Get()
  async getGlobalForecasts(@Query('horizon') horizon: number = 12): Promise<ForecastSnapshot[]> {
    const types = ['REVENUE', 'SALES', 'LABOR_DEMAND', 'INVENTORY_DEMAND'];
    return Promise.all(types.map(t => this.forecastEngine.generateForecast(t, horizon)));
  }

  @Get('accuracy')
  async getForecastAccuracy(@Query('forecastId') forecastId: string): Promise<ForecastAccuracy> {
    return this.accuracyService.evaluateAccuracy(forecastId || 'default-id');
  }

  @Get(':type')
  async getForecastByType(
    @Param('type') type: string, 
    @Query('horizon') horizon: number = 12
  ): Promise<ForecastSnapshot> {
    return this.forecastEngine.generateForecast(type.toUpperCase(), horizon);
  }

  @Get('scenarios/:type')
  async getForecastScenarios(
    @Param('type') type: string,
    @Query('horizon') horizon: number = 12,
    @Query('strategy') strategy: string = 'MOVING_AVERAGE'
  ): Promise<ForecastScenario[]> {
    const series = await this.calculationService.calculateSeries(type.toUpperCase(), horizon, strategy);
    return series.scenarios;
  }

  @Post('recalculate')
  async recalculateForecast(
    @Body() payload: { type: string, horizon: number, strategy: string }
  ): Promise<ForecastSnapshot> {
    return this.forecastEngine.generateForecast(payload.type, payload.horizon, payload.strategy);
  }
}
